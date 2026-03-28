// src/pages/TourPackageDetails.tsx - COMPLETE WORKING VERSION
// This handles tour package booking AND payment (like SupportAccess does)

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Users, MapPin, Clock, DollarSign, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 
                     process.env.REACT_APP_API_URL || 
                     "http://localhost:3002";

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || 
                         process.env.REACT_APP_PAYPAL_CLIENT_ID;

declare global {
  interface Window {
    paypal: any;
  }
}

interface TourPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: string;
  destinations: string[];
  image_url: string;
  available: boolean;
}

const TourPackageDetails = () => {
  const { id } = useParams();
  const { user, token, refreshUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [tourPackage, setTourPackage] = useState<TourPackage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Booking form state
  const [travelDate, setTravelDate] = useState('');
  const [numberOfTravelers, setNumberOfTravelers] = useState(1);
  const [passengers, setPassengers] = useState([{ name: '', email: '', phone: '' }]);

  // Payment state
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [paypalOrderId, setPaypalOrderId] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    fetchPackageDetails();
  }, [id]);

  useEffect(() => {
    if (showPayment && !window.paypal) {
      loadPayPalSDK();
    }
  }, [showPayment]);

  const fetchPackageDetails = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/packages/${id}`);
      const data = await response.json();

      if (data.success) {
        setTourPackage(data.package);
      } else {
        throw new Error('Package not found');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      navigate('/tour-packages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTravelerChange = (count: number) => {
    setNumberOfTravelers(count);
    const newPassengers = Array.from({ length: count }, (_, i) => 
      passengers[i] || { name: '', email: '', phone: '' }
    );
    setPassengers(newPassengers);
  };

  const handlePassengerUpdate = (index: number, field: string, value: string) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const handleBookPackage = async () => {
    if (!user || !token) {
      navigate('/auth');
      return;
    }

    // Validate form
    if (!travelDate) {
      toast({
        title: "Validation Error",
        description: "Please select a travel date",
        variant: "destructive",
      });
      return;
    }

    for (let i = 0; i < passengers.length; i++) {
      if (!passengers[i].name || !passengers[i].email) {
        toast({
          title: "Validation Error",
          description: `Please fill all details for traveler ${i + 1}`,
          variant: "destructive",
        });
        return;
      }
    }

    setIsProcessing(true);

    try {
      console.log('📝 Creating booking...');
      
      // Step 1: Create booking
      const bookingResponse = await fetch(`${API_BASE_URL}/api/bookings/package`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          package_id: id,
          travel_date: travelDate,
          number_of_travelers: numberOfTravelers,
          passengers: passengers
        })
      });

      const bookingData = await bookingResponse.json();
      console.log('✅ Booking response:', bookingData);

      if (!bookingData.success) {
        throw new Error(bookingData.error || 'Failed to create booking');
      }

      const { id: booking_id, total_amount, currency } = bookingData.booking;
      setBookingId(booking_id);

      console.log('📝 Booking created:', booking_id);

      // Step 2: Create PayPal order
      console.log('💳 Creating PayPal order...');
      const paypalResponse = await fetch(`${API_BASE_URL}/api/paypal/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          booking_id,
          amount: total_amount,
          currency
        })
      });

      const paypalData = await paypalResponse.json();
      console.log('✅ PayPal response:', paypalData);

      if (!paypalData.success || !paypalData.orderId) {
        throw new Error('Failed to create PayPal order');
      }

      setPaypalOrderId(paypalData.orderId);
      setShowPayment(true);

      toast({
        title: "Booking Created!",
        description: "Complete payment to confirm your booking",
      });

    } catch (error: any) {
      console.error('❌ Booking error:', error);
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const loadPayPalSDK = () => {
    if (window.paypal) {
      renderPayPalButtons();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`;
    script.async = true;
    script.onload = () => renderPayPalButtons();
    script.onerror = () => {
      toast({
        title: "Error",
        description: "Failed to load PayPal",
        variant: "destructive",
      });
    };
    document.body.appendChild(script);
  };

  const renderPayPalButtons = () => {
    if (!bookingId || !paypalOrderId) return;

    const container = document.getElementById('paypal-buttons');
    if (!container) return;

    container.innerHTML = '';

    window.paypal.Buttons({
      createOrder: () => paypalOrderId,

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
              booking_id: bookingId
            })
          });

          const result = await response.json();
          console.log('💳 Capture result:', result);

          if (result.success) {
            await refreshUser();

            toast({
              title: "Success!",
              description: "Your booking is confirmed! You've also received 1 year of free customer support.",
            });

            setTimeout(() => {
              navigate('/my-bookings');
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
        }
      },

      onError: (err: any) => {
        console.error('❌ PayPal error:', err);
        toast({
          title: "Payment Error",
          description: "Something went wrong",
          variant: "destructive",
        });
      },

      onCancel: () => {
        toast({
          title: "Payment Cancelled",
          description: "You cancelled the payment",
        });
        setShowPayment(false);
        setIsProcessing(false);
      }

    }).render('#paypal-buttons');
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#2185FF' }}>
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#001540' }} />
        </div>
      </Layout>
    );
  }

  if (!tourPackage) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#2185FF' }}>
          <p style={{ color: '#001540' }}>Package not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-12 px-4" style={{ backgroundColor: '#2185FF' }}>
        <div className="max-w-4xl mx-auto">
          
          {/* Package Details */}
          {!showBookingForm && !showPayment && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-3xl mb-2">{tourPackage.name}</CardTitle>
                    <CardDescription>{tourPackage.description}</CardDescription>
                  </div>
                  <Badge className="bg-green-500 text-lg px-4 py-2">
                    ${tourPackage.price} {tourPackage.currency}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <img 
                  src={tourPackage.image_url} 
                  alt={tourPackage.name}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" style={{ color: '#001540' }} />
                    <span><strong>Duration:</strong> {tourPackage.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" style={{ color: '#001540' }} />
                    <span><strong>Price per person:</strong> ${tourPackage.price}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-bold mb-2 flex items-center gap-2">
                    <MapPin className="w-5 h-5" style={{ color: '#001540' }} />
                    Destinations
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tourPackage.destinations.map((dest, idx) => (
                      <Badge key={idx} variant="outline">{dest}</Badge>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <p className="font-semibold text-green-600">
                    ✅ Includes 1 Year of FREE Customer Support!
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Get instant access to our AI-powered customer support for travel queries, booking changes, and more.
                  </p>
                </div>

                <Button
                  onClick={() => {
                    if (!user) {
                      navigate('/auth');
                      return;
                    }
                    setShowBookingForm(true);
                  }}
                  className="w-full"
                  size="lg"
                  style={{ backgroundColor: '#001540' }}
                >
                  Book This Package
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Booking Form */}
          {showBookingForm && !showPayment && (
            <Card>
              <CardHeader>
                <CardTitle>Complete Your Booking</CardTitle>
                <CardDescription>Fill in traveler details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Travel Date */}
                <div>
                  <Label htmlFor="travel-date">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Travel Date
                  </Label>
                  <Input
                    id="travel-date"
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                {/* Number of Travelers */}
                <div>
                  <Label htmlFor="travelers">
                    <Users className="w-4 h-4 inline mr-2" />
                    Number of Travelers
                  </Label>
                  <Input
                    id="travelers"
                    type="number"
                    min="1"
                    max="10"
                    value={numberOfTravelers}
                    onChange={(e) => handleTravelerChange(parseInt(e.target.value) || 1)}
                  />
                </div>

                {/* Passenger Details */}
                {passengers.map((passenger, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">Traveler {index + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Full Name *</Label>
                        <Input
                          value={passenger.name}
                          onChange={(e) => handlePassengerUpdate(index, 'name', e.target.value)}
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <Label>Email *</Label>
                        <Input
                          type="email"
                          value={passenger.email}
                          onChange={(e) => handlePassengerUpdate(index, 'email', e.target.value)}
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <Input
                          type="tel"
                          value={passenger.phone}
                          onChange={(e) => handlePassengerUpdate(index, 'phone', e.target.value)}
                          placeholder="+1234567890"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Total */}
                <Card className="bg-blue-50">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>Total Amount:</span>
                      <span style={{ color: '#001540' }}>
                        ${(tourPackage.price * numberOfTravelers).toFixed(2)} {tourPackage.currency}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      + 1 Year Customer Support (FREE)
                    </p>
                  </CardContent>
                </Card>

                {/* Buttons */}
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowBookingForm(false)}
                    disabled={isProcessing}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleBookPackage}
                    disabled={isProcessing}
                    className="flex-1"
                    style={{ backgroundColor: '#001540' }}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Proceed to Payment'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment */}
          {showPayment && (
            <Card>
              <CardHeader>
                <CardTitle>Complete Your Payment</CardTitle>
                <CardDescription>
                  Secure payment powered by PayPal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <p className="text-lg mb-2">
                    <strong>Package:</strong> {tourPackage.name}
                  </p>
                  <p className="text-lg mb-2">
                    <strong>Travelers:</strong> {numberOfTravelers}
                  </p>
                  <p className="text-2xl font-bold" style={{ color: '#001540' }}>
                    Total: ${(tourPackage.price * numberOfTravelers).toFixed(2)} {tourPackage.currency}
                  </p>
                </div>

                <div id="paypal-buttons" className="min-h-[200px]"></div>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </Layout>
  );
};

export default TourPackageDetails;