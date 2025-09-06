import React from 'react';
import { useNavigate } from 'react-router-dom';
import { characters } from '../data/characters';
import { useChat } from '../hooks/useChat';
import CharacterGrid from '../components/character/CharacterGrid';
import Button from '../components/ui/Button';
import { Sparkles, MessageCircle } from 'lucide-react';

const CharacterPicker = () => {
  const navigate = useNavigate();
  const { selectCharacter, currentCharacter } = useChat();

  const handleCharacterSelect = (character) => {
    selectCharacter(character);
    // Small delay for animation before navigation
    setTimeout(() => {
      navigate(`/chat/${character.id}`);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
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
          
          <CharacterGrid
            characters={characters}
            onCharacterSelect={handleCharacterSelect}
            selectedCharacterId={currentCharacter?.id}
          />
        </div>

        {/* Features */}
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="text-3xl mb-3">🎭</div>
              <h3 className="font-semibold text-gray-800 mb-2">Immersive Roleplay</h3>
              <p className="text-sm text-gray-600">
                Each character stays true to their personality and speaking style
              </p>
            </div>
            
            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="text-3xl mb-3">🔊</div>
              <h3 className="font-semibold text-gray-800 mb-2">Voice Output</h3>
              <p className="text-sm text-gray-600">
                Optional text-to-speech with character-specific voice settings
              </p>
            </div>
            
            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="text-3xl mb-3">💾</div>
              <h3 className="font-semibold text-gray-800 mb-2">Chat History</h3>
              <p className="text-sm text-gray-600">
                Your conversations are saved and can be continued later
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