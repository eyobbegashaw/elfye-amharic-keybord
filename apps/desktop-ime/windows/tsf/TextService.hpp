#pragma once

#include <windows.h>
#include <msctf.h>
#include <string>
#include "Globals.hpp"
#include "../core/AmharicCore.hpp"

class CTextService : public ITfTextInputProcessorEx,
                     public ITfKeyEventSink,
                     public ITfCompositionSink,
                     public ITfThreadFocusSink {
public:
    CTextService();
    virtual ~CTextService();

    // IUnknown
    STDMETHODIMP QueryInterface(REFIID riid, void** ppvObj) override;
    STDMETHODIMP_(ULONG) AddRef() override;
    STDMETHODIMP_(ULONG) Release() override;

    // ITfTextInputProcessor
    STDMETHODIMP Activate(ITfThreadMgr* ptim, TfClientId tid) override;
    STDMETHODIMP Deactivate() override;

    // ITfTextInputProcessorEx
    STDMETHODIMP ActivateEx(ITfThreadMgr* ptim, TfClientId tid, DWORD dwFlags) override;

    // ITfKeyEventSink
    STDMETHODIMP OnSetFocus(BOOL fForeground) override;
    STDMETHODIMP OnTestKeyDown(ITfContext* pic, WPARAM wParam, LPARAM lParam, BOOL* pfEaten) override;
    STDMETHODIMP OnTestKeyUp(ITfContext* pic, WPARAM wParam, LPARAM lParam, BOOL* pfEaten) override;
    STDMETHODIMP OnKeyDown(ITfContext* pic, WPARAM wParam, LPARAM lParam, BOOL* pfEaten) override;
    STDMETHODIMP OnKeyUp(ITfContext* pic, WPARAM wParam, LPARAM lParam, BOOL* pfEaten) override;
    STDMETHODIMP OnPreservedKey(ITfContext* pic, REFGUID rguid, BOOL* pfEaten) override;

    // ITfCompositionSink
    STDMETHODIMP OnCompositionTerminated(TfEditCookie ecWrite, ITfComposition* pComposition) override;

    // ITfThreadFocusSink
    STDMETHODIMP OnSetThreadFocus() override;
    STDMETHODIMP OnKillThreadFocus() override;

    // Internal composition & IME helpers
    HRESULT StartComposition(ITfContext* pContext);
    HRESULT EndComposition(ITfContext* pContext);
    HRESULT UpdatePreedit(ITfContext* pContext, const std::wstring& text);
    HRESULT CommitComposedText(ITfContext* pContext, const std::wstring& text);
    void TerminateInternalComposition();

    bool IsComposing() const { return m_pComposition != nullptr; }
    ITfComposition* GetComposition() const { return m_pComposition; }
    void SetComposition(ITfComposition* pComp) { m_pComposition = pComp; }

    TfClientId GetClientId() const { return m_tfClientId; }
    ITfThreadMgr* GetThreadMgr() const { return m_pThreadMgr; }
    Amharic::LiveTypingEngine& GetEngine() { return m_engine; }

    bool IsEnabled() const { return m_enabled; }
    void ToggleEnabled() { m_enabled = !m_enabled; }

private:
    LONG m_cRef;
    ITfThreadMgr* m_pThreadMgr;
    TfClientId m_tfClientId;
    DWORD m_dwKeyEventSinkCookie;
    DWORD m_dwThreadFocusCookie;

    ITfComposition* m_pComposition;
    Amharic::LiveTypingEngine m_engine;
    bool m_enabled;

    BOOL InitKeyEventSink();
    void UninitKeyEventSink();
    BOOL InitThreadFocusSink();
    void UninitThreadFocusSink();
};
