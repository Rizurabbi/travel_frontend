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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane, Shield, Wallet, Headphones, MapPin, CreditCard } from "lucide-react";

const Index = () => {
  const { messages, isLoading, sendMessage } = useChat();

  return (
    <Layout>
      <div className="h-screen overflow-hidden flex flex-col bg-background" style={{ backgroundColor: "#9ABDDC" }}>
        {/* Header */}
        <header className="py-8 px-4 flex-shrink-0">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-4xl font-bold mb-3" style={{ color: "#001540" }}>
              Welcome to OPENSKAI
            </h1>
            <p className="text-lg" style={{ color: "#282828" }}>
              Your intelligent companion for discovering destinations, planning trips, and exploring the world
            </p>
          </div>
        </header>

  <section className="pb-8 px-4 flex-shrink-0">
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="flex space-x-4">
              <AccordionItem value="why" className="rounded-lg border-none flex-1">
                <AccordionTrigger
                  className="text-2xl font-semibold hover:no-underline text-center justify-center px-6 py-2 rounded-t-lg [&>svg]:ml-8"
                  style={{ color: "#001540", backgroundColor: "#9ABDDC" }}
                >
                  Why 
                </AccordionTrigger>
                <AccordionContent
                  className="text-lg pt-4 px-6 pb-4 rounded-b-lg"
                  style={{ color: "#001540", opacity: 0.8, backgroundColor: "#f8f9fa" }}
                >
                  Because you LOVE to travel!
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="why-us" className="rounded-lg border-none flex-1">
                <AccordionTrigger
                  className="text-2xl font-semibold hover:no-underline text-center justify-center px-6 py-2 rounded-t-lg [&>svg]:ml-8"
                  style={{ color: "#001540", backgroundColor: "#9ABDDC" }}
                >
                  Why Us 
                </AccordionTrigger>
                <AccordionContent
                  className="text-lg pt-4 px-6 pb-4 rounded-b-lg"
                  style={{ color: "#001540", opacity: 0.8, backgroundColor: "#f8f9fa" }}
                >
                  Your comprehensive travel partner, always with you, throughout your travel.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Service Cards with Dialogs */}
        <section className="pb-8 px-4 flex-shrink-0">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Travel Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <div className="flex flex-col items-center text-center cursor-pointer group">
                  <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors" style={{ backgroundColor: '#001540' }}>
                    <Plane className="w-7 h-7" style={{ color: '#d2d9e5ff' }} />
                  </div>
                  <h3 className="text-xl font-bold mt-2" style={{ color: '#001540' }}>Travel</h3>
                  <p className="text-sm mt-1" style={{ color: '#282828' }}>Explore our tour packages</p>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" style={{ backgroundColor: '#9ABDDC' }}>
                <DialogHeader>
                  <DialogTitle className="text-4xl font-bold text-center mb-4" style={{ color: '#001540' }}>
                    Travel & Tour Packages
                  </DialogTitle>
                  <p className="text-center text-lg" style={{ color: '#001540', opacity: 0.8 }}>
                    Discover amazing destinations and create unforgettable memories with our curated travel experiences
                  </p>
                </DialogHeader>
                <div className="mt-6">
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
              </DialogContent>
            </Dialog>

            {/* Travel Insurance Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <div className="flex flex-col items-center text-center cursor-pointer group">
                  <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors" style={{ backgroundColor: '#001540' }}>
                    <Shield className="w-7 h-7" style={{ color: '#d2d9e5ff' }} />
                  </div>
                  <h3 className="text-xl font-bold mt-2" style={{ color: '#001540' }}>Travel Insurance</h3>
                  <p className="text-sm mt-1" style={{ color: '#282828' }}>Stay protected on your journey</p>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" style={{ backgroundColor: '#9ABDDC' }}>
                <DialogHeader>
                  <DialogTitle className="text-4xl font-bold text-center mb-4" style={{ color: '#001540' }}>
                    Travel Insurance
                  </DialogTitle>
                  <p className="text-center text-lg" style={{ color: '#001540', opacity: 0.8 }}>
                    Travel with confidence knowing you're protected against the unexpected
                  </p>
                </DialogHeader>
                <div className="mt-6">
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
              </DialogContent>
            </Dialog>

            {/* Travel Banking Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <div className="flex flex-col items-center text-center cursor-pointer group">
                  <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors" style={{ backgroundColor: '#001540' }}>
                    <Wallet className="w-7 h-7" style={{ color: '#d2d9e5ff' }} />
                  </div>
                  <h3 className="text-xl font-bold mt-2" style={{ color: '#001540' }}>Travel Banking</h3>
                  <p className="text-sm mt-1" style={{ color: '#282828' }}>Secure payment solutions</p>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" style={{ backgroundColor: '#9ABDDC' }}>
                <DialogHeader>
                  <DialogTitle className="text-4xl font-bold text-center mb-4" style={{ color: '#001540' }}>
                    Banking Services
                  </DialogTitle>
                  <p className="text-center text-lg" style={{ color: '#001540', opacity: 0.8 }}>
                    Secure, convenient, and flexible payment solutions for all your travel needs
                  </p>
                </DialogHeader>
                <div className="mt-6">
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
              </DialogContent>
            </Dialog>

            

            {/* Customer Support Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <div className="flex flex-col items-center text-center cursor-pointer group">
                  <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors" style={{ backgroundColor: '#001540' }}>
                    <Headphones className="w-7 h-7" style={{ color: '#d2d9e5ff' }} />
                  </div>
                  <h3 className="text-xl font-bold mt-2" style={{ color: '#001540' }}>Customer Support</h3>
                  <p className="text-sm mt-1" style={{ color: '#282828' }}>24/7 assistance</p>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" style={{ backgroundColor: '#9ABDDC' }}>
                <DialogHeader>
                  <DialogTitle className="text-4xl font-bold text-center mb-4" style={{ color: '#001540' }}>
                    Our Services
                  </DialogTitle>
                  <p className="text-center text-lg" style={{ color: '#001540', opacity: 0.8 }}>
                    Comprehensive travel solutions powered by AI to make your journey seamless and memorable
                  </p>
                </DialogHeader>
                <div className="mt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* Travel Service */}
                    <div className="flex flex-col items-center text-center p-4">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-primary/10">
                        <MapPin className="w-8 h-8" style={{ color: '#001540' }} />
                      </div>
                      <h3 className="text-xl font-semibold mb-3" style={{ color: '#001540' }}>Travel</h3>
                      <p className="text-sm" style={{ color: '#282828' }}>
                        Curated tour packages for popular destinations with guided experiences.
                      </p>
                    </div>

                    {/* Travel Banking Service */}
                    <div className="flex flex-col items-center text-center p-4">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-primary/10">
                        <CreditCard className="w-8 h-8" style={{ color: '#001540' }} />
                      </div>
                      <h3 className="text-xl font-semibold mb-3" style={{ color: '#001540' }}>Travel Banking</h3>
                      <p className="text-sm" style={{ color: '#282828' }}>
                        Secure and convenient banking solutions for your financial needs.
                      </p>
                    </div>

                    {/* Travel Insurance Service */}
                    <div className="flex flex-col items-center text-center p-4">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-primary/10">
                        <Shield className="w-8 h-8" style={{ color: '#001540' }} />
                      </div>
                      <h3 className="text-xl font-semibold mb-3" style={{ color: '#001540' }}>Travel Insurance</h3>
                      <p className="text-sm" style={{ color: '#282828' }}>
                        Comprehensive travel insurance plans to protect your journey.
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-6" style={{ borderColor: '#001540' }}>
                    <h3 className="text-2xl font-bold mb-4" style={{ color: '#001540' }}>Contact Us</h3>
                    <p className="text-lg mb-4" style={{ color: '#282828' }}>
                      Our customer support team is available 24/7 to assist you with any questions or concerns.
                    </p>
                    <div className="space-y-2">
                      <p style={{ color: '#001540' }}><strong>Email:</strong> support@openskai.com</p>
                      <p style={{ color: '#001540' }}><strong>Phone:</strong> +1 (800) 123-4567</p>
                      <p style={{ color: '#001540' }}><strong>Live Chat:</strong> Available in the bottom right corner</p>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </section>

        {/* Chat Area - Grows with conversation */}
        <section className="px-4 pb-8">
          <div className="max-w-4xl mx-auto bg-white rounded-lg border-2 p-6 flex flex-col" style={{ borderColor: '#001540', maxHeight: '60vh' }}>
            <ChatContainer messages={messages} isLoading={isLoading} />
            <ChatInput onSendMessage={sendMessage} disabled={isLoading} />
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
