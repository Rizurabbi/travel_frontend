// src/pages/SupportAccess.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, MessageCircle, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const API_BASE_URL = process.env.REACT_APP_API_URL || "https://openskai.onrender.com";

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
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [supportStatus, setSupportStatus] = useState<SupportStatus | null>(null);
  const [pricing, setPricing] = useState<{ monthly: PricingPlan; yearly: PricingPlan } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    if (!user || !token) {
      navigate('/auth');
      return;
    }

    fetchSupportStatus();
  }, [user, token]);

  const fetchSupportStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/support/access-status`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setSupportStatus(data.support_access);
        setPricing(data.pricing);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load support status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const purchaseSupport = async (plan: 'monthly' | 'yearly') => {
    setIsPurchasing(true);

    try {
      // Step 1: Create support purchase order
      const orderResponse = await fetch(`${API_BASE_URL}/api/support/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ plan })
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create purchase order');
      }

      const { id: support_access_id, amount, currency } = orderData.access;

      // Step 2: Create PayPal order
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

      const paypalData = await paypalResponse.json();

      if (!paypalData.success) {
        throw new Error('Failed to create PayPal order');
      }

      // Step 3: Redirect to PayPal checkout
      // Store the IDs for later use
      sessionStorage.setItem('support_access_id', support_access_id);
      sessionStorage.setItem('paypal_order_id', paypalData.orderId);

      // Navigate to payment page
      navigate(`/payment?type=support&order=${paypalData.orderId}&support_id=${support_access_id}`);

    } catch (error: any) {
      toast({
        title: "Purchase Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-12 px-4" style={{ backgroundColor: '#9ABDDC' }}>
        <div className="max-w-6xl mx-auto">
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
                    Purchase a plan below or buy a tour package to get support access
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ways to Get Access */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Option 1: Buy Tour Package */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-6 h-6 mr-2" style={{ color: '#001540' }} />
                  Buy a Tour Package
                </CardTitle>
                <CardDescription>
                  Get 1 year of FREE customer support
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>365 days of premium support included</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>24/7 AI-powered assistance</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Priority booking support</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Plus amazing travel experiences!</span>
                  </li>
                </ul>
                <Button
                  onClick={() => navigate('/tour-packages')}
                  className="w-full"
                  style={{ backgroundColor: '#001540' }}
                >
                  View Tour Packages
                </Button>
              </CardContent>
            </Card>

            {/* Option 2: Buy Support Separately */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="w-6 h-6 mr-2" style={{ color: '#001540' }} />
                  Buy Support Access
                </CardTitle>
                <CardDescription>
                  Choose a plan that works for you
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pricing && (
                  <div className="space-y-4">
                    {/* Monthly Plan */}
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold">Monthly Plan</h3>
                        <p className="text-2xl font-bold" style={{ color: '#001540' }}>
                          ${pricing.monthly.amount}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {pricing.monthly.duration_days} days of support access
                      </p>
                      <Button
                        onClick={() => purchaseSupport('monthly')}
                        disabled={isPurchasing || supportStatus?.has_access}
                        className="w-full"
                        variant="outline"
                      >
                        {isPurchasing ? 'Processing...' : 'Purchase Monthly'}
                      </Button>
                    </div>

                    {/* Yearly Plan */}
                    <div className="border-2 rounded-lg p-4" style={{ borderColor: '#001540' }}>
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <h3 className="text-lg font-semibold">Yearly Plan</h3>
                          <Badge className="bg-green-500 mt-1">Best Value</Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold" style={{ color: '#001540' }}>
                            ${pricing.yearly.amount}
                          </p>
                          <p className="text-sm text-green-600">Save $20!</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {pricing.yearly.duration_days} days of support access
                      </p>
                      <Button
                        onClick={() => purchaseSupport('yearly')}
                        disabled={isPurchasing || supportStatus?.has_access}
                        className="w-full"
                        style={{ backgroundColor: '#001540' }}
                      >
                        {isPurchasing ? 'Processing...' : 'Purchase Yearly'}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* What You Get */}
          <Card>
            <CardHeader>
              <CardTitle>What's Included in Customer Support?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3" style={{ color: '#001540' }}>Support Features:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>24/7 AI-powered customer support</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Help with booking issues</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Payment and refund assistance</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Travel recommendations</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3" style={{ color: '#001540' }}>Additional Benefits:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Technical support for website issues</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Account management help</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Instant responses to your queries</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Conversation history saved</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default SupportAccess;
