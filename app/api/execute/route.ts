import { NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

// Safe math evaluator helper
function safeEvalMath(expression: string): number | string {
  // Allow only numbers, operators (+, -, *, /, %, .), parentheses, and spaces
  const sanitized = expression.replace(/[^0-9+\-*/%().\s]/g, "");
  try {
    // eslint-disable-next-line no-new-func
    const result = new Function(`return (${sanitized});`)();
    if (typeof result === "number" && !isNaN(result)) {
      return result;
    }
    return "Error: Invalid calculation result";
  } catch (err) {
    return `Error evaluating math: ${(err as Error).message}`;
  }
}

// Scrape DuckDuckGo HTML search results
async function searchWeb(query: string): Promise<string> {
  try {
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to query DuckDuckGo (status: ${response.status})`);
    }

    const html = await response.text();

    // Regular expressions to extract search results
    const results: Array<{ title: string; link: string; snippet: string }> = [];

    // DuckDuckGo static HTML results are structured in divs with class "result results_links results_links_deep web-result"
    // Inside there is a class "result__snippet" and "result__snippet"
    // Let's parse result links and snippets
    const titleRegex = /<a class="result__url"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
    const snippetRegex = /<a class="result__snippet"[^>]*>([\s\S]*?)<\/a>/gi;

    let titleMatch;
    const titles: Array<{ link: string; title: string }> = [];
    while ((titleMatch = titleRegex.exec(html)) !== null && titles.length < 5) {
      // Decode href if it is DDG redirection url
      let link = titleMatch[1];
      if (link.includes("uddg=")) {
        const match = link.match(/uddg=([^&]+)/);
        if (match) {
          link = decodeURIComponent(match[1]);
        }
      }
      const title = titleMatch[2].replace(/<[^>]+>/g, "").trim();
      titles.push({ link, title });
    }

    let snippetMatch;
    const snippets: string[] = [];
    while ((snippetMatch = snippetRegex.exec(html)) !== null && snippets.length < 5) {
      const snippet = snippetMatch[1].replace(/<[^>]+>/g, "").trim();
      snippets.push(snippet);
    }

    for (let i = 0; i < titles.length; i++) {
      results.push({
        title: titles[i].title,
        link: titles[i].link,
        snippet: snippets[i] || "No description available.",
      });
    }

    if (results.length === 0) {
      return `No results found for search query: "${query}"`;
    }

    return results
      .map((r, idx) => `[${idx + 1}] "${r.title}"\nURL: ${r.link}\nSnippet: ${r.snippet}\n`)
      .join("\n");
  } catch (error) {
    console.error("Web Search Error:", error);
    return `Error searching the web: ${(error as Error).message}`;
  }
}

// Scrape URL contents
async function scrapeUrl(targetUrl: string): Promise<string> {
  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${targetUrl} (Status: ${response.status})`);
    }

    const html = await response.text();

    // Strip scripts and styles
    let cleaned = html
      .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "")
      .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, "");

    // Strip remaining HTML tags
    cleaned = cleaned.replace(/<[^>]+>/g, " ");

    // Normalize spacing
    cleaned = cleaned.replace(/\s+/g, " ").trim();

    // Return truncated text
    return cleaned.substring(0, 3500) + (cleaned.length > 3500 ? "..." : "");
  } catch (error) {
    return `Error fetching or scraping URL: ${(error as Error).message}`;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === "llm") {
      const { model, prompt, systemPrompt, temperature, maxTokens } = body;
      const selectedModel = model || "gemini-3.1-flash-lite";

      const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
      if (!apiKey) {
        return NextResponse.json(
          { error: "GOOGLE_GENERATIVE_AI_API_KEY environment variable is missing" },
          { status: 500 }
        );
      }

      const result = await generateText({
        model: google(selectedModel),
        prompt: prompt || "",
        system: systemPrompt,
        temperature: typeof temperature === "number" ? temperature : undefined,
        maxTokens: typeof maxTokens === "number" ? maxTokens : undefined,
      } as any);

      return NextResponse.json({ text: result.text });
    }

    if (action === "tool") {
      const { tool, argument } = body;

      if (tool === "web_search") {
        const searchResult = await searchWeb(argument);
        return NextResponse.json({ result: searchResult });
      }

      if (tool === "calculator") {
        const mathResult = safeEvalMath(argument);
        return NextResponse.json({ result: String(mathResult) });
      }

      if (tool === "fetch_url") {
        const scrapResult = await scrapeUrl(argument);
        return NextResponse.json({ result: scrapResult });
      }

      if (tool === "generate_image") {
        // Return a mock placeholder indicating image generation
        return NextResponse.json({
          result: `Image generated successfully for prompt "${argument}". Output saved as: https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600`,
        });
      }

      return NextResponse.json({ error: `Unknown tool type: ${tool}` }, { status: 400 });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
