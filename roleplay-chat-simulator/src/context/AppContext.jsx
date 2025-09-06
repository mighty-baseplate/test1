import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { storage, chatHistory } from '../utils/helpers';
import { STORAGE_KEYS, DEFAULT_SETTINGS } from '../utils/constants';

// Initial state
const initialState = {
  currentCharacter: null,
  messages: [],
  isLoading: false,
  isTyping: false,
  error: null,
  settings: DEFAULT_SETTINGS
};

// Action types
export const ACTIONS = {
  SELECT_CHARACTER: 'SELECT_CHARACTER',
  ADD_MESSAGE: 'ADD_MESSAGE',
  SET_MESSAGES: 'SET_MESSAGES',
  SET_LOADING: 'SET_LOADING',
  SET_TYPING: 'SET_TYPING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  CLEAR_MESSAGES: 'CLEAR_MESSAGES',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  RESET_CHAT: 'RESET_CHAT'
};

// Reducer function
function appReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SELECT_CHARACTER:
      return {
        ...state,
        currentCharacter: action.payload,
        messages: [],
        error: null
      };

    case ACTIONS.ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
        error: null
      };

    case ACTIONS.SET_MESSAGES:
      return {
        ...state,
        messages: action.payload
      };

    case ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };

    case ACTIONS.SET_TYPING:
      return {
        ...state,
        isTyping: action.payload
      };

    case ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        isTyping: false
      };

    case ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case ACTIONS.CLEAR_MESSAGES:
      return {
        ...state,
        messages: [],
        error: null
      };

    case ACTIONS.UPDATE_SETTINGS:
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };

    case ACTIONS.RESET_CHAT:
      return {
        ...state,
        currentCharacter: null,
        messages: [],
        error: null,
        isLoading: false,
        isTyping: false
      };

    default:
      return state;
  }
}

// Context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = storage.get(STORAGE_KEYS.USER_SETTINGS);
    if (savedSettings) {
      dispatch({
        type: ACTIONS.UPDATE_SETTINGS,
        payload: savedSettings
      });
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    storage.set(STORAGE_KEYS.USER_SETTINGS, state.settings);
  }, [state.settings]);

  // Load chat history when character changes
  useEffect(() => {
    if (state.currentCharacter) {
      const history = chatHistory.load(state.currentCharacter.id);
      dispatch({
        type: ACTIONS.SET_MESSAGES,
        payload: history
      });
    }
  }, [state.currentCharacter]);

  // Save chat history when messages change
  useEffect(() => {
    if (state.currentCharacter && state.messages.length > 0) {
      chatHistory.save(state.currentCharacter.id, state.messages);
    }
  }, [state.currentCharacter, state.messages]);

  const value = {
    state,
    dispatch,
    actions: ACTIONS
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;