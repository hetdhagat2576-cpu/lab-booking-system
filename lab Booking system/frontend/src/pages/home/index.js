import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import Header from "../../components/header";
import Footer from "../../components/footer";
import ImageConfig from "../../config/image File";
import IconConfig from "../../components/icon/index.js";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

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

  return (
    <div className="min-h-screen flex flex-col bg-slate50 text-gray800 font-sans">
      
      {/* HEADER */}
      <div className="fixed top-0 w-full z-50">
        <Header hideAuthButtons={true} />
      </div>

      {/* HERO BANNER */}
      <section className="bg-white pt-[72px]">
        <div className="relative w-full h-[70vh] md:h-screen">
          <img
            src={ImageConfig.homeImage}
            alt="Laboratory booking hero"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = ImageConfig.homeImageFallback;
            }}
            />
          <div className="absolute inset-0 bg-black/30" /> 
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
            <p className="text-sm font-semibold uppercase tracking-widest bg-teal-600 w-fit px-4 py-2 rounded">
              Laboratory Booking Platform
            </p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mt-4">
              Book, Track & Test <br/> with Confidence
            </h1>
            <p className="mt-6 max-w-3xl text-lg text-white/90">
              Seamless scheduling, trusted diagnostics, and fast digital reports.
            </p>
          
            <button 
              onClick={() => navigate("/register")}
              className="mt-10 px-8 py-4 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-3 group">
              Get Started Now
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* ABOUT US */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-primary mb-6">
            Trusted Laboratory Experts
          </h2>
          <p className="text-gray600 text-lg leading-relaxed">
            Our platform connects patients with certified laboratories,
            ensuring transparency, accuracy, and reliable diagnostics
            for every test.
          </p>
          <div className="w-24 h-1 bg-primary mx-auto mt-6 rounded-full" />
        </div>
      </section>

      

      {/* WHY BOOK WITH US */}
      <section className="bg-gray50 py-20 border-y border-gray100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray900 mb-16">
            Why Book With Us?
          </h2>
          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {whyBookData.map((item, index) => (
              <div
                key={item._id || index}
                className="flex gap-6 bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-gray50 group">
                <div className="p-3 rounded-lg bg-secondary/20 group-hover:bg-secondary/40 transition-colors h-fit">
                  {item.iconKey && IconConfig[item.iconKey] ? (
                    React.createElement(IconConfig[item.iconKey], { className: "text-primary", size: 32 })
                  ) : (
                    <div className="w-8 h-8 bg-primary rounded" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray800 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray600 leading-relaxed">{item.desc || item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray900 mb-14">
            How It Works
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
            {howItWorksData.map((item, index) => (
              <div key={item._id || index} className="space-y-5 group">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  {item.iconKey && IconConfig[item.iconKey] ? (
                    React.createElement(IconConfig[item.iconKey], { size: 32 })
                  ) : (
                    <div className="w-8 h-8 bg-white rounded" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray800">{item.title}</h3>
                <p className="text-gray600">{item.desc || item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN CONTENT SECTION */}
      <main className="flex-grow">
        <section className="container mx-auto px-4 py-24">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div className="space-y-8 text-center md:text-left">
              <h1 className="text-5xl font-extrabold leading-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                BookMyLab
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Book laboratory tests effortlessly with real-time availability,
                trusted labs, and instant access to reports.
              </p>
              <div className="flex items-center gap-4 mt-4 justify-center md:justify-start">
                <a href="#" aria-label="Facebook" className="p-2 rounded-full bg-gray-100 hover:bg-primary/10 transition-colors">
                  <FaFacebook className="text-primary" size={20} />
                </a>
                <a href="#" aria-label="Twitter" className="p-2 rounded-full bg-gray-100 hover:bg-primary/10 transition-colors">
                  <FaTwitter className="text-primary" size={20} />
                </a>
                <a href="#" aria-label="Instagram" className="p-2 rounded-full bg-gray-100 hover:bg-primary/10 transition-colors">
                  <FaInstagram className="text-primary" size={20} />
                </a>
                <a href="#" aria-label="LinkedIn" className="p-2 rounded-full bg-gray-100 hover:bg-primary/10 transition-colors">
                  <FaLinkedin className="text-primary" size={20} />
                </a>
              </div>
              <div className="space-y-4">
                {[
                  "Quick & simple booking",
                  "Real-time slot availability",
                  "Access reports anytime",
                ].map((text, index) => (
                  <div key={index} className="flex items-center gap-3 justify-center md:justify-start">
                    <CheckCircle className="text-primary" size={24} />
                    <span className="text-lg text-gray700 font-medium">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative w-full max-w-xl min-h-[320px]">
              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
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
      {userFeedbacks.length > 0 && (
        <section className="bg-gray50 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray900 mb-4">
                What Our Users Say
              </h2>
              <p className="text-gray600 text-lg max-w-2xl mx-auto">
                Real feedback from our valued customers about their experience with our laboratory booking platform.
              </p>
              <div className="w-24 h-1 bg-primary mx-auto mt-6 rounded-full" />
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {userFeedbacks.map((feedback, index) => (
                <div key={feedback._id || index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray100 group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <MessageSquare className="text-primary" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray800">{feedback.userName || "Anonymous User"}</h4>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < (feedback.bookingEaseRating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray600 leading-relaxed mb-4 line-clamp-4">
                    "{feedback.comment || 'Great experience with the platform!'}"
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray500">
                    <span>Overall Experience</span>
                    <span className="font-medium text-primary">{feedback.bookingEaseRating || 5}/5</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer/>
    </div>
  );
}
