import React, { useEffect, useState } from 'react';
import Header from '../../components/header';
import Footer from '../../components/footer';
import IconConfig from '../../components/icon/index.js';
import Theme from '../../config/theam/index.js';

export default function PrivacyPage() {
  const [privacyContent, setPrivacyContent] = useState({ sections: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPrivacyContent();
  }, []);

  const fetchPrivacyContent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/privacy`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch privacy content');
      }
      
      const data = await response.json();
      setPrivacyContent(data.data || { sections: [] });
    } catch (error) {
      console.error('Error fetching privacy content:', error);
      setError('Failed to load privacy policy. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const { ShieldCheck, Lock, Eye, Users, AlertCircle, Database, FileCheck } = IconConfig;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Privacy Policy...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchPrivacyContent}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryHover"
            >
              Try Again
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const sortedSections = privacyContent.sections.sort((a, b) => a.sectionNumber - b.sectionNumber);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/90 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          {privacyContent.lastUpdated && (
            <p className="text-sm text-white/70 mt-4">
              Last updated: {new Date(privacyContent.lastUpdated).toLocaleDateString()}
            </p>
          )}
        </div>
      </section>

      {/* Privacy Content */}
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {sortedSections.length === 0 ? (
            <div className="text-center py-12">
              <ShieldCheck size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Privacy policy will be available soon.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {sortedSections.map((section) => (
                <div key={section._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold text-sm">{section.sectionNumber}</span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {section.title}
                      </h2>
                      <div className="prose prose-gray max-w-none">
                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                          {section.content}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Privacy Commitment */}
          <div className="mt-12 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-8 border border-primary/20">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Privacy Commitment</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Lock size={24} className="text-primary" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Secure Data</h4>
                <p className="text-sm text-gray-600">We use industry-standard encryption to protect your information.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Eye size={24} className="text-primary" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Transparency</h4>
                <p className="text-sm text-gray-600">We're clear about what data we collect and how we use it.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users size={24} className="text-primary" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Your Control</h4>
                <p className="text-sm text-gray-600">You have control over your personal information and privacy settings.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileCheck size={24} className="text-primary" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Compliance</h4>
                <p className="text-sm text-gray-600">We comply with all applicable privacy laws and regulations.</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-8 bg-gray-50 rounded-lg p-8">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Questions About Your Privacy?</h3>
              <p className="text-gray-600 mb-6">
                If you have any questions about this privacy policy or how we handle your data, please don't hesitate to contact us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primaryHover transition-colors">
                  Contact Privacy Team
                </button>
                <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Request Data Export
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
