/**
 * API Keys Configuration
 * 
 * Centralized configuration for API keys and external service credentials.
 * In production, these should be loaded from environment variables.
 */

export const API_KEYS = {
  // OpenAI API Key
  OPENAI: process.env.OPENAI_API_KEY, 
  
  // Tavily API Key
  TAVILY: process.env.TAVILY_API_KEY,
  
  // Canvas LMS API Keys
  CANVAS_API_KEY: process.env.CANVAS_API_KEY,
  CANVAS_BASE_URL: process.env.CANVAS_BASE_URL,
  
  // Gmail SMTP Configuration
  GMAIL_USER: process.env.GMAIL_USER,
  GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD
  
  // Add other API keys as needed
  // ANTHROPIC: process.env.ANTHROPIC_API_KEY || '',
  // GOOGLE: process.env.GOOGLE_API_KEY || '',
};

export const CONFIG = {
  // OpenAI Configuration for Orchestrator (Premium Model)
  OPENAI_ORCHESTRATOR: {
    API_KEY: API_KEYS.OPENAI,
    MODEL: 'gpt-4o', // Best model for complex orchestration decisions
    MAX_TOKENS: 4000,
    TEMPERATURE: 0.7,
  },
  
  // OpenAI Configuration for Base Agents (Cost-Effective Model)
  OPENAI_AGENTS: {
    API_KEY: API_KEYS.OPENAI,
    MODEL: 'gpt-3.5-turbo', // Cost-effective model for routine tasks
    MAX_TOKENS: 2000,
    TEMPERATURE: 0.7,
  },
  
  // Tavily Configuration
  TAVILY: {
    API_KEY: API_KEYS.TAVILY,
    DEFAULT_MAX_RESULTS: 10,
    DEFAULT_SEARCH_DEPTH: 'basic',
  },
  
  // Canvas LMS Configuration
  CANVAS: {
    API_KEY: API_KEYS.CANVAS_API_KEY,
    BASE_URL: API_KEYS.CANVAS_BASE_URL,
    DEFAULT_PER_PAGE: 100, // Default number of items per page
    TIMEOUT: 10000, // 10 seconds
  },
  
  // Gmail SMTP Configuration
  EMAIL: {
    SMTP_HOST: 'smtp.gmail.com',
    SMTP_PORT: 465,
    SMTP_SECURE: true, // true for 465, false for other ports
    USER: API_KEYS.GMAIL_USER,
    APP_PASSWORD: API_KEYS.GMAIL_APP_PASSWORD,
    DEFAULT_FROM: API_KEYS.GMAIL_USER,
  },
  
  // Agent Configuration
  AGENT: {
    DEFAULT_TIMEOUT: 30000, // 30 seconds
    MAX_RETRY_ATTEMPTS: 3,
    CONCURRENT_TASKS_LIMIT: 5,
  },
};

// Validation function to check if required API keys are present
export function validateApiKeys(includeOptional: boolean = false): { isValid: boolean; missing: string[] } {
  const missing: string[] = [];
  
  if (!API_KEYS.OPENAI || API_KEYS.OPENAI === 'your_openai_api_key_here') {
    missing.push('OPENAI_API_KEY');
  }
  
  if (!API_KEYS.TAVILY || API_KEYS.TAVILY === 'your_tavily_api_key_here') {
    missing.push('TAVILY_API_KEY');
  }
  
  // Optional validation for Canvas (only if includeOptional is true)
  if (includeOptional) {
    if (!API_KEYS.CANVAS_API_KEY) {
      missing.push('CANVAS_API_KEY');
    }
    
    if (!API_KEYS.CANVAS_BASE_URL) {
      missing.push('CANVAS_BASE_URL');
    }
  }
  
  return {
    isValid: missing.length === 0,
    missing
  };
}

// Validate Canvas-specific keys
export function validateCanvasKeys(): { isValid: boolean; missing: string[] } {
  const missing: string[] = [];
  
  if (!API_KEYS.CANVAS_API_KEY) {
    missing.push('CANVAS_API_KEY');
  }
  
  if (!API_KEYS.CANVAS_BASE_URL) {
    missing.push('CANVAS_BASE_URL');
  }
  
  return {
    isValid: missing.length === 0,
    missing
  };
}

// Validate Email-specific keys
export function validateEmailKeys(): { isValid: boolean; missing: string[] } {
  const missing: string[] = [];
  
  if (!API_KEYS.GMAIL_USER) {
    missing.push('GMAIL_USER');
  }
  
  if (!API_KEYS.GMAIL_APP_PASSWORD) {
    missing.push('GMAIL_APP_PASSWORD');
  }
  
  return {
    isValid: missing.length === 0,
    missing
  };
}

// Helper function to get API key with validation
export function getApiKey(service: keyof typeof API_KEYS): string {
  const key = API_KEYS[service];
  if (!key || key.includes('your_') || key.includes('_here')) {
    throw new Error(`API key for ${service} is not properly configured. Please set the environment variable or update the configuration.`);
  }
  return key;
}
