import { NextRequest, NextResponse } from 'next/server';
import { AgentOrchestrator } from '../../../agent/orchestrator/AgentOrchestrator';
import { ResearchAgent } from '../../../agent/agents/ResearchAgent';
import { CanvasAgent } from '../../../agent/agents/CanvasAgent';
import { EmailAgent } from '../../../agent/agents/EmailAgent';
import { FlashcardAgent } from '../../../agent/agents/FlashcardAgent';

// Global orchestrator instance (in production, you'd want to manage this better)
let orchestrator: AgentOrchestrator | null = null;

function getOrchestrator(): AgentOrchestrator {
  if (!orchestrator) {
    orchestrator = new AgentOrchestrator();
    
    // Register research agent
    const researchAgent = new ResearchAgent({
      id: 'research-agent-1',
      name: 'Research Agent',
      description: 'Specialized agent for web research and information gathering'
    });
    
    orchestrator.registerAgent(researchAgent.getId(), researchAgent);
    console.log('Research agent registered with orchestrator');
    
    // Register canvas agent
    const canvasAgent = new CanvasAgent({
      id: 'canvas-agent-1',
      name: 'Canvas Agent',
      description: 'Specialized agent for Canvas LMS - access courses, assignments, grades, and announcements'
    });
    
    orchestrator.registerAgent(canvasAgent.getId(), canvasAgent);
    console.log('Canvas agent registered with orchestrator');
    
    // Register email agent
    const emailAgent = new EmailAgent({
      id: 'email-agent-1',
      name: 'Email Agent',
      description: 'Specialized agent for email composition and sending via Gmail SMTP'
    });
    
    orchestrator.registerAgent(emailAgent.getId(), emailAgent);
    console.log('Email agent registered with orchestrator');
    
    // Register flashcard agent
    const flashcardAgent = new FlashcardAgent({
      id: 'flashcard-agent-1',
      name: 'Flashcard Agent',
      description: 'Specialized agent for generating Anki-compatible flashcards from content'
    });
    
    orchestrator.registerAgent(flashcardAgent.getId(), flashcardAgent);
    console.log('Flashcard agent registered with orchestrator');
    
    console.log('Orchestrator initialized with all agents');
  }
  
  return orchestrator;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, agentId, task, message } = body;
    
    const orch = getOrchestrator();
    
    switch (action) {
      case 'chat':
        if (!message) {
          return NextResponse.json(
            { error: 'Message is required for chat' },
            { status: 400 }
          );
        }
        
        const chatResult = await orch.processMessage(message);
        return NextResponse.json({
          success: true,
          response: chatResult.response,
          agentUsed: chatResult.agentUsed,
          taskResult: chatResult.taskResult,
          conversationHistory: orch.getConversationHistory()
        });
        
      case 'execute_research':
        if (!task || !task.topic) {
          return NextResponse.json(
            { error: 'Research task requires a topic' },
            { status: 400 }
          );
        }
        
        const researchResult = await orch.executeWithAgent('research-agent-1', task);
        return NextResponse.json({
          success: true,
          result: researchResult
        });
        
      case 'execute_canvas':
        if (!task || !task.topic) {
          return NextResponse.json(
            { error: 'Canvas task requires a topic' },
            { status: 400 }
          );
        }
        
        const canvasResult = await orch.executeWithAgent('canvas-agent-1', task);
        return NextResponse.json({
          success: true,
          result: canvasResult
        });
        
      case 'get_status':
        return NextResponse.json({
          success: true,
          status: orch.getStatus(),
          agentCapabilities: orch.getAgentCapabilities()
        });
        
      case 'get_agent_tools':
        return NextResponse.json({
          success: true,
          agentCapabilities: orch.getAgentCapabilities()
        });
        
      case 'clear_history':
        orch.clearConversationHistory();
        return NextResponse.json({
          success: true,
          message: 'Conversation history cleared'
        });
        
      default:
        return NextResponse.json(
          { error: 'Unknown action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Orchestrator API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const orch = getOrchestrator();
    return NextResponse.json({
      success: true,
      status: orch.getStatus(),
      agentCapabilities: orch.getAgentCapabilities()
    });
  } catch (error) {
    console.error('Orchestrator GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
