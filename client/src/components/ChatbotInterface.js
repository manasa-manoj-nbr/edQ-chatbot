import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Mic, BookOpen, Goal, Gamepad, BarChart, CalendarCheck, Sun, Moon, ClipboardCopy } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast, Toaster } from 'sonner';

export default function ChatbotInterface() {

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m EdQ AI. Your AI Education Assistant. I\'m here to help you learn, answer questions, and provide explanations on various topics. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userid");
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const botReplyId = messages.length + 2;
      setMessages(prev => [
        ...prev,
        {
          id: botReplyId,
          type: 'bot',
          content: "",
          timestamp: new Date()
        }
      ]);

      const response = await fetch('https://edqueries.app.n8n.cloud/webhook/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question: inputMessage,
          userid: userId
        })
      });

      if (!response.body) throw new Error('No response body');
      const reader = response.body.getReader();
      let botReplyContent = "";
      const decoder = new TextDecoder();
      let done = false;
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const textChunk = decoder.decode(value, { stream: true }).trim();
          try {
            const parts = textChunk.split("\n").filter(line => line.trim());
            for (const part of parts) {
              const parsed = JSON.parse(part);
              if (parsed.type === "item" && parsed.content) {
                botReplyContent += parsed.content;
                setMessages(prev =>
                  prev.map(msg =>
                    msg.id === botReplyId ? { ...msg, content: botReplyContent } : msg
                  )
                );
              }
            }
          } catch (e) {
            console.warn("Non-JSON chunk:", textChunk);
          }
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Streaming error:", error);
      setMessages(prev => [
        ...prev,
        {
          id: messages.length + 2,
          type: 'bot',
          content: `Sorry, I couldn't get a response from the AI. Please try again. Error: ${error.message}`,
          timestamp: new Date()
        }
      ]);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const quickActions = [
    { icon: BookOpen, text: "List courses", action: () => setInputMessage("Show me available courses") },
    { icon: Gamepad, text: "Find", action: () => setInputMessage("Find a learning game for") },
    { icon: Goal, text: "Competencies", action: () => setInputMessage("Show competencies and badges") },
    { icon: CalendarCheck, text: "Learning Plan", action: () => setInputMessage("Show me my learning plan") },
    { icon: BarChart, text: "Course Completion", action: () => setInputMessage("Help me track my course progress") },
    { icon: BarChart, text: "Latest Games & Courses", action: () => setInputMessage("Show me the latest games and courses available") },
  ];

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Toaster position="bottom-center" />
      
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="rounded-lg">
              <img src='./logo.jpg' className="w-20 h-12 ml-8" alt='logo'></img>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">EdQ AI - Beta Version</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Your personal learning companion</p>
            </div>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${
              message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              message.type === 'user'
                ? 'bg-green-500 dark:bg-green-600'
                : 'bg-blue-500 dark:bg-blue-600'
            }`}>
              {message.type === 'user' ? (
                <User className="w-4 h-4 text-white" />
              ) : (
                <Bot className="w-4 h-4 text-white" />
              )}
            </div>
            <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
              message.type === 'user' ? 'text-right' : ''
            }`}>
              <div className={`rounded-2xl px-4 py-3 transition-colors duration-200 ${
                message.type === 'user'
                  ? 'bg-green-500 dark:bg-green-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm border border-gray-200 dark:border-gray-600'
              }`}>
                {message.content ? (
                  <ReactMarkdown
                    components={{
                      a: ({ node, ...props }) => (
                        <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-normal" />
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                ) : (
                  // Typing indicator for empty bot message
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex flex-row gap-4 justify-between">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {message.type === 'bot' && message.content && (
                  <button
                    className="flex mr-8 text-sm text-gray-500 hover:text-blue-600"
                    onClick={() => {
                      const plainText = message.content.replace(/<[^>]+>/g, '');
                      navigator.clipboard.writeText(plainText);
                      toast('Copied to clipboard!');
                    }}
                  >
                    <ClipboardCopy className="w-4 h-4 mr-1" />
                    Copy
                  </button>
                )}
                {message.type === 'user' && (
                  <button
                    className="flex text-sm text-gray-500 hover:text-blue-600"
                    onClick={() => {
                      const plainText = message.content.replace(/<[^>]+>/g, '');
                      navigator.clipboard.writeText(plainText);
                      toast('Copied to clipboard!');
                    }}
                  >
                    <ClipboardCopy className="w-4 h-4 mr-1" />
                  </button>
                )}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-6 py-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Quick actions to get started:</p>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="flex items-center space-x-2 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 transition-colors duration-200"
            >
              <action.icon className="w-4 h-4" />
              <span>{action.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4 transition-colors duration-300">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your studies..."
              rows="1"
              className="w-full resize-none border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors duration-200"
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg p-3 transition-colors duration-200"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          EdQ AI can make mistakes, so double-check it
        </p>
      </div>
    </div>
  );
}
