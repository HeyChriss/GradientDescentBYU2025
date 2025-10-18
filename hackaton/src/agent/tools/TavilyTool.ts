/**
 * Tavily Tool
 *
 * Simple tool for web search and crawling using Tavily API.
 */

import type { ResultData, ToolParams, ToolResult } from "../core/interfaces";
import { BaseTool } from "./BaseTool";

export interface TavilySearchOptions {
  query: string;
  includeAnswer?: "basic" | "advanced";
}

export interface TavilyCrawlOptions {
  url: string;
  extractDepth?: "basic" | "advanced";
}

interface TavilyClient {
  search: (options: TavilySearchOptions) => Promise<{
    results: Array<{ title: string; url: string; content?: string; score?: number }>;
    answer?: string;
    answer_text?: string;
    summary?: string;
  }>;
  crawl: (url: string, options: { extractDepth?: string }) => Promise<{
    pages?: Array<{ raw_content?: string; content?: string; url?: string }>;
    results?: Array<{ raw_content?: string; content?: string; url?: string }>;
    baseUrl?: string;
    responseTime?: number;
    requestId?: string;
  }>;
}

export class TavilyTool extends BaseTool {
  private client: TavilyClient | null = null;
  private apiKey: string;

  constructor(apiKey: string) {
    super("tavily", "Web search and crawling using Tavily API");
    this.apiKey = apiKey;
  }

  protected async initialize(): Promise<void> {
    try {
      // Dynamic import for tavily
      const { tavily } = await import("@tavily/core");
      this.client = tavily({ apiKey: this.apiKey }) as unknown as TavilyClient;
      console.log("Tavily client initialized successfully");
      await super.initialize(); // Call parent initialize to set isInitialized
    } catch (error) {
      console.error("Failed to initialize Tavily client:", error);
      throw new Error(
        "Tavily client initialization failed. Make sure @tavily/core package is installed.",
      );
    }
  }

  public async search(options: TavilySearchOptions): Promise<ToolResult> {
    const startTime = Date.now();

    try {
      if (!this.isInitialized) {
        await this.initialize();
      }
      console.log(`Tavily search: ${options.query}`);

      if (!this.client) {
        throw new Error("Tavily client not initialized");
      }

      // Simple search call matching the reference
      const results = await this.client.search({
        query: options.query,
        includeAnswer: options.includeAnswer || "advanced",
      });

      return {
        success: true,
        result: {
          query: options.query,
          results: results.results || [],
          answer:
            results.answer || results.answer_text || results.summary || null,
          metadata: {
            timestamp: new Date().toISOString(),
          },
        },
        executionTime: Date.now() - startTime,
      };
    } catch (error) {
      console.error("Tavily search error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown search error",
        executionTime: Date.now() - startTime,
      };
    }
  }

  public async crawl(options: TavilyCrawlOptions): Promise<ToolResult> {
    const startTime = Date.now();

    try {
      if (!this.isInitialized) {
        await this.initialize();
      }
      console.log(`Tavily crawl: ${options.url}`);

      if (!this.client) {
        throw new Error("Tavily client not initialized");
      }

      // Simple crawl call matching the reference
      const results = await this.client.crawl(options.url, {
        extractDepth: options.extractDepth || "advanced",
      });

      console.log("Raw Tavily crawl response keys:", Object.keys(results as Record<string, unknown>));
      console.log("Tavily crawl results.pages:", results.pages?.length);
      console.log("Tavily crawl results.results:", results.results?.length);
      console.log(
        "Full Tavily response (first 500 chars):",
        JSON.stringify(results).substring(0, 500),
      );

      // Tavily returns 'results' array, not 'pages'
      const pages = results.results || results.pages || [];

      return {
        success: true,
        result: {
          url: options.url,
          baseUrl: results.baseUrl,
          results: pages, // Use 'results' to match Tavily's schema
          metadata: {
            timestamp: new Date().toISOString(),
            responseTime: results.responseTime,
            requestId: results.requestId,
          },
        },
        executionTime: Date.now() - startTime,
      };
    } catch (error) {
      console.error("Tavily crawl error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown crawl error",
        executionTime: Date.now() - startTime,
      };
    }
  }

  public async execute(input: ToolParams): Promise<ResultData> {
    const params = input as unknown as {
      method?: string;
      options?: TavilySearchOptions | TavilyCrawlOptions;
    } & TavilySearchOptions;
    // Default to search if no method specified
    if (params.method === "crawl") {
      return this.crawl(
        params.options as TavilyCrawlOptions,
      ) as unknown as ResultData;
    } else {
      return this.search(
        (params.options as TavilySearchOptions) || params,
      ) as unknown as ResultData;
    }
  }

  protected async executeInternal(params: ToolParams): Promise<ResultData> {
    return this.execute(params);
  }

  public getCapabilities(): string[] {
    return ["web_search", "web_crawling"];
  }

  public getParameters(): Record<string, unknown> {
    return {
      search: {
        query: { type: "string", required: true, description: "Search query" },
        includeAnswer: {
          type: "string",
          required: false,
          description: "Include answer: basic or advanced",
        },
      },
      crawl: {
        url: { type: "string", required: true, description: "URL to crawl" },
        extractDepth: {
          type: "string",
          required: false,
          description: "Extract depth: basic or advanced",
        },
      },
    };
  }
}
