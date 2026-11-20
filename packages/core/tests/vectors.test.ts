import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { transliterate } from '../src/transliterate.js';
import { LiveTypingEngine } from '../src/engine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const vectorsPath = path.resolve(__dirname, '../../../test-vectors.json');
const testVectors = JSON.parse(fs.readFileSync(vectorsPath, 'utf8'));

describe('Shared test-vectors.json Validation', () => {
  describe('Full Transliteration Vectors', () => {
    testVectors.fullTransliteration.forEach(
      (item: { input: string; expected: string; description?: string }, idx: number) => {
        it(`[${idx + 1}] ${item.description || item.input} -> "${item.expected}"`, () => {
          const actual = transliterate(item.input);
          expect(actual).toBe(item.expected);
        });
      },
    );
  });

  describe('Live Typing Keystroke Sequences', () => {
    testVectors.liveTypingSequences.forEach(
      (
        seq: {
          name: string;
          steps: Array<{
            input: string;
            expectedCommitted: string;
            expectedComposing: string;
          }>;
        },
        idx: number,
      ) => {
        it(`[Seq ${idx + 1}] ${seq.name}`, () => {
          const engine = new LiveTypingEngine();
          seq.steps.forEach((step, sIdx) => {
            const res = engine.input(step.input);
            expect(
              res.committed,
              `Step ${sIdx + 1} ('${step.input}') committed mismatch`,
            ).toBe(step.expectedCommitted);
            expect(
              res.composing,
              `Step ${sIdx + 1} ('${step.input}') composing mismatch`,
            ).toBe(step.expectedComposing);
          });
        });
      },
    );
  });

  describe('Backspace Sequences', () => {
    testVectors.backspaceSequences.forEach(
      (
        seq: {
          name: string;
          steps: Array<{
            action: 'type' | 'backspace';
            char?: string;
            expectedCommitted: string;
            expectedComposing: string;
          }>;
        },
        idx: number,
      ) => {
        it(`[Backspace Seq ${idx + 1}] ${seq.name}`, () => {
          const engine = new LiveTypingEngine();
          seq.steps.forEach((step, sIdx) => {
            if (step.action === 'type') {
              const res = engine.input(step.char!);
              expect(
                res.committed,
                `Type step ${sIdx + 1} ('${step.char}') committed mismatch`,
              ).toBe(step.expectedCommitted);
              expect(
                res.composing,
                `Type step ${sIdx + 1} ('${step.char}') composing mismatch`,
              ).toBe(step.expectedComposing);
            } else if (step.action === 'backspace') {
              const res = engine.backspace();
              expect(
                res.committed,
                `Backspace step ${sIdx + 1} committed mismatch`,
              ).toBe(step.expectedCommitted);
              expect(
                res.composing,
                `Backspace step ${sIdx + 1} composing mismatch`,
              ).toBe(step.expectedComposing);
            }
          });
        });
      },
    );
  });

  describe('Common Amharic Words Corpus Regression (~1000 words)', () => {
    it(`verifies all ${testVectors.commonWordsCorpus.length} common words transliterate exactly`, () => {
      let mismatchCount = 0;
      const failures: string[] = [];

      for (const item of testVectors.commonWordsCorpus) {
        const actual = transliterate(item.latin);
        if (actual !== item.amharic) {
          mismatchCount++;
          if (failures.length < 10) {
            failures.push(
              `'${item.latin}': expected '${item.amharic}', got '${actual}'`,
            );
          }
        }
      }

      if (mismatchCount > 0) {
        console.error('Sample failures:\n' + failures.join('\n'));
      }
      expect(mismatchCount).toBe(0);
    });
  });
});
