import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { Card } from "@/components/ui/card";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export const ChatMessage = ({ role, content }: ChatMessageProps) => {
  const isAssistant = role === "assistant";

  return (
    <div
      className={cn(
        "flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500",
        isAssistant ? "justify-start" : "justify-end"
      )}
    >
      {isAssistant && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-primary/80 shadow-lg">
          <Bot className="w-6 h-6 text-primary-foreground" />
        </div>
      )}
      
      <Card
        className={cn(
          "max-w-[85%] overflow-hidden transition-all",
          isAssistant
            ? "bg-card shadow-[var(--shadow-card)] border-primary/10"
            : "bg-primary text-primary-foreground shadow-lg"
        )}
      >
        <div className="p-5">
          <p className={cn(
            "text-xs font-semibold mb-3 uppercase tracking-wide",
            isAssistant ? "text-primary" : "text-primary-foreground/80"
          )}>
            {isAssistant ? "Travel Guide" : "You"}
          </p>
          
          {isAssistant ? (
            <div className="prose prose-sm max-w-none [&>h3]:text-lg [&>h3]:font-bold [&>h3]:text-foreground [&>h3]:mt-6 [&>h3]:mb-3 [&>h3]:flex [&>h3]:items-center [&>h3]:gap-2 [&>h3]:before:content-['✈️'] [&>ul]:space-y-2 [&>ul]:my-4 [&>li]:text-foreground/90 [&>li]:leading-relaxed [&>li]:pl-2 [&>li::marker]:text-primary [&>strong]:text-foreground [&>strong]:font-semibold [&>p]:text-foreground/80 [&>p]:leading-relaxed [&>p]:my-3">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
          )}
        </div>
      </Card>

      {!isAssistant && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-secondary to-secondary/80 shadow-lg">
          <User className="w-6 h-6 text-secondary-foreground" />
        </div>
      )}
    </div>
  );
};
