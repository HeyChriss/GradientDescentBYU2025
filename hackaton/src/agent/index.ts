/**
 * Agent System Index
 *
 * Main entry point for the agent system.
 * Exports all components for easy importing.
 */

export type { CanvasTask, ResearchTask } from "./agents";
// Agent exports
export { CanvasAgent, ResearchAgent } from "./agents";
// Core exports
export { BaseAgent } from "./core/BaseAgent";
export type {
  AgentConfig,
  AgentInterface,
  AgentMessage,
  AgentResult,
  AgentTask,
  OrchestratorInterface,
  ToolInterface,
} from "./core/interfaces";
export type { AgentCapability } from "./orchestrator/AgentOrchestrator";
// Orchestrator exports
export { AgentOrchestrator } from "./orchestrator/AgentOrchestrator";
// Tool exports
export { BaseTool } from "./tools/BaseTool";
export { CanvasTool } from "./tools/CanvasTool";
export { TavilyTool } from "./tools/TavilyTool";
