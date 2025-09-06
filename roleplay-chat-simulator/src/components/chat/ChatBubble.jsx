import React from 'react';
import { clsx } from 'clsx';
import Avatar from '../ui/Avatar';
import { formatTimestamp } from '../../utils/helpers';

const ChatBubble = ({ 
  message, 
  isTyping = false, 
  character,
  showAvatar = true,
  showTimestamp = false,
  className = ''
}) => {
  const { text, sender, timestamp, id } = message;
  const isUser = sender === 'user';
  const isAI = sender === 'ai';

  if (isTyping && isAI) {
    return (
      <div className={clsx('flex items-end space-x-2 mb-4 animate-fade-in', className)}>
        {showAvatar && (
          <Avatar 
            emoji={character?.avatar} 
            size="sm" 
            alt={character?.name}
          />
        )}
        <div className="bg-white border-2 border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-md">
          <div className="flex space-x-1">
            <div className="typing-dot"></div>
            <div className="typing-dot animate-delay-200"></div>
            <div className="typing-dot animate-delay-400"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={clsx(
        'flex items-end space-x-2 mb-4 animate-bounce-in',
        isUser ? 'flex-row-reverse space-x-reverse' : '',
        className
      )}
    >
      {showAvatar && (
        <Avatar 
          emoji={isUser ? '👤' : character?.avatar} 
          size="sm" 
          alt={isUser ? 'You' : character?.name}
        />
      )}
      
      <div className="flex flex-col max-w-xs lg:max-w-md">
        <div
          className={clsx(
            'px-4 py-2 shadow-md',
            isUser 
              ? 'bg-blue-500 text-white rounded-2xl rounded-br-md ml-auto'
              : `bg-white rounded-2xl rounded-bl-md mr-auto`,
            isAI && character && `border-2 ${character.borderColor || 'border-gray-200'}`
          )}
          style={isAI && character ? { 
            borderColor: character.themeColor + '40' // Add transparency
          } : {}}
        >
          <p className="text-sm whitespace-pre-wrap break-words">
            {text}
          </p>
        </div>
        
        {showTimestamp && timestamp && (
          <span 
            className={clsx(
              'text-xs text-gray-500 mt-1',
              isUser ? 'text-right' : 'text-left'
            )}
          >
            {formatTimestamp(timestamp)}
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;