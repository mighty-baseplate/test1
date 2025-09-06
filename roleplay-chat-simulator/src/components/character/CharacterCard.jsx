import React from 'react';
import { clsx } from 'clsx';
import Card from '../ui/Card';
import CharacterAvatar from '../ui/CharacterAvatar';

const CharacterCard = ({ 
  character, 
  onSelect, 
  isSelected = false,
  className = ''
}) => {
  const { id, name, avatar, personality, description, themeColor } = character;

  const handleClick = () => {
    onSelect(character);
  };

  return (
    <Card
      hover={true}
      onClick={handleClick}
      className={clsx(
        'character-card relative overflow-hidden transition-all duration-300',
        isSelected && 'ring-4 ring-blue-400 ring-opacity-50',
        className
      )}
      style={{
        '--theme-color': themeColor
      }}
    >
      {/* Background gradient overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          background: `linear-gradient(135deg, ${themeColor}20, transparent)`
        }}
      />
      
      <div className="relative z-10">
        {/* Character Avatar */}
        <div className="flex justify-center mb-4">
          <CharacterAvatar 
            character={character}
            size="3xl"
            showAnimation={true}
            className="ring-4 ring-white shadow-lg hover:ring-8 transition-all duration-300"
          />
        </div>
        
        {/* Character Info */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {name}
          </h3>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {personality}
          </p>
          
          <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
            {description}
          </p>
        </div>
        
        {/* Theme color indicator */}
        <div 
          className="absolute top-3 right-3 w-3 h-3 rounded-full shadow-sm"
          style={{ backgroundColor: themeColor }}
          title={`Theme color: ${themeColor}`}
        />
        
        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </Card>
  );
};

export default CharacterCard;