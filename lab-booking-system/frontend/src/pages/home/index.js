import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import Header from "../../components/header";
import Footer from "../../components/footer";
import Loader from "../../components/loader";
import ImageConfig from "../../config/image-file";
import IconConfig from "../../components/icon/index.js";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
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
import { createApiUrl } from "../../config/api";

const style = document.createElement('style');
style.textContent = `
  @keyframes marquee {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }
  
  .marquee-container {
    overflow: hidden;
    position: relative;
    width: 100%;
    mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
    -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
  }
  
  .marquee-track {
    display: flex;
    animation: marquee 20s linear infinite;
    width: max-content;
  }
  
  .marquee-track:hover {
    animation-play-state: paused;
  }
  
  .testimonial-card {
    flex-shrink: 0;
    width: 320px;
    margin-right: 24px;
    transition: transform 0.3s ease, box-shadow 0.3s ease, filter 0.3s ease;
  }
  
  .testimonial-card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 25px 30px -5px rgba(0, 0, 0, 0.15), 0 15px 15px -5px rgba(0, 0, 0, 0.08);
    filter: brightness(1.05);
  }
  
  /* iPhone SE */
  @media (max-width: 320px) {
    .marquee-track {
      animation: marquee 10s linear infinite;
    }
    
    .testimonial-card {
      width: 260px;
      margin-right: 12px;
    }
  }
  
  /* iPhone 12 Pro */
  @media (min-width: 321px) and (max-width: 375px) {
    .marquee-track {
      animation: marquee 11s linear infinite;
    }
    
    .testimonial-card {
      width: 280px;
      margin-right: 14px;
    }
  }
  
  /* iPhone 14 Pro Max */
  @media (min-width: 376px) and (max-width: 414px) {
    .marquee-track {
      animation: marquee 11.5s linear infinite;
    }
    
    .testimonial-card {
      width: 290px;
      margin-right: 16px;
    }
  }
  
  /* iPad Mini */
  @media (min-width: 415px) and (max-width: 768px) {
    .marquee-track {
      animation: marquee 11.8s linear infinite;
    }
    
    .testimonial-card {
      width: 300px;
      margin-right: 18px;
    }
  }
  
  /* iPad Air/Pro */
  @media (min-width: 769px) and (max-width: 1024px) {
    .marquee-track {
      animation: marquee 11.9s linear infinite;
    }
    
    .testimonial-card {
      width: 310px;
      margin-right: 20px;
    }
  }
  
  /* Larger screens */
  @media (min-width: 1025px) {
    .marquee-track {
      animation: marquee 12s linear infinite;
    }
    
    .testimonial-card {
      width: 320px;
      margin-right: 24px;
    }
  }
`;
document.head.appendChild(style);

export default function HomeIndex() {
  const navigate = useNavigate(); 
  const { CheckCircle, ArrowRight, Home, Users, FileText, Clock, MessageSquare, Star } = IconConfig;

  const [whyBookData, setWhyBookData] = useState([]);
  const [howItWorksData, setHowItWorksData] = useState([]);
  const [userFeedbacks, setUserFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch home content from API
  useEffect(() => {
    const fetchHomeContent = async () => {
      let reviewedFeedbacks = [];
      try {
        const [whyBookResponse, howItWorksResponse, feedbacksResponse] = await Promise.all([
          fetch(createApiUrl('/api/content/home/why-book')),
          fetch(createApiUrl('/api/content/home/how-it-works')),
          fetch(createApiUrl('/api/feedback/reviewed'))
        ]);
        
        const whyBookResult = await whyBookResponse.json();
        const howItWorksResult = await howItWorksResponse.json();
        const feedbacksResult = await feedbacksResponse.json();
        
                
        setWhyBookData(whyBookResult.data || []);
        setHowItWorksData(howItWorksResult.data || []);
        
        // Set reviewed feedbacks - if no real data, show empty (no fake data)
        reviewedFeedbacks = feedbacksResult.data || [];
        setUserFeedbacks(reviewedFeedbacks);
        
        console.log('Reviewed Feedbacks from API:', reviewedFeedbacks);
      } catch (error) {
        console.error('Error fetching home content:', error);
        // Fallback to default data if API fails
        setWhyBookData([
          {
            iconKey: "Home",
            title: "Home Sample Collection",
            desc: "Free and timely sample pickup by certified professionals at your doorstep."
          },
          {
            iconKey: "CheckCircle", 
            title: "Certified Labs",
            desc: "ISO & NABL certified laboratories ensuring accurate and reliable test results."
          },
          {
            iconKey: "Users",
            title: "Best Prices", 
            desc: "Compare prices from multiple labs and save up to 70% on your test bookings."
          },
          {
            iconKey: "FileText",
            title: "Digital Reports",
            desc: "Receive your test reports digitally within 24-48 hours with secure access."
          }
        ]);
        setHowItWorksData([
          {
            iconKey: "Search",
            title: "Search & Select",
            desc: "Search for tests and labs, compare prices, and select what you need."
          },
          {
            iconKey: "CreditCard",
            title: "Book & Pay",
            desc: "Book your test and pay securely online or choose cash on collection."
          },
          {
            iconKey: "Home",
            title: "Sample Collection",
            desc: "Get your sample collected at home or visit the lab."
          },
          {
            iconKey: "FileText",
            title: "Get Reports",
            desc: "Receive your test reports digitally within 24-48 hours."
          }
        ]);
        
        setUserFeedbacks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeContent();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-gray-800 font-sans">
      {/* Show loader while loading */}
      {loading && <Loader />}
      
      {/* HEADER */}
      <div className="fixed top-0 w-full z-50">
        <Header hideAuthButtons={true} />
      </div>

      {/* HERO BANNER */}
      <section className="bg-white">
        <div className="relative w-full h-96 sm:h-[28rem] md:h-[32rem] lg:h-[40rem] xl:h-screen overflow-hidden">
          <motion.img
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src={ImageConfig.homeImage}
            alt={ImageConfig.homeImageDescription}
            title={ImageConfig.homeImageName}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = ImageConfig.homeImageFallback;
            }}
          />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute inset-0 bg-black/30" 
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4 sm:px-6 md:px-8">
            {/* Image Name Overlay */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-black shadow-md"
            >
              🏥 {ImageConfig.homeImageName || "Medical Laboratory"}
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xs sm:text-sm font-semibold uppercase tracking-widest bg-teal-600 w-fit px-3 sm:px-4 py-2 rounded"
            >
              Laboratory Booking System
            </motion.p>
            <motion.h1 
              variants={heroTitle}
              initial="initial"
              animate="animate"
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-extrabold tracking-tight mt-4 leading-none"
            >
              Book, Track & Test with
            </motion.h1>
            <motion.h2 
              variants={heroSubtitle}
              initial="initial"
              animate="animate"
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-6xl font-light tracking-wide mt-3 text-white/95"
            >
              Confidence
            </motion.h2>
            <motion.p 
              variants={heroDescription}
              initial="initial"
              animate="animate"
              className="mt-4 sm:mt-6 max-w-2xl md:max-w-3xl text-sm sm:text-base md:text-lg text-white/90"
            >
              Seamless scheduling, trusted diagnostics, and fast digital reports.
            </motion.p>
            
            <AnimatedButton
              onClick={() => navigate("/register")}
              className="mt-6 sm:mt-8 px-6 sm:px-8 md:px-10 lg:px-12 py-3 sm:py-4 bg-white text-primary font-black rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-3 group border-2 border-white/20 backdrop-blur-sm text-sm sm:text-base"
            >
              <span className="hidden xs:inline sm:hidden">Book Home Service</span>
              <span className="xs:hidden sm:inline">Book Now</span>
              <motion.div
                whileHover={{ x: 8 }}
                transition={{ duration: 0.3 }}
              >
                <ArrowRight size={16} />
              </motion.div>
            </AnimatedButton>
          </div>
        </div>
      </section>

      {/* Trusted Laboratory Experts Section */}
      <AnimatedSection className="bg-white py-12 sm:py-16 md:py-20 border-b-4 border-gray-300">
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-6"
          >
            Trusted Laboratory Experts
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8"
          >
            Our platform connects patients with certified laboratories,
            ensuring transparency, accuracy, and reliable diagnostics
            for every test.
          </motion.p>
          {/* Colored horizontal line using primary theme color */}
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "6rem" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="h-1 bg-primary mx-auto rounded-full"
          />
        </div>
      </AnimatedSection>

      
      {/* WHY BOOK WITH US */}
      <AnimatedSection className="bg-gray-50 py-12 sm:py-16 md:py-20 border-y-2 border-gray-200" delay={0.2}>
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-8 sm:mb-12">
            <motion.h2 
              variants={textReveal}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4"
              style={{ color: '#1e293b' }}
            >
              Why Book With Us?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            >
            </motion.p>
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: "4rem" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="h-1 mx-auto rounded-full mt-4"
              style={{ backgroundColor: '#2a7a8e' }}
            />
          </motion.div>
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto"
          >
            {whyBookData.map((item, index) => (
              <AnimatedGridItem
                key={item._id || index}
                index={index}
                className="flex gap-3 sm:gap-6 bg-white p-4 sm:p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group"
              >
                <motion.div 
                  animate={floating}
                  className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-300 h-fit"
                >
                  {item.iconKey && IconConfig[item.iconKey] ? (
                    React.createElement(IconConfig[item.iconKey], { className: "text-primary", size: 28 })
                  ) : (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-lg" />
                  )}
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 text-gray-800 group-hover:text-primary transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{item.desc || item.description}</p>
                </div>
              </AnimatedGridItem>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* HOW IT WORKS */}
      <AnimatedSection className="bg-gradient-to-b from-white to-gray-50 py-12 sm:py-16 md:py-20" delay={0.4}>
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            variants={textReveal}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6"
            style={{ color: '#1e293b' }}
          >
            How It Works
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "4rem" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="h-1 mx-auto rounded-full mb-8 sm:mb-12"
            style={{ backgroundColor: '#2a7a8e' }}
          />
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto"
          >
            {howItWorksData.map((item, index) => (
              <AnimatedGridItem
                key={item._id || index}
                index={index}
                className="space-y-4 sm:space-y-6 group"
              >
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                  className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-2xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300"
                >
                  {item.iconKey && IconConfig[item.iconKey] ? (
                    React.createElement(IconConfig[item.iconKey], { className: "text-white", size: 28 })
                  ) : (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-lg" />
                  )}
                </motion.div>
                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 text-center">{item.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed px-2">{item.desc || item.description}</p>
                </div>
              </AnimatedGridItem>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* MAIN CONTENT SECTION */}
      <main className="flex-grow">
        <AnimatedSection className="container mx-auto px-4 py-8 sm:py-12 md:py-16" delay={0.6}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 md:gap-14 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-6 sm:space-y-8 text-center md:text-left"
            >
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              >
                BookMyLab
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed"
              >
                Book laboratory tests effortlessly with real-time availability,
                trusted labs, and instant access to reports.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-3 sm:space-y-4"
              >
                {[
                  "Quick & simple booking",
                  "Real-time slot availability",
                  "Access reports anytime",
                ].map((text, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className="flex items-center gap-3 justify-center md:justify-start"
                  >
                    <motion.div
                      animate={pulse}
                      className="flex-shrink-0"
                    >
                      <CheckCircle className="text-primary" size={20} />
                    </motion.div>
                    <span className="text-base sm:text-lg text-gray-700 font-medium">{text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50, scale: 0.8 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              className="relative w-full max-w-lg md:max-w-xl lg:max-w-2xl min-h-[320px] sm:min-h-[400px] md:min-h-[480px]"
            >
              <div className="relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-4 sm:border-8 border-white">
                {/* Image Name Badge */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-black shadow-md"
                >
                  🔬 {ImageConfig.heroSideImageName}
                </motion.div>
                
                <motion.img
                  initial={{ scale: 1.1 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  src={ImageConfig.heroSideImage}
                  alt={ImageConfig.heroSideImageDescription}
                  title={ImageConfig.heroSideImageName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = ImageConfig.heroSideImageFallback;
                  }}
                />
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" 
                />
              </div>
            </motion.div>
          </div>
        </AnimatedSection>
      </main>

      {/* WHAT OUR USERS SAY SECTION */}
        <AnimatedSection className="bg-gradient-to-br from-[#98d2e0]/20 to-[#2a7a8e]/10 py-8 sm:py-12 md:py-16" delay={0.8}>
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8 sm:mb-12"
            >
              <h1 
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4"
              >
                What Our Users Say
              </h1>
              <p 
                className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto"
              >
                Real feedback from our valued customers about their experience with our laboratory booking platform.
              </p>
              <div 
                className="h-1 bg-[#2a7a8e] mx-auto mt-4 sm:mt-6 rounded-full w-16"
              />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="feedback-section marquee-container"
            >
              {userFeedbacks.length > 0 ? (
                <div className="marquee-track">
                  {/* Create 2 sets of cards for seamless infinite scroll */}
                  {[...userFeedbacks, ...userFeedbacks].map((feedback, index) => (
                    <motion.div 
                      key={`${feedback._id || index}-duplicate-${index >= userFeedbacks.length ? '2' : '1'}`} 
                      className="testimonial-card"
                      whileHover={{ 
                        y: -12,
                        scale: 1.03,
                        boxShadow: "0 30px 40px -10px rgba(0, 0, 0, 0.2), 0 20px 20px -10px rgba(0, 0, 0, 0.1)"
                      }}
                    >
                        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col">
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-start gap-3 mb-4"
                          >
                            <motion.div 
                              animate={floating}
                              className="w-10 h-10 bg-gradient-to-br from-[#2a7a8e]/20 to-[#98d2e0]/20 rounded-full flex items-center justify-center flex-shrink-0"
                            >
                              <MessageSquare className="text-[#2a7a8e]" size={16} />
                            </motion.div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-semibold text-gray-800 truncate text-base">{feedback.userName || "Anonymous User"}</h4>
                              <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="flex items-center gap-1"
                              >
                                {[...Array(5)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ delay: 0.5 + i * 0.1, type: "spring", stiffness: 200 }}
                                  >
                                    <Star 
                                      className={`w-4 h-4 flex-shrink-0 ${i < (feedback.bookingEaseRating || 0) ? 'text-amber-400 fill-current' : 'text-gray-300'}`} 
                                    />
                                  </motion.div>
                                ))}
                              </motion.div>
                            </div>
                          </motion.div>
                          
                          <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-gray-600 leading-relaxed mb-4 line-clamp-3 flex-grow text-sm sm:text-base"
                          >
                            "{feedback.comment || 'Great experience with platform!'}"
                          </motion.p>
                          
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex items-center justify-between text-sm text-gray-500 mt-auto"
                          >
                            <span className="truncate">Overall Experience</span>
                            <motion.span 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.7, type: "spring" }}
                              className="font-medium text-[#2a7a8e] flex-shrink-0"
                            >
                              {feedback.bookingEaseRating || 5}/5
                            </motion.span>
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-center py-12"
                >
                  <motion.div 
                    animate={floating}
                    className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <MessageSquare className="text-gray-400" size={32} />
                  </motion.div>
                  <motion.h3 
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-xl font-semibold text-gray-600 mb-2"
                  >
                    No Reviews Yet
                  </motion.h3>
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-500 max-w-md mx-auto"
                  >
                    Be the first to share your experience! Our valued customers' reviews will appear here once they are reviewed by our team.
                  </motion.p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </AnimatedSection>

      <Footer/>
    </div>
  );
}
