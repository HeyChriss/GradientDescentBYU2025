/**
 * Email Tool
 * 
 * Tool for sending emails via Gmail SMTP.
 * Handles email composition, validation, and sending.
 */

import { BaseTool } from './BaseTool';
import { ToolResult } from '../core/interfaces';
import { CONFIG } from '../../config/api-keys';
import nodemailer from 'nodemailer';

export interface EmailOptions {
  action: 'send_email';
  to: string;
  subject: string;
  content: string;
  from?: string;
  cc?: string;
  bcc?: string;
  isHtml?: boolean;
}

export class EmailTool extends BaseTool {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    super(
      'email_sender',
      'Gmail SMTP email sending tool',
      {
        to: { type: 'string', required: true, description: 'Recipient email address' },
        subject: { type: 'string', required: true, description: 'Email subject line' },
        content: { type: 'string', required: true, description: 'Email body content' },
        from: { type: 'string', required: false, description: 'Sender email address (defaults to configured Gmail)' },
        cc: { type: 'string', required: false, description: 'CC recipients (comma-separated)' },
        bcc: { type: 'string', required: false, description: 'BCC recipients (comma-separated)' },
        isHtml: { type: 'boolean', required: false, description: 'Whether content is HTML (default: false)' }
      }
    );
    
    console.log('Email tool initialized');
  }

  protected async initialize(): Promise<void> {
    try {
      // Validate email configuration
      if (!CONFIG.EMAIL.USER || !CONFIG.EMAIL.APP_PASSWORD) {
        throw new Error('Gmail credentials not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD environment variables.');
      }

      // Create transporter
      this.transporter = nodemailer.createTransport({
        host: CONFIG.EMAIL.SMTP_HOST,
        port: CONFIG.EMAIL.SMTP_PORT,
        secure: CONFIG.EMAIL.SMTP_SECURE, // true for 465, false for other ports
        auth: {
          user: CONFIG.EMAIL.USER,
          pass: CONFIG.EMAIL.APP_PASSWORD
        }
      });

      // Verify connection
      await this.transporter.verify();
      console.log('Email tool: SMTP connection verified successfully');
    } catch (error) {
      console.error('Email tool initialization failed:', error);
      throw error;
    }
  }

  protected async executeInternal(params: any): Promise<any> {
    const options = params as EmailOptions;
    
    if (options.action !== 'send_email') {
      throw new Error(`Unknown action: ${options.action}`);
    }

    return await this.sendEmail(options);
  }

  /**
   * Send email via Gmail SMTP
   */
  private async sendEmail(options: EmailOptions): Promise<any> {
    try {
      if (!this.transporter) {
        throw new Error('Email transporter not initialized');
      }

      // Validate required fields
      if (!options.to) {
        throw new Error('Recipient email address is required');
      }
      if (!options.subject) {
        throw new Error('Email subject is required');
      }
      if (!options.content) {
        throw new Error('Email content is required');
      }

      // Prepare email data
      const mailOptions = {
        from: options.from || CONFIG.EMAIL.DEFAULT_FROM,
        to: options.to,
        subject: options.subject,
        text: options.isHtml ? undefined : options.content,
        html: options.isHtml ? options.content : undefined,
        cc: options.cc,
        bcc: options.bcc
      };

      console.log('Sending email:', {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject,
        cc: mailOptions.cc,
        bcc: mailOptions.bcc
      });

      // Send email
      const info = await this.transporter.sendMail(mailOptions);

      console.log('Email sent successfully:', info.messageId);

      return {
        success: true,
        messageId: info.messageId,
        response: info.response,
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject,
        sentAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  /**
   * Validate email address format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Parse comma-separated email addresses
   */
  private parseEmailList(emails: string): string[] {
    return emails.split(',').map(email => email.trim()).filter(email => email.length > 0);
  }
}
