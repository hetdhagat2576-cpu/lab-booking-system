import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header";
import Footer from "../../components/footer";
import CButton from "../../components/cButton";
import ImageConfig from "../../config/image File";
import Theme from "../../config/theam/index.js";
import { ABOUT_FEATURES, ABOUT_COMMITMENT_POINTS } from "../../config/staticData";
import { safeFetch } from "../../config/api";

export default function AboutIndex() {
  const navigate = useNavigate();
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch about page content from API
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await safeFetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/about`);
        
        if (response.ok) {
          const data = await response.json();
          setAboutData(data);
        } else {
          console.error('Failed to fetch about data from API');
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  // Default content fallback
  const defaultAboutData = {
    mainHeading: 'Why Our System is Smarter Care',
    sections: [
      { icon: 'bolt', title: 'All-in-One', description: 'Schedules and equipment in one place.' },
      { icon: 'shield', title: 'Secure', description: 'Data stays protected.' },
      { icon: 'cloud', title: 'Accessible', description: '24/7 cloud access.' },
      { icon: 'dollar', title: 'Affordable', description: 'Clear pricing.' }
    ]
  };

  const content = aboutData || defaultAboutData;

  // Ensure sections exist and is an array
  const sections = content.sections || [];

  if (loading) {
    return (
      <div className={Theme.layout.standardPage}>
        <Header />
        <main className="flex-grow bg-slate-50/50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={Theme.layout.standardPage}>
      {/* Header */}
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              About Lab Booking System
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Simplifying laboratory reservations for educational institutions and research facilities with modern technology.
            </p>
            {/* Divider using Primary Color */}
            <div className="w-24 h-1 bg-primary mx-auto mt-6 rounded-full" />
          </div>
        </section>

        {/* Mission Section - Using Secondary Color for Background */}
        <section className="bg-secondary/10 py-20 border-y border-secondary/30">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Our Mission
                </h2>
                <p className="text-gray-600 mb-4 leading-relaxed text-lg">
                  Our mission is to modernize the way laboratories are booked and managed. We eliminate manual processes, reduce scheduling conflicts, and bring transparency to lab usage.
                </p>
                <p className="text-gray-600 leading-relaxed text-lg">
                  By combining usability with powerful tools, we help students, faculty, and administrators focus on learning and innovation.
                </p>
              </div>

              <div className="bg-white shadow-sm rounded-2xl p-8 border border-secondary/50">
                <div className="space-y-6">
                  {ABOUT_FEATURES.map((item, index) => (
                    <div key={index} className="flex items-center gap-5">
                      {/* Icon Box using Primary Color */}
                      <div className="w-12 h-12 flex-shrink-0 bg-primary text-white rounded-xl flex items-center justify-center font-bold shadow-md">
                        ✓
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Service Promise Section */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative order-2 md:order-1">
                <img
                  src={ImageConfig.aboutImage1}
                  alt="Laboratory"
                  className="rounded-2xl shadow-xl w-full h-[400px] object-cover"
                  loading="lazy"
                />
              </div>

              <div className="space-y-6 order-1 md:order-2">
                <p className="text-primary font-bold uppercase tracking-wider text-sm">
                  Our Commitment
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                  Accuracy, transparency, and ease of use
                </h2>
                <ul className="space-y-4">
                  {ABOUT_COMMITMENT_POINTS.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      {/* Secondary Color background for bullets */}
                      <div className="w-6 h-6 bg-secondary/30 rounded-full flex items-center justify-center">
                         <div className="w-2 h-2 bg-primary rounded-full" />
                      </div>
                      <span className="text-gray-700 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="bg-secondary/10 py-20 border-y border-secondary/30">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-secondary/20">
              <div className="grid md:grid-cols-2">
                <div className="p-10 lg:p-16 flex flex-col justify-center">
                  <p className="text-primary uppercase tracking-widest text-xs font-bold mb-2">
                    Why Choose Us
                  </p>
                  <h2 className="text-3xl font-bold text-slate-800 mb-10">
                    {content.mainHeading}
                  </h2>

                  <div className="grid sm:grid-cols-2 gap-8">
                    {sections.map((section, i) => (
                      <div key={i} className="flex flex-col gap-2">
                        <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
                          <span className="text-primary text-lg">
                            {section.icon === 'bolt' && '⚡'}
                            {section.icon === 'shield' && '🛡️'}
                            {section.icon === 'cloud' && '☁️'}
                            {section.icon === 'dollar' && '💰'}
                            {section.icon !== 'bolt' && section.icon !== 'shield' && section.icon !== 'cloud' && section.icon !== 'dollar' && '⚡'}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-800 leading-tight">
                          {section.title}
                        </h4>
                        <p className="text-gray-500 text-xs">{section.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative min-h-[300px] md:min-h-full">
                  <img
                    src={ImageConfig.aboutImage2}
                    alt="Laboratory Background"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Overlay using Primary Color with low opacity */}
                  <div className="absolute inset-0 bg-primary/10" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-white py-20 text-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-gray-600 mb-8 text-lg">
                Start managing laboratory bookings efficiently with our platform.
              </p>
              <CButton
                variant="outline"
                size="lg"
                onClick={() => navigate("/")}
                className="px-10 py-4 border-primary text-primary hover:bg-primary hover:text-white transition-colors"
              >
                Go to Home
              </CButton>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
