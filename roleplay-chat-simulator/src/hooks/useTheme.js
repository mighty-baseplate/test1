import { useMemo } from 'react';
import { getCharacterTheme } from '../data/characters';

export const useTheme = (character) => {
  const theme = useMemo(() => {
    if (!character) {
      return {
        primary: '#3b82f6',
        background: 'from-blue-50 to-indigo-100',
        textColor: 'text-blue-800',
        borderColor: 'border-blue-200',
        chatBubble: {
          user: 'bg-blue-500 text-white',
          ai: 'bg-white border-2 border-blue-200'
        },
        animations: {
          messageIn: 'animate-bounce-in',
          typing: 'animate-pulse',
          fadeIn: 'animate-fade-in'
        }
      };
    }

    const characterTheme = getCharacterTheme(character);
    
    return {
      primary: characterTheme.primary,
      background: characterTheme.background,
      textColor: characterTheme.textColor,
      borderColor: characterTheme.borderColor,
      chatBubble: {
        user: 'bg-blue-500 text-white',
        ai: `bg-white border-2 ${characterTheme.borderColor}`
      },
      animations: {
        messageIn: 'animate-bounce-in',
        typing: 'animate-pulse',
        fadeIn: 'animate-fade-in'
      },
      gradientClasses: {
        background: `bg-gradient-to-br ${characterTheme.background}`,
        card: `bg-gradient-to-r ${characterTheme.background}`,
        button: `bg-gradient-to-r from-${character.themeColor} to-${character.themeColor}`
      }
    };
  }, [character]);

  const applyTheme = useMemo(() => ({
    backgroundColor: theme.primary,
    '--theme-primary': theme.primary,
    '--theme-background': theme.background,
    '--theme-text': theme.textColor,
    '--theme-border': theme.borderColor
  }), [theme]);

  const getThemeClasses = useMemo(() => ({
    background: `bg-gradient-to-br ${theme.background}`,
    text: theme.textColor,
    border: theme.borderColor,
    primary: theme.primary
  }), [theme]);

  return {
    theme,
    applyTheme,
    getThemeClasses
  };
};