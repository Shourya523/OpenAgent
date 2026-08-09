export type ToolCategory = "search" | "utility" | "productivity" | "advanced";

export interface ToolContext {
  sessionId?: string;
  tasks?: Array<{ id: string; title: string; description: string; completed: boolean }>;
  memory?: Record<string, any>;
  files?: Array<{ name: string; content: string; type: string }>;
  qdrantConfig?: any;
  onEmailDraft?: (email: { to: string; subject: string; body: string }) => void;
}

export interface ToolDefinition {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: ToolCategory;
  isAdvanced?: boolean;
  iconName: string;
  inputSchema: {
    type: "object";
    properties: Record<string, { type: string; description: string; required?: boolean }>;
    required?: string[];
  };
  execute: (args: Record<string, any>, context?: ToolContext) => Promise<{
    success: boolean;
    result: string;
    actionPayload?: any;
    metadata?: Record<string, any>;
  }>;
}
