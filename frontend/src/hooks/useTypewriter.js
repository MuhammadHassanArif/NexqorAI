import { useEffect, useRef, useState } from "react";

// Returns the text typed so far. When "enabled" is false it returns the full text at once.
export function useTypewriter(text, { enabled = true, speed = 26, onDone } = {}) {
  const [count, setCount] = useState(enabled ? 0 : text.length);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  });

  useEffect(() => {
    if (!enabled) {
      setCount(text.length);
      return undefined;
    }

    setCount(0);
    let typed = 0;
    const timer = setInterval(() => {
      typed += 1;
      setCount(typed);
      if (typed >= text.length) {
        clearInterval(timer);
        onDoneRef.current?.();
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, enabled, speed]);

  return text.slice(0, count);
}