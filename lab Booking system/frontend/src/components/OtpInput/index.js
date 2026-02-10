import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const OtpContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
`;

const OtpHeader = styled.div`
  margin-bottom: 30px;
`;

const OtpIcon = styled.div`
  margin-bottom: 20px;
  color: #667eea;
`;

const OtpTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 10px;
`;

const OtpSubtitle = styled.p`
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 5px;
`;

const OtpEmail = styled.p`
  font-size: 1.1rem;
  font-weight: 600;
  color: #667eea;
  word-break: break-all;
`;

const OtpInputContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
`;

const OtpInputStyled = styled.input`
  width: 50px;
  height: 50px;
  text-align: center;
  font-size: 1.2rem;
  font-weight: 600;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  background: white;
  transition: all 0.3s ease;
  outline: none;

  &:focus, &.active, &[data-active="true"] {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &.error, &[data-error="true"] {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }

  &:disabled {
    background: #f9fafb;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
`;

const OtpError = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #ef4444;
  font-size: 0.9rem;
  margin-bottom: 20px;
  padding: 10px;
  background: #fef2f2;
  border-radius: 8px;
`;

const OtpSuccess = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #10b981;
  font-size: 0.9rem;
  margin-bottom: 20px;
  padding: 10px;
  background: #f0fdf4;
  border-radius: 8px;
`;

const OtpTimer = styled.div`
  margin-bottom: 25px;
`;

const TimerText = styled.span`
  font-size: 0.95rem;
  color: #6b7280;
`;

const TimerValue = styled.span`
  font-weight: 600;
  color: #667eea;
`;

const TimerExpired = styled.span`
  font-size: 0.95rem;
  color: #ef4444;
  font-weight: 500;
`;

const OtpActions = styled.div`
  margin-bottom: 25px;
`;

const ResendBtn = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    background: #e5e7eb;
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

const PaymentBtn = styled.button`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  margin-top: 10px;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 5px 15px rgba(16, 185, 129, 0.3);
  }

  &:disabled {
    background: #e5e7eb;
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

const OtpHelp = styled.div`
  border-top: 1px solid #e5e7eb;
  padding-top: 20px;
`;

const HelpText = styled.p`
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 10px;
`;

const HelpLink = styled.button`
  background: none;
  border: none;
  color: #667eea;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.3s ease;

  &:hover:not(:disabled) {
    color: #764ba2;
  }

  &:disabled {
    color: #9ca3af;
    cursor: not-allowed;
    text-decoration: none;
  }
`;

const SpinAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const AnimatedSpin = styled.div`
  animation: ${SpinAnimation} 1s linear infinite;
`;

const OtpTitleResponsive = styled(OtpTitle)`
  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`;

const OtpInputContainerResponsive = styled(OtpInputContainer)`
  @media (max-width: 480px) {
    gap: 8px;
  }
`;

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const OtpInput = ({ 
  length = 6, 
  onComplete, 
  onResend, 
  email, 
  isLoading = false, 
  error = '', 
  timeLeft = 600,
  onTimeExpire,
  enablePayment = false,
  paymentAmount = 0,
  user = null,
  navigate = null
}) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const [activeIndex, setActiveIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(timeLeft);
  const [paymentStatus, setPaymentStatus] = useState({ type: '', message: '' });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (onTimeExpire) {
      onTimeExpire();
    }
  }, [timeRemaining, onTimeExpire]);

  const handleChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste event
      const pastedValue = value.slice(0, length);
      const newOtp = [...otp];
      for (let i = 0; i < length; i++) {
        newOtp[i] = pastedValue[i] || '';
      }
      setOtp(newOtp);
      
      // Focus on the next empty input or the last one
      const nextEmptyIndex = newOtp.findIndex(val => val === '');
      const focusIndex = nextEmptyIndex === -1 ? length - 1 : nextEmptyIndex;
      inputRefs.current[focusIndex]?.focus();
      
      // Check if OTP is complete
      if (newOtp.every(val => val !== '')) {
        onComplete(newOtp.join(''));
      }
    } else {
      // Handle single character input
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      if (value && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
      
      // Check if OTP is complete
      if (newOtp.every(val => val !== '')) {
        onComplete(newOtp.join(''));
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
    handleChange(0, pastedData);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResend = () => {
    setOtp(new Array(length).fill(''));
    setTimeRemaining(timeLeft);
    inputRefs.current[0]?.focus();
    onResend();
  };

  const handlePayment = async () => {
    if (!enablePayment || !paymentAmount || !user?.token) {
      return;
    }

    setIsProcessingPayment(true);
    setPaymentStatus({ type: '', message: '' });

    try {
      const orderRes = await fetch("/api/payments/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ amount: paymentAmount }),
      });
      
      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData?.success) {
        setPaymentStatus({
          type: "error",
          message: orderData?.message || "Failed to create payment order",
        });
        setIsProcessingPayment(false);
        return;
      }

      const scriptLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!scriptLoaded) {
        setPaymentStatus({ type: "error", message: "Failed to load Razorpay SDK." });
        setIsProcessingPayment(false);
        return;
      }

      const { orderId, amount: amtPaise, currency, key } = orderData.data || {};
      if (!orderId || !key) {
        setPaymentStatus({ type: "error", message: "Invalid order response from server." });
        setIsProcessingPayment(false);
        return;
      }

      const options = {
        key,
        amount: amtPaise,
        currency: currency || "INR",
        name: "Lab Booking System",
        description: "Payment for Lab Services",
        order_id: orderId,
        prefill: {
          name: user?.name || "User",
          email: user?.email || "",
        },
        handler: async function (response) {
          try {
            const verifyRes = await fetch("/api/payments/verify", {
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
                  packagePrice: Number(paymentAmount) || 0,
                  totalAmount: Number(paymentAmount) || 0,
                },
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData?.success) {
              setPaymentStatus({
                type: "error",
                message: verifyData?.message || "Payment verification failed.",
              });
              return;
            }
            setPaymentStatus({ type: "success", message: "Payment successful!" });
            if (navigate) {
              setTimeout(() => navigate("/history"), 2000);
            }
          } catch (e) {
            setPaymentStatus({ type: "error", message: "Payment verification failed." });
          }
        },
        theme: {
          color: "#667eea",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (resp) {
        setPaymentStatus({
          type: "error",
          message: resp.error?.description || "Payment failed. Please try again.",
        });
      });
      rzp.open();
    } catch (error) {
      setPaymentStatus({ type: "error", message: "Unexpected error initiating payment." });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <OtpContainer>
      <OtpHeader>
        <OtpIcon>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 8L7.5 12L3 16M9 20H15M21 8L16.5 12L21 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </OtpIcon>
        <OtpTitleResponsive>Verify Your Email</OtpTitleResponsive>
        <OtpSubtitle>
          We've sent a verification code to
        </OtpSubtitle>
        <OtpEmail>{email}</OtpEmail>
      </OtpHeader>

      <OtpInputContainerResponsive>
        {otp.map((value, index) => (
          <OtpInputStyled
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={value}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            onFocus={() => setActiveIndex(index)}
            data-active={activeIndex === index}
            data-error={error}
            disabled={isLoading}
          />
        ))}
      </OtpInputContainerResponsive>

      {error && (
        <OtpError>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {error}
        </OtpError>
      )}

      {paymentStatus.message && (
        paymentStatus.type === 'error' ? (
          <OtpError>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {paymentStatus.message}
          </OtpError>
        ) : (
          <OtpSuccess>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {paymentStatus.message}
          </OtpSuccess>
        )
      )}

      <OtpTimer>
        {timeRemaining > 0 ? (
          <TimerText>
            Code expires in <TimerValue>{formatTime(timeRemaining)}</TimerValue>
          </TimerText>
        ) : (
          <TimerExpired>Code has expired</TimerExpired>
        )}
      </OtpTimer>

      <OtpActions>
        <ResendBtn
          onClick={handleResend}
          disabled={timeRemaining > 0 || isLoading}
        >
          {isLoading ? (
            <>
              <AnimatedSpin>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C14.6111 3 16.9722 4.08889 18.6111 5.77778M21 3V6H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </AnimatedSpin>
              Sending...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 8L7.5 12L3 16M9 20H15M21 8L16.5 12L21 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Resend Code
            </>
          )}
        </ResendBtn>

        {enablePayment && paymentAmount > 0 && (
          <PaymentBtn
            onClick={handlePayment}
            disabled={isProcessingPayment || otp.some(val => val === '')}
          >
            {isProcessingPayment ? (
              <>
                <AnimatedSpin>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C14.6111 3 16.9722 4.08889 18.6111 5.77778M21 3V6H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </AnimatedSpin>
                Processing...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 10H18M7 15H18M13 20H18M21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Pay ₹{paymentAmount}
              </>
            )}
          </PaymentBtn>
        )}
      </OtpActions>

      <OtpHelp>
        <HelpText>
          Didn't receive the email? Check your spam folder or
        </HelpText>
        <HelpLink 
          onClick={handleResend}
          disabled={timeRemaining > 0 || isLoading}
        >
          try a different email address
        </HelpLink>
      </OtpHelp>
    </OtpContainer>
  );
};

export default OtpInput;
