import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header";
import Footer from "../../components/footer";
import CButton from "../../components/cButton";
import CInput from "../../components/cInput";
import Theme from "../../config/theam/index.js";
import IconConfig from "../../components/icon/index.js";
import Swal from "sweetalert2";
import { useAuth } from "../../context/authContext";

// Custom SweetAlert helper functions
const showErrorAlert = (title, message) => {
  Swal.fire({
    icon: 'error',
    title: title,
    text: message,
    confirmButtonColor: Theme.colors.primary,
    confirmButtonText: 'OK',
    background: Theme.colors.white,
    color: Theme.colors.textDark,
    customClass: {
      popup: 'rounded-lg shadow-xl',
      title: 'text-xl font-semibold',
      content: 'text-gray-700'
    }
  });
};

const showSuccessAlert = (title, message) => {
  Swal.fire({
    icon: 'success',
    title: title,
    text: message,
    confirmButtonColor: Theme.colors.primary,
    confirmButtonText: 'OK',
    background: Theme.colors.white,
    color: Theme.colors.textDark,
    customClass: {
      popup: 'rounded-lg shadow-xl',
      title: 'text-xl font-semibold',
      content: 'text-gray-700'
    }
  });
};

export default function FeedbackIndex() {
  const navigate = useNavigate();
  const { ChevronLeft, Send } = IconConfig;
  const { isAuthenticated, isAdmin, isLabTechnician, loading } = useAuth();

  const [form, setForm] = useState({
    bookingEaseRating: 5,
    confirmationExperience: "immediate",
    staffFriendlinessRating: 5,
    waitTimeSatisfactionRating: 5,
    averageWaitCategory: "<10",
    sampleExplanationClarity: "very",
    turnaroundSatisfactionRating: 5,
    portalEaseRating: 5,
    status: "positive",
    comment: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      Swal.fire({
        title: 'Login Required',
        text: 'Please login to submit feedback',
        icon: 'warning',
        confirmButtonColor: Theme.colors.primary,
        confirmButtonText: 'OK',
        customClass: {
          popup: 'rounded-lg shadow-xl',
          title: 'text-xl font-semibold',
          content: 'text-gray-700',
          confirmButton: 'px-6 py-2 text-white font-medium rounded-lg hover:opacity-90 transition-opacity'
        },
        buttonsStyling: false
      });
      navigate("/login-selection");
      return;
    }

    // Check if user is admin (admins are not allowed to submit feedback)
    if (isAdmin) {
      Swal.fire({
        title: 'Access Denied',
        text: 'Admin users are not allowed to submit feedback forms.',
        icon: 'error',
        confirmButtonColor: '#dc3741',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'rounded-lg shadow-xl',
          title: 'text-xl font-semibold',
          content: 'text-gray-700',
          confirmButton: 'px-6 py-2 text-white font-medium rounded-lg hover:opacity-90 transition-opacity'
        },
        buttonsStyling: false
      });
      return;
    }

    // Allow access for authenticated users and lab technicians
    const stored = localStorage.getItem("lab_user");
    const user = stored ? JSON.parse(stored) : null;
    const token = user?.token;
    
    if (!token) {
      Swal.fire({
        title: 'Authentication Error',
        text: 'Please login again to submit feedback',
        icon: 'warning',
        confirmButtonColor: Theme.colors.primary,
        confirmButtonText: 'OK',
        customClass: {
          popup: 'rounded-lg shadow-xl',
          title: 'text-xl font-semibold',
          content: 'text-gray-700',
          confirmButton: 'px-6 py-2 text-white font-medium rounded-lg hover:opacity-90 transition-opacity'
        },
        buttonsStyling: false
      });
      navigate("/login-selection");
      return;
    }
    setSubmitting(true);
    try {
      const result = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/feedback/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await result.json();

      if (result.ok && data.success) {
        showSuccessAlert("Thank you!", "Your feedback has been submitted successfully.");
        // Clear form and redirect to dashboard
        setForm({
          bookingEaseRating: 5,
          confirmationExperience: "immediate",
          staffFriendlinessRating: 5,
          waitTimeSatisfactionRating: 5,
          averageWaitCategory: "<10",
          sampleExplanationClarity: "very",
          turnaroundSatisfactionRating: 5,
          portalEaseRating: 5,
          status: "positive",
          comment: "",
        });
        navigate("/user-profile");
      } else if (result.cancelled) {
      } else {
        showErrorAlert("Error", data.message || "Error submitting feedback");
      }
    } catch (err) {
      showErrorAlert("Connection Error", "Unable to connect to server");
    } finally {
      setSubmitting(false);
    }
  };

  const RatingSelect = ({ label, name }) => (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <select
        className="w-full h-10 border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        value={form[name]}
        onChange={(e) => handleChange(name, Number(e.target.value))}
      >
        {[1,2,3,4,5].map((n) => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>
    </div>
  );

  const RadioGroup = ({ label, name, options }) => (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map(({ label: l, value }) => (
          <label key={value} className="inline-flex items-center gap-1 text-sm">
            <input
              type="radio"
              name={name}
              value={value}
              checked={form[name] === value}
              onChange={(e) => handleChange(name, e.target.value)}
              className="text-primary focus:ring-primary"
            />
            <span className="text-gray-700">{l}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className={Theme.layout.standardPage}>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <CButton
            variant="outline"
            onClick={() => navigate("/dashboard")}
            fullWidth={false}
            className="mb-4"
          >
            <ChevronLeft size={18} /> Back to Dashboard
          </CButton>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            Laboratory Service & Booking Feedback
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Thank you for choosing our hospital. Your feedback helps us provide better care.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6 border border-secondary/30">
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">Online Booking Experience</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RatingSelect label="Ease of using online appointment system (1-5)" name="bookingEaseRating" />
              <RadioGroup
                label="Was the appointment confirmation clear and on time?"
                name="confirmationExperience"
                options={[
                  { label: "Yes, immediately", value: "immediate" },
                  { label: "Yes, but it was delayed", value: "delayed" },
                  { label: "No, I didn't receive a confirmation", value: "none" },
                ]}
              />
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">Lab Visit & Clinical Care</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RatingSelect label="Friendliness and professionalism of the lab staff (1-5)" name="staffFriendlinessRating" />
              <RatingSelect label="Satisfaction with wait time (1-5)" name="waitTimeSatisfactionRating" />
              <RadioGroup
                label="Average wait time"
                name="averageWaitCategory"
                options={[
                  { label: "< 10 mins", value: "<10" },
                  { label: "10–20 mins", value: "10-20" },
                  { label: "20+ mins", value: "20+" },
                ]}
              />
              <RadioGroup
                label="Was the sample collection process explained clearly?"
                name="sampleExplanationClarity"
                options={[
                  { label: "Yes, very clearly", value: "very" },
                  { label: "Somewhat clearly", value: "somewhat" },
                  { label: "Not at all", value: "not" },
                ]}
              />
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">Results & Follow-up</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RatingSelect label="Turnaround time for test results (1-5)" name="turnaroundSatisfactionRating" />
              <RatingSelect label="Ease of accessing reports through online portal (1-5)" name="portalEaseRating" />
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">Overall & Comments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Feedback Status</label>
                <select
                  className="w-full h-10 border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={form.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                >
                  <option value="positive">Positive</option>
                  <option value="negative">Negative</option>
                </select>
              </div>
              <CInput
                label="One thing we could do to make your next visit better"
                placeholder="Write your suggestion"
                value={form.comment}
                onChange={(e) => handleChange("comment", e.target.value)}
                className="h-10 text-sm"
              />
            </div>
          </section>



          <div className="flex justify-center mt-6">
            <CButton type="submit" disabled={submitting}>
              <Send size={18} /> {submitting ? "Submitting..." : "Submit Feedback"}
            </CButton>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}

