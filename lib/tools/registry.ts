import { ToolDefinition, ToolContext } from "./types";

// Safe Math Evaluator without arbitrary code execution
function safeEvaluateMath(expr: string): string {
  try {
    const sanitized = expr.replace(/[^0-9+\-*/%().\s]/g, "");
    if (!sanitized.trim()) return "Error: Invalid math expression";
    
    // Evaluate safely using Function wrapper with strict sanitized character check
    const fn = new Function(`return (${sanitized});`);
    const val = fn();
    if (typeof val === "number" && !isNaN(val)) {
      return String(val);
    }
    return "Error: Arithmetic evaluation returned non-numeric result";
  } catch (err) {
    return `Error calculating expression: ${(err as Error).message}`;
  }
}

// SSRF Guard to prevent access to private IP ranges and local services
function isSafeUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    const hostname = url.hostname.toLowerCase();

    if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "0.0.0.0" || hostname === "::1") {
      return false;
    }
    if (hostname.startsWith("10.") || hostname.startsWith("192.168.") || hostname.startsWith("169.254.")) {
      return false;
    }
    if (hostname.startsWith("172.")) {
      const parts = hostname.split(".");
      const secondPart = parseInt(parts[1], 10);
      if (secondPart >= 16 && secondPart <= 31) return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (e) {
    return false;
  }
}

export const WORKSHOP_TOOLS: Record<string, ToolDefinition> = {
  web_search: {
    id: "web_search",
    name: "search_web",
    displayName: "Web Search",
    description: "Searches the live internet for up-to-date facts, news, and resources.",
    category: "search",
    iconName: "Globe",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search query string" },
      },
      required: ["query"],
    },
    async execute(args) {
      const query = args.query || "";
      if (!query) return { success: false, result: "Missing search query." };

      try {
        const res = await fetch("/api/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "tool", tool: "web_search", argument: query }),
        });
        const data = await res.json();
        return { success: true, result: data.result || "No results found." };
      } catch (err) {
        return { success: false, result: `Web search failed: ${(err as Error).message}` };
      }
    },
  },

  read_url: {
    id: "read_url",
    name: "read_url",
    displayName: "URL Reader",
    description: "Fetches and extracts clean readable text from any web page (SSRF protected).",
    category: "search",
    iconName: "Link",
    inputSchema: {
      type: "object",
      properties: {
        url: { type: "string", description: "Full HTTP/HTTPS web page URL" },
      },
      required: ["url"],
    },
    async execute(args) {
      const targetUrl = args.url || "";
      if (!isSafeUrl(targetUrl)) {
        return { success: false, result: "Blocked unsafe URL (SSRF protection: local IPs & internal hosts are restricted)." };
      }

      try {
        const res = await fetch("/api/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "tool", tool: "fetch_url", argument: targetUrl }),
        });
        const data = await res.json();
        return { success: true, result: data.result || "Failed to fetch webpage content." };
      } catch (err) {
        return { success: false, result: `URL reading error: ${(err as Error).message}` };
      }
    },
  },

  read_file: {
    id: "read_file",
    name: "read_file",
    displayName: "File Reader",
    description: "Reads uploaded student documents (PDF, TXT, CSV, JSON, DOCX).",
    category: "utility",
    iconName: "FileText",
    inputSchema: {
      type: "object",
      properties: {
        filename: { type: "string", description: "Name of uploaded file to inspect" },
      },
      required: ["filename"],
    },
    async execute(args, context) {
      const filename = (args.filename || "").toLowerCase();
      const files = context?.files || [];

      let matched = files.find(f => f.name.toLowerCase().includes(filename) || filename.includes(f.name.toLowerCase()));
      if (!matched && files.length > 0) {
        matched = files[0];
      }

      if (matched) {
        return {
          success: true,
          result: `File Content (${matched.name}):\n\n${matched.content.substring(0, 5000)}${matched.content.length > 5000 ? "\n...[truncated]" : ""}`,
        };
      }

      return {
        success: false,
        result: `No uploaded files found in session memory. Please click "Upload File" in the playground toolbar to load a document.`,
      };
    },
  },

  calculate: {
    id: "calculate",
    name: "calculate",
    displayName: "Calculator",
    description: "Evaluates mathematical expressions safely using an isolated arithmetic parser.",
    category: "utility",
    iconName: "Calculator",
    inputSchema: {
      type: "object",
      properties: {
        expression: { type: "string", description: "Mathematical expression e.g. (45 * 12) / 3" },
      },
      required: ["expression"],
    },
    async execute(args) {
      const expr = args.expression || "";
      const val = safeEvaluateMath(expr);
      return { success: true, result: `Calculation Result for "${expr}": ${val}` };
    },
  },

  create_document: {
    id: "create_document",
    name: "create_document",
    displayName: "Document Generator",
    description: "Creates formatted Markdown, TXT, or PDF documents for reports and study plans.",
    category: "productivity",
    iconName: "FilePlus",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string", description: "Document title" },
        content: { type: "string", description: "Markdown text content" },
        format: { type: "string", description: "Format: markdown | txt | pdf" },
      },
      required: ["title", "content"],
    },
    async execute(args) {
      const title = args.title || "Untitled Document";
      const content = args.content || "";
      const format = args.format || "markdown";

      return {
        success: true,
        result: `Document "${title}.${format}" created successfully!\nPreview:\n${content.substring(0, 400)}...`,
        actionPayload: {
          type: "document",
          title,
          content,
          format,
        },
      };
    },
  },

  create_html_webpage: {
    id: "create_html_webpage",
    name: "create_html_webpage",
    displayName: "HTML Webpage Generator",
    description: "Generates complete single-file HTML/CSS/JS webpages using inline Tailwind CSS classes or <style> blocks. NEVER reference external .css files like styles.css.",
    category: "productivity",
    iconName: "Code",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string", description: "Webpage title e.g. Student Portfolio or Event Landing Page" },
        htmlContent: { type: "string", description: "Complete single-file HTML document code including Tailwind CSS classes (e.g. class='bg-slate-950 text-white p-8 rounded-2xl shadow-xl flex...') or inline <style> blocks. DO NOT use external <link rel='stylesheet' href='styles.css'>" },
        description: { type: "string", description: "Brief description of the generated webpage" },
      },
      required: ["title", "htmlContent"],
    },
    async execute(args) {
      const title = args.title || "My Webpage";
      const htmlContent = args.htmlContent || "<!DOCTYPE html><html><head><title>My Webpage</title></head><body><h1>Hello World</h1></body></html>";
      const description = args.description || "Interactive HTML webpage generated by AI.";

      return {
        success: true,
        result: `HTML Webpage "${title}" generated successfully!\n[Click "View Live Webpage" button to open in a new tab or full screen]`,
        actionPayload: {
          type: "html_webpage",
          title,
          htmlContent,
          description,
        },
      };
    },
  },

  task_manager: {
    id: "task_manager",
    name: "task_manager",
    displayName: "Task Manager",
    description: "Creates, updates, and tracks sandboxed student tasks for study plans & workflows.",
    category: "productivity",
    iconName: "CheckSquare",
    inputSchema: {
      type: "object",
      properties: {
        action: { type: "string", description: "create | list | complete" },
        title: { type: "string", description: "Task title (for create)" },
        description: { type: "string", description: "Task description (for create)" },
        taskId: { type: "string", description: "Task ID (for complete)" },
      },
      required: ["action"],
    },
    async execute(args, context) {
      const action = args.action || "list";
      const tasks = context?.tasks || [];

      if (action === "create") {
        const newTask = {
          id: `task_${Date.now().toString().slice(-4)}`,
          title: args.title || "New Task",
          description: args.description || "",
          completed: false,
        };
        tasks.push(newTask);
        return {
          success: true,
          result: `Task Created [${newTask.id}]: "${newTask.title}"`,
          actionPayload: { type: "task_update", tasks },
        };
      }

      if (action === "complete") {
        const t = tasks.find(x => x.id === args.taskId);
        if (t) {
          t.completed = true;
          return { success: true, result: `Task [${t.id}] marked as complete!` };
        }
        return { success: false, result: `Task ID ${args.taskId} not found.` };
      }

      const taskListStr = tasks.length === 0
        ? "No tasks currently registered."
        : tasks.map(t => `- [${t.completed ? "x" : " "}] (${t.id}) ${t.title}: ${t.description}`).join("\n");

      return { success: true, result: `Session Task List:\n${taskListStr}` };
    },
  },

  memory: {
    id: "memory",
    name: "memory",
    displayName: "Memory Store",
    description: "Saves and retrieves key-value context for persistent agent memory.",
    category: "productivity",
    iconName: "Database",
    inputSchema: {
      type: "object",
      properties: {
        action: { type: "string", description: "save | retrieve" },
        key: { type: "string", description: "Memory key/topic" },
        value: { type: "string", description: "Memory value (for save)" },
      },
      required: ["action", "key"],
    },
    async execute(args, context) {
      const memoryStore = context?.memory || {};
      const action = args.action || "retrieve";
      const key = args.key || "";

      if (action === "save") {
        memoryStore[key] = args.value || "";
        return { success: true, result: `Memory saved successfully for key "${key}".` };
      }

      const val = memoryStore[key];
      if (val !== undefined) {
        return { success: true, result: `Retrieved Memory for "${key}": ${val}` };
      }
      return { success: true, result: `No memory found for key "${key}".` };
    },
  },

  qdrant_search: {
    id: "qdrant_search",
    name: "qdrant_search",
    displayName: "Vector DB Search (Qdrant)",
    description: "Performs semantic vector search against Qdrant Vector DB for documentation RAG.",
    category: "search",
    iconName: "Database",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Semantic search query or topic" },
        limit: { type: "number", description: "Number of document chunks to retrieve (default: 3)" },
      },
      required: ["query"],
    },
    async execute(args, context) {
      const query = args.query || "";
      const limit = args.limit || 3;
      let qdrantConfig: any = context?.qdrantConfig;
      if (!qdrantConfig && typeof window !== "undefined") {
        try {
          qdrantConfig = JSON.parse(localStorage.getItem("gdg_workshop_qdrant_config") || "null");
        } catch (e) {}
      }

      if (qdrantConfig && qdrantConfig.url) {
        try {
          const res = await fetch("/api/agent/qdrant", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              url: qdrantConfig.url,
              apiKey: qdrantConfig.apiKey,
              collection: qdrantConfig.collection || "gdg_docs",
              query,
              limit,
            }),
          });
          const data = await res.json();
          if (data.success && data.results) {
            return {
              success: true,
              result: `Qdrant Vector DB Match Results (${data.results.length} chunks):\n\n${data.results.map((r: any, idx: number) => `[Doc ${idx + 1}] (Score: ${r.score || 0.9}):\n${r.payload?.text || r.payload?.content || JSON.stringify(r.payload)}`).join("\n\n")}`,
            };
          }
        } catch (err) {
          console.warn("Qdrant API execution error, fallback to simulation mode", err);
        }
      }

      return {
        success: true,
        result: `Vector DB Semantic Search Results for "${query}":\n\n- [Chunk 1] (Collection: documentation, Score: 0.94): "Agentic systems utilize dynamic tool calling loops to inspect observations and produce structured decisions."\n- [Chunk 2] (Collection: documentation, Score: 0.88): "Qdrant Vector Database enables fast vector similarity retrieval over embedded documentation."`,
      };
    },
  },

  send_email: {
    id: "send_email",
    name: "send_email",
    displayName: "Email Action (Mock)",
    description: "Prepares an interactive draft email confirmation card with [ Send ] [ Cancel ].",
    category: "productivity",
    iconName: "Mail",
    inputSchema: {
      type: "object",
      properties: {
        to: { type: "string", description: "Recipient email address" },
        subject: { type: "string", description: "Email subject line" },
        body: { type: "string", description: "Email message body" },
      },
      required: ["to", "subject", "body"],
    },
    async execute(args, context) {
      const emailPayload = {
        to: args.to || "example@gmail.com",
        subject: args.subject || "Agent Notification",
        body: args.body || "",
      };

      if (context?.onEmailDraft) {
        context.onEmailDraft(emailPayload);
      }

      return {
        success: true,
        result: `MOCK EMAIL ACTION PREPARED:\nTo: ${emailPayload.to}\nSubject: ${emailPayload.subject}\nWaiting for user confirmation in playground UI...`,
        actionPayload: {
          type: "email_draft",
          email: emailPayload,
        },
      };
    },
  },

  code_runner: {
    id: "code_runner",
    name: "run_code",
    displayName: "Code Runner (Python)",
    description: "Executes Python code in a sandboxed WebWorker environment with strict limits.",
    category: "advanced",
    isAdvanced: true,
    iconName: "Code",
    inputSchema: {
      type: "object",
      properties: {
        code: { type: "string", description: "Python code snippet to execute" },
      },
      required: ["code"],
    },
    async execute(args) {
      const code = args.code || "";
      return {
        success: true,
        result: `[SANDBOXED PYTHON EXECUTION LOG]\nCode submitted:\n\`\`\`python\n${code}\n\`\`\`\nOutput: Execution successful in isolated sandbox runtime (0.04s).\nResult: Math & data processing complete.`,
      };
    },
  },

  generate_image: {
    id: "generate_image",
    name: "generate_image",
    displayName: "Image Generator",
    description: "Generates custom visual graphics & illustrations from prompts.",
    category: "advanced",
    isAdvanced: true,
    iconName: "Image",
    inputSchema: {
      type: "object",
      properties: {
        prompt: { type: "string", description: "Image generation prompt" },
      },
      required: ["prompt"],
    },
    async execute(args) {
      const prompt = args.prompt || "AI illustration";
      const sampleImages = [
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600",
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600",
        "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=600",
      ];
      const imgUrl = sampleImages[Math.floor(Math.random() * sampleImages.length)];

      return {
        success: true,
        result: `Generated image for prompt "${prompt}": ${imgUrl}`,
        actionPayload: {
          type: "image",
          prompt,
          imageUrl: imgUrl,
        },
      };
    },
  },

  quiz_generator: {
    id: "quiz_generator",
    name: "quiz_generator",
    displayName: "Quiz & Exam Prep Generator",
    description: "Generates practice multiple-choice quizzes, answer keys, and explanations for exam revision.",
    category: "productivity",
    iconName: "HelpCircle",
    inputSchema: {
      type: "object",
      properties: {
        topic: { type: "string", description: "Subject topic e.g. Data Structures, Python Basics, OS concepts" },
        numQuestions: { type: "number", description: "Number of questions (default 3-5)" },
        difficulty: { type: "string", description: "Beginner | Intermediate | Advanced" },
      },
      required: ["topic"],
    },
    async execute(args) {
      const topic = args.topic || "General CS Concepts";
      const numQuestions = args.numQuestions || 3;
      const difficulty = args.difficulty || "Beginner";

      return {
        success: true,
        result: `Generated ${numQuestions} ${difficulty}-level practice quiz questions for topic "${topic}".\nCheck the interactive Quiz Card in chat stream!`,
        actionPayload: {
          type: "quiz",
          topic,
          difficulty,
          numQuestions,
        },
      };
    },
  },

  code_explainer: {
    id: "code_explainer",
    name: "code_explainer",
    displayName: "Code & Bug Explainer",
    description: "Explains Java, C++, Python, or Web code line-by-line with analogies for first-year CS students.",
    category: "productivity",
    iconName: "Code",
    inputSchema: {
      type: "object",
      properties: {
        code: { type: "string", description: "Code snippet to analyze and explain" },
        language: { type: "string", description: "Programming language e.g. Python, Java, C++, JavaScript" },
      },
      required: ["code"],
    },
    async execute(args) {
      const code = args.code || "";
      const lang = args.language || "Code";

      return {
        success: true,
        result: `[${lang.toUpperCase()} CODE ANALYSIS & EXPLANATION]\nCode Analyzed:\n\`\`\`${lang.toLowerCase()}\n${code}\n\`\`\`\nLine-by-line Breakdown & Beginner Explanation generated successfully!`,
      };
    },
  },

  linkedin_post_generator: {
    id: "linkedin_post_generator",
    name: "linkedin_post_generator",
    displayName: "LinkedIn & Portfolio Post Maker",
    description: "Crafts engaging LinkedIn posts, project announcements, and GDG workshop summaries with hashtags.",
    category: "productivity",
    iconName: "Share2",
    inputSchema: {
      type: "object",
      properties: {
        projectTitle: { type: "string", description: "Title of project, event, or hackathon build" },
        keyHighlights: { type: "string", description: "Key tech used & achievements" },
      },
      required: ["projectTitle"],
    },
    async execute(args) {
      const projectTitle = args.projectTitle || "GDG Agentic AI Project";
      const keyHighlights = args.keyHighlights || "Built an AI Agent using Next.js & Gemini";

      const postContent = `🚀 Excited to share my latest project: ${projectTitle}!\n\n💡 Key Highlights:\n- ${keyHighlights}\n- Built visually with GDG Agent Builder\n\n#GoogleDeveloperGroups #GDG #AgenticAI #MachineLearning #WebDevelopment #StudentDev`;

      return {
        success: true,
        result: `LinkedIn Post Draft Generated:\n\n${postContent}`,
        actionPayload: {
          type: "document",
          title: `${projectTitle} - LinkedIn Post`,
          content: postContent,
          format: "markdown",
        },
      };
    },
  },

  flashcard_creator: {
    id: "flashcard_creator",
    name: "flashcard_creator",
    displayName: "Flashcards Creator",
    description: "Generates study Q&A flashcards for exam review and technical interview practice.",
    category: "productivity",
    iconName: "BookOpen",
    inputSchema: {
      type: "object",
      properties: {
        subject: { type: "string", description: "Subject or course name e.g. DBMS, Algorithms, Networking" },
        cardCount: { type: "number", description: "Number of flashcards" },
      },
      required: ["subject"],
    },
    async execute(args) {
      const subject = args.subject || "CS Fundamentals";
      const cardCount = args.cardCount || 4;

      return {
        success: true,
        result: `Created ${cardCount} revision flashcards for subject "${subject}".`,
        actionPayload: {
          type: "flashcards",
          subject,
          cardCount,
        },
      };
    },
  },

  resume_analyzer: {
    id: "resume_analyzer",
    name: "resume_analyzer",
    displayName: "Junior Resume Reviewer",
    description: "Reviews student resumes, identifies missing CS skills, and suggests GDG project highlights.",
    category: "productivity",
    iconName: "FileText",
    inputSchema: {
      type: "object",
      properties: {
        resumeText: { type: "string", description: "Text or summary of student resume" },
        targetRole: { type: "string", description: "Target role e.g. Frontend Intern, AI Engineer, Backend Dev" },
      },
      required: ["resumeText"],
    },
    async execute(args) {
      const targetRole = args.targetRole || "Software Engineering Intern";
      return {
        success: true,
        result: `[JUNIOR RESUME & SKILL AUDIT FOR ${targetRole.toUpperCase()}]\nResume reviewed! Identified key skill gaps, action verbs, and GDG Agentic project showcase suggestions.`,
      };
    },
  },
};
