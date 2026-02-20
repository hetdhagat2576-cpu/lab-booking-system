import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createApiUrl, safeFetch } from "../../config/api";
import IconConfig from "../../components/icon/index.js";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Theme from "../../config/theam/index.js";
import { labNames, durationOptions, timeSlots, FULL_BODY_PACKAGES, DIABETES_PACKAGES, THYROID_HEALTH_PACKAGES, KIDNEY_HEALTH_PACKAGES, LUNG_HEALTH_PACKAGES, FEVER_PACKAGES, LIVER_HEALTH_PACKAGES } from "../../config/staticData";
import { Button,TextField,Box,Paper, Typography, MenuItem,Select, 
          FormControl,InputLabel,Alert,Divider,Card,CardContent
} from "@mui/material";
import Swal from "sweetalert2";


export default function NewBooking() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const packageId = searchParams.get("package");
  const testNameParam = searchParams.get("name");
  const testPriceParam = searchParams.get("price");
  const isReschedule = searchParams.get("reschedule") === "true";
  const originalBookingId = searchParams.get("originalBookingId");
  const testsParam = searchParams.get("tests");
  const { Calendar, ArrowLeft, Send, CheckCircle2, User, Receipt, X } = IconConfig;

  // Find package by ID across all package categories
  const findPackageById = (id) => {
    const allPackages = [
      ...FULL_BODY_PACKAGES,
      ...DIABETES_PACKAGES,
      ...THYROID_HEALTH_PACKAGES,
      ...KIDNEY_HEALTH_PACKAGES,
      ...LUNG_HEALTH_PACKAGES,
      ...FEVER_PACKAGES,
      ...LIVER_HEALTH_PACKAGES
    ];
    return allPackages.find(pkg => pkg.id === parseInt(id));
  };

  // Get initial package details
  const getInitialPackageDetails = () => {
    if (packageId) {
      const packageData = findPackageById(packageId);
      if (packageData) {
        return {
          name: packageData.title,
          price: packageData.price
        };
      }
    }
    
    if (testNameParam) {
      return {
        name: decodeURIComponent(testNameParam),
        price: testPriceParam ? parseFloat(testPriceParam) || 0 : 0
      };
    }
    
    return {
      name: isReschedule ? "Reschedule Lab Appointment" : "Lab Appointment",
      price: 0
    };
  };

  const initialPackageDetails = getInitialPackageDetails();

  // SweetAlert helper functions with centralized theme configuration
const sweetAlertConfig = {
  baseConfig: {
    background: Theme.colors.white,
    color: Theme.colors.textDark,
    confirmButtonColor: Theme.colors.primary,
    cancelButtonColor: '#6b7280',
    customClass: {
      popup: 'rounded-lg shadow-xl',
      title: 'text-xl font-semibold',
      content: 'text-gray-700',
      confirmButton: 'px-6 py-2 font-medium rounded-lg hover:opacity-90 transition-opacity',
      cancelButton: 'px-6 py-2 font-medium rounded-lg hover:opacity-90 transition-opacity'
    },
    buttonsStyling: false
  },
  successConfig: {
    icon: 'success',
    iconColor: Theme.colors.primary,
    showConfirmButton: true,
    confirmButtonText: 'OK',
    timer: 4000,
    timerProgressBar: true
  },
  errorConfig: {
    icon: 'error',
    iconColor: '#dc3741',
    showConfirmButton: true,
    confirmButtonText: 'OK'
  },
  warningConfig: {
    icon: 'warning',
    iconColor: '#f59e0b',
    showConfirmButton: true,
    confirmButtonText: 'OK'
  },
  loadingConfig: {
    icon: 'info',
    iconColor: Theme.colors.primary,
    showConfirmButton: false,
    showCancelButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false
  }
};

const showErrorAlert = (title, message, options = {}) => {
  return Swal.fire({
    ...sweetAlertConfig.baseConfig,
    ...sweetAlertConfig.errorConfig,
    title,
    text: message,
    ...options
  });
};

const showSuccessAlert = (title, message, options = {}) => {
  return Swal.fire({
    ...sweetAlertConfig.baseConfig,
    ...sweetAlertConfig.successConfig,
    title,
    text: message,
    ...options
  });
};

const showWarningAlert = (title, message, options = {}) => {
  return Swal.fire({
    ...sweetAlertConfig.baseConfig,
    ...sweetAlertConfig.warningConfig,
    title,
    text: message,
    ...options
  });
};

const showLoadingAlert = (title = 'Loading...', message = 'Please wait') => {
  return Swal.fire({
    ...sweetAlertConfig.baseConfig,
    ...sweetAlertConfig.loadingConfig,
    title,
    text: message,
    didOpen: () => {
      Swal.showLoading();
    }
  });
};

const closeAlert = () => {
  Swal.close();
};

const showLoginRequiredAlert = (navigate) => {
  return Swal.fire({
    ...sweetAlertConfig.baseConfig,
    ...sweetAlertConfig.warningConfig,
    title: 'Login Required',
    text: 'Please login to create a booking',
    confirmButtonText: 'Login',
    cancelButtonText: 'Cancel',
    showCancelButton: true
  }).then((result) => {
    if (result.isConfirmed && navigate) {
      navigate('/login-selection');
    }
  });
};

const showPaymentError = (message) => {
  return showErrorAlert('Payment Error', message);
};

const showBookingSuccess = () => {
  return showSuccessAlert('Booking Confirmed', 'Your appointment has been booked successfully!');
};

const showPaymentSuccess = () => {
  Swal.fire({
    title: 'Payment Successful!',
    text: 'Your booking has been confirmed! Redirecting to dashboard...',
    icon: 'success',
    iconColor: Theme.colors.primary,
    background: Theme.colors.white,
    color: Theme.colors.textDark,
    confirmButtonColor: Theme.colors.primary,
    customClass: {
      popup: 'rounded-lg shadow-xl',
      title: 'text-xl font-semibold',
      content: 'text-gray-700',
      confirmButton: 'px-6 py-2 font-medium rounded-lg hover:opacity-90 transition-opacity'
    },
    buttonsStyling: false,
    timer: 3000,
    timerProgressBar: true,
    showConfirmButton: false
  }).then(() => {
    // Redirect to dashboard after alert closes
    navigate('/dashboard');
  });
  
  // Also redirect as fallback after 3.5 seconds
  setTimeout(() => {
    navigate('/dashboard');
  }, 3500);
};

  // Get selected tests for individual test
  const getSelectedTests = () => {
    // Handle reschedule with existing tests
    if (testsParam) {
      try {
        return JSON.parse(decodeURIComponent(testsParam));
      } catch (error) {
        console.error('Error parsing tests parameter:', error);
      }
    }
    
    // Handle individual test selection
    if (testNameParam) {
      return [{
        name: testNameParam,
        description: `Individual test booking`,
        price: testPriceParam ? parseFloat(testPriceParam) : 0
      }];
    }
    return [];
  };

  const selectedTests = getSelectedTests();


  // State for form data
  const [formData, setFormData] = useState({
    labAppointment: "",
    date: "",
    time: "",
    patientName: "",
    packageName: initialPackageDetails.name,
    packagePrice: initialPackageDetails.price
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [user, setUser] = useState(null);
  const [showBill, setShowBill] = useState(false);
  const [modalStatus, setModalStatus] = useState({ type: "", message: "" });
  const [helpfulAnswer, setHelpfulAnswer] = useState(null);
  const [helpfulSubmitted, setHelpfulSubmitted] = useState(false);
  const [packageData, setPackageData] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("lab_user");
    const userData = stored ? JSON.parse(stored) : null;
    setUser(userData);
  }, []);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (showBill) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Disable scrolling
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Re-enable scrolling and restore position
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [showBill]);

  // Update form data when packageId or testNameParam changes
  useEffect(() => {
    const fetchPackageData = async () => {
      console.log("fetchPackageData called with:", { packageId, testNameParam, testPriceParam });
      
      if (packageId) {
        // First try to find in static data (for packages with numeric IDs)
        console.log("Using static data for packageId:", packageId);
        const staticPackageData = findPackageById(packageId);
        console.log("Static package data found:", staticPackageData);
        if (staticPackageData) {
          setPackageData(staticPackageData);
          setFormData(prev => ({
            ...prev,
            packageName: staticPackageData.title,
            packagePrice: staticPackageData.price
          }));
          return; // Found in static data, no need to try API
        }
        
        // If not found in static data, try API (for MongoDB packages)
        try {
          const response = await safeFetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/packages/${packageId}`);
          if (response.ok) {
            const json = await response.json();
            if (json.success && json.data) {
              console.log("Package found via API:", json.data);
              setPackageData(json.data);
              setFormData(prev => ({
                ...prev,
                packageName: json.data.name || json.data.title,
                packagePrice: json.data.price || 0
              }));
              return;
            }
          }
        } catch (e) {
          console.log("API fetch failed, continuing with fallback", e);
        }
        
        // If we reach here, package was not found anywhere
        console.log("No package data found for ID:", packageId);
        setPackageData(null);
        setFormData(prev => ({
          ...prev,
          packageName: "Package Not Found",
          packagePrice: 0
        }));
      } else if (testNameParam) {
        // Handle individual test
        console.log("Handling individual test:", testNameParam);
        setFormData(prev => ({
          ...prev,
          packageName: decodeURIComponent(testNameParam),
          packagePrice: testPriceParam ? parseFloat(testPriceParam) || 0 : 0
        }));
        setPackageData(null);
      } else {
        // Default case
        console.log("Using default case");
        setFormData(prev => ({
          ...prev,
          packageName: "Lab Appointment",
          packagePrice: 0
        }));
        setPackageData(null);
      }
    };

    fetchPackageData();
  }, [packageId, testNameParam, testPriceParam]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
    if (submitError) setSubmitError("");
    setShowBill(false);
  };



  const validateForm = () => {
    const newErrors = {};
    if (!formData.labAppointment) newErrors.labAppointment = "Hospital lab appointment is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.time) newErrors.time = "Time is required";
    if (!formData.patientName) newErrors.patientName = "Patient name is required";
    
    // No validation needed for package/test selection as it's removed

    if (formData.date) {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = "Date cannot be in the past";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotal = () => {
    return formData.packagePrice || 0;
  };

  const handleCreateBooking = () => {
    if (!validateForm()) return;
    
    // Check if user is authenticated
    if (!user) {
      showLoginRequiredAlert(navigate);
      return;
    }
    
    setModalStatus({ type: "", message: "" });
    setShowBill(true);
  };

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleConfirmBooking = async () => {
    if (!user) return;
    const token = user?.token || "";
    const amount = calculateTotal();
    
    // Debug logging
    console.log("Payment Debug - Amount:", amount);
    console.log("Payment Debug - Package Name:", formData.packageName);
    console.log("Payment Debug - Package Price:", formData.packagePrice);
    
    // Validate amount before proceeding
    if (amount <= 0) {
      // For zero amount bookings, proceed without payment
      setModalStatus({ type: "", message: "" });
      // Create booking directly without payment
      const bookingData = {
        labAppointment: formData.labAppointment,
        labName: formData.labAppointment,
        date: formData.date,
        time: formData.time,
        patientName: formData.patientName,
        packageName: formData.packageName || "General consultation",
        packagePrice: 0,
        totalAmount: 0,
        selectedTests: selectedTests,
        rescheduleFrom: isReschedule ? originalBookingId : null,
      };
      
      // Handle reschedule - cancel original booking first
      if (isReschedule && originalBookingId) {
        try {
          await fetch(createApiUrl(`/api/bookings/${originalBookingId}/status`), {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: 'cancelled' })
          });
        } catch (error) {
          console.error('Error cancelling original booking:', error);
          // Continue with new booking even if cancellation fails
        }
      }
      
      // Direct booking creation without payment
      try {
        const bookingRes = await fetch(createApiUrl('/api/bookings'), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bookingData),
        });
        const bookingResult = await bookingRes.json();
        if (bookingRes.ok && bookingResult.success) {
          setShowBill(false);
          if (isReschedule) {
            showSuccessAlert('Booking Rescheduled', 'Your appointment has been successfully rescheduled!');
          } else {
            showBookingSuccess();
          }
          // Reset form instead of redirecting
          setFormData({
            labAppointment: "",
            date: "",
            time: "",
            patientName: "",
            packageName: "Lab Appointment",
            packagePrice: 0
          });
          setPackageData(null);
        } else {
          setModalStatus({ type: "error", message: bookingResult.message || "Booking failed" });
        }
      } catch (e) {
        setModalStatus({ type: "error", message: "Booking failed: " + e.message });
      }
      return;
    }
    
    // Don't close the bill modal yet - keep it open until payment is complete
    setModalStatus({ type: "", message: "" });
    
    try {
      const orderRes = await fetch(createApiUrl('/api/payments/appointment-payment'), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });
      const orderData = await orderRes.json();
      console.log("Payment API Response:", orderData);
      console.log("Payment API Status:", orderRes.status);
      
      if (!orderRes.ok || !orderData.success) {
        setModalStatus({ type: "error", message: orderData.message || "Unable to initiate payment" });
        showPaymentError(orderData.message || "Unable to initiate payment");
        return;
      }
      // If backend returned a mock order (local dev), skip loading the Razorpay SDK
      const isMock = orderData.data && (orderData.data.mock === true || String(orderData.data.key || '').includes('mock'));
      if (isMock) {
        // Simulate payment success by calling verify endpoint directly (server in mock mode will accept it)
        try {
          const fakeResponse = {
            razorpay_order_id: orderData.data.orderId,
            razorpay_payment_id: 'pay_mock_' + Date.now(),
            razorpay_signature: 'sig_mock',
          };
          const bookingData = {
            labAppointment: formData.labAppointment,
            labName: formData.labAppointment,
            date: formData.date,
            time: formData.time,
            patientName: formData.patientName,
            packageName: formData.packageName,
            packagePrice: formData.packagePrice,
            totalAmount: amount,
            selectedTests: selectedTests,
            rescheduleFrom: isReschedule ? originalBookingId : null,
          };
          
          // Handle reschedule - cancel original booking first
          if (isReschedule && originalBookingId) {
            try {
              await fetch(createApiUrl(`/api/bookings/${originalBookingId}/status`), {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: 'cancelled' })
              });
            } catch (error) {
              console.error('Error cancelling original booking:', error);
              // Continue with new booking even if cancellation fails
            }
          }
          
          const verifyRes = await fetch(createApiUrl('/api/payments/verify'), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              ...fakeResponse,
              bookingData,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyRes.ok && verifyData.success) {
            // Only close modal and show success AFTER payment is verified
            setShowBill(false);
            if (isReschedule) {
              showSuccessAlert('Booking Rescheduled', 'Your appointment has been successfully rescheduled!');
              // Reset form after reschedule
              setFormData({
                labAppointment: "",
                date: "",
                time: "",
                patientName: "",
                packageName: "Lab Appointment",
                packagePrice: 0
              });
              setPackageData(null);
            } else {
              showPaymentSuccess();
            }
            return;
          } else {
            setModalStatus({ type: "error", message: verifyData.message || "Payment verification failed" });
            return;
          }
        } catch (e) {
          setModalStatus({ type: "error", message: "Mock payment verification failed" });
          showPaymentError("Mock payment verification failed");
          return;
        }
      }
      const ok = await loadRazorpayScript();
      if (!ok) {
        setModalStatus({ type: "error", message: "Razorpay SDK failed to load" });
        showPaymentError("Razorpay SDK failed to load");
        return;
      }
      const options = {
        key: orderData.data.key,
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        name: "Lab Booking",
        description: formData.packageName || "Health Package",
        order_id: orderData.data.orderId,
        prefill: {
          name: user.name || formData.patientName || "",
          email: user.email || "",
        },
        modal: {
          ondismiss: function() {
            // Handle when user closes Razorpay modal without paying
            setModalStatus({ 
              type: "error", 
              message: "Payment cancelled. Please complete the payment to confirm your booking." 
            });
          },
        },
        handler: async function (response) {
          // Only show success AFTER successful payment
          const bookingData = {
            labAppointment: formData.labAppointment,
            labName: formData.labAppointment,
            date: formData.date,
            time: formData.time,
            patientName: formData.patientName,
            packageName: formData.packageName,
            packagePrice: formData.packagePrice,
            totalAmount: amount,
            selectedTests: selectedTests,
            rescheduleFrom: isReschedule ? originalBookingId : null,
          };
          
          // Handle reschedule - cancel original booking first
          if (isReschedule && originalBookingId) {
            try {
              await fetch(createApiUrl(`/api/bookings/${originalBookingId}/status`), {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: 'cancelled' })
              });
            } catch (error) {
              console.error('Error cancelling original booking:', error);
              // Continue with new booking even if cancellation fails
            }
          }
          
          const verifyRes = await fetch(createApiUrl('/api/payments/verify'), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingData,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyRes.ok && verifyData.success) {
            // Only close modal and show success AFTER payment is verified
            setShowBill(false);
            if (isReschedule) {
              showSuccessAlert('Booking Rescheduled', 'Your appointment has been successfully rescheduled!');
              // Reset form after reschedule
              setFormData({
                labAppointment: "",
                date: "",
                time: "",
                patientName: "",
                packageName: "Lab Appointment",
                packagePrice: 0
              });
              setPackageData(null);
            } else {
              showPaymentSuccess();
            }
            return;
          } else {
            setModalStatus({ type: "error", message: verifyData.message || "Payment verification failed" });
            return;
          }
        },
      };
      const rzp = new window.Razorpay(options);
      // Add payment failed handler
      rzp.on('payment.failed', function (response) {
        setModalStatus({ 
          type: "error", 
          message: response.error.description || "Payment failed. Please try again." 
        });
        showPaymentError(response.error.description || "Payment failed. Please try again.");
      });
      rzp.open();
    } catch (e) {
      console.error("Payment initialization error:", e);
      console.error("Error details:", e.message);
      setModalStatus({ type: "error", message: `Payment initialization failed: ${e.message || 'Please try again.'}` });
      showPaymentError(`Payment initialization failed: ${e.message || 'Please try again.'}`);
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const totalAmount = calculateTotal();

  return (
    <div className={Theme.layout.standardPage}>
      <Header hideNavItems={true} />

      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Header Section */}
        <Box mb={4}>
          <Button
            startIcon={<ArrowLeft />}
            onClick={() => navigate("/dashboard")}
            sx={{
              mb: 2,
              color: Theme.colors.primary,
              "&:hover": { backgroundColor: "rgba(42, 122, 142, 0.1)" }
            }}
          >
            Back to Dashboard
          </Button>
          <Typography variant="h4" component="h1" fontWeight="bold" color={Theme.colors.primary} mb={1}>
            {isReschedule ? 'Reschedule Booking' : 'New Booking'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isReschedule ? 'Select a new date and time for your lab appointment' : 'Fill in the details below to create a new hospital lab appointment'}
          </Typography>
        </Box>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Booking Form */}
          <div className="lg:col-span-2">
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
              <form>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {/* Hospital Lab Appointment */}
                  <FormControl fullWidth error={!!errors.labAppointment}>
                    <InputLabel id="lab-appointment-label">Hospital Lab Appointment *</InputLabel>
                    <Select
                      labelId="lab-appointment-label"
                      id="lab-appointment"
                      name="labAppointment"
                      value={formData.labAppointment}
                      onChange={handleChange}
                      label="Hospital Lab Appointment *"
                      sx={{
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: errors.labAppointment ? "error.main" : Theme.colors.primary,
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: Theme.colors.primary,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: Theme.colors.primary,
                        },
                      }}
                    >
                      {labNames.map((lab) => (
                        <MenuItem key={lab} value={lab}>
                          {lab}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.labAppointment && (
                      <Typography variant="caption" className="text-red-500 text-xs" sx={{ mt: 0.5, ml: 1.75 }}>
                        {errors.labAppointment}
                      </Typography>
                    )}
                  </FormControl>

                  {/* Package/Test Info (if pre-selected via URL parameters) */}
                  {(packageId || testNameParam) && (
                    <Card sx={{ bgcolor: Theme.colors.secondary, color: Theme.colors.primary, p: 2 }}>
                      <CardContent sx={{ p: "16px !important" }}>
                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 3 }}>
                          {/* Package Image */}
                          {packageData && packageData.image && (
                            <Box
                              component="img"
                              src={packageData.image}
                              alt={formData.packageName}
                              sx={{
                                width: 80,
                                height: 80,
                                borderRadius: 2,
                                objectFit: "cover",
                                flexShrink: 0
                              }}
                            />
                          )}
                          
                          {/* Package Info */}
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" fontWeight="bold" mb={1}>
                              {packageId ? "Selected Package" : "Selected Test"}
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {formData.packageName}
                            </Typography>
                            <Typography variant="h6" fontWeight="bold" mt={1}>
                              ₹{formData.packagePrice} per patient
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  )}

                  {/* Date and Time Side by Side */}
                  <Box sx={{ display: "flex", gap: 2 }}>
                    {/* Date */}
                    <TextField
                      fullWidth
                      type="date"
                      name="date"
                      label="Appointment Date *"
                      value={formData.date}
                      onChange={handleChange}
                      error={!!errors.date}
                      helperText={errors.date && <span className="text-red-500 text-xs">{errors.date}</span>}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ 
                        min: today,
                        style: { cursor: 'pointer' }
                      }}
                      InputProps={{
                        startAdornment: (
                          <Box sx={{ mr: 1, display: "flex", alignItems: "center", cursor: 'pointer' }}>
                            <Calendar size={20} style={{ color: Theme.colors.primary }} />
                          </Box>
                        ),
                        style: { cursor: 'pointer' },
                        onClick: (e) => {
                          // Stop propagation to prevent double triggering
                          e.stopPropagation();
                        }
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          cursor: 'pointer',
                          "&:hover fieldset": { borderColor: Theme.colors.primary },
                          "&.Mui-focused fieldset": { borderColor: Theme.colors.primary },
                        },
                        "& .MuiInputBase-input": {
                          cursor: 'pointer'
                        },
                        "& .MuiFormControl-root": {
                          cursor: 'pointer'
                        }
                      }}
                      onClick={(e) => {
                        // Force the date picker to open when clicking anywhere in the field
                        const input = e.target.querySelector('input[type="date"]') || 
                                     e.target.closest('.MuiOutlinedInput-root')?.querySelector('input[type="date"]') ||
                                     document.querySelector('input[name="date"]');
                        
                        if (input) {
                          input.focus();
                          input.click();
                          // Try to show the date picker using multiple methods
                          if (input.showPicker) {
                            input.showPicker();
                          } else {
                            // Fallback for browsers that don't support showPicker
                            input.focus();
                            // Create a click event to trigger the date picker
                            const clickEvent = new MouseEvent('click', {
                              view: window,
                              bubbles: true,
                              cancelable: true
                            });
                            input.dispatchEvent(clickEvent);
                          }
                        }
                      }}
                    />

                    {/* Time */}
                    <FormControl fullWidth error={!!errors.time}>
                      <InputLabel id="time-label">Time *</InputLabel>
                      <Select
                        labelId="time-label"
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        label="Time *"
                        sx={{
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: errors.time ? "error.main" : Theme.colors.primary,
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: Theme.colors.primary },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: Theme.colors.primary },
                        }}
                      >
                        {timeSlots.map((slot) => (
                          <MenuItem key={slot} value={slot}>
                            {slot}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.time && (
                        <Typography variant="caption" className="text-red-500 text-xs" sx={{ mt: 0.5, ml: 1.75 }}>
                          {errors.time}
                        </Typography>
                      )}
                    </FormControl>
                  </Box>

                  {/* Patient Name - Single Patient Only */}
                  <TextField
                    fullWidth
                    name="patientName"
                    label="Patient Name *"
                    placeholder="Enter patient full name"
                    value={formData.patientName}
                    onChange={handleChange}
                    error={!!errors.patientName}
                    helperText={errors.patientName && <span className="text-red-500 text-xs">{errors.patientName}</span>}
                    InputProps={{
                      startAdornment: (
                        <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                          <User size={20} style={{ color: Theme.colors.primary }} />
                        </Box>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": { borderColor: Theme.colors.primary },
                        "&.Mui-focused fieldset": { borderColor: Theme.colors.primary },
                      },
                    }}
                  />
                  
                  {errors.package && (
                    <Alert severity="error" className="text-red-500 text-xs">{errors.package}</Alert>
                  )}

                  {/* Error Alert */}
                  {submitError && (
                    <Alert severity="error" className="text-red-500 text-xs">{submitError}</Alert>
                  )}

                  {/* Create Booking Button */}
                  <Button
                    type="button"
                    variant="contained"
                    size="large"
                    startIcon={<Send />}
                    onClick={handleCreateBooking}
                    sx={{
                      backgroundColor: Theme.colors.primary,
                      color: "white",
                      py: 1.5,
                      "&:hover": { backgroundColor: Theme.colors.primaryHover },
                    }}
                  >
                    Create Booking
                  </Button>
                </Box>
              </form>
            </Paper>
          </div>

          {/* Right Column - Bill Summary */}
          <div className="lg:col-span-1">
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4, 
                borderRadius: 3, 
                position: "sticky",
                top: 100,
                bgcolor: Theme.colors.background
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                <Receipt className="w-6 h-6" style={{ color: Theme.colors.primary }} />
                <Typography variant="h5" fontWeight="bold" color={Theme.colors.primary}>
                  Bill Summary
                </Typography>
              </Box>

              {formData.packageName && (
                <>
                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      {packageId ? "Package" : "Test"}
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {formData.packageName}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      Price per Patient
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color={Theme.colors.primary}>
                      ₹{formData.packagePrice}
                    </Typography>
                  </Box>

                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      Patient Name
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {formData.patientName || "Not entered"}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold">
                      Total Amount
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color={Theme.colors.primary}>
                      ₹{totalAmount}
                    </Typography>
                  </Box>

                </>
              )}

              {!formData.packageName && (
                <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                  No test selected - Basic consultation fee will apply
                </Typography>
              )}
              <Divider sx={{ my: 3 }} />
              <Box>
                <Typography variant="h6" fontWeight="bold" color={Theme.colors.primary} mb={0.5}>
                  Was This Test Information Helpful?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Please rate your experience
                </Typography>
                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => { setHelpfulAnswer("yes"); setHelpfulSubmitted(true); }}
                    sx={{
                      borderColor: "rgba(16,185,129,0.4)",
                      color: "rgb(16,185,129)",
                      "&:hover": { borderColor: "rgba(16,185,129,0.6)", bgcolor: "rgba(16,185,129,0.08)" }
                    }}
                  >
                    Yes Helpful
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => { setHelpfulAnswer("no"); setHelpfulSubmitted(true); }}
                    sx={{
                      borderColor: "rgba(239,68,68,0.4)",
                      color: "rgb(239,68,68)",
                      "&:hover": { borderColor: "rgba(239,68,68,0.6)", bgcolor: "rgba(239,68,68,0.08)" }
                    }}
                  >
                    Not Helpful
                  </Button>
                </Box>
                {helpfulSubmitted && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                    Thanks for your feedback.
                  </Typography>
                )}
              </Box>
            </Paper>
          </div>
        </div>

        {/* Bill Modal/Dialog */}
        {showBill && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1300,
              p: 2
            }}
            onClick={() => setShowBill(false)}
          >
            <Paper
              elevation={24}
              sx={{
                maxWidth: 600,
                width: "100%",
                p: 4,
                borderRadius: 3,
                maxHeight: "90vh",
                overflow: "auto"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h4" fontWeight="bold" color={Theme.colors.primary}>
                  Booking Bill
                </Typography>
                <Button
                  onClick={() => setShowBill(false)}
                  sx={{ minWidth: "auto", color: Theme.colors.primary }}
                >
                  <X size={24} />
                </Button>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  Hospital Lab
                </Typography>
                <Typography variant="body1" fontWeight="medium" mb={2}>
                  {formData.labAppointment || "Not selected"}
                </Typography>

                <Typography variant="body2" color="text.secondary" mb={1}>
                  Date & Time
                </Typography>
                <Typography variant="body1" fontWeight="medium" mb={2}>
                  {formData.date} at {formData.time}
                </Typography>

                <Typography variant="body2" color="text.secondary" mb={1}>
                  Test
                </Typography>
                <Typography variant="body1" fontWeight="medium" mb={2}>
                  {formData.packageName || "General consultation"}
                </Typography>

                <Typography variant="body2" color="text.secondary" mb={1}>
                  Patient Name
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {formData.patientName || "Not entered"}
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body1">Price per Patient:</Typography>
                  <Typography variant="body1" fontWeight="bold">₹{formData.packagePrice}</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6" fontWeight="bold">
                    Total Amount:
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color={Theme.colors.primary}>
                    ₹{totalAmount}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {modalStatus.message && (
                <Alert severity={modalStatus.type === "error" ? "error" : "success"} sx={{ mb: 2 }}>
                  {modalStatus.message}
                </Alert>
              )}

              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => setShowBill(false)}
                  sx={{
                    borderColor: Theme.colors.primary,
                    color: Theme.colors.primary,
                    "&:hover": { borderColor: Theme.colors.primaryHover, bgcolor: "rgba(42, 122, 142, 0.1)" }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleConfirmBooking}
                  startIcon={<CheckCircle2 />}
                  sx={{
                    backgroundColor: Theme.colors.primary,
                    "&:hover": { backgroundColor: Theme.colors.primaryHover }
                  }}
                >
                  Confirm & Pay
                </Button>
              </Box>
            </Paper>
          </Box>
        )}
      </main>

      <Footer />
    </div>
  );
}
