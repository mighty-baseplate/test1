import React, { useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import ChatBubble from './ChatBubble';
import ThinkingBubble from '../ui/ThinkingBubble';
import { scrollToBottom } from '../../utils/helpers';

const ChatContainer = ({ 
  messages = [], 
  character,
  isTyping = false,
  autoScroll = true,
  className = ''
}) => {
  const containerRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      scrollToBottom(messagesEndRef.current.parentElement, true);
    }
  }, [messages, isTyping, autoScroll]);

  return (
    <div 
      ref={containerRef}
      className={clsx(
        'flex-1 overflow-y-auto p-4 space-y-2',
        'scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100',
        className
      )}
      style={{ 
        maxHeight: 'calc(100vh - 200px)' 
      }}
    >
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center py-12">
          <div className="text-6xl mb-4">
            {character?.avatar || '💬'}
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Start a conversation with {character?.name || 'your character'}
          </h3>
          <p className="text-gray-500 max-w-md">
            {character?.description || 'Type a message below to begin your roleplay chat experience.'}
          </p>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              message={message}
              character={character}
              showAvatar={true}
              showTimestamp={false}
            />
          ))}
          
          {isTyping && (
            <ThinkingBubble character={character} />
          )}
        </>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatContainer;