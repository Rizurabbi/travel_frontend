// // src/pages/CustomerSupport.tsx
// import { useState } from 'react';
// import { Layout } from '@/components/Layout';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { MessageCircle, Send } from 'lucide-react';
// import { useAuth } from '@/contexts/AuthContext';
// import { useToast } from '@/hooks/use-toast';

// const API_BASE_URL = import.meta.env.VITE_API_URL || 
//                      process.env.REACT_APP_API_URL || 
//                      "http://localhost:3002";  // ← Default to localhost


// interface Message {
//   role: 'user' | 'assistant';
//   content: string;
// }

// const CustomerSupport = () => {
//   const { user, token } = useAuth();
//   const { toast } = useToast();
  
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       role: 'assistant',
//       content: 'Hello! I\'m your AI customer support assistant. How can I help you today?'
//     }
//   ]);
//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const sendMessage = async () => {
//     if (!input.trim() || isLoading) return;

//     const userMessage: Message = { role: 'user', content: input };
//     setMessages(prev => [...prev, userMessage]);
//     setInput('');
//     setIsLoading(true);

//     try {
//       const response = await fetch(`${API_BASE_URL}/api/support/chat`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           messages: [...messages, userMessage]
//         })
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to send message');
//       }

//       if (data.success) {
//         const assistantMessage: Message = {
//           role: 'assistant',
//           content: data.message
//         };
//         setMessages(prev => [...prev, assistantMessage]);
//       }

//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message,
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   return (
//     <Layout>
//       <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#9ABDDC' }}>
//         <div className="max-w-4xl mx-auto">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <h1 className="text-4xl font-bold mb-2" style={{ color: '#001540' }}>
//               Customer Support
//             </h1>
//             <p className="text-lg" style={{ color: '#282828' }}>
//               AI-powered assistance for all your travel needs
//             </p>
            
//             {/* Support Status Badge */}
//             <div className="mt-4">
//               <Badge className="bg-green-500">
//                 Support Access Active
//               </Badge>
//             </div>
//           </div>

//           {/* Chat Card */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <MessageCircle className="w-5 h-5" style={{ color: '#001540' }} />
//                 Live Support Chat
//               </CardTitle>
//               <CardDescription>
//                 Get instant help from our AI assistant
//               </CardDescription>
//             </CardHeader>

//             <CardContent>
//               {/* Messages Container */}
//               <div className="h-[500px] overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg space-y-4">
//                 {messages.map((message, index) => (
//                   <div
//                     key={index}
//                     className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
//                   >
//                     <div
//                       className={`max-w-[80%] rounded-lg p-4 ${
//                         message.role === 'user'
//                           ? 'text-white'
//                           : 'bg-white border border-gray-200'
//                       }`}
//                       style={message.role === 'user' ? { backgroundColor: '#001540' } : {}}
//                     >
//                       <div className="flex items-center gap-2 mb-2">
//                         <span className="text-xs font-semibold">
//                           {message.role === 'user' ? 'You' : 'Support'}
//                         </span>
//                       </div>
//                       <p className="text-sm whitespace-pre-wrap">{message.content}</p>
//                     </div>
//                   </div>
//                 ))}

//                 {/* Loading Indicator */}
//                 {isLoading && (
//                   <div className="flex justify-start">
//                     <div className="bg-white border border-gray-200 rounded-lg p-4">
//                       <div className="flex items-center gap-2">
//                         <div className="flex gap-1">
//                           <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
//                           <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
//                           <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
//                         </div>
//                         <span className="text-xs text-muted-foreground">Support is typing...</span>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Input Area */}
//               <div className="flex gap-2">
//                 <Input
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   onKeyPress={handleKeyPress}
//                   placeholder="Type your message..."
//                   disabled={isLoading}
//                   className="flex-1"
//                 />
//                 <Button
//                   onClick={sendMessage}
//                   disabled={isLoading || !input.trim()}
//                   style={{ backgroundColor: '#001540' }}
//                 >
//                   <Send className="w-4 h-4" />
//                 </Button>
//               </div>

//               {/* Quick Actions */}
//               <div className="mt-4 flex flex-wrap gap-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setInput('I need help with my booking')}
//                   disabled={isLoading}
//                 >
//                   Booking Help
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setInput('How do I cancel or modify my booking?')}
//                   disabled={isLoading}
//                 >
//                   Cancel/Modify
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setInput('I have a payment issue')}
//                   disabled={isLoading}
//                 >
//                   Payment Issue
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setInput('Tell me about tour packages')}
//                   disabled={isLoading}
//                 >
//                   Tour Packages
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Help Info */}
//           <div className="mt-6 text-center text-sm text-muted-foreground">
//             <p>Need urgent assistance? Email us at support@openskai.com</p>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default CustomerSupport;


// src/pages/CustomerSupport.tsx - FIXED API URL
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send, MessageCircle, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 
                     process.env.REACT_APP_API_URL || 
                     "http://localhost:3002";  // ← Default to localhost

console.log('🔍 CustomerSupport - API URL:', API_BASE_URL);

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const CustomerSupport = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [daysRemaining, setDaysRemaining] = useState(0);

  useEffect(() => {
    if (!user || !token) {
      navigate('/auth');
      return;
    }

    checkAccess();
  }, [user, token]);

  useEffect(() => {
    // Send initial greeting from AI when chat loads
    if (hasAccess && messages.length === 0) {
      const greeting = `Hello ${user?.full_name || 'there'}! 👋 Welcome to OPENSKAI Customer Support. I'm your AI assistant, and I'm here to help you with any questions about your bookings, travel plans, or our services. How may I assist you today?`;
      
      setMessages([{
        role: 'assistant',
        content: greeting
      }]);
    }
  }, [hasAccess]);

  const checkAccess = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/support/access-status`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setHasAccess(data.support_access.has_access);
        setDaysRemaining(data.support_access.days_remaining);

        if (!data.support_access.has_access) {
          navigate('/support-access');
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to verify support access",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      console.log('💬 Sending message to support chat...');
      console.log('Messages:', [...messages, userMessage]);

      const response = await fetch(`${API_BASE_URL}/api/support/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        })
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Error response:', errorData);
        throw new Error(errorData?.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Chat response:', data);

      if (data.success) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.message
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error: any) {
      console.error('❌ Chat error:', error);
      
      // Add error message to chat
      const errorMessage: Message = {
        role: 'assistant',
        content: `I apologize, but I encountered an error: ${error.message}. Please try again or contact support if the issue persists.`
      };
      setMessages(prev => [...prev, errorMessage]);

      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (hasAccess === null) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#9ABDDC' }}>
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#001540' }} />
        </div>
      </Layout>
    );
  }

  if (hasAccess === false) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#9ABDDC' }}>
          <Card className="max-w-md">
            <CardContent className="pt-6 text-center">
              <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">Access Required</h2>
              <p className="text-muted-foreground mb-6">
                You need customer support access to use this feature
              </p>
              <Button
                onClick={() => navigate('/support-access')}
                style={{ backgroundColor: '#001540' }}
              >
                Get Support Access
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-12 px-4" style={{ backgroundColor: '#9ABDDC' }}>
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2" style={{ color: '#001540' }}>
                  AI Customer Support
                </h1>
                <p style={{ color: '#282828' }}>
                  Get instant help with your travel questions
                </p>
              </div>
              <Badge className="bg-green-500">
                {daysRemaining} days remaining
              </Badge>
            </div>
          </div>

          {/* Chat Container */}
          <Card className="h-[600px] flex flex-col">
            <CardHeader style={{ backgroundColor: '#001540' }}>
              <CardTitle className="flex items-center gap-2 text-white">
                <MessageCircle className="w-5 h-5" />
                Support Chat
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-y-auto p-6">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center">
                  <div>
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">How can we help you today?</h3>
                    <p className="text-muted-foreground">
                      Ask anything about your bookings, travel plans, or our services
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          message.role === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg p-4">
                        <Loader2 className="w-5 h-5 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  style={{ backgroundColor: '#001540' }}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

        </div>
      </div>
    </Layout>
  );
};

export default CustomerSupport;