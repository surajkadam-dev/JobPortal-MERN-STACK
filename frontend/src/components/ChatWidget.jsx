import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import AIChat from "./AIChat";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // drawer visibility
  const [showHint, setShowHint] = useState(false);

  const { isAuthenticated } = useSelector((state) => state.user);

  const hasAutoOpened = useRef(false);
  const hintTimerRef = useRef(null);
  const hideTimerRef = useRef(null);

  /* ======================================
     AUTO OPEN (Unauthenticated Users)
  ====================================== */
  useEffect(() => {
    if (!isAuthenticated && !hasAutoOpened.current) {
      const timer = setTimeout(() => {
        openDrawer();
        hasAutoOpened.current = true;
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  /* ======================================
     HINT LOGIC
  ====================================== */
  useEffect(() => {
    const scheduleHint = () => {
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);

      hintTimerRef.current = setTimeout(() => {
        if (!isOpen) {
          setShowHint(true);
          hideTimerRef.current = setTimeout(() => {
            setShowHint(false);
          }, 5000);
        }
      }, 1000);
    };

    scheduleHint();
    const interval = setInterval(scheduleHint, 30000);

    return () => {
      clearInterval(interval);
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [isOpen]);

  /* ======================================
     OPEN / CLOSE DRAWER
  ====================================== */
  const openDrawer = () => {
    setIsOpen(true);
    setTimeout(() => setIsVisible(true), 10);
    setShowHint(false); // hide hint when drawer opens
  };

  const closeDrawer = () => {
    setIsVisible(false);
    setTimeout(() => setIsOpen(false), 300); // match duration-300
  };

  const toggleDrawer = () => {
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  };

  /* ======================================
     HINT HOVER CONTROL
  ====================================== */
  const handleHintMouseEnter = () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
  };

  const handleHintMouseLeave = () => {
    hideTimerRef.current = setTimeout(() => {
      setShowHint(false);
    }, 2000);
  };

  return (
    <>
      {/* ======================================
         BUTTON + HINT CONTAINER (moves together)
      ====================================== */}
      <div
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 transition-all duration-500 ease-in-out ${
          showHint && !isOpen ? "translate-x-[-160px]" : "translate-x-0"
        }`}
      >
        {/* Chat Button */}
        <button
          onClick={toggleDrawer}
          className={`transition-all duration-300
          ${isOpen ? "translate-x-[-12px] scale-95" : "translate-x-0 scale-100"}
          bg-gradient-to-r from-blue-500 to-indigo-600
          hover:from-blue-600 hover:to-indigo-700
          text-white p-4 rounded-full shadow-xl hover:shadow-2xl`}
          aria-label="Open Chat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 transition-transform group-hover:scale-110"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </button>

        {/* Hint Bubble (appears to the left of the button) */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden whitespace-nowrap ${
            showHint && !isOpen
              ? "max-w-60 opacity-100 ml-0"
              : "max-w-0 opacity-0 ml-0"
          }`}
          onMouseEnter={handleHintMouseEnter}
          onMouseLeave={handleHintMouseLeave}
        >
          <div className="relative bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 py-2 pl-4 pr-6 rounded-lg shadow-lg flex items-center">
            <span className="text-sm font-medium mr-2">
              👋 AI Assistant here to help!
            </span>
            {/* Arrow pointing left (toward the button) */}
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-white dark:border-r-gray-800"></div>
          </div>
        </div>
      </div>

      {/* ======================================
         DRAWER MODAL (unchanged)
      ====================================== */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Overlay */}
          <div
            className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300
            ${isVisible ? "opacity-100" : "opacity-0"}`}
            onClick={closeDrawer}
          />

          {/* Drawer */}
          <div className="absolute inset-y-0 right-0 flex max-w-full">
            <div
              className={`relative w-screen max-w-md bg-white dark:bg-gray-900 shadow-2xl rounded-l-2xl overflow-hidden
              transform transition-all duration-300 ease-in-out
              ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "translate-x-full opacity-0"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-between px-4">
                <span className="text-white font-semibold">AI Assistant</span>
                <button
                  onClick={closeDrawer}
                  className="text-white/80 hover:text-white transition p-1 rounded-full hover:bg-white/20"
                >
                  ✕
                </button>
              </div>

              <div className="h-full flex flex-col pt-14">
                {isAuthenticated ? (
                  <AIChat className="flex-1 h-full rounded-none" />
                ) : (
                  <div className="flex-1 flex items-center justify-center p-6 text-center">
                    <div>
                      <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">
                        Please Log In
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Login to access your AI career assistant.
                      </p>
                      <a
                        href="/login"
                        className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:scale-[1.03] transition"
                      >
                        Log In
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
