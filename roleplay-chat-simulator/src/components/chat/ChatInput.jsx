import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import Button from '../ui/Button';
import { Send, Mic, MicOff } from 'lucide-react';

const ChatInput = ({ 
  onSendMessage, 
  disabled = false,
  placeholder = "Type your message...",
  character,
  className = ''
}) => {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessage(prev => prev + transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
      }
    } else {
      alert('Speech recognition is not supported in your browser.');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={clsx('flex items-end space-x-2 p-4 bg-white border-t border-gray-200', className)}
    >
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className={clsx(
            'w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200',
            character ? `focus:ring-2` : 'focus:ring-blue-500',
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          )}
          style={character ? {
            '--tw-ring-color': character.themeColor + '40'
          } : {}}
        />
        
        {/* Voice input button */}
        <button
          type="button"
          onClick={handleVoiceInput}
          className={clsx(
            'absolute right-2 top-2 p-1 rounded-full transition-colors duration-200',
            isListening 
              ? 'text-red-500 hover:text-red-600 bg-red-50' 
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
          )}
          title={isListening ? 'Stop listening' : 'Voice input'}
        >
          {isListening ? <MicOff size={16} /> : <Mic size={16} />}
        </button>
      </div>
      
      <Button
        type="submit"
        disabled={!message.trim() || disabled}
        className={clsx(
          'px-3 py-2 flex items-center justify-center',
          character && 'focus:ring-2'
        )}
        style={character ? {
          backgroundColor: character.themeColor,
          '--tw-ring-color': character.themeColor + '40'
        } : {}}
      >
        <Send size={16} />
        <span className="sr-only">Send message</span>
      </Button>
    </form>
  );
};

export default ChatInput;