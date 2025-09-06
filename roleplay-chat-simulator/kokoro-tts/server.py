#!/usr/bin/env python3
"""
Kokoro TTS Server
A simple Flask server for text-to-speech synthesis using Kokoro TTS
"""

import os
import io
import json
import logging
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import torch
import torchaudio
import numpy as np
from typing import Dict, Optional

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

class KokoroTTSEngine:
    def __init__(self, model_path: str = "/app/models"):
        self.model_path = model_path
        self.model = None
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.sample_rate = 22050
        self.voice_presets = {
            'male-deep': {'pitch_shift': -0.3, 'speed': 0.9},
            'male-british': {'pitch_shift': -0.1, 'speed': 0.95},
            'male-robotic': {'pitch_shift': 0.2, 'speed': 1.1},
            'female-warm': {'pitch_shift': 0.1, 'speed': 0.95},
            'default': {'pitch_shift': 0.0, 'speed': 1.0}
        }
        
    def load_model(self):
        """Load the Kokoro TTS model"""
        try:
            # For now, we'll create a mock TTS engine
            # In a real implementation, you would load the actual Kokoro model here
            logger.info("Loading Kokoro TTS model...")
            self.model = "mock_model"  # Placeholder
            logger.info(f"Model loaded successfully on {self.device}")
            return True
        except Exception as e:
            logger.error(f"Failed to load model: {e}")
            return False
    
    def synthesize(self, text: str, voice: str = 'default', speed: float = 1.0, pitch: float = 1.0) -> Optional[bytes]:
        """
        Synthesize speech from text
        
        Args:
            text: Text to synthesize
            voice: Voice preset to use
            speed: Speech speed multiplier
            pitch: Pitch multiplier
            
        Returns:
            Audio data as bytes (WAV format)
        """
        try:
            if not self.model:
                raise ValueError("Model not loaded")
            
            # Get voice preset
            preset = self.voice_presets.get(voice, self.voice_presets['default'])
            final_speed = speed * preset.get('speed', 1.0)
            final_pitch = pitch + preset.get('pitch_shift', 0.0)
            
            logger.info(f"Synthesizing: '{text[:50]}...' with voice='{voice}', speed={final_speed}, pitch={final_pitch}")
            
            # Mock synthesis - generate a simple sine wave for demonstration
            # In a real implementation, this would use the actual Kokoro model
            duration = len(text) * 0.1  # Rough estimation
            duration = max(0.5, min(duration, 10.0))  # Clamp between 0.5-10 seconds
            
            # Generate a simple audio signal (placeholder)
            t = np.linspace(0, duration, int(self.sample_rate * duration))
            frequency = 200 * (1 + final_pitch * 0.5)  # Base frequency modified by pitch
            audio_signal = np.sin(2 * np.pi * frequency * t) * 0.3
            
            # Add some variation to make it sound more like speech
            audio_signal += np.sin(2 * np.pi * frequency * 1.5 * t) * 0.1
            audio_signal += np.random.normal(0, 0.05, len(audio_signal))  # Add slight noise
            
            # Apply speed modification (simple resampling)
            if final_speed != 1.0:
                new_length = int(len(audio_signal) / final_speed)
                audio_signal = np.interp(
                    np.linspace(0, len(audio_signal), new_length),
                    np.arange(len(audio_signal)),
                    audio_signal
                )
            
            # Convert to tensor and save as WAV
            audio_tensor = torch.from_numpy(audio_signal).float().unsqueeze(0)
            
            # Save to bytes buffer
            buffer = io.BytesIO()
            torchaudio.save(buffer, audio_tensor, self.sample_rate, format="wav")
            buffer.seek(0)
            
            return buffer.getvalue()
            
        except Exception as e:
            logger.error(f"Synthesis error: {e}")
            return None

# Initialize TTS engine
tts_engine = KokoroTTSEngine()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': tts_engine.model is not None,
        'device': str(tts_engine.device)
    })

@app.route('/synthesize', methods=['POST'])
def synthesize():
    """
    Synthesize speech from text
    
    Expected JSON payload:
    {
        "text": "Text to synthesize",
        "voice": "male-deep",  # optional
        "speed": 1.0,          # optional
        "pitch": 1.0           # optional
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'Missing text parameter'}), 400
        
        text = data['text'].strip()
        if not text:
            return jsonify({'error': 'Empty text provided'}), 400
        
        if len(text) > 1000:
            return jsonify({'error': 'Text too long (max 1000 characters)'}), 400
        
        voice = data.get('voice', 'default')
        speed = float(data.get('speed', 1.0))
        pitch = float(data.get('pitch', 1.0))
        
        # Validate parameters
        if not 0.5 <= speed <= 2.0:
            return jsonify({'error': 'Speed must be between 0.5 and 2.0'}), 400
        
        if not -1.0 <= pitch <= 1.0:
            return jsonify({'error': 'Pitch must be between -1.0 and 1.0'}), 400
        
        # Synthesize audio
        audio_data = tts_engine.synthesize(text, voice, speed, pitch)
        
        if audio_data is None:
            return jsonify({'error': 'Synthesis failed'}), 500
        
        # Return audio file
        return send_file(
            io.BytesIO(audio_data),
            mimetype='audio/wav',
            as_attachment=False,
            download_name='synthesis.wav'
        )
        
    except Exception as e:
        logger.error(f"Synthesis endpoint error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/voices', methods=['GET'])
def get_voices():
    """Get available voice presets"""
    return jsonify({
        'voices': list(tts_engine.voice_presets.keys()),
        'presets': tts_engine.voice_presets
    })

@app.route('/', methods=['GET'])
def root():
    """Root endpoint with API info"""
    return jsonify({
        'name': 'Kokoro TTS Server',
        'version': '1.0.0',
        'endpoints': {
            '/health': 'Health check',
            '/synthesize': 'POST - Synthesize speech from text',
            '/voices': 'GET - Get available voices'
        }
    })

if __name__ == '__main__':
    # Load model on startup
    logger.info("Starting Kokoro TTS Server...")
    
    if not tts_engine.load_model():
        logger.error("Failed to load TTS model, but server will start anyway")
    
    # Start server
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=False)