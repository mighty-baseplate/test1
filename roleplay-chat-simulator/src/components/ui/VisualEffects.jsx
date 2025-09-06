import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';

const VisualEffects = ({ character, isActive = false, className = '' }) => {
  const [effects, setEffects] = useState([]);

  // Generate floating particles
  useEffect(() => {
    if (!isActive || !character?.visualEffects) return;

    const generateEffect = () => {
      const newEffect = {
        id: Math.random(),
        type: character.visualEffects.background,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 10,
        duration: Math.random() * 4000 + 3000,
        delay: Math.random() * 1000
      };

      setEffects(prev => [...prev.slice(-10), newEffect]); // Keep only last 10 effects
    };

    const interval = setInterval(generateEffect, 1500);
    return () => clearInterval(interval);
  }, [character, isActive]);

  // Clean up old effects
  useEffect(() => {
    const cleanup = setTimeout(() => {
      setEffects(prev => prev.slice(-5));
    }, 10000);
    
    return () => clearTimeout(cleanup);
  }, [effects]);

  const getEffectComponent = (effect) => {
    switch (effect.type) {
      case 'magical-sparkles':
        return (
          <div
            key={effect.id}
            className="absolute pointer-events-none"
            style={{
              left: `${effect.x}%`,
              top: `${effect.y}%`,
              animationDelay: `${effect.delay}ms`,
              animationDuration: `${effect.duration}ms`
            }}
          >
            <div className="relative">
              <span className="text-yellow-400 animate-ping text-lg">✨</span>
              <span className="absolute inset-0 text-yellow-300 animate-pulse text-lg">⭐</span>
            </div>
          </div>
        );

      case 'detective-notes':
        return (
          <div
            key={effect.id}
            className="absolute pointer-events-none opacity-20"
            style={{
              left: `${effect.x}%`,
              top: `${effect.y}%`,
              animationDelay: `${effect.delay}ms`,
              animationDuration: `${effect.duration}ms`,
              fontSize: `${effect.size}px`
            }}
          >
            <div className="text-blue-600 animate-float">
              {['🔍', '📝', '💡', '🔎', '📋'][Math.floor(Math.random() * 5)]}
            </div>
          </div>
        );

      case 'cosmic-waves':
        return (
          <div
            key={effect.id}
            className="absolute pointer-events-none"
            style={{
              left: `${effect.x}%`,
              top: `${effect.y}%`,
              animationDelay: `${effect.delay}ms`,
              animationDuration: `${effect.duration}ms`
            }}
          >
            <div className="relative">
              <span className="text-green-400 animate-spin text-lg">🌟</span>
              <span className="absolute inset-0 text-cyan-400 animate-pulse text-lg">🚀</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={clsx('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      {effects.map(getEffectComponent)}
      
      {/* Character-specific background patterns */}
      {character?.visualEffects?.background === 'magical-sparkles' && (
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-300 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-amber-300 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>
      )}
      
      {character?.visualEffects?.background === 'detective-notes' && (
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-blue-300 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/3 w-28 h-28 bg-indigo-300 rounded-full blur-2xl animate-pulse delay-2000"></div>
        </div>
      )}
      
      {character?.visualEffects?.background === 'cosmic-waves' && (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/3 left-1/5 w-36 h-36 bg-green-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-cyan-400 rounded-full blur-2xl animate-pulse delay-1500"></div>
          <div className="absolute top-1/2 right-1/6 w-20 h-20 bg-emerald-400 rounded-full blur-xl animate-pulse delay-3000"></div>
        </div>
      )}
    </div>
  );
};

export default VisualEffects;