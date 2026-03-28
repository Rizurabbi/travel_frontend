// src/pages/Payment.tsx - FINAL VERSION BLENDING YOUR EXISTING CODE + PAYPAL
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ChatContainer } from "@/components/ChatContainer";
import { ChatInput } from "@/components/ChatInput";
import { useChat } from "@/contexts/ChatContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = process.env.REACT_APP_API_URL || "https://openskai.onrender.com";
const PAYPAL_CLIENT_ID = process.env.REACT_APP_PAYPAL_CLIENT_ID || "YOUR_PAYPAL_CLIENT_ID";

declare global {
  interface Window {
    paypal: any;
  }
}

const Payment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, token, refreshUser } = useAuth();
  const { toast } = useToast();
  const { messages, isLoading: isChatLoading, sendMessage } = useChat();

  // Get payment details from URL (if this is a payment completion page)
  const paymentType = searchParams.get('type'); // 'booking' or 'support'
  const orderId = searchParams.get('order');
  const bookingId = searchParams.get('booking_id');
  const supportId = searchParams.get('support_id');
  const amount = searchParams.get('amount');

  const [isPaymentMode, setIsPaymentMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Check if this is a payment completion page
    if (orderId && (bookingId || supportId)) {
      setIsPaymentMode(true);
      
      // Require authentication for payment
      if (!user || !token) {
        navigate('/auth');
        return;
      }

      // Load PayPal SDK
      loadPayPalScript();
    }
  }, [orderId, bookingId, supportId, user, token]);

  const loadPayPalScript = () => {
    if (window.paypal) {
      renderPayPalButton();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`;
    script.async = true;
    
    script.onload = () => renderPayPalButton();
    script.onerror = () => {
      setIsLoading(false);
      setErrorMessage('Failed to load PayPal. Please try again.');
    };

    document.body.appendChild(script);
  };

  const renderPayPalButton = () => {
    if (!window.paypal) {
      setErrorMessage('PayPal SDK not loaded');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    window.paypal.Buttons({
      createOrder: () => orderId,

      onApprove: async (data: any) => {
        setIsLoading(true);

        try {
          const response = await fetch(`${API_BASE_URL}/api/paypal/capture-order`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              order_id: data.orderID,
              booking_id: bookingId || undefined,
              support_access_id: supportId || undefined
            })
          });

          const result = await response.json();

          if (result.success) {
            setPaymentStatus('success');
            await refreshUser();

            toast({
              title: "Payment Successful!",
              description: paymentType === 'support' 
                ? 'Your support access has been activated'
                : 'Your booking is confirmed',
            });

            setTimeout(() => {
              if (paymentType === 'support') {
                navigate('/customer-support');
              } else {
                navigate('/my-bookings');
              }
            }, 2000);

          } else {
            throw new Error(result.error || 'Payment capture failed');
          }

        } catch (error: any) {
          setPaymentStatus('failed');
          setErrorMessage(error.message);
          
          toast({
            title: "Payment Failed",
            description: error.message,
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      },

      onError: (err: any) => {
        console.error('PayPal error:', err);
        setPaymentStatus('failed');
        setErrorMessage('Payment failed. Please try again.');
        
        toast({
          title: "Payment Error",
          description: "Something went wrong with PayPal",
          variant: "destructive",
        });
      },

      onCancel: () => {
        toast({
          title: "Payment Cancelled",
          description: "You cancelled the payment",
        });
        navigate(-1);
      }

    }).render('#paypal-button-container').then(() => {
      setIsLoading(false);
    });
  };

  // ==========================================
  // PAYMENT COMPLETION SCREENS
  // ==========================================

  // Success Screen
  if (isPaymentMode && paymentStatus === 'success') {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#2185FF' }}>
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-green-100 p-3">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl" style={{ color: '#001540' }}>
                Payment Successful!
              </CardTitle>
              <CardDescription>
                Your payment has been processed successfully
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              {paymentType === 'support' ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    Your customer support access is now active
                  </p>
                  <Badge className="bg-green-500">Support Access Active</Badge>
                  <p className="text-xs text-muted-foreground">
                    Redirecting to support chat...
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    Your booking has been confirmed
                  </p>
                  <Badge className="bg-green-500">Booking Confirmed</Badge>
                  <p className="text-xs text-muted-foreground">
                    Redirecting to your bookings...
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // Failed Screen
  if (isPaymentMode && paymentStatus === 'failed') {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#2185FF' }}>
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-red-100 p-3">
                  <XCircle className="w-12 h-12 text-red-600" />
                </div>
              </div>
              <CardTitle className="text-2xl" style={{ color: '#001540' }}>
                Payment Failed
              </CardTitle>
              <CardDescription>
                {errorMessage || 'Something went wrong with your payment'}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Button
                onClick={() => navigate(-1)}
                style={{ backgroundColor: '#001540' }}
                className="w-full"
              >
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // Payment Processing Screen
  if (isPaymentMode && paymentStatus === 'pending') {
    return (
      <Layout>
        <div className="min-h-screen py-12 px-4" style={{ backgroundColor: '#2185FF' }}>
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl mb-2" style={{ color: '#001540' }}>
                  Complete Your Payment
                </CardTitle>
                <CardDescription>
                  Secure payment powered by PayPal
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Payment Summary */}
                <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                  <h3 className="font-semibold text-lg mb-3" style={{ color: '#001540' }}>
                    Payment Summary
                  </h3>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">
                      {paymentType === 'support' ? 'Support Access' : 'Booking'}
                    </span>
                  </div>

                  {amount && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-medium">${amount} USD</span>
                    </div>
                  )}

                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold">Total:</span>
                      <span className="font-bold text-lg" style={{ color: '#001540' }}>
                        ${amount || '0.00'} USD
                      </span>
                    </div>
                  </div>
                </div>

                {/* PayPal Button Container */}
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin mb-4" style={{ color: '#001540' }} />
                      <p className="text-sm text-muted-foreground">Loading PayPal...</p>
                    </div>
                  ) : errorMessage ? (
                    <div className="text-center py-8">
                      <p className="text-red-600 mb-4">{errorMessage}</p>
                      <Button
                        onClick={() => window.location.reload()}
                        style={{ backgroundColor: '#001540' }}
                      >
                        Retry
                      </Button>
                    </div>
                  ) : (
                    <div id="paypal-button-container"></div>
                  )}
                </div>

                {/* Security Notice */}
                <div className="text-center text-xs text-muted-foreground space-y-1">
                  <p>🔒 Your payment information is secure</p>
                  <p>All transactions are encrypted with 256-bit SSL</p>
                </div>

                {/* What Happens Next */}
                <div className="bg-blue-50 rounded-lg p-4 text-sm">
                  <h4 className="font-semibold mb-2" style={{ color: '#001540' }}>
                    What happens next?
                  </h4>
                  <ul className="space-y-1 text-muted-foreground">
                    {paymentType === 'support' ? (
                      <>
                        <li>✓ Complete payment via PayPal</li>
                        <li>✓ Your support access will be activated immediately</li>
                        <li>✓ Start chatting with our AI support</li>
                      </>
                    ) : (
                      <>
                        <li>✓ Complete payment via PayPal</li>
                        <li>✓ Your booking will be confirmed</li>
                        <li>✓ You'll receive a confirmation email</li>
                        <li>✓ Access your booking in "My Bookings"</li>
                      </>
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  // ==========================================
  // DEFAULT: BANKING SERVICES PAGE (Your existing design)
  // ==========================================

  return (
    <Layout>
      <div className="h-screen overflow-hidden flex flex-col" style={{ backgroundColor: '#9ABDDC' }}>
        {/* Hero Section */}
        <section className="py-16 px-4 flex-shrink-0">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6" style={{ color: '#001540' }}>
              Banking Services
            </h1>
            <p className="text-xl mb-8" style={{ color: '#001540', opacity: 0.8 }}>
              Secure, convenient, and flexible payment solutions for all your travel needs
            </p>
          </div>
        </section>

        {/* Accordion Section */}
        <section className="pb-20 px-4 flex-shrink-0">
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="why" className="rounded-lg border-none">
                <AccordionTrigger className="text-2xl font-semibold hover:no-underline text-center justify-center px-6 py-3 rounded-t-lg [&>svg]:ml-8" style={{ color: '#001540', backgroundColor: '#9ABDDC' }}>
                  Why 
                </AccordionTrigger>
                <AccordionContent className="text-lg pt-4 px-6 pb-4 rounded-b-lg" style={{ color: '#001540', opacity: 0.8, backgroundColor: '#f8f9fa' }}>
                  We believe travel is more than just visiting new places—it's about creating meaningful experiences. 
                  Our carefully designed tour packages combine adventure, comfort, and cultural immersion to give you 
                  the journey of a lifetime. From exotic beaches to mountain retreats, we handle every detail so you 
                  can focus on making memories.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="why-us" className="rounded-lg border-none">
                <AccordionTrigger className="text-2xl font-semibold hover:no-underline text-center justify-center px-6 py-3 rounded-t-lg [&>svg]:ml-8" style={{ color: '#001540', backgroundColor: '#9ABDDC' }}>
                  Why Us 
                </AccordionTrigger>
                <AccordionContent className="text-lg pt-4 px-6 pb-4 rounded-b-lg" style={{ color: '#001540', opacity: 0.8, backgroundColor: '#f8f9fa' }}>
                  With over a decade of experience in the travel industry, we've perfected the art of creating 
                  unforgettable journeys. Our team of travel experts handpick every destination, accommodation, 
                  and activity to ensure quality and authenticity. We offer 24/7 support, flexible booking options, 
                  and the best value for your money. Plus, our customer satisfaction rate speaks for itself—98% of 
                  our travelers recommend us to friends and family.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq" className="rounded-lg border-none">
                <AccordionTrigger className="text-2xl font-semibold hover:no-underline text-center justify-center px-6 py-3 rounded-t-lg [&>svg]:ml-8" style={{ color: '#001540', backgroundColor: '#9ABDDC' }}>
                  FAQ
                </AccordionTrigger>
                <AccordionContent className="text-lg pt-4 space-y-4 px-6 pb-4 rounded-b-lg" style={{ color: '#001540', opacity: 0.8, backgroundColor: '#f8f9fa' }}>
                  <div>
                    <p className="font-semibold mb-2">How do I book a tour package?</p>
                    <p>You can book directly through our website or contact our customer service team for personalized assistance.</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">What's included in the package price?</p>
                    <p>Our packages typically include accommodation, transportation, select meals, and guided tours. Specific inclusions vary by package.</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Can I customize my tour?</p>
                    <p>Absolutely! We offer flexible customization options to tailor your trip to your preferences and budget.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Chat Section */}
        <section className="pb-8 px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-lg border-2 p-6 flex flex-col" style={{ borderColor: '#001540', maxHeight: '60vh' }}>
            <ChatContainer messages={messages} isLoading={isChatLoading} />
            <ChatInput onSendMessage={sendMessage} disabled={isChatLoading} />
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Payment;
