"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import ApiConfigModal from "@/components/workshop/ApiConfigModal";
import OnboardingModal from "@/components/workshop/OnboardingModal";
import DemoAgentView from "@/components/workshop/DemoAgentView";
import AgentBuilderForm, { AgentConfig } from "@/components/workshop/AgentBuilderForm";
import AgentPlayground from "@/components/workshop/AgentPlayground";
import TestCasesManager, { TestCase } from "@/components/workshop/TestCasesManager";
import AssignmentsView from "@/components/workshop/AssignmentsView";
import SubmissionModal from "@/components/workshop/SubmissionModal";
import { LLMProviderType } from "@/lib/providers/types";
import { WORKSHOP_TOOLS } from "@/lib/tools/registry";
import {
  Key,
  Sparkles,
  Bot,
  Play,
  ListChecks,
  BookOpen,
  Award,
  HelpCircle,
  Wrench,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from "lucide-react";

const LOCAL_STORAGE_KEY_CONFIG = "gdg_workshop_api_config";
const LOCAL_STORAGE_AGENT_CONFIG = "gdg_workshop_agent_config";

export default function WorkshopPage() {
  const [activeTab, setActiveTab] = useState<"builder" | "playground" | "tests" | "assignments" | "demo">("builder");

  // BYO API Key State
  const [provider, setProvider] = useState<LLMProviderType>("gemini");
  const [apiKey, setApiKey] = useState<string>("");
  const [model, setModel] = useState<string>("gemini-2.5-flash");
  const [rememberKey, setRememberKey] = useState<boolean>(true);
  const [apiModalOpen, setApiModalOpen] = useState<boolean>(false);

  // Guided Onboarding State
  const [onboardingOpen, setOnboardingOpen] = useState<boolean>(false);

  // Submission Modal State
  const [submissionOpen, setSubmissionOpen] = useState<boolean>(false);

  // Agent Configuration State
  const [agentConfig, setAgentConfig] = useState<AgentConfig>({
    name: "StudyMate",
    goal: "Help students prepare for exams by analyzing their syllabus and finding useful resources.",
    systemInstruction: `You are StudyMate, an expert academic study assistant for students.
Your mission is to analyze study syllabi, search for high quality learning resources, organize realistic study plans, and generate summary study guides.
Always break down complex concepts into simple bullet points, use your tools when needed, and maintain an encouraging, friendly tone.`,
    selectedToolIds: ["search_web", "read_file", "calculate", "create_document", "task_manager"],
  });

  const [testCases, setTestCases] = useState<TestCase[]>([]);

  // Load saved credentials & agent config on mount
  useEffect(() => {
    try {
      const savedApi = localStorage.getItem(LOCAL_STORAGE_KEY_CONFIG);
      if (savedApi) {
        const parsed = JSON.parse(savedApi);
        if (parsed.provider) setProvider(parsed.provider);
        if (parsed.apiKey) setApiKey(parsed.apiKey);
        if (parsed.model) setModel(parsed.model);
        if (parsed.rememberKey !== undefined) setRememberKey(parsed.rememberKey);
      } else {
        // Open API key setup modal automatically if no key is stored
        setApiModalOpen(true);
      }

      const savedAgent = localStorage.getItem(LOCAL_STORAGE_AGENT_CONFIG);
      if (savedAgent) {
        setAgentConfig(JSON.parse(savedAgent));
      }
    } catch (e) {
      console.warn("Could not load local storage credentials", e);
    }
  }, []);

  // Save changes to local storage if rememberKey is true
  const handleSaveApiConfig = (newConfig: {
    provider: LLMProviderType;
    apiKey: string;
    model: string;
    rememberKey: boolean;
  }) => {
    setProvider(newConfig.provider);
    setApiKey(newConfig.apiKey);
    setModel(newConfig.model);
    setRememberKey(newConfig.rememberKey);

    if (newConfig.rememberKey) {
      localStorage.setItem(LOCAL_STORAGE_KEY_CONFIG, JSON.stringify(newConfig));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY_CONFIG);
    }
  };

  const handleAgentConfigChange = (newConfig: AgentConfig) => {
    setAgentConfig(newConfig);
    try {
      localStorage.setItem(LOCAL_STORAGE_AGENT_CONFIG, JSON.stringify(newConfig));
    } catch (e) {}
  };

  const handleSelectAssignment = (level: number, title: string, requiredTools: string[]) => {
    setAgentConfig((prev) => ({
      ...prev,
      selectedToolIds: Array.from(new Set([...prev.selectedToolIds, ...requiredTools])),
    }));
    setActiveTab("builder");
  };

  return (
    <div className="relative min-h-screen bg-zinc-950 text-white flex flex-col pt-36 pb-12 px-4 md:px-8 overflow-x-hidden select-none">
      
      {/* Background Gridlines & Glowing Orbs */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(63,63,70,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(63,63,70,0.06)_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#09090b_95%)] pointer-events-none" />

      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-purple-600/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Floating Navbar */}
      <Navbar />

      <div className="max-w-7xl mx-auto w-full flex flex-col gap-6 relative z-10">
        
        {/* Header Title Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 px-2 text-left">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-cyan-950/40 border border-cyan-800/40">
                GDG Student Workshop
              </span>
              <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-purple-950/40 border border-purple-800/40">
                Agentic AI Platform
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-blue-500">
              Agent Builder & Workshop Playground
            </h1>
            <p className="text-zinc-400 text-xs md:text-sm max-w-2xl leading-relaxed">
              Assemble your own autonomous AI agent using BYO API keys. Choose tools, set instructions, run live playgrounds, execute test suites, and submit your assignment.
            </p>
          </div>

          {/* BYO API Key Status Bar */}
          <div className="flex flex-wrap items-center gap-3 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-3 backdrop-blur-md shadow-xl">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-950/60 border border-blue-800/60 flex items-center justify-center text-blue-400">
                <Key className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">BYO API Status</span>
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  {apiKey ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      {provider.toUpperCase()} ({model})
                    </>
                  ) : (
                    <span className="text-amber-400">Key Needed</span>
                  )}
                </span>
              </div>
            </div>

            <button
              onClick={() => setApiModalOpen(true)}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs px-3.5 py-2 rounded-xl transition-all border border-zinc-700 flex items-center gap-1.5 cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-blue-400" /> Key Settings
            </button>

            <button
              onClick={() => setOnboardingOpen(true)}
              className="bg-blue-950/40 border border-blue-800/40 text-blue-300 hover:bg-blue-900/50 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" /> Guide
            </button>
          </div>
        </div>

        {/* Tab Navigation Ribbon */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-zinc-900 select-none">
          <button
            onClick={() => setActiveTab("builder")}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "builder"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                : "bg-zinc-900/40 border border-zinc-800/80 text-zinc-400 hover:text-white"
            }`}
          >
            <Bot className="w-4 h-4" /> Agent Builder
          </button>

          <button
            onClick={() => setActiveTab("playground")}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "playground"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                : "bg-zinc-900/40 border border-zinc-800/80 text-zinc-400 hover:text-white"
            }`}
          >
            <Play className="w-4 h-4 fill-current" /> Playground & Activity Stream
          </button>

          <button
            onClick={() => setActiveTab("tests")}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "tests"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                : "bg-zinc-900/40 border border-zinc-800/80 text-zinc-400 hover:text-white"
            }`}
          >
            <ListChecks className="w-4 h-4" /> Test Suite
          </button>

          <button
            onClick={() => setActiveTab("assignments")}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "assignments"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                : "bg-zinc-900/40 border border-zinc-800/80 text-zinc-400 hover:text-white"
            }`}
          >
            <BookOpen className="w-4 h-4" /> Workshop Challenges
          </button>

          <button
            onClick={() => setActiveTab("demo")}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "demo"
                ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/20"
                : "bg-zinc-900/40 border border-zinc-800/80 text-zinc-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-300" /> Interactive Demo
          </button>

          <button
            onClick={() => setSubmissionOpen(true)}
            className="ml-auto bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold px-4 py-2.5 rounded-2xl transition-all shadow-lg shadow-amber-600/20 flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Award className="w-4 h-4" /> Submit Assignment
          </button>
        </div>

        {/* Tab View Container */}
        <div className="relative z-10">
          {activeTab === "builder" && (
            <AgentBuilderForm
              config={agentConfig}
              onChange={handleAgentConfigChange}
              onLaunchPlayground={() => setActiveTab("playground")}
              hasApiKey={Boolean(apiKey)}
              onOpenApiConfig={() => setApiModalOpen(true)}
            />
          )}

          {activeTab === "playground" && (
            <AgentPlayground
              config={agentConfig}
              provider={provider}
              apiKey={apiKey}
              model={model}
              onOpenApiConfig={() => setApiModalOpen(true)}
            />
          )}

          {activeTab === "tests" && (
            <TestCasesManager
              config={agentConfig}
              provider={provider}
              apiKey={apiKey}
              model={model}
              onOpenApiConfig={() => setApiModalOpen(true)}
            />
          )}

          {activeTab === "assignments" && (
            <AssignmentsView
              onSelectAssignment={handleSelectAssignment}
              onSubmitAssignment={() => setSubmissionOpen(true)}
            />
          )}

          {activeTab === "demo" && (
            <DemoAgentView onStartOwnAgent={() => setActiveTab("builder")} />
          )}
        </div>

        {/* Footer */}
        <footer className="w-full border-t border-zinc-900/80 py-6 text-center text-xs text-zinc-500 flex flex-col items-center gap-1 select-none">
          <p>© 2026 OpenAgent ~ GDG Agent Builder & Workshop Platform.</p>
          <span className="text-[10px] text-zinc-600">Built for Google Developer Groups (GDG) Agentic AI Workshops.</span>
        </footer>

      </div>

      {/* Modals */}
      <ApiConfigModal
        isOpen={apiModalOpen}
        onClose={() => setApiModalOpen(false)}
        provider={provider}
        apiKey={apiKey}
        model={model}
        rememberKey={rememberKey}
        onSave={handleSaveApiConfig}
      />

      <OnboardingModal
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
        onStartBuilding={() => setActiveTab("builder")}
        onTryDemo={() => setActiveTab("demo")}
      />

      <SubmissionModal
        isOpen={submissionOpen}
        onClose={() => setSubmissionOpen(false)}
        config={agentConfig}
        testCases={testCases}
      />

    </div>
  );
}
