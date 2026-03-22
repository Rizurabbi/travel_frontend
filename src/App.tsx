// src/App.tsx - COMPLETE WITH AUTH & PROTECTED ROUTES
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChatProvider } from "./contexts/ChatContext";
import { AuthProvider } from "./contexts/AuthContext";  // NEW
import { ProtectedRoute } from "./components/ProtectedRoute";  // NEW

// Existing Pages
import Index from "./pages/Index";
import Service from "./pages/Service";
import Travel from "./pages/Travel";
import Insurance from "./pages/Insurance";
import Payment from "./pages/Payment";
import TourPackages from "./pages/TourPackages";
import NotFound from "./pages/NotFound";

// New Pages
import Auth from "./pages/Auth";  // NEW
import SupportAccess from "./pages/SupportAccess";  // NEW
import CustomerSupport from "./pages/CustomerSupport";  // NEW
import MyBookings from "./pages/MyBookings";  // NEW (optional, you can create this)

import TourPackageDetails from '@/pages/TourPackageDetails';

// In your routes:


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>  {/* WRAP WITH AuthProvider */}
          <ChatProvider>
            <Routes>
              {/* PUBLIC ROUTES - No login required */}
              <Route path="/" element={<Index />} />
              <Route path="/service" element={<Service />} />
              <Route path="/travel" element={<Travel />} />
              <Route path="/insurance" element={<Insurance />} />
              <Route path="/tour-packages" element={<TourPackages />} />
              <Route path="/tour-packages/:id" element={<TourPackageDetails />} />

              {/* AUTH ROUTE */}
              <Route path="/auth" element={<Auth />} />

              {/* PROTECTED ROUTES - Login required */}
              <Route 
                path="/payment" 
                element={
                  <ProtectedRoute>
                    <Payment />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/support-access" 
                element={
                  <ProtectedRoute>
                    <SupportAccess />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/my-bookings" 
                element={
                  <ProtectedRoute>
                    <MyBookings />
                  </ProtectedRoute>
                } 
              />

              {/* PROTECTED ROUTE - Login + Support Access required */}
              <Route 
                path="/customer-support" 
                element={
                  <ProtectedRoute requireSupportAccess={true}>
                    <CustomerSupport />
                  </ProtectedRoute>
                } 
              />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ChatProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
