import { useState, useEffect, useCallback, useRef } from 'react';
import { useApp } from '../context/AppContext';

export const useTTS = () => {
  const { state } = useApp();
  const { settings } = state;
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const currentUtteranceRef = useRef(null);
  const kokoroServiceRef = useRef(null);

  // Check for TTS support
  useEffect(() => {
    const checkSupport = () => {
      const webSpeechSupport = 'speechSynthesis' in window;
      const kokoroUrl = import.meta.env.VITE_KOKORO_TTS_URL;
      setIsSupported(webSpeechSupport || !!kokoroUrl);
    };

    checkSupport();
  }, []);

  // Initialize Kokoro TTS service
  useEffect(() => {
    const kokoroUrl = import.meta.env.VITE_KOKORO_TTS_URL;
    if (kokoroUrl) {
      kokoroServiceRef.current = {
        baseUrl: kokoroUrl,
        async synthesize(text, voiceSettings = {}) {
          try {
            const response = await fetch(`${kokoroUrl}/synthesize`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                text,
                voice: voiceSettings.voice || 'male-deep',
                speed: voiceSettings.rate || 1.0,
                pitch: voiceSettings.pitch || 1.0
              })
            });

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const audioBlob = await response.blob();
            return audioBlob;
          } catch (error) {
            console.error('Kokoro TTS error:', error);
            throw error;
          }
        }
      };
    }
  }, []);

  const speakWithKokoro = useCallback(async (text, voiceSettings = {}) => {
    if (!kokoroServiceRef.current) return false;

    try {
      setIsLoading(true);
      setIsSpeaking(true);

      const audioBlob = await kokoroServiceRef.current.synthesize(text, voiceSettings);
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audio.onended = () => {
        setIsSpeaking(false);
        setIsLoading(false);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setIsSpeaking(false);
        setIsLoading(false);
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
      return true;
    } catch (error) {
      console.error('Kokoro TTS playback error:', error);
      setIsSpeaking(false);
      setIsLoading(false);
      return false;
    }
  }, []);

  const speakWithWebAPI = useCallback((text, voiceSettings = {}) => {
    if (!('speechSynthesis' in window) || !text) return false;

    try {
      // Cancel any ongoing speech
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = voiceSettings.rate || 0.9;
      utterance.pitch = voiceSettings.pitch || 1.0;
      utterance.volume = 0.8;

      // Try to select appropriate voice
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        // Find voice based on voiceSettings.voice preference
        let selectedVoice = voices.find(voice => 
          voice.lang.startsWith('en') && voice.name.toLowerCase().includes('male')
        );
        
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => voice.lang.startsWith('en'));
        }
        
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        currentUtteranceRef.current = utterance;
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        currentUtteranceRef.current = null;
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        setIsSpeaking(false);
        currentUtteranceRef.current = null;
      };

      speechSynthesis.speak(utterance);
      return true;
    } catch (error) {
      console.error('Web Speech API error:', error);
      setIsSpeaking(false);
      return false;
    }
  }, []);

  const speak = useCallback(async (text, character) => {
    if (!text || !settings.ttsEnabled || !isSupported) return;

    const voiceSettings = character?.voiceSettings || {};

    // Try Kokoro TTS first if available
    if (kokoroServiceRef.current) {
      const kokoroSuccess = await speakWithKokoro(text, voiceSettings);
      if (kokoroSuccess) return;
    }

    // Fallback to Web Speech API
    speakWithWebAPI(text, voiceSettings);
  }, [settings.ttsEnabled, isSupported, speakWithKokoro, speakWithWebAPI]);

  const stop = useCallback(() => {
    try {
      // Stop Web Speech API
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
      
      // Stop any audio elements (for Kokoro TTS)
      const audioElements = document.querySelectorAll('audio');
      audioElements.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });

      setIsSpeaking(false);
      setIsLoading(false);
      currentUtteranceRef.current = null;
    } catch (error) {
      console.error('Error stopping TTS:', error);
    }
  }, []);

  const toggle = useCallback(() => {
    if (isSpeaking) {
      stop();
    }
  }, [isSpeaking, stop]);

  // Auto-speak new AI messages
  useEffect(() => {
    const lastMessage = state.messages[state.messages.length - 1];
    if (
      lastMessage && 
      lastMessage.sender === 'ai' && 
      settings.ttsEnabled &&
      !isSpeaking
    ) {
      // Small delay to ensure message is rendered
      setTimeout(() => {
        speak(lastMessage.text, state.currentCharacter);
      }, 500);
    }
  }, [state.messages, settings.ttsEnabled, speak, state.currentCharacter, isSpeaking]);

  return {
    isSupported,
    isSpeaking,
    isLoading,
    speak,
    stop,
    toggle
  };
};