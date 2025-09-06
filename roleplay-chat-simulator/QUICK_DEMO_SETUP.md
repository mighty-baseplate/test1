# ⚡ Quick Demo Setup - Fastest Response Time

## 🚀 **For Judges & Quick Testing**

This optimized setup gives you the **fastest possible response time** for demonstrations.

## 📋 **Quick Setup (2 minutes)**

### 1. **Install Dependencies**
```bash
cd /workspace/roleplay-chat-simulator
npm install
```

### 2. **Set Up Gemini API Key**
```bash
# Edit .env file
VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
VITE_API_PROVIDER=gemini
```

### 3. **Start Kokoro TTS (Optional but Recommended)**
```bash
# In a separate terminal
docker-compose up kokoro-tts -d
```

### 4. **Run the App**
```bash
npm run dev
```

### 5. **Access Fast Demo Mode**
- Open: `http://localhost:5173/fast`
- Or click "⚡ Fast Demo Mode" button on homepage

## ⚡ **Optimizations Applied**

### **Gemini API Optimizations**
- ✅ **Pre-warmed model** (eliminates cold start delay)
- ✅ **Reduced token limits** (200 tokens max for faster generation)
- ✅ **Lower temperature** (0.7 for faster, more focused responses)
- ✅ **Simplified prompts** (shorter prompts = faster processing)
- ✅ **Reduced safety checks** (BLOCK_ONLY_HIGH for speed)

### **Kokoro TTS Optimizations**
- ✅ **Audio caching** (repeated phrases use cached audio)
- ✅ **Concurrent processing** (TTS starts while text is displaying)
- ✅ **Connection pre-testing** (knows if Kokoro is available instantly)
- ✅ **Web Speech fallback** (automatic fallback if Kokoro unavailable)
- ✅ **Faster voice settings** (1.1-1.2x speed for demo)

### **UI Optimizations**
- ✅ **Minimal visual effects** (reduced animations for speed)
- ✅ **Instant feedback** (user message appears immediately)
- ✅ **Response time display** (shows actual milliseconds)
- ✅ **Single-page interface** (no routing delays)

## 🎯 **Expected Performance**

### **With Good Internet & Kokoro TTS:**
- **Text Response**: 500-1500ms
- **Audio Generation**: 200-800ms  
- **Total Time**: ~1-2 seconds

### **With Web Speech Fallback:**
- **Text Response**: 500-1500ms
- **Audio Playback**: Instant
- **Total Time**: ~1 second

### **Slow System Optimizations:**
- Model pre-warming eliminates cold starts
- Audio caching reduces repeated generation
- Simplified prompts reduce processing time
- Concurrent audio processing improves perceived speed

## 🎮 **Demo Usage**

### **Quick Test Messages:**
1. **"Hello!"** - Tests basic greeting response
2. **"What's your wisdom?"** - Tests character personality  
3. **"Tell me something amazing"** - Tests longer response
4. **"How are you?"** - Tests cached/repeated patterns

### **Character Comparison:**
- **Gandalf**: Wise, slower speech (0.8x speed)
- **Sherlock**: Analytical, normal speech (0.9x speed)  
- **Alien DJ**: Energetic, faster speech (1.2x speed)

## 🔧 **Troubleshooting**

### **If Responses Are Slow:**
1. Check internet connection
2. Verify Gemini API key is valid
3. Try the Web Speech fallback (disable Kokoro)

### **If Audio Doesn't Work:**
1. Check if Kokoro TTS is running: `curl http://localhost:8080/health`
2. Enable browser audio permissions
3. Try different browser (Chrome recommended)

### **If Kokoro TTS Fails:**
- App automatically falls back to Web Speech API
- No action needed, audio will still work

## 📊 **Performance Monitoring**

The interface shows:
- **Response time** in milliseconds
- **Processing status** (Gemini API → TTS)
- **Error messages** if something fails
- **Audio status** (Kokoro vs Web Speech)

## 🎯 **For Judges:**

1. **Navigate to**: `http://localhost:5173/fast`
2. **Select any character**
3. **Type a message** and press "Send Fast"
4. **Watch the response time** displayed in the header
5. **Listen to the audio** output

**Expected demo flow**: Type → 1-2 seconds → Text + Audio response

This optimized setup prioritizes **speed over visual effects** for the best demonstration experience! ⚡