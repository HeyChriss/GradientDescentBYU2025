/**
 * Base Tool Class
 * 
 * Abstract base class for all agent tools.
 * Provides common functionality and enforces the tool interface.
 */

import { ToolInterface } from '../core/interfaces';

export abstract class BaseTool implements ToolInterface {
  public name: string;
  public description: string;
  public parameters: Record<string, any>;
  protected isInitialized: boolean = false;

  constructor(name: string, description: string, parameters: Record<string, any> = {}) {
    this.name = name;
    this.description = description;
    this.parameters = parameters;
  }

  /**
   * Get tool name
   */
  public getName(): string {
    return this.name;
  }

  /**
   * Get tool description
   */
  public getDescription(): string {
    return this.description;
  }

  /**
   * Get tool parameters schema
   */
  public getParameters(): Record<string, any> {
    return { ...this.parameters };
  }

  /**
   * Execute the tool with given parameters
   */
  public async execute(params: any): Promise<any> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      return await this.executeInternal(params);
    } catch (error) {
      console.error(`Tool ${this.name} execution failed:`, error);
      throw error;
    }
  }

  /**
   * Initialize the tool
   */
  protected async initialize(): Promise<void> {
    this.isInitialized = true;
  }

  /**
   * Internal execution method to be implemented by subclasses
   */
  protected abstract executeInternal(params: any): Promise<any>;

  /**
   * Validate parameters before execution
   */
  protected validateParameters(params: any): boolean {
    // Basic validation - can be overridden by subclasses
    return params !== null && params !== undefined;
  }

  /**
   * Cleanup tool resources
   */
  public async cleanup(): Promise<void> {
    // Override in subclasses if needed
  }
}
