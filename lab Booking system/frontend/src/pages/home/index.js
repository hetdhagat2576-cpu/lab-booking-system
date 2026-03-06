import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import Header from "../../components/header";
import Footer from "../../components/footer";
import Loader from "../../components/loader";
import ImageConfig from "../../config/image File";
import IconConfig from "../../components/icon/index.js";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const style = document.createElement('style');
style.textContent = `
  @keyframes marquee {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-33.333%);
    }
  }
  
  .marquee-container {
    overflow: hidden;
    position: relative;
    width: 100%;
  }
  
  .marquee-track {
    display: flex;
    animation: marquee 30s linear infinite;
    width: fit-content;
  }
  
  .marquee-track:hover {
    animation-play-state: paused;
  }
  
  .testimonial-card {
    flex-shrink: 0;
    width: 320px;
    margin-right: 24px;
  }
  
  /* iPhone SE */
  @media (max-width: 320px) {
    .marquee-track {
      animation: marquee 20s linear infinite;
    }
    
    .testimonial-card {
      width: 260px;
      margin-right: 12px;
    }
  }
  
  /* iPhone 12 Pro */
  @media (min-width: 321px) and (max-width: 375px) {
    .marquee-track {
      animation: marquee 22s linear infinite;
    }
    
    .testimonial-card {
      width: 280px;
      margin-right: 14px;
    }
  }
  
  /* iPhone 14 Pro Max */
  @media (min-width: 376px) and (max-width: 414px) {
    .marquee-track {
      animation: marquee 24s linear infinite;
    }
    
    .testimonial-card {
      width: 290px;
      margin-right: 16px;
    }
  }
  
  /* iPad Mini */
  @media (min-width: 415px) and (max-width: 768px) {
    .marquee-track {
      animation: marquee 26s linear infinite;
    }
    
    .testimonial-card {
      width: 300px;
      margin-right: 18px;
    }
  }
  
  /* iPad Air/Pro */
  @media (min-width: 769px) and (max-width: 1024px) {
    .testimonial-card {
      width: 310px;
      margin-right: 20px;
    }
  }
  
  /* Larger screens */
  @media (min-width: 1025px) {
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
      try {
        const [whyBookResponse, howItWorksResponse, feedbacksResponse] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/content/home/why-book`),
          fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/content/home/how-it-works`),
          fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/feedback/reviewed`)
        ]);
        
        const whyBookResult = await whyBookResponse.json();
        const howItWorksResult = await howItWorksResponse.json();
        const feedbacksResult = await feedbacksResponse.json();
        
        console.log('Why Book Data:', whyBookResult.data);
        console.log('How It Works Data:', howItWorksResult.data);
        console.log('User Feedbacks:', feedbacksResult.data);
        
        setWhyBookData(whyBookResult.data || []);
        setHowItWorksData(howItWorksResult.data || []);
        
        // Set reviewed feedbacks - if no real data, show empty (no fake data)
        const reviewedFeedbacks = feedbacksResult.data || [];
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
            iconKey: "Search",
            stepNumber: 1,
            title: "Search & Select",
            desc: "Search for tests and labs, compare prices, and select what you need."
          },
          {
            iconKey: "CreditCard",
            stepNumber: 2,
            title: "Book & Pay",
            desc: "Book your test and pay securely online or choose cash on collection."
          },
          {
            iconKey: "Home",
            stepNumber: 3,
            title: "Sample Collection",
            desc: "Get your sample collected at home or visit the lab."
          },
          {
            iconKey: "FileText",
            stepNumber: 4,
            title: "Get Reports",
            desc: "Receive your test reports digitally within 24-48 hours."
          }
        ]);
        
        // In case of error, set empty feedbacks array
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
        <div className="relative w-full h-96 sm:h-[28rem] md:h-[32rem] lg:h-[40rem] xl:h-screen">
          <img
            src={ImageConfig.homeImage}
            alt="Home laboratory services"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = ImageConfig.homeImageFallback;
            }}
            />
          <div className="absolute inset-0 bg-black/30" /> 
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4 sm:px-6 md:px-8">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest bg-teal-600 w-fit px-3 sm:px-4 py-2 rounded">
              Laboratory Booking System
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-extrabold tracking-tight mt-4 leading-none">
              Book, Track & Test with
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-6xl font-light tracking-wide mt-3 text-white/95">
              Confidence
            </h2>
            <p className="mt-4 sm:mt-6 max-w-2xl md:max-w-3xl text-sm sm:text-base md:text-lg text-white/90">
              Seamless scheduling, trusted diagnostics, and fast digital reports.
            </p>
            
            <button 
              onClick={() => navigate("/register")}
              className="mt-6 sm:mt-8 px-6 sm:px-8 md:px-10 lg:px-12 py-3 sm:py-4 bg-white text-primary font-black rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-3 group border-2 border-white/20 backdrop-blur-sm text-sm sm:text-base"
            >
              <span className="hidden xs:inline sm:hidden">Book Home Service</span>
              <span className="xs:hidden sm:inline">Book Now</span>
              <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Trusted Laboratory Experts Section */}
      <section className="bg-white py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted Laboratory Experts
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto mb-6">
            Our platform connects patients with certified laboratories,
            ensuring transparency, accuracy, and reliable diagnostics
            for every test.
          </p>
          <div className="w-16 sm:w-24 h-1 bg-primary mx-auto rounded-full" />
        </div>
      </section>

      
      {/* WHY BOOK WITH US */}
      <section className="bg-gray-50 py-8 sm:py-12 md:py-16 border-y border-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-12">
            Why Book With Us?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 max-w-5xl mx-auto">
            {whyBookData.map((item, index) => (
              <div
                key={item._id || index}
                className="flex gap-4 sm:gap-6 bg-white p-4 sm:p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-gray-50 group"
              >
                <div className="p-3 sm:p-4 rounded-lg bg-secondary/20 group-hover:bg-secondary/40 transition-colors h-fit">
                  {item.iconKey && IconConfig[item.iconKey] ? (
                    React.createElement(IconConfig[item.iconKey], { className: "text-primary", size: 24 })
                  ) : (
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-800 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{item.desc || item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8 sm:mb-10">
            How It Works
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
            {howItWorksData.map((item, index) => (
              <div key={item._id || index} className="space-y-3 sm:space-y-5 group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  {item.iconKey && IconConfig[item.iconKey] ? (
                    React.createElement(IconConfig[item.iconKey], { size: 24 })
                  ) : (
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded" />
                  )}
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800">{item.title}</h3>
                <p className="text-sm sm:text-base text-gray-600">{item.desc || item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN CONTENT SECTION */}
      <main className="flex-grow">
        <section className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 md:gap-14 items-center">
            <div className="space-y-6 sm:space-y-8 text-center md:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                BookMyLab
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
                Book laboratory tests effortlessly with real-time availability,
                trusted labs, and instant access to reports.
              </p>
              <div className="space-y-3 sm:space-y-4">
                {[
                  "Quick & simple booking",
                  "Real-time slot availability",
                  "Access reports anytime",
                ].map((text, index) => (
                  <div key={index} className="flex items-center gap-3 justify-center md:justify-start">
                    <CheckCircle className="text-primary" size={20} />
                    <span className="text-base sm:text-lg text-gray-700 font-medium">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative w-full max-w-lg md:max-w-xl lg:max-w-2xl min-h-[320px] sm:min-h-[400px] md:min-h-[480px]">
              <div className="relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-4 sm:border-8 border-white">
                <img
                  src={ImageConfig.heroSideImage}
                  alt="Lab technician"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = ImageConfig.heroSideImageFallback;
                  }}
                  />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* WHAT OUR USERS SAY SECTION */}
        <section className="bg-gradient-to-br from-secondary/20 to-primary/10 py-8 sm:py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                What Our Users Say
              </h2>
              <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
                Real feedback from our valued customers about their experience with our laboratory booking platform.
              </p>
              <div className="w-16 sm:w-24 h-1 bg-primary mx-auto mt-4 sm:mt-6 rounded-full" />
            </div>
            
            <div className="feedback-section relative overflow-hidden">
              {userFeedbacks.length > 0 ? (
                <div className="marquee-track">
                  {/* Create 3 sets of cards for seamless infinite scroll */}
                  {[...Array(3)].flatMap((_, setIndex) => 
                    userFeedbacks.map((feedback, index) => (
                      <div 
                        key={`${feedback._id || index}-set-${setIndex}`} 
                        className="testimonial-card"
                      >
                        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col">
                          <div className="flex items-start gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                              <MessageSquare className="text-primary" size={16} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-semibold text-gray-800 truncate text-base">{feedback.userName || "Anonymous User"}</h4>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-4 h-4 flex-shrink-0 ${i < (feedback.bookingEaseRating || 0) ? 'text-amber-400 fill-current' : 'text-gray-300'}`} 
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3 flex-grow text-sm sm:text-base">
                            "{feedback.comment || 'Great experience with platform!'}"
                          </p>
                          
                          <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
                            <span className="truncate">Overall Experience</span>
                            <span className="font-medium text-primary flex-shrink-0">{feedback.bookingEaseRating || 5}/5</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="text-gray-400" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Reviews Yet</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Be the first to share your experience! Our valued customers' reviews will appear here once they are reviewed by our team.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

      <Footer/>
    </div>
  );
}
