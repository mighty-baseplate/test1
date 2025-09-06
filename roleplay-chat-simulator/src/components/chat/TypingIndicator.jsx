import React from 'react';
import { clsx } from 'clsx';
import Avatar from '../ui/Avatar';

const TypingIndicator = ({ 
  character,
  className = '',
  showAvatar = true 
}) => {
  return (
    <div className={clsx('flex items-end space-x-2 mb-4 animate-fade-in', className)}>
      {showAvatar && (
        <Avatar 
          emoji={character?.avatar} 
          size="sm" 
          alt={character?.name}
        />
      )}
      <div 
        className="bg-white border-2 border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-md"
        style={character ? { 
          borderColor: character.themeColor + '40' 
        } : {}}
      >
        <div className="flex space-x-1 items-center">
          <span className="text-xs text-gray-500 mr-2">
            {character?.name} is typing
          </span>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing-dots"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing-dots animate-delay-200"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing-dots animate-delay-400"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;