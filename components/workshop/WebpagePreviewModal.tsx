"use client";

import React, { useState } from "react";
import { ExternalLink, X, Globe, Code, Smartphone, Monitor, Tablet, Copy, Check, Maximize2, Minimize2 } from "lucide-react";

interface WebpagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  htmlContent: string;
  description?: string;
}

export function injectClaudeStyleCss(rawHtml: string): string {
  if (!rawHtml) return rawHtml;

  let html = rawHtml.trim();

  const tailwindCdn = `<script src="https://cdn.tailwindcss.com"></script>`;
  const fontCdn = `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;600;700&display=swap" rel="stylesheet">`;
  const customStyles = `<style>
    :root { color-scheme: dark; }
    body { font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: #090d16; color: #f1f5f9; margin: 0; padding: 0; line-height: 1.6; }
    header { background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255, 255, 255, 0.1); position: sticky; top: 0; z-index: 50; padding: 1rem 2rem; }
    nav ul { display: flex; gap: 1.5rem; list-style: none; margin: 0; padding: 0; }
    nav a { color: #94a3b8; text-decoration: none; font-weight: 500; font-size: 0.9rem; transition: color 0.2s; }
    nav a:hover { color: #38bdf8; }
    section { max-width: 900px; margin: 2rem auto; padding: 2rem; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 1rem; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    h1 { font-size: 2.25rem; font-weight: 800; background: linear-gradient(to right, #38bdf8, #818cf8, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-top: 0; }
    h2 { font-size: 1.5rem; font-weight: 700; color: #38bdf8; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 0.5rem; }
    h3 { font-size: 1.15rem; font-weight: 600; color: #f1f5f9; }
    p { color: #cbd5e1; font-size: 0.95rem; }
    button, input[type="submit"] { background: linear-gradient(135deg, #0284c7, #4f46e5); color: #ffffff; font-weight: 600; padding: 0.75rem 1.5rem; border-radius: 0.75rem; border: none; cursor: pointer; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.4); transition: all 0.2s; }
    button:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(2, 132, 199, 0.6); }
    form { display: flex; flex-direction: column; gap: 1rem; max-width: 500px; }
    input[type="text"], input[type="email"], textarea { background: #0f172a; border: 1px solid #334155; color: #f8fafc; padding: 0.75rem; border-radius: 0.5rem; font-family: inherit; }
    input:focus, textarea:focus { outline: 2px solid #38bdf8; border-color: transparent; }
    ul { padding-left: 1.25rem; }
    li { margin-bottom: 0.5rem; color: #e2e8f0; }
    footer { text-align: center; padding: 2rem; color: #64748b; font-size: 0.85rem; border-top: 1px solid rgba(255, 255, 255, 0.05); }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: #090d16; }
    ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
  </style>`;

  if (!html.includes("cdn.tailwindcss.com")) {
    if (html.includes("<head>")) {
      html = html.replace("<head>", `<head>\n  ${tailwindCdn}\n  ${fontCdn}\n  ${customStyles}`);
    } else if (html.includes("<html>")) {
      html = html.replace("<html>", `<html><head>\n  ${tailwindCdn}\n  ${fontCdn}\n  ${customStyles}</head>`);
    } else if (html.includes("<!DOCTYPE html>")) {
      html = html.replace("<!DOCTYPE html>", `<!DOCTYPE html>\n<html><head>\n  ${tailwindCdn}\n  ${fontCdn}\n  ${customStyles}</head><body>`) + "</body></html>";
    } else {
      html = `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  ${tailwindCdn}\n  ${fontCdn}\n  ${customStyles}\n</head>\n<body class="bg-slate-950 text-slate-100 font-sans p-4 sm:p-8">\n${html}\n</body>\n</html>`;
    }
  }

  return html;
}

export default function WebpagePreviewModal({
  isOpen,
  onClose,
  title,
  htmlContent: rawHtmlContent,
  description,
}: WebpagePreviewModalProps) {
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const htmlContent = injectClaudeStyleCss(rawHtmlContent);

  const handleOpenNewTab = () => {
    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, "_blank");
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(htmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const deviceWidths = {
    desktop: "w-full h-full",
    tablet: "max-w-2xl w-full h-[90%]",
    mobile: "max-w-sm w-full h-[85%]",
  };

  return (
    <div className={`fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-200 ${isFullscreen ? "p-0" : "p-2 sm:p-6"}`}>
      <div className={`bg-zinc-950 border border-zinc-800 w-full h-full overflow-hidden flex flex-col shadow-2xl transition-all ${isFullscreen ? "rounded-none max-w-full max-h-full" : "max-w-7xl max-h-[95vh] rounded-3xl"}`}>
        
        {/* Fake Browser Toolbar & Controls */}
        <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
          
          {/* Left: Window dots & Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block cursor-pointer" onClick={onClose} />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <div className="h-4 w-px bg-zinc-800" />
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span className="truncate max-w-[200px] sm:max-w-xs">{title}</span>
            </div>
          </div>

          {/* Center: Fake Address Bar */}
          <div className="flex-1 max-w-md hidden md:flex items-center bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-400 font-mono">
            <span className="text-zinc-600 mr-2">https://</span>
            <span className="text-zinc-300 truncate">openagent.local/preview/{title.toLowerCase().replace(/\s+/g, "-")}.html</span>
          </div>

          {/* Right: Device & Action Controls */}
          <div className="flex items-center gap-2">
            
            {/* View Mode Toggle */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-1 flex items-center gap-1 text-xs">
              <button
                onClick={() => setViewMode("preview")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === "preview" ? "bg-blue-600 text-white shadow-md" : "text-zinc-400 hover:text-white"
                }`}
              >
                <Globe className="w-3.5 h-3.5" /> Preview
              </button>
              <button
                onClick={() => setViewMode("code")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === "code" ? "bg-blue-600 text-white shadow-md" : "text-zinc-400 hover:text-white"
                }`}
              >
                <Code className="w-3.5 h-3.5" /> HTML Code
              </button>
            </div>

            {/* Device Width Toggles (Only in preview mode) */}
            {viewMode === "preview" && (
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-1 hidden sm:flex items-center gap-1 text-xs">
                <button
                  onClick={() => setDevice("desktop")}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${device === "desktop" ? "bg-zinc-800 text-cyan-400" : "text-zinc-500 hover:text-zinc-300"}`}
                  title="Desktop View"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDevice("tablet")}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${device === "tablet" ? "bg-zinc-800 text-cyan-400" : "text-zinc-500 hover:text-zinc-300"}`}
                  title="Tablet View"
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDevice("mobile")}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${device === "mobile" ? "bg-zinc-800 text-cyan-400" : "text-zinc-500 hover:text-zinc-300"}`}
                  title="Mobile View"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Open in New Tab Button */}
            <button
              onClick={handleOpenNewTab}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-lg shadow-cyan-600/20 flex items-center gap-1.5 cursor-pointer shrink-0"
              title="Open Webpage in Fullscreen New Browser Tab"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Open Fullscreen Tab
            </button>

            {/* Fullscreen Modal Toggle Button */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="text-zinc-400 hover:text-white p-2 rounded-xl hover:bg-zinc-800 transition-colors"
              title={isFullscreen ? "Exit Fullscreen" : "Maximize Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4 text-cyan-400" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white p-2 rounded-xl hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Display Container */}
        <div className="flex-1 bg-zinc-900/60 p-2 sm:p-4 flex items-center justify-center overflow-hidden relative">
          
          {viewMode === "preview" ? (
            <div className={`transition-all duration-300 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl bg-white ${deviceWidths[device]}`}>
              <iframe
                title={title}
                srcDoc={htmlContent}
                className="w-full h-full border-none bg-white"
                sandbox="allow-scripts allow-modals allow-forms allow-popups"
              />
            </div>
          ) : (
            <div className="w-full h-full bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col font-mono text-xs text-zinc-200">
              <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 flex justify-between items-center text-zinc-400 text-[11px]">
                <span>HTML/CSS/JS Source Code</span>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 text-cyan-400 hover:underline cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy Code"}
                </button>
              </div>
              <pre className="p-4 flex-1 overflow-auto font-mono text-xs leading-relaxed text-zinc-300 whitespace-pre-wrap select-text">
                {htmlContent}
              </pre>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
