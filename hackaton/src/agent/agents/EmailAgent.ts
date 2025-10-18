/**
 * Email Agent
 * 
 * Specialized agent for composing and managing emails.
 * Helps users craft professional emails by guiding them through the process
 * of providing subject, content, recipient, and sender information.
 */

import { BaseAgent } from '../core/BaseAgent';
import { AgentConfig, AgentResult } from '../core/interfaces';
import { validateEmailKeys, CONFIG } from '../../config/api-keys';
import { EmailTool } from '../tools/EmailTool';

export interface EmailTask {
  topic: string;
  action?: 'compose' | 'draft' | 'help' | 'send' | 'confirm' | 'general';
  subject?: string;
  content?: string;
  recipient?: string;
  sender?: string;
  cc?: string;
  bcc?: string;
  outputFormat?: 'draft' | 'send' | 'preview';
  confirmSend?: boolean;
}

export class EmailAgent extends BaseAgent {
  private emailTool: EmailTool;

  constructor(config: Omit<AgentConfig, 'capabilities'>) {
    // Validate Email API keys
    const validation = validateEmailKeys();
    if (!validation.isValid) {
      console.warn(`Email configuration incomplete. Missing: ${validation.missing.join(', ')}`);
      console.warn('Email sending functionality will be limited.');
    }

    // Create complete agent configuration with capabilities
    const agentConfig: AgentConfig = {
      ...config,
      capabilities: [
        'email_composition',
        'email_drafting',
        'email_sending',
        'professional_writing',
        'email_formatting',
        'recipient_management'
      ]
    };

    super(agentConfig.id, agentConfig);
    
    // Initialize email tool
    this.emailTool = new EmailTool();
    
    console.log(`EmailAgent ${this.id} initialized`);
  }

  protected initialize(): void {
    // Register email tool
    this.registerTool('email_sender', this.emailTool);
    
    console.log(`EmailAgent ${this.id} initialized with email capabilities`);
    console.log(`EmailAgent ${this.id} using model:`, this.getModelConfig().model);
  }

  protected generateSystemPrompt(): string {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    return `You are an Email Agent specialized in sending emails via Gmail SMTP.

CURRENT DATE: ${formattedDate}

ROLE:
You are a focused email sending agent that receives validated email tasks from the orchestrator and sends them via Gmail SMTP.

YOUR RESPONSIBILITIES:
1. Receive email tasks with all details pre-validated by the orchestrator
2. Send emails using the Gmail SMTP tool
3. Provide delivery confirmation and status updates
4. Handle sending errors gracefully

WHAT THE ORCHESTRATOR HANDLES:
- Email composition and content creation
- Validation of email addresses and required fields
- User confirmation and approval
- Email formatting and structure

WHAT YOU HANDLE:
- Email sending via Gmail SMTP
- Delivery confirmation
- Error handling for sending failures
- Status reporting

WORKFLOW:
1. **Receive Task**: Get validated email task from orchestrator
2. **Send Email**: Use email tool to send via Gmail SMTP
3. **Confirm Delivery**: Report success/failure status
4. **Handle Errors**: Provide clear error messages if sending fails

CURRENT CAPABILITIES:
- Gmail SMTP email sending
- Delivery confirmation
- Error handling and reporting

RESPONSE FORMAT:
- Clear success/failure status
- Delivery confirmation details
- Error messages when applicable
- Message ID and timestamp for successful sends

SAFETY & VALIDATION:
- Trust that the orchestrator has validated all email details
- Focus on reliable email sending
- Provide clear error messages for sending failures
- Confirm successful delivery

Your goal is to reliably send emails that have been validated and approved by the orchestrator.`;
  }

  public async execute(task: any): Promise<AgentResult> {
    const startTime = Date.now();
    this.setStatus('busy');

    try {
      const emailTask = task as EmailTask;
      
      // Validate task
      if (!this.canHandle(emailTask)) {
        throw new Error('EmailAgent cannot handle this task');
      }

      console.log(`EmailAgent ${this.id} starting task: ${emailTask.topic}`);
      console.log(`EmailAgent ${this.id} action: ${emailTask.action || 'send'}`);

      let results: any;

      // The orchestrator handles composition and validation, 
      // so we just need to send the email
      const action = emailTask.action || 'send';
      
      if (action === 'send') {
        console.log(`EmailAgent ${this.id} sending email via tool`);
        results = await this.sendEmail(emailTask);
      } else {
        // General conversational response about email composition
        results = {
          topic: emailTask.topic,
          message: 'I can help you compose and send emails! Tell me about the email you\'d like to write:\n\n' +
                   '- What is the purpose of the email?\n' +
                   '- Who is the recipient?\n' +
                   '- What key points do you want to include?\n\n' +
                   'I\'ll guide you through creating and sending a professional email.'
        };
      }

      this.setStatus('idle');
      
      return {
        success: true,
        result: results,
        executionTime: Date.now() - startTime,
        metadata: {
          agentId: this.id,
          taskType: 'email',
          action: emailTask.action || 'general'
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
      'email_composition',
      'email_drafting',
      'email_sending',
      'professional_writing',
      'email_formatting',
      'recipient_management'
    ];
  }

  /**
   * Format email draft information
   */
  private formatEmailDraft(task: EmailTask): any {
    const hasSender = !!task.sender;
    const hasRecipient = !!task.recipient;
    const hasSubject = !!task.subject;
    const hasContent = !!task.content;

    let summary = `# Email Draft\n\n`;

    // Show what we have
    if (hasSender) {
      summary += `**From:** ${task.sender}\n`;
    } else {
      summary += `**From:** ${CONFIG.EMAIL.DEFAULT_FROM || '[Your Email]'} (default)\n`;
    }

    if (hasRecipient) {
      summary += `**To:** ${task.recipient}\n`;
    } else {
      summary += `**To:** [Recipient email needed]\n`;
    }

    if (task.cc) {
      summary += `**CC:** ${task.cc}\n`;
    }

    if (task.bcc) {
      summary += `**BCC:** ${task.bcc}\n`;
    }

    if (hasSubject) {
      summary += `**Subject:** ${task.subject}\n\n`;
    } else {
      summary += `**Subject:** [Subject line needed]\n\n`;
    }

    summary += `---\n\n`;

    if (hasContent) {
      summary += `${task.content}\n\n`;
    } else {
      summary += `[Email body content needed]\n\n`;
    }

    summary += `---\n\n`;

    // Provide next steps
    const missing: string[] = [];
    if (!hasRecipient) missing.push('recipient email address');
    if (!hasSubject) missing.push('subject line');
    if (!hasContent) missing.push('email content');

    if (missing.length > 0) {
      summary += `**Missing Information:**\n`;
      missing.forEach(item => {
        summary += `- ${item}\n`;
      });
      summary += `\nPlease provide the missing information to complete your email draft.`;
    } else {
      summary += `**Status:** ✅ Email draft complete and ready!\n\n`;
      summary += `Your email is ready. You can review it above and make any changes before sending.`;
    }

      return {
        answer: summary,
        summary: missing.length > 0 
          ? `Email draft in progress. Missing: ${missing.join(', ')}`
          : 'Email draft complete',
        draft: {
          from: task.sender || CONFIG.EMAIL.DEFAULT_FROM,
          to: task.recipient,
          cc: task.cc,
          bcc: task.bcc,
          subject: task.subject,
          content: task.content,
          isComplete: missing.length === 0
        }
      };
    }

  /**
   * Confirm email details before sending
   */
  private confirmEmailDetails(task: EmailTask): any {
    const hasSender = !!task.sender;
    const hasRecipient = !!task.recipient;
    const hasSubject = !!task.subject;
    const hasContent = !!task.content;

    // Check if all required fields are present
    const missing: string[] = [];
    if (!hasRecipient) missing.push('recipient email address');
    if (!hasSubject) missing.push('subject line');
    if (!hasContent) missing.push('email content');

    if (missing.length > 0) {
      return {
        answer: `❌ **Email Not Ready to Send**\n\nMissing required information:\n${missing.map(item => `- ${item}`).join('\n')}\n\nPlease provide the missing information before sending.`,
        summary: `Email incomplete. Missing: ${missing.join(', ')}`,
        canSend: false,
        missing: missing
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(task.recipient!)) {
      return {
        answer: `❌ **Invalid Email Address**\n\nThe recipient email address "${task.recipient}" is not valid.\n\nPlease provide a valid email address.`,
        summary: 'Invalid recipient email address',
        canSend: false,
        error: 'Invalid email format'
      };
    }

    // Show confirmation preview
    let summary = `# 📧 Email Confirmation\n\n`;
    summary += `**⚠️ Please review your email before sending:**\n\n`;
    summary += `**From:** ${task.sender || CONFIG.EMAIL.DEFAULT_FROM}\n`;
    summary += `**To:** ${task.recipient}\n`;
    if (task.cc) summary += `**CC:** ${task.cc}\n`;
    if (task.bcc) summary += `**BCC:** ${task.bcc}\n`;
    summary += `**Subject:** ${task.subject}\n\n`;
    summary += `---\n\n`;
    summary += `**Email Content:**\n\n${task.content}\n\n`;
    summary += `---\n\n`;
    summary += `**✅ This email is ready to send.**\n\n`;
    summary += `Please confirm that all details are correct before I send this email.`;

    return {
      answer: summary,
      summary: 'Email ready for confirmation',
      canSend: true,
      draft: {
        from: task.sender || CONFIG.EMAIL.DEFAULT_FROM,
        to: task.recipient,
        cc: task.cc,
        bcc: task.bcc,
        subject: task.subject,
        content: task.content
      }
    };
  }

  /**
   * Send email using the email tool
   * The orchestrator handles validation and confirmation, so we just send
   */
  private async sendEmail(task: EmailTask): Promise<any> {
    try {
      console.log('EmailAgent: Sending email via tool');

      // Send email using the tool directly
      const emailResult = await this.emailTool.execute({
        action: 'send_email',
        to: task.recipient!,
        subject: task.subject!,
        content: task.content!,
        from: task.sender,
        cc: task.cc,
        bcc: task.bcc
      });

      if (emailResult.success) {
        return {
          answer: `✅ **Email Sent Successfully!**\n\n` +
                  `Your email has been sent to ${task.recipient}.\n\n` +
                  `**Details:**\n` +
                  `- Subject: ${task.subject}\n` +
                  `- Sent at: ${new Date().toLocaleString()}\n` +
                  `- Message ID: ${emailResult.messageId}\n\n` +
                  `The recipient should receive your email shortly.`,
          summary: `Email sent successfully to ${task.recipient}`,
          success: true,
          messageId: emailResult.messageId,
          sentAt: emailResult.sentAt
        };
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Error in sendEmail:', error);
      return {
        answer: `❌ **Failed to Send Email**\n\n` +
                `An error occurred while sending your email:\n\n` +
                `${error instanceof Error ? error.message : 'Unknown error'}\n\n` +
                `Please check your email configuration and try again.`,
        summary: 'Email sending failed',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

