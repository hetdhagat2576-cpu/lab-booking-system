import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { createApiUrl } from "../../config/api";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Theme from "../../config/theam/index.js";
import CButton from "../../components/cButton";
import { Box, Paper, Typography, TextField, Alert, Divider } from "@mui/material";
import { useAuth } from "../../context/authContext";

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function RazorpayPaymentPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const [amount, setAmount] = useState(() => {
    const fromQuery = Number(searchParams.get("amount") || 0);
    return Number.isFinite(fromQuery) && fromQuery > 0 ? fromQuery : 0;
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const headerNav = {
    goToHome: () => navigate("/"),
    goToAbout: () => navigate("/about"),
    goToServices: () => navigate("/services"),
    goToLogin: () => navigate("/login-selection"),
    goToRegister: () => navigate("/register"),
  };

  const handlePay = useCallback(async () => {
    if (!isAuthenticated || !user?.token) {
      navigate("/user-login");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setStatus({ type: "error", message: "Enter a valid amount." });
      return;
    }
    setStatus({ type: "", message: "" });
    setLoading(true);
    try {
      const orderRes = await fetch(createApiUrl('/api/payments/appointment-payment'), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ amount }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData?.success) {
        const msg = orderData?.message || "Failed to create payment order";
        if (msg.toLowerCase().includes("razorpay keys not configured")) {
          setStatus({
            type: "error",
            message:
              "Razorpay keys not configured on backend. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend .env and restart the server.",
          });
        } else {
          setStatus({ type: "error", message: msg });
        }
        setLoading(false);
        return;
      }

      const scriptLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!scriptLoaded) {
        setStatus({ type: "error", message: "Failed to load Razorpay SDK." });
        setLoading(false);
        return;
      }

      const { orderId, amount: amtPaise, currency, key } = orderData.data || {};
      if (!orderId || !key) {
        setStatus({ type: "error", message: "Invalid order response from server." });
        setLoading(false);
        return;
      }

      const isMock = orderData.data && (orderData.data.mock === true || String(key || '').includes('mock'));
      if (isMock) {
        // Simulate successful payment when server is in mock mode
        try {
          const fakeResponse = {
            razorpay_order_id: orderId,
            razorpay_payment_id: 'pay_mock_' + Date.now(),
            razorpay_signature: 'sig_mock',
          };
          const verifyRes = await fetch(createApiUrl('/api/payments/verify'), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
              ...fakeResponse,
              bookingData: {
                labAppointment: "Online Payment",
                labName: "Online Payment",
                date: new Date().toISOString().slice(0, 10),
                time: new Date().toTimeString().slice(0, 5),
                duration: "N/A",
                patientName: user?.name || "User",
                packageName: "Bill Payment",
                packagePrice: Number(amount) || 0,
                totalAmount: Number(amount) || 0,
              },
            }),
          });
          const verifyData = await verifyRes.json();
          if (!verifyRes.ok || !verifyData?.success) {
            setStatus({ type: "error", message: verifyData?.message || "Payment verified but booking creation failed." });
            setLoading(false);
            return;
          }
          setStatus({ type: "success", message: "Payment successful (mock)! Redirecting to dashboard..." });
          setLoading(false);
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
          return;
        } catch (e) {
          setStatus({ type: "error", message: "Mock payment verification failed." });
          setLoading(false);
          return;
        }
      }

      const options = {
        key,
        amount: amtPaise,
        currency: currency || "INR",
        name: "Lab Booking System",
        description: "Confirm & Pay Bill",
        order_id: orderId,
        prefill: {
          name: user?.name || "User",
          email: user?.email || "",
        },
        notes: {
          purpose: "Bill Payment",
        },
        handler: async function (response) {
          try {
            const verifyRes = await fetch(createApiUrl('/api/payments/verify'), {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingData: {
                  labAppointment: "Online Payment",
                  labName: "Online Payment",
                  date: new Date().toISOString().slice(0, 10),
                  time: new Date().toTimeString().slice(0, 5),
                  duration: "N/A",
                  patientName: user?.name || "User",
                  packageName: "Bill Payment",
                  packagePrice: Number(amount) || 0,
                  totalAmount: Number(amount) || 0,
                },
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData?.success) {
              setStatus({
                type: "error",
                message: verifyData?.message || "Payment verified but booking creation failed.",
              });
              setLoading(false);
              return;
            }
            setStatus({ type: "success", message: "Payment successful! Redirecting to dashboard..." });
            setTimeout(() => {
              navigate("/dashboard");
            }, 2000);
          } catch (e) {
            console.error('Payment verification error:', e);
            setStatus({ type: "error", message: "Payment verification failed. Please try again." });
            setLoading(false);
          }
        },
        theme: {
          color: "#2563eb",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (resp) {
        console.error('Payment failed:', resp.error);
        setStatus({
          type: "error",
          message: resp.error?.description || "Payment failed. Please try again.",
        });
        setLoading(false);
      });
      rzp.open();
    } catch (error) {
      setStatus({ type: "error", message: "Unexpected error initiating payment." });
    } finally {
      setLoading(false);
    }
  }, [amount, isAuthenticated, navigate, user]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header bgColor={Theme.primary} headerNav={headerNav} />
      <div className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <Box maxWidth="md" sx={{ mx: "auto" }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: Theme.primaryText }}>
              Confirm & Pay Bill
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: Theme.textLight }}>
              Enter the bill amount and proceed to pay securely via Razorpay.
            </Typography>
            <Divider sx={{ my: 2 }} />
            {status.message ? (
              <Alert severity={status.type === "error" ? "error" : "success"} sx={{ mb: 2 }}>
                {status.message}
              </Alert>
            ) : null}
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <TextField
                label="Amount (INR)"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                inputProps={{ min: 1 }}
              />
              <CButton
                onClick={handlePay}
                disabled={loading}
                variant="primary"
                className="text-white"
              >
                {loading ? "Processing..." : "Confirm & Pay"}
              </CButton>
            </Box>
          </Paper>
        </Box>
      </div>
      <Footer />
    </div>
  );
}

