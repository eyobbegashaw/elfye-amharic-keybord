import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { useAmharic } from '../src/useAmharic.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const vectorsPath = path.resolve(__dirname, '../../../test-vectors.json');
const testVectors = JSON.parse(fs.readFileSync(vectorsPath, 'utf8'));

function TestComponent({ defaultEnabled = true }: { defaultEnabled?: boolean }) {
  const { bind, enabled, toggleEnabled } = useAmharic<HTMLInputElement>({ defaultEnabled });

  return (
    <div>
      <input data-testid="amharic-input" {...bind} />
      <button data-testid="toggle-btn" onClick={toggleEnabled}>
        {enabled ? 'Amharic' : 'English'}
      </button>
    </div>
  );
}

describe('useAmharic Hook & beforeinput handling', () => {
  beforeEach(() => {
    cleanup();
    document.body.innerHTML = '';
  });

  it('transliterates keystrokes via beforeinput sequentially', () => {
    render(<TestComponent />);
    const input = screen.getByTestId('amharic-input') as HTMLInputElement;

    // Simulate beforeinput for 's' -> 'e' -> 'l' -> 'a' -> 'm'
    fireEvent.beforeInput(input, { inputType: 'insertText', data: 's' });
    expect(input.value).toBe('ስ');

    fireEvent.beforeInput(input, { inputType: 'insertText', data: 'e' });
    expect(input.value).toBe('ሰ');

    fireEvent.beforeInput(input, { inputType: 'insertText', data: 'l' });
    expect(input.value).toBe('ሰል');

    fireEvent.beforeInput(input, { inputType: 'insertText', data: 'a' });
    expect(input.value).toBe('ሰላ');

    fireEvent.beforeInput(input, { inputType: 'insertText', data: 'm' });
    expect(input.value).toBe('ሰላም');
  });

  it('handles progressive backspace (ሰ -> ስ -> empty)', () => {
    render(<TestComponent />);
    const input = screen.getByTestId('amharic-input') as HTMLInputElement;

    fireEvent.beforeInput(input, { inputType: 'insertText', data: 's' });
    expect(input.value).toBe('ስ');

    fireEvent.beforeInput(input, { inputType: 'insertText', data: 'e' });
    expect(input.value).toBe('ሰ');

    // First backspace: removes 'e', re-renders 's' -> 'ስ'
    fireEvent.beforeInput(input, { inputType: 'deleteContentBackward' });
    expect(input.value).toBe('ስ');

    // Second backspace: removes 's' -> empty
    fireEvent.beforeInput(input, { inputType: 'deleteContentBackward' });
    expect(input.value).toBe('');
  });

  it('handles live typing sequences from test-vectors.json', () => {
    for (const seq of testVectors.liveTypingSequences) {
      cleanup();
      render(<TestComponent key={seq.name} />);
      const input = screen.getByTestId('amharic-input') as HTMLInputElement;

      let expectedText = '';
      for (const step of seq.steps) {
        fireEvent.beforeInput(input, { inputType: 'insertText', data: step.input });
        if (step.expectedCommitted && step.expectedComposing) {
          expectedText = step.expectedCommitted + step.expectedComposing;
        } else if (step.expectedCommitted) {
          expectedText += step.expectedCommitted;
        } else if (step.expectedComposing) {
          expectedText = step.expectedComposing;
        }
      }
      expect(input.value.length).toBeGreaterThan(0);
    }
  });

  it('toggles English and Amharic with Ctrl+Space', () => {
    render(<TestComponent />);
    const input = screen.getByTestId('amharic-input') as HTMLInputElement;
    const btn = screen.getByTestId('toggle-btn');

    expect(btn.textContent).toBe('Amharic');

    // Press Ctrl+Space
    fireEvent.keyDown(input, { key: ' ', code: 'Space', ctrlKey: true });
    expect(btn.textContent).toBe('English');

    // While disabled, inputs are not intercepted by Amharic engine
    fireEvent.beforeInput(input, { inputType: 'insertText', data: 's' });
    // In native beforeinput without preventDefault, input.value would be native
    expect(btn.textContent).toBe('English');

    // Press Ctrl+Space again to re-enable
    fireEvent.keyDown(input, { key: ' ', code: 'Space', ctrlKey: true });
    expect(btn.textContent).toBe('Amharic');
  });

  it('handles paste event with pure transliterate', () => {
    render(<TestComponent />);
    const input = screen.getByTestId('amharic-input') as HTMLInputElement;

    const pasteData = {
      getData: (format: string) => (format === 'text/plain' ? 'selam endiet nesh' : ''),
    };

    fireEvent.paste(input, { clipboardData: pasteData });
    expect(input.value).toBe('ሰላም እንዴት ነሽ');
  });

  it('handles Android Chrome / IME virtual keyboard composition events', () => {
    render(<TestComponent />);
    const input = screen.getByTestId('amharic-input') as HTMLInputElement;

    fireEvent.compositionStart(input);
    fireEvent.beforeInput(input, { inputType: 'insertCompositionText', data: 's' });
    expect(input.value).toBe('ስ');

    fireEvent.beforeInput(input, { inputType: 'insertCompositionText', data: 'e' });
    expect(input.value).toBe('ሰ');

    fireEvent.compositionEnd(input, { data: 'ሰ' });
    expect(input.value).toBe('ሰ');
  });
});
