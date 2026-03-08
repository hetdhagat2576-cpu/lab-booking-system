import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../../components/header';
import Footer from '../../components/footer';
import IconConfig from '../../components/icon/index.js';
import Theme from '../../config/theam/index.js';
import {
  heroTitle,
  heroSubtitle,
  heroDescription,
  sectionReveal,
  textReveal,
  AnimatedSection,
  AnimatedCard,
  AnimatedButton,
  staggerContainer,
  staggerItem,
  floating
} from '../../config/animations';

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

      {/* Privacy Content */}
      <main className="flex-1 py-12">
        <AnimatedSection className="container mx-auto px-4 max-w-4xl" delay={0.2}>
          {sortedSections.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center py-12"
            >
              <motion.div
                animate={floating}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <ShieldCheck size={48} className="text-gray-300 mx-auto mb-4" />
              </motion.div>
              <motion.p 
                className="text-gray-500"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Privacy policy will be available soon.
              </motion.p>
            </motion.div>
          ) : (
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="space-y-8"
            >
              {sortedSections.map((section, index) => (
                <AnimatedCard key={section._id} delay={index * 0.1} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <motion.div 
                      className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      <motion.span 
                        className="text-primary font-bold text-sm"
                        whileHover={{ scale: 1.2 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                      >
                        {section.sectionNumber}
                      </motion.span>
                    </motion.div>
                    <div className="flex-1">
                      <motion.h2 
                        className="text-2xl font-bold text-gray-900 mb-4"
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.8 }}
                        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                      >
                        {section.title}
                      </motion.h2>
                      <motion.div 
                        className="prose prose-gray max-w-none"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.8 }}
                        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                      >
                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                          {section.content}
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </motion.div>
          )}

          {/* Privacy Commitment */}
          <AnimatedSection className="mt-12" delay={0.3}>
            <motion.div 
              className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-8 border border-primary/20"
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              whileHover={{ y: -5 }}
            >
              <motion.h3 
                className="text-2xl font-bold text-gray-900 mb-6 text-center"
                initial={{ opacity: 0, y: -30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              >
                Our Privacy Commitment
              </motion.h3>
              <motion.div 
                className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.3 }}
              >
                <motion.div 
                  className="text-center"
                  variants={staggerItem}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <motion.div 
                    className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <Lock size={24} className="text-primary" />
                  </motion.div>
                  <h4 className="font-semibold text-gray-900 mb-2">Secure Data</h4>
                  <p className="text-sm text-gray-600">We use industry-standard encryption to protect your information.</p>
                </motion.div>
                <motion.div 
                  className="text-center"
                  variants={staggerItem}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <motion.div 
                    className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <Eye size={24} className="text-primary" />
                  </motion.div>
                  <h4 className="font-semibold text-gray-900 mb-2">Transparency</h4>
                  <p className="text-sm text-gray-600">We're clear about what data we collect and how we use it.</p>
                </motion.div>
                <motion.div 
                  className="text-center"
                  variants={staggerItem}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <motion.div 
                    className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <Users size={24} className="text-primary" />
                  </motion.div>
                  <h4 className="font-semibold text-gray-900 mb-2">Your Control</h4>
                  <p className="text-sm text-gray-600">You have control over your personal information and privacy settings.</p>
                </motion.div>
                <motion.div 
                  className="text-center"
                  variants={staggerItem}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <motion.div 
                    className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <FileCheck size={24} className="text-primary" />
                  </motion.div>
                  <h4 className="font-semibold text-gray-900 mb-2">Compliance</h4>
                  <p className="text-sm text-gray-600">We comply with all applicable privacy laws and regulations.</p>
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatedSection>

          {/* Contact Information */}
          <AnimatedSection className="mt-8" delay={0.4}>
            <motion.div 
              className="bg-gray-50 rounded-lg p-8"
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              whileHover={{ y: -5 }}
            >
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: -30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              >
                <motion.h3 
                  className="text-xl font-bold text-gray-900 mb-4"
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                >
                  Questions About Your Privacy?
                </motion.h3>
                <motion.p 
                  className="text-gray-600 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                >
                  If you have any questions about this privacy policy or how we handle your data, please don't hesitate to contact us.
                </motion.p>
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                >
                  <AnimatedButton
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primaryHover transition-colors"
                    onClick={() => window.location.href = 'mailto:privacy@example.com'}
                  >
                    Contact Privacy Team
                  </AnimatedButton>
                  <AnimatedButton
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => window.location.href = 'mailto:privacy@example.com'}
                  >
                    Request Data Export
                  </AnimatedButton>
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatedSection>
        </AnimatedSection>
      </main>

      <Footer />
    </div>
  );
}
