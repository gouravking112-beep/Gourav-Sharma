import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage, Role, ThemeConfig } from '../types';
import { User, Sparkles } from 'lucide-react';

interface MessageBubbleProps {
  message: ChatMessage;
  themeConfig: ThemeConfig;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, themeConfig }) => {
  const isUser = message.role === Role.USER;

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mb-1 ${isUser ? themeConfig.accent : 'bg-gray-200 dark:bg-gray-700'}`}>
           {isUser ? (
             <User size={16} className="text-white" />
           ) : (
             <Sparkles size={16} className="text-gray-600 dark:text-gray-300" />
           )}
        </div>

        {/* Bubble */}
        <div 
          className={`
            px-4 py-3 rounded-2xl shadow-sm overflow-hidden
            ${isUser ? themeConfig.userBubble : themeConfig.modelBubble}
            ${isUser ? 'rounded-br-none' : 'rounded-bl-none'}
          `}
        >
          {message.isError ? (
            <span className="text-red-500">Error: {message.text}</span>
          ) : (
            // Apply prose-invert (white text) for user bubbles always.
            // Apply prose-invert for model bubbles ONLY when in dark mode (via dark: modifier)
            <div className={`prose prose-sm max-w-none ${isUser ? 'prose-invert' : 'dark:prose-invert'}`}>
              <ReactMarkdown>{message.text}</ReactMarkdown>
            </div>
          )}
          <div className={`text-[10px] mt-1 opacity-70 ${isUser ? 'text-right' : 'text-left'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;