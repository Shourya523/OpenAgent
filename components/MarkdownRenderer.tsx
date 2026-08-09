"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
}

/**
 * Lightweight custom MDX/Markdown renderer.
 * Formats Markdown elements cleanly (headings, lists, bold/italic, code blocks, tables, blockquotes).
 */
export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null;

  // Clean non-printable control characters & surrogate pairs
  let cleanContent = content.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F\uFFFD]/g, "");

  // Auto-detect raw HTML documents returned without markdown code blocks
  if (
    (cleanContent.includes("<!DOCTYPE html>") || cleanContent.includes("<html") || cleanContent.includes("<div")) &&
    !cleanContent.includes("```")
  ) {
    const htmlSnippet = cleanContent.trim();
    return (
      <div className="flex flex-col gap-2.5 text-xs text-zinc-200 leading-relaxed font-sans select-text break-words max-w-full overflow-hidden">
        <CodeBlock lang="html" code={htmlSnippet} />
      </div>
    );
  }

  // Split text by code blocks ``` ... ```
  const parts = cleanContent.split(/(```[\s\S]*?```)/g);

  return (
    <div className="flex flex-col gap-2.5 text-xs text-zinc-200 leading-relaxed font-sans select-text break-words max-w-full overflow-hidden">
      {parts.map((part, index) => {
        if (part.startsWith("```") && part.endsWith("```")) {
          // Render Code Block
          const match = part.match(/^```(\w*)\n?([\s\S]*?)```$/);
          const lang = match?.[1] || "code";
          const code = match?.[2] || part.slice(3, -3);
          return <CodeBlock key={index} lang={lang} code={code.trim()} />;
        }

        // Render standard Markdown blocks (headings, lists, blockquotes, tables, paragraphs)
        return <FormattedBlocks key={index} text={part} />;
      })}
    </div>
  );
}

function CodeBlock({ lang, code }: { lang: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-2 rounded-xl bg-zinc-950 border border-zinc-800/80 overflow-hidden font-mono text-[11.5px] shadow-lg max-w-full">
      <div className="px-3.5 py-1.5 bg-zinc-900/90 border-b border-zinc-800/80 flex items-center justify-between text-zinc-400">
        <span className="text-[10px] uppercase tracking-wider font-bold text-blue-400">{lang}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" /> Copied!
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" /> Copy
            </>
          )}
        </button>
      </div>
      <pre className="p-3.5 overflow-x-auto text-zinc-200 leading-relaxed whitespace-pre-wrap font-mono break-all max-w-full">
        {code}
      </pre>
    </div>
  );
}

function FormattedBlocks({ text }: { text: string }) {
  const lines = text.split("\n");
  const renderedElements: React.ReactNode[] = [];

  let inList = false;
  let listItems: React.ReactNode[] = [];

  const flushList = () => {
    if (inList && listItems.length > 0) {
      renderedElements.push(
        <ul key={`ul_${renderedElements.length}`} className="list-disc list-inside flex flex-col gap-1 pl-1 text-zinc-300 my-1">
          {listItems}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      return;
    }

    // Headings
    if (line.startsWith("# ")) {
      flushList();
      renderedElements.push(
        <h1 key={idx} className="text-base font-bold text-white border-b border-zinc-800/80 pb-1.5 mt-2 mb-1 break-words">
          {formatInline(line.slice(2))}
        </h1>
      );
      return;
    }

    if (line.startsWith("## ")) {
      flushList();
      renderedElements.push(
        <h2 key={idx} className="text-sm font-bold text-blue-300 border-b border-zinc-800/50 pb-1 mt-2 mb-1 break-words">
          {formatInline(line.slice(3))}
        </h2>
      );
      return;
    }

    if (line.startsWith("### ")) {
      flushList();
      renderedElements.push(
        <h3 key={idx} className="text-xs font-bold text-purple-300 mt-1.5 mb-0.5 break-words">
          {formatInline(line.slice(4))}
        </h3>
      );
      return;
    }

    // Blockquotes
    if (line.startsWith("> ")) {
      flushList();
      renderedElements.push(
        <blockquote key={idx} className="border-l-2 border-purple-500 pl-3 py-1 my-1 italic text-zinc-400 bg-purple-950/20 rounded-r-lg break-words">
          {formatInline(line.slice(2))}
        </blockquote>
      );
      return;
    }

    // Bullet Lists
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      inList = true;
      listItems.push(
        <li key={idx} className="leading-snug break-words">
          {formatInline(trimmed.slice(2))}
        </li>
      );
      return;
    }

    // Numbered Lists
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      inList = true;
      listItems.push(
        <li key={idx} className="leading-snug list-decimal list-inside break-words">
          {formatInline(numMatch[2])}
        </li>
      );
      return;
    }

    // Regular paragraphs
    flushList();
    renderedElements.push(
      <p key={idx} className="leading-relaxed break-words">
        {formatInline(line)}
      </p>
    );
  });

  flushList();

  return <>{renderedElements}</>;
}

/**
 * Format bold **text**, italic *text*, and inline `code`
 */
function formatInline(str: string): React.ReactNode {
  const parts = str.split(/(\*\*[\s\S]*?\*\*|\*[\s\S]*?\*|`[\s\S]*?`)/g);

  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i} className="italic text-zinc-300">{part.slice(1, -1)}</em>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800 font-mono text-[11px] text-cyan-300 break-all">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}
