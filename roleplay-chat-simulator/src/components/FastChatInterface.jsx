import React, { useState } from 'react';
import { clsx } from 'clsx';
import { characters } from '../data/characters';
import { useFastChat } from '../hooks/useFastChat';
import Button from './ui/Button';
import CharacterAvatar from './ui/CharacterAvatar';
import { Send, RotateCcw, Zap } from 'lucide-react';

const FastChatInterface = () => {
  const [inputMessage, setInputMessage] = useState('');
  const {
    messages,
    currentCharacter,
    isProcessing,
    error,
    responseTime,
    sendMessageFast,
    selectCharacter,
    clearMessages,
    clearError
  } = useFastChat();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputMessage.trim() && !isProcessing) {
      await sendMessageFast(inputMessage);
      setInputMessage('');
    }
  };

  const handleCharacterSelect = (character) => {
    selectCharacter(character);
  };

  if (!currentCharacter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ⚡ Fast Demo Mode
            </h1>
            <p className="text-gray-600">
              Optimized for quickest response time - Select a character to start
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {characters.map((character) => (
              <div
                key={character.id}
                onClick={() => handleCharacterSelect(character)}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:scale-105"
              >
                <div className="flex justify-center mb-4">
                  <CharacterAvatar 
                    character={character}
                    size="2xl"
                    showAnimation={true}
                  />
                </div>
                <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
                  {character.name}
                </h3>
                <p className="text-sm text-gray-600 text-center">
                  {character.personality}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CharacterAvatar 
                character={currentCharacter}
                message={messages[messages.length - 1]}
                isTyping={isProcessing}
                size="md"
                showAnimation={true}
              />
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {currentCharacter.name}
                </h2>
                <p className="text-sm text-gray-600">
                  ⚡ Fast Demo Mode
                  {responseTime && (
                    <span className="ml-2 text-green-600 font-medium">
                      Last response: {responseTime}ms
                    </span>
                  )}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearMessages}
                disabled={isProcessing}
              >
                <RotateCcw size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => selectCharacter(null)}
                disabled={isProcessing}
              >
                Change Character
              </Button>
            </div>
          </div>

          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={clearError}
                className="text-red-500 hover:text-red-700 text-sm font-medium"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-4 min-h-[400px] max-h-[500px] overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <CharacterAvatar 
                character={currentCharacter}
                size="3xl"
                showAnimation={true}
                className="mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Ready for fast demo!
              </h3>
              <p className="text-gray-500 max-w-md">
                Type a message below to see the fastest possible response from {currentCharacter.name}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={clsx(
                    'flex items-start space-x-3',
                    message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  )}
                >
                  {message.sender === 'ai' && (
                    <CharacterAvatar 
                      character={currentCharacter}
                      message={message}
                      size="sm"
                      showAnimation={true}
                    />
                  )}
                  {message.sender === 'user' && (
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      U
                    </div>
                  )}
                  
                  <div
                    className={clsx(
                      'max-w-md px-4 py-2 rounded-2xl shadow-sm',
                      message.sender === 'user' 
                        ? 'bg-blue-500 text-white rounded-br-md' 
                        : 'bg-gray-100 text-gray-900 rounded-bl-md'
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.text}
                    </p>
                  </div>
                </div>
              ))}

              {isProcessing && (
                <div className="flex items-start space-x-3">
                  <CharacterAvatar 
                    character={currentCharacter}
                    isTyping={true}
                    size="sm"
                    showAnimation={true}
                  />
                  <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing-dots"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing-dots animate-delay-200"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing-dots animate-delay-400"></div>
                      </div>
                      <span className="text-xs text-gray-500">Processing...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Message ${currentCharacter.name}...`}
              disabled={isProcessing}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              autoFocus
            />
            <Button
              type="submit"
              disabled={!inputMessage.trim() || isProcessing}
              className="px-6 py-2"
              style={{ backgroundColor: currentCharacter.themeColor }}
            >
              {isProcessing ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Zap size={16} className="mr-2" />
                  Send Fast
                </>
              )}
            </Button>
          </div>
          
          <div className="mt-2 text-xs text-gray-500 text-center">
            ⚡ Optimized for fastest possible response • Kokoro TTS ready
          </div>
        </form>
      </div>
    </div>
  );
};

export default FastChatInterface;