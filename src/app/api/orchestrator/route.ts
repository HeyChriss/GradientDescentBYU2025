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
  Capabilities: canvas_access, course_management, assignment_tracking, grade_checking, calendar_access`);
  }

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return `You are an intelligent AI Orchestrator coordinating specialized agents to help users.

## CURRENT DATE & TIME
Today is ${formattedDate}
Use this information to determine time-based queries.

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
   - User asks about assignments with time references like "due today", "due this week", "upcoming assignments"
   - User asks "what's on my calendar", "what events do I have", "my schedule"
   - User asks about specific courses or modules/weeks
   - Any Canvas-related queries (courses, deadlines, grades, calendar, events, modules, etc.)
   - Example: "What are my assignments?", "Show me my grades", "What's due this week?"

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

### For Canvas Agent - TIME-BASED QUERIES:
When user asks about assignments with time references, use get_assignments_by_date:
\`\`\`json
{
  "action": "call_agent",
  "agentId": "canvas-agent-1",
  "task": {
    "topic": "user's question",
    "action": "get_assignments_by_date",
    "timeRange": "today|tomorrow|this_week|next_week|this_month"
  }
}
\`\`\`

### For Canvas Agent - ALL ASSIGNMENTS:
\`\`\`json
{
  "action": "call_agent",
  "agentId": "canvas-agent-1",
  "task": {
    "topic": "user's question",
    "action": "get_assignments"
  }
}
\`\`\`

### For Canvas Agent - COURSES:
\`\`\`json
{
  "action": "call_agent",
  "agentId": "canvas-agent-1",
  "task": {
    "topic": "user's question",
    "action": "get_courses"
  }
}
\`\`\`

### For Canvas Agent - GRADES:
\`\`\`json
{
  "action": "call_agent",
  "agentId": "canvas-agent-1",
  "task": {
    "topic": "user's question",
    "action": "get_grades"
  }
}
\`\`\`

### For Canvas Agent - CALENDAR EVENTS:
\`\`\`json
{
  "action": "call_agent",
  "agentId": "canvas-agent-1",
  "task": {
    "topic": "user's question",
    "action": "get_calendar_events",
    "timeRange": "today|tomorrow|this_week|next_week|this_month"
  }
}
\`\`\`

## IMPORTANT: TIME-BASED QUERY MAPPING
When user mentions time references, map them correctly:
- "due today" → timeRange: "today"
- "due tomorrow" → timeRange: "tomorrow"  
- "due this week" → timeRange: "this_week"
- "due next week" → timeRange: "next_week"
- "due this month" → timeRange: "this_month"
- "upcoming assignments" → action: "get_assignments" (gets all and sorts by date)

## RESPONSE FORMAT
- If calling an agent: Respond ONLY with the JSON object above, nothing else
- If responding directly: Just write your response naturally, no JSON

## STYLE
- Be conversational, friendly, and natural
- Don't be robotic or overly formal
- Understand context and intent from user's questions

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
    
    console.log('Canvas Base URL:', baseUrl);
    console.log('Canvas action requested:', task.action);
    
    // Default to get_assignments_by_date with this_week if no action specified
    const action = task.action || 'get_assignments_by_date';
    const timeRange = task.timeRange || 'this_week';
    
    console.log(`Executing Canvas action: ${action}, timeRange: ${timeRange}`);
    
    // STEP 1: Get all courses first
    const coursesUrl = `${baseUrl}/api/v1/courses?enrollment_state=active&per_page=100`;
    console.log(`Fetching courses from: ${coursesUrl}`);
    
    const coursesResponse = await fetch(coursesUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!coursesResponse.ok) {
      const errorText = await coursesResponse.text();
      console.error('Canvas API error:', errorText);
      throw new Error(`Canvas API error: ${coursesResponse.status}`);
    }
    
    const courses = await coursesResponse.json();
    console.log(`Found ${courses.length} courses`);
    
    // STEP 2: Execute the appropriate action
    let result: any;
    
    switch (action) {
      case 'get_courses':
        result = formatCanvasCourses(courses);
        break;
        
      case 'get_assignments':
        result = await getAllCanvasAssignments(courses, baseUrl, token);
        break;
        
      case 'get_assignments_by_date':
        result = await getCanvasAssignmentsByDate(courses, baseUrl, token, timeRange);
        break;
        
      case 'get_grades':
        const gradesUrl = `${baseUrl}/api/v1/users/self/enrollments?state[]=active&type[]=StudentEnrollment`;
        const gradesResponse = await fetch(gradesUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const enrollments = await gradesResponse.json();
        result = formatCanvasGrades(enrollments, courses);
        break;
        
      case 'get_calendar_events':
        result = await getCanvasCalendarEvents(baseUrl, token, timeRange);
        break;
        
      default:
        // If unknown action, default to assignments by date
        console.log(`Unknown action ${action}, defaulting to get_assignments_by_date`);
        result = await getCanvasAssignmentsByDate(courses, baseUrl, token, timeRange);
        break;
    }
    
    return {
      success: true,
      result
    };
  } catch (error) {
    console.error('Canvas agent error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Canvas request failed'
    };
  }
}

// Helper function to format courses
function formatCanvasCourses(courses: any[]): any {
  let answer = `# Your Canvas Courses\n\n`;
  answer += `**Total Active Courses:** ${courses.length}\n\n`;
  
  courses.forEach((course: any, index: number) => {
    answer += `${index + 1}. **${course.name}**\n`;
    if (course.course_code) answer += `   - Code: ${course.course_code}\n`;
    if (course.id) answer += `   - Course ID: ${course.id}\n`;
    answer += `\n`;
  });
  
  return {
    answer,
    summary: `Found ${courses.length} active courses`,
    courses
  };
}

// Helper function to get all assignments across courses
async function getAllCanvasAssignments(courses: any[], baseUrl: string, token: string): Promise<any> {
  const allAssignments: any[] = [];
  
  for (const course of courses) {
    try {
      const assignmentsUrl = `${baseUrl}/api/v1/courses/${course.id}/assignments?per_page=100`;
      const response = await fetch(assignmentsUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const assignments = await response.json();
        assignments.forEach((assignment: any) => {
          allAssignments.push({
            ...assignment,
            courseName: course.name,
            courseId: course.id
          });
        });
      }
    } catch (error) {
      console.warn(`Failed to fetch assignments for course ${course.id}`);
    }
  }
  
  // Sort by due date
  allAssignments.sort((a: any, b: any) => {
    if (!a.due_at) return 1;
    if (!b.due_at) return -1;
    return new Date(a.due_at).getTime() - new Date(b.due_at).getTime();
  });
  
  return formatCanvasAssignments(allAssignments, courses.length);
}

// Helper function to format assignments with categorization
function formatCanvasAssignments(assignments: any[], coursesChecked: number): any {
  const now = new Date();
  const categorized: any = {
    overdue: [],
    dueToday: [],
    dueWithin24Hours: [],
    dueWithin3Days: [],
    dueWithinWeek: [],
    upcoming: []
  };
  
  assignments.forEach((assignment: any) => {
    if (!assignment.due_at) return;
    
    const dueDate = new Date(assignment.due_at);
    const timeDiff = dueDate.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
    
    if (timeDiff < 0) {
      categorized.overdue.push(assignment);
    } else if (hoursDiff <= 24 && dueDate.toDateString() === now.toDateString()) {
      categorized.dueToday.push(assignment);
    } else if (hoursDiff <= 24) {
      categorized.dueWithin24Hours.push(assignment);
    } else if (daysDiff <= 3) {
      categorized.dueWithin3Days.push(assignment);
    } else if (daysDiff <= 7) {
      categorized.dueWithinWeek.push(assignment);
    } else {
      categorized.upcoming.push(assignment);
    }
  });
  
  let answer = `# Canvas Assignments Summary\n\n`;
  answer += `**Total Assignments:** ${assignments.length}\n`;
  answer += `**Courses Checked:** ${coursesChecked}\n\n`;
  
  if (categorized.overdue.length > 0) {
    answer += `## ⚠️ OVERDUE (${categorized.overdue.length})\n\n`;
    categorized.overdue.forEach((a: any) => {
      answer += `- **${a.name}** (${a.courseName})\n`;
      answer += `  - Due: ${new Date(a.due_at).toLocaleString()}\n\n`;
    });
  }
  
  if (categorized.dueToday.length > 0) {
    answer += `## 🔴 DUE TODAY (${categorized.dueToday.length})\n\n`;
    categorized.dueToday.forEach((a: any) => {
      answer += `- **${a.name}** (${a.courseName})\n`;
      answer += `  - Due: ${new Date(a.due_at).toLocaleString()}\n\n`;
    });
  }
  
  if (categorized.dueWithin3Days.length > 0) {
    answer += `## 🟡 DUE WITHIN 3 DAYS (${categorized.dueWithin3Days.length})\n\n`;
    categorized.dueWithin3Days.forEach((a: any) => {
      answer += `- **${a.name}** (${a.courseName})\n`;
      answer += `  - Due: ${new Date(a.due_at).toLocaleString()}\n\n`;
    });
  }
  
  if (categorized.dueWithinWeek.length > 0) {
    answer += `## 📅 DUE WITHIN A WEEK (${categorized.dueWithinWeek.length})\n\n`;
    categorized.dueWithinWeek.forEach((a: any) => {
      answer += `- **${a.name}** (${a.courseName})\n`;
      answer += `  - Due: ${new Date(a.due_at).toLocaleString()}\n\n`;
    });
  }
  
  if (categorized.upcoming.length > 0) {
    answer += `## 📋 UPCOMING (${categorized.upcoming.length})\n\n`;
    categorized.upcoming.slice(0, 5).forEach((a: any) => {
      answer += `- **${a.name}** (${a.courseName})\n`;
      answer += `  - Due: ${new Date(a.due_at).toLocaleString()}\n\n`;
    });
    if (categorized.upcoming.length > 5) {
      answer += `... and ${categorized.upcoming.length - 5} more upcoming assignments\n\n`;
    }
  }
  
  return {
    answer,
    summary: `Found ${assignments.length} assignments across ${coursesChecked} courses`,
    assignments
  };
}

// Helper function to get assignments by date range
async function getCanvasAssignmentsByDate(courses: any[], baseUrl: string, token: string, timeRange: string): Promise<any> {
  console.log(`Getting assignments for timeRange: ${timeRange}`);
  
  // Get all assignments first
  const allAssignmentsResult = await getAllCanvasAssignments(courses, baseUrl, token);
  const allAssignments = allAssignmentsResult.assignments;
  
  // Calculate date range
  const now = new Date();
  let startDate = new Date(now);
  let endDate = new Date(now);
  
  startDate.setHours(0, 0, 0, 0);
  
  switch (timeRange) {
    case 'today':
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'tomorrow':
      startDate.setDate(startDate.getDate() + 1);
      endDate.setDate(endDate.getDate() + 1);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'this_week':
      // From today to end of week (Saturday)
      const currentDay = now.getDay();
      endDate.setDate(endDate.getDate() + (6 - currentDay));
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'next_week':
      const currentDayNextWeek = now.getDay();
      startDate.setDate(startDate.getDate() + (7 - currentDayNextWeek));
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'this_month':
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      break;
    default:
      // Default to next 7 days
      endDate.setDate(endDate.getDate() + 7);
      endDate.setHours(23, 59, 59, 999);
  }
  
  console.log(`Date range: ${startDate.toISOString()} to ${endDate.toISOString()}`);
  
  // Filter assignments in date range
  const filtered = allAssignments.filter((a: any) => {
    if (!a.due_at) return false;
    const dueDate = new Date(a.due_at);
    return dueDate >= startDate && dueDate <= endDate;
  });
  
  console.log(`Found ${filtered.length} assignments in range out of ${allAssignments.length} total`);
  
  // Sort by due date
  filtered.sort((a: any, b: any) => {
    return new Date(a.due_at).getTime() - new Date(b.due_at).getTime();
  });
  
  let answer = `# Assignments Due ${timeRange.replace('_', ' ').toUpperCase()}\n\n`;
  answer += `**Date Range:** ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}\n`;
  answer += `**Total Assignments:** ${filtered.length}\n\n`;
  
  if (filtered.length === 0) {
    answer += `✅ No assignments due ${timeRange.replace('_', ' ')}!\n\n`;
  } else {
    filtered.forEach((a: any, i: number) => {
      const dueDate = new Date(a.due_at);
      const hoursUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
      
      let urgency = '📅';
      if (hoursUntilDue < 0) urgency = '⚠️ OVERDUE';
      else if (hoursUntilDue <= 24) urgency = '🔴';
      else if (hoursUntilDue <= 72) urgency = '🟡';
      
      answer += `${i + 1}. ${urgency} **${a.name}**\n`;
      answer += `   - Course: ${a.courseName}\n`;
      answer += `   - Due: ${dueDate.toLocaleString()}\n`;
      
      if (hoursUntilDue > 0) {
        const days = Math.floor(hoursUntilDue / 24);
        const hours = Math.floor(hoursUntilDue % 24);
        answer += `   - Time left: ${days > 0 ? `${days} day${days > 1 ? 's' : ''}, ` : ''}${hours} hour${hours !== 1 ? 's' : ''}\n`;
      }
      
      answer += `\n`;
    });
  }
  
  return {
    answer,
    summary: `Found ${filtered.length} assignments due ${timeRange.replace('_', ' ')}`,
    assignments: filtered
  };
}

// Helper function to format grades
function formatCanvasGrades(enrollments: any[], courses: any[]): any {
  let answer = `# Your Canvas Grades\n\n`;
  answer += `**Total Enrollments:** ${enrollments.length}\n\n`;
  
  enrollments.forEach((enrollment: any, i: number) => {
    const grade = enrollment.grades?.current_score;
    const letterGrade = enrollment.grades?.current_grade;
    const course = courses.find((c: any) => c.id === enrollment.course_id);
    const courseName = course?.name || 'Unknown Course';
    
    answer += `${i + 1}. **${courseName}**\n`;
    if (grade !== null && grade !== undefined) {
      answer += `   - Score: ${grade}%`;
      if (letterGrade) answer += ` (${letterGrade})`;
      answer += `\n`;
    } else {
      answer += `   - Grade: Not available yet\n`;
    }
    answer += `\n`;
  });
  
  return {
    answer,
    summary: `Retrieved grades for ${enrollments.length} enrollments`,
    enrollments
  };
}

// Helper function to get calendar events
async function getCanvasCalendarEvents(baseUrl: string, token: string, timeRange: string): Promise<any> {
  const now = new Date();
  let startDate = new Date(now);
  let endDate = new Date(now);
  
  startDate.setHours(0, 0, 0, 0);
  
  switch (timeRange) {
    case 'today':
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'this_week':
      const currentDay = now.getDay();
      endDate.setDate(endDate.getDate() + (6 - currentDay));
      endDate.setHours(23, 59, 59, 999);
      break;
    default:
      endDate.setDate(endDate.getDate() + 30);
      endDate.setHours(23, 59, 59, 999);
  }
  
  const startDateStr = startDate.toISOString().split('T')[0];
  const endDateStr = endDate.toISOString().split('T')[0];
  
  const eventsUrl = `${baseUrl}/api/v1/calendar_events?start_date=${startDateStr}&end_date=${endDateStr}&per_page=100`;
  
  const response = await fetch(eventsUrl, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  const events = await response.json();
  
  let answer = `# Canvas Calendar Events\n\n`;
  answer += `**Total Events:** ${events.length}\n\n`;
  
  events.slice(0, 10).forEach((event: any, i: number) => {
    answer += `${i + 1}. **${event.title}**\n`;
    if (event.start_at) {
      answer += `   - Date: ${new Date(event.start_at).toLocaleString()}\n`;
    }
    if (event.context_name) {
      answer += `   - Course: ${event.context_name}\n`;
    }
    answer += `\n`;
  });
  
  return {
    answer,
    summary: `Found ${events.length} calendar events`,
    events
  };
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
              // CRITICAL: Extract the 'answer' field to avoid showing raw JSON
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