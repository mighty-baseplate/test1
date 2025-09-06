// Emotion and context detection for dynamic character expressions

export const EMOTIONS = {
  THINKING: 'thinking',
  HAPPY: 'happy',
  SURPRISED: 'surprised',
  CONFUSED: 'confused',
  WISE: 'wise',
  EXCITED: 'excited',
  SERIOUS: 'serious',
  MYSTERIOUS: 'mysterious',
  LAUGHING: 'laughing',
  GREETING: 'greeting',
  DEFAULT: 'default'
};

// Keywords and patterns for emotion detection
const EMOTION_PATTERNS = {
  [EMOTIONS.THINKING]: [
    /hmm/i, /think/i, /consider/i, /ponder/i, /wonder/i, /perhaps/i, /maybe/i,
    /let me think/i, /i believe/i, /it seems/i, /possibly/i, /might be/i
  ],
  [EMOTIONS.HAPPY]: [
    /happy/i, /joy/i, /wonderful/i, /excellent/i, /great/i, /fantastic/i,
    /delighted/i, /pleased/i, /cheerful/i, /glad/i, /smile/i, /laugh/i
  ],
  [EMOTIONS.SURPRISED]: [
    /wow/i, /amazing/i, /incredible/i, /astonishing/i, /remarkable/i,
    /extraordinary/i, /unexpected/i, /surprise/i, /shocking/i, /unbelievable/i
  ],
  [EMOTIONS.CONFUSED]: [
    /confused/i, /puzzled/i, /strange/i, /odd/i, /peculiar/i, /curious/i,
    /what do you mean/i, /i don't understand/i, /unclear/i, /perplexing/i
  ],
  [EMOTIONS.WISE]: [
    /wisdom/i, /knowledge/i, /experience/i, /ancient/i, /learned/i,
    /understand/i, /know/i, /wise/i, /sage/i, /enlightened/i
  ],
  [EMOTIONS.EXCITED]: [
    /exciting/i, /thrilling/i, /adventure/i, /amazing/i, /awesome/i,
    /fantastic/i, /incredible/i, /energy/i, /enthusiastic/i, /pumped/i
  ],
  [EMOTIONS.SERIOUS]: [
    /serious/i, /important/i, /grave/i, /critical/i, /urgent/i,
    /dangerous/i, /warning/i, /careful/i, /beware/i, /solemn/i
  ],
  [EMOTIONS.MYSTERIOUS]: [
    /mystery/i, /secret/i, /hidden/i, /unknown/i, /enigma/i,
    /whisper/i, /shadow/i, /ancient/i, /forbidden/i, /cryptic/i
  ],
  [EMOTIONS.LAUGHING]: [
    /haha/i, /hehe/i, /lol/i, /funny/i, /hilarious/i, /amusing/i,
    /chuckle/i, /giggle/i, /jest/i, /joke/i, /humor/i
  ],
  [EMOTIONS.GREETING]: [
    /hello/i, /hi/i, /greetings/i, /welcome/i, /good day/i, /salutations/i,
    /nice to meet/i, /pleasure/i, /howdy/i, /hey/i
  ]
};

// Character-specific emotion mappings
const CHARACTER_EMOTIONS = {
  gandalf: {
    [EMOTIONS.THINKING]: '🤔',
    [EMOTIONS.HAPPY]: '😊',
    [EMOTIONS.SURPRISED]: '😮',
    [EMOTIONS.CONFUSED]: '🤨',
    [EMOTIONS.WISE]: '🧙‍♂️',
    [EMOTIONS.EXCITED]: '✨',
    [EMOTIONS.SERIOUS]: '😤',
    [EMOTIONS.MYSTERIOUS]: '🌟',
    [EMOTIONS.LAUGHING]: '😄',
    [EMOTIONS.GREETING]: '👋',
    [EMOTIONS.DEFAULT]: '🧙‍♂️'
  },
  sherlock: {
    [EMOTIONS.THINKING]: '🤔',
    [EMOTIONS.HAPPY]: '😏',
    [EMOTIONS.SURPRISED]: '😯',
    [EMOTIONS.CONFUSED]: '🧐',
    [EMOTIONS.WISE]: '🕵️‍♂️',
    [EMOTIONS.EXCITED]: '💡',
    [EMOTIONS.SERIOUS]: '😠',
    [EMOTIONS.MYSTERIOUS]: '🔍',
    [EMOTIONS.LAUGHING]: '😂',
    [EMOTIONS.GREETING]: '🎩',
    [EMOTIONS.DEFAULT]: '🕵️‍♂️'
  },
  'alien-dj': {
    [EMOTIONS.THINKING]: '🤖',
    [EMOTIONS.HAPPY]: '😎',
    [EMOTIONS.SURPRISED]: '🛸',
    [EMOTIONS.CONFUSED]: '👽',
    [EMOTIONS.WISE]: '🌌',
    [EMOTIONS.EXCITED]: '🎵',
    [EMOTIONS.SERIOUS]: '⚡',
    [EMOTIONS.MYSTERIOUS]: '🌠',
    [EMOTIONS.LAUGHING]: '😆',
    [EMOTIONS.GREETING]: '🚀',
    [EMOTIONS.DEFAULT]: '👽'
  }
};

// Detect emotion from text
export const detectEmotion = (text, characterId) => {
  if (!text || typeof text !== 'string') {
    return getCharacterExpression(characterId, EMOTIONS.DEFAULT);
  }

  const lowerText = text.toLowerCase();

  // Check for emotion patterns
  for (const [emotion, patterns] of Object.entries(EMOTION_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(lowerText)) {
        return getCharacterExpression(characterId, emotion);
      }
    }
  }

  // Check for questions (thinking expression)
  if (lowerText.includes('?') || lowerText.startsWith('what') || lowerText.startsWith('how') || lowerText.startsWith('why')) {
    return getCharacterExpression(characterId, EMOTIONS.THINKING);
  }

  // Check for exclamations (excited expression)
  if (lowerText.includes('!') && !lowerText.includes('warning') && !lowerText.includes('danger')) {
    return getCharacterExpression(characterId, EMOTIONS.EXCITED);
  }

  // Default expression
  return getCharacterExpression(characterId, EMOTIONS.DEFAULT);
};

// Get character-specific expression
export const getCharacterExpression = (characterId, emotion) => {
  const characterEmotions = CHARACTER_EMOTIONS[characterId];
  if (!characterEmotions) {
    return '🤖'; // Fallback emoji
  }

  return characterEmotions[emotion] || characterEmotions[EMOTIONS.DEFAULT];
};

// Detect if user is asking a question
export const isQuestion = (text) => {
  if (!text) return false;
  const lowerText = text.toLowerCase().trim();
  
  return (
    lowerText.includes('?') ||
    lowerText.startsWith('what') ||
    lowerText.startsWith('how') ||
    lowerText.startsWith('why') ||
    lowerText.startsWith('when') ||
    lowerText.startsWith('where') ||
    lowerText.startsWith('who') ||
    lowerText.startsWith('can you') ||
    lowerText.startsWith('could you') ||
    lowerText.startsWith('would you') ||
    lowerText.startsWith('do you') ||
    lowerText.startsWith('are you') ||
    lowerText.startsWith('is it') ||
    lowerText.startsWith('tell me')
  );
};

// Get typing expression (when character is thinking)
export const getTypingExpression = (characterId) => {
  return getCharacterExpression(characterId, EMOTIONS.THINKING);
};

// Get random variation of expression
export const getExpressionVariation = (characterId, emotion) => {
  const variations = {
    gandalf: {
      [EMOTIONS.THINKING]: ['🤔', '🧙‍♂️', '💭', '🌟'],
      [EMOTIONS.WISE]: ['🧙‍♂️', '✨', '🌟', '📚'],
      [EMOTIONS.MYSTERIOUS]: ['🌟', '✨', '🔮', '🌙']
    },
    sherlock: {
      [EMOTIONS.THINKING]: ['🤔', '🧐', '💭', '🔍'],
      [EMOTIONS.WISE]: ['🕵️‍♂️', '🧐', '💡', '📖'],
      [EMOTIONS.MYSTERIOUS]: ['🔍', '🔎', '🕵️‍♂️', '💡']
    },
    'alien-dj': {
      [EMOTIONS.THINKING]: ['🤖', '👽', '💭', '🛸'],
      [EMOTIONS.EXCITED]: ['🎵', '🎶', '🚀', '⚡'],
      [EMOTIONS.MYSTERIOUS]: ['🌠', '🛸', '🌌', '👽']
    }
  };

  const characterVariations = variations[characterId];
  if (characterVariations && characterVariations[emotion]) {
    const options = characterVariations[emotion];
    return options[Math.floor(Math.random() * options.length)];
  }

  return getCharacterExpression(characterId, emotion);
};