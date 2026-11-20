import { fireEvent } from '@testing-library/react';

// Polyfill beforeInput on fireEvent
(fireEvent as any).beforeInput = (element: Element, init: { inputType?: string; data?: string; [key: string]: any }) => {
  const event = new InputEvent('beforeinput', {
    bubbles: true,
    cancelable: true,
    ...init,
  });
  return fireEvent(element, event);
};

// Polyfill execCommand for jsdom testing
if (typeof document !== 'undefined') {
  document.execCommand = (commandId: string, _showUI?: boolean, value?: string) => {
    const active =
      (document.activeElement as HTMLInputElement | HTMLTextAreaElement | null) ||
      (document.querySelector('input, textarea') as HTMLInputElement | HTMLTextAreaElement | null);

    if (!active || (active.tagName !== 'INPUT' && active.tagName !== 'TEXTAREA')) {
      return false;
    }

    if (commandId === 'insertText') {
      const val = active.value;
      const start = active.selectionStart ?? 0;
      const end = active.selectionEnd ?? 0;
      const replacement = value ?? '';
      const nextVal = val.slice(0, start) + replacement + val.slice(end);

      const prototype = active instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      const nativeSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
      if (nativeSetter) {
        nativeSetter.call(active, nextVal);
      } else {
        active.value = nextVal;
      }

      const newPos = start + replacement.length;
      active.setSelectionRange(newPos, newPos);
      active.dispatchEvent(new Event('input', { bubbles: true }));
      return true;
    }
    return false;
  };
}
