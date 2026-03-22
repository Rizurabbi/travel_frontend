// src/pages/MyBookings.tsx - FIXED API URL
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calendar, Users, DollarSign, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 
                     process.env.REACT_APP_API_URL || 
                     "http://localhost:3002";  // ← Default to localhost

console.log('🔍 MyBookings - API URL:', API_BASE_URL);

interface Booking {
  id: string;
  booking_reference: string;
  booking_type: 'flight' | 'package';
  status: string;
  total_amount: number;
  currency: string;
  booking_details: any;
  passenger_details: any[];
  created_at: string;
  grants_support_access?: boolean;
}

const MyBookings = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !token) {
      navigate('/auth');
      return;
    }

    fetchBookings();
  }, [user, token]);

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setBookings(data.bookings);
      } else {
        throw new Error(data.error || 'Failed to fetch bookings');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#9ABDDC' }}>
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#001540' }} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-12 px-4" style={{ backgroundColor: '#9ABDDC' }}>
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2" style={{ color: '#001540' }}>
              My Bookings
            </h1>
            <p className="text-lg" style={{ color: '#282828' }}>
              View and manage your travel bookings
            </p>
          </div>

          {/* Bookings List */}
          {bookings.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No Bookings Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start planning your next adventure!
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => navigate('/tour-packages')}
                    className="px-6 py-2 rounded"
                    style={{ backgroundColor: '#001540', color: 'white' }}
                  >
                    Browse Tour Packages
                  </button>
                  <button
                    onClick={() => navigate('/travel')}
                    className="px-6 py-2 rounded border"
                    style={{ borderColor: '#001540', color: '#001540' }}
                  >
                    Search Flights
                  </button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <Card key={booking.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {booking.booking_type === 'package' ? '📦 Tour Package' : '✈️ Flight'}
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="mt-1">
                          Booking Reference: <strong>{booking.booking_reference}</strong>
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold" style={{ color: '#001540' }}>
                          ${booking.total_amount.toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">{booking.currency}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      
                      {/* Package Details */}
                      {booking.booking_type === 'package' && (
                        <>
                          <div className="flex items-start gap-2">
                            <MapPin className="w-5 h-5 mt-0.5" style={{ color: '#001540' }} />
                            <div>
                              <p className="font-semibold">Package</p>
                              <p className="text-sm text-muted-foreground">
                                {booking.booking_details.package_name}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Calendar className="w-5 h-5 mt-0.5" style={{ color: '#001540' }} />
                            <div>
                              <p className="font-semibold">Travel Date</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(booking.booking_details.travel_date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Users className="w-5 h-5 mt-0.5" style={{ color: '#001540' }} />
                            <div>
                              <p className="font-semibold">Travelers</p>
                              <p className="text-sm text-muted-foreground">
                                {booking.booking_details.number_of_travelers} person(s)
                              </p>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Flight Details */}
                      {booking.booking_type === 'flight' && (
                        <>
                          <div className="flex items-start gap-2">
                            <MapPin className="w-5 h-5 mt-0.5" style={{ color: '#001540' }} />
                            <div>
                              <p className="font-semibold">Route</p>
                              <p className="text-sm text-muted-foreground">
                                {booking.booking_details.origin} → {booking.booking_details.destination}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Calendar className="w-5 h-5 mt-0.5" style={{ color: '#001540' }} />
                            <div>
                              <p className="font-semibold">Departure</p>
                              <p className="text-sm text-muted-foreground">
                                {booking.booking_details.departure_date}
                              </p>
                            </div>
                          </div>
                        </>
                      )}

                      <div className="flex items-start gap-2">
                        <DollarSign className="w-5 h-5 mt-0.5" style={{ color: '#001540' }} />
                        <div>
                          <p className="font-semibold">Payment Status</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.status === 'confirmed' ? 'Paid' : 'Pending'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Support Access Notice */}
                    {booking.grants_support_access && booking.status === 'confirmed' && (
                      <div className="bg-green-50 border border-green-200 rounded p-3 mt-4">
                        <p className="text-sm text-green-800 font-semibold">
                          ✅ Includes 1 Year of Customer Support Access
                        </p>
                      </div>
                    )}

                    {/* Passengers */}
                    <div className="mt-4">
                      <p className="font-semibold mb-2">Passengers:</p>
                      <div className="space-y-1">
                        {booking.passenger_details.map((passenger, idx) => (
                          <p key={idx} className="text-sm text-muted-foreground">
                            {idx + 1}. {passenger.first_name} {passenger.last_name} ({passenger.email})
                          </p>
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground mt-4">
                      Booked on: {new Date(booking.created_at).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
};

export default MyBookings;