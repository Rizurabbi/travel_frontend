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

const Insurance = () => {
  const { messages, isLoading, sendMessage } = useChat();

  return (
    <Layout>
      <div className="min-h-screen" style={{ backgroundColor: '#9ABDDC' }}>
        {/* Hero Section */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6" style={{ color: '#001540' }}>
              Travel Insurance
            </h1>
            <p className="text-xl" style={{ color: '#001540', opacity: 0.8 }}>
              Travel with confidence knowing you're protected against the unexpected
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

export default Insurance;