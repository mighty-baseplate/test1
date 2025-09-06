import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import DynamicAvatar from './DynamicAvatar';
import VisualEffects from './VisualEffects';

const CharacterPreview = ({ character, isActive = false, className = '' }) => {
  const [previewMessages, setPreviewMessages] = useState([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  // Sample messages for each character
  const characterPreviews = {
    gandalf: [
      { text: "Greetings, my dear fellow! ✨", emotion: "greeting" },
      { text: "Ah, I sense great wisdom in you... 🌟", emotion: "wise" },
      { text: "The path ahead is mysterious indeed 🤔", emotion: "mysterious" },
      { text: "Magic flows through all things! ⚡", emotion: "excited" }
    ],
    sherlock: [
      { text: "Elementary, my dear friend! 🕵️‍♂️", emotion: "greeting" },
      { text: "I deduce you seek knowledge... 🧐", emotion: "thinking" },
      { text: "The evidence is quite fascinating! 💡", emotion: "excited" },
      { text: "Most curious indeed... 🔍", emotion: "mysterious" }
    ],
    'alien-dj': [
      { text: "Yo, what's up cosmic buddy! 🚀", emotion: "greeting" },
      { text: "That's totally cosmic, dude! 😎", emotion: "excited" },
      { text: "Let me drop some galactic beats... 🎵", emotion: "music" },
      { text: "The universe is vibing tonight! 🌌", emotion: "happy" }
    ]
  };

  useEffect(() => {
    if (character) {
      setPreviewMessages(characterPreviews[character.id] || []);
    }
  }, [character]);

  useEffect(() => {
    if (!isActive || previewMessages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentMessageIndex(prev => (prev + 1) % previewMessages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isActive, previewMessages.length]);

  if (!character || previewMessages.length === 0) return null;

  const currentMessage = previewMessages[currentMessageIndex];

  return (
    <div className={clsx(
      'relative bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500',
      'border-2 border-transparent',
      isActive && 'border-blue-300 shadow-xl scale-105',
      className
    )}>
      {/* Visual Effects Background */}
      <VisualEffects character={character} isActive={isActive} />
      
      {/* Character Theme Background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          background: `linear-gradient(135deg, ${character.themeColor}40, transparent)`
        }}
      />

      <div className="relative z-10 p-6">
        {/* Character Avatar */}
        <div className="flex justify-center mb-4">
          <DynamicAvatar 
            character={character}
            message={currentMessage}
            size="3xl"
            showParticles={isActive}
            className="hover:scale-110 transition-transform duration-300"
          />
        </div>

        {/* Character Name */}
        <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
          {character.name}
        </h3>

        {/* Preview Message */}
        <div className={clsx(
          'min-h-[60px] flex items-center justify-center transition-all duration-500',
          isActive ? 'opacity-100' : 'opacity-70'
        )}>
          {isActive ? (
            <div className="bg-gray-50 rounded-lg px-4 py-2 max-w-full">
              <p className="text-sm text-gray-700 text-center animate-fade-in">
                "{currentMessage.text}"
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center">
              {character.personality}
            </p>
          )}
        </div>

        {/* Theme Color Indicator */}
        <div className="flex justify-center mt-4">
          <div 
            className="w-16 h-1 rounded-full"
            style={{ backgroundColor: character.themeColor }}
          />
        </div>
      </div>

      {/* Hover Glow Effect */}
      {isActive && (
        <div 
          className="absolute inset-0 rounded-xl opacity-20 animate-pulse"
          style={{
            boxShadow: `inset 0 0 20px ${character.themeColor}60`
          }}
        />
      )}
    </div>
  );
};

export default CharacterPreview;