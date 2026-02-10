import React, { useState, useEffect } from "react";
import Header from "../../components/header";
import Footer from "../../components/footer";
import IconConfig from "../../components/icon/index.js";
import Theme from "../../config/theam/index.js";
import { PRIVACY_POLICY_SECTIONS as STATIC_SECTIONS } from "../../config/staticData";

export default function PrivacyPolicyIndex() {
  const { ShieldCheck } = IconConfig;

  const [privacyPolicyData, setPrivacyPolicyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/privacy`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setPrivacyPolicyData(data.data);
          }
        }
      } catch (error) {
        console.error("Error fetching Privacy Policy:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrivacyPolicy();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-secondary/20 via-white to-primary/10">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </main>
        <Footer />
      </div>
    );
  }

  const sections = privacyPolicyData?.sections?.length > 0 
    ? privacyPolicyData.sections.map((section, index) => ({
        id: index,
        title: section.title,
        content: section.content.replace(/<[^>]*>/g, '').split('\n').filter(line => line.trim()),
        iconKey: "ShieldCheck"
      }))
    : STATIC_SECTIONS;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-secondary/20 via-white to-primary/10 relative overflow-hidden">
      {/* Background Gradients & Shapes for Aesthetic */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-secondary/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-gray-200/50 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-4000"></div>

      <Header />

      <main className="flex-grow container mx-auto px-4 py-16 relative z-10">
        {/* Header Section */}
        <div className="max-w-5xl mx-auto text-center mb-20 relative">
          <div className="inline-flex items-center justify-center p-5 bg-white shadow-2xl rounded-3xl mb-8 border border-secondary/50 transform hover:scale-105 transition-transform duration-500 ease-out">
            <ShieldCheck className="text-primary w-14 h-14" />
          </div>
          <h1 className="text-6xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
            {privacyPolicyData?.title || "Your Privacy, Our Priority"}
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto font-light leading-relaxed">
            At <span className="font-semibold text-primary">LabBooking</span>, we're committed to protecting your personal data with the highest level of security and transparency, reflecting a "Privacy by Design" philosophy in every line of code.
          </p>
          <div className="w-24 h-1 bg-primary mx-auto mt-6 rounded-full" />
        </div>

        {/* Last Updated */}
        {privacyPolicyData?.lastUpdated && (
          <div className="max-w-5xl mx-auto text-center mb-12">
            <p className="text-sm text-gray-500">
              Last Updated: {new Date(privacyPolicyData.lastUpdated).toLocaleDateString()}
            </p>
          </div>
        )}

        {/* Hero Image Section - Abstract Tech */}
        <div className="max-w-6xl mx-auto mb-20 rounded-4xl overflow-hidden shadow-3xl transform -rotate-1 perspective-1000">
          <div className="bg-gradient-to-br from-primary to-accentBlue p-6 rounded-4xl relative overflow-hidden">
            <img
            src="https://thumbs.dreamstime.com/b/digital-cybersecurity-concept-glowing-blue-shield-lock-symbol-abstract-circuit-board-background-representing-data-keyhole-378630785.jpg"
           alt="Abstract circuit board representing data flow and security"
           className="w-full h-[450px] object-cover object-center rounded-3xl shadow-xl border-4 border-white/50 transform rotate-1 scale-105 transition-transform duration-1000"/>

            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <p className="text-white text-3xl font-bold tracking-wide text-shadow-lg drop-shadow-lg">
                    Data Integrity & Innovation
                </p>
            </div>
          </div>
        </div>

        {/* Content Section - Detailed & Aesthetic */}
        <div className="max-w-5xl mx-auto bg-white rounded-4xl shadow-3xl shadow-primary/10 border border-gray-100 overflow-hidden">
          <div className="p-8 sm:p-16 space-y-16">
            {sections.map((section) => (
              <section key={section.id} className="group flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-shrink-0 p-5 bg-secondary/20 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-300 text-primary shadow-md flex items-center justify-center">
                  {(() => {
                    const Icon = IconConfig[section.iconKey];
                    return <Icon className="w-8 h-8" />;
                  })()}
                </div>
                
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">{section.title}</h2>
                  <div className="space-y-3">
                    {section.content.map((line, idx) => (
                      <p key={idx} className="text-gray-700 leading-relaxed">{line}</p>
                    ))}
                  </div>
                </div>
              </section>
            ))}
            <div className="bg-gradient-to-r from-primary to-accentBlue p-10 rounded-4xl text-white relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="relative z-10 flex-grow">
                <h3 className="text-3xl font-bold mb-3 tracking-wide">Have Privacy Concerns?</h3>
                <p className="text-white/90 mb-6 text-lg max-w-lg">
                  Our dedicated Data Protection Officer (DPO) is always available to address your questions and ensure your peace of mind.
                </p>
              </div>
              <div className="flex-shrink-0 relative w-full md:w-1/3 h-48 md:h-auto flex items-center justify-center">
                <img
                  src="https://as1.ftcdn.net/v2/jpg/05/73/30/10/1000_F_573301078_7D7kFP8Q9JvKgMTloRV9nCQfL6QE9KT9.jpg"
                   alt="Support team working on privacy"
                    className="rounded-3xl object-cover w-full h-full shadow-xl border-4 border-white/50"
                    />
                <div className="absolute inset-0 bg-black/20 rounded-3xl"></div> {/* Overlay */}
              </div>
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
            </div>
          </div>

          {/* Bottom Banner with more certifications */}
          <div className="bg-slate50 border-t border-gray-100 py-8 px-8 flex flex-col md:flex-row justify-between items-center gap-6 rounded-b-4xl">
            <p className="text-sm font-extrabold text-primary uppercase tracking-[0.25em]">
              Ensuring Digital Trust & Security
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                <ShieldCheck className="w-5 h-5 text-green-600" /> GDPR Compliant
              </div>
              <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                <ShieldCheck className="w-5 h-5 text-green-600" /> CCPA Ready
              </div>
              <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                <ShieldCheck className="w-5 h-5 text-green-600" /> ISO 27001 Certified
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
