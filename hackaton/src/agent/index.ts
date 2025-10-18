/**
 * Agent System Index
 * 
 * Main entry point for the agent system.
 * Exports all components for easy importing.
 */

// Core exports
export { BaseAgent } from './core/BaseAgent';
export type { 
  AgentConfig, 
  AgentMessage, 
  AgentResult, 
  AgentTask, 
  ToolInterface, 
  AgentInterface, 
  OrchestratorInterface 
} from './core/interfaces';

// Orchestrator exports
export { AgentOrchestrator } from './orchestrator/AgentOrchestrator';
export type { AgentCapability } from './orchestrator/AgentOrchestrator';

// Tool exports
export { BaseTool } from './tools/BaseTool';
export { TavilyTool } from './tools/TavilyTool';
export { CanvasTool } from './tools/CanvasTool';

// Agent exports
export { ResearchAgent, CanvasAgent } from './agents';
export type { ResearchTask, CanvasTask } from './agents';
