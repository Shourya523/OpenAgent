"use client";

import React, { useState, useRef, useEffect } from "react";
import { AgentConfig } from "./AgentBuilderForm";
import { LLMProviderType } from "@/lib/providers/types";
import { runAgentTurn } from "@/lib/providers";
import { WORKSHOP_TOOLS } from "@/lib/tools/registry";
import {
  Send,
  Sparkles,
  Bot,
  User,
  Wrench,
  Activity,
  CheckCircle2,
  FileText,
  Mail,
  Paperclip,
  Download,
  AlertCircle,
  Brain,
  Terminal,
  Search,
  Calculator,
  BookOpen,
  MessageSquare,
  X,
  Globe,
  Eye,
  ExternalLink,
  Code,
  RotateCcw,
  Trash2,
} from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { generatePdfDocument } from "@/lib/pdf/generator";
import WebpagePreviewModal, { injectClaudeStyleCss } from "@/components/workshop/WebpagePreviewModal";

export interface ActivityEvent {
  id: string;
  type: "thinking" | "tool_call" | "tool_result" | "final_answer" | "error";
  title: string;
  detail?: string;
  payload?: any;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  toolCalls?: Array<{ name: string; args: any }>;
  documentExport?: { title: string; content: string; format: string };
  webpageExport?: { title: string; htmlContent: string; description?: string };
  emailDraft?: { to: string; subject: string; body: string };
}

interface AgentPlaygroundProps {
  config: AgentConfig;
  provider: LLMProviderType;
  apiKey: string;
  model: string;
  onOpenApiConfig: () => void;
}

export default function AgentPlayground({
  config,
  provider,
  apiKey,
  model,
  onOpenApiConfig,
}: AgentPlaygroundProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m_welcome",
      role: "assistant",
      content: `Hello! I am **${config.name || "Agent"}**. ${config.goal ? `My goal is to ${config.goal}` : "How can I assist you today?"}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activities, setActivities] = useState<ActivityEvent[]>([]);

  // Session context states
  const [tasks, setTasks] = useState<Array<{ id: string; title: string; description: string; completed: boolean }>>([]);
  const [memoryStore, setMemoryStore] = useState<Record<string, any>>({});
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; content: string; type: string }>>([]);

  // Active email draft modal confirmation state
  const [activeEmailDraft, setActiveEmailDraft] = useState<{ to: string; subject: string; body: string } | null>(null);
  const [emailSentStatus, setEmailSentStatus] = useState<string | null>(null);

  // Active document preview modal state
  const [activeDocument, setActiveDocument] = useState<{ title: string; content: string; format: string } | null>(null);
  // Active HTML webpage preview modal state
  const [activeWebpage, setActiveWebpage] = useState<{ title: string; htmlContent: string; description?: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activities]);

  // Restores saved session from localStorage on component mount
  useEffect(() => {
    try {
      const savedMsgs = localStorage.getItem("gdg_workshop_chat_messages");
      if (savedMsgs) {
        const parsed = JSON.parse(savedMsgs);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }

      const savedTasks = localStorage.getItem("gdg_workshop_tasks");
      if (savedTasks) setTasks(JSON.parse(savedTasks));

      const savedMemory = localStorage.getItem("gdg_workshop_memory");
      if (savedMemory) setMemoryStore(JSON.parse(savedMemory));

      const savedFiles = localStorage.getItem("gdg_workshop_files");
      if (savedFiles) setUploadedFiles(JSON.parse(savedFiles));
    } catch (e) {
      console.warn("Could not restore session from localStorage", e);
    }
  }, []);

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      if (messages.length > 0) {
        localStorage.setItem("gdg_workshop_chat_messages", JSON.stringify(messages));
      }
    } catch (e) {}
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem("gdg_workshop_tasks", JSON.stringify(tasks));
    } catch (e) {}
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem("gdg_workshop_memory", JSON.stringify(memoryStore));
    } catch (e) {}
  }, [memoryStore]);

  useEffect(() => {
    try {
      localStorage.setItem("gdg_workshop_files", JSON.stringify(uploadedFiles));
    } catch (e) {}
  }, [uploadedFiles]);

  const handleClearSession = () => {
    try {
      localStorage.removeItem("gdg_workshop_chat_messages");
      localStorage.removeItem("gdg_workshop_tasks");
      localStorage.removeItem("gdg_workshop_memory");
      localStorage.removeItem("gdg_workshop_files");
    } catch (e) {}
    setMessages([
      {
        id: "m_welcome",
        role: "assistant",
        content: `Hello! I am **${config.name || "Agent"}**. ${config.goal ? `My goal is to ${config.goal}` : "How can I assist you today?"}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setTasks([]);
    setMemoryStore({});
    setUploadedFiles([]);
    setActivities([]);
  };

  const addActivity = (event: Omit<ActivityEvent, "id" | "timestamp">) => {
    const newEv: ActivityEvent = {
      ...event,
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    };
    setActivities((prev) => [...prev, newEv]);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.name.toLowerCase().endsWith(".pdf") || file.type.includes("pdf")) {
      try {
        addActivity({
          type: "thinking",
          title: "Parsing PDF Document",
          detail: `Extracting text streams from ${file.name}...`,
        });

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/agent/pdf-parse", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        const extractedText = data.extractedText || `Document "${file.name}" loaded into session memory.`;

        setUploadedFiles((prev) => [...prev, { name: file.name, content: extractedText, type: file.type }]);
        addActivity({
          type: "tool_result",
          title: `Uploaded File: ${file.name}`,
          detail: `Parsed ${extractedText.length} characters of clean text into session memory.`,
        });
        return;
      } catch (err) {
        console.warn("PDF parse API error, fallback to client reader", err);
      }
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = (evt.target?.result as string) || "";
      setUploadedFiles((prev) => [...prev, { name: file.name, content: text, type: file.type }]);
      addActivity({
        type: "tool_result",
        title: `Uploaded File: ${file.name}`,
        detail: `File loaded into session memory (${(file.size / 1024).toFixed(1)} KB).`,
      });
    };
    reader.readAsText(file);
  };

  const handleSendMessage = async (overridePrompt?: string) => {
    const promptToSend = overridePrompt || inputPrompt;
    if (!promptToSend.trim() || isProcessing) return;

    if (!apiKey) {
      onOpenApiConfig();
      return;
    }

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: "user",
      content: promptToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!overridePrompt) setInputPrompt("");
    setIsProcessing(true);

    addActivity({
      type: "thinking",
      title: "Agent Thinking",
      detail: `Analyzing query: "${promptToSend.substring(0, 60)}..."`,
    });

    // Enabled tools definition for API (auto-include read_file & create_html_webpage)
    const enabledToolIds = new Set(config.selectedToolIds);
    if (uploadedFiles.length > 0) {
      enabledToolIds.add("read_file");
    }
    const promptLower = promptToSend.toLowerCase();
    if (
      promptLower.includes("portfolio") ||
      promptLower.includes("webpage") ||
      promptLower.includes("website") ||
      promptLower.includes("site") ||
      promptLower.includes("landing page") ||
      promptLower.includes("html")
    ) {
      enabledToolIds.add("create_html_webpage");
    }

    const enabledToolsDef = Array.from(enabledToolIds)
      .map((id) => WORKSHOP_TOOLS[id])
      .filter(Boolean)
      .map((t) => ({
        name: t.name,
        description: t.description,
        inputSchema: t.inputSchema,
      }));

    // Enhanced System Instruction containing session file context
    let enhancedSystemInstruction = config.systemInstruction || "You are a helpful AI assistant.";
    if (uploadedFiles.length > 0) {
      const fileContext = uploadedFiles
        .map((f) => `--- ATTACHED SESSION FILE: "${f.name}" ---\n${f.content.substring(0, 4500)}`)
        .join("\n\n");
      enhancedSystemInstruction += `\n\n[SESSION FILES ACCESSIBLE]: The user has attached ${uploadedFiles.length} file(s) in this chat session:\n${fileContext}\n\nYou HAVE DIRECT ACCESS to read these files! Use their text content to answer questions, analyze data, or generate documents. NEVER tell the user you cannot access local computer files.`;
    }

    if (enabledToolIds.has("create_html_webpage")) {
      enhancedSystemInstruction += `\n\n[WEBPAGE GENERATION MANDATE]: When requested to generate a portfolio, website, or HTML page, call the "create_html_webpage" tool. DO NOT use external CSS files like <link rel="stylesheet" href="styles.css">. Include ALL CSS inside the HTML file using Tailwind CSS classes (e.g. class="bg-slate-950 text-white p-8 rounded-2xl shadow-xl flex...") or inline <style> blocks! Design stunning dark themes, gradient headers, glassmorphic cards, responsive flex/grid layouts, and interactive buttons.`;
    }

    let currentMessagesHistory = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      // Turn Loop (Up to 3 tool calls max)
      let turnCount = 0;
      let finalResponseText = "";
      let lastToolCalls: Array<{ name: string; args: any }> = [];
      let docExport: any = null;
      let emailPayload: any = null;
      let webpageExport: any = null;

      while (turnCount < 3) {
        turnCount++;

        const stepResult = await runAgentTurn({
          provider,
          apiKey,
          model,
          systemInstruction: enhancedSystemInstruction,
          userPrompt: promptToSend,
          messagesHistory: currentMessagesHistory as any,
          availableTools: enabledToolsDef,
        });

        if (stepResult.error) {
          addActivity({
            type: "error",
            title: "Agent Error",
            detail: stepResult.error,
          });
          finalResponseText = `Error: ${stepResult.error}`;
          break;
        }

        if (stepResult.toolCalls && stepResult.toolCalls.length > 0) {
          const call = stepResult.toolCalls[0];
          lastToolCalls.push({ name: call.name, args: call.arguments });

          addActivity({
            type: "tool_call",
            title: `Tool Call: ${call.name}`,
            detail: `Input arguments: ${JSON.stringify(call.arguments)}`,
            payload: call.arguments,
          });

          // Execute tool locally
          const toolImpl = WORKSHOP_TOOLS[call.name] || Object.values(WORKSHOP_TOOLS).find((t) => t.name === call.name);
          
          if (toolImpl) {
            const execRes = await toolImpl.execute(call.arguments, {
              tasks,
              memory: memoryStore,
              files: uploadedFiles,
              onEmailDraft: (draft) => setActiveEmailDraft(draft),
            });

            addActivity({
              type: "tool_result",
              title: `Tool Result: ${call.name}`,
              detail: execRes.result.substring(0, 180) + (execRes.result.length > 180 ? "..." : ""),
            });

            if (execRes.actionPayload?.type === "document") {
              docExport = execRes.actionPayload;
            }
            if (execRes.actionPayload?.type === "html_webpage") {
              webpageExport = execRes.actionPayload;
            }
            if (execRes.actionPayload?.type === "email_draft") {
              emailPayload = execRes.actionPayload.email;
            }

            // Append tool execution context to history for next turn
            currentMessagesHistory.push({
              role: "assistant",
              content: `[Executed Tool ${call.name} with args ${JSON.stringify(call.arguments)}]\nResult:\n${execRes.result}`,
            });
          } else {
            addActivity({
              type: "error",
              title: "Tool Not Found",
              detail: `Tool "${call.name}" is not enabled.`,
            });
            break;
          }
        } else {
          // Final text response reached
          finalResponseText = stepResult.text || "Task complete.";
          addActivity({
            type: "final_answer",
            title: "Generated Final Response",
            detail: finalResponseText.substring(0, 120) + "...",
          });
          break;
        }
      }

      const assistantMsg: ChatMessage = {
        id: `asst_${Date.now()}`,
        role: "assistant",
        content: finalResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        toolCalls: lastToolCalls.length > 0 ? lastToolCalls : undefined,
        documentExport: docExport,
        webpageExport: webpageExport,
        emailDraft: emailPayload,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      addActivity({
        type: "error",
        title: "Execution Crash",
        detail: (err as Error).message,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row h-[calc(100vh-200px)] min-h-[750px]">
      
      {/* Left Chat Main Area */}
      <div className="flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-zinc-900 bg-zinc-950">
        
        {/* Playground Top Bar */}
        <div className="px-5 py-3.5 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-950/40 border border-blue-800/40 flex items-center justify-center text-blue-400 font-bold text-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                {config.name || "Agent Playground"}
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">
                {provider.toUpperCase()} ({model}) • {config.selectedToolIds.length} Tools Enabled
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearSession}
              className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-red-400 hover:border-red-900/50 text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              title="Clear Saved Local Storage Session History"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear Session
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept=".txt,.csv,.json,.pdf"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Paperclip className="w-3.5 h-3.5 text-blue-400" /> Upload File
            </button>
          </div>
        </div>

        {/* Uploaded files ribbon */}
        {uploadedFiles.length > 0 && (
          <div className="px-5 py-2 bg-blue-950/20 border-b border-blue-900/40 flex items-center gap-2 overflow-x-auto text-[11px]">
            <span className="text-blue-300 font-bold shrink-0">Session Files:</span>
            {uploadedFiles.map((f, i) => (
              <span key={i} className="px-2.5 py-0.5 rounded-lg bg-blue-900/40 text-blue-200 border border-blue-800/50 shrink-0 flex items-center gap-1">
                <FileText className="w-3 h-3 text-blue-400" /> {f.name}
              </span>
            ))}
          </div>
        )}

        {/* Chat Messages Stream */}
        <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 text-xs ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {m.role === "assistant" && (
                <div className="w-7 h-7 rounded-xl bg-blue-950 border border-blue-800 text-blue-400 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 flex flex-col gap-2 ${
                  m.role === "user"
                    ? "bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-600/20"
                    : "bg-zinc-900/80 border border-zinc-800 text-zinc-200 rounded-tl-none"
                }`}
              >
                {m.role === "assistant" ? (
                  <MarkdownRenderer content={m.content} />
                ) : (
                  <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
                )}

                {/* Render Tool Call Indicators */}
                {m.toolCalls && m.toolCalls.length > 0 && (
                  <div className="mt-1 pt-2 border-t border-zinc-800/60 flex flex-wrap gap-1.5">
                    {m.toolCalls.map((tc, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-cyan-300 text-[10px] font-mono flex items-center gap-1"
                      >
                        <Wrench className="w-3 h-3 text-cyan-400" /> {tc.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Document Export Action */}
                {m.documentExport && (
                  <div className="mt-2 p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/50 flex items-center justify-between gap-3 text-[11px] text-emerald-200">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold">{m.documentExport.title}</span>
                    </div>
                    <button
                      onClick={() => setActiveDocument(m.documentExport!)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-white font-semibold transition-colors cursor-pointer"
                    >
                      Preview & Export
                    </button>
                  </div>
                )}

                {/* HTML Webpage Render Ribbon (Always shown if HTML is detected in message) */}
                {(() => {
                  const htmlText = m.webpageExport?.htmlContent || (() => {
                    if (!m.content) return null;
                    const match = m.content.match(/```(?:html|xml)?\n?([\s\S]*?)```/i);
                    if (match && (match[1].includes("<html") || match[1].includes("<!DOCTYPE") || match[1].includes("<body") || match[1].includes("<div"))) {
                      return match[1].trim();
                    }
                    if (m.content.includes("<!DOCTYPE html>") || m.content.includes("<html") || (m.content.includes("<body") && m.content.includes("</body>"))) {
                      return m.content.trim();
                    }
                    return null;
                  })();

                  if (!htmlText) return null;

                  return (
                    <div className="mt-2.5 p-3 rounded-xl bg-gradient-to-r from-blue-950/90 via-purple-950/90 to-cyan-950/90 border border-cyan-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl">
                      <div className="flex items-center gap-2 text-xs font-bold text-white">
                        <Globe className="w-4 h-4 text-cyan-400 animate-pulse" />
                        <span>Interactive Webpage Ready</span>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => {
                            const styledHtml = injectClaudeStyleCss(htmlText);
                            const blob = new Blob([styledHtml], { type: "text/html;charset=utf-8" });
                            window.open(URL.createObjectURL(blob), "_blank");
                          }}
                          className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-[11px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-cyan-400" /> New Tab
                        </button>
                        <button
                          onClick={() => setActiveWebpage({ title: m.webpageExport?.title || "Generated Webpage", htmlContent: htmlText })}
                          className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-[11px] font-bold shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" /> Render Webpage (Full Screen)
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* Email Action Payload Card */}
                {m.emailDraft && (
                  <div className="mt-2 p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/60 flex flex-col gap-2 text-xs text-purple-200">
                    <div className="flex items-center gap-2 font-bold text-white">
                      <Mail className="w-4 h-4 text-purple-400" /> MOCK EMAIL ACTION
                    </div>
                    <div className="text-[11px] font-mono bg-zinc-950 p-2 rounded-lg border border-purple-900/50">
                      <div><strong>To:</strong> {m.emailDraft.to}</div>
                      <div><strong>Subject:</strong> {m.emailDraft.subject}</div>
                    </div>
                    <div className="flex gap-2 justify-end pt-1">
                      <button
                        onClick={() => setEmailSentStatus("Cancelled email action.")}
                        className="px-3 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[11px] font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => setEmailSentStatus(`Email sent successfully to ${m.emailDraft!.to}!`)}
                        className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold cursor-pointer"
                      >
                        Send Email
                      </button>
                    </div>
                  </div>
                )}

                <span className="text-[9px] text-zinc-500 self-end font-mono">{m.timestamp}</span>
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex gap-3 text-xs items-center text-zinc-400 animate-pulse">
              <div className="w-7 h-7 rounded-xl bg-blue-950 border border-blue-800 text-blue-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
              </div>
              <span>Agent is thinking and processing tool calls...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 pt-2.5 pb-0 flex items-center gap-1.5 overflow-x-auto text-[10.5px]">
          <span className="text-zinc-500 font-bold shrink-0">Quick Test:</span>
          <button
            type="button"
            onClick={() => handleSendMessage("Research quantum computing breakthroughs and summarize key facts.")}
            className="px-2.5 py-1 rounded-xl bg-blue-950/40 border border-blue-800/50 text-blue-300 hover:bg-blue-900/50 transition-colors shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5 text-blue-400" /> Research Quantum Computing
          </button>
          <button
            type="button"
            onClick={() => handleSendMessage("Calculate 234 * 87 + 1050 and explain the solution.")}
            className="px-2.5 py-1 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 hover:bg-emerald-900/50 transition-colors shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <Calculator className="w-3.5 h-3.5 text-emerald-400" /> Calculate Math
          </button>
          <button
            type="button"
            onClick={() => handleSendMessage("Create a structured 5-day study plan for Data Structures exam.")}
            className="px-2.5 py-1 rounded-xl bg-purple-950/40 border border-purple-800/50 text-purple-300 hover:bg-purple-900/50 transition-colors shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-400" /> Study Plan
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-zinc-900 bg-zinc-950/90">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Ask your agent to perform a task..."
              disabled={isProcessing}
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button
              type="submit"
              disabled={isProcessing || !inputPrompt.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold px-5 py-3 rounded-2xl transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Right Visual AGENT ACTIVITY Stream Panel */}
      <div className="w-full lg:w-80 border-t lg:border-t-0 border-zinc-900 bg-zinc-950/60 p-4 flex flex-col gap-4 overflow-y-auto">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
            <Activity className="w-4 h-4 text-cyan-400" /> AGENT ACTIVITY
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        {activities.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center text-zinc-500 text-xs p-6">
            <Brain className="w-8 h-8 text-zinc-700" />
            <p>No activity yet. Send a message to see visual tool calls & thinking events in real-time!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 text-xs">
            {activities.map((ev) => (
              <div
                key={ev.id}
                className={`p-3 rounded-2xl border transition-all flex flex-col gap-1 ${
                  ev.type === "thinking"
                    ? "bg-purple-950/20 border-purple-900/40 text-purple-300"
                    : ev.type === "tool_call"
                    ? "bg-cyan-950/20 border-cyan-900/40 text-cyan-300"
                    : ev.type === "tool_result"
                    ? "bg-emerald-950/20 border-emerald-900/40 text-emerald-300"
                    : "bg-blue-950/20 border-blue-900/40 text-blue-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px] text-white flex items-center gap-1.5">
                    {ev.type === "thinking" && <Brain className="w-3.5 h-3.5 text-purple-400" />}
                    {ev.type === "tool_call" && <Wrench className="w-3.5 h-3.5 text-cyan-400" />}
                    {ev.type === "tool_result" && <Download className="w-3.5 h-3.5 text-emerald-400" />}
                    {ev.type === "final_answer" && <MessageSquare className="w-3.5 h-3.5 text-blue-400" />}
                    {ev.title}
                  </span>
                  <span className="text-[9px] font-mono text-zinc-500">{ev.timestamp}</span>
                </div>
                {ev.detail && <p className="text-[11px] font-mono text-zinc-300 leading-snug">{ev.detail}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Document Modal */}
      {activeDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-950 border border-zinc-800 w-full max-w-2xl rounded-3xl p-6 flex flex-col gap-4 text-white">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" /> {activeDocument.title}
              </h3>
              <button onClick={() => setActiveDocument(null)} className="text-zinc-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div className="bg-zinc-900 p-4 rounded-2xl text-xs max-h-80 overflow-y-auto border border-zinc-800">
              <MarkdownRenderer content={activeDocument.content} />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
              <button
                onClick={() => {
                  const blob = new Blob([activeDocument.content], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${activeDocument.title}.md`;
                  a.click();
                }}
                className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-xl text-xs font-semibold text-zinc-200 flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Export Markdown
              </button>
              <button
                onClick={() => generatePdfDocument(activeDocument)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl text-xs font-bold text-white shadow-lg shadow-blue-600/25 flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-blue-200" /> Generate & Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Webpage Preview Modal */}
      {activeWebpage && (
        <WebpagePreviewModal
          isOpen={!!activeWebpage}
          onClose={() => setActiveWebpage(null)}
          title={activeWebpage.title}
          htmlContent={activeWebpage.htmlContent}
          description={activeWebpage.description}
        />
      )}

    </div>
  );
}
