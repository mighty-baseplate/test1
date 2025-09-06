import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { detectEmotion, getTypingExpression, getExpressionVariation } from '../../utils/emotionDetector';

const DynamicAvatar = ({ 
  character, 
  message,
  isTyping = false,
  size = 'md', 
  className = '',
  showParticles = true,
  ...props 
}) => {
  const [currentExpression, setCurrentExpression] = useState(character?.avatar || '🤖');
  const [particles, setParticles] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl',
    '3xl': 'w-24 h-24 text-3xl'
  };

  // Update expression based on message content or typing state
  useEffect(() => {
    if (!character) return;

    let newExpression;
    
    if (isTyping) {
      newExpression = getTypingExpression(character.id);
    } else if (message && message.text) {
      newExpression = detectEmotion(message.text, character.id);
    } else {
      newExpression = character.expressions?.default || character.avatar;
    }

    if (newExpression !== currentExpression) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentExpression(newExpression);
        setIsAnimating(false);
      }, 150);
    }
  }, [character, message, isTyping, currentExpression]);

  // Generate particles effect
  useEffect(() => {
    if (!showParticles || !character?.visualEffects?.particles) return;

    const generateParticles = () => {
      const newParticles = [];
      const particleCount = Math.random() * 3 + 2; // 2-5 particles
      
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: Math.random(),
          emoji: character.visualEffects.particles,
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: Math.random() * 2000,
          duration: Math.random() * 3000 + 2000
        });
      }
      
      setParticles(newParticles);
      
      // Clear particles after animation
      setTimeout(() => setParticles([]), 5000);
    };

    // Generate particles when expression changes (not for typing)
    if (!isTyping && message) {
      const timer = setTimeout(generateParticles, 500);
      return () => clearTimeout(timer);
    }
  }, [currentExpression, character, isTyping, message, showParticles]);

  const baseClasses = 'rounded-full flex items-center justify-center overflow-hidden relative transition-all duration-300';
  
  const getThemeClasses = () => {
    if (!character?.visualEffects?.color) return '';
    
    const colorMap = {
      golden: 'bg-gradient-to-br from-yellow-100 to-amber-100 ring-2 ring-yellow-300 ring-opacity-50',
      blue: 'bg-gradient-to-br from-blue-100 to-indigo-100 ring-2 ring-blue-300 ring-opacity-50',
      'neon-green': 'bg-gradient-to-br from-green-100 to-emerald-100 ring-2 ring-green-300 ring-opacity-50'
    };
    
    return colorMap[character.visualEffects.color] || '';
  };

  return (
    <div
      className={clsx(
        baseClasses,
        sizes[size],
        getThemeClasses(),
        {
          'animate-pulse': isTyping,
          'scale-110': isAnimating,
          'hover:scale-105': !isTyping,
          'shadow-lg': character?.visualEffects?.color,
        },
        className
      )}
      {...props}
    >
      {/* Main Avatar */}
      <span 
        role="img" 
        aria-label={character?.name || 'Character'}
        className={clsx(
          'transition-all duration-300 select-none',
          {
            'animate-bounce': isTyping,
            'scale-75 opacity-50': isAnimating
          }
        )}
      >
        {currentExpression}
      </span>

      {/* Particle Effects */}
      {showParticles && particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute pointer-events-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}ms`,
            animationDuration: `${particle.duration}ms`
          }}
        >
          <span 
            className="text-xs animate-ping opacity-75"
            style={{
              animationIterationCount: 'infinite',
              animationDirection: 'alternate'
            }}
          >
            {particle.emoji}
          </span>
        </div>
      ))}

      {/* Typing Indicator Dots */}
      {isTyping && (
        <div className="absolute -bottom-1 -right-1 flex space-x-0.5">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-typing-dots"></div>
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-typing-dots animate-delay-200"></div>
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-typing-dots animate-delay-400"></div>
        </div>
      )}

      {/* Glow Effect */}
      {character?.visualEffects?.color && (
        <div className={clsx(
          'absolute inset-0 rounded-full opacity-20 animate-pulse',
          {
            'bg-yellow-400': character.visualEffects.color === 'golden',
            'bg-blue-400': character.visualEffects.color === 'blue',
            'bg-green-400': character.visualEffects.color === 'neon-green'
          }
        )} />
      )}
    </div>
  );
};

export default DynamicAvatar;