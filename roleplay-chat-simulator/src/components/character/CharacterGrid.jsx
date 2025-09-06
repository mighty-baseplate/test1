import React from 'react';
import { clsx } from 'clsx';
import CharacterCard from './CharacterCard';

const CharacterGrid = ({ 
  characters = [], 
  onCharacterSelect, 
  selectedCharacterId,
  className = ''
}) => {
  return (
    <div className={clsx(
      'grid gap-6',
      'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      'max-w-6xl mx-auto',
      className
    )}>
      {characters.map((character) => (
        <CharacterCard
          key={character.id}
          character={character}
          onSelect={onCharacterSelect}
          isSelected={selectedCharacterId === character.id}
          className="animate-slide-up"
          style={{
            animationDelay: `${characters.indexOf(character) * 100}ms`
          }}
        />
      ))}
    </div>
  );
};

export default CharacterGrid;