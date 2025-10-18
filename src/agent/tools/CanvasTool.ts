/**
 * Canvas Tool
 * 
 * Tool for interacting with Canvas LMS API to retrieve courses, assignments, grades, etc.
 */

import { BaseTool } from './BaseTool';
import { ToolResult } from '../core/interfaces';
import { CONFIG } from '../../config/api-keys';

export interface CanvasOptions {
  action: 'get_courses' | 'get_assignments' | 'get_course_assignments' | 'get_assignments_by_date' | 'get_assignments_by_course_name' | 'get_grades' | 'get_individual_assignment_grades' | 'get_calendar_events' | 'get_modules';
  courseId?: string;
  courseName?: string; // Course name or partial name to search for
  moduleName?: string; // Module/week name to search for
  enrollmentState?: 'active' | 'completed' | 'all';
  startDate?: string; // ISO date string
  endDate?: string;   // ISO date string
  timeRange?: 'today' | 'tomorrow' | 'this_week' | 'next_week' | 'this_month';
  eventType?: 'event' | 'assignment'; // Calendar event type filter
}

export class CanvasTool extends BaseTool {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string) {
    super(
      'canvas_api',
      'Canvas LMS API tool for accessing courses, assignments, and grades',
      {
        action: { type: 'string', required: true, description: 'Action to perform: get_courses, get_assignments, get_course_assignments, get_grades' },
        courseId: { type: 'string', required: false, description: 'Course ID for course-specific actions' },
        enrollmentState: { type: 'string', required: false, description: 'Enrollment state filter: active, completed, or all' }
      }
    );
    
    // Clean API key and base URL
    this.apiKey = apiKey.replace(/^=/, ''); // Remove leading = if present
    this.baseUrl = baseUrl.replace(/^=/, '').replace(/\/$/, ''); // Remove leading = and trailing /
    
    console.log(`Canvas tool initialized with baseUrl: ${this.baseUrl}`);
  }

  protected async initialize(): Promise<void> {
    console.log('Canvas tool initialized successfully');
  }

  protected async executeInternal(params: any): Promise<any> {
    const options = params as CanvasOptions;
    
    switch (options.action) {
      case 'get_courses':
        return await this.getCourses(options.enrollmentState || 'active');
      
      case 'get_assignments':
        return await this.getAllAssignments(options.enrollmentState || 'active');
      
      case 'get_course_assignments':
        if (!options.courseId) {
          throw new Error('courseId is required for get_course_assignments action');
        }
        return await this.getCourseAssignments(options.courseId);
      
      case 'get_assignments_by_date':
        return await this.getAssignmentsByDateRange(options);
      
      case 'get_assignments_by_course_name':
        if (!options.courseName) {
          throw new Error('courseName is required for get_assignments_by_course_name action');
        }
        return await this.getAssignmentsByCourseName(options.courseName);
      
      case 'get_grades':
        return await this.getGrades(options.enrollmentState || 'active');
      
      case 'get_individual_assignment_grades':
        if (!options.courseId) {
          throw new Error('courseId is required for get_individual_assignment_grades action');
        }
        return await this.getIndividualAssignmentGrades(options.courseId);
      
      case 'get_calendar_events':
        return await this.getCalendarEvents(options);
      
      case 'get_modules':
        if (!options.courseId && !options.courseName) {
          throw new Error('courseId or courseName is required for get_modules action');
        }
        return await this.getModules(options.courseId, options.courseName, options.moduleName);
      
      default:
        throw new Error(`Unknown action: ${options.action}`);
    }
  }

  /**
   * Get all active courses for the user
   */
  private async getCourses(enrollmentState: string = 'active'): Promise<any> {
    try {
      const url = `${this.baseUrl}/courses?enrollment_state=${enrollmentState}&per_page=${CONFIG.CANVAS.DEFAULT_PER_PAGE}`;
      console.log('Fetching courses from:', url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Canvas API response status:', response.status);
      console.log('Canvas API response headers:', response.headers.get('content-type'));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Canvas API error response:', errorText.substring(0, 500));
        throw new Error(`Canvas API error: ${response.status} ${response.statusText}`);
      }

      const courses = await response.json();
      console.log(`Retrieved ${courses.length} courses from Canvas`);
      
      return {
        courses,
        totalCount: courses.length
      };
    } catch (error) {
      console.error('Error fetching courses from Canvas:', error);
      throw error;
    }
  }

  /**
   * Get assignments for a specific course
   */
  private async getCourseAssignments(courseId: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/courses/${courseId}/assignments?per_page=${CONFIG.CANVAS.DEFAULT_PER_PAGE}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Canvas API error: ${response.status} ${response.statusText}`);
      }

      const assignments = await response.json();
      console.log(`Retrieved ${assignments.length} assignments for course ${courseId}`);
      
      return {
        courseId,
        assignments,
        totalCount: assignments.length
      };
    } catch (error) {
      console.error(`Error fetching assignments for course ${courseId}:`, error);
      throw error;
    }
  }

  /**
   * Get all assignments across all active courses
   */
  private async getAllAssignments(enrollmentState: string = 'active'): Promise<any> {
    try {
      // First get all courses
      const coursesData = await this.getCourses(enrollmentState);
      const courses = coursesData.courses;

      // Then get assignments for each course
      const allAssignments: any[] = [];
      
      for (const course of courses) {
        try {
          const courseAssignments = await this.getCourseAssignments(course.id);
          
          // Add course name to each assignment for context
          const assignmentsWithCourse = courseAssignments.assignments.map((assignment: any) => ({
            ...assignment,
            courseName: course.name,
            courseId: course.id
          }));
          
          allAssignments.push(...assignmentsWithCourse);
        } catch (error) {
          console.warn(`Failed to get assignments for course ${course.id}:`, error);
          // Continue with other courses
        }
      }

      console.log(`Retrieved total of ${allAssignments.length} assignments across ${courses.length} courses`);
      
      return {
        assignments: allAssignments,
        totalCount: allAssignments.length,
        coursesChecked: courses.length
      };
    } catch (error) {
      console.error('Error fetching all assignments:', error);
      throw error;
    }
  }

  /**
   * Get assignments within a specific date range
   */
  private async getAssignmentsByDateRange(options: CanvasOptions): Promise<any> {
    try {
      // First get all assignments
      const allAssignmentsData = await this.getAllAssignments(options.enrollmentState || 'active');
      const allAssignments = allAssignmentsData.assignments;

      // Calculate date range
      const { startDate, endDate } = this.calculateDateRange(options.timeRange, options.startDate, options.endDate);
      
      console.log(`Filtering assignments from ${startDate.toISOString()} to ${endDate.toISOString()}`);

      // Filter assignments that fall within the date range
      const filteredAssignments = allAssignments.filter((assignment: any) => {
        if (!assignment.due_at) {
          return false; // Skip assignments with no due date
        }

        const dueDate = new Date(assignment.due_at);
        return dueDate >= startDate && dueDate <= endDate;
      });

      // Sort by due date (earliest first)
      filteredAssignments.sort((a: any, b: any) => {
        const dateA = new Date(a.due_at);
        const dateB = new Date(b.due_at);
        return dateA.getTime() - dateB.getTime();
      });

      console.log(`Found ${filteredAssignments.length} assignments in date range`);

      return {
        assignments: filteredAssignments,
        totalCount: filteredAssignments.length,
        coursesChecked: allAssignmentsData.coursesChecked,
        dateRange: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          description: options.timeRange || 'custom'
        }
      };
    } catch (error) {
      console.error('Error fetching assignments by date range:', error);
      throw error;
    }
  }

  /**
   * Calculate date range based on time range keyword or explicit dates
   */
  private calculateDateRange(
    timeRange?: string,
    startDateStr?: string,
    endDateStr?: string
  ): { startDate: Date; endDate: Date } {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    if (startDateStr && endDateStr) {
      // Use explicit dates if provided
      startDate = new Date(startDateStr);
      endDate = new Date(endDateStr);
    } else if (timeRange) {
      // Calculate based on time range keyword
      switch (timeRange) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          endDate = new Date(now.setHours(23, 59, 59, 999));
          break;

        case 'tomorrow':
          const tomorrow = new Date(now);
          tomorrow.setDate(tomorrow.getDate() + 1);
          startDate = new Date(tomorrow.setHours(0, 0, 0, 0));
          endDate = new Date(tomorrow.setHours(23, 59, 59, 999));
          break;

        case 'this_week':
          // Get current day of week (0 = Sunday, 6 = Saturday)
          const currentDay = now.getDay();
          // Start from today
          startDate = new Date(now.setHours(0, 0, 0, 0));
          // End on Saturday of this week
          endDate = new Date(now);
          endDate.setDate(endDate.getDate() + (6 - currentDay));
          endDate.setHours(23, 59, 59, 999);
          break;

        case 'next_week':
          const currentDayNextWeek = now.getDay();
          // Start on Sunday of next week
          startDate = new Date(now);
          startDate.setDate(startDate.getDate() + (7 - currentDayNextWeek));
          startDate.setHours(0, 0, 0, 0);
          // End on Saturday of next week
          endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + 6);
          endDate.setHours(23, 59, 59, 999);
          break;

        case 'this_month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
          break;

        default:
          // Default to next 7 days
          startDate = new Date(now.setHours(0, 0, 0, 0));
          endDate = new Date(now);
          endDate.setDate(endDate.getDate() + 7);
          endDate.setHours(23, 59, 59, 999);
      }
    } else {
      // Default to next 7 days if nothing specified
      startDate = new Date(now.setHours(0, 0, 0, 0));
      endDate = new Date(now);
      endDate.setDate(endDate.getDate() + 7);
      endDate.setHours(23, 59, 59, 999);
    }

    return { startDate, endDate };
  }

  /**
   * Get grades for all courses using enrollments endpoint
   */
  private async getGrades(enrollmentState: string = 'active'): Promise<any> {
    try {
      console.log(`Fetching grades for ${enrollmentState} enrollments`);
      
      // First, get all courses to have course names available
      const coursesData = await this.getCourses(enrollmentState);
      const courseMap = new Map();
      coursesData.courses.forEach((course: any) => {
        courseMap.set(course.id, {
          name: course.name,
          code: course.course_code
        });
      });
      
      // Use raw query string to preserve [] brackets as Canvas expects
      const url = `${this.baseUrl}/users/self/enrollments?state[]=${enrollmentState}&type[]=StudentEnrollment`;
      console.log(`Making request to: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error(`Canvas API error: ${response.status} ${response.statusText}`);
        console.error(`Request URL: ${url}`);
        throw new Error(`Canvas API error: ${response.status} ${response.statusText}`);
      }

      const enrollments = await response.json();
      console.log(`Retrieved ${enrollments.length} enrollments with grade information`);

      const enrollmentsWithGrades = enrollments.map((enrollment: any) => {
        const grades = enrollment.grades || {};
        const courseInfo = courseMap.get(enrollment.course_id) || {};
        
        return {
          id: enrollment.id,
          course_id: enrollment.course_id,
          course_name: courseInfo.name || `Course ${enrollment.course_id}`,
          course_code: courseInfo.code || 'N/A',
          current_score: grades.current_score !== undefined ? grades.current_score : null,
          current_grade: grades.current_grade !== undefined ? grades.current_grade : null,
          enrollment_state: enrollment.enrollment_state || 'unknown',
          type: enrollment.type || 'StudentEnrollment'
        };
      });

      return {
        enrollments: enrollmentsWithGrades,
        totalCount: enrollmentsWithGrades.length,
        enrollmentState: enrollmentState
      };
    } catch (error) {
      console.error('Error fetching grades:', error);
      throw error;
    }
  }

  /**
   * Get individual assignment grades for a specific course using submissions endpoint
   */
  private async getIndividualAssignmentGrades(courseId: string): Promise<any> {
    try {
      console.log(`Fetching assignment grades for course ${courseId}`);
      
      // Use raw query string to preserve [] brackets as Canvas expects
      const url = `${this.baseUrl}/courses/${courseId}/students/submissions?student_ids[]=self&include[]=assignment`;
      console.log(`Making request to: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error(`Canvas API error: ${response.status} ${response.statusText}`);
        console.error(`Request URL: ${url}`);
        throw new Error(`Canvas API error: ${response.status} ${response.statusText}`);
      }

      const submissions = await response.json();
      console.log(`Retrieved ${submissions.length} submissions with assignment data`);

      // Map submissions similar to other assignment methods
      const submissionsWithGrades = submissions.map((submission: any) => {
        const assignment = submission.assignment || {};
        
        return {
          id: assignment.id,
          name: assignment.name,
          description: assignment.description,
          points_possible: assignment.points_possible,
          due_at: assignment.due_at,
          unlock_at: assignment.unlock_at,
          lock_at: assignment.lock_at,
          assignment_group_id: assignment.assignment_group_id,
          grading_type: assignment.grading_type,
          grading_standard_id: assignment.grading_standard_id,
          position: assignment.position,
          peer_reviews: assignment.peer_reviews,
          automatic_peer_reviews: assignment.automatic_peer_reviews,
          notify_of_update: assignment.notify_of_update,
          group_category_id: assignment.group_category_id,
          grade_group_students_individually: assignment.grade_group_students_individually,
          external_tool_tag_attributes: assignment.external_tool_tag_attributes,
          course_id: assignment.course_id,
          submission_types: assignment.submission_types,
          has_submitted_submissions: assignment.has_submitted_submissions,
          due_date_required: assignment.due_date_required,
          max_name_length: assignment.max_name_length,
          in_closed_grading_period: assignment.in_closed_grading_period,
          graded_submissions_exist: assignment.graded_submissions_exist,
          is_quiz_assignment: assignment.is_quiz_assignment,
          can_duplicate: assignment.can_duplicate,
          original_course_id: assignment.original_course_id,
          original_assignment_id: assignment.original_assignment_id,
          original_lti_resource_link_id: assignment.original_lti_resource_link_id,
          original_assignment_name: assignment.original_assignment_name,
          original_quiz_id: assignment.original_quiz_id,
          workflow_state: assignment.workflow_state,
          important_dates: assignment.important_dates,
          muted: assignment.muted,
          html_url: assignment.html_url,
          quiz_id: assignment.quiz_id,
          anonymous_submissions: assignment.anonymous_submissions,
          published: assignment.published,
          only_visible_to_overrides: assignment.only_visible_to_overrides,
          visible_to_everyone: assignment.visible_to_everyone,
          locked_for_user: assignment.locked_for_user,
          submissions_download_url: assignment.submissions_download_url,
          post_manually: assignment.post_manually,
          anonymize_students: assignment.anonymize_students,
          require_lockdown_browser: assignment.require_lockdown_browser,
          restrict_quantitative_data: assignment.restrict_quantitative_data,
          allowed_extensions: assignment.allowed_extensions,
          submission: {
            id: submission.id,
            user_id: submission.user_id,
            url: submission.url,
            score: submission.score,
            grade: submission.grade,
            excused: submission.excused,
            attempt: submission.attempt,
            submission_type: submission.submission_type,
            submitted_at: submission.submitted_at,
            body: submission.body,
            assignment_id: submission.assignment_id,
            graded_at: submission.graded_at,
            grade_matches_current_submission: submission.grade_matches_current_submission,
            grader_id: submission.grader_id,
            workflow_state: submission.workflow_state,
            late_policy_status: submission.late_policy_status,
            points_deducted: submission.points_deducted,
            grading_period_id: submission.grading_period_id,
            cached_due_date: submission.cached_due_date,
            extra_attempts: submission.extra_attempts,
            posted_at: submission.posted_at,
            redo_request: submission.redo_request,
            sticker: submission.sticker,
            custom_grade_status_id: submission.custom_grade_status_id,
            late: submission.late,
            missing: submission.missing,
            seconds_late: submission.seconds_late,
            entered_grade: submission.entered_grade,
            entered_score: submission.entered_score,
            preview_url: submission.preview_url,
            attachments: submission.attachments
          },
          has_grade: submission.score !== null && submission.score !== undefined
        };
      });

      // Filter to only show assignments that have been graded
      const gradedAssignments = submissionsWithGrades.filter((assignment: any) => assignment.has_grade);

      return {
        courseId: courseId,
        assignments: submissionsWithGrades,
        gradedAssignments: gradedAssignments,
        totalAssignments: submissionsWithGrades.length,
        gradedCount: gradedAssignments.length
      };
    } catch (error) {
      console.error('Error fetching assignment grades:', error);
      throw error;
    }
  }

  /**
   * Get assignments by course name (searches by name instead of requiring ID)
   */
  private async getAssignmentsByCourseName(courseName: string): Promise<any> {
    try {
      // First get all courses
      const coursesData = await this.getCourses('active');
      const courses = coursesData.courses;

      // Search for course by name (case-insensitive partial match)
      const searchTerm = courseName.toLowerCase().trim();
      const matchingCourses = courses.filter((course: any) => {
        const name = course.name?.toLowerCase() || '';
        const code = course.course_code?.toLowerCase() || '';
        return name.includes(searchTerm) || code.includes(searchTerm);
      });

      if (matchingCourses.length === 0) {
        console.log(`No courses found matching: "${courseName}"`);
        return {
          assignments: [],
          totalCount: 0,
          matchedCourses: [],
          searchTerm: courseName,
          message: `No courses found matching "${courseName}". Try using a different name or check your enrolled courses.`
        };
      }

      console.log(`Found ${matchingCourses.length} course(s) matching "${courseName}":`, 
        matchingCourses.map((c: any) => c.name)
      );

      // Get assignments for all matching courses
      const allAssignments: any[] = [];
      
      for (const course of matchingCourses) {
        try {
          const courseAssignments = await this.getCourseAssignments(course.id);
          
          // Add course name to each assignment
          const assignmentsWithCourse = courseAssignments.assignments.map((assignment: any) => ({
            ...assignment,
            courseName: course.name,
            courseCode: course.course_code,
            courseId: course.id
          }));
          
          allAssignments.push(...assignmentsWithCourse);
        } catch (error) {
          console.warn(`Failed to get assignments for course ${course.id}:`, error);
        }
      }

      // Sort by due date
      allAssignments.sort((a: any, b: any) => {
        if (!a.due_at) return 1;
        if (!b.due_at) return -1;
        const dateA = new Date(a.due_at);
        const dateB = new Date(b.due_at);
        return dateA.getTime() - dateB.getTime();
      });

      console.log(`Found ${allAssignments.length} assignments for "${courseName}"`);

      return {
        assignments: allAssignments,
        totalCount: allAssignments.length,
        matchedCourses: matchingCourses.map((c: any) => ({
          id: c.id,
          name: c.name,
          code: c.course_code
        })),
        searchTerm: courseName
      };
    } catch (error) {
      console.error('Error fetching assignments by course name:', error);
      throw error;
    }
  }

  /**
   * Get calendar events within a specific date range
   */
  private async getCalendarEvents(options: CanvasOptions): Promise<any> {
    try {
      console.log('Fetching calendar events');
      
      // Calculate date range
      let startDate: Date;
      let endDate: Date;

      if (options.timeRange || options.startDate || options.endDate) {
        const dateRange = this.calculateDateRange(options.timeRange, options.startDate, options.endDate);
        startDate = dateRange.startDate;
        endDate = dateRange.endDate;
      } else {
        // Default to next 30 days
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date();
        endDate.setDate(endDate.getDate() + 30);
        endDate.setHours(23, 59, 59, 999);
      }

      console.log(`Fetching calendar events from ${startDate.toISOString()} to ${endDate.toISOString()}`);

      // Format dates as YYYY-MM-DD for Canvas API
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];

      // Build URL with query parameters
      let url = `${this.baseUrl}/calendar_events?start_date=${startDateStr}&end_date=${endDateStr}&per_page=${CONFIG.CANVAS.DEFAULT_PER_PAGE}`;
      
      // Add type filter if specified
      if (options.eventType) {
        url += `&type=${options.eventType}`;
      }

      console.log(`Making request to: ${url}`);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error(`Canvas API error: ${response.status} ${response.statusText}`);
        console.error(`Request URL: ${url}`);
        throw new Error(`Canvas API error: ${response.status} ${response.statusText}`);
      }

      const events = await response.json();
      console.log(`Retrieved ${events.length} calendar events`);

      // Sort events by start date (earliest first)
      events.sort((a: any, b: any) => {
        const dateA = new Date(a.start_at || a.created_at);
        const dateB = new Date(b.start_at || b.created_at);
        return dateA.getTime() - dateB.getTime();
      });

      return {
        events: events,
        totalCount: events.length,
        dateRange: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          description: options.timeRange || 'custom'
        },
        eventType: options.eventType || 'all'
      };
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw error;
    }
  }

  /**
   * Get modules (weeks) for a specific course with their content items
   */
  private async getModules(courseId?: string, courseName?: string, moduleName?: string): Promise<any> {
    try {
      // If courseName is provided, find the course ID first
      let actualCourseId = courseId;
      let actualCourseName = courseName;
      
      if (courseName && !courseId) {
        console.log(`Looking up course ID for: ${courseName}`);
        const coursesData = await this.getCourses('active');
        const courses = coursesData.courses;
        
        const searchTerm = courseName.toLowerCase().trim();
        const matchingCourses = courses.filter((course: any) => {
          const name = course.name?.toLowerCase() || '';
          const code = course.course_code?.toLowerCase() || '';
          return name.includes(searchTerm) || code.includes(searchTerm);
        });
        
        if (matchingCourses.length === 0) {
          return {
            modules: [],
            totalModules: 0,
            courseId: null,
            courseName: courseName,
            message: `No courses found matching "${courseName}"`
          };
        }
        
        // Use the first matching course
        actualCourseId = matchingCourses[0].id;
        actualCourseName = matchingCourses[0].name;
        console.log(`Found course: ${actualCourseName} (ID: ${actualCourseId})`);
      }
      
      if (!actualCourseId) {
        throw new Error('Could not determine course ID');
      }
      
      console.log(`Fetching modules for course ${actualCourseId}`);
      
      // Get all modules with items included
      const url = `${this.baseUrl}/courses/${actualCourseId}/modules?include[]=items&per_page=${CONFIG.CANVAS.DEFAULT_PER_PAGE}`;
      console.log(`Making request to: ${url}`);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error(`Canvas API error: ${response.status} ${response.statusText}`);
        console.error(`Request URL: ${url}`);
        throw new Error(`Canvas API error: ${response.status} ${response.statusText}`);
      }

      const modules = await response.json();
      console.log(`Retrieved ${modules.length} modules for course ${courseId}`);

      // Filter modules if moduleName is provided
      let filteredModules = modules;
      if (moduleName) {
        const searchTerm = moduleName.toLowerCase().trim();
        filteredModules = modules.filter((module: any) => {
          const name = module.name?.toLowerCase() || '';
          return name.includes(searchTerm);
        });
        
        console.log(`Filtered to ${filteredModules.length} module(s) matching "${moduleName}"`);
        
        if (filteredModules.length === 0) {
          return {
            modules: [],
            totalModules: 0,
            courseId: courseId,
            searchTerm: moduleName,
            message: `No modules found matching "${moduleName}"`
          };
        }
      }

      // For each module, get detailed items
      const modulesWithDetails = await Promise.all(
        filteredModules.map(async (module: any) => {
          try {
            // Get detailed module items
            const itemsUrl = `${this.baseUrl}/courses/${courseId}/modules/${module.id}/items?include[]=content_details&per_page=${CONFIG.CANVAS.DEFAULT_PER_PAGE}`;
            
            const itemsResponse = await fetch(itemsUrl, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
              }
            });

            if (!itemsResponse.ok) {
              console.warn(`Failed to fetch items for module ${module.id}`);
              return {
                ...module,
                items: module.items || [],
                detailedItemsAvailable: false
              };
            }

            const detailedItems = await itemsResponse.json();
            
            return {
              id: module.id,
              name: module.name,
              position: module.position,
              unlock_at: module.unlock_at,
              require_sequential_progress: module.require_sequential_progress,
              prerequisite_module_ids: module.prerequisite_module_ids,
              items_count: module.items_count,
              items_url: module.items_url,
              published: module.published,
              state: module.state,
              completed_at: module.completed_at,
              items: detailedItems.map((item: any) => ({
                id: item.id,
                title: item.title,
                type: item.type,
                content_id: item.content_id,
                html_url: item.html_url,
                url: item.url,
                page_url: item.page_url,
                external_url: item.external_url,
                position: item.position,
                indent: item.indent,
                completion_requirement: item.completion_requirement,
                published: item.published,
                content_details: item.content_details ? {
                  points_possible: item.content_details.points_possible,
                  due_at: item.content_details.due_at,
                  unlock_at: item.content_details.unlock_at,
                  lock_at: item.content_details.lock_at,
                  locked_for_user: item.content_details.locked_for_user
                } : null
              }))
            };
          } catch (error) {
            console.warn(`Error fetching details for module ${module.id}:`, error);
            return {
              ...module,
              items: module.items || [],
              detailedItemsAvailable: false
            };
          }
        })
      );

      return {
        modules: modulesWithDetails,
        totalModules: modulesWithDetails.length,
        courseId: actualCourseId,
        courseName: actualCourseName || null,
        searchTerm: moduleName || null
      };
    } catch (error) {
      console.error('Error fetching modules:', error);
      throw error;
    }
  }
}


