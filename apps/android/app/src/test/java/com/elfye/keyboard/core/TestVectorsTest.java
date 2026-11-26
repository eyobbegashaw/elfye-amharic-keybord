package com.elfye.keyboard.core;

import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.BeforeClass;
import org.junit.Test;

import java.io.File;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

/**
 * Parity test suite validating the Java core port against root test-vectors.json.
 */
public class TestVectorsTest {

    private static JSONObject vectors;

    @BeforeClass
    public static void loadVectors() throws Exception {
        File[] candidates = new File[]{
                new File("../../../../test-vectors.json"),
                new File("../../test-vectors.json"),
                new File("../../../test-vectors.json"),
                new File("test-vectors.json")
        };

        File target = null;
        for (File c : candidates) {
            if (c.exists() && c.isFile()) {
                target = c;
                break;
            }
        }
        assertTrue("Could not locate test-vectors.json", target != null);
        String json = new String(Files.readAllBytes(target.toPath()), StandardCharsets.UTF_8);
        vectors = new JSONObject(json);
    }

    @Test
    public void testFullTransliterationVectors() throws Exception {
        JSONArray arr = vectors.getJSONArray("fullTransliteration");
        assertTrue(arr.length() > 0);
        for (int i = 0; i < arr.length(); i++) {
            JSONObject item = arr.getJSONObject(i);
            String input = item.getString("input");
            String expected = item.getString("expected");

            TransliterationOptions opts = new TransliterationOptions();
            if (item.has("options")) {
                JSONObject o = item.getJSONObject("options");
                if (o.has("allowWaForLabial")) opts.setAllowWaForLabial(o.getBoolean("allowWaForLabial"));
                if (o.has("convertPunctuation")) opts.setConvertPunctuation(o.getBoolean("convertPunctuation"));
                if (o.has("convertDigits")) opts.setConvertDigits(o.getBoolean("convertDigits"));
                if (o.has("enableSeraAliases")) opts.setEnableSeraAliases(o.getBoolean("enableSeraAliases"));
            }

            String actual = Transliterator.transliterate(input, opts);
            assertEquals("Vector [" + i + "] failed for input: " + input, expected, actual);
        }
    }

    @Test
    public void testLiveTypingSequences() throws Exception {
        JSONArray seqs = vectors.getJSONArray("liveTypingSequences");
        assertTrue(seqs.length() > 0);
        for (int i = 0; i < seqs.length(); i++) {
            JSONObject seq = seqs.getJSONObject(i);
            LiveTypingEngine engine = new LiveTypingEngine();
            JSONArray steps = seq.getJSONArray("steps");
            for (int j = 0; j < steps.length(); j++) {
                JSONObject step = steps.getJSONObject(j);
                String key = step.getString("input");
                String expectedCommitted = step.getString("expectedCommitted");
                String expectedComposing = step.getString("expectedComposing");

                EngineResult res = engine.input(key);
                assertEquals("Live sequence [" + i + "] step " + j + " committed mismatch", expectedCommitted, res.committed);
                assertEquals("Live sequence [" + i + "] step " + j + " composing mismatch", expectedComposing, res.composing);
            }
        }
    }

    @Test
    public void testBackspaceSequences() throws Exception {
        JSONArray seqs = vectors.getJSONArray("backspaceSequences");
        assertTrue(seqs.length() > 0);
        for (int i = 0; i < seqs.length(); i++) {
            JSONObject seq = seqs.getJSONObject(i);
            LiveTypingEngine engine = new LiveTypingEngine();
            JSONArray steps = seq.getJSONArray("steps");
            for (int j = 0; j < steps.length(); j++) {
                JSONObject step = steps.getJSONObject(j);
                String action = step.getString("action");
                String expectedCommitted = step.getString("expectedCommitted");
                String expectedComposing = step.getString("expectedComposing");

                EngineResult res = "backspace".equals(action)
                        ? engine.backspace()
                        : engine.input(step.getString("char"));

                assertEquals("Backspace sequence [" + i + "] step " + j + " committed mismatch", expectedCommitted, res.committed);
                assertEquals("Backspace sequence [" + i + "] step " + j + " composing mismatch", expectedComposing, res.composing);
            }
        }
    }

    @Test
    public void testCorpusWords() throws Exception {
        JSONArray corpus = vectors.getJSONArray("commonWordsCorpus");
        assertTrue(corpus.length() >= 1000);
        for (int i = 0; i < corpus.length(); i++) {
            JSONObject item = corpus.getJSONObject(i);
            String latin = item.getString("latin");
            String amharic = item.getString("amharic");
            String actual = Transliterator.transliterate(latin);
            assertEquals("Corpus [" + i + "] failed for: " + latin, amharic, actual);
        }
    }
}
