/**
 * Core Interfaces for Agent System
 *
 * Defines the contracts and types used throughout the agent system.
 */

// Generic types for better type safety
export type UnknownRecord = Record<string, unknown>;
export type TaskPayload = UnknownRecord;
export type ResultData = UnknownRecord;
export type ToolParams = UnknownRecord;

export interface AgentConfig {
  id: string;
  name: string;
  description?: string;
  capabilities: string[];
  maxConcurrentTasks?: number;
  timeout?: number;
  retryAttempts?: number;
  model?: {
    provider: "openai";
    model: string;
    maxTokens?: number;
    temperature?: number;
  };
  metadata?: UnknownRecord;
}

export interface AgentMessage {
  id: string;
  from: string;
  to: string;
  type: string;
  payload: TaskPayload;
  timestamp: Date;
  priority?: number;
}

export interface AgentResult {
  success: boolean;
  result?: ResultData;
  error?: string;
  executionTime: number;
  metadata?: UnknownRecord;
}

export interface AgentTask {
  id: string;
  type: string;
  payload: TaskPayload;
  priority?: number;
  timeout?: number;
  retryAttempts?: number;
  metadata?: UnknownRecord;
}

export interface ToolResult {
  success: boolean;
  result?: ResultData;
  error?: string;
  executionTime: number;
  metadata?: UnknownRecord;
}

export interface ToolInterface {
  name: string;
  description: string;
  parameters: UnknownRecord;
  execute(params: ToolParams): Promise<ResultData>;
}

export interface AgentInterface {
  getId(): string;
  getConfig(): AgentConfig;
  getStatus(): "idle" | "busy" | "error";
  getCapabilities(): string[];
  getTools(): string[];
  canHandle(task: TaskPayload): boolean;
  execute(task: TaskPayload): Promise<AgentResult>;
  sendMessage(targetAgentId: string, message: AgentMessage): Promise<void>;
  handleMessage(message: AgentMessage): Promise<void>;
  cleanup(): Promise<void>;
}

export interface OrchestratorInterface {
  registerAgent(agentId: string, agent: AgentInterface): void;
  unregisterAgent(agentId: string): void;
  submitTask(task: AgentTask): Promise<AgentResult>;
  getStatus(): {
    registeredAgents: number;
    queuedTasks: number;
    isProcessing: boolean;
  };
  getAgentCapabilities(): Array<{
    agentId: string;
    capabilities: string[];
    tools: string[];
    status: "active" | "inactive" | "busy";
  }>;
}
