import { GoogleGenerativeAI } from '@google/generative-ai';

class OptimizedGeminiService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!this.apiKey) {
      console.warn('Gemini API key not found. Please set VITE_GEMINI_API_KEY in your .env file.');
    }
    this.genAI = this.apiKey ? new GoogleGenerativeAI(this.apiKey) : null;
    this.model = null;
    this.supportsStreaming = true;
    
    // Pre-initialize model for faster responses
    this.initializeModel();
  }

  async initializeModel() {
    if (!this.genAI) return false;

    try {
      // Optimized model configuration for speed
      this.model = this.genAI.getGenerativeModel({ 
        model: 'gemini-pro',
        generationConfig: {
          temperature: 0.7, // Slightly lower for faster generation
          topK: 20, // Reduced for speed
          topP: 0.8, // Reduced for speed
          maxOutputTokens: 200, // Reduced for faster response
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_ONLY_HIGH' // Less restrictive for speed
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_ONLY_HIGH'
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_ONLY_HIGH'
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_ONLY_HIGH'
          }
        ]
      });
      
      // Pre-warm the model with a quick test
      await this.model.generateContent('Hello');
      console.log('✅ Gemini model pre-warmed and ready');
      return true;
    } catch (error) {
      console.error('Failed to initialize Gemini model:', error);
      return false;
    }
  }

  buildOptimizedPrompt(message, character) {
    // Shorter, more direct prompts for faster processing
    const characterPrompts = {
      gandalf: `You are Gandalf. Speak wisely and briefly in 1-2 sentences. Use "my dear fellow" and old English.`,
      sherlock: `You are Sherlock Holmes. Be analytical and brief in 1-2 sentences. Use "Elementary" and Victorian speech.`,
      'alien-dj': `You are Zyx, alien DJ. Be cool and brief in 1-2 sentences. Use "cosmic" and "dude" with space slang.`
    };

    const prompt = characterPrompts[character?.id] || characterPrompts.gandalf;
    return `${prompt}\n\nHuman: ${message}\n${character?.name || 'Assistant'}:`;
  }

  async sendMessageFast(message, character) {
    if (!this.model) {
      const initialized = await this.initializeModel();
      if (!initialized) {
        return {
          success: false,
          error: 'Gemini API not available'
        };
      }
    }

    try {
      const startTime = Date.now();
      const prompt = this.buildOptimizedPrompt(message, character);
      
      console.log('🚀 Sending to Gemini API...');
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const responseTime = Date.now() - startTime;
      console.log(`⚡ Gemini response in ${responseTime}ms`);

      if (!text || text.trim().length === 0) {
        throw new Error('Empty response from Gemini API');
      }

      return {
        success: true,
        message: text.trim(),
        responseTime,
        usage: {
          tokens: response.usageMetadata?.totalTokenCount || 0
        }
      };

    } catch (error) {
      console.error('❌ Gemini API error:', error);
      
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

  // Streaming version for even faster perceived response
  async sendMessageStream(message, character, onChunk) {
    if (!this.model) {
      await this.initializeModel();
    }

    try {
      const prompt = this.buildOptimizedPrompt(message, character);
      
      console.log('🚀 Starting Gemini stream...');
      const result = await this.model.generateContentStream(prompt);
      let fullText = '';
      let firstChunkTime = null;

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        if (chunkText) {
          if (!firstChunkTime) {
            firstChunkTime = Date.now();
            console.log('⚡ First chunk received');
          }
          
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
      console.error('❌ Gemini streaming error:', error);
      return {
        success: false,
        error: error.message || 'Failed to stream response from Gemini API'
      };
    }
  }
}

export default OptimizedGeminiService;