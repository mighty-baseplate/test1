# 🎭 Roleplay Chat Simulator

An immersive web application that lets you chat with AI-powered fictional characters. Each character has their own unique personality, speaking style, and themed interface. Built with React, Tailwind CSS, and powered by Google Gemini AI.

## ✨ Features

- **🎭 Character Selection**: Choose from unique characters including Gandalf the Grey, Sherlock Holmes, and Zyx the Alien DJ
- **🤖 AI-Powered Conversations**: Realistic character interactions using Google Gemini AI
- **🔊 Voice Output**: Text-to-speech with character-specific voice settings (supports both Web Speech API and Kokoro TTS)
- **🎨 Dynamic Theming**: Each character has their own color scheme and visual theme
- **📱 Responsive Design**: Fully optimized for desktop, tablet, and mobile devices
- **💾 Chat History**: Conversations are automatically saved and can be resumed later
- **🎬 Smooth Animations**: Polished UI with bounce-in animations and typing indicators
- **⚡ Fast Performance**: Built with Vite for lightning-fast development and production builds

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini API key
- (Optional) Docker for Kokoro TTS

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd roleplay-chat-simulator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_KOKORO_TTS_URL=http://localhost:8080
   VITE_API_PROVIDER=gemini
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔑 API Setup

### Google Gemini API

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file as `VITE_GEMINI_API_KEY`

### Kokoro TTS (Optional)

For enhanced voice synthesis, you can set up Kokoro TTS with Docker:

1. **Start the TTS service**
   ```bash
   docker-compose up kokoro-tts -d
   ```

2. **Verify it's running**
   ```bash
   curl http://localhost:8080/health
   ```

The application will automatically use Kokoro TTS if available, otherwise it falls back to the Web Speech API.

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── chat/            # Chat-specific components
│   ├── character/       # Character selection components
│   └── ErrorBoundary.jsx
├── pages/
│   ├── CharacterPicker.jsx
│   └── ChatInterface.jsx
├── hooks/               # Custom React hooks
├── context/             # React Context for state management
├── services/            # API integration services
├── utils/               # Helper functions and constants
└── data/                # Character definitions and static data
```

## 🎭 Characters

### Gandalf the Grey 🧙‍♂️
- **Personality**: Wise wizard with poetic speech and ancient knowledge
- **Theme**: Gold and amber tones
- **Voice**: Deep, measured speech with archaic language

### Sherlock Holmes 🕵️‍♂️
- **Personality**: Brilliant detective with sharp deductive reasoning
- **Theme**: Classic blue tones
- **Voice**: Precise Victorian English with analytical observations

### Zyx the Alien DJ 👽
- **Personality**: Intergalactic music mixer with cosmic vibes
- **Theme**: Vibrant green with space aesthetics
- **Voice**: Upbeat and modern with futuristic slang

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

### Adding New Characters

1. **Define the character** in `src/data/characters.js`:
   ```javascript
   {
     id: 'new-character',
     name: 'Character Name',
     avatar: '🎭',
     personality: 'Brief personality description',
     description: 'Longer character description',
     themeColor: '#FF6B6B',
     backgroundColor: 'from-red-50 to-pink-100',
     textColor: 'text-red-800',
     borderColor: 'border-red-200',
     prompt: 'System prompt for AI behavior...',
     voiceSettings: {
       rate: 1.0,
       pitch: 1.0,
       voice: 'character-voice-type'
     }
   }
   ```

2. **Add theme colors** to `tailwind.config.js` if needed

3. **Test the character** in the application

### Customizing Themes

Each character's theme is defined in their character object. You can customize:

- `themeColor`: Primary color for buttons and accents
- `backgroundColor`: Gradient background classes
- `textColor`: Text color classes
- `borderColor`: Border color classes

## 🐳 Docker Deployment

### Full Stack with Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Access the application
open http://localhost:3000
```

### React App Only

```bash
# Build the Docker image
docker build -t roleplay-chat .

# Run the container
docker run -p 3000:3000 roleplay-chat
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_GEMINI_API_KEY` | Google Gemini API key | Required |
| `VITE_KOKORO_TTS_URL` | Kokoro TTS service URL | `http://localhost:8080` |
| `VITE_API_PROVIDER` | AI provider to use | `gemini` |
| `VITE_APP_NAME` | Application name | `Roleplay Chat Simulator` |

### Features Toggle

- **TTS**: Toggle voice output in the chat interface
- **Auto Scroll**: Automatically scroll to new messages
- **Chat History**: Conversations are saved in localStorage

## 📱 Mobile Support

The application is fully responsive and optimized for mobile devices:

- Touch-friendly interface
- Responsive character grid
- Mobile-optimized chat interface
- Virtual keyboard handling
- Gesture support

## 🎯 Performance

- **Bundle Size**: Optimized with code splitting
- **Loading**: Fast initial load with Vite
- **Caching**: Static assets cached with service worker
- **API**: Efficient API calls with error handling
- **Memory**: Proper cleanup and memory management

## 🔒 Security

- **API Keys**: Stored in environment variables
- **Input Sanitization**: User input is sanitized
- **XSS Protection**: React's built-in XSS protection
- **CORS**: Properly configured for API calls

## 🐛 Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Verify your Gemini API key is correct
   - Check that the API key has proper permissions
   - Ensure the key is set in the `.env` file

2. **Voice Not Working**
   - Check browser compatibility for Web Speech API
   - Verify Kokoro TTS service is running (if using Docker)
   - Enable microphone permissions for voice input

3. **Character Not Loading**
   - Check browser console for errors
   - Verify character ID in URL matches character data
   - Clear browser cache and localStorage

4. **Build Errors**
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again
   - Check Node.js version compatibility

### Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Web Speech API**: Chrome, Edge, Safari (limited Firefox support)
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for powering the character conversations
- **Kokoro TTS** for high-quality voice synthesis
- **Tailwind CSS** for the beautiful styling system
- **Lucide React** for the icon set
- **Vite** for the fast build system

---

**Made with ❤️ for immersive roleplay experiences**