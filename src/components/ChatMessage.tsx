import { useState } from "react";
import { Bot, User, Plane, Clock, MapPin, Hotel } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PayPalPayment } from "./PayPalPayment";

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

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  type?: "text" | "flight_results" | "tour_packages" | "hotel_results";
  flights?: FlightData[];
  hotels?: HotelData[];
  tourPackages?: TourPackage[];
  onPayment?: (amount: string, description: string) => void;
}

export const ChatMessage = ({ role, content, type, flights, hotels, tourPackages }: ChatMessageProps) => {
  const isAssistant = role === "assistant";
  const [showPayPal, setShowPayPal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDescription, setPaymentDescription] = useState("");
  
  console.log("🎨 ChatMessage render:", { type, flightsCount: flights?.length, hotelsCount: hotels?.length, tourPackagesCount: tourPackages?.length });

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
        <div className="p-3">
          <p className={cn(
            "text-xs font-semibold mb-1 uppercase tracking-wide",
            isAssistant ? "text-primary" : "text-primary-foreground/80"
          )}>
            {isAssistant ? "Travel Guide" : "You"}
          </p>
          
          {isAssistant ? (
            <>
              <div className="prose prose-sm max-w-none [&>h3]:text-lg [&>h3]:font-bold [&>h3]:text-foreground [&>h3]:mt-4 [&>h3]:mb-2 [&>h3]:flex [&>h3]:items-center [&>h3]:gap-2 [&>h3]:before:content-['✈️'] [&>ul]:space-y-1 [&>ul]:my-2 [&>li]:text-foreground/90 [&>li]:leading-snug [&>li]:pl-2 [&>li::marker]:text-primary [&>strong]:text-foreground [&>strong]:font-semibold [&>p]:text-foreground/80 [&>p]:leading-snug [&>p]:my-1">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>

              {type === "flight_results" && flights && flights.length > 0 && (
                <div className="mt-4 space-y-3">
                  {flights.map((flight) => (
                    <Card key={flight.id} className="p-4 bg-accent/50 border-primary/20">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                            <Plane className="w-4 h-4 text-primary" />
                            <span>{flight.airline}</span>
                          </div>
                          <div className="text-xs text-muted-foreground space-y-1">
                            <div className="font-medium text-foreground">
                              {flight.departure.iataCode} → {flight.arrival.iataCode}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3" />
                              <span>{flight.duration.replace('PT', '').toLowerCase()}</span>
                              <span>• {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}</span>
                            </div>
                            <div>
                              Departs: {new Date(flight.departure.at).toLocaleString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="text-lg font-bold text-primary">
                            {flight.currency} {flight.price}
                          </div>
                          <Button 
                            size="sm"
                            onClick={() => {
                              setPaymentAmount(flight.price);
                              setPaymentDescription(`Flight: ${flight.airline} - ${flight.departure.iataCode} to ${flight.arrival.iataCode}`);
                              setShowPayPal(true);
                            }}
                          >
                            Book Now
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {type === "hotel_results" && hotels && hotels.length > 0 && (
                <div className="mt-4 space-y-3">
                  {hotels.map((hotel) => (
                    <Card key={hotel.id} className="p-4 bg-accent/50 border-primary/20">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                            <Hotel className="w-4 h-4 text-primary" />
                            <span>{hotel.name}</span>
                          </div>
                          <div className="text-xs text-muted-foreground space-y-1">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3 h-3" />
                              <span>{hotel.city}</span>
                            </div>
                            {hotel.description && (
                              <div className="text-foreground/80 pt-1">
                                {hotel.description}
                              </div>
                            )}
                            {hotel.latitude && hotel.longitude && (
                              <div className="text-xs">
                                <span className="font-medium">Location: </span>
                                {hotel.latitude.toFixed(4)}°N, {hotel.longitude.toFixed(4)}°E
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="text-lg font-bold text-primary">
                            {hotel.currency} {hotel.price}
                          </div>
                          <Button 
                            size="sm"
                            onClick={() => {
                              setPaymentAmount(hotel.price);
                              setPaymentDescription(`Hotel: ${hotel.name} - ${hotel.city}`);
                              setShowPayPal(true);
                            }}
                          >
                            Book Now
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {type === "tour_packages" && tourPackages && tourPackages.length > 0 && (
                <div className="mt-4 space-y-3">
                  {tourPackages.map((tour) => (
                    <Card key={tour.id} className="overflow-hidden bg-accent/50 border-primary/20">
                      {tour.image && (
                        <img src={tour.image} alt={tour.name} className="w-full h-32 object-cover" />
                      )}
                      <div className="p-4 space-y-2">
                        <h3 className="text-lg font-bold text-foreground">{tour.name}</h3>
                        <p className="text-sm text-muted-foreground">{tour.description}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{tour.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span>{tour.destinations.join(", ")}</span>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-2xl font-bold text-primary">
                            {tour.currency} {tour.price}
                          </span>
                          <Button 
                            size="sm"
                            onClick={() => {
                              setPaymentAmount(tour.price);
                              setPaymentDescription(`Tour: ${tour.name} - ${tour.duration}`);
                              setShowPayPal(true);
                            }}
                          >
                            Book Now
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="text-sm leading-snug whitespace-pre-wrap">{content}</p>
          )}
        </div>
      </Card>

      {!isAssistant && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-secondary to-secondary/80 shadow-lg">
          <User className="w-6 h-6 text-secondary-foreground" />
        </div>
      )}

      <PayPalPayment 
        open={showPayPal} 
        onOpenChange={setShowPayPal}
        prefilledAmount={paymentAmount}
        itemDescription={paymentDescription}
      />
    </div>
  );
};
