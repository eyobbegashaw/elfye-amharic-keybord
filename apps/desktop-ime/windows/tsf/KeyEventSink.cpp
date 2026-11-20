#include "TextService.hpp"

STDMETHODIMP CTextService::OnSetFocus(BOOL fForeground) {
    (void)fForeground;
    return S_OK;
}

static bool IsModifierKeyDown() {
    return (GetKeyState(VK_CONTROL) & 0x8000) || (GetKeyState(VK_MENU) & 0x8000);
}

static bool IsCtrlSpace(WPARAM wParam) {
    return (wParam == VK_SPACE) && (GetKeyState(VK_CONTROL) & 0x8000);
}

static wchar_t GetCharFromVKey(WPARAM wParam) {
    BYTE kbdState[256];
    if (!GetKeyboardState(kbdState)) return 0;

    // Remove Ctrl/Alt state for regular char translation
    kbdState[VK_CONTROL] = 0;
    kbdState[VK_MENU] = 0;

    WCHAR ch = 0;
    UINT scanCode = MapVirtualKeyW((UINT)wParam, MAPVK_VK_TO_VSC);
    int res = ToUnicode((UINT)wParam, scanCode, kbdState, &ch, 1, 0);
    return (res == 1) ? ch : 0;
}

STDMETHODIMP CTextService::OnTestKeyDown(ITfContext* pic, WPARAM wParam, LPARAM lParam, BOOL* pfEaten) {
    (void)pic;
    (void)lParam;
    if (!pfEaten) return E_INVALIDARG;
    *pfEaten = FALSE;

    if (IsCtrlSpace(wParam)) {
        *pfEaten = TRUE;
        return S_OK;
    }

    if (!m_enabled) {
        *pfEaten = FALSE;
        return S_OK;
    }

    // Ctrl/Alt combinations pass through
    if (IsModifierKeyDown()) {
        *pfEaten = FALSE;
        return S_OK;
    }

    if (wParam == VK_BACK) {
        if (m_engine.IsComposing()) {
            *pfEaten = TRUE;
        }
        return S_OK;
    }

    if (wParam == VK_RETURN || wParam == VK_TAB || wParam == VK_ESCAPE ||
        wParam == VK_LEFT || wParam == VK_RIGHT || wParam == VK_UP || wParam == VK_DOWN) {
        // We eat only to commit on keydown; return FALSE so host receives key
        *pfEaten = FALSE;
        return S_OK;
    }

    wchar_t ch = GetCharFromVKey(wParam);
    if (ch >= 32) {
        *pfEaten = TRUE;
        return S_OK;
    }

    return S_OK;
}

STDMETHODIMP CTextService::OnKeyDown(ITfContext* pic, WPARAM wParam, LPARAM lParam, BOOL* pfEaten) {
    (void)lParam;
    if (!pfEaten) return E_INVALIDARG;
    *pfEaten = FALSE;

    // Hotkey: Ctrl+Space toggles Amharic / English
    if (IsCtrlSpace(wParam)) {
        if (m_engine.IsComposing()) {
            CommitComposedText(pic, m_engine.CommitCurrentW());
        }
        ToggleEnabled();
        *pfEaten = TRUE;
        return S_OK;
    }

    if (!m_enabled) {
        *pfEaten = FALSE;
        return S_OK;
    }

    // If Ctrl or Alt is held (shortcuts like Ctrl+C, Ctrl+V), pass through
    if (IsModifierKeyDown()) {
        if (m_engine.IsComposing()) {
            CommitComposedText(pic, m_engine.CommitCurrentW());
        }
        *pfEaten = FALSE;
        return S_OK;
    }

    // Progressive backspace
    if (wParam == VK_BACK) {
        if (m_engine.IsComposing()) {
            auto b = m_engine.BackspaceW();
            if (b.composing.empty()) {
                EndComposition(pic);
            } else {
                UpdatePreedit(pic, b.composing);
            }
            *pfEaten = TRUE;
            return S_OK;
        }
        *pfEaten = FALSE;
        return S_OK;
    }

    // Navigation and commit keys: commit composing text and pass through
    if (wParam == VK_RETURN || wParam == VK_TAB || wParam == VK_ESCAPE ||
        wParam == VK_LEFT || wParam == VK_RIGHT || wParam == VK_UP || wParam == VK_DOWN) {
        if (m_engine.IsComposing()) {
            CommitComposedText(pic, m_engine.CommitCurrentW());
        }
        *pfEaten = FALSE;
        return S_OK;
    }

    // Printable character input
    wchar_t ch = GetCharFromVKey(wParam);
    if (ch >= 32) {
        auto res = m_engine.InputW(ch);

        if (!res.committed.empty()) {
            if (res.composing.empty()) {
                CommitComposedText(pic, res.committed);
            } else {
                // If there's committed and also composing, commit the prefix and update preedit
                CommitComposedText(pic, res.committed);
                UpdatePreedit(pic, res.composing);
            }
        } else if (!res.composing.empty()) {
            UpdatePreedit(pic, res.composing);
        } else {
            EndComposition(pic);
        }

        *pfEaten = TRUE;
        return S_OK;
    }

    *pfEaten = FALSE;
    return S_OK;
}

STDMETHODIMP CTextService::OnTestKeyUp(ITfContext* pic, WPARAM wParam, LPARAM lParam, BOOL* pfEaten) {
    (void)pic;
    (void)wParam;
    (void)lParam;
    if (!pfEaten) return E_INVALIDARG;
    *pfEaten = FALSE;
    return S_OK;
}

STDMETHODIMP CTextService::OnKeyUp(ITfContext* pic, WPARAM wParam, LPARAM lParam, BOOL* pfEaten) {
    (void)pic;
    (void)wParam;
    (void)lParam;
    if (!pfEaten) return E_INVALIDARG;
    *pfEaten = FALSE;
    return S_OK;
}

STDMETHODIMP CTextService::OnPreservedKey(ITfContext* pic, REFGUID rguid, BOOL* pfEaten) {
    (void)pic;
    (void)rguid;
    if (!pfEaten) return E_INVALIDARG;
    *pfEaten = FALSE;
    return S_OK;
}
