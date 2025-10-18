/**
 * Tavily Tool
 * 
 * Simple tool for web search and crawling using Tavily API.
 */

import { BaseTool } from './BaseTool';
import { ToolResult } from '../core/interfaces';

export interface TavilySearchOptions {
  query: string;
  includeAnswer?: 'basic' | 'advanced';
}

export interface TavilyCrawlOptions {
  url: string;
  extractDepth?: 'basic' | 'advanced';
}

export class TavilyTool extends BaseTool {
  private client: any;
  private apiKey: string;

  constructor(apiKey: string) {
    super('tavily', 'Web search and crawling using Tavily API');
    this.apiKey = apiKey;
  }

  protected async initialize(): Promise<void> {
    try {
      // Dynamic import for tavily
      const { tavily } = await import("@tavily/core");
      this.client = tavily({ apiKey: this.apiKey });
      console.log('Tavily client initialized successfully');
      await super.initialize(); // Call parent initialize to set isInitialized
    } catch (error) {
      console.error('Failed to initialize Tavily client:', error);
      throw new Error('Tavily client initialization failed. Make sure @tavily/core package is installed.');
    }
  }

  public async search(options: TavilySearchOptions): Promise<ToolResult> {
    const startTime = Date.now();
    
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }
      console.log(`Tavily search: ${options.query}`);
      
      // Simple search call matching the reference
      const results = await this.client.search(
        options.query,
        options.includeAnswer || 'advanced'
      );
      
      return {
        success: true,
        result: {
          query: options.query,
          results: results.results || [],
          answer: results.answer || results.answer_text || results.summary || null,
          metadata: {
            timestamp: new Date().toISOString()
          }
        },
        executionTime: Date.now() - startTime
      };
    } catch (error) {
      console.error('Tavily search error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown search error',
        executionTime: Date.now() - startTime
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
      
      // Simple crawl call matching the reference
      const results = await this.client.crawl(options.url, {
        extractDepth: options.extractDepth || 'advanced'
      });
      
      console.log('Raw Tavily crawl response keys:', Object.keys(results));
      console.log('Tavily crawl results.pages:', results.pages?.length);
      console.log('Tavily crawl results.results:', results.results?.length);
      console.log('Full Tavily response (first 500 chars):', JSON.stringify(results).substring(0, 500));
      
      // Tavily returns 'results' array, not 'pages'
      const pages = results.results || results.pages || [];
      
      return {
        success: true,
        result: {
          url: options.url,
          baseUrl: results.baseUrl,
          results: pages,  // Use 'results' to match Tavily's schema
          metadata: {
            timestamp: new Date().toISOString(),
            responseTime: results.responseTime,
            requestId: results.requestId
          }
        },
        executionTime: Date.now() - startTime
      };
    } catch (error) {
      console.error('Tavily crawl error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown crawl error',
        executionTime: Date.now() - startTime
      };
    }
  }

  public async execute(input: any): Promise<ToolResult> {
    // Default to search if no method specified
    if (input.method === 'crawl') {
      return this.crawl(input.options);
    } else {
      return this.search(input.options || input);
    }
  }

  protected async executeInternal(params: any): Promise<ToolResult> {
    return this.execute(params);
  }

  public getCapabilities(): string[] {
    return [
      'web_search',
      'web_crawling'
    ];
  }

  public getParameters(): any {
    return {
      search: {
        query: { type: 'string', required: true, description: 'Search query' },
        includeAnswer: { type: 'string', required: false, description: 'Include answer: basic or advanced' }
      },
      crawl: {
        url: { type: 'string', required: true, description: 'URL to crawl' },
        extractDepth: { type: 'string', required: false, description: 'Extract depth: basic or advanced' }
      }
    };
  }
}
