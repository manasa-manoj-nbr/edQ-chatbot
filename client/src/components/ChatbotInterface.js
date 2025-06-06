// import React, { useState, useRef, useEffect } from 'react';
// import { Send, Book, User, Bot, MessageCircle, Lightbulb, HelpCircle, Sun, Moon } from 'lucide-react';

// export default function ChatbotInterface() {
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       type: 'bot',
//       content: 'Hello! I\'m your AI Education Assistant. I\'m here to help you learn, answer questions, and provide explanations on various topics. How can I assist you today?',
//       timestamp: new Date()
//     }
//   ]);
//   const [inputMessage, setInputMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Load dark mode preference from localStorage
//   useEffect(() => {
//     const savedTheme = localStorage.getItem('theme');
//     if (savedTheme) {
//       setIsDarkMode(savedTheme === 'dark');
//     } else {
//       // Check system preference
//       setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
//     }
//   }, []);

//   // Save theme preference and apply to document
//   useEffect(() => {
//     localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
//     if (isDarkMode) {
//       document.documentElement.classList.add('dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//     }
//   }, [isDarkMode]);

//   const handleSendMessage = async () => {
//     if (!inputMessage.trim()) return;

//     const userMessage = {
//       id: messages.length + 1,
//       type: 'user',
//       content: inputMessage,
//       timestamp: new Date()
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setInputMessage('');
//     setIsLoading(true);

//     // Simulate AI response (replace with actual API call)
//     setTimeout(() => {
//       const botResponse = {
//         id: messages.length + 2,
//         type: 'bot',
//         content: generateEducationalResponse(inputMessage),
//         timestamp: new Date()
//       };
//       setMessages(prev => [...prev, botResponse]);
//       setIsLoading(false);
//     }, 1500);
//   };

//   const generateEducationalResponse = (question) => {
//     const responses = [
//       "That's a great question! Let me break this down for you step by step...",
//       "I'd be happy to explain this concept. Here's what you need to know...",
//       "This is an interesting topic. Let me provide you with a comprehensive explanation...",
//       "Excellent question! This relates to several important concepts. Let me explain...",
//       "I can help you understand this better. Here's a detailed explanation..."
//     ];
//     return responses[Math.floor(Math.random() * responses.length)] + " [This is a demo response. In a real application, this would connect to an AI service.]";
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const toggleTheme = () => {
//     setIsDarkMode(!isDarkMode);
//   };

//   const quickActions = [
//     { icon: Book, text: "Explain a concept", action: () => setInputMessage("Can you explain...") },
//     { icon: HelpCircle, text: "Ask a question", action: () => setInputMessage("I have a question about...") },
//     { icon: Lightbulb, text: "Get study tips", action: () => setInputMessage("Give me study tips for...") }
//   ];

//   return (
//     <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
//       {/* Header */}
//       <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-colors duration-300">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-3">
//             <div className="bg-blue-600 dark:bg-blue-500 p-2 rounded-lg">
//               <MessageCircle className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">EduBot AI Assistant</h1>
//               <p className="text-sm text-gray-600 dark:text-gray-400">Your personal learning companion</p>
//             </div>
//           </div>
          
//           {/* Theme Toggle */}
//           <button
//             onClick={toggleTheme}
//             className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
//             aria-label="Toggle theme"
//           >
//             {isDarkMode ? (
//               <Sun className="w-5 h-5 text-yellow-500" />
//             ) : (
//               <Moon className="w-5 h-5 text-gray-600" />
//             )}
//           </button>
//         </div>
//       </div>

//       {/* Messages Container */}
//       <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
//         {messages.map((message) => (
//           <div
//             key={message.id}
//             className={`flex items-start space-x-3 ${
//               message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
//             }`}
//           >
//             <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
//               message.type === 'user'
//                 ? 'bg-green-500 dark:bg-green-600'
//                 : 'bg-blue-500 dark:bg-blue-600'
//             }`}>
//               {message.type === 'user' ? (
//                 <User className="w-4 h-4 text-white" />
//               ) : (
//                 <Bot className="w-4 h-4 text-white" />
//               )}
//             </div>
//             <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
//               message.type === 'user' ? 'text-right' : ''
//             }`}>
//               <div className={`rounded-2xl px-4 py-3 transition-colors duration-200 ${
//                 message.type === 'user'
//                   ? 'bg-green-500 dark:bg-green-600 text-white'
//                   : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm border border-gray-200 dark:border-gray-600'
//               }`}>
//                 <p className="text-sm leading-relaxed">{message.content}</p>
//               </div>
//               <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                 {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//               </p>
//             </div>
//           </div>
//         ))}
        
//         {isLoading && (
//           <div className="flex items-start space-x-3">
//             <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 dark:bg-blue-600 flex items-center justify-center">
//               <Bot className="w-4 h-4 text-white" />
//             </div>
//             <div className="bg-white dark:bg-gray-700 rounded-2xl px-4 py-3 shadow-sm border border-gray-200 dark:border-gray-600 transition-colors duration-200">
//               <div className="flex space-x-1">
//                 <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
//                 <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
//                 <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
//               </div>
//             </div>
//           </div>
//         )}
        
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Quick Actions */}
//       {messages.length === 1 && (
//         <div className="px-6 py-4">
//           <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Quick actions to get started:</p>
//           <div className="flex flex-wrap gap-2">
//             {quickActions.map((action, index) => (
//               <button
//                 key={index}
//                 onClick={action.action}
//                 className="flex items-center space-x-2 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 transition-colors duration-200"
//               >
//                 <action.icon className="w-4 h-4" />
//                 <span>{action.text}</span>
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Input Area */}
//       <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4 transition-colors duration-300">
//         <div className="flex items-end space-x-3">
//           <div className="flex-1">
//             <textarea
//               value={inputMessage}
//               onChange={(e) => setInputMessage(e.target.value)}
//               onKeyPress={handleKeyPress}
//               placeholder="Ask me anything about your studies..."
//               rows="1"
//               className="w-full resize-none border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors duration-200"
//               style={{ minHeight: '44px', maxHeight: '120px' }}
//             />
//           </div>
//           <button
//             onClick={handleSendMessage}
//             disabled={!inputMessage.trim() || isLoading}
//             className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg p-3 transition-colors duration-200"
//           >
//             <Send className="w-5 h-5" />
//           </button>
//         </div>
//         <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
//           Press Enter to send, Shift+Enter for new line
//         </p>
//       </div>
//     </div>
//   );
// }


// src/components/EnhancedChatbotInterface.js
import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Book, User, Bot, MessageCircle, Lightbulb, HelpCircle, 
  Sun, Moon, ExternalLink, BookOpen, Award, TrendingUp, Settings 
} from 'lucide-react';

export default function ChatbotInterface() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your AI Education Assistant with direct access to your Moodle courses. I can help you discover courses, check your progress, and create personalized learning plans. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userContext, setUserContext] = useState(null);
  const [moodleLinks, setMoodleLinks] = useState([]);
  const [userId, setUserId] = useState('1'); // In real app, get from auth
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load theme and user data
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    
    // Load user courses on component mount
    loadUserCourses();
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const loadUserCourses = async () => {
    try {
      const response = await fetch(`/api/courses/${userId}`);
      const courses = await response.json();
      setUserContext({ courses });
    } catch (error) {
      console.error('Failed to load courses:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

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
      // Send to backend API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          userid: userId
        })
      });

      const data = await response.json();
      
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: data.response,
        timestamp: new Date(),
        moodleLinks: data.moodleLinks
      };

      setMessages(prev => [...prev, botResponse]);
      setUserContext(data.userContext);
      setMoodleLinks(data.moodleLinks || []);

    } catch (error) {
      console.error('Chat error:', error);
      const errorResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
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

  const checkSubscription = async (subject) => {
    try {
      const response = await fetch(`/api/subscription/${userId}/${subject}`);
      const data = await response.json();
      
      if (data.hasAccess) {
        const message = `Great! You have access to ${subject}. Let me show you the available courses.`;
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'bot',
          content: message,
          timestamp: new Date()
        }]);
      } else {
        const message = `You don't currently have access to ${subject}. Click here to subscribe: ${data.purchaseUrl}`;
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'bot',
          content: message,
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('Subscription check error:', error);
    }
  };

  const generateLearningPlan = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/learning-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userid: userId,
          targetCompetencies: ['mathematics', 'english', 'science'] // Example
        })
      });

      const data = await response.json();
      
      const planMessage = {
        id: Date.now(),
        type: 'bot',
        content: `Here's your personalized learning plan:\n\n${data.learningPlan}`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, planMessage]);
    } catch (error) {
      console.error('Learning plan error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { 
      icon: Book, 
      text: "My Courses", 
      action: () => setInputMessage("Show me my enrolled courses and progress")
    },
    { 
      icon: HelpCircle, 
      text: "Check Subscription", 
      action: () => setInputMessage("What subjects do I have access to?")
    },
    { 
      icon: TrendingUp, 
      text: "Learning Plan", 
      action: generateLearningPlan
    },
    { 
      icon: Award, 
      text: "My Progress", 
      action: () => setInputMessage("Show my learning progress and achievements")
    }
  ];

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 dark:bg-blue-500 p-2 rounded-lg">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">EduBot AI Assistant</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Connected to Moodle • {userContext?.courses?.length || 0} courses enrolled
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* User Context Indicator */}
            {userContext && (
              <div className="flex items-center space-x-1 text-xs bg-green-100 dark:bg-green-900 px-2 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-700 dark:text-green-300">Connected</span>
              </div>
            )}
            
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
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                
                {/* Moodle Links */}
                {message.moodleLinks && message.moodleLinks.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-300">Quick Access:</p>
                    {message.moodleLinks.slice(0, 3).map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                      >
                        <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm text-blue-700 dark:text-blue-300">{link.name}</span>
                        <ExternalLink className="w-3 h-3 text-blue-500" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 dark:bg-blue-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-2xl px-4 py-3 shadow-sm border border-gray-200 dark:border-gray-600 transition-colors duration-200">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-6 py-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Quick actions:</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
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
              placeholder="Ask about your courses, progress, or learning plans..."
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
          Connected to your Moodle courses • AI-powered responses
        </p>
      </div>
    </div>
  );
}