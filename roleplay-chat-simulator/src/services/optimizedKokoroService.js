class OptimizedKokoroService {
  constructor() {
    this.baseUrl = import.meta.env.VITE_KOKORO_TTS_URL || 'http://localhost:8080';
    this.isAvailable = false;
    this.audioCache = new Map(); // Cache for repeated phrases
    this.maxCacheSize = 50;
    
    // Test connection on startup
    this.testConnection();
  }

  async testConnection() {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        timeout: 2000 // Quick timeout
      });
      
      if (response.ok) {
        this.isAvailable = true;
        console.log('✅ Kokoro TTS is available and ready');
      }
    } catch (error) {
      console.warn('⚠️ Kokoro TTS not available, will use Web Speech API fallback');
      this.isAvailable = false;
    }
  }

  // Get optimized voice settings for each character
  getVoiceSettings(character) {
    const voiceMap = {
      gandalf: {
        voice: 'male-deep',
        speed: 1.0, // Slightly faster for demo
        pitch: 0.8
      },
      sherlock: {
        voice: 'male-british',
        speed: 1.1, // Faster for quick demo
        pitch: 0.9
      },
      'alien-dj': {
        voice: 'male-robotic',
        speed: 1.2, // Fastest for energetic character
        pitch: 1.1
      }
    };

    return voiceMap[character?.id] || voiceMap.gandalf;
  }

  // Generate cache key for audio caching
  getCacheKey(text, voiceSettings) {
    return `${text.slice(0, 50)}_${voiceSettings.voice}_${voiceSettings.speed}`;
  }

  async synthesizeFast(text, character) {
    const startTime = Date.now();
    
    if (!this.isAvailable) {
      console.log('📢 Using Web Speech API fallback');
      return this.fallbackToWebSpeech(text, character);
    }

    try {
      const voiceSettings = this.getVoiceSettings(character);
      const cacheKey = this.getCacheKey(text, voiceSettings);
      
      // Check cache first
      if (this.audioCache.has(cacheKey)) {
        console.log('⚡ Using cached audio');
        return this.audioCache.get(cacheKey);
      }

      console.log('🎵 Generating audio with Kokoro TTS...');
      
      const response = await fetch(`${this.baseUrl}/synthesize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.slice(0, 300), // Limit text length for speed
          voice: voiceSettings.voice,
          speed: voiceSettings.speed,
          pitch: voiceSettings.pitch
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const responseTime = Date.now() - startTime;
      console.log(`⚡ Kokoro TTS generated audio in ${responseTime}ms`);

      // Cache the result
      if (this.audioCache.size >= this.maxCacheSize) {
        // Remove oldest entry
        const firstKey = this.audioCache.keys().next().value;
        this.audioCache.delete(firstKey);
      }
      this.audioCache.set(cacheKey, audioUrl);

      return audioUrl;

    } catch (error) {
      console.error('❌ Kokoro TTS error:', error);
      console.log('📢 Falling back to Web Speech API');
      return this.fallbackToWebSpeech(text, character);
    }
  }

  fallbackToWebSpeech(text, character) {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      try {
        const utterance = new SpeechSynthesisUtterance(text);
        const voiceSettings = this.getVoiceSettings(character);
        
        utterance.rate = voiceSettings.speed;
        utterance.pitch = voiceSettings.pitch;
        utterance.volume = 0.8;

        // Try to find a suitable voice
        const voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
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

        utterance.onend = () => {
          resolve('web-speech-api');
        };

        utterance.onerror = (event) => {
          reject(new Error(`Speech synthesis error: ${event.error}`));
        };

        speechSynthesis.speak(utterance);
        console.log('📢 Using Web Speech API');

      } catch (error) {
        reject(error);
      }
    });
  }

  // Play audio with minimal delay
  async playAudio(audioUrl) {
    if (audioUrl === 'web-speech-api') {
      return; // Already playing via Web Speech API
    }

    try {
      const audio = new Audio(audioUrl);
      audio.preload = 'auto';
      
      // Start playing as soon as possible
      audio.addEventListener('canplay', () => {
        audio.play().catch(error => {
          console.error('Audio play error:', error);
        });
      });

      return new Promise((resolve, reject) => {
        audio.addEventListener('ended', resolve);
        audio.addEventListener('error', reject);
      });

    } catch (error) {
      console.error('Audio playback error:', error);
      throw error;
    }
  }

  // Combined synthesize and play for fastest experience
  async synthesizeAndPlay(text, character) {
    const startTime = Date.now();
    
    try {
      const audioUrl = await this.synthesizeFast(text, character);
      await this.playAudio(audioUrl);
      
      const totalTime = Date.now() - startTime;
      console.log(`🎵 Total audio time: ${totalTime}ms`);
      
      return { success: true, totalTime };
    } catch (error) {
      console.error('Synthesize and play error:', error);
      return { success: false, error: error.message };
    }
  }

  // Clear cache to free memory
  clearCache() {
    this.audioCache.forEach(url => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    this.audioCache.clear();
  }
}

export default OptimizedKokoroService;