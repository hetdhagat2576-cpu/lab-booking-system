import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header";
import Footer from "../../components/footer";
import ImageConfig from "../../config/image File";
import IconConfig from "../../components/icon/index.js";
import Theme from "../../config/theam/index.js";
import { safeFetch } from "../../config/api";

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

      {/* Our Services Section */}
      <div className="w-full flex flex-col items-center justify-center py-16 bg-gradient-to-b from-secondary/20 to-white">
        <h1 className="text-4xl font-bold text-gray-800">{heroTitle}</h1>
        <p className="text-lg text-gray-600 mt-4 text-center max-w-2xl">
          {heroDescription}
        </p>
      </div>

      {/* Smart Lab Ecosystem Section */}
      <div className="w-full relative h-96 bg-slate900 overflow-hidden">
        <img 
          src={ImageConfig.serviceImage || "https://via.placeholder.com/1920x400"}
          alt="Smart Lab Ecosystem" 
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h2 className="text-5xl font-bold mb-4">{ecosystemTitle}</h2>
            <p className="text-xl font-semibold">{ecosystemSubtitle}</p>
          </div>
        </div>
      </div>

      {/* Comprehensive Features Section */}
      <div className="w-full py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Comprehensive Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mb-4">
                  {(feature.iconKey
                    ? React.createElement(getIconByKey(feature.iconKey), { className: "text-primary", size: 24 })
                    : React.createElement(feature._staticIcon || CheckCircle2, { className: "text-primary", size: 24 })
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Built for busy campus schedules Section */}
      <div className="w-full py-20 bg-primary text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-4">
                <span className="bg-secondary/30 px-3 py-1 rounded-full text-sm font-semibold">{efficiencyBadge}</span>
              </div>
              <h2 className="text-4xl font-bold mb-6">
                {campusTitle}
              </h2>
              <p className="text-lg mb-8 text-secondary/90">
                {campusDescription}
              </p>
              
              <div className="space-y-3 mb-8">
                {benefits.slice(0, 3).map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="text-yellow-400" size={20} />
                    <span className="font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 text-gray-800">
              <h3 className="text-2xl font-bold mb-6 text-primary">System Highlights</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {highlights.map((highlight, index) => (
                  <div key={index} className="space-y-2">
                    <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
                      {(highlight.iconKey
                        ? React.createElement(getIconByKey(highlight.iconKey), { className: "text-primary", size: 20 })
                        : React.createElement(highlight._staticIcon || ShieldCheck, { className: "text-primary", size: 20 })
                      )}
                    </div>
                    <h4 className="font-semibold text-gray-800">{highlight.title}</h4>
                    <p className="text-sm text-gray-600">{highlight.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ready to optimize your labs? Section */}
      <div className="w-full py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-r from-primary to-primaryHover rounded-3xl p-12 shadow-xl">
            <h2 className="text-3xl font-bold text-white mb-4">
              {ctaTitle}
            </h2>
            <p className="text-lg text-secondary/90 mb-8">
              {ctaDescription}
            </p>
            <button
              onClick={() => navigate("/register")}
              className="bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
            >
              {ctaButtonText}
              <ArrowRightCircle size={20} />
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
