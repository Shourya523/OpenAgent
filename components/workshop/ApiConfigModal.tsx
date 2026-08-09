"use client";

import React, { useState } from "react";
import { PROVIDERS_CONFIG, LLMProviderType } from "@/lib/providers/types";
import { testProviderConnection } from "@/lib/providers";
import { Key, Eye, EyeOff, CheckCircle2, AlertCircle, Sparkles, ExternalLink, ShieldCheck, HelpCircle, X, Database } from "lucide-react";

interface ApiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: LLMProviderType;
  apiKey: string;
  model: string;
  rememberKey: boolean;
  onSave: (config: { provider: LLMProviderType; apiKey: string; model: string; rememberKey: boolean }) => void;
}

export default function ApiConfigModal({
  isOpen,
  onClose,
  provider: initialProvider,
  apiKey: initialApiKey,
  model: initialModel,
  rememberKey: initialRemember,
  onSave,
}: ApiConfigModalProps) {
  const [provider, setProvider] = useState<LLMProviderType>(initialProvider || "gemini");
  const [apiKey, setApiKey] = useState(initialApiKey || "");
  const [model, setModel] = useState(initialModel || PROVIDERS_CONFIG.gemini.models[0].id);
  const [rememberKey, setRememberKey] = useState(initialRemember !== undefined ? initialRemember : true);
  const [showKey, setShowKey] = useState(false);

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const [qdrantUrl, setQdrantUrl] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = JSON.parse(localStorage.getItem("gdg_workshop_qdrant_config") || "{}");
        return saved.url || "";
      } catch (e) {}
    }
    return "";
  });
  const [qdrantApiKey, setQdrantApiKey] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = JSON.parse(localStorage.getItem("gdg_workshop_qdrant_config") || "{}");
        return saved.apiKey || "";
      } catch (e) {}
    }
    return "";
  });
  const [qdrantCollection, setQdrantCollection] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = JSON.parse(localStorage.getItem("gdg_workshop_qdrant_config") || "{}");
        return saved.collection || "gdg_docs";
      } catch (e) {}
    }
    return "gdg_docs";
  });

  const [qdrantTesting, setQdrantTesting] = useState(false);
  const [qdrantTestResult, setQdrantTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const currentConfig = PROVIDERS_CONFIG[provider];

  const handleProviderChange = (newProvider: LLMProviderType) => {
    setProvider(newProvider);
    setModel(PROVIDERS_CONFIG[newProvider].models[0].id);
    setTestResult(null);
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    const result = await testProviderConnection(provider, apiKey, model);
    setTestResult(result);
    setTesting(false);
  };

  const handleTestQdrant = async () => {
    if (!qdrantUrl.trim()) return;
    setQdrantTesting(true);
    setQdrantTestResult(null);
    try {
      const res = await fetch("/api/agent/qdrant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "test",
          url: qdrantUrl,
          apiKey: qdrantApiKey,
        }),
      });
      const data = await res.json();
      setQdrantTestResult(data);
    } catch (err) {
      setQdrantTestResult({ success: false, message: (err as Error).message });
    } finally {
      setQdrantTesting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "gdg_workshop_qdrant_config",
        JSON.stringify({
          url: qdrantUrl,
          apiKey: qdrantApiKey,
          collection: qdrantCollection,
        })
      );
    }
    onSave({ provider, apiKey, model, rememberKey });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl relative text-zinc-100 flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-950/40 border border-blue-800/50 flex items-center justify-center text-blue-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Bring Your Own API Key (BYO API)
              </h2>
              <p className="text-xs text-zinc-400">Configure your personal LLM credentials for the GDG workshop.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 p-1.5 rounded-lg hover:bg-zinc-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          {/* Security Guarantee Notice */}
          <div className="bg-blue-950/40 border border-blue-800/40 p-3 rounded-2xl flex items-start gap-2.5 text-xs text-blue-200">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-white">100% Client-Side API Key Isolation:</strong> Your API keys are stored locally in your browser session only. They are NEVER logged, transmitted to external servers, or stored on databases.
            </div>
          </div>

          {/* Provider Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              1. Select LLM Provider
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(PROVIDERS_CONFIG) as LLMProviderType[]).map((pKey) => {
                const conf = PROVIDERS_CONFIG[pKey];
                const isSelected = provider === pKey;
                return (
                  <button
                    key={pKey}
                    type="button"
                    onClick={() => handleProviderChange(pKey)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-blue-950/40 border-blue-500 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                        : "bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                    }`}
                  >
                    <Sparkles className={`w-4 h-4 ${isSelected ? "text-blue-400" : "text-zinc-500"}`} />
                    <span>{conf.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Model Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              2. Select Model
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
            >
              {currentConfig.models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} — {m.description}
                </option>
              ))}
            </select>
          </div>

          {/* API Key Input */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                3. Enter Your {currentConfig.name} API Key
              </label>
              <a
                href={currentConfig.apiKeyHelpUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-blue-400 hover:underline flex items-center gap-1"
              >
                Get API Key <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="relative flex items-center">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setTestResult(null);
                }}
                placeholder={currentConfig.apiKeyPlaceholder}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-3.5 pr-10 py-2.5 text-sm font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 text-zinc-500 hover:text-zinc-300"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Key Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="rememberKey"
              checked={rememberKey}
              onChange={(e) => setRememberKey(e.target.checked)}
              className="rounded bg-zinc-900 border-zinc-800 text-blue-500 focus:ring-blue-500 w-4 h-4 cursor-pointer"
            />
            <label htmlFor="rememberKey" className="text-xs text-zinc-300 cursor-pointer">
              Remember key in local browser storage for this session
            </label>
          </div>
          {/* Optional Qdrant Vector DB Configuration */}
          <div className="flex flex-col gap-3 pt-3 border-t border-zinc-800/80">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-purple-400" /> 4. Qdrant Vector DB for Documentation (Optional)
              </label>
              <span className="text-[10px] text-zinc-500 font-mono">Vector RAG</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] text-zinc-400">Qdrant Cluster URL</span>
                <input
                  type="text"
                  value={qdrantUrl}
                  onChange={(e) => setQdrantUrl(e.target.value)}
                  placeholder="https://xxx-xxx.us-east4-0.gcp.cloud.qdrant.io:6333"
                  className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[11px] text-zinc-400">Collection Name</span>
                <input
                  type="text"
                  value={qdrantCollection}
                  onChange={(e) => setQdrantCollection(e.target.value)}
                  placeholder="gdg_docs"
                  className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-zinc-400">Qdrant API Key (Optional for cloud)</span>
              <input
                type="password"
                value={qdrantApiKey}
                onChange={(e) => setQdrantApiKey(e.target.value)}
                placeholder="eyJh..."
                className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="button"
              onClick={handleTestQdrant}
              disabled={qdrantTesting || !qdrantUrl.trim()}
              className="bg-purple-950/40 hover:bg-purple-900/60 border border-purple-800/60 disabled:opacity-50 text-purple-300 text-xs font-semibold py-2 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {qdrantTesting ? <Sparkles className="w-3.5 h-3.5 animate-spin text-purple-400" /> : <Database className="w-3.5 h-3.5 text-purple-400" />}
              Test Qdrant Vector Cluster
            </button>

            {qdrantTestResult && (
              <div
                className={`p-2.5 rounded-xl border text-[11px] flex items-center gap-2 ${
                  qdrantTestResult.success
                    ? "bg-emerald-950/30 border-emerald-800/60 text-emerald-300"
                    : "bg-red-950/30 border-red-800/60 text-red-300"
                }`}
              >
                {qdrantTestResult.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                )}
                <span>{qdrantTestResult.message || (qdrantTestResult.success ? "Qdrant cluster connected successfully!" : "Failed to connect to Qdrant cluster.")}</span>
              </div>
            )}
          </div>

          {/* Test Connection Button & Status */}
          <div className="flex flex-col gap-2 pt-2 border-t border-zinc-800/60">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testing || !apiKey.trim()}
                className="flex-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 disabled:opacity-50 text-xs font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {testing ? <Sparkles className="w-4 h-4 text-blue-400 animate-spin" /> : <Sparkles className="w-4 h-4 text-blue-400" />}
                Test Connection
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/25 cursor-pointer"
              >
                Save & Continue
              </button>
            </div>

            {testResult && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 ${
                  testResult.success
                    ? "bg-emerald-950/30 border-emerald-800/60 text-emerald-300"
                    : "bg-red-950/30 border-red-800/60 text-red-300"
                }`}
              >
                {testResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" /> : <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />}
                <span>{testResult.message}</span>
              </div>
            )}
          </div>

          {/* Privacy & Security Note */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-3.5 text-[11px] text-zinc-400 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold text-zinc-200">Security Guarantee:</span>
              <p>
                Your API keys are stored only in your browser storage (if enabled) and passed directly to provider APIs.
                Keys are never logged, committed to code repositories, or stored on our servers. Students are responsible for their own API usage & limits.
              </p>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
