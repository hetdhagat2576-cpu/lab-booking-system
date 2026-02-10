import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header';
import Footer from '../../components/footer';
import IconConfig from '../../components/icon/index.js';
import Theme from '../../config/theam/index.js';
import { createApiUrl } from '../../config/api.js';

export default function FAQ() {
  const navigate = useNavigate();
  const { HelpCircle, ChevronDown, ChevronUp } = IconConfig || {};

  const [expandedItem, setExpandedItem] = React.useState(null);
  const [faqs, setFaqs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    let mounted = true;
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const resp = await fetch(createApiUrl('/api/faq'));
        if (!resp.ok) throw new Error('Failed to load FAQs');
        const result = await resp.json();
        const items = result.data || [];
        if (mounted) {
          setFaqs(items);
        }
      } catch (e) {
        console.error('FAQ load error:', e);
        if (mounted) {
          setError('Unable to load FAQs right now.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchFaqs();
    return () => { mounted = false; };
  }, []);

  const toggleItem = (id) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our laboratory booking services. 
              Can't find what you're looking for? Feel free to contact our support team.
            </p>
          </div>

          {/* FAQ Items */}
          {error && (
            <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div className="space-y-4">
            {(loading ? [] : faqs).map((item) => (
              <div 
                key={item._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md"
              >
                <button
                  onClick={() => toggleItem(item._id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {expandedItem === item._id ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </button>
                
                {expandedItem === item._id && (
                  <div className="px-6 pb-4 border-t border-gray-100">
                    <p className="text-gray-600 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
            {(!loading && faqs.length === 0) && (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No FAQs available yet</p>
              </div>
            )}
          </div>

          {/* Contact Section */}
          <div className="mt-12 text-center rounded-lg p-8" style={{ backgroundColor: `${Theme.colors.primary}10` }}>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Still have questions?
            </h2>
            <p className="text-gray-600 mb-6">
              Our support team is here to help you with any questions or concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/contact')}
                className="px-6 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                style={{ backgroundColor: Theme.colors.primary }}
              >
                Contact Support
              </button>
              <button
                onClick={() => navigate('/feedback')}
                className="px-6 py-3 bg-white rounded-lg font-semibold hover:bg-gray-50 transition-colors border-2"
                style={{ borderColor: Theme.colors.primary, color: Theme.colors.primary }}
              >
                Send Feedback
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
