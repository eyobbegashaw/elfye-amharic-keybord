#include "TextService.hpp"

CTextService::CTextService()
    : m_cRef(1),
      m_pThreadMgr(nullptr),
      m_tfClientId(TF_CLIENTID_NULL),
      m_dwKeyEventSinkCookie(TF_INVALID_COOKIE),
      m_dwThreadFocusCookie(TF_INVALID_COOKIE),
      m_pComposition(nullptr),
      m_enabled(true) {
    DllAddRef();
}

CTextService::~CTextService() {
    DllRelease();
}

STDMETHODIMP CTextService::QueryInterface(REFIID riid, void** ppvObj) {
    if (!ppvObj) return E_INVALIDARG;
    *ppvObj = nullptr;

    if (IsEqualIID(riid, IID_IUnknown) ||
        IsEqualIID(riid, IID_ITfTextInputProcessor) ||
        IsEqualIID(riid, IID_ITfTextInputProcessorEx)) {
        *ppvObj = static_cast<ITfTextInputProcessorEx*>(this);
    } else if (IsEqualIID(riid, IID_ITfKeyEventSink)) {
        *ppvObj = static_cast<ITfKeyEventSink*>(this);
    } else if (IsEqualIID(riid, IID_ITfCompositionSink)) {
        *ppvObj = static_cast<ITfCompositionSink*>(this);
    } else if (IsEqualIID(riid, IID_ITfThreadFocusSink)) {
        *ppvObj = static_cast<ITfThreadFocusSink*>(this);
    }

    if (*ppvObj) {
        AddRef();
        return S_OK;
    }

    return E_NOINTERFACE;
}

STDMETHODIMP_(ULONG) CTextService::AddRef() {
    return InterlockedIncrement(&m_cRef);
}

STDMETHODIMP_(ULONG) CTextService::Release() {
    LONG cRef = InterlockedDecrement(&m_cRef);
    if (cRef == 0) {
        delete this;
    }
    return cRef;
}

STDMETHODIMP CTextService::Activate(ITfThreadMgr* ptim, TfClientId tid) {
    return ActivateEx(ptim, tid, 0);
}

STDMETHODIMP CTextService::ActivateEx(ITfThreadMgr* ptim, TfClientId tid, DWORD dwFlags) {
    (void)dwFlags;
    if (!ptim) return E_INVALIDARG;

    m_pThreadMgr = ptim;
    m_pThreadMgr->AddRef();
    m_tfClientId = tid;

    if (!InitKeyEventSink()) {
        Deactivate();
        return E_FAIL;
    }

    if (!InitThreadFocusSink()) {
        Deactivate();
        return E_FAIL;
    }

    return S_OK;
}

STDMETHODIMP CTextService::Deactivate() {
    TerminateInternalComposition();
    UninitThreadFocusSink();
    UninitKeyEventSink();

    if (m_pThreadMgr) {
        m_pThreadMgr->Release();
        m_pThreadMgr = nullptr;
    }

    m_tfClientId = TF_CLIENTID_NULL;
    return S_OK;
}

BOOL CTextService::InitKeyEventSink() {
    if (!m_pThreadMgr) return FALSE;

    ITfKeystrokeMgr* pKeystrokeMgr = nullptr;
    if (FAILED(m_pThreadMgr->QueryInterface(IID_ITfKeystrokeMgr, (void**)&pKeystrokeMgr))) {
        return FALSE;
    }

    HRESULT hr = pKeystrokeMgr->AdviseKeyEventSink(m_tfClientId, static_cast<ITfKeyEventSink*>(this), TRUE);
    pKeystrokeMgr->Release();
    return SUCCEEDED(hr);
}

void CTextService::UninitKeyEventSink() {
    if (!m_pThreadMgr) return;

    ITfKeystrokeMgr* pKeystrokeMgr = nullptr;
    if (SUCCEEDED(m_pThreadMgr->QueryInterface(IID_ITfKeystrokeMgr, (void**)&pKeystrokeMgr))) {
        pKeystrokeMgr->UnadviseKeyEventSink(m_tfClientId);
        pKeystrokeMgr->Release();
    }
}

BOOL CTextService::InitThreadFocusSink() {
    if (!m_pThreadMgr) return FALSE;

    ITfSource* pSource = nullptr;
    if (FAILED(m_pThreadMgr->QueryInterface(IID_ITfSource, (void**)&pSource))) {
        return FALSE;
    }

    HRESULT hr = pSource->AdviseSink(IID_ITfThreadFocusSink, static_cast<ITfThreadFocusSink*>(this), &m_dwThreadFocusCookie);
    pSource->Release();
    return SUCCEEDED(hr);
}

void CTextService::UninitThreadFocusSink() {
    if (!m_pThreadMgr || m_dwThreadFocusCookie == TF_INVALID_COOKIE) return;

    ITfSource* pSource = nullptr;
    if (SUCCEEDED(m_pThreadMgr->QueryInterface(IID_ITfSource, (void**)&pSource))) {
        pSource->UnadviseSink(m_dwThreadFocusCookie);
        pSource->Release();
        m_dwThreadFocusCookie = TF_INVALID_COOKIE;
    }
}

STDMETHODIMP CTextService::OnSetThreadFocus() {
    return S_OK;
}

STDMETHODIMP CTextService::OnKillThreadFocus() {
    // End active composition on focus loss
    TerminateInternalComposition();
    return S_OK;
}
