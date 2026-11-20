import React, { createRef } from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AmharicInput } from '../src/AmharicInput.js';
import { AmharicTextarea } from '../src/AmharicTextarea.js';

describe('AmharicInput & AmharicTextarea components', () => {
  it('forwards ref and handles typing in AmharicInput', () => {
    const ref = createRef<HTMLInputElement>();
    render(<AmharicInput ref={ref} data-testid="custom-input" placeholder="አማርኛ ይተይቡ" />);

    const input = screen.getByTestId('custom-input') as HTMLInputElement;
    expect(ref.current).toBe(input);
    expect(input.placeholder).toBe('አማርኛ ይተይቡ');

    fireEvent.beforeInput(input, { inputType: 'insertText', data: 's' });
    fireEvent.beforeInput(input, { inputType: 'insertText', data: 'e' });
    expect(input.value).toBe('ሰ');
  });

  it('forwards ref and handles typing in AmharicTextarea', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<AmharicTextarea ref={ref} data-testid="custom-textarea" rows={4} />);

    const textarea = screen.getByTestId('custom-textarea') as HTMLTextAreaElement;
    expect(ref.current).toBe(textarea);
    expect(textarea.rows).toBe(4);

    fireEvent.beforeInput(textarea, { inputType: 'insertText', data: 'h' });
    fireEvent.beforeInput(textarea, { inputType: 'insertText', data: 'u' });
    fireEvent.beforeInput(textarea, { inputType: 'insertText', data: 'a' });
    expect(textarea.value).toBe('ኋ');
  });

  it('respects enabled=false prop', () => {
    render(<AmharicInput enabled={false} data-testid="disabled-input" />);
    const input = screen.getByTestId('disabled-input') as HTMLInputElement;

    fireEvent.beforeInput(input, { inputType: 'insertText', data: 's' });
    // When enabled=false, it does not prevent default nor insert via engine
    expect(input.value).toBe('');
  });
});
