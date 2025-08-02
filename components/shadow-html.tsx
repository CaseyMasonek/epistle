import React, { useRef, useEffect } from "react";
import "@/app/globals.css";

export default function ShadowHtml({ html }: { html: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current && !containerRef.current.shadowRoot) {
      const shadowRoot = containerRef.current.attachShadow({ mode: "open" });
      shadowRoot.innerHTML = html;
    }
  }, [html]);

  return <div ref={containerRef} />;
}
