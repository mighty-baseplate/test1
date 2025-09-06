import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { characters } from '../data/characters';
import { useChat } from '../hooks/useChat';
import CharacterGrid from '../components/character/CharacterGrid';
import CharacterPreview from '../components/ui/CharacterPreview';
import Button from '../components/ui/Button';
import VisualEffects from '../components/ui/VisualEffects';
import { Sparkles, MessageCircle, Zap, Heart } from 'lucide-react';

const CharacterPicker = () => {
  const navigate = useNavigate();
  const { selectCharacter, currentCharacter } = useChat();
  const [hoveredCharacter, setHoveredCharacter] = useState(null);

  const handleCharacterSelect = (character) => {
    selectCharacter(character);
    // Small delay for animation before navigation
    setTimeout(() => {
      navigate(`/chat/${character.id}`);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated Background Effects */}
      <VisualEffects character={hoveredCharacter} isActive={!!hoveredCharacter} />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white shadow-lg">
              <Sparkles size={32} />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Roleplay Chat Simulator
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Choose your character and embark on an immersive conversation experience. 
            Each character has their own personality, speaking style, and unique perspective.
          </p>

          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <MessageCircle size={16} />
            <span>Powered by Google Gemini AI</span>
          </div>
        </div>

        {/* Character Selection */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-8">
            Select Your Character
          </h2>
          
          {/* Character Previews Grid */}
          <div className="grid gap-8 grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto mb-8">
            {characters.map((character, index) => (
              <div
                key={character.id}
                onMouseEnter={() => setHoveredCharacter(character)}
                onMouseLeave={() => setHoveredCharacter(null)}
                onClick={() => handleCharacterSelect(character)}
                className="cursor-pointer transform transition-all duration-300 hover:scale-105"
                style={{
                  animationDelay: `${index * 200}ms`
                }}
              >
                <CharacterPreview 
                  character={character}
                  isActive={hoveredCharacter?.id === character.id}
                  className="h-full animate-slide-up"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Features */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-semibold text-gray-800 text-center mb-8">
            ✨ Amazing Features
          </h3>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-4 animate-bounce">🎭</div>
              <h3 className="font-semibold text-gray-800 mb-2">Dynamic Expressions</h3>
              <p className="text-sm text-gray-600">
                Characters show emotions and reactions based on your conversation
              </p>
            </div>
            
            <div className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-4 animate-pulse">🔊</div>
              <h3 className="font-semibold text-gray-800 mb-2">Voice Synthesis</h3>
              <p className="text-sm text-gray-600">
                High-quality TTS with character-specific voices and emotions
              </p>
            </div>
            
            <div className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-4 animate-spin" style={{ animationDuration: '3s' }}>✨</div>
              <h3 className="font-semibold text-gray-800 mb-2">Visual Effects</h3>
              <p className="text-sm text-gray-600">
                Beautiful animations and particle effects for each character
              </p>
            </div>
            
            <div className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-4 animate-glow">💾</div>
              <h3 className="font-semibold text-gray-800 mb-2">Smart Memory</h3>
              <p className="text-sm text-gray-600">
                Conversations are remembered and characters learn from your chats
              </p>
            </div>
          </div>
        </div>

        {/* Continue Previous Chat */}
        {currentCharacter && (
          <div className="mt-12 text-center">
            <div className="p-6 bg-blue-50 rounded-lg max-w-md mx-auto">
              <h3 className="font-semibold text-gray-800 mb-2">
                Continue Previous Chat
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                You have an ongoing conversation with {currentCharacter.name}
              </p>
              <Button
                onClick={() => navigate(`/chat/${currentCharacter.id}`)}
                className="w-full"
              >
                Continue Chat with {currentCharacter.name}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterPicker;