import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { detectEmotion } from '../../utils/emotionDetector';

const MessageReactions = ({ 
  message, 
  character, 
  className = '',
  showReactions = true 
}) => {
  const [reactions, setReactions] = useState([]);
  const [showAll, setShowAll] = useState(false);

  // Generate contextual reactions based on message content
  useEffect(() => {
    if (!message || !character || !showReactions) return;

    const generateReactions = () => {
      const messageText = message.text.toLowerCase();
      const newReactions = [];

      // Character-specific reaction patterns
      const reactionPatterns = {
        gandalf: {
          wisdom: ['🧙‍♂️', '✨', '🌟'],
          magic: ['⚡', '🔮', '✨'],
          journey: ['🗡️', '🏔️', '🛡️'],
          friendship: ['❤️', '🤝', '😊']
        },
        sherlock: {
          deduction: ['🕵️‍♂️', '💡', '🔍'],
          mystery: ['🔎', '📋', '🧐'],
          logic: ['🧠', '⚖️', '📖'],
          elementary: ['👍', '💯', '🎯']
        },
        'alien-dj': {
          music: ['🎵', '🎶', '🎧'],
          space: ['🚀', '🌌', '👽'],
          energy: ['⚡', '🌟', '💫'],
          cosmic: ['🛸', '🌠', '🔮']
        }
      };

      const characterReactions = reactionPatterns[character.id] || {};

      // Check for relevant keywords and add reactions
      Object.entries(characterReactions).forEach(([category, emojis]) => {
        const keywords = {
          wisdom: ['wise', 'knowledge', 'learn', 'understand'],
          magic: ['magic', 'spell', 'power', 'mystical'],
          journey: ['adventure', 'quest', 'travel', 'path'],
          friendship: ['friend', 'help', 'care', 'love'],
          deduction: ['deduce', 'conclude', 'observe', 'analyze'],
          mystery: ['mystery', 'clue', 'evidence', 'investigate'],
          logic: ['logical', 'reason', 'think', 'rational'],
          elementary: ['elementary', 'obvious', 'simple', 'clear'],
          music: ['music', 'beat', 'sound', 'rhythm'],
          space: ['space', 'galaxy', 'planet', 'universe'],
          energy: ['energy', 'power', 'force', 'vibe'],
          cosmic: ['cosmic', 'star', 'celestial', 'infinite']
        };

        const categoryKeywords = keywords[category] || [];
        const hasKeyword = categoryKeywords.some(keyword => messageText.includes(keyword));
        
        if (hasKeyword) {
          // Add 1-2 random emojis from this category
          const shuffled = [...emojis].sort(() => 0.5 - Math.random());
          newReactions.push(...shuffled.slice(0, Math.random() > 0.5 ? 2 : 1));
        }
      });

      // Add emotion-based reactions
      const emotion = detectEmotion(message.text, character.id);
      if (emotion && !newReactions.includes(emotion)) {
        newReactions.push(emotion);
      }

      // Add some randomness for variety
      if (newReactions.length === 0 && Math.random() > 0.7) {
        const defaultReactions = ['👍', '😊', '🤔', '✨'];
        newReactions.push(defaultReactions[Math.floor(Math.random() * defaultReactions.length)]);
      }

      // Limit to 3-5 reactions and remove duplicates
      const uniqueReactions = [...new Set(newReactions)];
      setReactions(uniqueReactions.slice(0, 5));
    };

    // Delay reaction generation for more natural feel
    const timer = setTimeout(generateReactions, 1000 + Math.random() * 2000);
    return () => clearTimeout(timer);
  }, [message, character, showReactions]);

  if (!reactions.length) return null;

  const displayReactions = showAll ? reactions : reactions.slice(0, 3);

  return (
    <div className={clsx('flex items-center space-x-1 mt-2', className)}>
      {displayReactions.map((reaction, index) => (
        <div
          key={`${reaction}-${index}`}
          className="bg-gray-100 hover:bg-gray-200 rounded-full px-2 py-1 text-xs cursor-pointer transition-all duration-200 hover:scale-110 animate-bounce-in"
          style={{
            animationDelay: `${index * 200}ms`
          }}
          onClick={() => {
            // Add a little wiggle animation on click
            const element = document.elementFromPoint(0, 0);
            if (element) {
              element.classList.add('animate-wiggle');
              setTimeout(() => element.classList.remove('animate-wiggle'), 500);
            }
          }}
        >
          <span role="img" aria-label="reaction">
            {reaction}
          </span>
        </div>
      ))}
      
      {reactions.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
        >
          {showAll ? 'Less' : `+${reactions.length - 3}`}
        </button>
      )}
    </div>
  );
};

export default MessageReactions;