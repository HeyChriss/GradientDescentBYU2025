/**
 * Core Interfaces for Agent System
 * 
 * Defines the contracts and types used throughout the agent system.
 */

export interface AgentConfig {
  id: string;
  name: string;
  description?: string;
  capabilities: string[];
  maxConcurrentTasks?: number;
  timeout?: number;
  retryAttempts?: number;
  model?: {
    provider: 'openai';
    model: string;
    maxTokens?: number;
    temperature?: number;
  };
  metadata?: Record<string, any>;
}

export interface AgentMessage {
  id: string;
  from: string;
  to: string;
  type: string;
  payload: any;
  timestamp: Date;
  priority?: number;
}

export interface AgentResult {
  success: boolean;
  result?: any;
  error?: string;
  executionTime: number;
  metadata?: Record<string, any>;
}

export interface AgentTask {
  id: string;
  type: string;
  payload: any;
  priority?: number;
  timeout?: number;
  retryAttempts?: number;
  metadata?: Record<string, any>;
}

export interface ToolResult {
  success: boolean;
  result?: any;
  error?: string;
  executionTime: number;
  metadata?: Record<string, any>;
}

export interface ToolInterface {
  name: string;
  description: string;
  parameters: Record<string, any>;
  execute(params: any): Promise<any>;
}

export interface AgentInterface {
  getId(): string;
  getConfig(): AgentConfig;
  getStatus(): 'idle' | 'busy' | 'error';
  getCapabilities(): string[];
  getTools(): string[];
  canHandle(task: any): boolean;
  execute(task: any): Promise<AgentResult>;
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
    status: 'active' | 'inactive' | 'busy';
  }>;
}
