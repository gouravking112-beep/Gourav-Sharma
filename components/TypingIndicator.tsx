import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex space-x-1.5 p-2 items-center">
      <div className="w-2 h-2 bg-current opacity-60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 bg-current opacity-60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 bg-current opacity-60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  );
};

export default TypingIndicator;