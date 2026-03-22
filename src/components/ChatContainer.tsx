import { useEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage";
import { Loader2 } from "lucide-react";

interface FlightData {
  id: string;
  price: string;
  currency: string;
  airline: string;
  departure: any;
  arrival: any;
  duration: string;
  stops: number;
}

interface HotelData {
  id: string;
  name: string;
  city: string;
  price: string;
  currency: string;
  description?: string;
  latitude?: number;
  longitude?: number;
}

interface TourPackage {
  id: string;
  name: string;
  description: string;
  price: string;
  currency: string;
  duration: string;
  destinations: string[];
  image?: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  type?: "text" | "flight_results" | "tour_packages" | "hotel_results";
  flights?: FlightData[];
  hotels?: HotelData[];
  tourPackages?: TourPackage[];
}

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
}

export const ChatContainer = ({ messages, isLoading }: ChatContainerProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessagesLength = useRef(messages.length);

  // Auto-scroll ONLY when a NEW message is added
  useEffect(() => {
    const newMessageAdded = messages.length > prevMessagesLength.current;

    if (newMessageAdded) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    prevMessagesLength.current = messages.length;
  }, [messages]);

  return (
    <div className="overflow-y-auto space-y-4 mb-4" style={{ maxHeight: 'calc(60vh - 120px)' }}>
      {messages.length === 0 ? null : (
        <>
        {messages.map((message, index) => (
          <ChatMessage 
            key={index} 
            role={message.role} 
            content={message.content}
            type={message.type}
            flights={message.flights}
            hotels={message.hotels}
            tourPackages={message.tourPackages}
          />
        ))}
          {isLoading && (
            <div className="flex items-center gap-2 p-4 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Thinking...</span>
            </div>
          )}
        </>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};
