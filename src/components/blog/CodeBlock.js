"use client";

import { useEffect, useRef, useState } from "react";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import "highlight.js/styles/github-dark.css";
import { FiCopy, FiCheck } from "react-icons/fi";

// Register the languages we actually use in blog posts.
// Add more hljs.registerLanguage calls here if a post needs another language.
hljs.registerLanguage("javascript", javascript);

export default function CodeBlock({ code, language = "javascript" }) {
  const codeRef = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (codeRef.current) {
      // Reset the highlighted state before re-highlighting, so this works
      // even if the component re-renders with new code
      codeRef.current.removeAttribute("data-highlighted");
      hljs.highlightElement(codeRef.current);
    }
  }, [code, language]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Clipboard access can fail in some browsers/contexts — fail silently
      console.error("Failed to copy code:", error);
    }
  };

  return (
    <div className="rounded-xl border border-slate-700 overflow-hidden bg-slate-800 my-4">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">
          {language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-white transition-colors"
        >
          {copied ? (
            <>
              <FiCheck size={14} />
              Copied
            </>
          ) : (
            <>
              <FiCopy size={14} />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <pre className="p-4 overflow-x-auto">
        <code
          ref={codeRef}
          className={`language-${language} font-mono text-sm`}
        >
          {code}
        </code>
      </pre>
    </div>
  );
}
