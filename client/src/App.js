import React from 'react';
import ChatbotInterface from './components/ChatbotInterface';
import './index.css';
import { Toaster } from 'sonner';
function App() {
  return (
    <div className="App">
          <ChatbotInterface />
          <Toaster position="bottom-center" />
    </div>
  );
}

export default App;