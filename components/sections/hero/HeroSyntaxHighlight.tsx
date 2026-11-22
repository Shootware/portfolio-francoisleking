"use client";

import React, { memo } from "react";
import type { TabContent } from "./heroTabsConfig";

/* ============================================================
   SYNTAX HIGHLIGHTING HELPER — Memoized Component
   ============================================================ */

interface HighlightLineProps {
  line: string;
  type: TabContent["type"];
}

const patternsCommon = [
  // Comments
  { regex: /(#.*|--.*|\/\/.*|\/\*[\s\S]*?\*\/)/g, className: "cmt" },
  // Strings
  { regex: /(".*?"|'.*?'|`.*?`)/g, className: "str" },
  // Numbers
  { regex: /\b\d+\.?\d*\b/g, className: "num" },
  // Keywords (Python/JS/TS/SQL)
  {
    regex: /\b(def|class|if|else|elif|for|while|return|import|from|as|const|let|var|interface|type|implements|extends|public|private|protected|async|await|function|CREATE|TABLE|PRIMARY|KEY|DEFAULT|NOT|NULL|INDEX|ON|ALTER|ENABLE|ROW|LEVEL|SECURITY|UUID|VARCHAR|TIMESTAMPTZ|JSONB|gen_random_uuid|now)\b/g,
    className: "kw",
  },
  // Functions
  { regex: /\b([a-zA-Z_][\w]*)(?=\s*\()/g, className: "fn" },
];

const patternsTerminal = [
  { regex: /^#.*/g, className: "cmt" },
  { regex: /\b(docker|kubectl|build|push|tag|set|image|deployment|rollout|status)\b/g, className: "kw" },
  { regex: /-[a-zA-Z]+/g, className: "num" },
];

function getPatterns(type: TabContent["type"]): typeof patternsCommon {
  switch (type) {
    case "terminal":
      return [...patternsCommon, ...patternsTerminal];
    default:
      return patternsCommon;
  }
}

function highlightLine(line: string, type: TabContent["type"]): React.ReactNode {
  const patterns = getPatterns(type);
  const lastIndex = 0;
  const matches: Array<{ start: number; end: number; className: string }> = [];

  for (const { regex, className } of patterns) {
    regex.lastIndex = 0;
    let match;
    while ((match = regex.exec(line)) !== null) {
      matches.push({ start: match.index, end: match.index + match[0].length, className });
    }
  }

  // Sort and merge overlapping matches (prefer longer matches)
  matches.sort((a, b) => a.start - b.start || b.end - a.end);
  const merged: Array<{ start: number; end: number; className: string }> = [];
  for (const m of matches) {
    const last = merged[merged.length - 1];
    if (!last || m.start >= last.end) {
      merged.push(m);
    }
  }

  if (merged.length === 0) {
    return <span className="line-content">{line}</span>;
  }

  return (
    <span className="line-content">
      {merged.map((m, i) => (
        <React.Fragment key={i}>
          {m.start > lastIndex && <span>{line.slice(lastIndex, m.start)}</span>}
          <span className={m.className}>{line.slice(m.start, m.end)}</span>
          {i === merged.length - 1 && m.end < line.length && <span>{line.slice(m.end)}</span>}
        </React.Fragment>
      ))}
      {lastIndex < line.length && merged.length > 0 && merged[merged.length - 1].end === line.length
        ? null
        : merged.length > 0 && merged[merged.length - 1].end < line.length
        ? <span>{line.slice(merged[merged.length - 1].end)}</span>
        : null}
    </span>
  );
}

function HighlightLine({ line, type }: HighlightLineProps) {
  return <>{highlightLine(line, type)}</>;
}

export const MemoizedHighlightLine = memo(HighlightLine);