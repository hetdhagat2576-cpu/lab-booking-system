import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import Header from "../../components/header";
import Footer from "../../components/footer";
import CButton from "../../components/cButton";
import ImageConfig from "../../config/image File";
import Theme from "../../config/theam/index.js";
import { ABOUT_FEATURES, ABOUT_COMMITMENT_POINTS } from "../../config/staticData";
import { safeFetch } from "../../config/api";
import {
  heroTitle,
  heroSubtitle,
  heroDescription,
  heroButton,
  sectionReveal,
  textReveal,
  AnimatedSection,
  AnimatedCard,
  AnimatedButton,
  AnimatedGridItem,
  staggerContainer,
  staggerItem,
  floating,
  pulse
} from '../../config/animations';

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
        {/* Hero Section with Image */}
        <AnimatedSection className="bg-white py-20" delay={0.2}>
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <motion.h1 
                variants={heroTitle}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4"
              >
                About Lab Booking System
              </motion.h1>
              <motion.p 
                variants={heroDescription}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="text-lg text-gray-600 max-w-3xl mx-auto"
              >
                Simplifying laboratory reservations for educational institutions and research facilities with modern technology.
              </motion.p>
              {/* Divider using Primary Color */}
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "6rem" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                className="h-1 bg-[#2a7a8e] mx-auto mt-6 rounded-full"
              />
            </motion.div>
          </div>
        </AnimatedSection>

        {/* Mission Section */}
        <AnimatedSection className="bg-gradient-to-br from-[#e0f2f7] to-[#f0f8fa] py-16" delay={0.3}>
          <div className="container mx-auto px-4">
            <motion.div 
              className="grid md:grid-cols-2 gap-12 items-start max-w-6xl mx-auto"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              >
                <motion.h2 
                  className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4"
                  initial={{ opacity: 0, y: -30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                >
                  Our Mission
                </motion.h2>
                <motion.p 
                  className="text-gray-700 leading-relaxed text-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                >
                  Our mission is to modernize the way laboratories are booked and managed. We eliminate manual processes, reduce scheduling conflicts, and bring transparency to lab usage.
                </motion.p>
                <motion.p 
                  className="text-gray-700 leading-relaxed text-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                >
                  By combining usability with powerful tools, we help students, faculty, and administrators focus on learning and innovation.
                </motion.p>
              </motion.div>

              <motion.div 
                className="bg-white shadow-lg rounded-xl p-8 border border-gray-100"
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                whileHover={{ y: -5 }}
              >
                <motion.div 
                  className="space-y-6"
                  variants={staggerContainer}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, amount: 0.3 }}
                >
                  {ABOUT_FEATURES.map((item, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-center gap-5"
                      variants={staggerItem}
                      whileHover={{ scale: 1.02, x: 5 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      {/* Icon Box */}
                      <motion.div 
                        className="w-12 h-12 flex-shrink-0 bg-[#2a7a8e] text-white rounded-lg flex items-center justify-center font-bold shadow-sm"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        ✓
                      </motion.div>
                      <div>
                        <h3 className="font-bold text-gray-800">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </AnimatedSection>

        {/* Service Promise Section */}
        <AnimatedSection className="bg-white py-20" delay={0.4}>
          <div className="container mx-auto px-4">
            <motion.div 
              className="grid md:grid-cols-2 gap-12 items-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div 
                className="relative order-2 md:order-1"
                initial={{ opacity: 0, x: -50, scale: 0.9 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={ImageConfig.aboutImage1}
                  alt="Laboratory"
                  className="rounded-2xl shadow-xl w-full h-[400px] object-cover"
                  loading="lazy"
                />
              </motion.div>

              <motion.div 
                className="space-y-6 order-1 md:order-2"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              >
                <motion.p 
                  className="text-primary font-bold uppercase tracking-wider text-sm"
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                >
                  Our Commitment
                </motion.p>
                <motion.h2 
                  className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight"
                  initial={{ opacity: 0, y: -30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                >
                  Accuracy, transparency, and ease of use
                </motion.h2>
                <motion.ul 
                  className="space-y-4"
                  variants={staggerContainer}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, amount: 0.3 }}
                >
                  {ABOUT_COMMITMENT_POINTS.map((item, idx) => (
                    <motion.li 
                      key={idx} 
                      className="flex items-center gap-3"
                      variants={staggerItem}
                      whileHover={{ scale: 1.05, x: 5 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      {/* Secondary Color background for bullets */}
                      <motion.div 
                        className="w-6 h-6 bg-secondary/30 rounded-full flex items-center justify-center"
                        whileHover={{ scale: 1.2, rotate: 180 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                         <div className="w-2 h-2 bg-primary rounded-full" />
                      </motion.div>
                      <span className="text-gray-700 font-medium">{item}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            </motion.div>
          </div>
        </AnimatedSection>

        {/* Why Choose Us Section */}
        <AnimatedSection className="bg-secondary/10 py-20 border-y border-secondary/30" delay={0.5}>
          <div className="container mx-auto px-4">
            <motion.div 
              className="bg-white rounded-3xl shadow-xl overflow-hidden border border-secondary/20"
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              whileHover={{ y: -5 }}
            >
              <div className="grid md:grid-cols-2">
                <motion.div 
                  className="p-10 lg:p-16 flex flex-col justify-center"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                >
                  <motion.p 
                    className="text-primary uppercase tracking-widest text-xs font-bold mb-2"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                  >
                    Why Choose Us
                  </motion.p>
                  <motion.h2 
                    className="text-3xl font-bold text-slate-800 mb-10"
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                  >
                    {content.mainHeading}
                  </motion.h2>

                  <motion.div 
                    className="grid sm:grid-cols-2 gap-8"
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.3 }}
                  >
                    {sections.map((section, i) => (
                      <motion.div 
                        key={i} 
                        className="flex flex-col gap-2"
                        variants={staggerItem}
                        whileHover={{ scale: 1.05, y: -5 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        <motion.div 
                          className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                          <span className="text-primary text-lg">
                            {section.icon === 'bolt' && '⚡'}
                            {section.icon === 'shield' && '🛡️'}
                            {section.icon === 'cloud' && '☁️'}
                            {section.icon === 'dollar' && '💰'}
                            {section.icon !== 'bolt' && section.icon !== 'shield' && section.icon !== 'cloud' && section.icon !== 'dollar' && '⚡'}
                          </span>
                        </motion.div>
                        <h4 className="font-bold text-slate-800 leading-tight">
                          {section.title}
                        </h4>
                        <p className="text-gray-500 text-xs">{section.description}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>

                <motion.div 
                  className="relative min-h-[300px] md:min-h-full"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                >
                  <img
                    src={ImageConfig.aboutImage2}
                    alt="Laboratory Background"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Overlay using Primary Color with low opacity */}
                  <div className="absolute inset-0 bg-primary/10" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </AnimatedSection>

        {/* CTA Section */}
        <AnimatedSection className="bg-white py-20 text-center" delay={0.6}>
          <div className="container mx-auto px-4">
            <motion.div 
              className="max-w-2xl mx-auto text-center"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.h2 
                className="text-3xl font-bold mb-4"
                initial={{ opacity: 0, y: -30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              >
                Ready to Get Started?
              </motion.h2>
              <motion.p 
                className="text-gray-600 mb-8 text-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              >
                Start managing laboratory bookings efficiently with our platform.
              </motion.p>
              <motion.div 
                className="flex justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              >
                <AnimatedButton
                  className="px-6 py-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors"
                  onClick={() => navigate("/")}
                >
                  Go to Home
                </AnimatedButton>
              </motion.div>
            </motion.div>
          </div>
        </AnimatedSection>
      </main>

      <Footer />
    </div>
  );
}
