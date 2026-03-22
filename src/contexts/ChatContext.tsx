import { createContext, useContext, useState, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";


const API_BASE_URL = process.env.REACT_APP_API_URL ||  "https://openskai.onrender.com";
console.log("API Base URL:", API_BASE_URL);

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

interface ChatContextType {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (message: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async (message: string) => {
    const userMessage: Message = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      console.log("📦 Backend response:", data);
      console.log("✈️ Flights data:", data.flights);
      
      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
        type: data.type || "text",
        flights: data.flights || undefined,
        hotels: data.hotels || undefined,
        tourPackages: data.tourPackages || undefined,
      };
      
      console.log("💬 Assistant message:", assistantMessage);
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to connect to the AI. Make sure the backend is running.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContext.Provider value={{ messages, isLoading, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
