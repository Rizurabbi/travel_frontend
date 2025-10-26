/*import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { CreditCard, Lock } from "lucide-react";
import { ChatContainer } from "@/components/ChatContainer";
import { ChatInput } from "@/components/ChatInput";
import { useChat } from "@/contexts/ChatContext";

const Payment = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const { messages, isLoading, sendMessage } = useChat();

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "Payment Successful!",
        description: "Your booking has been confirmed. Check your email for details.",
      });
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <Layout>
      <div className="bg-background min-h-[calc(100vh-4rem)]">
        {}
        <div className="bg-gradient-to-b from-primary/10 to-background py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Secure Payment
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Complete your booking with our secure payment system
            </p>
          </div>
        </div>

        
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Details
                  </CardTitle>
                  <CardDescription>Enter your payment information below</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePayment} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Cardholder Name</Label>
                      <Input id="cardName" placeholder="John Doe" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" maxLength={5} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" maxLength={3} required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="you@example.com" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" required />
                    </div>

                    <div className="pt-4">
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isProcessing}
                      >
                        {isProcessing ? "Processing..." : "Complete Payment"}
                      </Button>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Lock className="w-4 h-4" />
                      <span>Secured by 256-bit SSL encryption</span>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

           
            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tour Package</span>
                    <span className="font-semibold">$1,299</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Travel Insurance</span>
                    <span className="font-semibold">$59</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service Fee</span>
                    <span className="font-semibold">$25</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">$1,383</span>
                    </div>
                  </div>

                  <div className="pt-4 space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-start gap-2">
                      <span>✓</span>
                      <span>Free cancellation up to 48 hours before departure</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span>✓</span>
                      <span>Instant confirmation via email</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span>✓</span>
                      <span>24/7 customer support</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          
          <div className="max-w-4xl mx-auto mt-12">
            <div className="bg-white rounded-lg shadow-lg border overflow-hidden" style={{ borderColor: '#001540' }}>
              <div className="h-[450px] flex flex-col">
                <ChatContainer messages={messages} isLoading={isLoading} />
                <div className="p-4 border-t bg-white" style={{ borderColor: '#001540' }}>
                  <ChatInput onSendMessage={sendMessage} disabled={isLoading} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Payment;

*/




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

const Payment = () => {
  const { messages, isLoading, sendMessage } = useChat();

  return (
    <Layout>
      <div className="min-h-screen" style={{ backgroundColor: '#9ABDDC' }}>
        {/* Hero Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6" style={{ color: '#001540' }}>
              Banking Services
            </h1>
            <p className="text-xl" style={{ color: '#001540', opacity: 0.8 }}>
              Secure, convenient, and flexible payment solutions for all your travel needs
            </p>
          </div>
        </section>

     <section className="pb-20 px-4">
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="why" className="rounded-lg border-none">
                <AccordionTrigger className="text-2xl font-semibold hover:no-underline text-center justify-center px-6 py-3 rounded-t-lg [&>svg]:ml-8" style={{ color: '#001540', backgroundColor: '#9ABDDC' }}>
                  Why ?
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
                  Why Us ?
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
          <div className="max-w-4xl mx-auto bg-white rounded-lg border-2 p-6" style={{ borderColor: '#001540' }}>
           
            <ChatContainer messages={messages} isLoading={isLoading} />
            <ChatInput onSendMessage={sendMessage} disabled={isLoading} />
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Payment;