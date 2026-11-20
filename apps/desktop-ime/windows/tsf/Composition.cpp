#include "TextService.hpp"
#include <msctf.h>

enum class EditSessionAction {
    StartComposition,
    UpdatePreedit,
    CommitText,
    EndComposition
};

class CEditSession : public ITfEditSession {
public:
    CEditSession(CTextService* pService, ITfContext* pContext, EditSessionAction action, std::wstring text = L"")
        : m_cRef(1),
          m_pService(pService),
          m_pContext(pContext),
          m_action(action),
          m_text(std::move(text)) {
        m_pService->AddRef();
        m_pContext->AddRef();
    }

    virtual ~CEditSession() {
        m_pService->Release();
        m_pContext->Release();
    }

    // IUnknown
    STDMETHODIMP QueryInterface(REFIID riid, void** ppvObj) override {
        if (!ppvObj) return E_INVALIDARG;
        *ppvObj = nullptr;
        if (IsEqualIID(riid, IID_IUnknown) || IsEqualIID(riid, IID_ITfEditSession)) {
            *ppvObj = static_cast<ITfEditSession*>(this);
            AddRef();
            return S_OK;
        }
        return E_NOINTERFACE;
    }

    STDMETHODIMP_(ULONG) AddRef() override {
        return InterlockedIncrement(&m_cRef);
    }

    STDMETHODIMP_(ULONG) Release() override {
        LONG cRef = InterlockedDecrement(&m_cRef);
        if (cRef == 0) delete this;
        return cRef;
    }

    // ITfEditSession
    STDMETHODIMP DoEditSession(TfEditCookie ec) override {
        switch (m_action) {
            case EditSessionAction::StartComposition:
                return DoStartComposition(ec);
            case EditSessionAction::UpdatePreedit:
                return DoUpdatePreedit(ec);
            case EditSessionAction::CommitText:
                return DoCommitText(ec);
            case EditSessionAction::EndComposition:
                return DoEndComposition(ec);
            default:
                return E_UNEXPECTED;
        }
    }

private:
    LONG m_cRef;
    CTextService* m_pService;
    ITfContext* m_pContext;
    EditSessionAction m_action;
    std::wstring m_text;

    HRESULT DoStartComposition(TfEditCookie ec) {
        if (m_pService->IsComposing()) {
            return S_OK; // already composing
        }

        ITfContextComposition* pContextComp = nullptr;
        if (FAILED(m_pContext->QueryInterface(IID_ITfContextComposition, (void**)&pContextComp))) {
            return E_FAIL;
        }

        TF_SELECTION sel;
        ULONG cFetched = 0;
        if (FAILED(m_pContext->GetSelection(ec, TF_DEFAULT_SELECTION, 1, &sel, &cFetched)) || cFetched == 0) {
            pContextComp->Release();
            return E_FAIL;
        }

        ITfComposition* pComposition = nullptr;
        HRESULT hr = pContextComp->StartComposition(ec, sel.range, static_cast<ITfCompositionSink*>(m_pService), &pComposition);
        if (SUCCEEDED(hr) && pComposition) {
            m_pService->SetComposition(pComposition);
        }

        sel.range->Release();
        pContextComp->Release();
        return hr;
    }

    HRESULT DoUpdatePreedit(TfEditCookie ec) {
        ITfComposition* pComp = m_pService->GetComposition();
        if (!pComp) {
            // If no composition, start one first
            HRESULT hr = DoStartComposition(ec);
            if (FAILED(hr)) return hr;
            pComp = m_pService->GetComposition();
            if (!pComp) return E_FAIL;
        }

        ITfRange* pRange = nullptr;
        if (FAILED(pComp->GetRange(&pRange)) || !pRange) {
            return E_FAIL;
        }

        // Set composing text
        pRange->SetText(ec, 0, m_text.c_str(), static_cast<LONG>(m_text.length()));

        // Collapse range to end and update selection/caret
        pRange->Collapse(ec, TF_ANCHOR_END);
        TF_SELECTION sel;
        sel.range = pRange;
        sel.style.ase = TF_AE_NONE;
        sel.style.fInterimChar = FALSE;
        m_pContext->SetSelection(ec, 1, &sel);

        pRange->Release();
        return S_OK;
    }

    HRESULT DoCommitText(TfEditCookie ec) {
        ITfComposition* pComp = m_pService->GetComposition();
        if (pComp) {
            ITfRange* pRange = nullptr;
            if (SUCCEEDED(pComp->GetRange(&pRange)) && pRange) {
                pRange->SetText(ec, 0, m_text.c_str(), static_cast<LONG>(m_text.length()));
                pRange->Collapse(ec, TF_ANCHOR_END);

                TF_SELECTION sel;
                sel.range = pRange;
                sel.style.ase = TF_AE_NONE;
                sel.style.fInterimChar = FALSE;
                m_pContext->SetSelection(ec, 1, &sel);
                pRange->Release();
            }

            pComp->EndComposition(ec);
            pComp->Release();
            m_pService->SetComposition(nullptr);
        } else {
            // Direct insertion without existing composition
            TF_SELECTION sel;
            ULONG cFetched = 0;
            if (SUCCEEDED(m_pContext->GetSelection(ec, TF_DEFAULT_SELECTION, 1, &sel, &cFetched)) && cFetched > 0) {
                sel.range->SetText(ec, 0, m_text.c_str(), static_cast<LONG>(m_text.length()));
                sel.range->Collapse(ec, TF_ANCHOR_END);
                m_pContext->SetSelection(ec, 1, &sel);
                sel.range->Release();
            }
        }
        return S_OK;
    }

    HRESULT DoEndComposition(TfEditCookie ec) {
        ITfComposition* pComp = m_pService->GetComposition();
        if (pComp) {
            pComp->EndComposition(ec);
            pComp->Release();
            m_pService->SetComposition(nullptr);
        }
        return S_OK;
    }
};

HRESULT CTextService::StartComposition(ITfContext* pContext) {
    if (!pContext) return E_INVALIDARG;
    CEditSession* pSession = new CEditSession(this, pContext, EditSessionAction::StartComposition);
    if (!pSession) return E_OUTOFMEMORY;

    HRESULT hr = S_OK;
    HRESULT hrSession = pContext->RequestEditSession(m_tfClientId, pSession, TF_ES_SYNC | TF_ES_READWRITE, &hr);
    pSession->Release();
    return SUCCEEDED(hrSession) ? hr : hrSession;
}

HRESULT CTextService::UpdatePreedit(ITfContext* pContext, const std::wstring& text) {
    if (!pContext) return E_INVALIDARG;
    CEditSession* pSession = new CEditSession(this, pContext, EditSessionAction::UpdatePreedit, text);
    if (!pSession) return E_OUTOFMEMORY;

    HRESULT hr = S_OK;
    HRESULT hrSession = pContext->RequestEditSession(m_tfClientId, pSession, TF_ES_SYNC | TF_ES_READWRITE, &hr);
    pSession->Release();
    return SUCCEEDED(hrSession) ? hr : hrSession;
}

HRESULT CTextService::CommitComposedText(ITfContext* pContext, const std::wstring& text) {
    if (!pContext) return E_INVALIDARG;
    CEditSession* pSession = new CEditSession(this, pContext, EditSessionAction::CommitText, text);
    if (!pSession) return E_OUTOFMEMORY;

    HRESULT hr = S_OK;
    HRESULT hrSession = pContext->RequestEditSession(m_tfClientId, pSession, TF_ES_SYNC | TF_ES_READWRITE, &hr);
    pSession->Release();
    return SUCCEEDED(hrSession) ? hr : hrSession;
}

HRESULT CTextService::EndComposition(ITfContext* pContext) {
    if (!pContext) return E_INVALIDARG;
    CEditSession* pSession = new CEditSession(this, pContext, EditSessionAction::EndComposition);
    if (!pSession) return E_OUTOFMEMORY;

    HRESULT hr = S_OK;
    HRESULT hrSession = pContext->RequestEditSession(m_tfClientId, pSession, TF_ES_SYNC | TF_ES_READWRITE, &hr);
    pSession->Release();
    return SUCCEEDED(hrSession) ? hr : hrSession;
}

STDMETHODIMP CTextService::OnCompositionTerminated(TfEditCookie ecWrite, ITfComposition* pComposition) {
    (void)ecWrite;
    if (m_pComposition && m_pComposition == pComposition) {
        m_pComposition->Release();
        m_pComposition = nullptr;
    }
    m_engine.Reset();
    return S_OK;
}

void CTextService::TerminateInternalComposition() {
    if (m_pComposition) {
        m_pComposition->Release();
        m_pComposition = nullptr;
    }
    m_engine.Reset();
}
