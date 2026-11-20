import React, { forwardRef, useImperativeHandle } from 'react';
import { useAmharic } from './useAmharic.js';
import { UseAmharicOptions } from './types.js';

export interface AmharicTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    UseAmharicOptions {}

export const AmharicTextarea = forwardRef<HTMLTextAreaElement, AmharicTextareaProps>(
  function AmharicTextarea(
    {
      enabled,
      defaultEnabled = true,
      onEnabledChange,
      options,
      toggleKey,
      enableShortcut,
      onBeforeInput,
      onKeyDown,
      onSelect,
      onPaste,
      onCompositionStart,
      onCompositionUpdate,
      onCompositionEnd,
      onBlur,
      ...restProps
    },
    forwardedRef,
  ) {
    const amharic = useAmharic<HTMLTextAreaElement>({
      enabled,
      defaultEnabled,
      onEnabledChange,
      options,
      toggleKey,
      enableShortcut,
    });

    useImperativeHandle(forwardedRef, () => amharic.ref.current as HTMLTextAreaElement);

    return (
      <textarea
        ref={amharic.ref as React.RefObject<HTMLTextAreaElement>}
        onBeforeInput={(e) => {
          amharic.onBeforeInput(e);
          onBeforeInput?.(e);
        }}
        onKeyDown={(e) => {
          amharic.onKeyDown(e);
          onKeyDown?.(e);
        }}
        onSelect={(e) => {
          amharic.onSelect(e);
          onSelect?.(e);
        }}
        onPaste={(e) => {
          amharic.onPaste(e);
          onPaste?.(e);
        }}
        onCompositionStart={(e) => {
          amharic.onCompositionStart(e);
          onCompositionStart?.(e);
        }}
        onCompositionUpdate={(e) => {
          amharic.onCompositionUpdate(e);
          onCompositionUpdate?.(e);
        }}
        onCompositionEnd={(e) => {
          amharic.onCompositionEnd(e);
          onCompositionEnd?.(e);
        }}
        onBlur={(e) => {
          amharic.onBlur(e);
          onBlur?.(e);
        }}
        {...restProps}
      />
    );
  },
);
