/**
 * Canvas Agent
 * 
 * Specialized agent for interacting with Canvas LMS (Learning Management System).
 * Provides tools for accessing course information, assignments, grades, and more.
 */

import { BaseAgent } from '../core/BaseAgent';
import { AgentConfig, AgentResult } from '../core/interfaces';
import { validateCanvasKeys, CONFIG } from '../../config/api-keys';
import { CanvasTool } from '../tools/CanvasTool';

export interface CanvasTask {
  topic: string;
  action?: 'get_courses' | 'get_assignments' | 'get_assignments_by_date' | 'get_assignments_by_course_name' | 'get_grades' | 'get_individual_assignment_grades' | 'get_calendar_events' | 'get_modules' | 'get_announcements' | 'general';
  courseId?: string;
  courseName?: string;
  moduleName?: string;
  timeRange?: 'today' | 'tomorrow' | 'this_week' | 'next_week' | 'this_month';
  startDate?: string;
  endDate?: string;
  eventType?: 'event' | 'assignment';
  outputFormat?: 'summary' | 'detailed' | 'raw';
}

export class CanvasAgent extends BaseAgent {
  private canvasTool: CanvasTool;

  constructor(config: Omit<AgentConfig, 'capabilities'>) {
    // Validate Canvas API keys
    const validation = validateCanvasKeys();
    if (!validation.isValid) {
      throw new Error(`Missing required Canvas API keys: ${validation.missing.join(', ')}`);
    }

    // Create complete agent configuration with capabilities
    const agentConfig: AgentConfig = {
      ...config,
      capabilities: [
        'canvas_access',
        'course_management',
        'assignment_tracking',
        'grade_checking',
        'announcement_retrieval',
        'calendar_access'
      ]
    };

    super(agentConfig.id, agentConfig);
    
    // Initialize Canvas tool
    this.canvasTool = new CanvasTool(
      CONFIG.CANVAS.API_KEY || '',
      CONFIG.CANVAS.BASE_URL || ''
    );
  }

  protected initialize(): void {
    // Register Canvas tool
    this.registerTool('canvas_api', this.canvasTool);
    
    console.log(`CanvasAgent ${this.id} initialized with Canvas tool`);
    console.log(`CanvasAgent ${this.id} using model:`, this.getModelConfig().model);
  }

  protected generateSystemPrompt(): string {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const formattedTime = currentDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    return `You are a Canvas Agent specialized in interacting with Canvas LMS (Learning Management System).

CURRENT DATE & TIME:
Today is ${formattedDate} at ${formattedTime}
Use this information to determine which assignments are upcoming, overdue, or due soon.

ROLE:
You are an expert assistant with access to Canvas LMS data and functionality. Your primary goal is to help students manage their courses, track assignments, check grades, and stay informed about course activities.

TOOLS AVAILABLE:
- canvas_api: Access Canvas LMS for courses, assignments, grades, calendar, and modules
  - get_courses: Get all enrolled courses
  - get_assignments: Get all assignments across all courses
  - get_assignments_by_date: Get assignments within a specific date range
    * Supports timeRange: 'today', 'tomorrow', 'this_week', 'next_week', 'this_month'
    * Or custom startDate and endDate
  - get_assignments_by_course_name: Get assignments for a course by name (no ID needed)
    * Searches by course name or course code (partial match supported)
    * Example: "Deep Learning", "CS 474", "Database"
  - get_course_assignments: Get assignments for a specific course (requires course ID)
  - get_grades: Get current grades for all courses
  - get_individual_assignment_grades: Get detailed grades for assignments in a specific course
  - get_calendar_events: Get calendar events within a date range
    * Supports timeRange: 'today', 'tomorrow', 'this_week', 'next_week', 'this_month'
    * Or custom startDate and endDate
    * Can filter by eventType: 'event' or 'assignment'
    * Defaults to next 30 days if no range specified
  - get_modules: Get course modules/weeks with their content (requires course ID)
    * Can optionally filter by module/week name
    * Shows all items in each module with due dates, types, and links
    * Example: moduleName "Week 1", "Module 2", "Introduction"

CAPABILITIES:
1. Access all enrolled courses
2. Retrieve and track assignments with due dates
3. Identify upcoming, overdue, and completed assignments
4. Organize assignments by course
5. Provide deadline awareness and time-sensitive information
6. Help students prioritize their work

INSTRUCTIONS:
1. Analyze the user's Canvas-related request
2. Identify if they're asking for:
   - A specific time range (today, this week, etc.) → use 'get_assignments_by_date' or 'get_calendar_events'
   - A specific course by name → use 'get_assignments_by_course_name'
   - All assignments → use 'get_assignments'
   - Course list → use 'get_courses'
   - Overall grades → use 'get_grades'
   - Assignment grades for a course → use 'get_individual_assignment_grades'
   - Calendar events → use 'get_calendar_events'
   - Course modules/weeks content → use 'get_modules'
3. Determine which tool action is needed and extract parameters:
   - For time-based queries: extract timeRange ('today', 'this_week', etc.)
   - For course-specific queries: extract courseName from user's message
   - For grade queries: determine if they want overall grades or assignment-specific grades
   - For calendar queries: extract timeRange and optionally eventType
   - For module queries: extract courseId and optionally moduleName (e.g., "Week 1", "Module 2")
4. Call the canvas_api tool with appropriate parameters
5. Parse the results and identify time-sensitive information
6. Present information in a clear, organized, student-friendly format
7. Highlight upcoming deadlines, urgent items, events, and grade performance

TIME AWARENESS:
- Compare assignment due dates with the current date/time
- Flag assignments that are:
  * Overdue (due date has passed)
  * Due today
  * Due within 24 hours
  * Due within 3 days
  * Due within a week
- Sort assignments by due date when relevant

OUTPUT REQUIREMENT:
Always provide clear, well-organized information including:
- Assignment names and due dates
- Course names for context
- Time remaining until due date
- Priority indicators (overdue, urgent, upcoming)
- Any action items or recommendations

STYLE:
- Write in a helpful, supportive, and organized tone
- Be concise but comprehensive
- Use time-based prioritization
- Use clear formatting for dates, deadlines, and status
- Help students avoid missing deadlines

Your purpose is to help students stay on top of their Canvas coursework and never miss a deadline.`;
  }

  public async execute(task: any): Promise<AgentResult> {
    const startTime = Date.now();
    this.setStatus('busy');

    try {
      const canvasTask = task as CanvasTask;
      
      // Validate task
      if (!this.canHandle(canvasTask)) {
        throw new Error('CanvasAgent cannot handle this task');
      }

      console.log(`CanvasAgent ${this.id} starting task: ${canvasTask.topic}`);
      console.log(`CanvasAgent ${this.id} action: ${canvasTask.action || 'general'}`);

      let results: any;

      // Determine which Canvas action to perform
      const action = canvasTask.action || 'get_assignments'; // Default to get_assignments
      
      if (action === 'get_assignments') {
        console.log(`CanvasAgent ${this.id} fetching all assignments`);
        const assignmentsResult = await this.canvasTool.execute({
          action: 'get_assignments',
          enrollmentState: 'active'
        });

        results = this.formatAssignments(assignmentsResult);
      } else if (action === 'get_assignments_by_date') {
        console.log(`CanvasAgent ${this.id} fetching assignments by date range`);
        const assignmentsResult = await this.canvasTool.execute({
          action: 'get_assignments_by_date',
          enrollmentState: 'active',
          timeRange: canvasTask.timeRange,
          startDate: canvasTask.startDate,
          endDate: canvasTask.endDate
        });

        results = this.formatAssignmentsByDate(assignmentsResult);
      } else if (action === 'get_assignments_by_course_name') {
        console.log(`CanvasAgent ${this.id} fetching assignments by course name: ${canvasTask.courseName}`);
        const assignmentsResult = await this.canvasTool.execute({
          action: 'get_assignments_by_course_name',
          courseName: canvasTask.courseName || canvasTask.topic
        });

        results = this.formatAssignmentsByCourseName(assignmentsResult);
      } else if (action === 'get_courses') {
        console.log(`CanvasAgent ${this.id} fetching courses`);
        const coursesResult = await this.canvasTool.execute({
          action: 'get_courses',
          enrollmentState: 'active'
        });

        results = this.formatCourses(coursesResult);
      } else if (action === 'get_grades') {
        console.log(`CanvasAgent ${this.id} fetching grades`);
        const gradesResult = await this.canvasTool.execute({
          action: 'get_grades',
          enrollmentState: 'active'
        });

        results = this.formatGrades(gradesResult);
      } else if (action === 'get_individual_assignment_grades') {
        console.log(`CanvasAgent ${this.id} fetching individual assignment grades for course: ${canvasTask.courseId}`);
        const assignmentGradesResult = await this.canvasTool.execute({
          action: 'get_individual_assignment_grades',
          courseId: canvasTask.courseId
        });

        results = this.formatIndividualAssignmentGrades(assignmentGradesResult);
      } else if (action === 'get_calendar_events') {
        console.log(`CanvasAgent ${this.id} fetching calendar events`);
        const calendarEventsResult = await this.canvasTool.execute({
          action: 'get_calendar_events',
          timeRange: canvasTask.timeRange,
          startDate: canvasTask.startDate,
          endDate: canvasTask.endDate,
          eventType: canvasTask.eventType
        });

        results = this.formatCalendarEvents(calendarEventsResult);
      } else if (action === 'get_modules') {
        console.log(`CanvasAgent ${this.id} fetching modules for course: ${canvasTask.courseId || canvasTask.courseName}`);
        const modulesResult = await this.canvasTool.execute({
          action: 'get_modules',
          courseId: canvasTask.courseId,
          courseName: canvasTask.courseName,
          moduleName: canvasTask.moduleName
        });

        results = this.formatModules(modulesResult);
      } else {
        results = {
          topic: canvasTask.topic,
          message: `Canvas action '${action}' is not yet implemented.`,
          availableActions: ['get_assignments', 'get_assignments_by_date', 'get_assignments_by_course_name', 'get_courses', 'get_grades', 'get_individual_assignment_grades', 'get_calendar_events', 'get_modules']
        };
      }

      this.setStatus('idle');
      
      return {
        success: true,
        result: results,
        executionTime: Date.now() - startTime,
        metadata: {
          agentId: this.id,
          taskType: 'canvas',
          action: canvasTask.action || 'general'
        }
      };
    } catch (error) {
      this.setStatus('error');
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime: Date.now() - startTime
      };
    }
  }

  public canHandle(task: any): boolean {
    return task && 
           typeof task === 'object' && 
           'topic' in task && 
           typeof task.topic === 'string' &&
           task.topic.trim().length > 0;
  }

  public getCapabilities(): string[] {
    return [
      'canvas_access',
      'course_management',
      'assignment_tracking',
      'grade_checking',
      'announcement_retrieval',
      'calendar_access'
    ];
  }

  /**
   * Format assignments with time awareness
   */
  private formatAssignments(data: any): any {
    const now = new Date();
    const assignments = data.assignments || [];

    // Categorize assignments by due date
    const overdue: any[] = [];
    const dueToday: any[] = [];
    const dueWithin24Hours: any[] = [];
    const dueWithin3Days: any[] = [];
    const dueWithinWeek: any[] = [];
    const upcoming: any[] = [];
    const noDueDate: any[] = [];

    assignments.forEach((assignment: any) => {
      if (!assignment.due_at) {
        noDueDate.push(assignment);
        return;
      }

      const dueDate = new Date(assignment.due_at);
      const timeDiff = dueDate.getTime() - now.getTime();
      const hoursDiff = timeDiff / (1000 * 60 * 60);
      const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

      if (timeDiff < 0) {
        overdue.push(assignment);
      } else if (hoursDiff <= 24 && dueDate.toDateString() === now.toDateString()) {
        dueToday.push(assignment);
      } else if (hoursDiff <= 24) {
        dueWithin24Hours.push(assignment);
      } else if (daysDiff <= 3) {
        dueWithin3Days.push(assignment);
      } else if (daysDiff <= 7) {
        dueWithinWeek.push(assignment);
      } else {
        upcoming.push(assignment);
      }
    });

    // Create formatted summary
    let summary = `# Canvas Assignments Summary\n\n`;
    summary += `**Total Assignments:** ${assignments.length}\n`;
    summary += `**Courses Checked:** ${data.coursesChecked || 'N/A'}\n\n`;

    if (overdue.length > 0) {
      summary += `## ⚠️ OVERDUE (${overdue.length})\n\n`;
      overdue.forEach((a: any) => {
        summary += `- **${a.name}** (${a.courseName})\n`;
        summary += `  - Due: ${new Date(a.due_at).toLocaleString()}\n`;
        summary += `  - Status: OVERDUE\n\n`;
      });
    }

    if (dueToday.length > 0) {
      summary += `## 🔴 DUE TODAY (${dueToday.length})\n\n`;
      dueToday.forEach((a: any) => {
        summary += `- **${a.name}** (${a.courseName})\n`;
        summary += `  - Due: ${new Date(a.due_at).toLocaleString()}\n\n`;
      });
    }

    if (dueWithin24Hours.length > 0) {
      summary += `## 🟠 DUE WITHIN 24 HOURS (${dueWithin24Hours.length})\n\n`;
      dueWithin24Hours.forEach((a: any) => {
        summary += `- **${a.name}** (${a.courseName})\n`;
        summary += `  - Due: ${new Date(a.due_at).toLocaleString()}\n\n`;
      });
    }

    if (dueWithin3Days.length > 0) {
      summary += `## 🟡 DUE WITHIN 3 DAYS (${dueWithin3Days.length})\n\n`;
      dueWithin3Days.forEach((a: any) => {
        summary += `- **${a.name}** (${a.courseName})\n`;
        summary += `  - Due: ${new Date(a.due_at).toLocaleString()}\n\n`;
      });
    }

    if (dueWithinWeek.length > 0) {
      summary += `## 📅 DUE WITHIN A WEEK (${dueWithinWeek.length})\n\n`;
      dueWithinWeek.forEach((a: any) => {
        summary += `- **${a.name}** (${a.courseName})\n`;
        summary += `  - Due: ${new Date(a.due_at).toLocaleString()}\n\n`;
      });
    }

    if (upcoming.length > 0) {
      summary += `## 📋 UPCOMING (${upcoming.length})\n\n`;
      upcoming.slice(0, 5).forEach((a: any) => {
        summary += `- **${a.name}** (${a.courseName})\n`;
        summary += `  - Due: ${new Date(a.due_at).toLocaleString()}\n\n`;
      });
      if (upcoming.length > 5) {
        summary += `... and ${upcoming.length - 5} more upcoming assignments\n\n`;
      }
    }

    return {
      answer: summary,
      summary: `Found ${assignments.length} assignments across ${data.coursesChecked} courses`,
      assignments: {
        overdue: overdue.length,
        dueToday: dueToday.length,
        dueWithin24Hours: dueWithin24Hours.length,
        dueWithin3Days: dueWithin3Days.length,
        dueWithinWeek: dueWithinWeek.length,
        upcoming: upcoming.length,
        noDueDate: noDueDate.length
      }
    };
  }

  /**
   * Format assignments by date range
   */
  private formatAssignmentsByDate(data: any): any {
    const assignments = data.assignments || [];
    const dateRange = data.dateRange;

    let summary = `# Canvas Assignments - ${dateRange?.description || 'Custom Range'}\n\n`;
    summary += `**Date Range:** ${new Date(dateRange.start).toLocaleDateString()} - ${new Date(dateRange.end).toLocaleDateString()}\n`;
    summary += `**Total Assignments:** ${assignments.length}\n`;
    summary += `**Courses Checked:** ${data.coursesChecked || 'N/A'}\n\n`;

    if (assignments.length === 0) {
      summary += `✅ No assignments due in this time period!\n\n`;
    } else {
      summary += `## 📋 Assignments Due\n\n`;
      
      assignments.forEach((assignment: any, index: number) => {
        const dueDate = new Date(assignment.due_at);
        const now = new Date();
        const hoursUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
        
        let urgency = '';
        if (hoursUntilDue < 0) {
          urgency = '⚠️ OVERDUE';
        } else if (hoursUntilDue <= 24) {
          urgency = '🔴 DUE SOON';
        } else if (hoursUntilDue <= 72) {
          urgency = '🟡';
        } else {
          urgency = '📅';
        }

        summary += `${index + 1}. ${urgency} **${assignment.name}**\n`;
        summary += `   - Course: ${assignment.courseName}\n`;
        summary += `   - Due: ${dueDate.toLocaleString()}\n`;
        
        if (hoursUntilDue > 0) {
          const days = Math.floor(hoursUntilDue / 24);
          const hours = Math.floor(hoursUntilDue % 24);
          summary += `   - Time left: ${days > 0 ? `${days} day${days > 1 ? 's' : ''}, ` : ''}${hours} hour${hours !== 1 ? 's' : ''}\n`;
        }
        
        summary += `\n`;
      });
    }

    return {
      answer: summary,
      summary: `Found ${assignments.length} assignments ${dateRange?.description || 'in date range'}`,
      assignments: assignments,
      dateRange: dateRange
    };
  }

  /**
   * Format assignments by course name
   */
  private formatAssignmentsByCourseName(data: any): any {
    const assignments = data.assignments || [];
    const matchedCourses = data.matchedCourses || [];

    let summary = `# Canvas Assignments by Course\n\n`;
    
    if (matchedCourses.length === 0) {
      summary += `❌ ${data.message || 'No courses found'}\n\n`;
      return {
        answer: summary,
        summary: data.message || 'No courses found',
        assignments: []
      };
    }

    summary += `**Matched Courses:** ${matchedCourses.map((c: any) => c.name).join(', ')}\n`;
    summary += `**Total Assignments:** ${assignments.length}\n\n`;

    if (assignments.length === 0) {
      summary += `✅ No assignments found for this course!\n\n`;
    } else {
      // Group assignments by urgency
      const now = new Date();
      
      assignments.forEach((assignment: any, index: number) => {
        const dueDate = assignment.due_at ? new Date(assignment.due_at) : null;
        
        let urgency = '📋';
        let timeInfo = 'No due date';
        
        if (dueDate) {
          const hoursUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
          
          if (hoursUntilDue < 0) {
            urgency = '⚠️ OVERDUE';
          } else if (hoursUntilDue <= 24) {
            urgency = '🔴 DUE SOON';
          } else if (hoursUntilDue <= 72) {
            urgency = '🟡';
          }
          
          timeInfo = dueDate.toLocaleString();
          
          if (hoursUntilDue > 0) {
            const days = Math.floor(hoursUntilDue / 24);
            const hours = Math.floor(hoursUntilDue % 24);
            timeInfo += ` (${days > 0 ? `${days} day${days > 1 ? 's' : ''}, ` : ''}${hours} hour${hours !== 1 ? 's' : ''} left)`;
          }
        }

        summary += `${index + 1}. ${urgency} **${assignment.name}**\n`;
        summary += `   - Due: ${timeInfo}\n`;
        if (assignment.points_possible) {
          summary += `   - Points: ${assignment.points_possible}\n`;
        }
        summary += `\n`;
      });
    }

    return {
      answer: summary,
      summary: `Found ${assignments.length} assignments for ${matchedCourses.map((c: any) => c.name).join(', ')}`,
      assignments: assignments,
      matchedCourses: matchedCourses
    };
  }

  /**
   * Format grades information
   */
  private formatGrades(data: any): any {
    const enrollments = data.enrollments || [];

    let summary = `# Canvas Grades Overview\n\n`;
    summary += `**Total Enrollments:** ${enrollments.length}\n\n`;

    if (enrollments.length === 0) {
      summary += `❌ No enrollments found with grade information.\n\n`;
      return {
        answer: summary,
        summary: 'No enrollments found with grade information',
        enrollments: []
      };
    }

    enrollments.forEach((enrollment: any, index: number) => {
      const currentScore = enrollment.current_score;
      const currentGrade = enrollment.current_grade;

      summary += `${index + 1}. **${enrollment.course_name}** (${enrollment.course_code})\n`;
      
      if (currentScore !== null && currentScore !== undefined) {
        summary += `   - Current Grade: ${currentScore}%`;
        if (currentGrade) {
          summary += ` (${currentGrade})`;
        }
        summary += `\n`;
      } else {
        summary += `   - Current Grade: Not available\n`;
      }

      summary += `   - Enrollment Type: ${enrollment.type}\n`;
      summary += `   - Status: ${enrollment.enrollment_state}\n\n`;
    });

    return {
      answer: summary,
      summary: `Retrieved grades for ${enrollments.length} enrollments`,
      enrollments: enrollments
    };
  }

  /**
   * Format individual assignment grades
   */
  private formatIndividualAssignmentGrades(data: any): any {
    const assignments = data.assignments || [];
    const gradedAssignments = data.gradedAssignments || [];

    let summary = `# Assignment Grades - Course ${data.courseId}\n\n`;
    summary += `**Total Assignments:** ${data.totalAssignments}\n`;
    summary += `**Graded Assignments:** ${data.gradedCount}\n\n`;

    if (gradedAssignments.length === 0) {
      summary += `❌ No graded assignments found for this course.\n\n`;
      return {
        answer: summary,
        summary: 'No graded assignments found',
        assignments: assignments,
        gradedAssignments: []
      };
    }

    gradedAssignments.forEach((assignment: any, index: number) => {
      const score = assignment.submission.score;
      const pointsPossible = assignment.points_possible;
      const grade = assignment.submission.grade;
      const submittedAt = assignment.submission.submitted_at;
      const gradedAt = assignment.submission.graded_at;
      const isLate = assignment.submission.late;
      const isMissing = assignment.submission.missing;
      const submissionType = assignment.submission.submission_type;
      const attachments = assignment.submission.attachments || [];
      const attempt = assignment.submission.attempt;
      const workflowState = assignment.submission.workflow_state;

      summary += `${index + 1}. **${assignment.name}**\n`;
      summary += `   - Score: ${score}/${pointsPossible}`;
      
      if (grade) {
        summary += ` (${grade})`;
      }
      
      const percentage = pointsPossible > 0 ? ((score / pointsPossible) * 100).toFixed(1) : '0';
      summary += ` (${percentage}%)\n`;

      if (submittedAt) {
        const submitDate = new Date(submittedAt);
        summary += `   - Submitted: ${submitDate.toLocaleString()}\n`;
      }

      if (gradedAt) {
        const gradeDate = new Date(gradedAt);
        summary += `   - Graded: ${gradeDate.toLocaleString()}\n`;
      }

      if (submissionType) {
        summary += `   - Type: ${submissionType.replace('_', ' ').toUpperCase()}\n`;
      }

      if (attempt && attempt > 1) {
        summary += `   - Attempt: ${attempt}\n`;
      }

      if (attachments.length > 0) {
        summary += `   - Files: ${attachments.length} attachment(s)\n`;
        attachments.forEach((attachment: any) => {
          summary += `     • ${attachment.display_name || attachment.filename}\n`;
        });
      }

      if (isLate) {
        summary += `   - ⚠️ **LATE SUBMISSION**\n`;
      } else if (isMissing) {
        summary += `   - ❌ **MISSING**\n`;
      } else if (workflowState === 'graded') {
        summary += `   - ✅ **GRADED**\n`;
      }

      summary += `\n`;
    });

    return {
      answer: summary,
      summary: `Found ${gradedAssignments.length} graded assignments out of ${data.totalAssignments} total`,
      assignments: assignments,
      gradedAssignments: gradedAssignments
    };
  }

  /**
   * Format courses information
   */
  private formatCourses(data: any): any {
    const courses = data.courses || [];

    let summary = `# Canvas Courses\n\n`;
    summary += `**Total Active Courses:** ${courses.length}\n\n`;

    courses.forEach((course: any, index: number) => {
      summary += `${index + 1}. **${course.name}**\n`;
      if (course.course_code) {
        summary += `   - Code: ${course.course_code}\n`;
      }
      if (course.id) {
        summary += `   - Course ID: ${course.id}\n`;
      }
      summary += `\n`;
    });

    return {
      answer: summary,
      summary: `Found ${courses.length} active courses`,
      courses: courses
    };
  }

  /**
   * Format calendar events
   */
  private formatCalendarEvents(data: any): any {
    const events = data.events || [];
    const dateRange = data.dateRange;
    const now = new Date();

    let summary = `# Canvas Calendar Events\n\n`;
    summary += `**Date Range:** ${new Date(dateRange.start).toLocaleDateString()} - ${new Date(dateRange.end).toLocaleDateString()}\n`;
    summary += `**Total Events:** ${events.length}\n`;
    if (data.eventType && data.eventType !== 'all') {
      summary += `**Type:** ${data.eventType}\n`;
    }
    summary += `\n`;

    if (events.length === 0) {
      summary += `✅ No events scheduled for this time period!\n\n`;
      return {
        answer: summary,
        summary: 'No events found',
        events: []
      };
    }

    // Categorize events
    const todayEvents: any[] = [];
    const upcomingEvents: any[] = [];
    const pastEvents: any[] = [];

    events.forEach((event: any) => {
      const eventDate = new Date(event.start_at || event.created_at);
      const isToday = eventDate.toDateString() === now.toDateString();
      const isPast = eventDate < now;

      if (isToday) {
        todayEvents.push(event);
      } else if (isPast) {
        pastEvents.push(event);
      } else {
        upcomingEvents.push(event);
      }
    });

    // Display today's events
    if (todayEvents.length > 0) {
      summary += `## 🔴 TODAY (${todayEvents.length})\n\n`;
      todayEvents.forEach((event: any) => {
        summary += this.formatSingleEvent(event, now);
      });
    }

    // Display upcoming events
    if (upcomingEvents.length > 0) {
      summary += `## 📅 UPCOMING (${upcomingEvents.length})\n\n`;
      upcomingEvents.forEach((event: any) => {
        summary += this.formatSingleEvent(event, now);
      });
    }

    // Display past events (if any)
    if (pastEvents.length > 0) {
      summary += `## ✅ PAST (${pastEvents.length})\n\n`;
      pastEvents.forEach((event: any) => {
        summary += this.formatSingleEvent(event, now);
      });
    }

    return {
      answer: summary,
      summary: `Found ${events.length} calendar events ${dateRange?.description || 'in date range'}`,
      events: events,
      dateRange: dateRange
    };
  }

  /**
   * Format a single calendar event
   */
  private formatSingleEvent(event: any, now: Date): string {
    let eventStr = `- **${event.title || 'Untitled Event'}**\n`;
    
    if (event.start_at) {
      const startDate = new Date(event.start_at);
      eventStr += `  - Start: ${startDate.toLocaleString()}\n`;
      
      // Calculate time until/since event
      const timeDiff = startDate.getTime() - now.getTime();
      const hoursDiff = Math.abs(timeDiff) / (1000 * 60 * 60);
      
      if (timeDiff > 0 && hoursDiff <= 24) {
        const hours = Math.floor(hoursDiff);
        const minutes = Math.floor((hoursDiff % 1) * 60);
        eventStr += `  - Time until: ${hours}h ${minutes}m\n`;
      }
    }

    if (event.end_at) {
      const endDate = new Date(event.end_at);
      eventStr += `  - End: ${endDate.toLocaleString()}\n`;
    }

    if (event.location_name) {
      eventStr += `  - Location: ${event.location_name}\n`;
    }

    if (event.location_address) {
      eventStr += `  - Address: ${event.location_address}\n`;
    }

    if (event.context_name) {
      eventStr += `  - Course: ${event.context_name}\n`;
    }

    if (event.description) {
      // Strip HTML tags and limit length
      const plainDescription = event.description.replace(/<[^>]*>/g, '').trim();
      if (plainDescription) {
        const shortDesc = plainDescription.length > 100 
          ? plainDescription.substring(0, 100) + '...' 
          : plainDescription;
        eventStr += `  - Description: ${shortDesc}\n`;
      }
    }

    if (event.html_url) {
      eventStr += `  - Link: ${event.html_url}\n`;
    }

    eventStr += `\n`;
    return eventStr;
  }

  /**
   * Format modules (weeks) with their content
   */
  private formatModules(data: any): any {
    const modules = data.modules || [];
    const courseId = data.courseId;
    const courseName = data.courseName;
    const searchTerm = data.searchTerm;

    let summary = `# Course Modules`;
    if (searchTerm) {
      summary += ` - "${searchTerm}"`;
    }
    summary += `\n\n`;
    
    if (courseName) {
      summary += `**Course:** ${courseName}\n`;
    }
    summary += `**Course ID:** ${courseId}\n`;
    summary += `**Total Modules:** ${modules.length}\n\n`;

    if (modules.length === 0) {
      if (searchTerm) {
        summary += `❌ ${data.message || `No modules found matching "${searchTerm}"`}\n\n`;
      } else {
        summary += `❌ No modules found for this course.\n\n`;
      }
      return {
        answer: summary,
        summary: data.message || 'No modules found',
        modules: []
      };
    }

    modules.forEach((module: any, moduleIndex: number) => {
      summary += `## ${moduleIndex + 1}. ${module.name}\n\n`;
      
      if (module.unlock_at) {
        const unlockDate = new Date(module.unlock_at);
        const now = new Date();
        if (unlockDate > now) {
          summary += `🔒 **Unlocks:** ${unlockDate.toLocaleString()}\n`;
        } else {
          summary += `✅ **Unlocked:** ${unlockDate.toLocaleString()}\n`;
        }
      } else {
        summary += `✅ **Status:** Available now\n`;
      }

      if (module.published !== undefined) {
        summary += `📌 **Published:** ${module.published ? 'Yes' : 'No'}\n`;
      }

      if (module.items_count) {
        summary += `📚 **Items:** ${module.items_count}\n`;
      }

      summary += `\n`;

      // Display module items
      const items = module.items || [];
      if (items.length > 0) {
        items.forEach((item: any, itemIndex: number) => {
          // Type emoji mapping
          const typeEmoji: Record<string, string> = {
            'Assignment': '📝',
            'Quiz': '📋',
            'Page': '📄',
            'Discussion': '💬',
            'File': '📎',
            'ExternalUrl': '🔗',
            'ExternalTool': '🔧',
            'SubHeader': '📌'
          };

          const emoji = typeEmoji[item.type] || '📌';
          summary += `   ${itemIndex + 1}. ${emoji} **${item.title}**\n`;
          summary += `      - Type: ${item.type}\n`;

          // Show due date if available
          if (item.content_details?.due_at) {
            const dueDate = new Date(item.content_details.due_at);
            const now = new Date();
            const isOverdue = dueDate < now;
            
            if (isOverdue) {
              summary += `      - Due: ${dueDate.toLocaleString()} ⚠️ OVERDUE\n`;
            } else {
              summary += `      - Due: ${dueDate.toLocaleString()}\n`;
              
              // Calculate time until due
              const timeDiff = dueDate.getTime() - now.getTime();
              const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
              
              if (daysDiff <= 1) {
                const hours = Math.floor(timeDiff / (1000 * 60 * 60));
                summary += `      - Time left: ${hours} hours 🔴\n`;
              } else if (daysDiff <= 3) {
                summary += `      - Time left: ${Math.floor(daysDiff)} days 🟡\n`;
              } else if (daysDiff <= 7) {
                summary += `      - Time left: ${Math.floor(daysDiff)} days 📅\n`;
              }
            }
          }

          // Show points if available
          if (item.content_details?.points_possible) {
            summary += `      - Points: ${item.content_details.points_possible}\n`;
          }

          // Show completion requirement
          if (item.completion_requirement) {
            const req = item.completion_requirement;
            if (req.type === 'must_view') {
              summary += `      - Requirement: Must view\n`;
            } else if (req.type === 'must_submit') {
              summary += `      - Requirement: Must submit\n`;
            } else if (req.type === 'must_contribute') {
              summary += `      - Requirement: Must contribute\n`;
            } else if (req.type === 'min_score') {
              summary += `      - Requirement: Min score ${req.min_score}\n`;
            }
            
            if (req.completed) {
              summary += `      - ✅ Completed\n`;
            }
          }

          // Show URL
          if (item.html_url) {
            summary += `      - Link: ${item.html_url}\n`;
          } else if (item.external_url) {
            summary += `      - Link: ${item.external_url}\n`;
          }

          summary += `\n`;
        });
      } else {
        summary += `   _No items in this module_\n\n`;
      }

      summary += `\n`;
    });

    return {
      answer: summary,
      summary: searchTerm 
        ? `Found ${modules.length} module(s) matching "${searchTerm}" with ${modules.reduce((sum: number, m: any) => sum + (m.items?.length || 0), 0)} total items`
        : `Retrieved ${modules.length} modules with ${modules.reduce((sum: number, m: any) => sum + (m.items?.length || 0), 0)} total items`,
      modules: modules,
      courseId: courseId
    };
  }
}


