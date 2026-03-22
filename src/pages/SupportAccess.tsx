// // src/pages/SupportAccess.tsx - COMPLETELY FIXED VERSION
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
// import { Layout } from '@/components/Layout';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { CheckCircle2, XCircle, MessageCircle, Package, Loader2 } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast';

// // CRITICAL: Use correct API URL
// const API_BASE_URL = import.meta.env.VITE_API_URL || 
//                      process.env.REACT_APP_API_URL || 
//                      "http://localhost:3002";  // ← Default to localhost!

// const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || 
//                          process.env.REACT_APP_PAYPAL_CLIENT_ID;

// // Debug logging
// console.log('🔍 SupportAccess - API URL:', API_BASE_URL);
// console.log('🔍 SupportAccess - PayPal Client ID:', PAYPAL_CLIENT_ID ? 'Set ✅' : 'Missing ❌');

// declare global {
//   interface Window {
//     paypal: any;
//   }
// }

// interface SupportStatus {
//   has_access: boolean;
//   type: string | null;
//   expires_at: string | null;
//   days_remaining: number;
// }

// interface PricingPlan {
//   amount: number;
//   currency: string;
//   duration_days: number;
//   name: string;
// }

// const SupportAccess = () => {
//   const { user, token, refreshUser } = useAuth();
//   const navigate = useNavigate();
//   const { toast } = useToast();
  
//   const [supportStatus, setSupportStatus] = useState<SupportStatus | null>(null);
//   const [pricing, setPricing] = useState<{ monthly: PricingPlan; yearly: PricingPlan } | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | null>(null);
//   const [paypalOrderId, setPaypalOrderId] = useState<string | null>(null);
//   const [supportAccessId, setSupportAccessId] = useState<string | null>(null);

//   useEffect(() => {
//     console.log('🔍 Auth check - User:', user ? 'Logged in' : 'Not logged in');
//     console.log('🔍 Auth check - Token:', token ? 'Present' : 'Missing');
    
//     if (!user || !token) {
//       navigate('/auth');
//       return;
//     }

//     fetchSupportStatus();
//   }, [user, token]);

//   const fetchSupportStatus = async () => {
//     const url = `${API_BASE_URL}/api/support/access-status`;
//     console.log('📡 Fetching support status from:', url);
    
//     try {
//       const response = await fetch(url, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       console.log('📡 Response status:', response.status);

//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//       }

//       const data = await response.json();
//       console.log('✅ Support status data:', data);

//       if (data.success) {
//         setSupportStatus(data.support_access);
//         setPricing(data.pricing);
//       } else {
//         throw new Error(data.error || 'Failed to fetch status');
//       }
//     } catch (error: any) {
//       console.error('❌ Fetch error:', error);
//       toast({
//         title: "Connection Error",
//         description: `Cannot connect to backend: ${error.message}`,
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const purchaseSupport = async (plan: 'monthly' | 'yearly') => {
//     if (!pricing) {
//       console.error('❌ No pricing data');
//       return;
//     }

//     console.log('💳 Starting purchase for plan:', plan);
//     setSelectedPlan(plan);

//     try {
//       // Step 1: Create support purchase order
//       console.log('📡 Step 1: Creating support purchase order...');
//       const orderResponse = await fetch(`${API_BASE_URL}/api/support/purchase`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ plan })
//       });

//       console.log('📡 Order response status:', orderResponse.status);

//       if (!orderResponse.ok) {
//         const errorData = await orderResponse.json().catch(() => ({}));
//         throw new Error(errorData.error || `HTTP ${orderResponse.status}`);
//       }

//       const orderData = await orderResponse.json();
//       console.log('✅ Order created:', orderData);

//       if (!orderData.success) {
//         throw new Error(orderData.error || 'Failed to create purchase order');
//       }

//       const { id: support_access_id, amount, currency } = orderData.access;
//       setSupportAccessId(support_access_id);

//       // Step 2: Create PayPal order
//       console.log('📡 Step 2: Creating PayPal order...');
//       const paypalResponse = await fetch(`${API_BASE_URL}/api/paypal/create-order`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           support_access_id,
//           amount,
//           currency
//         })
//       });

//       console.log('📡 PayPal response status:', paypalResponse.status);

//       if (!paypalResponse.ok) {
//         const errorData = await paypalResponse.json().catch(() => ({}));
//         throw new Error(errorData.error || `PayPal order failed: HTTP ${paypalResponse.status}`);
//       }

//       const paypalData = await paypalResponse.json();
//       console.log('✅ PayPal order created:', paypalData);

//       if (!paypalData.success || !paypalData.orderId) {
//         throw new Error('No PayPal order ID returned');
//       }

//       setPaypalOrderId(paypalData.orderId);

//       // Step 3: Load PayPal SDK and render buttons
//       loadPayPalSDK(paypalData.orderId, support_access_id);

//     } catch (error: any) {
//       console.error('❌ Purchase error:', error);
//       toast({
//         title: "Purchase Failed",
//         description: error.message,
//         variant: "destructive",
//       });
//       setSelectedPlan(null);
//     }
//   };

//   const loadPayPalSDK = (orderId: string, supportAccessId: string) => {
//     console.log('💳 Loading PayPal SDK...');

//     if (!PAYPAL_CLIENT_ID) {
//       toast({
//         title: "Configuration Error",
//         description: "PayPal Client ID is not configured",
//         variant: "destructive",
//       });
//       setSelectedPlan(null);
//       return;
//     }

//     if (window.paypal) {
//       console.log('✅ PayPal SDK already loaded');
//       renderPayPalButtons(orderId, supportAccessId);
//       return;
//     }

//     const script = document.createElement('script');
//     script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`;
//     script.async = true;
    
//     script.onload = () => {
//       console.log('✅ PayPal SDK loaded');
//       renderPayPalButtons(orderId, supportAccessId);
//     };

//     script.onerror = () => {
//       console.error('❌ PayPal SDK failed to load');
//       toast({
//         title: "Error",
//         description: "Failed to load PayPal. Please refresh the page.",
//         variant: "destructive",
//       });
//       setSelectedPlan(null);
//     };

//     document.body.appendChild(script);
//   };

//   const renderPayPalButtons = (orderId: string, supportAccessId: string) => {
//     const container = document.getElementById('paypal-button-container');
//     if (!container) {
//       console.error('❌ PayPal container not found');
//       return;
//     }

//     console.log('💳 Rendering PayPal buttons for order:', orderId);

//     // Clear previous buttons
//     container.innerHTML = '';

//     window.paypal.Buttons({
//       createOrder: () => {
//         console.log('💳 PayPal: Using order ID:', orderId);
//         return orderId;
//       },

//       onApprove: async (data: any) => {
//         console.log('✅ PayPal approved:', data);
        
//         try {
//           const response = await fetch(`${API_BASE_URL}/api/paypal/capture-order`, {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//               'Authorization': `Bearer ${token}`
//             },
//             body: JSON.stringify({
//               order_id: data.orderID,
//               support_access_id: supportAccessId
//             })
//           });

//           const result = await response.json();
//           console.log('💳 Capture result:', result);

//           if (result.success) {
//             await refreshUser();
            
//             toast({
//               title: "Success!",
//               description: "Your support access has been activated",
//             });

//             setSelectedPlan(null);
//             setPaypalOrderId(null);
            
//             // Refresh status
//             await fetchSupportStatus();

//             // Navigate to support chat
//             setTimeout(() => {
//               navigate('/customer-support');
//             }, 1500);

//           } else {
//             throw new Error(result.error || 'Payment capture failed');
//           }

//         } catch (error: any) {
//           console.error('❌ Capture error:', error);
//           toast({
//             title: "Payment Failed",
//             description: error.message,
//             variant: "destructive",
//           });
//           setSelectedPlan(null);
//         }
//       },

//       onError: (err: any) => {
//         console.error('❌ PayPal error:', err);
//         toast({
//           title: "Payment Error",
//           description: "Something went wrong with PayPal",
//           variant: "destructive",
//         });
//         setSelectedPlan(null);
//       },

//       onCancel: () => {
//         console.log('⚠️ PayPal cancelled');
//         toast({
//           title: "Payment Cancelled",
//           description: "You cancelled the payment",
//         });
//         setSelectedPlan(null);
//       }

//     }).render('#paypal-button-container');
//   };

//   if (isLoading) {
//     return (
//       <Layout>
//         <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#9ABDDC' }}>
//           <div className="text-center">
//             <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: '#001540' }} />
//             <p style={{ color: '#001540' }}>Loading support access...</p>
//           </div>
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <div className="min-h-screen py-12 px-4" style={{ backgroundColor: '#9ABDDC' }}>
//         <div className="max-w-6xl mx-auto">
//           {/* Header */}
//           <div className="text-center mb-12">
//             <h1 className="text-4xl font-bold mb-4" style={{ color: '#001540' }}>
//               AI Customer Support Access
//             </h1>
//             <p className="text-lg" style={{ color: '#282828' }}>
//               Get personalized support from our AI assistant 24/7
//             </p>
//           </div>

//           {/* Current Status */}
//           <Card className="mb-8">
//             <CardHeader>
//               <CardTitle className="flex items-center justify-between">
//                 <span>Your Support Status</span>
//                 {supportStatus?.has_access ? (
//                   <Badge className="bg-green-500">
//                     <CheckCircle2 className="w-4 h-4 mr-1" />
//                     Active
//                   </Badge>
//                 ) : (
//                   <Badge variant="destructive">
//                     <XCircle className="w-4 h-4 mr-1" />
//                     No Access
//                   </Badge>
//                 )}
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               {supportStatus?.has_access ? (
//                 <div className="space-y-3">
//                   <p className="text-lg">
//                     <strong>Type:</strong>{' '}
//                     {supportStatus.type === 'package_purchase' 
//                       ? 'Included with Package Purchase' 
//                       : 'Paid Subscription'}
//                   </p>
//                   <p className="text-lg">
//                     <strong>Days Remaining:</strong> {supportStatus.days_remaining} days
//                   </p>
//                   {supportStatus.expires_at && (
//                     <p className="text-sm text-muted-foreground">
//                       Expires on: {new Date(supportStatus.expires_at).toLocaleDateString()}
//                     </p>
//                   )}
//                   <Button
//                     onClick={() => navigate('/customer-support')}
//                     className="mt-4"
//                     style={{ backgroundColor: '#001540' }}
//                   >
//                     <MessageCircle className="w-4 h-4 mr-2" />
//                     Open Support Chat
//                   </Button>
//                 </div>
//               ) : (
//                 <div className="text-center py-8">
//                   <XCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
//                   <p className="text-lg mb-2">You don't have customer support access</p>
//                   <p className="text-muted-foreground">
//                     Choose a plan below to get started
//                   </p>
//                 </div>
//               )}
//             </CardContent>
//           </Card>

//           {/* Purchase Options - ALWAYS SHOW if no access */}
//           {!supportStatus?.has_access && pricing && (
//             <>
//               <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: '#001540' }}>
//                 Choose a Plan
//               </h2>
              
//               <div className="grid md:grid-cols-2 gap-8 mb-8">
//                 {/* Monthly Plan */}
//                 <Card className="relative">
//                   <CardHeader>
//                     <CardTitle>Monthly Plan</CardTitle>
//                     <CardDescription>30 days of support access</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-center mb-6">
//                       <p className="text-5xl font-bold mb-2" style={{ color: '#001540' }}>
//                         ${pricing.monthly.amount}
//                       </p>
//                       <p className="text-muted-foreground">per month</p>
//                     </div>

//                     <ul className="space-y-3 mb-6">
//                       <li className="flex items-start">
//                         <CheckCircle2 className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
//                         <span>24/7 AI customer support</span>
//                       </li>
//                       <li className="flex items-start">
//                         <CheckCircle2 className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
//                         <span>Help with bookings & payments</span>
//                       </li>
//                       <li className="flex items-start">
//                         <CheckCircle2 className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
//                         <span>Travel recommendations</span>
//                       </li>
//                       <li className="flex items-start">
//                         <CheckCircle2 className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
//                         <span>Instant responses</span>
//                       </li>
//                     </ul>

//                     <Button
//                       onClick={() => purchaseSupport('monthly')}
//                       disabled={selectedPlan !== null}
//                       className="w-full"
//                       variant={selectedPlan === 'monthly' ? "default" : "outline"}
//                       style={selectedPlan === 'monthly' ? { backgroundColor: '#001540' } : {}}
//                     >
//                       {selectedPlan === 'monthly' ? (
//                         <>
//                           <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                           Loading Payment...
//                         </>
//                       ) : (
//                         'Purchase Monthly'
//                       )}
//                     </Button>
//                   </CardContent>
//                 </Card>

//                 {/* Yearly Plan */}
//                 <Card className="relative border-2" style={{ borderColor: '#001540' }}>
//                   <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
//                     <Badge className="bg-green-500 text-white px-3 py-1">
//                       Best Value - Save $20!
//                     </Badge>
//                   </div>
//                   <CardHeader className="pt-6">
//                     <CardTitle>Yearly Plan</CardTitle>
//                     <CardDescription>365 days of support access</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-center mb-6">
//                       <p className="text-5xl font-bold mb-2" style={{ color: '#001540' }}>
//                         ${pricing.yearly.amount}
//                       </p>
//                       <p className="text-muted-foreground">per year</p>
//                       <p className="text-sm text-green-600 font-semibold mt-2">
//                         Only $8.33/month!
//                       </p>
//                     </div>

//                     <ul className="space-y-3 mb-6">
//                       <li className="flex items-start">
//                         <CheckCircle2 className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
//                         <span>Everything in Monthly</span>
//                       </li>
//                       <li className="flex items-start">
//                         <CheckCircle2 className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
//                         <span>Save $20 compared to monthly</span>
//                       </li>
//                       <li className="flex items-start">
//                         <CheckCircle2 className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
//                         <span>Priority support queue</span>
//                       </li>
//                       <li className="flex items-start">
//                         <CheckCircle2 className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
//                         <span>Extended conversation history</span>
//                       </li>
//                     </ul>

//                     <Button
//                       onClick={() => purchaseSupport('yearly')}
//                       disabled={selectedPlan !== null}
//                       className="w-full"
//                       style={{ backgroundColor: '#001540' }}
//                     >
//                       {selectedPlan === 'yearly' ? (
//                         <>
//                           <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                           Loading Payment...
//                         </>
//                       ) : (
//                         'Purchase Yearly'
//                       )}
//                     </Button>
//                   </CardContent>
//                 </Card>
//               </div>

//               {/* PayPal Payment Container */}
//               {selectedPlan && paypalOrderId && (
//                 <Card className="mb-8">
//                   <CardHeader>
//                     <CardTitle>Complete Your Purchase</CardTitle>
//                     <CardDescription>Secure payment powered by PayPal</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <div id="paypal-button-container" className="min-h-[200px]"></div>
//                   </CardContent>
//                 </Card>
//               )}

//               {/* Alternative Option */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center">
//                     <Package className="w-6 h-6 mr-2" style={{ color: '#001540' }} />
//                     Get 1 Year FREE with Tour Package
//                   </CardTitle>
//                   <CardDescription>
//                     Best deal - Support included!
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="mb-4">
//                     Purchase any tour package and get <strong>1 full year</strong> of customer support absolutely FREE!
//                   </p>
//                   <Button
//                     onClick={() => navigate('/tour-packages')}
//                     variant="outline"
//                     className="w-full"
//                   >
//                     Browse Tour Packages
//                   </Button>
//                 </CardContent>
//               </Card>
//             </>
//           )}
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default SupportAccess;





// src/pages/SupportAccess.tsx - COMPLETELY FIXED VERSION
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, MessageCircle, Package, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// CRITICAL: Use correct API URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 
                     process.env.REACT_APP_API_URL || 
                     "http://localhost:3002";  // ← Default to localhost!

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || 
                         process.env.REACT_APP_PAYPAL_CLIENT_ID;

// Debug logging
console.log('🔍 SupportAccess - API URL:', API_BASE_URL);
console.log('🔍 SupportAccess - PayPal Client ID:', PAYPAL_CLIENT_ID ? 'Set ✅' : 'Missing ❌');

declare global {
  interface Window {
    paypal: any;
  }
}

interface SupportStatus {
  has_access: boolean;
  type: string | null;
  expires_at: string | null;
  days_remaining: number;
}

interface PricingPlan {
  amount: number;
  currency: string;
  duration_days: number;
  name: string;
}

const SupportAccess = () => {
  const { user, token, refreshUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [supportStatus, setSupportStatus] = useState<SupportStatus | null>(null);
  const [pricing, setPricing] = useState<{ monthly: PricingPlan; yearly: PricingPlan } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | null>(null);
  const [paypalOrderId, setPaypalOrderId] = useState<string | null>(null);
  const [supportAccessId, setSupportAccessId] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔍 Auth check - User:', user ? 'Logged in' : 'Not logged in');
    console.log('🔍 Auth check - Token:', token ? 'Present' : 'Missing');
    
    if (!user || !token) {
      navigate('/auth');
      return;
    }

    fetchSupportStatus();
  }, [user, token]);

  const fetchSupportStatus = async () => {
    const url = `${API_BASE_URL}/api/support/access-status`;
    console.log('📡 Fetching support status from:', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Support status data:', data);

      if (data.success) {
        setSupportStatus(data.support_access);
        setPricing(data.pricing);
      } else {
        throw new Error(data.error || 'Failed to fetch status');
      }
    } catch (error: any) {
      console.error('❌ Fetch error:', error);
      toast({
        title: "Connection Error",
        description: `Cannot connect to backend: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const purchaseSupport = async (plan: 'monthly' | 'yearly') => {
    if (!pricing) {
      console.error('❌ No pricing data');
      return;
    }

    console.log('💳 Starting purchase for plan:', plan);
    setSelectedPlan(plan);

    try {
      // Step 1: Create support purchase order
      console.log('📡 Step 1: Creating support purchase order...');
      const orderResponse = await fetch(`${API_BASE_URL}/api/support/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ plan })
      });

      console.log('📡 Order response status:', orderResponse.status);

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${orderResponse.status}`);
      }

      const orderData = await orderResponse.json();
      console.log('✅ Order created:', orderData);

      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create purchase order');
      }

      const { id: support_access_id, amount, currency } = orderData.access;
      setSupportAccessId(support_access_id);

      // Step 2: Create PayPal order
      console.log('📡 Step 2: Creating PayPal order...');
      const paypalResponse = await fetch(`${API_BASE_URL}/api/paypal/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          support_access_id,
          amount,
          currency
        })
      });

      console.log('📡 PayPal response status:', paypalResponse.status);

      if (!paypalResponse.ok) {
        const errorData = await paypalResponse.json().catch(() => ({}));
        throw new Error(errorData.error || `PayPal order failed: HTTP ${paypalResponse.status}`);
      }

      const paypalData = await paypalResponse.json();
      console.log('✅ PayPal order created:', paypalData);

      if (!paypalData.success || !paypalData.orderId) {
        throw new Error('No PayPal order ID returned');
      }

      setPaypalOrderId(paypalData.orderId);

      // Step 3: Load PayPal SDK and render buttons
      loadPayPalSDK(paypalData.orderId, support_access_id);

    } catch (error: any) {
      console.error('❌ Purchase error:', error);
      toast({
        title: "Purchase Failed",
        description: error.message,
        variant: "destructive",
      });
      setSelectedPlan(null);
    }
  };

  const loadPayPalSDK = (orderId: string, supportAccessId: string) => {
    console.log('💳 Loading PayPal SDK...');

    if (!PAYPAL_CLIENT_ID) {
      toast({
        title: "Configuration Error",
        description: "PayPal Client ID is not configured",
        variant: "destructive",
      });
      setSelectedPlan(null);
      return;
    }

    if (window.paypal) {
      console.log('✅ PayPal SDK already loaded');
      renderPayPalButtons(orderId, supportAccessId);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`;
    script.async = true;
    
    script.onload = () => {
      console.log('✅ PayPal SDK loaded');
      renderPayPalButtons(orderId, supportAccessId);
    };

    script.onerror = () => {
      console.error('❌ PayPal SDK failed to load');
      toast({
        title: "Error",
        description: "Failed to load PayPal. Please refresh the page.",
        variant: "destructive",
      });
      setSelectedPlan(null);
    };

    document.body.appendChild(script);
  };

  const renderPayPalButtons = (orderId: string, supportAccessId: string) => {
    const container = document.getElementById('paypal-button-container');
    if (!container) {
      console.error('❌ PayPal container not found');
      return;
    }

    console.log('💳 Rendering PayPal buttons for order:', orderId);

    // Clear previous buttons
    container.innerHTML = '';

    window.paypal.Buttons({
      createOrder: () => {
        console.log('💳 PayPal: Using order ID:', orderId);
        return orderId;
      },

      onApprove: async (data: any) => {
        console.log('✅ PayPal approved:', data);
        
        try {
          const response = await fetch(`${API_BASE_URL}/api/paypal/capture-order`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              order_id: data.orderID,
              support_access_id: supportAccessId
            })
          });

          const result = await response.json();
          console.log('💳 Capture result:', result);

          if (result.success) {
            await refreshUser();
            
            toast({
              title: "Success!",
              description: "Your support access has been activated",
            });

            setSelectedPlan(null);
            setPaypalOrderId(null);
            
            // Refresh status
            await fetchSupportStatus();

            // Navigate to support chat
            setTimeout(() => {
              navigate('/customer-support');
            }, 1500);

          } else {
            throw new Error(result.error || 'Payment capture failed');
          }

        } catch (error: any) {
          console.error('❌ Capture error:', error);
          toast({
            title: "Payment Failed",
            description: error.message,
            variant: "destructive",
          });
          setSelectedPlan(null);
        }
      },

      onError: (err: any) => {
        console.error('❌ PayPal error:', err);
        toast({
          title: "Payment Error",
          description: "Something went wrong with PayPal",
          variant: "destructive",
        });
        setSelectedPlan(null);
      },

      onCancel: () => {
        console.log('⚠️ PayPal cancelled');
        toast({
          title: "Payment Cancelled",
          description: "You cancelled the payment",
        });
        setSelectedPlan(null);
      }

    }).render('#paypal-button-container');
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#9ABDDC' }}>
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: '#001540' }} />
            <p style={{ color: '#001540' }}>Loading support access...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-12 px-4" style={{ backgroundColor: '#9ABDDC' }}>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4" style={{ color: '#001540' }}>
              AI Customer Support Access
            </h1>
            <p className="text-lg" style={{ color: '#282828' }}>
              Get personalized support from our AI assistant 24/7
            </p>
          </div>

          {/* Current Status */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Your Support Status</span>
                {supportStatus?.has_access ? (
                  <Badge className="bg-green-500">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Active
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <XCircle className="w-4 h-4 mr-1" />
                    No Access
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {supportStatus?.has_access ? (
                <div className="space-y-3">
                  <p className="text-lg">
                    <strong>Type:</strong>{' '}
                    {supportStatus.type === 'package_purchase' 
                      ? 'Included with Package Purchase' 
                      : 'Paid Subscription'}
                  </p>
                  <p className="text-lg">
                    <strong>Days Remaining:</strong> {supportStatus.days_remaining} days
                  </p>
                  {supportStatus.expires_at && (
                    <p className="text-sm text-muted-foreground">
                      Expires on: {new Date(supportStatus.expires_at).toLocaleDateString()}
                    </p>
                  )}
                  <Button
                    onClick={() => navigate('/customer-support')}
                    className="mt-4"
                    style={{ backgroundColor: '#001540' }}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Open Support Chat
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <XCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg mb-2">You don't have customer support access</p>
                  <p className="text-muted-foreground">
                    Choose a plan below to get started
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Purchase Options - ALWAYS SHOW if no access */}
          {!supportStatus?.has_access && pricing && (
            <>
              <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: '#001540' }}>
                Choose a Plan
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Monthly Plan */}
                <Card className="relative">
                  <CardHeader>
                    <CardTitle>Monthly Plan</CardTitle>
                    <CardDescription>30 days of support access</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <p className="text-5xl font-bold mb-2" style={{ color: '#001540' }}>
                        ${pricing.monthly.amount}
                      </p>
                      <p className="text-muted-foreground">per month</p>
                    </div>

                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>24/7 AI customer support</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Help with bookings & payments</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Travel recommendations</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Instant responses</span>
                      </li>
                    </ul>

                    <Button
                      onClick={() => purchaseSupport('monthly')}
                      disabled={selectedPlan !== null}
                      className="w-full"
                      variant={selectedPlan === 'monthly' ? "default" : "outline"}
                      style={selectedPlan === 'monthly' ? { backgroundColor: '#001540' } : {}}
                    >
                      {selectedPlan === 'monthly' ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Loading Payment...
                        </>
                      ) : (
                        'Purchase Monthly'
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Yearly Plan */}
                <Card className="relative border-2" style={{ borderColor: '#001540' }}>
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-500 text-white px-3 py-1">
                      Best Value - Save $20!
                    </Badge>
                  </div>
                  <CardHeader className="pt-6">
                    <CardTitle>Yearly Plan</CardTitle>
                    <CardDescription>365 days of support access</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <p className="text-5xl font-bold mb-2" style={{ color: '#001540' }}>
                        ${pricing.yearly.amount}
                      </p>
                      <p className="text-muted-foreground">per year</p>
                      <p className="text-sm text-green-600 font-semibold mt-2">
                        Only $8.33/month!
                      </p>
                    </div>

                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Everything in Monthly</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Save $20 compared to monthly</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Priority support queue</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Extended conversation history</span>
                      </li>
                    </ul>

                    <Button
                      onClick={() => purchaseSupport('yearly')}
                      disabled={selectedPlan !== null}
                      className="w-full"
                      style={{ backgroundColor: '#001540' }}
                    >
                      {selectedPlan === 'yearly' ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Loading Payment...
                        </>
                      ) : (
                        'Purchase Yearly'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* PayPal Payment Container */}
              {selectedPlan && paypalOrderId && (
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Complete Your Purchase</CardTitle>
                    <CardDescription>Secure payment powered by PayPal</CardDescription>
                  </CardHeader>
                  <CardContent>
                    
                    {/* TEST MODE BYPASS - Only for localhost */}
                    {window.location.hostname === 'localhost' && (
                      <Card className="mb-6 border-2 border-yellow-500 bg-yellow-50">
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <p className="text-sm font-semibold text-yellow-800 mb-3">
                              🧪 TEST MODE - Skip Payment (Localhost Only)
                            </p>
                            <Button
                              onClick={async () => {
                                try {
                                  const response = await fetch(`${API_BASE_URL}/api/paypal/capture-order`, {
                                    method: 'POST',
                                    headers: {
                                      'Content-Type': 'application/json',
                                      'Authorization': `Bearer ${token}`
                                    },
                                    body: JSON.stringify({
                                      order_id: paypalOrderId,
                                      support_access_id: supportAccessId
                                    })
                                  });

                                  const result = await response.json();

                                  if (result.success) {
                                    await refreshUser();

                                    toast({
                                      title: "Test Payment Success!",
                                      description: "Your support access has been activated",
                                    });

                                    setSelectedPlan(null);
                                    setPaypalOrderId(null);

                                    await fetchSupportStatus();

                                    setTimeout(() => {
                                      navigate('/customer-support');
                                    }, 1500);

                                  } else {
                                    throw new Error(result.error || 'Payment capture failed');
                                  }

                                } catch (error: any) {
                                  toast({
                                    title: "Test Payment Failed",
                                    description: error.message,
                                    variant: "destructive",
                                  });
                                }
                              }}
                              variant="outline"
                              className="w-full border-yellow-600 text-yellow-800 hover:bg-yellow-100"
                            >
                              ⚡ Skip Payment (Test Mode)
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <div id="paypal-button-container" className="min-h-[200px]"></div>
                  </CardContent>
                </Card>
              )}

              {/* Alternative Option */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="w-6 h-6 mr-2" style={{ color: '#001540' }} />
                    Get 1 Year FREE with Tour Package
                  </CardTitle>
                  <CardDescription>
                    Best deal - Support included!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Purchase any tour package and get <strong>1 full year</strong> of customer support absolutely FREE!
                  </p>
                  <Button
                    onClick={() => navigate('/tour-packages')}
                    variant="outline"
                    className="w-full"
                  >
                    Browse Tour Packages
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SupportAccess;