"use client";

import React from "react";
import { WORKSHOP_TOOLS } from "@/lib/tools/registry";
import { ToolDefinition } from "@/lib/tools/types";
import {
  Sparkles,
  Bot,
  Target,
  FileCode,
  Wrench,
  Globe,
  Link,
  FileText,
  Calculator,
  FilePlus,
  CheckSquare,
  Database,
  Mail,
  Code,
  Image,
  CheckCircle2,
  Play,
  BookOpen,
  Search,
  AlertTriangle,
  HelpCircle,
  Share2,
  Award,
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  Globe,
  Link,
  FileText,
  Calculator,
  FilePlus,
  CheckSquare,
  Database,
  Mail,
  Code,
  Image,
  HelpCircle,
  Share2,
  BookOpen,
  Award,
};

export interface AgentConfig {
  name: string;
  goal: string;
  systemInstruction: string;
  selectedToolIds: string[];
}

interface AgentBuilderFormProps {
  config: AgentConfig;
  onChange: (newConfig: AgentConfig) => void;
  onLaunchPlayground: () => void;
  hasApiKey: boolean;
  onOpenApiConfig: () => void;
}

export default function AgentBuilderForm({
  config,
  onChange,
  onLaunchPlayground,
  hasApiKey,
  onOpenApiConfig,
}: AgentBuilderFormProps) {

  const handleToolToggle = (toolId: string) => {
    const isSelected = config.selectedToolIds.includes(toolId);
    let updated: string[];
    if (isSelected) {
      updated = config.selectedToolIds.filter((id) => id !== toolId);
    } else {
      updated = [...config.selectedToolIds, toolId];
    }
    onChange({ ...config, selectedToolIds: updated });
  };

  const handleApplyPreset = (presetType: "studymate" | "researcher" | "sitemaker" | "assistant") => {
    if (presetType === "studymate") {
      onChange({
        name: "StudyMate",
        goal: "Help students prepare for exams by analyzing their syllabus, searching for study guides, and organizing tasks.",
        systemInstruction: `You are StudyMate, an expert academic study assistant for students.
Your mission is to analyze study syllabi, search for high quality learning resources, organize realistic study plans, and generate summary study guides.
Always break down complex concepts into simple bullet points, use your tools when needed, and maintain an encouraging, friendly tone.`,
        selectedToolIds: ["read_file", "search_web", "task_manager", "create_document", "calculate"],
      });
    } else if (presetType === "researcher") {
      onChange({
        name: "DeepResearcher",
        goal: "Search the web, scrape articles, store key insights in memory, and compile research reports.",
        systemInstruction: `You are DeepResearcher, an autonomous research agent.
Search the internet for topic facts, fetch webpage contents using URL reader, store essential findings in memory, and generate a final markdown research report.`,
        selectedToolIds: ["search_web", "read_url", "memory", "create_document"],
      });
    } else if (presetType === "sitemaker") {
      onChange({
        name: "SiteMaker Agent",
        goal: "Build complete, modern, responsive HTML/CSS/JS websites, portfolio sites, and interactive web applications from user prompts or resumes.",
        systemInstruction: `You are SiteMaker Agent, a world-class Frontend Architect & Portfolio Designer (Claude Artifacts Style).
Your goal is to transform student prompts, resumes, or project specifications into gorgeous, responsive, single-file HTML/CSS/JS applications.
ALWAYS call the "create_html_webpage" tool with complete HTML code containing Tailwind CSS styling, dark mode themes, Google Fonts, hover animations, and clean interactive sections so students can preview and launch their live website in full screen!`,
        selectedToolIds: ["create_html_webpage", "read_file", "search_web", "create_document", "generate_image"],
      });
    } else if (presetType === "assistant") {
      onChange({
        name: "OmniAssistant",
        goal: "Autonomous multi-tool assistant capable of processing data, calculating math, draft emails, and running Python code.",
        systemInstruction: `You are OmniAssistant, a versatile agent capable of handling diverse student queries using all available tools.`,
        selectedToolIds: Object.keys(WORKSHOP_TOOLS),
      });
    }
  };

  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 sm:p-8 flex flex-col gap-8 shadow-2xl relative">
      
      {/* Header with Preset Quick Start Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-950/40 border border-blue-800/50 flex items-center justify-center text-blue-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Visual Agent Builder
            </h2>
            <p className="text-xs text-zinc-400">Assemble your agent's identity, behavior instructions, and capabilities.</p>
          </div>
        </div>

        {/* Presets */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mr-1">Presets:</span>
          <button
            type="button"
            onClick={() => handleApplyPreset("studymate")}
            className="text-xs px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-400" /> StudyMate
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset("researcher")}
            className="text-xs px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5 text-purple-400" /> DeepResearcher
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset("sitemaker")}
            className="text-xs px-3 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-cyan-300 hover:text-white hover:border-cyan-700 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" /> Site Maker Agent
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset("assistant")}
            className="text-xs px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> OmniAssistant
          </button>
        </div>
      </div>

      {/* Main Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Agent Name */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
            <Bot className="w-4 h-4 text-blue-400" /> Agent Name
          </label>
          <input
            type="text"
            value={config.name}
            onChange={(e) => onChange({ ...config, name: e.target.value })}
            placeholder="e.g. StudyMate"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Agent Goal */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
            <Target className="w-4 h-4 text-purple-400" /> Agent Goal / Objective
          </label>
          <input
            type="text"
            value={config.goal}
            onChange={(e) => onChange({ ...config, goal: e.target.value })}
            placeholder="e.g. Help students prepare for exams by searching resources..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* System Instructions Area */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
            <FileCode className="w-4 h-4 text-emerald-400" /> System Instructions (Agent Prompt)
          </label>
          <span className="text-[10px] text-zinc-500 font-mono">Defines how your agent thinks & behaves</span>
        </div>
        <textarea
          rows={5}
          value={config.systemInstruction}
          onChange={(e) => onChange({ ...config, systemInstruction: e.target.value })}
          placeholder="You are an intelligent study assistant. Your mission is to..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm font-mono text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-colors leading-relaxed"
        />
      </div>

      {/* Tool Selection Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Tool Capabilities ({config.selectedToolIds.length} Enabled)
            </h3>
          </div>
          <span className="text-xs text-zinc-400">
            Select the tools your agent can call dynamically.
          </span>
        </div>

        {/* Tool Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.values(WORKSHOP_TOOLS).map((tool: ToolDefinition) => {
            const isEnabled = config.selectedToolIds.includes(tool.id);
            const IconComp = ICON_MAP[tool.iconName] || Wrench;

            return (
              <div
                key={tool.id}
                onClick={() => handleToolToggle(tool.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                  isEnabled
                    ? "bg-blue-950/20 border-blue-500/80 shadow-[0_0_20px_rgba(59,130,246,0.12)]"
                    : "bg-zinc-900/30 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/60"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
                        isEnabled
                          ? "bg-blue-900/40 border-blue-500/50 text-blue-300"
                          : "bg-zinc-900 border-zinc-800 text-zinc-500"
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        {tool.displayName}
                      </span>
                      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                        {tool.category} {tool.isAdvanced ? "• Advanced" : ""}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-lg border flex items-center justify-center text-xs transition-colors ${
                      isEnabled
                        ? "bg-blue-500 border-blue-400 text-white"
                        : "border-zinc-700 bg-zinc-900 text-transparent"
                    }`}
                  >
                    {isEnabled && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </div>
                </div>

                <p className="text-[11.5px] text-zinc-400 leading-snug">{tool.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer Button */}
      <div className="pt-4 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Agent ready to launch with {config.selectedToolIds.length} capabilities.</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {!hasApiKey && (
            <button
              type="button"
              onClick={onOpenApiConfig}
              className="text-xs text-amber-400 bg-amber-950/20 border border-amber-900/50 px-3.5 py-2.5 rounded-xl hover:bg-amber-950/40 transition-colors font-semibold cursor-pointer flex items-center gap-1.5"
            >
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Configure API Key First
            </button>
          )}

          <button
            type="button"
            onClick={onLaunchPlayground}
            className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" /> Build & Test Agent
          </button>
        </div>
      </div>

    </div>
  );
}
