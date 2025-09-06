import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCharacterById } from '../data/characters';
import { useChat } from '../hooks/useChat';
import { useTheme } from '../hooks/useTheme';
import { useTTS } from '../hooks/useTTS';
import { useApp } from '../context/AppContext';
import ChatContainer from '../components/chat/ChatContainer';
import ChatInput from '../components/chat/ChatInput';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Settings,
  Mic,
  MicOff
} from 'lucide-react';

const ChatInterface = () => {
  const { characterId } = useParams();
  const navigate = useNavigate();
  const { state, dispatch, actions } = useApp();
  const { 
    currentCharacter, 
    messages, 
    isLoading, 
    isTyping, 
    error, 
    sendMessage, 
    clearMessages, 
    selectCharacter,
    clearError 
  } = useChat();
  const { theme, getThemeClasses } = useTheme(currentCharacter);
  const { isSupported: ttsSupported, isSpeaking, speak, stop } = useTTS();
  const [showSettings, setShowSettings] = useState(false);

  // Load character when component mounts or characterId changes
  useEffect(() => {
    if (characterId) {
      const character = getCharacterById(characterId);
      if (character) {
        if (!currentCharacter || currentCharacter.id !== characterId) {
          selectCharacter(character);
        }
      } else {
        // Character not found, redirect to picker
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [characterId, currentCharacter, selectCharacter, navigate]);

  const handleSendMessage = async (message) => {
    if (!currentCharacter) return;
    
    clearError();
    await sendMessage(message);
  };

  const handleBackToCharacterPicker = () => {
    navigate('/');
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear this chat? This action cannot be undone.')) {
      clearMessages();
    }
  };

  const toggleTTS = () => {
    dispatch({
      type: actions.UPDATE_SETTINGS,
      payload: { ttsEnabled: !state.settings.ttsEnabled }
    });
    
    if (isSpeaking) {
      stop();
    }
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  if (!currentCharacter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const themeClasses = getThemeClasses;

  return (
    <div 
      className={`min-h-screen ${themeClasses.background} transition-all duration-500`}
    >
      <div className="flex flex-col h-screen max-w-4xl mx-auto">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToCharacterPicker}
                className="p-2"
              >
                <ArrowLeft size={20} />
              </Button>
              
              <Avatar
                emoji={currentCharacter.avatar}
                size="md"
                alt={currentCharacter.name}
              />
              
              <div>
                <h1 className="font-semibold text-gray-900">
                  {currentCharacter.name}
                </h1>
                <p className="text-sm text-gray-500">
                  {currentCharacter.personality}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* TTS Toggle */}
              {ttsSupported && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTTS}
                  className={`p-2 ${state.settings.ttsEnabled ? 'text-green-600' : 'text-gray-400'}`}
                  title={state.settings.ttsEnabled ? 'Disable voice output' : 'Enable voice output'}
                >
                  {state.settings.ttsEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                  {isSpeaking && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  )}
                </Button>
              )}

              {/* Clear Chat */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearChat}
                className="p-2 text-gray-400 hover:text-red-600"
                title="Clear chat history"
              >
                <RotateCcw size={20} />
              </Button>

              {/* Settings */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSettings}
                className="p-2 text-gray-400 hover:text-gray-600"
                title="Settings"
              >
                <Settings size={20} />
              </Button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              <h3 className="font-medium text-gray-900 mb-3">Chat Settings</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Voice Output</span>
                  <Button
                    variant={state.settings.ttsEnabled ? 'primary' : 'outline'}
                    size="sm"
                    onClick={toggleTTS}
                  >
                    {state.settings.ttsEnabled ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Auto Scroll</span>
                  <Button
                    variant={state.settings.autoScroll ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => dispatch({
                      type: actions.UPDATE_SETTINGS,
                      payload: { autoScroll: !state.settings.autoScroll }
                    })}
                  >
                    {state.settings.autoScroll ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="text-sm text-red-700">{error}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearError}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </Button>
              </div>
            </div>
          )}
        </header>

        {/* Chat Messages */}
        <ChatContainer
          messages={messages}
          character={currentCharacter}
          isTyping={isTyping}
          autoScroll={state.settings.autoScroll}
          className="flex-1"
        />

        {/* Chat Input */}
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={isLoading || isTyping}
          character={currentCharacter}
          placeholder={`Message ${currentCharacter.name}...`}
        />

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <LoadingSpinner size="lg" />
              <p className="text-sm text-gray-600 mt-3 text-center">
                {currentCharacter.name} is thinking...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;