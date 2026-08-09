export type LLMProviderType = "gemini" | "openai" | "groq" | "anthropic";

export interface ModelOption {
  id: string;
  name: string;
  description: string;
  default?: boolean;
}

export interface QdrantConfig {
  url: string;
  apiKey: string;
  collection: string;
}

export interface ProviderConfig {
  id: LLMProviderType;
  name: string;
  icon: string;
  models: ModelOption[];
  apiKeyPlaceholder: string;
  apiKeyHelpUrl: string;
}

export const PROVIDERS_CONFIG: Record<LLMProviderType, ProviderConfig> = {
  gemini: {
    id: "gemini",
    name: "Google Gemini",
    icon: "Sparkles",
    models: [
      { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", description: "Fast, versatile model for general tasks", default: true },
      { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", description: "High-performance multimodal model" },
      { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", description: "Complex reasoning & long context" },
      { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", description: "Lightweight & responsive" },
    ],
    apiKeyPlaceholder: "AIzaSy...",
    apiKeyHelpUrl: "https://aistudio.google.com/app/apikey",
  },
  openai: {
    id: "openai",
    name: "OpenAI",
    icon: "Bot",
    models: [
      { id: "gpt-4o", name: "GPT-4o", description: "Flagship intelligence & speed", default: true },
      { id: "gpt-4o-mini", name: "GPT-4o Mini", description: "Fast, cost-efficient model" },
      { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", description: "Standard conversational model" },
    ],
    apiKeyPlaceholder: "sk-proj-...",
    apiKeyHelpUrl: "https://platform.openai.com/api-keys",
  },
  groq: {
    id: "groq",
    name: "Groq (Llama / Mixtral)",
    icon: "Zap",
    models: [
      { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B", description: "Ultra-fast open weights flagship", default: true },
      { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B", description: "Mixture of experts architecture" },
      { id: "gemma2-9b-it", name: "Gemma 2 9B", description: "High efficiency open model" },
    ],
    apiKeyPlaceholder: "gsk_...",
    apiKeyHelpUrl: "https://console.groq.com/keys",
  },
  anthropic: {
    id: "anthropic",
    name: "Anthropic Claude",
    icon: "Cpu",
    models: [
      { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet", description: "Exceptional coding & reasoning", default: true },
      { id: "claude-3-haiku-20240307", name: "Claude 3 Haiku", description: "Lightweight & high speed" },
    ],
    apiKeyPlaceholder: "sk-ant-...",
    apiKeyHelpUrl: "https://console.anthropic.com/settings/keys",
  },
};

export interface AgentMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  name?: string;
  tool_call_id?: string;
}

export interface AgentRunStepInput {
  provider: LLMProviderType;
  apiKey: string;
  model: string;
  systemInstruction: string;
  userPrompt: string;
  messagesHistory?: AgentMessage[];
  availableTools?: Array<{
    name: string;
    description: string;
    inputSchema: any;
  }>;
}

export interface ToolCallRequest {
  id: string;
  name: string;
  arguments: Record<string, any>;
}

export interface AgentRunStepResult {
  text?: string;
  toolCalls?: ToolCallRequest[];
  finishReason?: string;
  error?: string;
}
