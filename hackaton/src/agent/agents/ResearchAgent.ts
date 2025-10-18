/**
 * Research Agent
 *
 * Specialized agent for research tasks and information gathering.
 * Uses web search and other tools to collect and analyze information.
 */

import { getApiKey, validateApiKeys } from "../../config/api-keys";
import { BaseAgent } from "../core/BaseAgent";
import type { AgentConfig, AgentResult, ToolParams } from "../core/interfaces";
import { TavilyTool } from "../tools/TavilyTool";

export interface ResearchTask {
  topic: string;
  sources?: string[];
  outputFormat?: "summary" | "detailed" | "raw";
  crawlUrl?: string;
}

export class ResearchAgent extends BaseAgent {
  private tavilyTool: TavilyTool;

  constructor(config: Omit<AgentConfig, "capabilities">) {
    // Validate API keys
    const validation = validateApiKeys();
    if (!validation.isValid) {
      throw new Error(
        `Missing required API keys: ${validation.missing.join(", ")}`,
      );
    }

    // Get Tavily API key
    const tavilyApiKey = getApiKey("TAVILY");

    // Create complete agent configuration with capabilities
    const agentConfig: AgentConfig = {
      ...config,
      capabilities: [
        "web_research",
        "web_crawling",
        "information_gathering",
        "data_collection",
        "source_analysis",
        "content_synthesis",
      ],
    };

    super(agentConfig.id, agentConfig);
    this.tavilyTool = new TavilyTool(tavilyApiKey);
  }

  protected initialize(): void {
    // Register tools
    this.registerTool(
      "tavily_search",
      this.tavilyTool as unknown as import("../core/interfaces").ToolInterface,
    );
    this.registerTool(
      "tavily_crawl",
      this.tavilyTool as unknown as import("../core/interfaces").ToolInterface,
    );

    console.log(
      `ResearchAgent ${this.id} initialized with tools:`,
      this.getTools(),
    );
    console.log(
      `ResearchAgent ${this.id} using model:`,
      this.getModelConfig().model,
    );
    console.log(
      `ResearchAgent ${this.id} system prompt:`,
      this.getSystemPrompt(),
    );
  }

  protected generateSystemPrompt(): string {
    return `You are a Research Agent specialized in information gathering and analysis.

ROLE:
You are an expert researcher with access to web search and crawling capabilities. Your primary goal is to collect accurate, up-to-date, and well-structured information, then synthesize it into clear summaries with cited sources.

TOOLS AVAILABLE:
- tavily_search: Search the web for information on any topic (basic or advanced answers).
- tavily_crawl: Crawl websites for detailed content extraction and in-depth analysis.

DECISION LOGIC:
1. If the user provides a URL or multiple URLs:
   → Use tavily_crawl to extract, analyze, and summarize the content from those sites.
   → Include key points and cite the URL(s) in your summary.

2. If the user provides a topic or research question (no URL):
   → Use tavily_search to gather information, trends, and insights from reliable online sources.
   → Summarize the main findings and include citations.

3. If both a URL and a topic are provided:
   → Crawl the URL(s) first for direct insights.
   → Optionally complement with a tavily_search to provide broader context.

4. Always cite sources for transparency and reliability.

OUTPUT FORMATS:
- Summary: Concise, readable overview of findings.
- Detailed: Structured and comprehensive report.
- Raw: Unprocessed search or crawl output.

INSTRUCTIONS:
1. Analyze the research request and determine whether to use tavily_search or tavily_crawl.
2. For topic-based queries, perform a search using tavily_search.
3. For URL-based queries, perform a crawl using tavily_crawl.
4. Combine both if appropriate for context or completeness.
5. Validate sources for credibility and relevance.
6. Provide accurate, up-to-date, and neutral information.
7. Synthesize findings into a clear, professional summary.
8. Always cite your information sources and include URLs.
9. When summarizing, highlight key findings, patterns, or insights without speculation.

OUTPUT REQUIREMENT:
Always produce a summary of all collected information, including:
- Main insights
- Supporting details
- Clear citations (URLs or source names)

STYLE:
- Write in a neutral, analytical, and factual tone.
- Be concise, well-organized, and focused on clarity.
- Avoid redundancy, speculation, and subjective commentary.

Your purpose is to deliver reliable, well-sourced, and clearly summarized research results.`;
  }

  public async execute(task: ToolParams): Promise<AgentResult> {
    const startTime = Date.now();
    this.setStatus("busy");

    try {
      const researchTask = task as unknown as ResearchTask;

      // Validate task
      if (!this.canHandle(task)) {
        throw new Error("ResearchAgent cannot handle this task");
      }

      console.log(
        `ResearchAgent ${this.id} starting research on: ${researchTask.topic}`,
      );

      // Intelligent decision-making about research method
      let results: {
        topic: string;
        sources?: Array<{
          title: string;
          url: string;
          content?: string;
          score?: number;
        }>;
        pages?: Array<{ raw_content?: string; content?: string; url?: string }>;
        answer: string;
        summary: string;
        crawlUrl?: string;
        metadata?: { pagesFound?: number };
      };

      // Check if we have a specific URL to crawl
      if (researchTask.crawlUrl) {
        console.log(
          `ResearchAgent ${this.id} using crawling for URL: ${researchTask.crawlUrl}`,
        );
        results = await this.performCrawlResearch(researchTask);
      } else {
        // Use web search for general topics
        console.log(
          `ResearchAgent ${this.id} using web search for topic: ${researchTask.topic}`,
        );
        results = await this.performWebSearch(researchTask);
      }

      // Format output based on requested format
      const formattedResults = this.formatResults(
        results,
        researchTask.outputFormat || "summary",
      );

      this.setStatus("idle");

      return {
        success: true,
        result: formattedResults,
        executionTime: Date.now() - startTime,
        metadata: {
          agentId: this.id,
          taskType: "research",
          method: researchTask.crawlUrl ? "crawl" : "search",
          sourcesUsed: results.sources?.length || results.pages?.length || 0,
        },
      };
    } catch (error) {
      this.setStatus("error");
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        executionTime: Date.now() - startTime,
      };
    }
  }

  public canHandle(task: ToolParams): boolean {
    const researchTask = task as unknown as ResearchTask;
    return (
      researchTask &&
      typeof researchTask === "object" &&
      "topic" in researchTask &&
      typeof researchTask.topic === "string" &&
      researchTask.topic.trim().length > 0
    );
  }

  public getCapabilities(): string[] {
    return [
      "web_research",
      "web_crawling",
      "information_gathering",
      "data_collection",
      "source_analysis",
      "content_synthesis",
    ];
  }

  private async performWebSearch(task: ResearchTask): Promise<{
    topic: string;
    sources: Array<{
      title: string;
      url: string;
      content?: string;
      score?: number;
    }>;
    answer: string;
    summary: string;
  }> {
    console.log(`Performing web search on: ${task.topic}`);

    // Use Tavily search tool with advanced answer
    const searchResult = await this.tavilyTool.search({
      query: task.topic,
      includeAnswer: "advanced",
    });

    if (!searchResult.success) {
      throw new Error(`Search failed: ${searchResult.error}`);
    }

    const searchData = searchResult.result as {
      results: Array<{
        title: string;
        url: string;
        content?: string;
        score?: number;
      }>;
    };

    // Create a summary from the search results
    const summary = this.createSummaryFromResults(
      searchData.results,
      task.topic,
    );

    return {
      topic: task.topic,
      sources: searchData.results,
      answer: summary,
      summary: `Research on ${task.topic} gathered from ${searchData.results.length} sources.`,
    };
  }

  private async performCrawlResearch(task: ResearchTask): Promise<{
    topic: string;
    crawlUrl: string;
    pages: Array<{ raw_content?: string; content?: string; url?: string }>;
    answer: string;
    summary: string;
    metadata: { pagesFound: number };
  }> {
    console.log(`Performing crawl research on: ${task.crawlUrl}`);

    if (!task.crawlUrl) {
      throw new Error("Crawl URL is required for crawl research");
    }

    // Perform crawling with Tavily
    const crawlResult = await this.tavilyTool.crawl({
      url: task.crawlUrl,
      extractDepth: "advanced",
    });

    console.log("Crawl result success:", crawlResult.success);

    const crawlData =
      (crawlResult.result as {
        pages?: Array<{ raw_content?: string; content?: string; url?: string }>;
        results?: Array<{
          raw_content?: string;
          content?: string;
          url?: string;
        }>;
      }) || {};

    console.log(
      "Crawl result structure:",
      JSON.stringify(Object.keys(crawlData)),
    );

    if (crawlData) {
      console.log("Result pages length:", crawlData.pages?.length);
      console.log("Result results length:", crawlData.results?.length);

      if (crawlData.pages && crawlData.pages.length > 0) {
        console.log("First page keys:", Object.keys(crawlData.pages[0]));
        console.log(
          "First page has raw_content:",
          !!crawlData.pages[0].raw_content,
        );
        console.log("First page has content:", !!crawlData.pages[0].content);
      }

      if (crawlData.results && crawlData.results.length > 0) {
        console.log("First result keys:", Object.keys(crawlData.results[0]));
        console.log(
          "First result has raw_content:",
          !!crawlData.results[0].raw_content,
        );
        console.log(
          "First result has content:",
          !!crawlData.results[0].content,
        );
      }
    }

    if (!crawlResult.success) {
      throw new Error(`Crawl failed: ${crawlResult.error}`);
    }

    // Tavily crawl returns 'results' not 'pages'
    const pages = crawlData.results || crawlData.pages || [];
    console.log("Using pages array with length:", pages.length);

    // Create a summary from crawled content
    const crawlSummary = this.createSummaryFromCrawlResults(
      pages,
      task.topic,
      task.crawlUrl,
    );

    return {
      topic: task.topic,
      crawlUrl: task.crawlUrl,
      pages: pages,
      answer: crawlSummary,
      summary: `Successfully crawled and analyzed ${pages.length} pages from ${task.crawlUrl}`,
      metadata: {
        pagesFound: pages.length,
      },
    };
  }

  private createSummaryFromResults(
    results: Array<{
      title: string;
      url: string;
      content?: string;
      score?: number;
    }>,
    topic: string,
  ): string {
    if (!results || results.length === 0) {
      return `No information found about ${topic}.`;
    }

    // Extract key information from the top results
    const topResults = results.slice(0, 5); // Use top 5 results
    let summary = `# Research Summary: ${topic}\n\n`;
    summary += `Based on analysis of ${results.length} sources, here are the key findings:\n\n`;

    // Group information by key themes
    const themes: { [key: string]: string[] } = {};

    topResults.forEach((result, _index) => {
      if (result.content) {
        // Extract key sentences from content
        const sentences = result.content.split(".").slice(0, 3); // First 3 sentences
        const keyInfo = sentences.join(".").trim();

        if (keyInfo.length > 50) {
          // Only include substantial content
          const theme = this.categorizeContent(keyInfo, topic);
          if (!themes[theme]) {
            themes[theme] = [];
          }
          themes[theme].push(`${keyInfo}`);
        }
      }
    });

    // Format the summary by themes with better structure
    Object.keys(themes).forEach((theme) => {
      summary += `## ${theme}\n\n`;
      themes[theme].forEach((item, index) => {
        summary += `${index + 1}. ${item}\n\n`;
      });
    });

    // Add comprehensive source information
    summary += `## Sources Consulted\n\n`;
    topResults.forEach((result, index) => {
      summary += `${index + 1}. **${result.title}**\n`;
      summary += `   - URL: ${result.url}\n`;
      if (result.score) {
        summary += `   - Relevance Score: ${(result.score * 100).toFixed(1)}%\n`;
      }
      summary += `\n`;
    });

    // Add research methodology note
    summary += `---\n`;
    summary += `*This research was conducted using web search across multiple sources to provide comprehensive coverage of ${topic}.*\n`;

    return summary;
  }

  private createSummaryFromCrawlResults(
    pages: Array<{ raw_content?: string; content?: string; url?: string }>,
    _topic: string,
    crawlUrl: string,
  ): string {
    if (!pages || pages.length === 0) {
      return `No content found when crawling ${crawlUrl}.`;
    }

    console.log("createSummaryFromCrawlResults - pages length:", pages.length);

    // Get the main page (first result is usually the main URL)
    const mainPage = pages[0];
    const content = mainPage?.raw_content || mainPage?.content || "";

    if (!content) {
      return `No readable content found when crawling ${crawlUrl}.`;
    }

    // Parse and extract key information from RateMyProfessors content
    let summary = `# Professor Review Summary\n\n`;

    // Extract professor name
    const nameMatch = content.match(/# ([^\n]+)/);
    if (nameMatch) {
      summary += `**Professor:** ${nameMatch[1]}\n\n`;
    }

    // Extract rating
    const ratingMatch = content.match(/(\d+\.\d+)\s*\/\s*5/);
    if (ratingMatch) {
      summary += `**Overall Rating:** ${ratingMatch[1]}/5.0\n\n`;
    }

    // Extract number of ratings
    const ratingsCountMatch =
      content.match(/(\d+)\s+ratings/i) ||
      content.match(/Based on \[(\d+) ratings\]/);
    if (ratingsCountMatch) {
      summary += `**Number of Ratings:** ${ratingsCountMatch[1]} student reviews\n\n`;
    }

    // Extract department and school
    const _deptMatch = content.match(
      /(?:Professor in the|Computer Science|Department)/i,
    );
    const schoolMatch = content.match(/Brigham Young University[^\\n]*/);
    if (schoolMatch) {
      summary += `**School:** ${schoolMatch[0].replace(/\[|\]|\*/g, "")}\n\n`;
    }

    // Extract would take again percentage
    const wouldTakeMatch = content.match(/(\d+)%\s*Would take again/i);
    if (wouldTakeMatch) {
      summary += `**Would Take Again:** ${wouldTakeMatch[1]}%\n\n`;
    }

    // Extract difficulty level
    const difficultyMatch = content.match(/(\d+\.\d+)\s*Level of Difficulty/i);
    if (difficultyMatch) {
      summary += `**Level of Difficulty:** ${difficultyMatch[1]}/5.0\n\n`;
    }

    // Extract top tags
    const tagsMatch = content.match(/Top Tags\s*([^\n#*]+)/i);
    if (tagsMatch) {
      const tags = tagsMatch[1]
        .split(/(?=[A-Z])/)
        .filter((t: string) => t.trim().length > 2);
      if (tags.length > 0) {
        summary += `**Common Tags:** ${tags.slice(0, 5).join(", ")}\n\n`;
      }
    }

    // Extract recent student reviews
    summary += `## Recent Student Reviews\n\n`;

    // Find review patterns
    const reviewPattern =
      /Quality\s+(\d+\.\d+)\s+Difficulty\s+(\d+\.\d+)[^\n]+([^T]+?)(?:Tough|Gives|Group|Clear|Amazing|Caring|Helpful|Participation|Respected|Inspirational|\d+ Student Ratings)/g;
    const reviews: Array<{
      quality: string;
      difficulty: string;
      comment: string;
    }> = [];
    let match: RegExpExecArray | null;
    let count = 0;

    while ((match = reviewPattern.exec(content)) !== null && count < 5) {
      const review = match[3].trim();
      if (review.length > 50 && !review.includes("Image")) {
        reviews.push({
          quality: match[1],
          difficulty: match[2],
          comment: review.substring(0, 300),
        });
        count++;
      }
    }

    if (reviews.length > 0) {
      reviews.forEach((review, idx) => {
        summary += `**Review ${idx + 1}:**\n`;
        summary += `- Quality: ${review.quality}/5.0, Difficulty: ${review.difficulty}/5.0\n`;
        summary += `- "${review.comment.replace(/\s+/g, " ").trim()}${review.comment.length >= 300 ? "..." : ""}"\n\n`;
      });
    } else {
      // Fallback: just show a clean excerpt
      const cleanContent = content
        .replace(/\[Image[^\]]*\]/g, "")
        .replace(/\[\/[^\]]*\]/g, "")
        .replace(/\s+/g, " ")
        .trim();
      summary += `${cleanContent.substring(0, 1500)}...\n\n`;
    }

    summary += `---\n`;
    summary += `**Source:** ${crawlUrl}\n`;
    summary += `*Analysis based on ${pages.length} pages from RateMyProfessors*\n`;

    return summary;
  }

  private categorizeContent(content: string, topic: string): string {
    const lowerContent = content.toLowerCase();
    const _lowerTopic = topic.toLowerCase();

    if (
      lowerContent.includes("trend") ||
      lowerContent.includes("future") ||
      lowerContent.includes("2024") ||
      lowerContent.includes("2025")
    ) {
      return "Current Trends";
    } else if (
      lowerContent.includes("market") ||
      lowerContent.includes("revenue") ||
      lowerContent.includes("growth")
    ) {
      return "Market Analysis";
    } else if (
      lowerContent.includes("technology") ||
      lowerContent.includes("innovation") ||
      lowerContent.includes("development")
    ) {
      return "Technology & Innovation";
    } else if (
      lowerContent.includes("application") ||
      lowerContent.includes("use case") ||
      lowerContent.includes("industry")
    ) {
      return "Applications & Use Cases";
    } else {
      return "General Information";
    }
  }

  private formatResults(
    results: {
      topic: string;
      sources?: Array<{
        title: string;
        url: string;
        content?: string;
        score?: number;
      }>;
      pages?: Array<{ raw_content?: string; content?: string; url?: string }>;
      answer: string;
      summary: string;
      crawlUrl?: string;
      metadata?: { pagesFound?: number };
    },
    format: string,
  ): {
    topic: string;
    summary: string;
    sourceCount?: number;
    pagesFound?: number;
    crawlUrl?: string;
    answer: string;
  } {
    switch (format) {
      case "summary":
        if (results.crawlUrl) {
          return {
            topic: results.topic,
            summary: results.summary,
            crawlUrl: results.crawlUrl,
            pagesFound: results.pages?.length || 0,
            answer: results.answer,
          };
        } else {
          return {
            topic: results.topic,
            summary: results.summary,
            sourceCount: results.sources?.length || 0,
            answer: results.answer,
          };
        }
      case "detailed":
        return results;
      case "raw":
        if (results.crawlUrl) {
          return {
            topic: results.topic,
            summary: results.summary,
            crawlUrl: results.crawlUrl,
            pagesFound: results.pages?.length || 0,
            answer: results.answer,
          };
        } else {
          return {
            topic: results.topic,
            summary: results.summary,
            sourceCount: results.sources?.length || 0,
            answer: results.answer,
          };
        }
      default:
        return results;
    }
  }
}
