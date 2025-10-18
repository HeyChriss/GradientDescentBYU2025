/**
 * Agent Orchestrator
 * 
 * Central component for managing and coordinating multiple agents.
 * Uses GPT-4o to intelligently analyze user requests and route them to appropriate agents.
 */

import OpenAI from 'openai';
import { CONFIG } from '../../config/api-keys';

export interface AgentTask {
  id: string;
  type: string;
  payload: any;
  priority?: number;
  metadata?: Record<string, any>;
}

export interface AgentResult {
  agentId: string;
  taskId: string;
  success: boolean;
  result?: any;
  error?: string;
  executionTime: number;
}

export interface AgentCapability {
  agentId: string;
  capabilities: string[];
  tools: string[];
  status: 'active' | 'inactive' | 'busy';
}

export class AgentOrchestrator {
  private agents: Map<string, any> = new Map();
  private openai: OpenAI;
  private conversationHistory: Array<{role: 'user' | 'assistant' | 'system', content: string}> = [];

  constructor() {
    // Initialize OpenAI client
    this.openai = new OpenAI({
      apiKey: CONFIG.OPENAI_ORCHESTRATOR.API_KEY
    });
    
    console.log(`AgentOrchestrator initialized with GPT-4o for intelligent routing`);
  }

  /**
   * Register an agent with the orchestrator
   */
  registerAgent(agentId: string, agent: any): void {
    this.agents.set(agentId, agent);
    console.log(`Agent ${agentId} registered with capabilities:`, agent.getCapabilities());
  }

  /**
   * Unregister an agent from the orchestrator
   */
  unregisterAgent(agentId: string): void {
    this.agents.delete(agentId);
  }

  /**
   * Get orchestrator status
   */
  getStatus(): {
    registeredAgents: number;
    isProcessing: boolean;
  } {
    return {
      registeredAgents: this.agents.size,
      isProcessing: false
    };
  }

  /**
   * Get list of registered agents and their capabilities
   */
  getAgentCapabilities(): AgentCapability[] {
    const capabilities: AgentCapability[] = [];
    
    for (const [agentId, agent] of this.agents) {
      capabilities.push({
        agentId,
        capabilities: agent.getCapabilities ? agent.getCapabilities() : [],
        tools: agent.getTools ? agent.getTools() : [],
        status: agent.getStatus ? agent.getStatus() : 'active'
      });
    }
    
    return capabilities;
  }

  /**
   * Execute a task using an agent
   */
  async executeWithAgent(agentId: string, task: any): Promise<AgentResult> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }
    
    console.log(`Orchestrator delegating task to ${agentId}:`, task);
    return await agent.execute(task);
  }

  /**
   * Generate dynamic system prompt based on available agents
   */
  private generateSystemPrompt(): string {
    const agentDescriptions = Array.from(this.agents.entries())
      .map(([agentId, agent]) => {
        const config = agent.getConfig();
        const capabilities = agent.getCapabilities();
        return `- ${agentId} (${config.name}): ${config.description}\n  Capabilities: ${capabilities.join(', ')}`;
      })
      .join('\n\n');

    return `You are an intelligent AI Orchestrator coordinating specialized agents to help users.

## YOUR ROLE
You are a conversational AI assistant that can delegate tasks to specialized agents when needed. You should be natural, helpful, and make intelligent decisions about when to use agents versus responding directly.

## AVAILABLE AGENTS
${agentDescriptions || 'No agents currently registered.'}

## DECISION-MAKING
You have complete freedom to decide how to handle each request:

1. **Direct Response**: If the user is having a general conversation, asking a simple question you can answer, or the request doesn't require specialized agent capabilities, respond naturally without calling an agent.

2. **Delegate to Agent**: If the request requires specialized capabilities (like research, data gathering, web crawling, or accessing external information), intelligently choose which agent to use and what parameters to provide.

3. **When to Use Research Agent** (research-agent-1):
   - User asks for information you don't have or that requires up-to-date data
   - User provides a URL and wants information about that page (use crawlUrl parameter)
   - User asks about current events, specific topics, or wants you to "look up" something
   - User explicitly requests research, searching, or finding information

4. **When to Use Canvas Agent** (canvas-agent-1):
   - User asks about Canvas LMS, courses, assignments, or grades
   - User wants to check their Canvas calendar, events, or schedule
   - User asks "what's on my calendar", "what events do I have", "my schedule"
   - User asks about course modules, weeks, or content ("what's in week 1", "show me module 2")
   - User needs information about course announcements or updates
   - User asks about academic progress or performance in Canvas
   - Any Canvas-related queries (courses, deadlines, grades, calendar, events, modules, etc.)

5. **When to Use Email Agent** (email-agent-1):
   - User wants to compose, write, or send emails
   - User asks "help me write an email", "send an email", "compose a message"
   - User needs help with email content, subject lines, or formatting
   - User wants to draft professional emails
   - Any email-related queries (composition, sending, formatting, etc.)

6. **When NOT to Use Any Agent**:
   - General conversation, greetings, or clarifying questions
   - Questions you can answer directly
   - The user is just chatting or asking about your capabilities

## HOW TO CALL AGENTS

### For Research Agent (research-agent-1):
\`\`\`json
{
  "action": "call_agent",
  "agentId": "research-agent-1",
  "task": {
    "topic": "the research topic or question",
    "crawlUrl": "optional: URL if user provided one",
    "outputFormat": "summary"
  }
}
\`\`\`

### For Canvas Agent (canvas-agent-1):
\`\`\`json
{
  "action": "call_agent",
  "agentId": "canvas-agent-1",
  "task": {
    "topic": "what the user wants from Canvas",
    "action": "get_courses|get_assignments|get_assignments_by_date|get_assignments_by_course_name|get_grades|get_individual_assignment_grades|get_calendar_events|get_modules",
    "timeRange": "optional: today|tomorrow|this_week|next_week|this_month (for get_assignments_by_date and get_calendar_events)",
    "courseName": "optional: course name for get_assignments_by_course_name and get_modules (e.g., 'Deep Learning', 'CS 474', 'Database')",
    "courseId": "optional: course ID for get_individual_assignment_grades and get_modules (can use courseName instead)",
    "moduleName": "optional: module/week name for get_modules (e.g., 'Week 1', 'Module 2', 'Introduction')",
    "eventType": "optional: event|assignment (for get_calendar_events - filters calendar by type)",
    "outputFormat": "summary"
  }
}
\`\`\`

### For Email Agent (email-agent-1):
\`\`\`json
{
  "action": "call_agent",
  "agentId": "email-agent-1",
  "task": {
    "topic": "what the user wants to do with email",
    "action": "compose|draft|send|confirm|help|general",
    "subject": "optional: email subject line",
    "content": "optional: email body content",
    "recipient": "optional: recipient email address",
    "sender": "optional: sender email address (defaults to configured Gmail)",
    "cc": "optional: CC recipients (comma-separated)",
    "bcc": "optional: BCC recipients (comma-separated)",
    "confirmSend": "optional: true if user has confirmed sending",
    "outputFormat": "optional: draft|send|preview"
  }
}
\`\`\`

**Important for Email Agent:**
- If user wants to compose/write emails, use action: "compose" or "draft"
- If user wants to send emails, use action: "send" (will validate and confirm first)
- If user confirms email details, use action: "confirm"
- Always collect: recipient, subject, content before sending
- The agent will validate and ask for confirmation before sending
- Extract email details from user messages (recipient, subject, content)

**Important for Canvas Agent:**
- If user asks for assignments "today", "this week", "next week", etc., use action: "get_assignments_by_date" with timeRange
- If user asks for assignments for a specific course by name, use action: "get_assignments_by_course_name" with courseName
- If user asks for "all assignments" without time/course filter, use action: "get_assignments"
- If user asks for "grades", "my grades", "overall grades", use action: "get_grades"
- If user asks for "assignment grades", "grades for [course]", use action: "get_individual_assignment_grades" with courseId
- If user asks for "calendar", "events", "what's on my calendar", "schedule", use action: "get_calendar_events" with optional timeRange and eventType
- If user asks for "modules", "weeks", "course content", "what's in week X", use action: "get_modules" with courseId and optional moduleName
- Extract course names from user messages (e.g., "Deep Learning", "Database", "CS 474")
- Extract module/week names from user messages (e.g., "Week 1", "Module 2", "Introduction")

## RESPONSE FORMAT
- If calling an agent: Respond ONLY with the JSON object above, nothing else
- If responding directly: Just write your response naturally, no JSON

## STYLE
- Be conversational, friendly, and natural
- Don't be robotic or overly formal
- If you're not sure what the user wants, ask for clarification
- If you decide not to use an agent, explain why if appropriate
- Pass the user's request to agents as-is without modifications

Remember: You have the intelligence and freedom to make the right decision for each situation.`;
  }

  /**
   * Add message to conversation history
   */
  addMessage(role: 'user' | 'assistant' | 'system', content: string): void {
    this.conversationHistory.push({ role, content });
    
    // Keep only last 20 messages to manage context
    if (this.conversationHistory.length > 20) {
      this.conversationHistory = this.conversationHistory.slice(-20);
    }
  }

  /**
   * Get conversation history
   */
  getConversationHistory(): Array<{role: 'user' | 'assistant' | 'system', content: string}> {
    return [...this.conversationHistory];
  }

  /**
   * Clear conversation history
   */
  clearConversationHistory(): void {
    this.conversationHistory = [];
  }

  /**
   * Process a conversational message using GPT-4o for intelligent routing
   */
  async processMessage(userMessage: string): Promise<{response: string, agentUsed?: string, taskResult?: any}> {
    this.addMessage('user', userMessage);
    
    try {
      // Use GPT-4o to intelligently decide how to handle the message
      const systemPrompt = this.generateSystemPrompt();
      
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        { role: 'system', content: systemPrompt },
        ...this.conversationHistory.slice(-10).map(msg => ({
          role: msg.role as 'user' | 'assistant' | 'system',
          content: msg.content
        }))
      ];

      console.log('Orchestrator calling GPT-4o for routing decision...');
      const completion = await this.openai.chat.completions.create({
        model: CONFIG.OPENAI_ORCHESTRATOR.MODEL,
        messages,
        temperature: CONFIG.OPENAI_ORCHESTRATOR.TEMPERATURE,
        max_tokens: CONFIG.OPENAI_ORCHESTRATOR.MAX_TOKENS,
      });

      const orchestratorResponse = completion.choices[0]?.message?.content || '';
      console.log('Orchestrator decision:', orchestratorResponse);

      // Check if the orchestrator wants to call an agent
      const agentCallMatch = orchestratorResponse.match(/```json\s*(\{[\s\S]*?\})\s*```/);
      
      if (agentCallMatch) {
        // Orchestrator decided to call an agent
        try {
          const agentCall = JSON.parse(agentCallMatch[1]);
          
          if (agentCall.action === 'call_agent' && agentCall.agentId && agentCall.task) {
            console.log(`Orchestrator delegating to ${agentCall.agentId} with task:`, agentCall.task);
            
            const agentResult = await this.executeWithAgent(agentCall.agentId, agentCall.task);
            
            if (agentResult.success) {
              // Return the agent's result directly
              const response = agentResult.result.answer || agentResult.result.summary || 'Task completed successfully.';
              this.addMessage('assistant', response);
              
              return {
                response,
                agentUsed: agentCall.agentId,
                taskResult: agentResult.result
              };
            } else {
              const response = `I tried to help but encountered an error: ${agentResult.error}`;
              this.addMessage('assistant', response);
              
              return { response, agentUsed: agentCall.agentId };
            }
          }
        } catch (parseError) {
          console.error('Failed to parse agent call:', parseError);
          // Fall through to direct response
        }
      }
      
      // Orchestrator decided to respond directly
      const directResponse = orchestratorResponse.replace(/```json[\s\S]*?```/g, '').trim();
      this.addMessage('assistant', directResponse);
      
      return { response: directResponse };
      
    } catch (error) {
      console.error('Orchestrator error:', error);
      const errorResponse = `I encountered an error processing your request: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.addMessage('assistant', errorResponse);
      
      return { response: errorResponse };
    }
  }
}
