import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface PayPalPaymentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefilledAmount?: string;
  itemDescription?: string;
}
const API_BASE_URL = process.env.REACT_APP_API_URL ||  "https://openskai.onrender.com";
console.log("API Base URL:", API_BASE_URL);



declare global {
  interface Window {
    paypal: any;
  }
}

export const PayPalPayment = ({ open, onOpenChange, prefilledAmount, itemDescription }: PayPalPaymentProps) => {
  const [amount, setAmount] = useState(prefilledAmount || "");
  const [loading, setLoading] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const { toast } = useToast();

  // Update amount when prefilledAmount changes
  useEffect(() => {
    if (prefilledAmount) {
      setAmount(prefilledAmount);
    }
  }, [prefilledAmount]);

  useEffect(() => {
    // Load PayPal SDK
    if (!window.paypal) {
      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}&currency=USD`;
      script.async = true;
      script.onload = () => setPaypalLoaded(true);
      document.body.appendChild(script);
    } else {
      setPaypalLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (paypalLoaded && open && amount && parseFloat(amount) > 0) {
      renderPayPalButtons();
    }
  }, [paypalLoaded, open, amount]);

  const renderPayPalButtons = () => {
    const container = document.getElementById("paypal-button-container");
    if (!container) return;
    
    container.innerHTML = "";

    window.paypal.Buttons({
      createOrder: async () => {
        
        try {
          const response = await fetch(`${API_BASE_URL}/api/paypal/create-order`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              amount: parseFloat(amount).toFixed(2),
              currency: "USD",
            }),
          });

          const data = await response.json();
          return data.orderId;
        } catch (error) {
          console.error("Error creating order:", error);
          toast({
            title: "Error",
            description: "Failed to create PayPal order",
            variant: "destructive",
          });
          throw error;
        }
      },
      onApprove: async (data: any) => {
        try {
          setLoading(true);
          const response = await fetch(`${API_BASE_URL}/api/paypal/capture-order`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              orderId: data.orderID,
            }),
          });

          const details = await response.json();
          
          if (details.status === "COMPLETED") {
            toast({
              title: "Payment Successful!",
              description: `Payment of $${amount} completed successfully.`,
            });
            onOpenChange(false);
            setAmount("");
          } else {
            throw new Error("Payment not completed");
          }
        } catch (error) {
          console.error("Error capturing order:", error);
          toast({
            title: "Error",
            description: "Failed to complete payment",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      },
      onError: (err: any) => {
        console.error("PayPal error:", err);
        toast({
          title: "Error",
          description: "Payment failed. Please try again.",
          variant: "destructive",
        });
      },
    }).render("#paypal-button-container");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>PayPal Payment</DialogTitle>
          {itemDescription && (
            <p className="text-sm text-muted-foreground mt-2">{itemDescription}</p>
          )}
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (USD)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              // onChange={(e) => setAmount(e.target.value)}
              // min="0.01"
              // step="0.01"
            />
          </div>
          
          {paypalLoaded && amount && parseFloat(amount) > 0 ? (
            <div id="paypal-button-container" className="mt-4"></div>
          ) : (
            <p className="text-sm text-muted-foreground text-center">
              {!paypalLoaded ? "Loading PayPal..." : "Enter an amount to continue"}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
