export const API_PROVIDERS = {
  GEMINI: 'gemini',
};

export const MESSAGE_TYPES = {
  USER: 'user',
  AI: 'ai',
  SYSTEM: 'system'
};

export const ANIMATION_DURATIONS = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
  TYPING: 1400
};

export const TTS_VOICES = {
  'male-deep': { rate: 0.8, pitch: 0.7 },
  'male-british': { rate: 0.9, pitch: 0.8 },
  'male-robotic': { rate: 1.0, pitch: 1.2 }
};

export const STORAGE_KEYS = {
  CHAT_HISTORY: 'roleplay_chat_history',
  SELECTED_CHARACTER: 'roleplay_selected_character',
  USER_SETTINGS: 'roleplay_user_settings'
};

export const DEFAULT_SETTINGS = {
  ttsEnabled: false,
  autoScroll: true,
  darkMode: false,
  apiProvider: API_PROVIDERS.GEMINI
};