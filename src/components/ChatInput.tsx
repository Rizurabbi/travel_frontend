import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSendMessage, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask me anything about your travel plans..."
        disabled={disabled}
        className="min-h-[60px] max-h-[120px] resize-none bg-white border focus-visible:ring-1"
        style={{ borderColor: '#ffffffff', color: '#282828' }}
        rows={2}
      />
      <Button
        type="submit"
        //disabled={disabled || !message.trim()}
        size="icon"
        className="h-[60px] w-[60px] text-white transition-all duration-300"
        style={{ backgroundColor: '#001540' }}
      >
        <Send className="w-5 h-5" />
      </Button>
    </form>
  );
};
