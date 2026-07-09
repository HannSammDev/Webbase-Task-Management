import React from "react";

const defaultTransition = "transition-all duration-200 ease-out";

export const Modal = ({
  isOpen,
  onClose,
  size = "lg",
  transition = defaultTransition,
  children,
}) => {
  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
  };
    const transitionClasses = {
    "fade": "animate-in fade-in",
    "slide": "animate-in slide-in-from-top",
    "zoom": "animate-in zoom-in-95",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/50 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className={`relative w-full ${sizes[size]} ${transitionClasses[transition]}`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-3 top-3 z-10 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="rounded-[2rem] bg-white shadow-2xl ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-white/10">
          <div className="scrollbar-hide max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-h-[calc(100vh-3rem)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
