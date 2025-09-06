import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import CharacterPicker from './pages/CharacterPicker';
import ChatInterface from './pages/ChatInterface';
import FastChatInterface from './components/FastChatInterface';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<CharacterPicker />} />
              <Route path="/chat/:characterId" element={<ChatInterface />} />
              <Route path="/fast" element={<FastChatInterface />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;