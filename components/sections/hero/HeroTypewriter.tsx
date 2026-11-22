"use client";

import { useEffect, useRef, useState } from "react";
import { FULL_TEXT } from "./heroTabsConfig";
import { motionTokens } from "@/lib/motion-tokens";

interface HeroTypewriterProps {
  shouldAnimate: boolean;
}

export function HeroTypewriter({ shouldAnimate }: HeroTypewriterProps) {
  const [typedText, setTypedText] = useState("");
  const isDeletingRef = useRef(false);
  const indexRef = useRef(0);
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!shouldAnimate) {
      setTypedText(FULL_TEXT);
      return;
    }

    indexRef.current = 0;
    isDeletingRef.current = false;
    setTypedText("");

    const tick = () => {
      if (!isDeletingRef.current) {
        setTypedText(FULL_TEXT.substring(0, indexRef.current + 1));
        indexRef.current++;
        if (indexRef.current === FULL_TEXT.length) {
          timeoutIdRef.current = setTimeout(() => {
            isDeletingRef.current = true;
            tick();
          }, motionTokens.duration.heroTypewriterHold * 1000);
          return;
        }
      } else {
        setTypedText(FULL_TEXT.substring(0, indexRef.current - 1));
        indexRef.current--;
        if (indexRef.current === 0) {
          isDeletingRef.current = false;
          timeoutIdRef.current = setTimeout(tick, motionTokens.duration.heroTypewriterCycle * 1000);
          return;
        }
      }
      timeoutIdRef.current = setTimeout(tick, isDeletingRef.current ? 30 : 65);
    };

    tick();
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
    };
  }, [shouldAnimate]);

  return (
    <p className="hero-role">
      {typedText}
      <span
        className="typing-cursor"
        style={{
          animation: shouldAnimate ? `h-blink ${motionTokens.duration.heroCursorBlink}s infinite steps(2)` : "none",
          opacity: 1,
        }}
      >
        |
      </span>
    </p>
  );
}