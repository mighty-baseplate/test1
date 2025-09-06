import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!this.apiKey) {
      console.warn('Gemini API key not found. Please set VITE_GEMINI_API_KEY in your .env file.');
    }
    this.genAI = this.apiKey ? new GoogleGenerativeAI(this.apiKey) : null;
    this.model = null;
    this.supportsStreaming = true;
  }

  async initialize() {
    if (!this.genAI) {
      throw new Error('Gemini API key not configured');
    }

    try {
      this.model = this.genAI.getGenerativeModel({ 
        model: 'gemini-pro',
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 500,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      });
      return true;
    } catch (error) {
      console.error('Failed to initialize Gemini model:', error);
      throw error;
    }
  }

  buildPrompt(message, character, history = []) {
    let prompt = '';
    
    // Add character system prompt
    if (character && character.prompt) {
      prompt += `${character.prompt}\n\n`;
    }

    // Add conversation history context
    if (history.length > 0) {
      prompt += 'Previous conversation:\n';
      // Only include last 10 messages to stay within context limits
      const recentHistory = history.slice(-10);
      
      recentHistory.forEach(msg => {
        if (msg.sender === 'user') {
          prompt += `Human: ${msg.text}\n`;
        } else if (msg.sender === 'ai') {
          prompt += `${character?.name || 'Assistant'}: ${msg.text}\n`;
        }
      });
      prompt += '\n';
    }

    // Add current message
    prompt += `Human: ${message}\n${character?.name || 'Assistant'}:`;

    return prompt;
  }

  async sendMessage(message, character, history = []) {
    if (!this.model) {
      await this.initialize();
    }

    try {
      const prompt = this.buildPrompt(message, character, history);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (!text || text.trim().length === 0) {
        throw new Error('Empty response from Gemini API');
      }

      return {
        success: true,
        message: text.trim(),
        usage: {
          tokens: response.usageMetadata?.totalTokenCount || 0
        }
      };

    } catch (error) {
      console.error('Gemini API error:', error);
      
      let errorMessage = 'Failed to get response from Gemini API';
      
      if (error.message?.includes('API_KEY_INVALID')) {
        errorMessage = 'Invalid Gemini API key. Please check your configuration.';
      } else if (error.message?.includes('QUOTA_EXCEEDED')) {
        errorMessage = 'Gemini API quota exceeded. Please try again later.';
      } else if (error.message?.includes('SAFETY')) {
        errorMessage = 'Response blocked by safety filters. Please try rephrasing your message.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  }

  async sendMessageStream(message, character, history = [], onChunk) {
    if (!this.model) {
      await this.initialize();
    }

    try {
      const prompt = this.buildPrompt(message, character, history);
      
      const result = await this.model.generateContentStream(prompt);
      let fullText = '';

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        if (chunkText) {
          fullText += chunkText;
          if (onChunk) {
            onChunk(chunkText, fullText);
          }
        }
      }

      return {
        success: true,
        message: fullText.trim(),
        usage: {
          tokens: result.response?.usageMetadata?.totalTokenCount || 0
        }
      };

    } catch (error) {
      console.error('Gemini streaming error:', error);
      return {
        success: false,
        error: error.message || 'Failed to stream response from Gemini API'
      };
    }
  }

  // Health check method
  async healthCheck() {
    try {
      if (!this.model) {
        await this.initialize();
      }
      
      const testResult = await this.model.generateContent('Hello');
      const response = await testResult.response;
      
      return {
        success: true,
        status: 'healthy',
        message: 'Gemini API is working correctly'
      };
    } catch (error) {
      return {
        success: false,
        status: 'unhealthy',
        error: error.message
      };
    }
  }
}

export default GeminiService;