package com.elfye.keyboard.core;

/**
 * Output of a live typing step: newly committed text and active composing syllable.
 */
public final class EngineResult {
    public final String committed;
    public final String composing;

    public EngineResult(String committed, String composing) {
        this.committed = committed != null ? committed : "";
        this.composing = composing != null ? composing : "";
    }
}
