import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import CharacterAvatar from './CharacterAvatar';

const ThinkingBubble = ({ 
  character, 
  className = '',
  messages = [
    "Hmm, let me think...",
    "Interesting question...",
    "Processing your request...",
    "Gathering my thoughts...",
    "One moment please..."
  ]
}) => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [dots, setDots] = useState('');

  // Cycle through thinking messages
  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % messages.length);
    }, 3000);

    return () => clearInterval(messageInterval);
  }, [messages.length]);

  // Animate dots
  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(dotInterval);
  }, []);

  // Character-specific thinking messages
  const getCharacterMessages = () => {
    const characterMessages = {
      gandalf: [
        "Pondering the ancient wisdom...",
        "Consulting the stars...",
        "Drawing upon old knowledge...",
        "The winds whisper to me...",
        "Ah, I sense something..."
      ],
      sherlock: [
        "Analyzing the evidence...",
        "Making deductions...",
        "The game is afoot...",
        "Observing the details...",
        "Elementary calculations..."
      ],
      'alien-dj': [
        "Tuning into cosmic frequencies...",
        "Syncing with the universal beat...",
        "Downloading galactic wisdom...",
        "Vibing with the cosmos...",
        "Mixing up some knowledge..."
      ]
    };

    return characterMessages[character?.id] || messages;
  };

  const thinkingMessages = getCharacterMessages();

  return (
    <div className={clsx(
      'flex items-end space-x-3 mb-4 animate-fade-in',
      className
    )}>
      <CharacterAvatar 
        character={character}
        isTyping={true}
        size="md"
        showAnimation={true}
        className="animate-pulse"
      />
      
      <div 
        className="bg-white/90 backdrop-blur-sm border-2 rounded-2xl rounded-bl-md px-6 py-4 shadow-lg max-w-xs"
        style={character ? { 
          borderColor: character.themeColor + '40',
          background: `linear-gradient(135deg, ${character.themeColor}10, white)`
        } : {}}
      >
        <div className="flex flex-col space-y-2">
          {/* Character name */}
          <div className="text-xs text-gray-500 font-medium">
            {character?.name}
          </div>
          
          {/* Thinking message */}
          <div className="text-sm text-gray-700">
            {thinkingMessages[currentMessage]}{dots}
          </div>
          
          {/* Animated thinking indicators */}
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-typing-dots"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-typing-dots animate-delay-200"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-typing-dots animate-delay-400"></div>
            </div>
            
            {/* Character-specific thinking emoji */}
            <div className="text-lg animate-pulse">
              {character?.expressions?.thinking || '🤔'}
            </div>
          </div>
        </div>
        
        {/* Floating particles around thinking bubble */}
        <div className="absolute -top-2 -right-2 text-xs animate-float">
          💭
        </div>
        <div className="absolute -bottom-1 -left-1 text-xs animate-float" style={{ animationDelay: '1s' }}>
          ✨
        </div>
      </div>
    </div>
  );
};

export default ThinkingBubble;