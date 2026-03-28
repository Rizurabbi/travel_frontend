// // import { useState } from "react";
// // import { Layout } from "@/components/Layout";
// // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";
// // import { MapPin, Clock, Users } from "lucide-react";
// // import { PayPalPayment } from "@/components/PayPalPayment";

// // const tourPackages = [
// //   {
// //     id: "1",
// //     name: "European Dream",
// //     description: "Experience the best of Europe with visits to Paris, Rome, and Barcelona. Includes guided tours, luxury accommodations, and authentic culinary experiences.",
// //     price: "2499",
// //     currency: "USD",
// //     duration: "10 Days / 9 Nights",
// //     destinations: ["Paris", "Rome", "Barcelona"],
// //     image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
// //     capacity: "2-15 people"
// //   },
// //   {
// //     id: "2",
// //     name: "Asian Adventure",
// //     description: "Discover the wonders of Asia with stops in Tokyo, Bangkok, and Bali. Perfect blend of culture, nature, and modern city life.",
// //     price: "1899",
// //     currency: "USD",
// //     duration: "12 Days / 11 Nights",
// //     destinations: ["Tokyo", "Bangkok", "Bali"],
// //     image: "https://images.unsplash.com/photo-1528164344705-47542687000d?w=800",
// //     capacity: "2-12 people"
// //   },
// //   {
// //     id: "3",
// //     name: "Caribbean Paradise",
// //     description: "Relax in the stunning Caribbean islands. Beach resorts, water sports, and tropical adventures await you.",
// //     price: "1699",
// //     currency: "USD",
// //     duration: "7 Days / 6 Nights",
// //     destinations: ["Jamaica", "Bahamas", "Cayman Islands"],
// //     image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
// //     capacity: "2-20 people"
// //   },
// //   {
// //     id: "4",
// //     name: "African Safari",
// //     description: "Witness the majesty of African wildlife in their natural habitat. Includes game drives, luxury lodges, and cultural experiences.",
// //     price: "3299",
// //     currency: "USD",
// //     duration: "8 Days / 7 Nights",
// //     destinations: ["Kenya", "Tanzania", "South Africa"],
// //     image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800",
// //     capacity: "2-10 people"
// //   }
// // ];

// // const TourPackages = () => {
// //   const [showPayPal, setShowPayPal] = useState(false);
// //   const [selectedPackage, setSelectedPackage] = useState<any>(null);

// //   const handleBookNow = (pkg: any) => {
// //     setSelectedPackage(pkg);
// //     setShowPayPal(true);
// //   };

// //   return (
// //     <Layout>
// //       <div className="min-h-screen" style={{ backgroundColor: '#9ABDDC' }}>
// //         <section className="py-16 px-4">
// //           <div className="max-w-6xl mx-auto">
// //             <div className="text-center mb-12">
// //               <h1 className="text-5xl font-bold mb-6" style={{ color: '#001540' }}>
// //                 Tour Packages
// //               </h1>
// //               <p className="text-xl" style={{ color: '#001540', opacity: 0.8 }}>
// //                 Explore our curated collection of unforgettable travel experiences
// //               </p>
// //             </div>

// //             <div className="grid md:grid-cols-2 gap-6">
// //               {tourPackages.map((pkg) => (
// //                 <Card key={pkg.id} className="overflow-hidden hover:shadow-lg transition-shadow">
// //                   <img 
// //                     src={pkg.image} 
// //                     alt={pkg.name} 
// //                     className="w-full h-64 object-cover"
// //                   />
// //                   <CardHeader>
// //                     <CardTitle className="text-2xl">{pkg.name}</CardTitle>
// //                     <CardDescription className="flex items-center gap-2">
// //                       <Clock className="w-4 h-4" />
// //                       {pkg.duration}
// //                     </CardDescription>
// //                   </CardHeader>
// //                   <CardContent className="space-y-4">
// //                     <p className="text-sm text-muted-foreground">{pkg.description}</p>
                    
// //                     <div className="flex items-center gap-2 text-sm">
// //                       <MapPin className="w-4 h-4 text-primary" />
// //                       <span className="font-medium">{pkg.destinations.join(" • ")}</span>
// //                     </div>

// //                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
// //                       <Users className="w-4 h-4" />
// //                       <span>{pkg.capacity}</span>
// //                     </div>

// //                     <div className="flex items-center justify-between pt-4 border-t">
// //                       <div>
// //                         <p className="text-sm text-muted-foreground">Starting from</p>
// //                         <p className="text-3xl font-bold" style={{ color: '#001540' }}>
// //                           {pkg.currency} {pkg.price}
// //                         </p>
// //                       </div>
// //                       <Button 
// //                         size="lg"
// //                         onClick={() => handleBookNow(pkg)}
// //                         style={{ backgroundColor: '#001540', color: 'white' }}
// //                         className="hover:opacity-90"
// //                       >
// //                         Book Now
// //                       </Button>
// //                     </div>
// //                   </CardContent>
// //                 </Card>
// //               ))}
// //             </div>
// //           </div>
// //         </section>
// //       </div>

// //       <PayPalPayment 
// //         open={showPayPal} 
// //         onOpenChange={setShowPayPal}
// //         prefilledAmount={selectedPackage?.price}
// //         itemDescription={selectedPackage ? `${selectedPackage.name} - ${selectedPackage.duration}` : ""}
// //       />
// //     </Layout>
// //   );
// // };

// // export default TourPackages;


// // src/pages/TourPackages.tsx - HARDCODED VERSION (No Database)
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
// import { Layout } from '@/components/Layout';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Calendar, Users, MapPin, Clock, DollarSign, Loader2, Gift, ArrowLeft } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast';

// const API_BASE_URL = import.meta.env.VITE_API_URL || 
//                      process.env.REACT_APP_API_URL || 
//                      "http://localhost:3002";

// const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || 
//                          process.env.REACT_APP_PAYPAL_CLIENT_ID;

// declare global {
//   interface Window {
//     paypal: any;
//   }
// }

// // HARDCODED TOUR PACKAGES - No database needed!
// const TOUR_PACKAGES = [
//   {
//     id: "maldives-paradise",
//     name: "Maldives Paradise Escape",
//     description: "Experience luxury and tranquility in the pristine waters of the Maldives. Includes overwater villa stays, snorkeling, and sunset cruises.",
//     price: 2499.99,
//     currency: "USD",
//     duration: "7 Days / 6 Nights",
//     destinations: ["Male", "Maafushi Island", "Hulhumale"],
//     image_url: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800"
//   },
//   {
//     id: "dubai-luxury",
//     name: "Dubai Luxury Tour",
//     description: "Discover the wonders of Dubai with visits to Burj Khalifa, desert safari, luxury shopping, and world-class dining experiences.",
//     price: 1899.99,
//     currency: "USD",
//     duration: "5 Days / 4 Nights",
//     destinations: ["Dubai", "Abu Dhabi", "Sharjah"],
//     image_url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800"
//   },
//   {
//     id: "bangkok-cultural",
//     name: "Bangkok Cultural Journey",
//     description: "Immerse yourself in Thai culture with temple tours, floating markets, authentic cuisine, and traditional massage experiences.",
//     price: 1299.99,
//     currency: "USD",
//     duration: "6 Days / 5 Nights",
//     destinations: ["Bangkok", "Ayutthaya", "Pattaya"],
//     image_url: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800"
//   },
//   {
//     id: "singapore-explorer",
//     name: "Singapore City Explorer",
//     description: "Modern marvels meet cultural heritage in this comprehensive Singapore tour. Visit Gardens by the Bay, Marina Bay, and Sentosa Island.",
//     price: 1599.99,
//     currency: "USD",
//     duration: "4 Days / 3 Nights",
//     destinations: ["Singapore", "Sentosa Island", "Marina Bay"],
//     image_url: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800"
//   },
//   {
//     id: "istanbul-historical",
//     name: "Istanbul Historical Tour",
//     description: "Journey through time in Istanbul with visits to Hagia Sophia, Blue Mosque, Grand Bazaar, and Bosphorus cruise.",
//     price: 1399.99,
//     currency: "USD",
//     duration: "5 Days / 4 Nights",
//     destinations: ["Istanbul", "Cappadocia", "Pamukkale"],
//     image_url: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800"
//   },
//   {
//     id: "bali-beach",
//     name: "Bali Beach & Culture",
//     description: "Experience the magic of Bali with beach relaxation, temple visits, rice terrace tours, and traditional Balinese ceremonies.",
//     price: 1699.99,
//     currency: "USD",
//     duration: "8 Days / 7 Nights",
//     destinations: ["Ubud", "Seminyak", "Nusa Dua", "Uluwatu"],
//     image_url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800"
//   }
// ];

// const TourPackages = () => {
//   const { user, token, refreshUser } = useAuth();
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const [selectedPackage, setSelectedPackage] = useState<typeof TOUR_PACKAGES[0] | null>(null);
//   const [showBookingForm, setShowBookingForm] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);

//   // Booking form state
//   const [travelDate, setTravelDate] = useState('');
//   const [numberOfTravelers, setNumberOfTravelers] = useState(1);
//   const [passengers, setPassengers] = useState([{ first_name: '', last_name: '', email: '', phone: '' }]);

//   // Payment state
//   const [bookingId, setBookingId] = useState<string | null>(null);
//   const [paypalOrderId, setPaypalOrderId] = useState<string | null>(null);
//   const [showPayment, setShowPayment] = useState(false);

//   useEffect(() => {
//     if (showPayment && bookingId && paypalOrderId) {
//       console.log('🔵 State updated - ready to render PayPal buttons');
//       console.log('   bookingId:', bookingId);
//       console.log('   paypalOrderId:', paypalOrderId);
      
//       if (!window.paypal) {
//         loadPayPalSDK(bookingId, paypalOrderId);
//       } else {
//         renderPayPalButtons(bookingId, paypalOrderId);
//       }
//     }
//   }, [showPayment, bookingId, paypalOrderId]);

//   const handleSelectPackage = (pkg: typeof TOUR_PACKAGES[0]) => {
//     if (!user) {
//       navigate('/auth');
//       return;
//     }
//     setSelectedPackage(pkg);
//     setShowBookingForm(true);
//   };

//   const handleTravelerChange = (count: number) => {
//     setNumberOfTravelers(count);
//     const newPassengers = Array.from({ length: count }, (_, i) => 
//       passengers[i] || { first_name: '', last_name: '', email: '', phone: '' }
//     );
//     setPassengers(newPassengers);
//   };

//   const handlePassengerUpdate = (index: number, field: string, value: string) => {
//     const updated = [...passengers];
//     updated[index] = { ...updated[index], [field]: value };
//     setPassengers(updated);
//   };

//   const handleBookPackage = async () => {
//     if (!selectedPackage) return;

//     // Validate form
//     if (!travelDate) {
//       toast({
//         title: "Validation Error",
//         description: "Please select a travel date",
//         variant: "destructive",
//       });
//       return;
//     }

//     for (let i = 0; i < passengers.length; i++) {
//       if (!passengers[i].first_name || !passengers[i].last_name || !passengers[i].email || !passengers[i].phone) {
//         toast({
//           title: "Validation Error",
//           description: `Please fill all details for traveler ${i + 1}`,
//           variant: "destructive",
//         });
//         return;
//       }
//     }

//     setIsProcessing(true);

//     try {
//       console.log('📝 Creating booking...');
      
//       // Step 1: Create booking
//       const bookingResponse = await fetch(`${API_BASE_URL}/api/bookings/package`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           package_id: selectedPackage.id,
//           travel_date: travelDate,
//           number_of_travelers: numberOfTravelers,
//           passengers: passengers
//         })
//       });

//       const bookingData = await bookingResponse.json();
//       console.log('✅ Booking response:', bookingData);

//       if (!bookingData.success) {
//         throw new Error(bookingData.error || 'Failed to create booking');
//       }

//       const { id: booking_id, total_amount, currency } = bookingData.booking;
//       setBookingId(booking_id);

//       console.log('📝 Booking created:', booking_id);

//       // Step 2: Create PayPal order
//       console.log('💳 Creating PayPal order...');
//       const paypalResponse = await fetch(`${API_BASE_URL}/api/paypal/create-order`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           booking_id,
//           amount: total_amount,
//           currency
//         })
//       });

//       const paypalData = await paypalResponse.json();
//       console.log('✅ PayPal response:', paypalData);

//       if (!paypalData.success || !paypalData.orderId) {
//         throw new Error('Failed to create PayPal order');
//       }

//       setPaypalOrderId(paypalData.orderId);
//       setShowPayment(true);

//       toast({
//         title: "Booking Created!",
//         description: "Complete payment to confirm your booking",
//       });

//       // useEffect will automatically render PayPal buttons when state updates

//     } catch (error: any) {
//       console.error('❌ Booking error:', error);
//       toast({
//         title: "Booking Failed",
//         description: error.message,
//         variant: "destructive",
//       });
//       setIsProcessing(false);
//     }
//   };

//   const loadPayPalSDK = (bookingIdParam: string, orderIdParam: string) => {
//     const script = document.createElement('script');
//     script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`;
//     script.async = true;
//     script.onload = () => renderPayPalButtons(bookingIdParam, orderIdParam);
//     script.onerror = () => {
//       toast({
//         title: "Error",
//         description: "Failed to load PayPal",
//         variant: "destructive",
//       });
//     };
//     document.body.appendChild(script);
//   };

//   const renderPayPalButtons = (bookingIdParam: string, paypalOrderIdParam: string) => {
//     console.log('🎨 Rendering PayPal buttons...');
//     console.log('   bookingId:', bookingIdParam);
//     console.log('   paypalOrderId:', paypalOrderIdParam);

//     if (!bookingIdParam || !paypalOrderIdParam) {
//       console.error('❌ Missing booking or order ID');
//       return;
//     }

//     const container = document.getElementById('paypal-buttons');
//     if (!container) {
//       console.error('❌ PayPal container not found in DOM');
//       return;
//     }

//     console.log('✅ Container found, clearing and rendering...');
//     container.innerHTML = '';

//     if (!window.paypal) {
//       console.error('❌ PayPal SDK not loaded');
//       return;
//     }

//     window.paypal.Buttons({
//       createOrder: () => {
//         console.log('💳 Creating order with ID:', paypalOrderIdParam);
//         return paypalOrderIdParam;
//       },

//       onApprove: async (data: any) => {
//         console.log('✅ Payment approved:', data);
        
//         try {
//           const response = await fetch(`${API_BASE_URL}/api/paypal/capture-order`, {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//               'Authorization': `Bearer ${token}`
//             },
//             body: JSON.stringify({
//               order_id: data.orderID,
//               booking_id: bookingIdParam
//             })
//           });

//           const result = await response.json();
//           console.log('💰 Capture result:', result);

//           if (result.success) {
//             await refreshUser();

//             toast({
//               title: "Success!",
//               description: "Your booking is confirmed! You've also received 1 year of free customer support.",
//             });

//             setTimeout(() => {
//               navigate('/my-bookings');
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
//         }
//       },

//       onError: (err: any) => {
//         console.error('❌ PayPal error:', err);
//         toast({
//           title: "Payment Error",
//           description: "Something went wrong",
//           variant: "destructive",
//         });
//       },

//       onCancel: () => {
//         console.log('⚠️ Payment cancelled');
//         toast({
//           title: "Payment Cancelled",
//           description: "You cancelled the payment",
//         });
//         setShowPayment(false);
//         setIsProcessing(false);
//       }

//     }).render('#paypal-buttons')
//       .then(() => {
//         console.log('✅ PayPal buttons rendered successfully');
//       })
//       .catch((err: any) => {
//         console.error('❌ Failed to render PayPal buttons:', err);
//       });
//   };

//   const handleBack = () => {
//     if (showPayment) {
//       setShowPayment(false);
//       setIsProcessing(false);
//     } else if (showBookingForm) {
//       setShowBookingForm(false);
//       setSelectedPackage(null);
//     }
//   };

//   return (
//     <Layout>
//       <div className="min-h-screen py-12 px-4" style={{ backgroundColor: '#9ABDDC' }}>
//         <div className="max-w-7xl mx-auto">
          
//           {/* Packages List */}
//           {!showBookingForm && !showPayment && (
//             <>
//               {/* Header */}
//               <div className="text-center mb-12">
//                 <h1 className="text-4xl font-bold mb-4" style={{ color: '#001540' }}>
//                   Our Tour Packages
//                 </h1>
//                 <p className="text-lg" style={{ color: '#282828' }}>
//                   Explore amazing destinations with our curated tour packages
//                 </p>
//               </div>

//               {/* Special Offer Banner */}
//               <Card className="mb-8 border-2 border-green-500">
//                 <CardContent className="pt-6">
//                   <div className="flex items-center gap-4">
//                     <Gift className="w-12 h-12 text-green-600" />
//                     <div>
//                       <h3 className="text-xl font-bold text-green-600 mb-1">
//                         Special Offer: 1 Year FREE Customer Support!
//                       </h3>
//                       <p className="text-muted-foreground">
//                         Book any tour package and get instant access to our AI-powered customer support for 365 days absolutely free!
//                       </p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Packages Grid */}
//               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {TOUR_PACKAGES.map((pkg) => (
//                   <Card key={pkg.id} className="overflow-hidden hover:shadow-lg transition-shadow">
//                     <img 
//                       src={pkg.image_url} 
//                       alt={pkg.name}
//                       className="w-full h-48 object-cover"
//                     />
//                     <CardHeader>
//                       <div className="flex justify-between items-start">
//                         <CardTitle className="text-xl">{pkg.name}</CardTitle>
//                         <Badge className="bg-green-500">
//                           ${pkg.price}
//                         </Badge>
//                       </div>
//                       <CardDescription className="line-clamp-2">
//                         {pkg.description}
//                       </CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-2 mb-4">
//                         <div className="flex items-center gap-2 text-sm">
//                           <Clock className="w-4 h-4" style={{ color: '#001540' }} />
//                           <span>{pkg.duration}</span>
//                         </div>
//                         <div className="flex items-center gap-2 text-sm">
//                           <MapPin className="w-4 h-4" style={{ color: '#001540' }} />
//                           <span>{pkg.destinations.slice(0, 2).join(', ')}</span>
//                           {pkg.destinations.length > 2 && (
//                             <span className="text-muted-foreground">
//                               +{pkg.destinations.length - 2} more
//                             </span>
//                           )}
//                         </div>
//                         <div className="flex items-center gap-2 text-sm">
//                           <DollarSign className="w-4 h-4" style={{ color: '#001540' }} />
//                           <span>{pkg.price} {pkg.currency} per person</span>
//                         </div>
//                       </div>

//                       <div className="bg-green-50 p-2 rounded mb-4">
//                         <p className="text-xs text-green-700 font-semibold">
//                           ✅ Includes 1 Year Customer Support
//                         </p>
//                       </div>

//                       <Button 
//                         className="w-full"
//                         style={{ backgroundColor: '#001540' }}
//                         onClick={() => handleSelectPackage(pkg)}
//                       >
//                         Book This Package
//                       </Button>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             </>
//           )}

//           {/* Booking Form */}
//           {showBookingForm && !showPayment && selectedPackage && (
//             <Card className="max-w-2xl mx-auto">
//               <CardHeader>
//                 <Button
//                   variant="ghost"
//                   onClick={handleBack}
//                   className="mb-4 -ml-2"
//                 >
//                   <ArrowLeft className="w-4 h-4 mr-2" />
//                   Back to Packages
//                 </Button>
//                 <CardTitle>Complete Your Booking</CardTitle>
//                 <CardDescription>{selectedPackage.name}</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-6">
                
//                 {/* Travel Date */}
//                 <div>
//                   <Label htmlFor="travel-date">
//                     <Calendar className="w-4 h-4 inline mr-2" />
//                     Travel Date
//                   </Label>
//                   <Input
//                     id="travel-date"
//                     type="date"
//                     value={travelDate}
//                     onChange={(e) => setTravelDate(e.target.value)}
//                     min={new Date().toISOString().split('T')[0]}
//                   />
//                 </div>

//                 {/* Number of Travelers */}
//                 <div>
//                   <Label htmlFor="travelers">
//                     <Users className="w-4 h-4 inline mr-2" />
//                     Number of Travelers
//                   </Label>
//                   <Input
//                     id="travelers"
//                     type="number"
//                     min="1"
//                     max="10"
//                     value={numberOfTravelers}
//                     onChange={(e) => handleTravelerChange(parseInt(e.target.value) || 1)}
//                   />
//                 </div>

//                 {/* Passenger Details */}
//                 {passengers.map((passenger, index) => (
//                   <Card key={index}>
//                     <CardHeader>
//                       <CardTitle className="text-lg">Traveler {index + 1}</CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                       <div>
//                         <Label>First Name *</Label>
//                         <Input
//                           value={passenger.first_name}
//                           onChange={(e) => handlePassengerUpdate(index, 'first_name', e.target.value)}
//                           placeholder="John"
//                         />
//                       </div>
//                       <div>
//                         <Label>Last Name *</Label>
//                         <Input
//                           value={passenger.last_name}
//                           onChange={(e) => handlePassengerUpdate(index, 'last_name', e.target.value)}
//                           placeholder="Doe"
//                         />
//                       </div>
//                       <div>
//                         <Label>Email *</Label>
//                         <Input
//                           type="email"
//                           value={passenger.email}
//                           onChange={(e) => handlePassengerUpdate(index, 'email', e.target.value)}
//                           placeholder="john@example.com"
//                         />
//                       </div>
//                       <div>
//                         <Label>Phone *</Label>
//                         <Input
//                           type="tel"
//                           value={passenger.phone}
//                           onChange={(e) => handlePassengerUpdate(index, 'phone', e.target.value)}
//                           placeholder="+1234567890"
//                         />
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}

//                 {/* Total */}
//                 <Card className="bg-blue-50">
//                   <CardContent className="pt-6">
//                     <div className="flex justify-between items-center text-xl font-bold">
//                       <span>Total Amount:</span>
//                       <span style={{ color: '#001540' }}>
//                         ${(selectedPackage.price * numberOfTravelers).toFixed(2)} {selectedPackage.currency}
//                       </span>
//                     </div>
//                     <p className="text-sm text-muted-foreground mt-2">
//                       + 1 Year Customer Support (FREE)
//                     </p>
//                   </CardContent>
//                 </Card>

//                 {/* Button */}
//                 <Button
//                   onClick={handleBookPackage}
//                   disabled={isProcessing}
//                   className="w-full"
//                   size="lg"
//                   style={{ backgroundColor: '#001540' }}
//                 >
//                   {isProcessing ? (
//                     <>
//                       <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                       Processing...
//                     </>
//                   ) : (
//                     'Proceed to Payment'
//                   )}
//                 </Button>
//               </CardContent>
//             </Card>
//           )}

//           {/* Payment */}
//           {showPayment && selectedPackage && (
//             <Card className="max-w-2xl mx-auto">
//               <CardHeader>
//                 <CardTitle>Complete Your Payment</CardTitle>
//                 <CardDescription>Secure payment powered by PayPal</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="mb-6">
//                   <p className="text-lg mb-2">
//                     <strong>Package:</strong> {selectedPackage.name}
//                   </p>
//                   <p className="text-lg mb-2">
//                     <strong>Travelers:</strong> {numberOfTravelers}
//                   </p>
//                   <p className="text-2xl font-bold" style={{ color: '#001540' }}>
//                     Total: ${(selectedPackage.price * numberOfTravelers).toFixed(2)} {selectedPackage.currency}
//                   </p>
//                 </div>

//                 <div id="paypal-buttons" className="min-h-[200px]"></div>
//               </CardContent>
//             </Card>
//           )}

//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default TourPackages;


// src/pages/TourPackages.tsx - HARDCODED VERSION (No Database)
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Users, MapPin, Clock, DollarSign, Loader2, Gift, ArrowLeft } from 'lucide-react';
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

// HARDCODED TOUR PACKAGES - No database needed!
const TOUR_PACKAGES = [
  {
    id: "maldives-paradise",
    name: "Maldives Paradise Escape",
    description: "Experience luxury and tranquility in the pristine waters of the Maldives. Includes overwater villa stays, snorkeling, and sunset cruises.",
    price: 2499.99,
    currency: "USD",
    duration: "7 Days / 6 Nights",
    destinations: ["Male", "Maafushi Island", "Hulhumale"],
    image_url: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800"
  },
  {
    id: "dubai-luxury",
    name: "Dubai Luxury Tour",
    description: "Discover the wonders of Dubai with visits to Burj Khalifa, desert safari, luxury shopping, and world-class dining experiences.",
    price: 1899.99,
    currency: "USD",
    duration: "5 Days / 4 Nights",
    destinations: ["Dubai", "Abu Dhabi", "Sharjah"],
    image_url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800"
  },
  {
    id: "bangkok-cultural",
    name: "Bangkok Cultural Journey",
    description: "Immerse yourself in Thai culture with temple tours, floating markets, authentic cuisine, and traditional massage experiences.",
    price: 1299.99,
    currency: "USD",
    duration: "6 Days / 5 Nights",
    destinations: ["Bangkok", "Ayutthaya", "Pattaya"],
    image_url: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800"
  },
  {
    id: "singapore-explorer",
    name: "Singapore City Explorer",
    description: "Modern marvels meet cultural heritage in this comprehensive Singapore tour. Visit Gardens by the Bay, Marina Bay, and Sentosa Island.",
    price: 1599.99,
    currency: "USD",
    duration: "4 Days / 3 Nights",
    destinations: ["Singapore", "Sentosa Island", "Marina Bay"],
    image_url: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800"
  },
  {
    id: "istanbul-historical",
    name: "Istanbul Historical Tour",
    description: "Journey through time in Istanbul with visits to Hagia Sophia, Blue Mosque, Grand Bazaar, and Bosphorus cruise.",
    price: 1399.99,
    currency: "USD",
    duration: "5 Days / 4 Nights",
    destinations: ["Istanbul", "Cappadocia", "Pamukkale"],
    image_url: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800"
  },
  {
    id: "bali-beach",
    name: "Bali Beach & Culture",
    description: "Experience the magic of Bali with beach relaxation, temple visits, rice terrace tours, and traditional Balinese ceremonies.",
    price: 1699.99,
    currency: "USD",
    duration: "8 Days / 7 Nights",
    destinations: ["Ubud", "Seminyak", "Nusa Dua", "Uluwatu"],
    image_url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800"
  }
];

const TourPackages = () => {
  const { user, token, refreshUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [selectedPackage, setSelectedPackage] = useState<typeof TOUR_PACKAGES[0] | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Booking form state
  const [travelDate, setTravelDate] = useState('');
  const [numberOfTravelers, setNumberOfTravelers] = useState(1);
  const [passengers, setPassengers] = useState([{ first_name: '', last_name: '', email: '', phone: '' }]);

  // Payment state
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [paypalOrderId, setPaypalOrderId] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    if (showPayment && bookingId && paypalOrderId) {
      console.log('🔵 State updated - ready to render PayPal buttons');
      console.log('   bookingId:', bookingId);
      console.log('   paypalOrderId:', paypalOrderId);
      
      if (!window.paypal) {
        loadPayPalSDK(bookingId, paypalOrderId);
      } else {
        renderPayPalButtons(bookingId, paypalOrderId);
      }
    }
  }, [showPayment, bookingId, paypalOrderId]);

  const handleSelectPackage = (pkg: typeof TOUR_PACKAGES[0]) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setSelectedPackage(pkg);
    setShowBookingForm(true);
  };

  const handleTravelerChange = (count: number) => {
    setNumberOfTravelers(count);
    const newPassengers = Array.from({ length: count }, (_, i) => 
      passengers[i] || { first_name: '', last_name: '', email: '', phone: '' }
    );
    setPassengers(newPassengers);
  };

  const handlePassengerUpdate = (index: number, field: string, value: string) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const handleBookPackage = async () => {
    if (!selectedPackage) return;

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
      if (!passengers[i].first_name || !passengers[i].last_name || !passengers[i].email || !passengers[i].phone) {
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
          package_id: selectedPackage.id,
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

      // useEffect will automatically render PayPal buttons when state updates

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

  const loadPayPalSDK = (bookingIdParam: string, orderIdParam: string) => {
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`;
    script.async = true;
    script.onload = () => renderPayPalButtons(bookingIdParam, orderIdParam);
    script.onerror = () => {
      toast({
        title: "Error",
        description: "Failed to load PayPal",
        variant: "destructive",
      });
    };
    document.body.appendChild(script);
  };

  const renderPayPalButtons = (bookingIdParam: string, paypalOrderIdParam: string) => {
    console.log('🎨 Rendering PayPal buttons...');
    console.log('   bookingId:', bookingIdParam);
    console.log('   paypalOrderId:', paypalOrderIdParam);

    if (!bookingIdParam || !paypalOrderIdParam) {
      console.error('❌ Missing booking or order ID');
      return;
    }

    const container = document.getElementById('paypal-buttons');
    if (!container) {
      console.error('❌ PayPal container not found in DOM');
      return;
    }

    console.log('✅ Container found, clearing and rendering...');
    container.innerHTML = '';

    if (!window.paypal) {
      console.error('❌ PayPal SDK not loaded');
      return;
    }

    window.paypal.Buttons({
      createOrder: () => {
        console.log('💳 Creating order with ID:', paypalOrderIdParam);
        return paypalOrderIdParam;
      },

      onApprove: async (data: any) => {
        console.log('✅ Payment approved:', data);
        
        try {
          const response = await fetch(`${API_BASE_URL}/api/paypal/capture-order`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              order_id: data.orderID,
              booking_id: bookingIdParam
            })
          });

          const result = await response.json();
          console.log('💰 Capture result:', result);

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
        console.log('⚠️ Payment cancelled');
        toast({
          title: "Payment Cancelled",
          description: "You cancelled the payment",
        });
        setShowPayment(false);
        setIsProcessing(false);
      }

    }).render('#paypal-buttons')
      .then(() => {
        console.log('✅ PayPal buttons rendered successfully');
      })
      .catch((err: any) => {
        console.error('❌ Failed to render PayPal buttons:', err);
      });
  };

  const handleBack = () => {
    if (showPayment) {
      setShowPayment(false);
      setIsProcessing(false);
    } else if (showBookingForm) {
      setShowBookingForm(false);
      setSelectedPackage(null);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen py-12 px-4" style={{ backgroundColor: '#2185FF' }}>
        <div className="max-w-7xl mx-auto">
          
          {/* Packages List */}
          {!showBookingForm && !showPayment && (
            <>
              {/* Header */}
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4" style={{ color: '#001540' }}>
                  Our Tour Packages
                </h1>
                <p className="text-lg" style={{ color: '#282828' }}>
                  Explore amazing destinations with our curated tour packages
                </p>
              </div>

              {/* Special Offer Banner */}
              <Card className="mb-8 border-2 border-green-500">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <Gift className="w-12 h-12 text-green-600" />
                    <div>
                      <h3 className="text-xl font-bold text-green-600 mb-1">
                        Special Offer: 1 Year FREE Customer Support!
                      </h3>
                      <p className="text-muted-foreground">
                        Book any tour package and get instant access to our AI-powered customer support for 365 days absolutely free!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Packages Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {TOUR_PACKAGES.map((pkg) => (
                  <Card key={pkg.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <img 
                      src={pkg.image_url} 
                      alt={pkg.name}
                      className="w-full h-48 object-cover"
                    />
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{pkg.name}</CardTitle>
                        <Badge className="bg-green-500">
                          ${pkg.price}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {pkg.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4" style={{ color: '#001540' }} />
                          <span>{pkg.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4" style={{ color: '#001540' }} />
                          <span>{pkg.destinations.slice(0, 2).join(', ')}</span>
                          {pkg.destinations.length > 2 && (
                            <span className="text-muted-foreground">
                              +{pkg.destinations.length - 2} more
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="w-4 h-4" style={{ color: '#001540' }} />
                          <span>{pkg.price} {pkg.currency} per person</span>
                        </div>
                      </div>

                      <div className="bg-green-50 p-2 rounded mb-4">
                        <p className="text-xs text-green-700 font-semibold">
                          ✅ Includes 1 Year Customer Support
                        </p>
                      </div>

                      <Button 
                        className="w-full"
                        style={{ backgroundColor: '#001540' }}
                        onClick={() => handleSelectPackage(pkg)}
                      >
                        Book This Package
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* Booking Form */}
          {showBookingForm && !showPayment && selectedPackage && (
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="mb-4 -ml-2"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Packages
                </Button>
                <CardTitle>Complete Your Booking</CardTitle>
                <CardDescription>{selectedPackage.name}</CardDescription>
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
                        <Label>First Name *</Label>
                        <Input
                          value={passenger.first_name}
                          onChange={(e) => handlePassengerUpdate(index, 'first_name', e.target.value)}
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <Label>Last Name *</Label>
                        <Input
                          value={passenger.last_name}
                          onChange={(e) => handlePassengerUpdate(index, 'last_name', e.target.value)}
                          placeholder="Doe"
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
                        <Label>Phone *</Label>
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
                        ${(selectedPackage.price * numberOfTravelers).toFixed(2)} {selectedPackage.currency}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      + 1 Year Customer Support (FREE)
                    </p>
                  </CardContent>
                </Card>

                {/* Button */}
                <Button
                  onClick={handleBookPackage}
                  disabled={isProcessing}
                  className="w-full"
                  size="lg"
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
              </CardContent>
            </Card>
          )}

          {/* Payment */}
          {showPayment && selectedPackage && (
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Complete Your Payment</CardTitle>
                <CardDescription>Secure payment powered by PayPal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <p className="text-lg mb-2">
                    <strong>Package:</strong> {selectedPackage.name}
                  </p>
                  <p className="text-lg mb-2">
                    <strong>Travelers:</strong> {numberOfTravelers}
                  </p>
                  <p className="text-2xl font-bold" style={{ color: '#001540' }}>
                    Total: ${(selectedPackage.price * numberOfTravelers).toFixed(2)} {selectedPackage.currency}
                  </p>
                </div>

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
                              // Use test endpoint instead of PayPal capture
                              const response = await fetch(`${API_BASE_URL}/api/test/confirm-booking`, {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                  'Authorization': `Bearer ${token}`
                                },
                                body: JSON.stringify({
                                  booking_id: bookingId
                                })
                              });

                              const result = await response.json();

                              if (result.success) {
                                await refreshUser();

                                toast({
                                  title: "Test Payment Success!",
                                  description: "Booking confirmed! You've received 1 year of free customer support.",
                                });

                                setTimeout(() => {
                                  navigate('/my-bookings');
                                }, 1500);
                              } else {
                                throw new Error(result.error || 'Test booking failed');
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

                <div id="paypal-buttons" className="min-h-[200px]"></div>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </Layout>
  );
};

export default TourPackages;