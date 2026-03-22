# 🔐 PROTECTED ROUTES - COMPLETE IMPLEMENTATION GUIDE

## 📋 What Are Protected Routes?

Protected routes are pages that require **authentication** (being logged in) before users can access them. If someone tries to visit a protected page without being logged in, they're automatically redirected to the login page.

---

## 🎯 WHERE TO USE PROTECTED ROUTES

### ✅ Pages That NEED Protection (Login Required)

```typescript
1. /payment                 ← Users must login to make payments
2. /support-access          ← Users must login to purchase support
3. /my-bookings            ← Users must login to view their bookings
4. /customer-support       ← Users must login + have support access
```

### ❌ Pages That DON'T Need Protection (Public)

```typescript
1. /                       ← Home page (anyone can visit)
2. /auth                   ← Login/Register page (must be public!)
3. /service               ← Service info (anyone can view)
4. /travel                ← Travel info (anyone can view)
5. /insurance             ← Insurance info (anyone can view)
6. /tour-packages         ← Browse packages (anyone can view)
```

---

## 📝 STEP-BY-STEP IMPLEMENTATION

### Step 1: Create ProtectedRoute Component

Create `src/components/ProtectedRoute.tsx`:

```typescript
// src/components/ProtectedRoute.tsx
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireSupportAccess?: boolean;
}

export const ProtectedRoute = ({ 
  children, 
  requireSupportAccess = false 
}: ProtectedRouteProps) => {
  const { user, token, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!isLoading && (!user || !token)) {
      navigate('/auth', { replace: true });
    }

    // If requires support access but user doesn't have it
    if (!isLoading && user && requireSupportAccess && !user.support_access.has_access) {
      navigate('/support-access', { replace: true });
    }
  }, [user, token, isLoading, requireSupportAccess, navigate]);

  // Show loading spinner while checking
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#001540' }} />
      </div>
    );
  }

  // If no user, don't render (will redirect)
  if (!user || !token) return null;

  // If requires support access but doesn't have it, don't render
  if (requireSupportAccess && !user.support_access.has_access) return null;

  // User is authenticated, show the page
  return <>{children}</>;
};
```

---

### Step 2: Update App.tsx with Protected Routes

**REPLACE your entire `src/App.tsx` with this:**

```typescript
// src/App.tsx - COMPLETE WITH PROTECTED ROUTES
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChatProvider } from "./contexts/ChatContext";
import { AuthProvider } from "./contexts/AuthContext";  // ← NEW
import { ProtectedRoute } from "./components/ProtectedRoute";  // ← NEW

// Existing Pages
import Index from "./pages/Index";
import Service from "./pages/Service";
import Travel from "./pages/Travel";
import Insurance from "./pages/Insurance";
import Payment from "./pages/Payment";
import TourPackages from "./pages/TourPackages";
import NotFound from "./pages/NotFound";

// New Pages
import Auth from "./pages/Auth";  // ← NEW
import SupportAccess from "./pages/SupportAccess";  // ← NEW
import CustomerSupport from "./pages/CustomerSupport";  // ← NEW
import MyBookings from "./pages/MyBookings";  // ← NEW (optional)

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* ✅ WRAP EVERYTHING WITH AuthProvider */}
        <AuthProvider>
          <ChatProvider>
            <Routes>
              {/* ========================================
                  PUBLIC ROUTES - No login required
                  ======================================== */}
              <Route path="/" element={<Index />} />
              <Route path="/service" element={<Service />} />
              <Route path="/travel" element={<Travel />} />
              <Route path="/insurance" element={<Insurance />} />
              <Route path="/tour-packages" element={<TourPackages />} />
              
              {/* Auth page MUST be public (can't login if you need to be logged in!) */}
              <Route path="/auth" element={<Auth />} />

              {/* ========================================
                  PROTECTED ROUTES - Login required
                  ======================================== */}
              
              {/* Payment - Users must be logged in to pay */}
              <Route 
                path="/payment" 
                element={
                  <ProtectedRoute>
                    <Payment />
                  </ProtectedRoute>
                } 
              />

              {/* Support Access - Users must be logged in to purchase */}
              <Route 
                path="/support-access" 
                element={
                  <ProtectedRoute>
                    <SupportAccess />
                  </ProtectedRoute>
                } 
              />

              {/* My Bookings - Users must be logged in to view bookings */}
              <Route 
                path="/my-bookings" 
                element={
                  <ProtectedRoute>
                    <MyBookings />
                  </ProtectedRoute>
                } 
              />

              {/* ========================================
                  EXTRA PROTECTED - Login + Support Access
                  ======================================== */}
              
              {/* Customer Support - Must be logged in AND have support access */}
              <Route 
                path="/customer-support" 
                element={
                  <ProtectedRoute requireSupportAccess={true}>
                    <CustomerSupport />
                  </ProtectedRoute>
                } 
              />

              {/* 404 Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ChatProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
```

---

## 🔍 DETAILED EXPLANATION

### How Protection Works

#### Example 1: Regular Protected Route

```typescript
<Route 
  path="/payment" 
  element={
    <ProtectedRoute>
      <Payment />
    </ProtectedRoute>
  } 
/>
```

**What happens:**
1. User visits `/payment`
2. `ProtectedRoute` checks if `user` and `token` exist
3. **If NOT logged in:** Redirect to `/auth` ❌
4. **If logged in:** Show `<Payment />` page ✅

#### Example 2: Extra Protected (Support Access Required)

```typescript
<Route 
  path="/customer-support" 
  element={
    <ProtectedRoute requireSupportAccess={true}>
      <CustomerSupport />
    </ProtectedRoute>
  } 
/>
```

**What happens:**
1. User visits `/customer-support`
2. `ProtectedRoute` checks if `user` and `token` exist
3. **If NOT logged in:** Redirect to `/auth` ❌
4. **If logged in:** Check `user.support_access.has_access`
5. **If no support access:** Redirect to `/support-access` ❌
6. **If has support access:** Show `<CustomerSupport />` page ✅

---

## 📊 VISUAL FLOW DIAGRAM

### Public Route (No Protection)

```
User → /tour-packages
    ↓
Show page immediately ✅
```

### Protected Route (Login Required)

```
User → /payment
    ↓
Is user logged in?
    ├─ NO → Redirect to /auth ❌
    └─ YES → Show Payment page ✅
```

### Extra Protected Route (Login + Support Access)

```
User → /customer-support
    ↓
Is user logged in?
    ├─ NO → Redirect to /auth ❌
    └─ YES
        ↓
    Has support access?
        ├─ NO → Redirect to /support-access ❌
        └─ YES → Show Customer Support page ✅
```

---

## 🧪 TESTING YOUR PROTECTED ROUTES

### Test 1: Access Protected Page Without Login

```
1. Make sure you're logged OUT
2. Visit http://localhost:5173/payment
3. Expected: Redirect to /auth ✅
```

### Test 2: Access Protected Page With Login

```
1. Login to your account
2. Visit http://localhost:5173/payment
3. Expected: See Payment page ✅
```

### Test 3: Access Customer Support Without Support Access

```
1. Login to account (without buying support)
2. Visit http://localhost:5173/customer-support
3. Expected: Redirect to /support-access ✅
```

### Test 4: Access Customer Support With Support Access

```
1. Login to account
2. Purchase support access
3. Visit http://localhost:5173/customer-support
4. Expected: See Customer Support chat ✅
```

---

## 📋 QUICK REFERENCE TABLE

| Page | Path | Protection | Redirect If Not Logged In | Redirect If No Support |
|------|------|------------|---------------------------|------------------------|
| Home | `/` | ❌ None | - | - |
| Login | `/auth` | ❌ None | - | - |
| Tour Packages | `/tour-packages` | ❌ None | - | - |
| Payment | `/payment` | ✅ Login | `/auth` | - |
| Support Access | `/support-access` | ✅ Login | `/auth` | - |
| My Bookings | `/my-bookings` | ✅ Login | `/auth` | - |
| Customer Support | `/customer-support` | ✅ Login + Support | `/auth` | `/support-access` |

---

## 🎯 USER JOURNEY EXAMPLES

### Journey 1: New User Trying to Access Payment

```
1. User visits website (not logged in)
2. Clicks on "Book Package"
3. System creates booking
4. Redirects to /payment
   ↓
5. ProtectedRoute detects: NOT LOGGED IN
6. Redirects to /auth
   ↓
7. User logs in
8. After login, goes to /payment ✅
9. Completes payment
```

### Journey 2: User Trying to Access Customer Support

```
1. User logged in (no support access)
2. Clicks "Customer Support" in menu
3. Goes to /customer-support
   ↓
4. ProtectedRoute detects: NO SUPPORT ACCESS
5. Redirects to /support-access
   ↓
6. User sees purchase options
7. Buys support ($9.99 or $99.99)
8. Payment completes
9. Support access activated
10. Redirected to /customer-support ✅
```

---

## 🚨 COMMON MISTAKES TO AVOID

### ❌ MISTAKE 1: Protecting the Auth Page

```typescript
// WRONG - Don't do this!
<Route 
  path="/auth" 
  element={
    <ProtectedRoute>
      <Auth />
    </ProtectedRoute>
  } 
/>
```

**Problem:** Users can't login because they need to be logged in to see the login page! 🤦

**Solution:** Auth page must be PUBLIC:

```typescript
// CORRECT
<Route path="/auth" element={<Auth />} />
```

### ❌ MISTAKE 2: Forgetting to Wrap with AuthProvider

```typescript
// WRONG
<BrowserRouter>
  <ChatProvider>
    <Routes>
      {/* routes */}
    </Routes>
  </ChatProvider>
</BrowserRouter>
```

**Problem:** `useAuth()` won't work because there's no AuthProvider!

**Solution:**

```typescript
// CORRECT
<BrowserRouter>
  <AuthProvider>  {/* ← Must wrap here */}
    <ChatProvider>
      <Routes>
        {/* routes */}
      </Routes>
    </ChatProvider>
  </AuthProvider>
</BrowserRouter>
```

### ❌ MISTAKE 3: Using ProtectedRoute Component Inside Page

```typescript
// WRONG - Don't do this!
const Payment = () => {
  return (
    <ProtectedRoute>
      <Layout>
        {/* content */}
      </Layout>
    </ProtectedRoute>
  );
};
```

**Problem:** Protection should be in routing, not inside components!

**Solution:**

```typescript
// CORRECT - In App.tsx
<Route 
  path="/payment" 
  element={
    <ProtectedRoute>
      <Payment />
    </ProtectedRoute>
  } 
/>

// Payment.tsx stays normal
const Payment = () => {
  return (
    <Layout>
      {/* content */}
    </Layout>
  );
};
```

---

## ✅ FINAL CHECKLIST

Before deploying, make sure:

- [ ] `ProtectedRoute.tsx` component created
- [ ] `AuthProvider` wraps your app in `App.tsx`
- [ ] `/payment` is protected
- [ ] `/support-access` is protected
- [ ] `/my-bookings` is protected
- [ ] `/customer-support` is extra protected (requireSupportAccess)
- [ ] `/auth` is NOT protected (public)
- [ ] `/` home page is NOT protected (public)
- [ ] Test: Accessing protected page without login redirects to `/auth`
- [ ] Test: Accessing customer support without support access redirects to `/support-access`

---

## 🎓 SUMMARY

**Protected Routes = Pages that need login**

**Where to use:**
- ✅ /payment
- ✅ /support-access
- ✅ /my-bookings
- ✅ /customer-support (extra: requires support access)

**Where NOT to use:**
- ❌ /auth (must be public)
- ❌ / (home)
- ❌ /tour-packages
- ❌ Any public information pages

**How to implement:**
1. Create `ProtectedRoute.tsx`
2. Wrap routes in `App.tsx`
3. Add `AuthProvider` wrapper
4. Test everything!

---

**You're all set! Your protected routes are production-ready!** 🚀
