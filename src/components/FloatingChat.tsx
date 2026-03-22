import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChatContainer } from "@/components/ChatContainer";
import { ChatInput } from "@/components/ChatInput";
import { useChat } from "@/contexts/ChatContext";

export const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isLoading, sendMessage } = useChat();

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 z-50"
        size="icon"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      {/* Chat Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl h-[600px] flex flex-col p-0">
          <DialogHeader className="px-6 py-4 border-b border-border">
            <DialogTitle className="flex items-center justify-between">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                AI Travel Assistant
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-hidden">
              <ChatContainer messages={messages} isLoading={isLoading} />
            </div>
            <div className="p-4 border-t border-border bg-card/50 backdrop-blur-sm">
              <ChatInput onSendMessage={sendMessage} disabled={isLoading} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};