package com.elfye.keyboard.ime;

import android.content.Context;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.os.Handler;
import android.os.Looper;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.View;
import android.view.inputmethod.EditorInfo;
import android.widget.Button;
import android.widget.LinearLayout;

/**
 * Native Android keyboard view with QWERTY, Shift/Caps-Lock, 123/Symbols layers,
 * long-press Backspace repeat, Globe switcher, and EN/አማ language toggle.
 */
public class KeyboardView extends LinearLayout {

    public interface KeyboardListener {
        void onCharacter(char ch);
        void onBackspace();
        void onSpace();
        void onEnter();
        void onToggleLanguage();
        void onSwitchInputMethod();
    }

    private enum Layer { QWERTY, NUMBERS, SYMBOLS }
    private enum ShiftState { OFF, SINGLE, CAPS_LOCK }

    private static final String[] QWERTY_ROW1 = {"q","w","e","r","t","y","u","i","o","p"};
    private static final String[] QWERTY_ROW2 = {"a","s","d","f","g","h","j","k","l"};
    private static final String[] QWERTY_ROW3 = {"z","x","c","v","b","n","m"};

    private static final String[] NUM_ROW1 = {"1","2","3","4","5","6","7","8","9","0"};
    private static final String[] NUM_ROW2 = {"-","/",":",";","(",")","$","&","@","\""};
    private static final String[] NUM_ROW3 = {".",",","?","!","'"};

    private static final String[] SYM_ROW1 = {"[","]","{","}","#","%","^","*","+","="};
    private static final String[] SYM_ROW2 = {"_","\\","|","~","<",">","€","£","¥","•"};
    private static final String[] SYM_ROW3 = {".",",","?","!","'"};

    private final KeyboardListener listener;
    private Layer currentLayer = Layer.QWERTY;
    private ShiftState shiftState = ShiftState.OFF;
    private boolean amharicEnabled = true;
    private String returnLabel = "⏎";

    private final Handler repeatHandler = new Handler(Looper.getMainLooper());
    private final Runnable backspaceRepeater = new Runnable() {
        @Override
        public void run() {
            listener.onBackspace();
            repeatHandler.postDelayed(this, 65);
        }
    };

    public KeyboardView(Context context, KeyboardListener listener) {
        super(context);
        this.listener = listener;
        setOrientation(VERTICAL);
        setBackgroundColor(Color.parseColor("#0F172A"));
        int pad = dp(6);
        setPadding(pad, dp(8), pad, dp(10));
        rebuildLayout();
    }

    public void setAmharicEnabled(boolean enabled) {
        this.amharicEnabled = enabled;
        rebuildLayout();
    }

    public void updateReturnKeyLabel(EditorInfo info) {
        if (info == null) {
            returnLabel = "⏎";
        } else {
            int action = info.imeOptions & EditorInfo.IME_MASK_ACTION;
            switch (action) {
                case EditorInfo.IME_ACTION_SEARCH:
                    returnLabel = "Search";
                    break;
                case EditorInfo.IME_ACTION_SEND:
                    returnLabel = "Send";
                    break;
                case EditorInfo.IME_ACTION_GO:
                    returnLabel = "Go";
                    break;
                case EditorInfo.IME_ACTION_DONE:
                    returnLabel = "Done";
                    break;
                default:
                    returnLabel = "⏎";
            }
        }
        rebuildLayout();
    }

    private void rebuildLayout() {
        removeAllViews();

        if (currentLayer == Layer.QWERTY) {
            addView(buildCharRow(QWERTY_ROW1, true));
            addView(buildCharRow(QWERTY_ROW2, true));
            addView(buildQwertyRow3());
        } else if (currentLayer == Layer.NUMBERS) {
            addView(buildCharRow(NUM_ROW1, false));
            addView(buildCharRow(NUM_ROW2, false));
            addView(buildSymbolRow3(NUM_ROW3, "#+="));
        } else {
            addView(buildCharRow(SYM_ROW1, false));
            addView(buildCharRow(SYM_ROW2, false));
            addView(buildSymbolRow3(SYM_ROW3, "123"));
        }

        addView(buildBottomRow());
    }

    private LinearLayout createRowContainer() {
        LinearLayout row = new LinearLayout(getContext());
        row.setOrientation(HORIZONTAL);
        row.setGravity(Gravity.CENTER);
        LayoutParams lp = new LayoutParams(LayoutParams.MATCH_PARENT, dp(46));
        lp.bottomMargin = dp(6);
        row.setLayoutParams(lp);
        return row;
    }

    private LinearLayout buildCharRow(String[] keys, boolean applyShift) {
        LinearLayout row = createRowContainer();
        for (String k : keys) {
            String label = (applyShift && shiftState != ShiftState.OFF) ? k.toUpperCase() : k;
            Button btn = createKeyButton(label, "#1E293B", "#F8FAFC", 1f);
            btn.setOnClickListener(v -> {
                listener.onCharacter(label.charAt(0));
                if (shiftState == ShiftState.SINGLE) {
                    shiftState = ShiftState.OFF;
                    rebuildLayout();
                }
            });
            row.addView(btn);
        }
        return row;
    }

    private LinearLayout buildQwertyRow3() {
        LinearLayout row = createRowContainer();

        String shiftLabel = shiftState == ShiftState.CAPS_LOCK ? "⇪" : "⇧";
        String shiftBg = shiftState != ShiftState.OFF ? "#2563EB" : "#334155";
        Button shiftBtn = createKeyButton(shiftLabel, shiftBg, "#FFFFFF", 1.4f);
        shiftBtn.setOnClickListener(v -> {
            if (shiftState == ShiftState.OFF) {
                shiftState = ShiftState.SINGLE;
            } else if (shiftState == ShiftState.SINGLE) {
                shiftState = ShiftState.CAPS_LOCK;
            } else {
                shiftState = ShiftState.OFF;
            }
            rebuildLayout();
        });
        row.addView(shiftBtn);

        for (String k : QWERTY_ROW3) {
            String label = shiftState != ShiftState.OFF ? k.toUpperCase() : k;
            Button btn = createKeyButton(label, "#1E293B", "#F8FAFC", 1f);
            btn.setOnClickListener(v -> {
                listener.onCharacter(label.charAt(0));
                if (shiftState == ShiftState.SINGLE) {
                    shiftState = ShiftState.OFF;
                    rebuildLayout();
                }
            });
            row.addView(btn);
        }

        row.addView(createBackspaceButton(1.4f));
        return row;
    }

    private LinearLayout buildSymbolRow3(String[] keys, String altLabel) {
        LinearLayout row = createRowContainer();
        Button altBtn = createKeyButton(altLabel, "#334155", "#FFFFFF", 1.5f);
        altBtn.setOnClickListener(v -> {
            currentLayer = (currentLayer == Layer.NUMBERS) ? Layer.SYMBOLS : Layer.NUMBERS;
            rebuildLayout();
        });
        row.addView(altBtn);

        for (String k : keys) {
            Button btn = createKeyButton(k, "#1E293B", "#F8FAFC", 1f);
            btn.setOnClickListener(v -> listener.onCharacter(k.charAt(0)));
            row.addView(btn);
        }

        row.addView(createBackspaceButton(1.5f));
        return row;
    }

    private LinearLayout buildBottomRow() {
        LinearLayout row = createRowContainer();

        String layerLabel = (currentLayer == Layer.QWERTY) ? "123" : "ABC";
        Button layerBtn = createKeyButton(layerLabel, "#334155", "#FFFFFF", 1.3f);
        layerBtn.setOnClickListener(v -> {
            currentLayer = (currentLayer == Layer.QWERTY) ? Layer.NUMBERS : Layer.QWERTY;
            rebuildLayout();
        });
        row.addView(layerBtn);

        Button globeBtn = createKeyButton("🌐", "#334155", "#FFFFFF", 1.0f);
        globeBtn.setOnClickListener(v -> listener.onSwitchInputMethod());
        row.addView(globeBtn);

        String langLabel = amharicEnabled ? "አማ" : "EN";
        String langBg = amharicEnabled ? "#059669" : "#475569";
        Button langBtn = createKeyButton(langLabel, langBg, "#FFFFFF", 1.1f);
        langBtn.setOnClickListener(v -> listener.onToggleLanguage());
        row.addView(langBtn);

        String spaceText = amharicEnabled ? "Elfye • አማርኛ" : "Elfye • English";
        Button spaceBtn = createKeyButton(spaceText, "#1E293B", "#CBD5E1", 3.5f);
        spaceBtn.setOnClickListener(v -> listener.onSpace());
        row.addView(spaceBtn);

        Button periodBtn = createKeyButton(amharicEnabled ? "።" : ".", "#1E293B", "#F8FAFC", 0.9f);
        periodBtn.setOnClickListener(v -> listener.onCharacter('.'));
        row.addView(periodBtn);

        Button enterBtn = createKeyButton(returnLabel, "#2563EB", "#FFFFFF", 1.5f);
        enterBtn.setOnClickListener(v -> listener.onEnter());
        row.addView(enterBtn);

        return row;
    }

    private Button createBackspaceButton(float weight) {
        Button delBtn = createKeyButton("⌫", "#334155", "#FFFFFF", weight);
        delBtn.setOnTouchListener((v, event) -> {
            switch (event.getAction()) {
                case MotionEvent.ACTION_DOWN:
                    listener.onBackspace();
                    repeatHandler.removeCallbacks(backspaceRepeater);
                    repeatHandler.postDelayed(backspaceRepeater, 380);
                    return true;
                case MotionEvent.ACTION_UP:
                case MotionEvent.ACTION_CANCEL:
                    repeatHandler.removeCallbacks(backspaceRepeater);
                    return true;
            }
            return false;
        });
        return delBtn;
    }

    private Button createKeyButton(String text, String bgHex, String textHex, float weight) {
        Button btn = new Button(getContext());
        btn.setText(text);
        btn.setAllCaps(false);
        btn.setTextColor(Color.parseColor(textHex));
        btn.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16);
        btn.setTypeface(Typeface.DEFAULT_BOLD);
        btn.setPadding(0, 0, 0, 0);

        GradientDrawable bg = new GradientDrawable();
        bg.setColor(Color.parseColor(bgHex));
        bg.setCornerRadius(dp(6));
        btn.setBackground(bg);

        LayoutParams lp = new LayoutParams(0, LayoutParams.MATCH_PARENT, weight);
        int margin = dp(2.5f);
        lp.setMargins(margin, 0, margin, 0);
        btn.setLayoutParams(lp);
        return btn;
    }

    private int dp(float dp) {
        return Math.round(TypedValue.applyDimension(
                TypedValue.COMPLEX_UNIT_DIP, dp, getResources().getDisplayMetrics()));
    }
}
