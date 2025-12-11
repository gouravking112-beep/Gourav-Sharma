import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Menu, Moon, Sun, Sparkles, AlertCircle } from 'lucide-react';
import { Role, ChatMessage, AppMode, AppTheme } from './types';
import { THEME_CONFIGS, MODE_ICONS } from './constants';
import { sendMessageStream } from './services/geminiService';
import MessageBubble from './components/MessageBubble';
import TypingIndicator from './components/TypingIndicator';

const App: React.FC = () => {
  // State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentMode, setCurrentMode] = useState<AppMode>(AppMode.RELATIONSHIP);
  const [currentTheme, setCurrentTheme] = useState<AppTheme>(AppTheme.ROSE);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Derived state
  const theme = THEME_CONFIGS[currentTheme];

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Initial greeting based on mode
  useEffect(() => {
    setMessages([
      {
        id: 'init-1',
        role: Role.MODEL,
        text: `Hi, I'm **Clara**. I'm set to **${currentMode}** mode.\n\nHow can I help you thrive today?`,
        timestamp: new Date()
      }
    ]);
  }, [currentMode]);

  const handleSendMessage = useCallback(async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: Role.USER,
      text: inputText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setError(null);

    // Placeholder for model message
    const modelMessageId = (Date.now() + 1).toString();
    setMessages(prev => [
      ...prev,
      {
        id: modelMessageId,
        role: Role.MODEL,
        text: '',
        timestamp: new Date()
      }
    ]);

    try {
      const stream = await sendMessageStream(userMessage.text, currentMode);
      
      let fullText = '';
      
      for await (const chunk of stream) {
        const chunkText = chunk.text;
        if (chunkText) {
          fullText += chunkText;
          setMessages(prev => 
            prev.map(msg => 
              msg.id === modelMessageId 
                ? { ...msg, text: fullText }
                : msg
            )
          );
        }
      }
    } catch (err: any) {
      console.error("Chat error:", err);
      setError("I'm having trouble connecting right now. Please check your connection or try again.");
      setMessages(prev => prev.filter(msg => msg.id !== modelMessageId)); // Remove empty placeholder
    } finally {
      setIsLoading(false);
      // Focus back on input for desktop
      if (window.innerWidth > 768) {
        inputRef.current?.focus();
      }
    }
  }, [inputText, isLoading, currentMode]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Render Sidebar Content
  const renderSidebar = () => (
    <div className={`h-full flex flex-col ${theme.bgPanel} ${theme.border} border-r transition-colors duration-300`}>
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <h1 className={`text-2xl font-bold flex items-center gap-2 ${theme.textPrimary}`}>
          <Sparkles className="w-6 h-6" />
          Clara AI
        </h1>
        <p className={`text-xs mt-1 ${theme.textSecondary}`}>Your Intelligent Assistant</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-8">
        {/* Mode Selector */}
        <div>
          <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${theme.textSecondary}`}>
            Assistant Mode
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {Object.values(AppMode).map((mode) => {
              const Icon = MODE_ICONS[mode];
              const isActive = currentMode === mode;
              return (
                <button
                  key={mode}
                  onClick={() => {
                    setCurrentMode(mode);
                    setIsSidebarOpen(false);
                  }}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${isActive 
                      ? `${theme.accent} text-white shadow-md` 
                      : `hover:bg-gray-100 dark:hover:bg-gray-800 ${theme.textPrimary}`
                    }
                  `}
                >
                  <Icon size={18} />
                  <span className="font-medium">{mode}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Theme & Settings */}
        <div>
          <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${theme.textSecondary}`}>
            Appearance
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {Object.values(AppTheme).map((thm) => (
                <button
                  key={thm}
                  onClick={() => setCurrentTheme(thm)}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-all border
                    ${currentTheme === thm
                      ? `${theme.border} ${theme.bgApp} ${theme.textPrimary} ring-2 ring-offset-1 ring-gray-300 dark:ring-gray-600`
                      : `border-transparent hover:bg-gray-100 dark:hover:bg-gray-800 ${theme.textSecondary}`
                    }
                  `}
                >
                  {thm}
                </button>
              ))}
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`
                w-full flex items-center justify-between px-4 py-3 rounded-xl
                transition-all duration-200 border
                hover:bg-gray-100 dark:hover:bg-gray-800
                ${theme.border} ${theme.textPrimary}
              `}
            >
              <span className="font-medium flex items-center gap-2">
                {darkMode ? <Moon size={18} /> : <Sun size={18} />}
                {darkMode ? 'Dark Mode' : 'Light Mode'}
              </span>
              <div className={`
                w-10 h-6 rounded-full p-1 transition-colors
                ${darkMode ? theme.accent : 'bg-gray-300 dark:bg-gray-600'}
              `}>
                <div className={`
                  w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform
                  ${darkMode ? 'translate-x-4' : 'translate-x-0'}
                `} />
              </div>
            </button>
          </div>
        </div>
      </div>
      
      <div className={`p-4 border-t ${theme.border} ${theme.textSecondary} text-xs text-center`}>
        Powered by Gemini 2.5 Flash
      </div>
    </div>
  );

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className={`flex h-screen w-full overflow-hidden transition-colors duration-300 ${theme.bgApp}`}>
        
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-80 flex-shrink-0 h-full">
          {renderSidebar()}
        </aside>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-3/4 max-w-xs shadow-xl animate-slide-in">
              {renderSidebar()}
            </div>
          </div>
        )}

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col h-full relative">
          
          {/* Header */}
          <header className={`
            flex items-center justify-between px-4 py-3 md:px-6 md:py-4
            ${theme.bgPanel} border-b ${theme.border}
            sticky top-0 z-10 shadow-sm transition-colors duration-300
          `}>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className={`md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${theme.textPrimary}`}
              >
                <Menu size={20} />
              </button>
              <div className="flex flex-col">
                 <h2 className={`text-lg font-bold ${theme.textPrimary} flex items-center gap-2`}>
                   {currentMode}
                   <span className={`text-xs px-2 py-0.5 rounded-full bg-opacity-20 ${theme.accent.replace('bg-', 'text-')} bg-current`}>
                     Beta
                   </span>
                 </h2>
                 <p className={`text-xs ${theme.textSecondary} hidden sm:block`}>
                   {currentMode === AppMode.RELATIONSHIP && "Relationship Coach & Emotional Support"}
                   {currentMode === AppMode.BUSINESS && "Consulting, Strategy & Entrepreneurship"}
                   {currentMode === AppMode.WELLNESS && "Stress Management & Daily Motivation"}
                   {currentMode === AppMode.EDC && "Productivity, Gear & Organization"}
                 </p>
              </div>
            </div>
            
            <div className={`p-2 rounded-full bg-opacity-10 ${theme.accent.replace('bg-', 'bg-')}`}>
              {React.createElement(MODE_ICONS[currentMode], { size: 20, className: theme.accent.replace('bg-', 'text-') })}
            </div>
          </header>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-2 scroll-smooth">
            <div className="max-w-3xl mx-auto w-full">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} themeConfig={theme} />
              ))}
              
              {isLoading && messages[messages.length - 1]?.role !== Role.MODEL && (
                 <div className="flex justify-start w-full mb-6">
                   <div className={`${theme.modelBubble} px-4 py-2 rounded-2xl rounded-bl-none shadow-sm`}>
                      <TypingIndicator />
                   </div>
                 </div>
              )}
              
              {error && (
                <div className="flex items-center justify-center p-4 mb-4">
                  <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm flex items-center gap-2 border border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className={`p-4 md:p-6 ${theme.bgPanel} border-t ${theme.border} transition-colors duration-300`}>
            <div className="max-w-3xl mx-auto w-full relative">
              <textarea
                ref={inputRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Message Clara about ${currentMode.toLowerCase()}...`}
                disabled={isLoading}
                rows={1}
                className={`
                  w-full pl-4 pr-14 py-3.5 rounded-2xl resize-none
                  focus:outline-none focus:ring-2 focus:ring-opacity-50
                  ${theme.bgApp} ${theme.textPrimary}
                  ${theme.accent.replace('bg-', 'focus:ring-')}
                  transition-all shadow-inner
                  disabled:opacity-50 disabled:cursor-not-allowed
                  text-base placeholder-gray-400 dark:placeholder-gray-600
                `}
                style={{ minHeight: '52px', maxHeight: '120px' }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isLoading}
                className={`
                  absolute right-2 bottom-2 p-2 rounded-xl
                  transition-all duration-200
                  ${inputText.trim() && !isLoading
                    ? `${theme.accent} ${theme.accentHover} text-white shadow-md transform hover:scale-105 active:scale-95`
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                <Send size={18} />
              </button>
            </div>
            <p className={`text-center text-[10px] mt-2 ${theme.textSecondary}`}>
              Clara AI can make mistakes. Consider checking important information.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;