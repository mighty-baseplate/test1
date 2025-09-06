import { useState, useCallback, useRef } from 'react';
import { generateId } from '../utils/helpers';
import { MESSAGE_TYPES } from '../utils/constants';
import OptimizedGeminiService from '../services/optimizedGeminiService';
import OptimizedKokoroService from '../services/optimizedKokoroService';

export const useFastChat = () => {
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentCharacter, setCurrentCharacter] = useState(null);
  const [error, setError] = useState(null);
  const [responseTime, setResponseTime] = useState(null);

  // Initialize services once
  const geminiServiceRef = useRef(null);
  const kokoroServiceRef = useRef(null);

  const initializeServices = useCallback(() => {
    if (!geminiServiceRef.current) {
      geminiServiceRef.current = new OptimizedGeminiService();
    }
    if (!kokoroServiceRef.current) {
      kokoroServiceRef.current = new OptimizedKokoroService();
    }
  }, []);

  const selectCharacter = useCallback((character) => {
    setCurrentCharacter(character);
    setMessages([]);
    setError(null);
    initializeServices();
  }, [initializeServices]);

  const sendMessageFast = useCallback(async (text) => {
    if (!text.trim() || !currentCharacter || isProcessing) return;

    const startTime = Date.now();
    setIsProcessing(true);
    setError(null);
    setResponseTime(null);

    // Add user message immediately
    const userMessage = {
      id: generateId(),
      text: text.trim(),
      sender: MESSAGE_TYPES.USER,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      initializeServices();
      
      console.log('🚀 Starting fast processing...');
      
      // Get AI response as fast as possible
      const aiResponse = await geminiServiceRef.current.sendMessageFast(text, currentCharacter);
      
      if (!aiResponse.success) {
        throw new Error(aiResponse.error);
      }

      const aiMessage = {
        id: generateId(),
        text: aiResponse.message,
        sender: MESSAGE_TYPES.AI,
        timestamp: new Date().toISOString(),
        characterId: currentCharacter.id
      };

      setMessages(prev => [...prev, aiMessage]);

      // Start TTS immediately (don't wait for it)
      const ttsPromise = kokoroServiceRef.current.synthesizeAndPlay(aiResponse.message, currentCharacter);
      
      const totalResponseTime = Date.now() - startTime;
      setResponseTime(totalResponseTime);
      
      console.log(`⚡ Total response time: ${totalResponseTime}ms`);
      console.log(`📝 AI Response: "${aiResponse.message}"`);

      // Handle TTS in background
      ttsPromise.catch(error => {
        console.warn('TTS failed:', error);
      });

      return aiMessage;

    } catch (error) {
      console.error('❌ Fast chat error:', error);
      setError(error.message || 'Failed to send message. Please try again.');
      
      const totalTime = Date.now() - startTime;
      console.log(`❌ Error after ${totalTime}ms`);
    } finally {
      setIsProcessing(false);
    }
  }, [currentCharacter, isProcessing, initializeServices]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    setResponseTime(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    messages,
    currentCharacter,
    isProcessing,
    error,
    responseTime,
    
    // Actions
    sendMessageFast,
    selectCharacter,
    clearMessages,
    clearError
  };
};