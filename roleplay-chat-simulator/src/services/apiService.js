import GeminiService from './geminiService.js';
import { API_PROVIDERS } from '../utils/constants.js';

class ApiService {
  constructor() {
    this.provider = import.meta.env.VITE_API_PROVIDER || API_PROVIDERS.GEMINI;
    this.service = null;
    this.initializeService();
  }

  initializeService() {
    switch (this.provider) {
      case API_PROVIDERS.GEMINI:
        this.service = new GeminiService();
        break;
      default:
        console.warn(`Unknown API provider: ${this.provider}, falling back to Gemini`);
        this.service = new GeminiService();
        break;
    }
  }

  async sendMessage(message, character, history = []) {
    if (!this.service) {
      return {
        success: false,
        error: 'API service not initialized'
      };
    }

    try {
      const response = await this.service.sendMessage(message, character, history);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async sendMessageStream(message, character, history = [], onChunk) {
    if (!this.service || !this.service.sendMessageStream) {
      // Fallback to regular message if streaming not supported
      return this.sendMessage(message, character, history);
    }

    try {
      const response = await this.service.sendMessageStream(message, character, history, onChunk);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  handleResponse(response) {
    if (response.success) {
      return {
        success: true,
        message: response.message,
        usage: response.usage || {}
      };
    } else {
      return {
        success: false,
        error: response.error || 'Unknown API error'
      };
    }
  }

  handleError(error) {
    console.error('API Service error:', error);
    
    let errorMessage = 'An unexpected error occurred';
    
    if (error.message) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    return {
      success: false,
      error: errorMessage
    };
  }

  async healthCheck() {
    if (!this.service || !this.service.healthCheck) {
      return {
        success: false,
        error: 'Health check not supported by current provider'
      };
    }

    try {
      return await this.service.healthCheck();
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Health check failed'
      };
    }
  }

  getProvider() {
    return this.provider;
  }

  supportsStreaming() {
    return this.service && this.service.supportsStreaming;
  }
}

export default ApiService;