package com.elfye.keyboard.ime;

import android.content.Context;
import android.inputmethodservice.InputMethodService;
import android.os.Build;
import android.text.InputType;
import android.view.KeyEvent;
import android.view.View;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputConnection;
import android.view.inputmethod.InputMethodManager;

import com.elfye.keyboard.core.EngineResult;
import com.elfye.keyboard.core.LiveTypingEngine;

/**
 * System-wide Android InputMethodService for Elfye Amharic Phonetic Keyboard (Addiyon).
 * Works across all Android apps (WhatsApp, Telegram, Chrome, Messages, etc.).
 */
public class ElfyeInputMethodService extends InputMethodService implements KeyboardView.KeyboardListener {

    private final LiveTypingEngine engine = new LiveTypingEngine();
    private KeyboardView keyboardView;
    private boolean amharicEnabled = true;
    private boolean forceEnglishForField = false;

    @Override
    public View onCreateInputView() {
        keyboardView = new KeyboardView(this, this);
        keyboardView.setAmharicEnabled(amharicEnabled && !forceEnglishForField);
        return keyboardView;
    }

    @Override
    public void onStartInput(EditorInfo attribute, boolean restarting) {
        super.onStartInput(attribute, restarting);
        engine.reset();
        forceEnglishForField = shouldForceEnglish(attribute);
        if (keyboardView != null) {
            keyboardView.setAmharicEnabled(amharicEnabled && !forceEnglishForField);
            keyboardView.updateReturnKeyLabel(attribute);
        }
    }

    @Override
    public void onFinishInput() {
        super.onFinishInput();
        engine.reset();
    }

    @Override
    public void onUpdateSelection(
            int oldSelStart, int oldSelEnd,
            int newSelStart, int newSelEnd,
            int candidatesStart, int candidatesEnd) {
        super.onUpdateSelection(oldSelStart, oldSelEnd, newSelStart, newSelEnd, candidatesStart, candidatesEnd);

        // If cursor moved outside active composing span, reset buffer cleanly
        if (engine.isComposing() && (candidatesStart == -1 || newSelStart < candidatesStart || newSelStart > candidatesEnd)) {
            InputConnection ic = getCurrentInputConnection();
            if (ic != null) {
                ic.finishComposingText();
            }
            engine.reset();
        }
    }

    @Override
    public void onCharacter(char ch) {
        InputConnection ic = getCurrentInputConnection();
        if (ic == null) return;

        if (!amharicEnabled || forceEnglishForField) {
            ic.commitText(String.valueOf(ch), 1);
            return;
        }

        EngineResult res = engine.input(ch);
        ic.beginBatchEdit();
        try {
            if (!res.committed.isEmpty()) {
                ic.commitText(res.committed, 1);
            }
            if (!res.composing.isEmpty()) {
                ic.setComposingText(res.composing, 1);
            } else if (res.committed.isEmpty()) {
                ic.finishComposingText();
            }
        } finally {
            ic.endBatchEdit();
        }
    }

    @Override
    public void onBackspace() {
        InputConnection ic = getCurrentInputConnection();
        if (ic == null) return;

        if (amharicEnabled && !forceEnglishForField && engine.isComposing()) {
            EngineResult res = engine.backspace();
            if (!res.composing.isEmpty()) {
                ic.setComposingText(res.composing, 1);
            } else {
                ic.setComposingText("", 1);
                ic.finishComposingText();
            }
            return;
        }

        // Standard deletion outside active composition
        CharSequence selected = ic.getSelectedText(0);
        if (selected != null && selected.length() > 0) {
            ic.commitText("", 1);
        } else {
            ic.deleteSurroundingText(1, 0);
        }
    }

    @Override
    public void onSpace() {
        onCharacter(' ');
    }

    @Override
    public void onEnter() {
        InputConnection ic = getCurrentInputConnection();
        if (ic == null) return;

        if (engine.isComposing()) {
            String pending = engine.commitCurrent();
            if (!pending.isEmpty()) {
                ic.commitText(pending, 1);
            }
        }

        EditorInfo ei = getCurrentInputEditorInfo();
        int action = ei != null ? (ei.imeOptions & EditorInfo.IME_MASK_ACTION) : EditorInfo.IME_ACTION_NONE;
        if (action != EditorInfo.IME_ACTION_NONE && action != EditorInfo.IME_ACTION_UNSPECIFIED) {
            ic.performEditorAction(action);
        } else {
            sendDownUpKeyEvents(KeyEvent.KEYCODE_ENTER);
        }
    }

    @Override
    public void onToggleLanguage() {
        InputConnection ic = getCurrentInputConnection();
        if (ic != null && engine.isComposing()) {
            String pending = engine.commitCurrent();
            if (!pending.isEmpty()) {
                ic.commitText(pending, 1);
            }
        }
        amharicEnabled = !amharicEnabled;
        if (keyboardView != null) {
            keyboardView.setAmharicEnabled(amharicEnabled && !forceEnglishForField);
        }
    }

    @Override
    public void onSwitchInputMethod() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            switchToNextInputMethod(false);
        } else {
            InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
            if (imm != null) {
                imm.showInputMethodPicker();
            }
        }
    }

    private boolean shouldForceEnglish(EditorInfo info) {
        if (info == null) return false;
        int inputClass = info.inputType & InputType.TYPE_MASK_CLASS;
        if (inputClass == InputType.TYPE_CLASS_NUMBER
                || inputClass == InputType.TYPE_CLASS_PHONE
                || inputClass == InputType.TYPE_CLASS_DATETIME) {
            return true;
        }
        int variation = info.inputType & InputType.TYPE_MASK_VARIATION;
        return variation == InputType.TYPE_TEXT_VARIATION_PASSWORD
                || variation == InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD
                || variation == InputType.TYPE_TEXT_VARIATION_WEB_PASSWORD
                || variation == InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS
                || variation == InputType.TYPE_TEXT_VARIATION_WEB_EMAIL_ADDRESS
                || variation == InputType.TYPE_TEXT_VARIATION_URI;
    }
}
