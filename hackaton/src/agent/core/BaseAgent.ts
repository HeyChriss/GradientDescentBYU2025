/**
 * Base Agent Class
 *
 * Abstract base class that all agents must extend.
 * Provides common functionality and enforces the agent interface.
 * Uses cost-effective models by default (can be overridden).
 */

import { CONFIG } from "../../config/api-keys";
import type {
  AgentConfig,
  AgentInterface,
  AgentMessage,
  AgentResult,
  ToolInterface,
  ToolParams,
} from "../core/interfaces";

export abstract class BaseAgent implements AgentInterface {
  protected id: string;
  protected config: AgentConfig;
  protected tools: Map<string, ToolInterface> = new Map();
  protected status: "idle" | "busy" | "error" = "idle";
  protected modelConfig: {
    provider: "openai";
    model: string;
    maxTokens?: number;
    temperature?: number;
  };
  protected systemPrompt: string;

  constructor(id: string, config: AgentConfig) {
    this.id = id;
    this.config = config;

    // Set default model configuration for base agents (cost-effective)
    this.modelConfig = config.model || {
      provider: "openai",
      model: CONFIG.OPENAI_AGENTS.MODEL,
      maxTokens: CONFIG.OPENAI_AGENTS.MAX_TOKENS,
      temperature: CONFIG.OPENAI_AGENTS.TEMPERATURE,
    };

    // Set system prompt
    this.systemPrompt = this.generateSystemPrompt();

    this.initialize();
  }

  /**
   * Initialize the agent
   */
  protected abstract initialize(): void;

  /**
   * Generate system prompt for the agent
   */
  protected abstract generateSystemPrompt(): string;

  /**
   * Execute a task
   */
  public abstract execute(task: ToolParams): Promise<AgentResult>;

  /**
   * Check if agent can handle a specific task
   */
  public abstract canHandle(task: ToolParams): boolean;

  /**
   * Get agent capabilities
   */
  public abstract getCapabilities(): string[];

  /**
   * Get available tools
   */
  public getTools(): string[] {
    return Array.from(this.tools.keys());
  }

  /**
   * Register a tool with the agent
   */
  protected registerTool(name: string, tool: ToolInterface): void {
    this.tools.set(name, tool);
  }

  /**
   * Get a tool by name
   */
  protected getTool(name: string): ToolInterface | undefined {
    return this.tools.get(name);
  }

  /**
   * Get agent status
   */
  public getStatus(): "idle" | "busy" | "error" {
    return this.status;
  }

  /**
   * Set agent status
   */
  protected setStatus(status: "idle" | "busy" | "error"): void {
    this.status = status;
  }

  /**
   * Get agent ID
   */
  public getId(): string {
    return this.id;
  }

  /**
   * Get agent configuration
   */
  public getConfig(): AgentConfig {
    return { ...this.config };
  }

  /**
   * Get model configuration
   */
  public getModelConfig(): {
    provider: "openai";
    model: string;
    maxTokens?: number;
    temperature?: number;
  } {
    return { ...this.modelConfig };
  }

  /**
   * Get system prompt
   */
  public getSystemPrompt(): string {
    return this.systemPrompt;
  }

  /**
   * Send a message to another agent
   */
  public async sendMessage(
    targetAgentId: string,
    message: AgentMessage,
  ): Promise<void> {
    // TODO: Implement inter-agent communication
    console.log(
      `Agent ${this.id} sending message to ${targetAgentId}:`,
      message,
    );
  }

  /**
   * Handle incoming messages
   */
  public async handleMessage(message: AgentMessage): Promise<void> {
    // TODO: Implement message handling
    console.log(`Agent ${this.id} received message:`, message);
  }

  /**
   * Cleanup resources
   */
  public async cleanup(): Promise<void> {
    this.setStatus("idle");
    // TODO: Implement cleanup logic
  }
}
