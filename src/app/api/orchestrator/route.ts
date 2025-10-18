import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Store orchestrators and conversation history per session
const orchestrators = new Map<string, any>();
const conversations = new Map<string, Array<{role: 'user' | 'assistant' | 'system', content: string}>>();

function createOrchestrator() {
  const sessionKey = 'default'; // Use a single orchestrator since we're using env vars
  
  if (!orchestrators.has(sessionKey)) {
    console.log('Creating new orchestrator with environment variables');
    
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    const orchestrator = {
      openai
    };
    
    orchestrators.set(sessionKey, orchestrator);
    conversations.set(sessionKey, []);
  }
  
  return orchestrators.get(sessionKey);
}

function generateSystemPrompt(): string {
  const availableAgents: string[] = [];
  
  if (process.env.TAVILY_API_KEY && process.env.OPENAI_API_KEY) {
    availableAgents.push(`- research-agent-1 (Research Agent): Specialized agent for web research and information gathering
  Capabilities: web_search, web_crawling, information_gathering`);
  }
  
  if (process.env.CANVAS_API_KEY && process.env.CANVAS_BASE_URL) {
    availableAgents.push(`- canvas-agent-1 (Canvas Agent): Specialized agent for Canvas LMS - access courses, assignments, grades
  Capabilities: canvas_access, course_management, assignment_tracking, grade_checking`);
  }

  return `You are an intelligent AI Orchestrator coordinating specialized agents to help users.

## YOUR ROLE
You are a conversational AI assistant that can delegate tasks to specialized agents when needed. You should be natural, helpful, and make intelligent decisions about when to use agents versus responding directly.

## AVAILABLE AGENTS
${availableAgents.length > 0 ? availableAgents.join('\n\n') : 'No agents currently available.'}

## DECISION-MAKING
You have complete freedom to decide how to handle each request:

1. **Direct Response**: If the user is having a general conversation, asking a simple question you can answer, or the request doesn't require specialized agent capabilities, respond naturally without calling an agent.

2. **Delegate to Agent**: If the request requires specialized capabilities (like research, data gathering, web crawling, or accessing external information), intelligently choose which agent to use.

3. **When to Use Research Agent** (research-agent-1):
   - User asks for information you don't have or that requires up-to-date data
   - User provides a URL and wants information about that page
   - User asks about current events, specific topics, or wants you to "look up" something
   - User explicitly requests research, searching, or finding information
   - Example: "Research artificial intelligence trends", "What are reviews for Professor X"

4. **When to Use Canvas Agent** (canvas-agent-1):
   - User asks about Canvas LMS, courses, assignments, or grades
   - User wants to check their Canvas calendar, events, or schedule
   - User asks "what's on my calendar", "what events do I have", "my schedule"
   - Any Canvas-related queries (courses, deadlines, grades, calendar, events, modules, etc.)
   - Example: "What are my assignments?", "Show me my grades"

## HOW TO CALL AGENTS

### For Research Agent:
\`\`\`json
{
  "action": "call_agent",
  "agentId": "research-agent-1",
  "task": {
    "topic": "the research topic or question",
    "crawlUrl": "optional: URL if user provided one"
  }
}
\`\`\`

### For Canvas Agent:
\`\`\`json
{
  "action": "call_agent",
  "agentId": "canvas-agent-1",
  "task": {
    "topic": "what the user wants from Canvas",
    "action": "get_courses|get_assignments|get_assignments_by_date|get_grades|get_calendar_events"
  }
}
\`\`\`

## RESPONSE FORMAT
- If calling an agent: Respond ONLY with the JSON object above, nothing else
- If responding directly: Just write your response naturally, no JSON

## STYLE
- Be conversational, friendly, and natural
- Don't be robotic or overly formal

Remember: You have the intelligence and freedom to make the right decision for each situation.`;
}

async function executeResearchAgent(task: any): Promise<any> {
  try {
    console.log('Executing research agent with task:', task);
    
    if (!process.env.TAVILY_API_KEY) {
      throw new Error('TAVILY_API_KEY environment variable is required');
    }
    
    // Import Tavily dynamically
    const { tavily } = await import("@tavily/core");
    const tavilyClient = tavily({ apiKey: process.env.TAVILY_API_KEY });
    
    let results: any;
    
    console.log(`Searching for: ${task.topic}`);
    
    // Tavily search accepts query as first parameter, then options as second
    results = await tavilyClient.search(task.topic, {
      searchDepth: 'advanced',
      maxResults: 5,
      includeAnswer: true
    });
    
    // Format the response
    let answer = `# Research Results: ${task.topic}\n\n`;
    
    if (results.answer) {
      answer += `${results.answer}\n\n`;
    }
    
    if (results.results && results.results.length > 0) {
      answer += `## Sources:\n\n`;
      results.results.slice(0, 5).forEach((result: any, index: number) => {
        answer += `${index + 1}. **${result.title}**\n`;
        if (result.content) {
          answer += `   - ${result.content.substring(0, 200)}...\n`;
        }
        if (result.url) {
          answer += `   - URL: ${result.url}\n`;
        }
        answer += `\n`;
      });
    }
    
    return {
      success: true,
      result: {
        answer,
        summary: `Research completed on "${task.topic}" with ${results.results?.length || 0} sources.`
      }
    };
  } catch (error) {
    console.error('Research agent error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Research failed'
    };
  }
}

async function executeCanvasAgent(task: any): Promise<any> {
  try {
    console.log('Executing Canvas agent with task:', task);
    
    if (!process.env.CANVAS_API_KEY || !process.env.CANVAS_BASE_URL) {
      throw new Error('CANVAS_API_KEY and CANVAS_BASE_URL environment variables are required');
    }
    
    const baseUrl = process.env.CANVAS_BASE_URL.replace(/\/$/, '');
    const token = process.env.CANVAS_API_KEY;
    
    let url: string;
    let data: any;
    
    // Determine which Canvas API to call based on the action
    switch (task.action) {
      case 'get_courses':
        url = `${baseUrl}/api/v1/courses?enrollment_state=active&per_page=100`;
        break;
      case 'get_assignments':
        url = `${baseUrl}/api/v1/courses?enrollment_state=active&per_page=100`;
        break;
      case 'get_grades':
        url = `${baseUrl}/api/v1/users/self/enrollments?state[]=active&type[]=StudentEnrollment`;
        break;
      case 'get_calendar_events':
        const startDate = new Date().toISOString().split('T')[0];
        const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        url = `${baseUrl}/api/v1/calendar_events?start_date=${startDate}&end_date=${endDate}&per_page=100`;
        break;
      default:
        url = `${baseUrl}/api/v1/courses?enrollment_state=active&per_page=100`;
    }
    
    console.log(`Making Canvas API request to: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Canvas API error response:', errorText);
      throw new Error(`Canvas API error: ${response.status} ${response.statusText}`);
    }
    
    data = await response.json();
    console.log(`Canvas API returned ${Array.isArray(data) ? data.length : 1} items`);
    
    // Format the response based on action
    let answer = '';
    
    switch (task.action) {
      case 'get_courses':
        answer = `# Your Canvas Courses\n\n`;
        answer += `**Total Courses:** ${data.length}\n\n`;
        data.forEach((course: any, index: number) => {
          answer += `${index + 1}. **${course.name}**\n`;
          if (course.course_code) answer += `   - Code: ${course.course_code}\n`;
          if (course.id) answer += `   - ID: ${course.id}\n`;
          answer += `\n`;
        });
        break;
        
      case 'get_grades':
        answer = `# Your Canvas Grades\n\n`;
        answer += `**Total Enrollments:** ${data.length}\n\n`;
        data.forEach((enrollment: any, index: number) => {
          const grade = enrollment.grades?.current_score;
          const courseName = enrollment.course_section?.name || enrollment.course?.name || 'Unknown Course';
          answer += `${index + 1}. **${courseName}**\n`;
          answer += `   - Grade: ${grade ? `${grade}%` : 'No grade yet'}\n`;
          if (enrollment.grades?.current_grade) {
            answer += `   - Letter Grade: ${enrollment.grades.current_grade}\n`;
          }
          answer += `\n`;
        });
        break;
        
      case 'get_calendar_events':
        answer = `# Your Canvas Calendar\n\n`;
        answer += `**Total Events:** ${data.length}\n\n`;
        if (data.length === 0) {
          answer += `No upcoming events found.\n`;
        } else {
          data.slice(0, 10).forEach((event: any, index: number) => {
            answer += `${index + 1}. **${event.title}**\n`;
            if (event.start_at) {
              answer += `   - Date: ${new Date(event.start_at).toLocaleString()}\n`;
            }
            if (event.context_name) {
              answer += `   - Course: ${event.context_name}\n`;
            }
            if (event.description) {
              const plainDesc = event.description.replace(/<[^>]*>/g, '').trim();
              if (plainDesc) {
                answer += `   - Description: ${plainDesc.substring(0, 100)}...\n`;
              }
            }
            answer += `\n`;
          });
          if (data.length > 10) {
            answer += `... and ${data.length - 10} more events\n`;
          }
        }
        break;
        
      default:
        answer = `Canvas data retrieved successfully.\n\nData: ${JSON.stringify(data, null, 2)}`;
    }
    
    return {
      success: true,
      result: {
        answer,
        summary: `Canvas ${task.action} completed successfully.`,
        data
      }
    };
  } catch (error) {
    console.error('Canvas agent error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Canvas request failed'
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, message } = body;
    
    console.log('Received request:', { action, hasMessage: !!message });
    
    if (action === 'chat') {
      if (!message) {
        return NextResponse.json(
          { error: 'Message is required for chat' },
          { status: 400 }
        );
      }
      
      const orch = createOrchestrator();
      const sessionKey = 'default';
      const conversationHistory = conversations.get(sessionKey) || [];
      
      // Add user message to history
      conversationHistory.push({ role: 'user', content: message });
      
      // Create messages for OpenAI
      const systemPrompt = generateSystemPrompt();
      const messages: any[] = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.slice(-10)
      ];
      
      console.log('Calling OpenAI for routing decision...');
      
      const completion = await orch.openai.chat.completions.create({
        model: 'gpt-4o',
        messages,
        temperature: 0.7,
        max_tokens: 4096,
      });
      
      const orchestratorResponse = completion.choices[0]?.message?.content || '';
      console.log('Orchestrator decision:', orchestratorResponse.substring(0, 200));
      
      // Check if orchestrator wants to call an agent
      const agentCallMatch = orchestratorResponse.match(/```json\s*(\{[\s\S]*?\})\s*```/);
      
      if (agentCallMatch) {
        try {
          const agentCall = JSON.parse(agentCallMatch[1]);
          
          if (agentCall.action === 'call_agent' && agentCall.agentId && agentCall.task) {
            console.log(`Delegating to ${agentCall.agentId} with task:`, agentCall.task);
            
            let agentResult: any;
            
            if (agentCall.agentId === 'research-agent-1') {
              agentResult = await executeResearchAgent(agentCall.task);
            } else if (agentCall.agentId === 'canvas-agent-1') {
              agentResult = await executeCanvasAgent(agentCall.task);
            }
            
            if (agentResult && agentResult.success) {
              const response = agentResult.result.answer || agentResult.result.summary || 'Task completed successfully.';
              conversationHistory.push({ role: 'assistant', content: response });
              conversations.set(sessionKey, conversationHistory);
              
              return NextResponse.json({
                success: true,
                response,
                agentUsed: agentCall.agentId,
                taskResult: agentResult.result,
                conversationHistory
              });
            } else {
              const errorResponse = `I tried to help but encountered an error: ${agentResult?.error || 'Unknown error'}`;
              conversationHistory.push({ role: 'assistant', content: errorResponse });
              conversations.set(sessionKey, conversationHistory);
              
              return NextResponse.json({
                success: true,
                response: errorResponse,
                agentUsed: agentCall.agentId,
                conversationHistory
              });
            }
          }
        } catch (parseError) {
          console.error('Failed to parse agent call:', parseError);
        }
      }
      
      // Direct response from orchestrator
      const directResponse = orchestratorResponse.replace(/```json[\s\S]*?```/g, '').trim();
      conversationHistory.push({ role: 'assistant', content: directResponse });
      conversations.set(sessionKey, conversationHistory);
      
      return NextResponse.json({
        success: true,
        response: directResponse,
        conversationHistory
      });
    }
    
    return NextResponse.json(
      { error: 'Unknown action' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Orchestrator API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Orchestrator API is running. Environment variables configured.'
  });
}