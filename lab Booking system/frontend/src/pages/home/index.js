import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import Header from "../../components/header";
import Footer from "../../components/footer";
import ImageConfig from "../../config/image File";
import IconConfig from "../../components/icon/index.js";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const style = document.createElement('style');
style.textContent = `
  @keyframes scroll-x {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }
  
  .animate-scroll-x {
    animation: scroll-x 40s linear infinite;
  }
  
  .animate-scroll-x:hover {
    animation-play-state: paused;
  }

  .carousel-container {
    mask-image: linear-gradient(
      to right,
      transparent 0%,
      black 10%,
      black 90%,
      transparent 100%
    );
    -webkit-mask-image: linear-gradient(
      to right,
      transparent 0%,
      black 10%,
      black 90%,
      transparent 100%
    );
  }

  @media (max-width: 640px) {
    .animate-scroll-x {
      animation: scroll-x 30s linear infinite;
    }
  }
`;
document.head.appendChild(style);

export default function HomeIndex() {
  const navigate = useNavigate(); 
  const { CheckCircle, ArrowRight, Home, Users, FileText, Clock, MessageSquare, Star, ChevronLeft, ChevronRight, Pause, Play } = IconConfig;

  const [whyBookData, setWhyBookData] = useState([]);
  const [howItWorksData, setHowItWorksData] = useState([]);
  const [userFeedbacks, setUserFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

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
        setUserFeedbacks(feedbacksResult.data || []);
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
      } finally {
        setLoading(false);
      }
    };

    fetchHomeContent();
  }, []);

  // Manual navigation controls
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + userFeedbacks.length) % userFeedbacks.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % userFeedbacks.length);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate50 text-gray800 font-sans">
      
      {/* HEADER */}
      <div className="fixed top-0 w-full z-50">
        <Header hideAuthButtons={true} />
      </div>

      {/* HERO BANNER */}
      <section className="bg-white pt-[72px]">
        <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-screen">
          <img
            src={ImageConfig.homeImage}
            alt="Laboratory booking hero"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = ImageConfig.homeImageFallback;
            }}
            />
          <div className="absolute inset-0 bg-black/30" /> 
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4 sm:px-6 md:px-8">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest bg-teal-600 w-fit px-3 sm:px-4 py-2 rounded">
              Laboratory Booking Platform
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight mt-4">
              Book, Track & Test <br/> with Confidence
            </h1>
            <p className="mt-4 sm:mt-6 max-w-2xl md:max-w-3xl text-sm sm:text-base md:text-lg text-white/90">
              Seamless scheduling, trusted diagnostics, and fast digital reports.
            </p>
            
            {/* Hero Section Overlay Text */}
            <div className="mt-8 sm:mt-12 max-w-2xl md:max-w-4xl text-center">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 drop-shadow-lg">
                Trusted Laboratory Experts
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-white/95 leading-relaxed drop-shadow-md">
                Our platform connects patients with certified laboratories,
                ensuring transparency, accuracy, and reliable diagnostics
                for every test.
              </p>
              <div className="w-12 sm:w-16 h-1 bg-teal-400 mx-auto mt-4 rounded-full" />
            </div>
            
            <button 
              onClick={() => navigate("/register")}
              className="mt-6 sm:mt-8 px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-white text-primary font-black rounded-full shadow-[0_10px_20px_-10px_rgba(255,255,255,0.5)] hover:shadow-[0_15px_25px_-5px_rgba(255,255,255,0.6)] hover:-translate-y-1 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-3 group border-2 border-white/20 backdrop-blur-sm text-sm sm:text-base"
            >
              Get Started Now
              <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={16} />
            </button>
          </div>
        </div>
      </section>

      
      {/* WHY BOOK WITH US */}
      <section className="bg-gray50 py-8 sm:py-12 md:py-16 border-y border-gray100">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray900 mb-8 sm:mb-12">
            Why Book With Us?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 md:gap-10 max-w-5xl mx-auto">
            {whyBookData.map((item, index) => (
              <div
                key={item._id || index}
                className="flex gap-4 sm:gap-6 bg-white p-4 sm:p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-gray50 group">
                <div className="p-2 sm:p-3 rounded-lg bg-secondary/20 group-hover:bg-secondary/40 transition-colors h-fit">
                  {item.iconKey && IconConfig[item.iconKey] ? (
                    React.createElement(IconConfig[item.iconKey], { className: "text-primary", size: 24 })
                  ) : (
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray800 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray600 leading-relaxed">{item.desc || item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray900 mb-8 sm:mb-10">
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
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray800">{item.title}</h3>
                <p className="text-sm sm:text-base text-gray600">{item.desc || item.description}</p>
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
                    <span className="text-base sm:text-lg text-gray700 font-medium">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative w-full max-w-lg md:max-w-xl min-h-[280px] sm:min-h-[320px]">
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

      {/* WHAT OUR USERS SAY SECTION - HIDDEN */}
      {/* 
      {userFeedbacks.length > 0 && (
        <section className="bg-gradient-to-br from-secondary/20 to-primary/10 py-8 sm:py-12 md:py-16 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray900 mb-4">
                What Our Users Say
              </h2>
              <p className="text-gray600 text-base sm:text-lg max-w-2xl mx-auto">
                Real feedback from our valued customers about their experience with our laboratory booking platform.
              </p>
              <div className="w-16 sm:w-24 h-1 bg-primary mx-auto mt-4 sm:mt-6 rounded-full" />
            </div>
            
            <div className="relative">
              <div className="flex justify-center items-center gap-4 mb-6">
                <button
                  onClick={handlePrevious}
                  className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
                  aria-label="Previous feedback"
                >
                  <ChevronLeft className="text-primary" size={20} />
                </button>
                
                <button
                  onClick={togglePause}
                  className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
                  aria-label={isPaused ? "Play carousel" : "Pause carousel"}
                >
                  {isPaused ? (
                    <Play className="text-primary" size={20} />
                  ) : (
                    <Pause className="text-primary" size={20} />
                  )}
                </button>
                
                <button
                  onClick={handleNext}
                  className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
                  aria-label="Next feedback"
                >
                  <ChevronRight className="text-primary" size={20} />
                </button>
              </div>

              <div className="carousel-container">
                <div className="flex overflow-hidden">
                  <div className={`flex ${isPaused ? '' : 'animate-scroll-x'} space-x-4 sm:space-x-6`}>
                    {[...userFeedbacks, ...userFeedbacks].map((feedback, index) => (
                      <div key={`${feedback._id || index}-${index}`} className="flex-shrink-0 w-72 sm:w-80">
                        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray100 h-full flex flex-col">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                              <MessageSquare className="text-primary" size={16} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-semibold text-gray800 truncate text-sm sm:text-base">{feedback.userName || "Anonymous User"}</h4>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 ${i < (feedback.bookingEaseRating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-gray600 leading-relaxed mb-4 line-clamp-3 flex-grow text-sm sm:text-base">
                            "{feedback.comment || 'Great experience with the platform!'}"
                          </p>
                          
                          <div className="flex items-center justify-between text-sm text-gray500 mt-auto">
                            <span className="truncate">Overall Experience</span>
                            <span className="font-medium text-primary flex-shrink-0">{feedback.bookingEaseRating || 5}/5</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-6 gap-2">
                {userFeedbacks.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentIndex 
                        ? 'bg-primary w-8' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to feedback ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
      */}

      <Footer/>
    </div>
  );
}
