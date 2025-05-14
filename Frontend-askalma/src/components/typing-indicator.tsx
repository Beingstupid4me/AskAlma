export default function TypingIndicator() {
    return (
      <div className="flex items-start max-w-[80%] md:max-w-[70%] animate-fade-in" style={{ animationDuration: "300ms" }}>
        <div className="mr-2 mt-1 flex-shrink-0 rounded-full bg-mint-accent/20 p-1">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-mint-accent"
          >
            <path
              d="M12 5V19M5 12H19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
  
        <div className="px-4 py-3 rounded-lg shadow-sm bg-mint-accent/30 text-deep-navy rounded-tl-none">
          <div className="flex space-x-1">
            <div className="w-2 h-2 rounded-full bg-deep-navy animate-pulse" style={{ animationDelay: "0ms" }}></div>
            <div className="w-2 h-2 rounded-full bg-deep-navy animate-pulse" style={{ animationDelay: "300ms" }}></div>
            <div className="w-2 h-2 rounded-full bg-deep-navy animate-pulse" style={{ animationDelay: "600ms" }}></div>
          </div>
        </div>
      </div>
    )
  }
  
  