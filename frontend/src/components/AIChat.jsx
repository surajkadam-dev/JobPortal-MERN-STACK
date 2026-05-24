import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendMessageToAI,
  clearAllAIErrors,
  clearReply,
} from "../store/slices/aiSlice";

const STORAGE_KEY = "aiChatHistory";

const AIChat = ({ className = "" }) => {
  const dispatch = useDispatch();
  const { reply, loading, error, usage } = useSelector((state) => state.ai);
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [inputValue, setInputValue] = useState("");
  const WELCOME_TEXT =
    "Hi there! 👋 I'm your AI career assistant. How can I help you today?";

  // Initialize chatHistory from sessionStorage (excluding welcome message)
  const [chatHistory, setChatHistory] = useState(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    let savedMessages = [];
    if (saved) {
      try {
        savedMessages = JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved chat history", e);
      }
    }
    // Always prepend a fresh welcome message (empty text for animation)
    return [
      {
        id: "welcome",
        sender: "ai",
        text: "",
        fullText: WELCOME_TEXT,
        usage: null,
      },
      ...savedMessages,
    ];
  });

  const [lastUserMessage, setLastUserMessage] = useState("");
  const messagesEndRef = useRef(null);
  const animationIntervalRef = useRef(null);

  // Clear any stale Redux reply on mount
  useEffect(() => {
    dispatch(clearReply());
  }, [dispatch]);

  // Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  // Save chatHistory to sessionStorage (excluding the welcome message)
  useEffect(() => {
    const messagesToSave = chatHistory.filter((msg) => msg.id !== "welcome");
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messagesToSave));
  }, [chatHistory]);

  // Welcome message typewriter effect
  useEffect(() => {
    const welcomeMsg = chatHistory.find((msg) => msg.id === "welcome");
    if (!welcomeMsg || welcomeMsg.text !== "") return;

    let index = 0;
    const interval = setInterval(() => {
      index++;
      setChatHistory((prev) =>
        prev.map((msg) =>
          msg.id === "welcome"
            ? { ...msg, text: WELCOME_TEXT.substring(0, index) }
            : msg,
        ),
      );
      if (index === WELCOME_TEXT.length) clearInterval(interval);
    }, 30);

    return () => clearInterval(interval);
  }, []); // Run only once on mount (welcome message is initially empty)

  // Handle AI reply from Redux
  useEffect(() => {
    if (reply && !loading && !error) {
      const newMessage = {
        id: Date.now() + Math.random(),
        sender: "ai",
        text: reply,
        usage,
      };
      setChatHistory((prev) => [...prev, newMessage]);

      // Clear the reply from Redux immediately
      dispatch(clearReply());

      // Typewriter effect for this AI reply
      let index = 0;
      const interval = setInterval(() => {
        index++;
        setChatHistory((prev) =>
          prev.map((msg) =>
            msg.id === newMessage.id
              ? { ...msg, text: reply.substring(0, index) }
              : msg,
          ),
        );
        if (index === reply.length) clearInterval(interval);
      }, 30);
    }
  }, [reply, loading, error, usage, dispatch]);

  // Cleanup animations on unmount
  useEffect(() => {
    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
    };
  }, []);

  // Send message
  const handleSendMessage = () => {
    if (!inputValue.trim() || loading) return;
    dispatch(clearAllAIErrors());
    const userMsg = inputValue.trim();
    setLastUserMessage(userMsg);
    setChatHistory((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), sender: "user", text: userMsg },
    ]);
    setInputValue("");
    dispatch(sendMessageToAI(userMsg));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleRetry = () => {
    if (lastUserMessage) {
      dispatch(clearAllAIErrors());
      dispatch(sendMessageToAI(lastUserMessage));
    }
  };

  const getHeaderTitle = () => {
    if (!user || !user.role) return "AI Assistant";
    switch (user.role) {
      case "Job Seeker":
        return "AI Career Assistant";
      case "Employer":
        return "AI Hiring Assistant";
      case "Admin":
        return "AI Admin Assistant";
      default:
        return "AI Assistant";
    }
  };

  return (
    <div
      className={`flex flex-col h-full bg-gray-50 dark:bg-gray-900 overflow-hidden rounded-2xl shadow-xl ${className}`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              {getHeaderTitle()}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your AI assistant for job search
            </p>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 mx-4 mt-4 rounded-lg flex justify-between items-center shadow-sm">
          <span className="text-sm">{error}</span>
          <button
            onClick={handleRetry}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm transition transform hover:scale-105"
          >
            Retry
          </button>
        </div>
      )}

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.map((msg) => {
          const isUser = msg.sender === "user";
          return (
            <MessageBubble
              key={msg.id}
              isUser={isUser}
              text={msg.text}
              usage={msg.usage}
            />
          );
        })}
        {loading && !reply && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700 shadow-inner">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            placeholder="Type your message..."
            className="flex-1 p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 shadow-inner dark:text-white disabled:opacity-50 transition"
          />
          <button
            onClick={handleSendMessage}
            disabled={loading || !inputValue.trim()}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105 shadow-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Message Bubble Subcomponent
const MessageBubble = ({ isUser, text, usage }) => {
  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} items-end space-x-2`}
    >
      {!isUser && (
        <div className="w-8 h-8 bg-blue-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 flex-shrink-0 shadow">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
      <div
        className={`max-w-[70%] p-4 rounded-2xl shadow-md transition-all duration-300 animate-fadeIn ${
          isUser
            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-none"
            : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-200 dark:border-gray-700"
        }`}
      >
        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
          {text}
        </p>
        {!isUser && usage && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Used {usage.totalTokens} tokens
          </p>
        )}
      </div>
      {isUser && <div className="w-8" />}
    </div>
  );
};

// Typing Indicator
const TypingIndicator = () => (
  <div className="flex justify-start items-center space-x-2">
    <div className="w-8 h-8 bg-blue-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 flex-shrink-0 shadow">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"
          clipRule="evenodd"
        />
      </svg>
    </div>
    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-bl-none shadow-md border border-gray-200 dark:border-gray-700">
      <div className="flex space-x-1.5">
        <div
          className="w-2.5 h-2.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <div
          className="w-2.5 h-2.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <div
          className="w-2.5 h-2.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  </div>
);

export default AIChat;
