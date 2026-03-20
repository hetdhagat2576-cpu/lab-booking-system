import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import Header from "../../components/header";
import Footer from "../../components/footer";
import Loader from "../../components/loader";
import ImageConfig from "../../config/image-file";
import IconConfig from "../../components/icon/index.js";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaShieldAlt,
  FaAward
} from "react-icons/fa";
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
            desc: "Free and timely sample pickup by certified professionals."
          },
          {
            iconKey: "CheckCircle", 
            title: "Certified Labs",
            desc: "ISO & NABL certified laboratories for accurate results."
          },
          {
            iconKey: "Users",
            title: "Best Prices", 
            desc: "Compare labs and save up to 70% on test bookings."
          },
          {
            iconKey: "FileText",
            title: "Digital Reports",
            desc: "Get your test reports delivered digitally within 24-48 hours."
          }
        ]);
        setHowItWorksData([
          {
            step: 1,
            title: "Book Test",
            desc: "Select your test and book appointment online."
          },
          {
            step: 2,
            title: "Sample Collection",
            desc: "Our certified professional will collect sample from your home."
          },
          {
            step: 3,
            title: "Lab Testing",
            desc: "Sample is tested in our certified laboratory."
          },
          {
            step: 4,
            title: "Get Reports",
            desc: "Receive your accurate test reports digitally."
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
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20 sm:py-24 md:py-32 lg:py-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left text-white"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6"
              >
                <FaShieldAlt className="mr-2" size={16} />
                Trusted by 10,000+ Patients
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
              >
                Your Health,
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-400">
                  Our Priority
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg sm:text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed"
              >
                Book laboratory tests with confidence. 
                <br />
                Certified labs, instant reports.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <AnimatedButton
                  onClick={() => navigate("/register")}
                  className="px-8 py-4 bg-white text-blue-700 font-semibold rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  Book Now
                  <ArrowRight size={18} />
                </AnimatedButton>
                
                <AnimatedButton
                  onClick={() => navigate("/health-packages/all")}
                  className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-700 transition-all duration-300"
                >
                  View Packages
                </AnimatedButton>
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-2xl transform rotate-6"></div>
                <img
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
                  alt="Healthcare Professional"
                  className="relative rounded-2xl shadow-2xl w-full h-auto max-h-96 object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <AnimatedSection className="py-16 bg-gray-50" delay={0.2}>
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { number: "10,000+", label: "Happy Patients", icon: Users },
              { number: "500+", label: "Partner Labs", icon: Home },
              { number: "50+", label: "Cities Covered", icon: FaAward },
              { number: "24/7", label: "Support Available", icon: Clock }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="text-center bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                <motion.div
                  animate={floating}
                  className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  {React.createElement(stat.icon, { className: "text-blue-600", size: 24 })}
                </motion.div>
                <div className="text-3xl font-bold text-gray-800 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* WHY BOOK WITH US */}
      <AnimatedSection className="py-16 bg-white" delay={0.4}>
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose BookMyLab?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
          >
            {whyBookData.map((item, index) => (
              <AnimatedGridItem
                key={item._id || index}
                index={index}
                className="bg-gray-50 p-6 rounded-2xl hover:bg-blue-50 border border-gray-200 hover:border-blue-300 transition-all duration-300 group"
              >
                <motion.div 
                  animate={floating}
                  className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300"
                >
                  {item.iconKey && IconConfig[item.iconKey] ? (
                    React.createElement(IconConfig[item.iconKey], { size: 28 })
                  ) : (
                    <CheckCircle size={28} />
                  )}
                </motion.div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{item.desc || item.description}</p>
              </AnimatedGridItem>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* HOW IT WORKS */}
      <AnimatedSection className="py-16 bg-gradient-to-b from-blue-50 to-white" delay={0.6}>
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
          >
            {howItWorksData.map((item, index) => (
              <AnimatedGridItem
                key={item._id || index}
                index={index}
                className="text-center group"
              >
                <motion.div 
                  whileHover={{ scale: 1.1, y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="relative mb-6"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white mx-auto shadow-lg group-hover:shadow-2xl transition-all duration-300">
                    <span className="text-2xl font-bold">{item.step}</span>
                  </div>
                  {index < howItWorksData.length - 1 && (
                    <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-blue-300 to-transparent -translate-y-1/2"></div>
                  )}
                </motion.div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc || item.description}</p>
              </AnimatedGridItem>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* MAIN CONTENT SECTION - REMOVED */}

      {/* TESTIMONIALS */}
      <AnimatedSection className="py-16 bg-gray-50" delay={0.8}>
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What Our Patients Say
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
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
                    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col">
                      <div className="flex items-start gap-3 mb-4">
                        <motion.div
                          animate={floating}
                          className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0"
                        >
                          <MessageSquare className="text-white" size={16} />
                        </motion.div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 truncate">{feedback.userName || "Anonymous User"}</h4>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <motion.div
                                key={i}
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.5 + i * 0.1, type: "spring", stiffness: 200 }}
                              >
                                <Star 
                                  className={`w-4 h-4 flex-shrink-0 ${i < (feedback.bookingEaseRating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                />
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3 flex-grow text-sm sm:text-base">
                        "{feedback.comment || 'Great experience with platform!'}"
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
                        <span className="truncate">Overall Experience</span>
                        <span className="font-medium text-blue-600 flex-shrink-0">
                          {feedback.bookingEaseRating || 5}/5
                        </span>
                      </div>
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
                className="text-center py-16"
              >
                <motion.div 
                  animate={floating}
                  className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <MessageSquare className="text-gray-400" size={32} />
                </motion.div>
                <h3 className="text-2xl font-semibold text-gray-600 mb-3">
                  No Reviews Yet
                </h3>
                <p className="text-gray-500 max-w-md mx-auto text-lg">
                  Be the first to share your experience! Our valued customers' reviews will appear here once they are reviewed by our team.
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* CTA SECTION */}
      <AnimatedSection className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700" delay={1.0}>
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Take Control of Your Health?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join thousands of satisfied customers who trust BookMyLab for their diagnostic needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <AnimatedButton
                onClick={() => navigate("/register")}
                className="px-8 py-4 bg-white text-blue-700 font-semibold rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                Get Started Now
                <ArrowRight size={18} />
              </AnimatedButton>
              
              <AnimatedButton
                onClick={() => navigate("/contact")}
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-700 transition-all duration-300"
              >
                Contact Us
              </AnimatedButton>
            </div>
          </motion.div>
        </div>
      </AnimatedSection>

      <Footer/>
    </div>
  );
}
