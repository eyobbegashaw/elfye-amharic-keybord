package com.elfye.keyboard;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.provider.Settings;
import android.util.TypedValue;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;

/**
 * Setup & test launcher activity for Elfye Amharic Keyboard.
 * Helps users enable the system IME in Android Settings and pick it.
 */
public class MainActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        ScrollView scroll = new ScrollView(this);
        scroll.setBackgroundColor(Color.parseColor("#F8FAFC"));

        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        int pad = dp(20);
        root.setPadding(pad, pad, pad, pad);

        TextView title = new TextView(this);
        title.setText("እልፍዬ (Elfye) Amharic Keyboard");
        title.setTextSize(TypedValue.COMPLEX_UNIT_SP, 22);
        title.setTextColor(Color.parseColor("#0F172A"));
        root.addView(title);

        TextView subtitle = new TextView(this);
        subtitle.setText("System-wide Amharic Phonetic Keyboard (Addiyon Scheme)\n100% Offline • Zero Network Permissions");
        subtitle.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
        subtitle.setTextColor(Color.parseColor("#475569"));
        subtitle.setPadding(0, dp(8), 0, dp(16));
        root.addView(subtitle);

        Button enableBtn = new Button(this);
        enableBtn.setText("1. Enable Elfye Keyboard in Settings");
        enableBtn.setOnClickListener(v ->
                startActivity(new Intent(Settings.ACTION_INPUT_METHOD_SETTINGS)));
        root.addView(enableBtn);

        Button pickerBtn = new Button(this);
        pickerBtn.setText("2. Select Elfye as Active Keyboard");
        pickerBtn.setOnClickListener(v -> {
            InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
            if (imm != null) {
                imm.showInputMethodPicker();
            }
        });
        root.addView(pickerBtn);

        TextView testLabel = new TextView(this);
        testLabel.setText("3. Test Keyboard Below:");
        testLabel.setTextSize(TypedValue.COMPLEX_UNIT_SP, 15);
        testLabel.setTextColor(Color.parseColor("#0F172A"));
        testLabel.setPadding(0, dp(20), 0, dp(8));
        root.addView(testLabel);

        EditText testInput = new EditText(this);
        testInput.setHint("Tap here and type 'selam' -> ሰላም");
        testInput.setMinLines(3);
        root.addView(testInput);

        TextView authorView = new TextView(this);
        authorView.setText("Developed by Eyob Begashaw\nhttps://github.com/eyobbegashaw");
        authorView.setTextSize(TypedValue.COMPLEX_UNIT_SP, 13);
        authorView.setTextColor(Color.parseColor("#2563EB"));
        authorView.setPadding(0, dp(24), 0, dp(8));
        authorView.setOnClickListener(v ->
                startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse("https://github.com/eyobbegashaw"))));
        root.addView(authorView);

        scroll.addView(root);
        setContentView(scroll);
    }

    private int dp(float dp) {
        return Math.round(TypedValue.applyDimension(
                TypedValue.COMPLEX_UNIT_DIP, dp, getResources().getDisplayMetrics()));
    }
}
