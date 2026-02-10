import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Theme from "../../config/theam/index.js";
import IconConfig from "../../components/icon/index.js";
import CButton from "../../components/cButton";
import CInput from "../../components/cInput";
import Swal from "sweetalert2";
import { safeFetch } from "../../config/api";
import { CONTACT_OPTIONS, CONTACT_FAQ_ITEMS } from "../../config/staticData";
import { useAuth } from "../../context/authContext";

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
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      Swal.fire({
        title: 'Login Required',
        text: 'Please login to submit the Contact Us form.',
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
      navigate('/login-selection');
      return;
    }

    // Check if user is admin (admins are not allowed to submit contact forms)
    if (isAdmin) {
      Swal.fire({
        title: 'Access Denied',
        text: 'Admin users are not allowed to submit Contact Us forms.',
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
        text: 'Please login again to submit the Contact Us form.',
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
      navigate('/login-selection');
      return;
    }
      
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok && (data.success || data._id)) {
        Swal.fire({
          title: 'Success',
          text: 'Thank you! Your message has been sent.',
          icon: 'success',
          confirmButtonColor: Theme.colors.primary,
          confirmButtonText: 'OK',
          customClass: {
            popup: 'rounded-lg shadow-xl',
            title: 'text-xl font-semibold',
            content: 'text-gray-700',
            confirmButton: 'px-6 py-2 text-white font-medium rounded-lg hover:opacity-90 transition-opacity'
          },
          buttonsStyling: false,
          timer: 2000,
          timerProgressBar: true
        });
        // Clear form and refresh page to update state
        setFormData({
          name: user?.name || "",
          email: user?.email || "",
          phone: user?.phone || "",
          subject: "",
          message: ""
        });
        // Force a page refresh to update state
        window.location.reload();
      } else {
        Swal.fire({
          title: 'Error',
          text: data.message || "Failed to submit. Please try again.",
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
      }
    } catch {
      Swal.fire({
        title: 'Connection Error',
        text: 'Unable to connect to server',
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
    }
  };

  return (
    <div className={Theme.layout.standardPage}>
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-white py-16 text-center border-b border-secondary/30">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Contact Us</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions? We're here to help! Get in touch with our team.
          </p>
           <div className="w-24 h-1 bg-primary mx-auto mt-6 rounded-full" />
        </section>

        {/* Contact Info Card Grid */}
        <section className="bg-secondary/10 py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Get In Touch</h2>

            <div className="grid md:grid-cols-3 gap-8">
              {CONTACT_OPTIONS.map((item, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-8 text-center border border-secondary/30 hover:border-primary transition-all group flex flex-col h-full">
                  <div className="mb-4 p-4 bg-secondary/20 rounded-full group-hover:bg-primary/10 transition-colors flex items-center justify-center w-16 h-16 mx-auto">
                    {(() => {
                      const Icon = IconConfig[item.iconKey];
                      return <Icon className="w-8 h-8 text-primary" />;
                    })()}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{item.title}</h3>
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
                <CInput name="name" label="Full Name" value={formData.name} onChange={handleChange} required />
                <CInput name="email" type="email" label="Email Address" value={formData.email} onChange={handleChange} required />
              </div>
              <CInput name="phone" type="tel" label="Phone Number" value={formData.phone} onChange={handleChange} className="mb-6" />
              <CInput name="subject" label="Subject" value={formData.subject} onChange={handleChange} required className="mb-6" />
              <div className="mb-8">
                <label className="block font-semibold mb-2 text-gray-700">Message</label>
                <textarea
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="How can we help you?"
                  className="w-full border rounded-lg p-3 border-gray-300 focus:ring-2 focus:ring-secondary focus:border-primary outline-none transition-all"
                />
              </div>



              <div className="text-center">
                {/* Primary Color Button */}
                <CButton type="submit" size="lg" className="px-16 bg-primary hover:bg-primaryHover text-white">
                  Send Message
                </CButton>
              </div>
            </form>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-secondary/10 py-16 border-t border-secondary/30">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {CONTACT_FAQ_ITEMS.map((item, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md p-6 border-l-4 border-primary hover:shadow-lg transition-shadow">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 bg-secondary/20 p-2 rounded-lg">
                      {(() => {
                        const Icon = IconConfig[item.iconKey];
                        return <Icon className="w-6 h-6 text-primary" />;
                      })()}
                    </div>
                    <div>
                      <h3 className="font-bold mb-1 text-gray-800">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
