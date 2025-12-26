import { MessageSquare, X, Reply } from "lucide-react";

interface CommentButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const CommentButton = ({ isOpen, onClick }: CommentButtonProps) => {
  return (
    <div className="relative group"> {/* 👈 Added positioning context */}
      <button
        onClick={onClick}
        className="relative w-10 h-10 rounded-full bg-primary message-button-shadow flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label={isOpen ? "Close comments" : "Open comments"}
      >
        {/* 👈 FIXED: Pulse ring animation */}
        {!isOpen && (
          <>
            <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping w-10 h-10" />
            <span className="absolute inset-0 rounded-full bg-primary/30 animate-pulse w-10 h-10" />
          </>
        )}
        
        {/* Icon */}
        <div className="relative z-10 transition-transform duration-300">
          {isOpen ? (
            <X className="w-4 h-4 text-primary-foreground" />
          ) : (
            <Reply className="w-4 h-4 text-primary-foreground rotate-180" />
          )}
        </div>
      </button>

      {/* 👈 FIXED: Proper tooltip */}
      {!isOpen && (
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-2 bg-foreground text-background text-xs font-medium whitespace-nowrap rounded-lg shadow-xl pointer-events-none z-20 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all duration-200">
          Leave a comment
        </span>
      )}
    </div>
  );
};

export default CommentButton;