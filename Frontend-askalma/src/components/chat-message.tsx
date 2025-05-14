// components/chat-message.tsx
"use client"; 

import { cn } from "@/lib/utils";
import { Bot, User, ChevronDown, ChevronRight, BrainCircuit } from "lucide-react"; // Added BrainCircuit
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // For GitHub Flavored Markdown (tables, strikethrough, etc.)
import { useState, useMemo } from "react";

type ChatMessageProps = {
  role: "user" | "assistant";
  content: string;
};

// Helper function to parse content, memoized for performance
const parseThinkContent = (content: string) => {
  const thinkStartTag = "<think>";
  const thinkEndTag = "</think>";

  const startIndex = content.indexOf(thinkStartTag);
  const endIndex = content.indexOf(thinkEndTag);

  if (startIndex === 0 && endIndex > startIndex) { // Ensure <think> is at the very beginning
    const thinkContent = content.substring(thinkStartTag.length, endIndex).trim();
    const answerContent = content.substring(endIndex + thinkEndTag.length).trim();
    return { thinkContent, answerContent, prefixContent: null };
  }
  // If <think> is present but not at the start, or if tags are mismatched/missing
  // treat the whole thing as answer content for now. Or you could refine this.
  return { thinkContent: null, answerContent: content.trim(), prefixContent: null };
};


export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user";
  
  // Memoize the parsed content to avoid re-parsing on every render unless content changes
  const { thinkContent, answerContent } = useMemo(() => parseThinkContent(content), [content]);
  
  const [isThinkBlockOpen, setIsThinkBlockOpen] = useState(false);

  // Common Markdown components
  const markdownComponents = {
    p: ({node, ...props}: any) => <p className="mb-2 last:mb-0" {...props} />,
    ol: ({node, ...props}: any) => <ol className="list-decimal list-inside my-2 space-y-1" {...props} />,
    ul: ({node, ...props}: any) => <ul className="list-disc list-inside my-2 space-y-1" {...props} />,
    li: ({node, ...props}: any) => <li className="ml-4" {...props} />,
    code: ({node, inline, className, children, ...props}: any) => {
      const match = /language-(\w+)/.exec(className || '')
      return !inline && match ? (
        // For syntax highlighting, you'd integrate a library like react-syntax-highlighter here
        <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded my-2 overflow-x-auto text-sm">
          <code className={`language-${match[1]}`} {...props}>
            {children}
          </code>
        </pre>
      ) : (
        <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm" {...props}>
          {children}
        </code>
      )
    },
    a: ({node, ...props}: any) => <a className="text-blue-600 hover:underline dark:text-blue-400" target="_blank" rel="noopener noreferrer" {...props} />,
    // Add more components like table, th, td, etc. if your LLM generates them
  };

  return (
    <div
      className={cn(
        "flex w-full items-start gap-2.5 sm:gap-3 py-2", // Consistent gap
        isUser ? "justify-end" : "" 
      )}
    >
      {/* Bot/User Icon */}
      {!isUser && (
        <div className="p-1.5 bg-primary text-primary-foreground rounded-full self-start shrink-0 mt-1">
          <Bot size={18} />
        </div>
      )}

      {/* Message Content Area */}
      <div className={cn(
          "flex flex-col w-full", 
          isUser ? "items-end" : "items-start",
          isUser ? "max-w-[80%] sm:max-w-[75%]" : "max-w-[calc(100%-3.5rem)] sm:max-w-[calc(100%-4rem)]" // Adjust width based on icon
        )}
      >
        {/* Collapsible Think Block - Renders only if thinkContent exists */}
        {thinkContent && (
          <div className="w-full mb-2 rounded-lg border border-border dark:border-gray-700 shadow-sm">
            <details className="group" open={isThinkBlockOpen} onToggle={(e) => setIsThinkBlockOpen((e.target as HTMLDetailsElement).open)}>
              <summary 
                className={cn(
                  "flex items-center justify-between p-2.5 rounded-t-lg cursor-pointer list-none transition-colors",
                  "bg-muted/80 hover:bg-muted dark:bg-slate-700 dark:hover:bg-slate-600 text-muted-foreground dark:text-slate-300",
                  {"rounded-b-lg": !isThinkBlockOpen && !answerContent} // If no answer follows and closed
                )}
              >
                <div className="flex items-center gap-2">
                  <BrainCircuit size={16} className="text-primary" />
                  <span className="text-xs font-medium">Assistant's Reasoning</span>
                </div>
                {isThinkBlockOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </summary>
              <div 
                className={cn(
                  "p-3 text-xs leading-relaxed border-t border-border dark:border-gray-600",
                  "bg-muted/50 dark:bg-slate-800 text-foreground dark:text-slate-300",
                   "rounded-b-lg" 
                )}
              >
                <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
                    {thinkContent}
                </ReactMarkdown>
              </div>
            </details>
          </div>
        )}

        {/* Actual Answer Part - Renders only if answerContent exists */}
        {answerContent && (
            <div
                className={cn(
                "p-3 rounded-lg leading-relaxed",
                isUser
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-card-foreground border border-border shadow-sm", // More distinct style for bot answer
                !thinkContent && !isUser && "bg-muted dark:bg-slate-800" // if only answer, use muted like original
                )}
            >
                <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
                    {answerContent}
                </ReactMarkdown>
            </div>
        )}
      </div>

      {isUser && (
        <div className="p-1.5 bg-blue-500 text-white rounded-full self-start shrink-0 mt-1">
          <User size={18} />
        </div>
      )}
    </div>
  );
}