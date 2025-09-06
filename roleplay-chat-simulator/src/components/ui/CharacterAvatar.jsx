import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { detectEmotion } from '../../utils/emotionDetector';

const CharacterAvatar = ({ 
  character, 
  message,
  isTyping = false,
  size = 'md', 
  className = '',
  showAnimation = true,
  ...props 
}) => {
  const [currentExpression, setCurrentExpression] = useState('default');
  const [isAnimating, setIsAnimating] = useState(false);

  const sizes = {
    xs: 'w-8 h-8',
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24',
    '2xl': 'w-32 h-32',
    '3xl': 'w-40 h-40'
  };

  // Update expression based on message content or typing state
  useEffect(() => {
    if (!character) return;

    let newExpression = 'default';
    
    if (isTyping) {
      newExpression = 'thinking';
    } else if (message && message.text) {
      // Use emotion detection to determine expression
      const emotion = detectEmotion(message.text, character.id);
      newExpression = mapEmotionToExpression(emotion, character.id);
    }

    if (newExpression !== currentExpression) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentExpression(newExpression);
        setIsAnimating(false);
      }, 200);
    }
  }, [character, message, isTyping, currentExpression]);

  const mapEmotionToExpression = (emotion, characterId) => {
    // Map emotions to facial expressions
    const emotionMap = {
      '🤔': 'thinking',
      '😊': 'happy',
      '😮': 'surprised',
      '🤨': 'confused',
      '🧙‍♂️': 'wise',
      '✨': 'magical',
      '😤': 'serious',
      '🌟': 'mysterious',
      '😄': 'laughing',
      '👋': 'greeting',
      '🕵️‍♂️': 'detective',
      '🧐': 'analyzing',
      '💡': 'eureka',
      '🔍': 'investigating',
      '😏': 'smug',
      '👽': 'alien',
      '😎': 'cool',
      '🎵': 'musical',
      '🌠': 'cosmic',
      '⚡': 'energetic'
    };

    return emotionMap[emotion] || 'default';
  };

  const renderGandalfAvatar = () => {
    const expressions = {
      default: {
        eyes: 'M25,35 Q30,30 35,35 M45,35 Q50,30 55,35',
        mouth: 'M35,50 Q40,55 45,50',
        eyebrows: 'M25,30 L35,28 M45,28 L55,30',
        beard: 'M20,55 Q40,75 60,55',
        hat: 'M15,25 Q40,5 65,25 L60,30 Q40,15 20,30 Z'
      },
      thinking: {
        eyes: 'M25,35 Q30,32 35,35 M45,35 Q50,32 55,35',
        mouth: 'M35,50 Q40,48 45,50',
        eyebrows: 'M25,28 L35,25 M45,25 L55,28',
        beard: 'M20,55 Q40,75 60,55',
        hat: 'M15,25 Q40,5 65,25 L60,30 Q40,15 20,30 Z',
        extra: 'M65,20 Q70,15 75,20 M70,25 Q75,20 80,25 M75,30 Q80,25 85,30' // thought bubbles
      },
      happy: {
        eyes: 'M25,35 Q30,28 35,35 M45,35 Q50,28 55,35',
        mouth: 'M30,50 Q40,60 50,50',
        eyebrows: 'M25,30 Q30,25 35,30 M45,30 Q50,25 55,30',
        beard: 'M20,55 Q40,75 60,55',
        hat: 'M15,25 Q40,5 65,25 L60,30 Q40,15 20,30 Z'
      },
      wise: {
        eyes: 'M25,35 Q30,30 35,35 M45,35 Q50,30 55,35',
        mouth: 'M35,50 Q40,53 45,50',
        eyebrows: 'M25,30 L35,28 M45,28 L55,30',
        beard: 'M20,55 Q40,78 60,55',
        hat: 'M15,25 Q40,5 65,25 L60,30 Q40,15 20,30 Z',
        extra: 'M40,25 L42,20 M38,20 L40,25 M42,20 L44,25' // sparkles on hat
      },
      magical: {
        eyes: 'M25,35 Q30,30 35,35 M45,35 Q50,30 55,35',
        mouth: 'M35,50 Q40,55 45,50',
        eyebrows: 'M25,30 L35,28 M45,28 L55,30',
        beard: 'M20,55 Q40,75 60,55',
        hat: 'M15,25 Q40,5 65,25 L60,30 Q40,15 20,30 Z',
        extra: 'M10,15 L12,10 M8,10 L10,15 M12,10 L14,15 M70,40 L72,35 M68,35 L70,40' // sparkles around
      }
    };

    const expr = expressions[currentExpression] || expressions.default;

    return (
      <svg viewBox="0 0 80 80" className="w-full h-full">
        {/* Background circle */}
        <circle cx="40" cy="40" r="35" fill="#f0f8ff" stroke="#d4af37" strokeWidth="2"/>
        
        {/* Hat */}
        <path d={expr.hat} fill="#4a5568" stroke="#2d3748" strokeWidth="1"/>
        
        {/* Face */}
        <circle cx="40" cy="40" r="25" fill="#ffeaa7"/>
        
        {/* Beard */}
        <path d={expr.beard} fill="#e2e8f0" stroke="#a0aec0" strokeWidth="1"/>
        
        {/* Eyes */}
        <path d={expr.eyes} stroke="#2d3748" strokeWidth="2" fill="none"/>
        
        {/* Eyebrows */}
        <path d={expr.eyebrows} stroke="#a0aec0" strokeWidth="2" fill="none"/>
        
        {/* Mouth */}
        <path d={expr.mouth} stroke="#2d3748" strokeWidth="2" fill="none"/>
        
        {/* Staff (partial) */}
        <line x1="70" y1="60" x2="75" y2="75" stroke="#8b4513" strokeWidth="3"/>
        <circle cx="72" cy="58" r="3" fill="#ffd700"/>
        
        {/* Extra elements (sparkles, etc.) */}
        {expr.extra && (
          <path d={expr.extra} stroke="#ffd700" strokeWidth="1" fill="none"/>
        )}
      </svg>
    );
  };

  const renderSherlockAvatar = () => {
    const expressions = {
      default: {
        eyes: 'M25,35 Q30,30 35,35 M45,35 Q50,30 55,35',
        mouth: 'M35,50 Q40,52 45,50',
        eyebrows: 'M25,30 L35,28 M45,28 L55,30',
        hat: 'M20,25 Q40,15 60,25 L55,30 Q40,20 25,30 Z'
      },
      thinking: {
        eyes: 'M25,35 Q30,32 35,35 M45,35 Q50,32 55,35',
        mouth: 'M35,50 Q40,48 45,50',
        eyebrows: 'M25,28 L35,26 M45,26 L55,28',
        hat: 'M20,25 Q40,15 60,25 L55,30 Q40,20 25,30 Z'
      },
      analyzing: {
        eyes: 'M25,35 L35,35 M45,35 L55,35', // squinting
        mouth: 'M35,50 L45,50',
        eyebrows: 'M25,28 L35,25 M45,25 L55,28',
        hat: 'M20,25 Q40,15 60,25 L55,30 Q40,20 25,30 Z',
        extra: 'M65,35 Q70,30 75,35' // monocle
      },
      eureka: {
        eyes: 'M25,35 Q30,25 35,35 M45,35 Q50,25 55,35',
        mouth: 'M30,50 Q40,60 50,50',
        eyebrows: 'M25,25 Q30,20 35,25 M45,25 Q50,20 55,25',
        hat: 'M20,25 Q40,15 60,25 L55,30 Q40,20 25,30 Z',
        extra: 'M40,20 L42,15 M38,15 L40,20 M42,15 L44,20' // light bulb effect
      },
      smug: {
        eyes: 'M25,35 Q30,30 35,35 M45,35 Q50,30 55,35',
        mouth: 'M30,50 Q35,55 40,50 Q45,55 50,50',
        eyebrows: 'M25,30 Q30,25 35,30 M45,30 Q50,25 55,30',
        hat: 'M20,25 Q40,15 60,25 L55,30 Q40,20 25,30 Z'
      }
    };

    const expr = expressions[currentExpression] || expressions.default;

    return (
      <svg viewBox="0 0 80 80" className="w-full h-full">
        {/* Background circle */}
        <circle cx="40" cy="40" r="35" fill="#f0f8ff" stroke="#3182ce" strokeWidth="2"/>
        
        {/* Deerstalker hat */}
        <path d={expr.hat} fill="#8b4513" stroke="#654321" strokeWidth="1"/>
        
        {/* Face */}
        <circle cx="40" cy="40" r="25" fill="#ffeaa7"/>
        
        {/* Eyes */}
        <path d={expr.eyes} stroke="#2d3748" strokeWidth="2" fill="none"/>
        
        {/* Eyebrows */}
        <path d={expr.eyebrows} stroke="#4a5568" strokeWidth="2" fill="none"/>
        
        {/* Mouth */}
        <path d={expr.mouth} stroke="#2d3748" strokeWidth="2" fill="none"/>
        
        {/* Pipe */}
        <ellipse cx="25" cy="55" rx="8" ry="3" fill="#8b4513"/>
        <rect x="15" y="53" width="10" height="4" fill="#654321"/>
        
        {/* Magnifying glass */}
        <circle cx="65" cy="25" r="8" fill="none" stroke="#4a5568" strokeWidth="2"/>
        <line x1="72" y1="32" x2="78" y2="38" stroke="#4a5568" strokeWidth="3"/>
        
        {/* Extra elements */}
        {expr.extra && (
          <path d={expr.extra} stroke="#2d3748" strokeWidth="1" fill="none"/>
        )}
      </svg>
    );
  };

  const renderAlienDJAvatar = () => {
    const expressions = {
      default: {
        eyes: 'M20,30 Q30,25 40,30 M40,30 Q50,25 60,30',
        mouth: 'M35,50 Q40,55 45,50',
        antennae: 'M30,15 L32,5 M50,15 L48,5'
      },
      thinking: {
        eyes: 'M20,30 Q30,27 40,30 M40,30 Q50,27 60,30',
        mouth: 'M35,50 Q40,48 45,50',
        antennae: 'M30,15 Q28,10 32,5 M50,15 Q52,10 48,5' // bent thinking
      },
      cool: {
        eyes: 'M20,30 L40,30 M40,30 L60,30', // sunglasses
        mouth: 'M30,50 Q40,60 50,50',
        antennae: 'M30,15 L32,5 M50,15 L48,5',
        extra: 'M15,30 Q40,20 65,30' // sunglasses frame
      },
      musical: {
        eyes: 'M20,30 Q30,25 40,30 M40,30 Q50,25 60,30',
        mouth: 'M30,50 Q40,60 50,50',
        antennae: 'M30,15 L32,5 M50,15 L48,5',
        extra: 'M10,20 Q15,15 20,20 M60,20 Q65,15 70,20 M15,40 Q20,35 25,40' // music notes
      },
      cosmic: {
        eyes: 'M20,30 Q30,25 40,30 M40,30 Q50,25 60,30',
        mouth: 'M35,50 Q40,55 45,50',
        antennae: 'M30,15 L32,5 M50,15 L48,5',
        extra: 'M32,5 L34,2 M46,5 L48,2 M10,35 L12,32 M68,35 L70,32' // stars on antennae and around
      }
    };

    const expr = expressions[currentExpression] || expressions.default;

    return (
      <svg viewBox="0 0 80 80" className="w-full h-full">
        {/* Background circle with cosmic gradient */}
        <defs>
          <radialGradient id="cosmicBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1a202c"/>
            <stop offset="100%" stopColor="#2d3748"/>
          </radialGradient>
        </defs>
        <circle cx="40" cy="40" r="35" fill="url(#cosmicBg)" stroke="#22c55e" strokeWidth="2"/>
        
        {/* Alien head */}
        <ellipse cx="40" cy="40" rx="25" ry="30" fill="#90ee90"/>
        
        {/* Large alien eyes */}
        <ellipse cx="30" cy="35" rx="8" ry="12" fill="#000"/>
        <ellipse cx="50" cy="35" rx="8" ry="12" fill="#000"/>
        <ellipse cx="30" cy="35" rx="4" ry="6" fill="#fff"/>
        <ellipse cx="50" cy="35" rx="4" ry="6" fill="#fff"/>
        
        {/* Eye expressions */}
        <path d={expr.eyes} stroke="#fff" strokeWidth="1" fill="none"/>
        
        {/* Antennae */}
        <path d={expr.antennae} stroke="#90ee90" strokeWidth="3" fill="none"/>
        <circle cx="32" cy="5" r="2" fill="#22c55e"/>
        <circle cx="48" cy="5" r="2" fill="#22c55e"/>
        
        {/* Mouth */}
        <path d={expr.mouth} stroke="#2d3748" strokeWidth="2" fill="none"/>
        
        {/* DJ Headphones */}
        <ellipse cx="15" cy="35" rx="8" ry="6" fill="#4a5568"/>
        <ellipse cx="65" cy="35" rx="8" ry="6" fill="#4a5568"/>
        <path d="M23,35 Q40,25 57,35" stroke="#4a5568" strokeWidth="4" fill="none"/>
        
        {/* Extra elements (sunglasses, music notes, etc.) */}
        {expr.extra && (
          <path d={expr.extra} stroke="#22c55e" strokeWidth="2" fill="none"/>
        )}
      </svg>
    );
  };

  const renderCharacterAvatar = () => {
    if (!character) return null;

    switch (character.id) {
      case 'gandalf':
        return renderGandalfAvatar();
      case 'sherlock':
        return renderSherlockAvatar();
      case 'alien-dj':
        return renderAlienDJAvatar();
      default:
        return renderGandalfAvatar();
    }
  };

  return (
    <div
      className={clsx(
        'rounded-full overflow-hidden transition-all duration-300 relative',
        sizes[size],
        {
          'animate-pulse': isTyping,
          'scale-110': isAnimating && showAnimation,
          'hover:scale-105': !isTyping && showAnimation,
          'shadow-lg': character?.themeColor,
          'animate-bounce': isTyping && showAnimation,
        },
        className
      )}
      style={{
        filter: isTyping ? 'brightness(1.1)' : 'brightness(1)',
      }}
      {...props}
    >
      {renderCharacterAvatar()}
      
      {/* Typing indicator overlay */}
      {isTyping && (
        <div className="absolute -bottom-1 -right-1 flex space-x-0.5">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-typing-dots"></div>
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-typing-dots animate-delay-200"></div>
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-typing-dots animate-delay-400"></div>
        </div>
      )}
      
      {/* Glow effect */}
      {character?.themeColor && showAnimation && (
        <div 
          className="absolute inset-0 rounded-full opacity-20 animate-pulse"
          style={{
            boxShadow: `0 0 20px ${character.themeColor}60`
          }}
        />
      )}
    </div>
  );
};

export default CharacterAvatar;