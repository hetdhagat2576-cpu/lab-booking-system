import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Theme from "../../config/theam/index.js";
import IconConfig from "../../components/icon/index.js";
import CButton from "../../components/cButton";
import CInput from "../../components/cInput";
import { safeFetch } from "../../config/api";
import { CONTACT_OPTIONS, CONTACT_FAQ_ITEMS } from "../../config/staticData";
import { useAuth } from "../../context/authContext";
import Swal from 'sweetalert2';

export default function ContactUsIndex() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, isLabTechnician, loading, user } = useAuth();
  const { Mail, Phone, MapPin, HelpCircle, Calendar, ClipboardList, CreditCard } = IconConfig;
  
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [isAuthenticated, user]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Only allow digits for phone number field
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '');
      setFormData({ ...formData, [name]: digitsOnly });
      if (errors[name]) setErrors({ ...errors, [name]: "" });
    } else {
      setFormData({ ...formData, [name]: value });
      if (errors[name]) setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Phone number must be 10 digits";
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok && (data.success || data._id)) {
        Swal.fire({
          icon: 'success',
          title: 'Message Sent!',
          text: 'Your message has been sent successfully. We\'ll get back to you soon.',
          confirmButtonColor: Theme.colors.primary,
          timer: 3000,
          timerProgressBar: true
        });
        // Clear form
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: ""
        });
      } else {
        alert(data.message || "Failed to submit. Please try again.");
      }
    } catch {
      alert('Unable to connect to server');
    }
  };

  return (
    <div className={Theme.layout.standardPage}>
      <Header />

      <main className="flex-grow">

        {/* Contact Info Card Grid */}
        <section className="bg-secondary/10 py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Get In Touch</h2>

            <div className="grid md:grid-cols-3 gap-8">
              {CONTACT_OPTIONS.map((item, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-8 text-center border border-secondary/30 hover:border-primary transition-all group flex flex-col h-full">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">{item.title}</h3>
                  <p className="text-gray-600 mb-auto text-sm">{item.desc}</p>
                  <div className="mt-4">
                    {item.title === "Coming Soon" ? (
                      <span className="text-gray-500 font-semibold">{item.contact}</span>
                    ) : (
                      <a href={item.link} className="text-primary font-semibold hover:text-primaryHover transition-colors underline decoration-secondary underline-offset-4">
                        {item.contact}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 border border-secondary/30">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <CInput name="name" label="Full Name" value={formData.name} onChange={handleChange} error={errors.name} required />
                </div>
                <div>
                  <CInput name="email" type="email" label="Email Address" value={formData.email} onChange={handleChange} error={errors.email} required />
                </div>
              </div>
              <div className="mb-6">
                <CInput name="phone" type="tel" label="Phone Number" value={formData.phone} onChange={handleChange} error={errors.phone} required />
              </div>
              <div className="mb-6">
                <CInput name="subject" label="Subject" value={formData.subject} onChange={handleChange} error={errors.subject} required />
              </div>
              <div className="mb-8">
                <label className="block font-semibold mb-2 text-gray-700">Message *</label>
                <textarea
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="How can we help you?"
                  className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-secondary focus:border-primary outline-none transition-all ${
                    errors.message ? 'border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.message && (
                  <p className="mt-1 text-sm font-medium text-red-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.message}
                  </p>
                  )}
              </div>

              <div className="text-center flex justify-center">
                {/* Primary Color Button */}
                <CButton type="submit" size="lg" className="px-16 bg-success hover:bg-btnPrimaryHover text-white">
                  Send Message
                </CButton>
              </div>
            </form>
          </div>
        </section>

              </main>

      <Footer />
    </div>
  );
}
