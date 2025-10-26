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

const Index = () => {
  const { messages, isLoading, sendMessage } = useChat();

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-background" style={{ backgroundColor: '#9ABDDC' }}>
        {/* Header */}
        <header className="py-12 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-4xl font-bold mb-3" style={{ color: '#001540' }}>
              Welcome to OPENSKAI
            </h1>
            <p className="text-lg" style={{ color: '#282828' }}>
              Your intelligent companion for discovering destinations, planning trips, and exploring the world
            </p>
            
          </div>
        </header>

     <section className="pb-20 px-4">
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="why" className="rounded-lg border-none">
                <AccordionTrigger className="text-2xl font-semibold hover:no-underline text-center justify-center px-6 py-2 rounded-t-lg [&>svg]:ml-8" style={{ color: '#001540', backgroundColor: '#9ABDDC' }}>
                  Why ?
                </AccordionTrigger>
                <AccordionContent className="text-lg pt-4 px-6 pb-4 rounded-b-lg" style={{ color: '#001540', opacity: 0.8, backgroundColor: '#f8f9fa' }}>
                  
                  Because you LOVE to travel!
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="why-us" className="rounded-lg border-none">
                <AccordionTrigger className="text-2xl font-semibold hover:no-underline text-center justify-center px-6 py-2 rounded-t-lg [&>svg]:ml-8" style={{ color: '#001540', backgroundColor: '#9ABDDC' }}>
                  Why Us ?
                </AccordionTrigger>
                <AccordionContent className="text-lg pt-4 px-6 pb-4 rounded-b-lg" style={{ color: '#001540', opacity: 0.8, backgroundColor: '#f8f9fa' }}>
                 Your comprehensive travel partner, always with you, throughout your travel.
                </AccordionContent>
              </AccordionItem>


            </Accordion>
          </div>
        </section>
        {/* Chat Area */}
        <main className="flex-1 flex flex-col max-w-5xl w-full mx-auto px-4 pb-4">
          <div className="flex-1 flex flex-col bg-white rounded-xl shadow-lg border overflow-hidden" style={{ borderColor: '#001540' }}>
            <ChatContainer messages={messages} isLoading={isLoading} />
            <div className="p-4 border-t bg-white" style={{ borderColor: '#001540' }}>
              <ChatInput onSendMessage={sendMessage} disabled={isLoading} />
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default Index;