import React, { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import Header from "../../components/header";
import Footer from "../../components/footer";
import ImageConfig from "../../config/image File";
import IconConfig from "../../components/icon/index.js";
import Theme from "../../config/theam/index.js";
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
  staggerContainer,
  staggerItem,
  floating,
  pulse
} from '../../config/animations';

export default function ServiceIndex() {
  const navigate = useNavigate();
  const { ArrowRightCircle, CheckCircle2, FlaskConical, CalendarCheck, Users2,
    BellRing, BarChart4, Globe, ShieldCheck, Clock, TrendingUp, Zap, Handshake
  } = IconConfig;

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  const defaultFeatures = [
    {
      icon: FlaskConical,
      title: 'Laboratory Booking',
      description: 'Reserve chemistry, physics, biology, and computer labs with real-time availability.',
    },
    {
      icon: CalendarCheck,
      title: 'Smart Scheduling',
      description: 'Avoid clashes with an intelligent calendar that respects classes, exams, and holidays.',
    },
    {
      icon: Users2,
      title: 'Role-Based Access',
      description: 'Separate views for students, faculty, and admins with the right level of control.',
    },
    {
      icon: BellRing,
      title: 'Notifications & Reminders',
      description: 'Email or in-app reminders so you never miss an important lab session.',
    },
    {
      icon: BarChart4,
      title: 'Usage Analytics',
      description: 'Understand lab usage patterns to plan resources and maintenance better.',
    },
    {
      icon: Globe,
      title: 'Anywhere Access',
      description: 'Responsive web app that works on mobile, tablet, and desktop.',
    },
  ];

  const benefits = [
    'Save time with instant lab reservations',
    'Reduce scheduling conflicts automatically',
    'Improve resource utilization',
    'Enhance campus productivity',
    'Streamline administrative workflows',
    'Provide 24/7 access to lab booking'
  ];

  const defaultHighlights = [
    {
      icon: Zap,
      title: 'Fast Booking',
      description: 'Book a lab in just a few clicks.',
    },
    {
      icon: ShieldCheck,
      title: 'Secure Platform',
      description: 'Protected data and controlled access.',
    },
    {
      icon: Clock,
      title: 'Clear History',
      description: 'Track past and upcoming reservations.',
    },
    {
      icon: Handshake,
      title: 'Collaboration Ready',
      description: 'Share booking details with teams.',
    },
  ];

  const getIconByKey = (key) => {
    const Icon = IconConfig[key];
    return Icon || CheckCircle2;
  };

  useEffect(() => {
    const fetchServiceContent = async () => {
      try {
        const response = await safeFetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/service-content`);
        if (response.ok) {
          const result = await response.json();
          const data = result.data || {};

          const features = (data.features || [])
            .filter(item => item.isActive !== false)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

          const highlights = (data.highlights || [])
            .filter(item => item.isActive !== false)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

          setContent({
            heroTitle: data.heroTitle || 'Our Services',
            heroDescription: data.heroDescription || 'Everything you need to manage laboratory bookings smoothly and professionally.',
            ecosystemTitle: data.ecosystemTitle || 'Smart Lab Ecosystem',
            ecosystemSubtitle: data.ecosystemSubtitle || 'Powering the next generation of researchers',
            efficiencyBadge: data.efficiencyBadge || 'EFFICIENCY',
            campusTitle: data.campusTitle || 'Built for busy campus schedules',
            campusDescription: data.campusDescription || "We've streamlined the logistics so faculty can focus on teaching and students can focus on experimenting.",
            ctaTitle: data.ctaTitle || 'Ready to optimize your labs?',
            ctaDescription: data.ctaDescription || 'Join 50+ institutions using our booking system.',
            ctaButtonText: data.ctaButtonText || 'Get Started Now',
            features,
            highlights
          });
        } else {
          setContent(null);
        }
      } catch (err) {
        setContent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceContent();
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  const heroTitle = content?.heroTitle || 'Our Services';
  const heroDescription = content?.heroDescription || 'Everything you need to manage laboratory bookings smoothly and professionally.';
  const ecosystemTitle = content?.ecosystemTitle || 'Smart Lab Ecosystem';
  const ecosystemSubtitle = content?.ecosystemSubtitle || 'Powering the next generation of researchers';
  const efficiencyBadge = content?.efficiencyBadge || 'EFFICIENCY';
  const campusTitle = content?.campusTitle || 'Built for busy campus schedules';
  const campusDescription = content?.campusDescription || "We've streamlined the logistics so faculty can focus on teaching and students can focus on experimenting.";
  const ctaTitle = content?.ctaTitle || 'Ready to optimize your labs?';
  const ctaDescription = content?.ctaDescription || 'Join 50+ institutions using our booking system.';
  const ctaButtonText = content?.ctaButtonText || 'Get Started Now';
  const features = (content?.features?.length && content.features.length > 0) 
    ? content.features 
    : defaultFeatures.map(f => ({ iconKey: null, title: f.title, description: f.description, _staticIcon: f.icon }));
  const highlights = (content?.highlights?.length && content.highlights.length > 0) 
    ? content.highlights 
    : defaultHighlights.map(h => ({ iconKey: null, title: h.title, description: h.description, _staticIcon: h.icon }));

  return (
    <div className="w-full">
      <Header />

      {/* Hero Image Section */}
      <div className="w-full relative h-96 bg-slate900 overflow-hidden">
        <img 
          src={ImageConfig.serviceImage}
          alt="Laboratory Services" 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = ImageConfig.serviceImageFallback;
          }}
        />
        <motion.div 
          className="absolute inset-0 bg-black/40 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <motion.div 
            className="text-center text-white px-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          >
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
            >
              Laboratory Booking Services
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
            >
              Everything you need to manage laboratory bookings smoothly and professionally
            </motion.p>
          </motion.div>
        </motion.div>
      </div>

      {/* Our Services Section */}
      <AnimatedSection className="w-full flex flex-col items-center justify-center py-16 bg-gradient-to-b from-secondary/20 to-white" delay={0.2}>
        <motion.h1 
          className="text-4xl font-bold text-gray-800"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {heroTitle}
        </motion.h1>
        <motion.p 
          className="text-lg text-gray-600 mt-4 text-center max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          {heroDescription}
        </motion.p>
        {/* Divider using Primary Color */}
        <motion.div 
          className="w-24 h-1 bg-primary mx-auto mt-6 rounded-full" 
          initial={{ width: 0 }}
          whileInView={{ width: "6rem" }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        />
      </AnimatedSection>

      
      {/* Comprehensive Features Section */}
      <div className="w-full py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Comprehensive Features</h2>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
          >
            {features.map((feature, index) => (
              <AnimatedCard key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow" delay={index * 0.1}>
                <motion.div 
                  className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {(feature.iconKey
                    ? React.createElement(getIconByKey(feature.iconKey), { className: "text-primary", size: 24 })
                    : React.createElement(feature._staticIcon || CheckCircle2, { className: "text-primary", size: 24 })
                  )}
                </motion.div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </AnimatedCard>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Built for busy campus schedules Section */}
      <AnimatedSection className="w-full py-20 bg-primary text-white" delay={0.3}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div className="mb-4">
                <motion.span 
                  className="bg-secondary/30 px-3 py-1 rounded-full text-sm font-semibold inline-block"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                >
                  {efficiencyBadge}
                </motion.span>
              </motion.div>
              <motion.h2 
                className="text-4xl font-bold mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              >
                {campusTitle}
              </motion.h2>
              <motion.p 
                className="text-lg mb-8 text-secondary/90"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              >
                {campusDescription}
              </motion.p>
              
              <motion.div 
                className="space-y-3 mb-8"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.3 }}
              >
                {benefits.slice(0, 3).map((benefit, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center gap-3"
                    variants={staggerItem}
                  >
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      <CheckCircle2 className="text-yellow-400" size={20} />
                    </motion.div>
                    <span className="font-medium">{benefit}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div 
              className="bg-white rounded-xl p-8 text-gray-800"
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              whileHover={{ y: -10 }}
            >
              <motion.h3 
                className="text-2xl font-bold mb-6 text-primary"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              >
                System Highlights
              </motion.h3>
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.2 }}
              >
                {highlights.map((highlight, index) => (
                  <motion.div 
                    key={index} 
                    className="space-y-2"
                    variants={staggerItem}
                    whileHover={{ scale: 1.05, x: 5 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <motion.div 
                      className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      {(highlight.iconKey
                        ? React.createElement(getIconByKey(highlight.iconKey), { className: "text-primary", size: 20 })
                        : React.createElement(highlight._staticIcon || ShieldCheck, { className: "text-primary", size: 20 })
                      )}
                    </motion.div>
                    <h4 className="font-semibold text-gray-800">{highlight.title}</h4>
                    <p className="text-sm text-gray-600">{highlight.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* Ready to optimize your labs? Section */}
      <AnimatedSection className="w-full py-20 bg-white" delay={0.4}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div 
            className="bg-gradient-to-r from-primary to-primaryHover rounded-3xl p-12 shadow-xl"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            whileHover={{ y: -5 }}
          >
            <motion.h2 
              className="text-3xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              {ctaTitle}
            </motion.h2>
            <motion.p 
              className="text-lg text-secondary/90 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            >
              {ctaDescription}
            </motion.p>
            <AnimatedButton
              className="bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
              onClick={() => navigate("/register")}
            >
              {ctaButtonText}
              <motion.div
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <ArrowRightCircle size={20} />
              </motion.div>
            </AnimatedButton>
          </motion.div>
        </div>
      </AnimatedSection>

      <Footer />
    </div>
  );
}
