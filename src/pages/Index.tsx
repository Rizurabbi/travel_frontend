import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChatContainer } from "@/components/ChatContainer";
import { ChatInput } from "@/components/ChatInput";
import { useChat } from "@/contexts/ChatContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import "../styles/index.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  process.env.REACT_APP_API_URL ||
  "https://openskai.onrender.com";

const Index = () => {
  const navigate = useNavigate();
  const { messages, isLoading, sendMessage } = useChat();
  const { user, token, login } = useAuth();
  const { toast } = useToast();
  const [homeMessage, setHomeMessage] = useState("");
  
  // Customer Support Modal State
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [supportAccessInfo, setSupportAccessInfo] = useState<any>(null);
  const [travelDates, setTravelDates] = useState({ startDate: "", endDate: "" });
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Check user's support access status
  const checkSupportAccess = async () => {
    if (!user || !token) {
      setLoginModalOpen(true);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/support/access-status`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const supportData = data.support_access;
        setSupportAccessInfo(supportData);
        if (supportData?.has_access) {
          setSupportModalOpen(false);
          navigate("/customer-support");
        } else {
          setSupportModalOpen(true);
        }
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to check support access",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to check support access",
        variant: "destructive",
      });
    }
  };

  const calculateDays = () => {
    if (travelDates.startDate && travelDates.endDate) {
      const start = new Date(travelDates.startDate);
      const end = new Date(travelDates.endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      if (days > 0) {
        setEstimatedCost(days);
      }
    }
  };

  useEffect(() => {
    calculateDays();
  }, [travelDates]);

  const handleSupportPayment = async () => {
    if (!user || !token) {
      setLoginModalOpen(true);
      return;
    }

    if (!travelDates.startDate || !travelDates.endDate) {
      toast({
        title: "Error",
        description: "Please select travel dates",
        variant: "destructive",
      });
      return;
    }

    setSupportModalOpen(false);
    navigate("/support-access", {
      state: {
        selectedDatePlan: {
          days: estimatedCost,
          amount: estimatedCost,
          startDate: travelDates.startDate,
          endDate: travelDates.endDate,
        },
      },
    });
  };

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      toast({
        title: "Error",
        description: "Please enter email and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoggingIn(true);

    try {
      await login(loginEmail, loginPassword);
      setLoginModalOpen(false);
      setSupportModalOpen(false);
      setLoginEmail("");
      setLoginPassword("");
      navigate("/support-access");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Login failed",
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleHomeChatSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = homeMessage.trim();
    if (!trimmed || isLoading) return;

    await sendMessage(trimmed);
    setHomeMessage("");
  };

  const handleHomeChatKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await handleHomeChatSubmit();
    }
  };

  return (
    <Layout>
      <div className="openskai-container">
        {/* no header buttons on index, Navbar handles login/language */}

        {/* Logo Section */}
        <div className="logo-section">
          <img src="/logoname.png" alt="OPENSKAI" className="openskai-name-image" />
        </div>

        {/* Service Cards Section */}
        <div className="services-section">
          {/* Travel Booking Card */}
          <Dialog>
            <DialogTrigger asChild>
              <div className="service-card">
                <img src="/Airplane_Icon.png" alt="Travel booking" className="service-icon" />
                <h3 className="service-title">TRAVEL<br />BOOKING</h3>
                <p className="service-description">Book Air ticket, Hotel, Tour packages and more.</p>
                <button className="learn-more-btn">LEARN MORE...</button>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold mb-4" style={{ color: "#2185FF" }}>
                  Travel Booking
                </DialogTitle>
                <p className="text-lg text-gray-700">
                  Book Air tickets, Hotels, Tour packages and more.
                </p>
              </DialogHeader>
              <div className="mt-6">
                <Accordion type="single" collapsible className="space-y-3">
                  <AccordionItem value="why" className="rounded-lg border">
                    <AccordionTrigger className="text-lg font-semibold px-6 py-3" style={{ color: "#2185FF" }}>
                      Why Travel Booking?
                    </AccordionTrigger>
                    <AccordionContent className="text-base px-6 py-4 text-gray-700">
                      We believe travel is more than just visiting new places—it's about creating meaningful experiences. 
                      Our carefully designed packages combine adventure, comfort, and cultural immersion to give you 
                      the journey of a lifetime. From exotic beaches to mountain retreats, we handle every detail so you 
                      can focus on making memories.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="why-us" className="rounded-lg border">
                    <AccordionTrigger className="text-lg font-semibold px-6 py-3" style={{ color: "#2185FF" }}>
                      Why Us?
                    </AccordionTrigger>
                    <AccordionContent className="text-base px-6 py-4 text-gray-700">
                      With over a decade of experience, we've perfected the art of crafting unforgettable journeys. 
                      Our team handpicks every destination and activity to ensure quality and authenticity. 
                      We offer 24/7 support, flexible booking options, and the best value for your money.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </DialogContent>
          </Dialog>

          {/* Travel Insurance Card */}
          <Dialog>
            <DialogTrigger asChild>
              <div className="service-card">
                <img src="/Shield_Icon.png" alt="Travel insurance" className="service-icon" />
                <h3 className="service-title">TRAVEL<br />INSURANCE</h3>
                <p className="service-description">Stay protected on your journey</p>
                <button className="learn-more-btn">LEARN MORE...</button>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold mb-4" style={{ color: "#2185FF" }}>
                  Travel Insurance
                </DialogTitle>
                <p className="text-lg text-gray-700">
                  Travel with confidence knowing you're protected against the unexpected
                </p>
              </DialogHeader>
              <div className="mt-6">
                <Accordion type="single" collapsible className="space-y-3">
                  <AccordionItem value="why" className="rounded-lg border">
                    <AccordionTrigger className="text-lg font-semibold px-6 py-3" style={{ color: "#2185FF" }}>
                      Why Insurance?
                    </AccordionTrigger>
                    <AccordionContent className="text-base px-6 py-4 text-gray-700">
                      Our comprehensive travel insurance protects you from medical emergencies, trip cancellations, 
                      lost luggage, and more. Travel with peace of mind knowing you're covered wherever you go.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </DialogContent>
          </Dialog>

          {/* Travel Banking Card */}
          <Dialog>
            <DialogTrigger asChild>
              <div className="service-card">
                <img src="/Wallet_icon.png" alt="Travel banking" className="service-icon" />
                <h3 className="service-title">TRAVEL<br />BANKING</h3>
                <p className="service-description">Secure payment solutions across borders</p>
                <button className="learn-more-btn">LEARN MORE...</button>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold mb-4" style={{ color: "#2185FF" }}>
                  Travel Banking
                </DialogTitle>
                <p className="text-lg text-gray-700">
                  Secure, convenient, and flexible payment solutions for all your travel needs
                </p>
              </DialogHeader>
              <div className="mt-6">
                <Accordion type="single" collapsible className="space-y-3">
                  <AccordionItem value="features" className="rounded-lg border">
                    <AccordionTrigger className="text-lg font-semibold px-6 py-3" style={{ color: "#2185FF" }}>
                      Key Features
                    </AccordionTrigger>
                    <AccordionContent className="text-base px-6 py-4 text-gray-700">
                      Multi-currency support, Competitive exchange rates, Secure transactions, 24/7 customer support
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </DialogContent>
          </Dialog>

          {/* Customer Support Card */}
          <Dialog open={supportModalOpen} onOpenChange={setSupportModalOpen}>
            <DialogTrigger asChild>
              <div className="service-card" onClick={checkSupportAccess}>
                <img src="/Support_Icon.png" alt="Customer support" className="service-icon" />
                <h3 className="service-title">CUSTOMER<br />SUPPORT</h3>
                <p className="service-description">24/7 assistance</p>
                <button className="learn-more-btn">LEARN MORE...</button>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
              {
                <>
                  <DialogHeader>
                    <DialogTitle className="text-3xl font-bold mb-4" style={{ color: "#2185FF" }}>
                      24/7 Customer Support
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="p-4 rounded-lg" style={{ backgroundColor: "#f0f4ff", borderLeft: "4px solid #2185FF" }}>
                      <h3 className="font-bold text-lg mb-3" style={{ color: "#001540" }}>
                        About Our Support Service
                      </h3>
                      <p className="text-gray-700 mb-3">
                        This service is available to all customers who have purchased from our site. 
                        If you haven't purchased from us yet, there is a <strong>$1 per day</strong> charge to use our support line.
                      </p>
                      <p className="text-gray-700">
                        We'll need to know your exact travel dates to calculate the total charge. 
                        Once you provide your dates, we'll show you the cost and process your payment.
                      </p>
                    </div>

                    {!user ? (
                      <div className="text-center py-4">
                        <p className="mb-4 text-gray-700">Please log in to proceed with support access</p>
                        <Button
                          onClick={() => {
                            setSupportModalOpen(false);
                            setLoginModalOpen(true);
                          }}
                          style={{
                            backgroundColor: "#2185FF",
                            color: "white",
                            fontWeight: "600",
                          }}
                        >
                          Log In or Sign Up
                        </Button>
                      </div>
                    ) : supportAccessInfo?.has_access ? (
                      <div className="p-4 rounded-lg text-center" style={{ backgroundColor: "#e8f5e9" }}>
                        <p className="text-green-700 font-bold text-lg">
                          ✓ You already have support access
                        </p>
                        <Button
                          onClick={() => navigate("/customer-support")}
                          className="mt-4"
                          style={{
                            backgroundColor: "#2185FF",
                            color: "white",
                            fontWeight: "600",
                          }}
                        >
                          Open Support Chat
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold mb-2" style={{ color: "#001540" }}>
                            Travel Start Date *
                          </label>
                          <Input
                            type="date"
                            value={travelDates.startDate}
                            onChange={(e) =>
                              setTravelDates({ ...travelDates, startDate: e.target.value })
                            }
                            style={{ borderColor: "#2185FF" }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2" style={{ color: "#001540" }}>
                            Travel End Date *
                          </label>
                          <Input
                            type="date"
                            value={travelDates.endDate}
                            onChange={(e) =>
                              setTravelDates({ ...travelDates, endDate: e.target.value })
                            }
                            style={{ borderColor: "#2185FF" }}
                          />
                        </div>

                        {estimatedCost > 0 && (
                          <div className="p-4 rounded-lg text-center" style={{ backgroundColor: "#fff3cd", borderLeft: "4px solid #FFF200" }}>
                            <p className="text-sm text-gray-700">Estimated Cost</p>
                            <p className="text-3xl font-bold" style={{ color: "#2185FF" }}>
                              ${estimatedCost}.00
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {estimatedCost} day{estimatedCost !== 1 ? "s" : ""} × $1/day
                            </p>
                          </div>
                        )}

                        <Button
                          onClick={handleSupportPayment}
                          disabled={isProcessingPayment || estimatedCost === 0}
                          className="w-full"
                          style={{
                            backgroundColor: "#2185FF",
                            color: "white",
                            fontWeight: "600",
                          }}
                        >
                          {isProcessingPayment ? "Processing..." : "Continue to Payment Plans"}
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              }
            </DialogContent>
          </Dialog>
        </div>

        {/* Chat Input Section */}
        <div className="chat-section">
          {(messages.length > 0 || isLoading) && (
            <div className="chat-messages-area">
              <ChatContainer messages={messages} isLoading={isLoading} />
            </div>
          )}
          <form className="chat-input-wrapper" onSubmit={handleHomeChatSubmit}>
            <input
              type="text"
              placeholder="Ask me anything about your travel plans..."
              className="chat-input"
              value={homeMessage}
              onChange={(e) => setHomeMessage(e.target.value)}
              onKeyDown={handleHomeChatKeyDown}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="send-btn"
              disabled={isLoading || !homeMessage.trim()}
              aria-label="Send message"
            >
              <Send size={24} />
            </button>
          </form>
        </div>
      </div>

      {/* Login Modal */}
      <Dialog open={loginModalOpen} onOpenChange={setLoginModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-3">
              <img src="/WinLogoGlow.png" alt="Logo" style={{ height: 64, objectFit: "contain" }} />
            </div>
            <DialogTitle className="text-2xl font-bold text-center" style={{ color: "#2185FF" }}>
              Log In
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "#001540" }}>
                Email
              </label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                style={{ borderColor: "#2185FF" }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "#001540" }}>
                Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                style={{ borderColor: "#2185FF" }}
              />
            </div>
            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full"
              style={{
                backgroundColor: "#2185FF",
                color: "white",
                fontWeight: "600",
              }}
            >
              {isLoggingIn ? "Logging in..." : "Log In"}
            </Button>
            <p className="text-center text-sm" style={{ color: "#001540" }}>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setLoginModalOpen(false);
                  setSupportModalOpen(false);
                  navigate("/auth");
                }}
                style={{
                  color: "#2185FF",
                  fontWeight: "600",
                  textDecoration: "none",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Sign up here
              </button>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Index;
