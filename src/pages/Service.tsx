import { useState } from "react";
import { Layout } from "@/components/Layout";
import { ChatContainer } from "@/components/ChatContainer";
import { ChatInput } from "@/components/ChatInput";
import { useChat } from "@/contexts/ChatContext";
import { Link } from "react-router-dom";
import { Plane, Hotel, MapPin, Calendar, Shield, Headphones, CreditCard, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const Service = () => {
  const { messages, isLoading, sendMessage } = useChat();
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  
  const services = [
    /*
    {
      icon: Plane,
      title: "Flight Booking",
      description: "Find and book the best flights worldwide with competitive prices and flexible options.",
    },
    {
      icon: Hotel,
      title: "Hotel Reservations",
      description: "Access to thousands of hotels globally, from budget to luxury accommodations.",
    },*/
    {
      icon: MapPin,
      title: "Travel",
      description: "Curated tour packages for popular destinations with guided experiences.",
      href : "/travel",
    },
    {
      icon: CreditCard,
      title: "Travel Banking ",
      description: "Secure and convenient banking solutions for your financial needs.",
      href: "/payment",
      
    },
      
    {
      icon: Shield,
      title: "Travel Insurance",
      description: "Comprehensive travel insurance plans to protect your journey.",
      href : "/insurance",
    },
    /*
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Round-the-clock customer support for all your travel needs.",
    },*/
  ];

  return (
    <Layout>
      <div className="bg-background" style={{ backgroundColor: '#9ABDDC' }}>
        {/* Hero Section */}
        <div className="py-8 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-2xl md:text-5xl font-bold mb-4" style={{ color: '#001540' }}>
              Our Services
            </h1>
            <p className="text-lg max-w-1xl mx-auto" style={{ color: '#282828' }}>
              Comprehensive travel solutions powered by AI to make your journey seamless and memorable
            </p>
          </div>
        </div>

    {/* Services Grid (Restored original styling, kept link) */}
        <div className="max-w-7xl mx-auto px-4 py-10"> 
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"> 
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                // Wrapped the content in Link
                <Link
                  key={index}
                  to={service.href} // Link functionality retained
                  className="flex flex-col items-center text-center p-6 cursor-pointer" // Original p-6 spacing
                  style={{ textDecoration: 'none', color: 'inherit' }} // Ensures the link doesn't mess up text colors
                >
   {/* Icon Container (w-16 h-16, original size/spacing) */}
<div className="w-7 h-7 rounded-full flex items-center justify-center mb-4">
  {/* Icon (w-8 h-8, original size) */}
  <Icon className="w-6 h-6" style={{ color: '#001540' }} />
</div>
                  <h3 className="text-xl font-semibold mb-3" style={{ color: '#001540' }}> 
                    {service.title}
                  </h3>
                  <p className="text-base" style={{ color: '#282828' }}> 
                    {service.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Chat Section *
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-xl border overflow-hidden" style={{ borderColor: '#001540' }}>
            <button
              onClick={() => setIsChatExpanded(!isChatExpanded)}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-all"
            >
              <div className="text-left">
                <h2 className="text-2xl font-bold" style={{ color: '#001540' }}>
                  Ask Our AI Assistant
                </h2>
                <p className="text-sm" style={{ color: '#282828' }}>
                  Get personalized recommendations for your travel needs
                </p>
              </div>
              <Button variant="ghost" size="icon" className="flex-shrink-0">
                {isChatExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
              </Button>
            </button>
            
            <div className={`transition-all duration-300 ${isChatExpanded ? 'h-[450px]' : 'h-[120px]'} flex flex-col`}>
              <div className="flex-1 overflow-hidden">
                <ChatContainer messages={messages} isLoading={isLoading} />
              </div>
              <div className="p-4 border-t bg-white" style={{ borderColor: '#001540' }}>
                <ChatInput 
                  onSendMessage={(msg) => {
                    if (!isChatExpanded) setIsChatExpanded(true);
                    sendMessage(msg);
                  }} 
                  disabled={isLoading} 
                />
              </div>
            </div>
          </div>
        </div>N */}


                {/* Chat Section */}
        <section className="pb-8 px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-lg border-2 p-6" style={{ borderColor: '#001540' }}>
            
            <ChatContainer messages={messages} isLoading={isLoading} />
            <ChatInput onSendMessage={sendMessage} disabled={isLoading} />
          </div>
        </section>

        {/* CTA Section */}
        <div className="py-20 px-4 mt-12" style={{ backgroundColor: '#001540' }}>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-white/95 mb-8">
              Let our AI travel assistant help you plan the perfect trip
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Service;