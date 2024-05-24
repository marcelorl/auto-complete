import { useEffect, useRef } from 'react';

export const useFocusInput = () => {
  const inputSearchRef = useRef<HTMLInputElement>(null);

  const setFocus = () => {
    inputSearchRef.current?.focus();
  };

  useEffect(() => {
    setFocus();
  }, []);

  return {
    setFocus,
    ref: inputSearchRef,
  };
};
