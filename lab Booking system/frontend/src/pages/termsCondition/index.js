import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header";
import Footer from "../../components/footer";
import IconConfig from "../../components/icon/index.js";
import Theme from "../../config/theam/index.js";
import { TERMS_SECTIONS as STATIC_SECTIONS } from "../../config/staticData";

export default function TermsConditionIndex() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(0);
  const [dataSections, setDataSections] = useState(STATIC_SECTIONS);
  const { 
    FileText, UserCircle, CalendarClock, ShieldAlert, 
    Scale, ChevronRight, CreditCard, Lock, 
    AlertTriangle, ArrowUp 
  } = IconConfig;

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchTerms = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/terms/public`);
        const data = await res.json();
        if (data.success && data.data && data.data.sections) {
          setDataSections(data.data.sections.map(section => ({
            id: section.sectionNumber,
            title: `${section.sectionNumber}. ${section.title}`,
            content: section.content.split('\n').filter(line => line.trim()),
            iconKey: 'FileText'
          })));
        }
      } catch (error) {
        console.error("Error fetching Terms:", error);
      }
    };
    fetchTerms();
  }, []);

  const headerNav = {
    goToHome: () => navigate("/"),
    goToAbout: () => navigate("/about"),
    goToServices: () => navigate("/services"),
    goToLogin: () => navigate("/login-selection"),
    goToRegister: () => navigate("/register"),
  };

  const sections = dataSections.map((s) => {
    const Icon = IconConfig[s.iconKey] || IconConfig.FileText;
    return {
      id: `section-${s.id}`,
      icon: <Icon className="text-primary" size={28} />,
      title: s.title,
      content: s.content
    };
  });

  // Component to render individual content points
  const RenderPoint = ({ text }) => {
    const parts = text.split("**");
    return (
      <div className="flex gap-5 p-5 rounded-2xl hover:bg-secondary/10 transition-all group border border-transparent hover:border-secondary/30">
        <ChevronRight className="text-primary mt-1 shrink-0 group-hover:translate-x-2 transition-transform" size={18} />
        <p className="text-gray-700 leading-relaxed">
          {parts.length > 1 ? (
            <>
              <span className="font-bold text-primary">{parts[1]}</span>
              {parts[2]}
            </>
          ) : text}
        </p>
      </div>
    );
  };

  return (
    <div className={`${Theme.layout.standardPage} font-sans selection:bg-secondary/40`}>
      <Header {...headerNav} />

      <main className="flex-grow pt-16">
        {/* Modern Hero Section */}
        <section className="relative overflow-hidden bg-slate-900 py-24 md:py-32">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-secondary rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          </div>
          
          <div className="relative max-w-5xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-8">
              <span className="text-secondary">Terms & Condition</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              These Terms & Conditions govern your relationship with the BookMyLab ecosystem. 
              We've designed this framework to protect your health data and ensure 
              the highest standards of clinical integrity.
            </p>
              <div className="w-24 h-1 bg-primary mx-auto mt-6 rounded-full" />
            <div className="mt-10 flex flex-wrap justify-center gap-4">
            </div>
          </div>
        </section>

        {/* Content Layout */}
        <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Sticky Sidebar Navigation */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-28 space-y-2">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-4">Navigation</h4>
              {sections.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveSection(idx);
                    document.getElementById(s.id).scrollIntoView({ behavior: 'auto', block: 'center' });
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activeSection === idx 
                    ? "bg-primary text:white shadow-lg shadow-primary/30 translate-x-2" 
                    : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {s.title.split('. ')[1]}
                </button>
              ))}
            </div>
          </aside>

          {/* Main Content Areas */}
          <div className="lg:col-span-9 space-y-16">
            
            {/* Urgent Notice Card */}
            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-2xl shadow-sm flex gap-4">
              <AlertTriangle className="text-amber-600 shrink-0" size={28} />
              <div>
                <h3 className="font-bold text-amber-900 text-lg">Important Medical Disclaimer</h3>
                <p className="text-amber-800 mt-1 leading-relaxed">
                  BookMyLab is not a medical provider. Diagnostic tests are tools for clinical assessment 
                  and must be interpreted by a doctor. In case of a medical emergency, call 911 or visit 
                  the nearest hospital immediately.
                </p>
              </div>
            </div>

            {sections.map((section, idx) => (
              <section 
                id={section.id} 
                key={section.id} 
                onMouseEnter={() => setActiveSection(idx)}
                className="scroll-mt-32"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-secondary/20 rounded-xl text-primary">
                    {section.icon}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                    {section.title}
                  </h2>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
                  <div className="divide-y divide-gray-50">
                    {section.content.map((text, i) => (
                      <RenderPoint key={i} text={text} />
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* Bottom Contact Section */}
        <section className="bg-gray-50 border-t border-gray-200 py-24">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Still confused?</h2>
            <p className="text-gray-600 text-lg mb-10">
              Our legal and compliance team can help you understand these clauses in plain English.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}
                className="px-8 py-4 bg:white text-gray-700 border border-gray-200 rounded-2xl font-bold hover:bg-gray-50 transition-all flex items-center gap-2"
              >
                <ArrowUp size={18} /> Back to Top
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
