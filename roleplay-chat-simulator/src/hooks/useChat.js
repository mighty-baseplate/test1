import { useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { generateId } from '../utils/helpers';
import { MESSAGE_TYPES } from '../utils/constants';

export const useChat = () => {
  const { state, dispatch, actions } = useApp();
  const { currentCharacter, messages, isLoading, isTyping, error } = state;

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || !currentCharacter || isLoading) return;

    // Create user message
    const userMessage = {
      id: generateId(),
      text: text.trim(),
      sender: MESSAGE_TYPES.USER,
      timestamp: new Date().toISOString()
    };

    // Add user message immediately
    dispatch({
      type: actions.ADD_MESSAGE,
      payload: userMessage
    });

    // Set typing indicator
    dispatch({ type: actions.SET_TYPING, payload: true });
    dispatch({ type: actions.CLEAR_ERROR });

    try {
      // Import API service dynamically to avoid circular dependencies
      const { default: ApiService } = await import('../services/apiService');
      const apiService = new ApiService();

      const response = await apiService.sendMessage(text, currentCharacter, messages);

      if (response.success && response.message) {
        const aiMessage = {
          id: generateId(),
          text: response.message,
          sender: MESSAGE_TYPES.AI,
          timestamp: new Date().toISOString(),
          characterId: currentCharacter.id
        };

        dispatch({
          type: actions.ADD_MESSAGE,
          payload: aiMessage
        });

        return aiMessage;
      } else {
        throw new Error(response.error || 'Failed to get response from AI');
      }
    } catch (error) {
      console.error('Chat error:', error);
      dispatch({
        type: actions.SET_ERROR,
        payload: error.message || 'Failed to send message. Please try again.'
      });
    } finally {
      dispatch({ type: actions.SET_TYPING, payload: false });
    }
  }, [currentCharacter, messages, isLoading, dispatch, actions]);

  const clearMessages = useCallback(() => {
    dispatch({ type: actions.CLEAR_MESSAGES });
    if (currentCharacter) {
      // Also clear from localStorage
      const { chatHistory } = require('../utils/helpers');
      chatHistory.clear(currentCharacter.id);
    }
  }, [currentCharacter, dispatch, actions]);

  const selectCharacter = useCallback((character) => {
    dispatch({
      type: actions.SELECT_CHARACTER,
      payload: character
    });
  }, [dispatch, actions]);

  const resetChat = useCallback(() => {
    dispatch({ type: actions.RESET_CHAT });
  }, [dispatch, actions]);

  const clearError = useCallback(() => {
    dispatch({ type: actions.CLEAR_ERROR });
  }, [dispatch, actions]);

  return {
    // State
    currentCharacter,
    messages,
    isLoading,
    isTyping,
    error,
    
    // Actions
    sendMessage,
    clearMessages,
    selectCharacter,
    resetChat,
    clearError
  };
};