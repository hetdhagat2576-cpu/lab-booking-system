import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Theme from "../../config/theam/index.js";
import IconConfig from "../../components/icon/index.js";
import CButton from "../../components/cButton";
import { safeFetch } from "../../config/api";
import {
  RECOMMENDED_TESTS,
} from "../../config/staticData";

export default function AllTests() {
  const navigate = useNavigate();
  const { ArrowLeft } = IconConfig;
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        // Fetch tests from the new API
        const response = await safeFetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/tests?isActive=true`);
        
        if (response.ok) {
          const data = await response.json();
          const apiTests = data.data || [];
          setTests(apiTests);
        } else {
          console.error('Failed to fetch tests from API');
          setTests([]);
        }
      } catch (error) {
        console.error('Error fetching tests:', error);
        setTests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  if (loading) {
    return (
      <div className={Theme.layout.standardPage}>
        <Header />
        <main className="flex-grow bg-slate-50/50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading tests...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={Theme.layout.standardPage}>
      <Header />

      <main className="flex-grow bg-slate-50/50">
        <div className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
          <div className="container mx-auto px-4 py-3 flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-slate-50 rounded-lg transition-all border border-gray-100 group shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600 group-hover:text-primary" />
            </button>
            <h1 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">
              All Tests
            </h1>
            <span className="ml-auto text-xs font-bold text-primary">{tests.length} items</span>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test) => (
              <div
                key={test._id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="text-lg font-bold text-slate-800 flex-1">{test.name}</h4>
                  </div>
                  {test.description && (
                    <p className="text-slate-600 text-sm mb-4">{test.description}</p>
                  )}
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-100 uppercase">
                      {test.category}
                    </span>
                    {test.discount && (
                      <span className="inline-flex items-center bg-red-50 text-red-600 text-[10px] font-bold px-2.5 py-1 rounded-full border border-red-100 uppercase">
                        {test.discount}% OFF
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-3 mb-6">
                    <span className="text-2xl font-black text-slate-900">₹{test.price}</span>
                    {test.originalPrice && (
                      <span className="text-sm text-slate-500 line-through">₹{test.originalPrice}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                      <CButton
                        variant="outline"
                        fullWidth={false}
                        onClick={() => {
                          // For individual tests, go to test details
                          navigate(`/test-details?id=${test._id}`);
                        }}
                        className="rounded-xl h-10 font-bold uppercase tracking-widest"
                      >
                        DETAIL
                      </CButton>
                      <CButton
                        variant="primary"
                        fullWidth={false}
                        onClick={() => {
                          // For individual tests, go to booking
                          navigate(`/new-booking?name=${encodeURIComponent(test.name)}&price=${test.price}`);
                        }}
                        className="rounded-xl h-10 font-bold uppercase tracking-widest"
                      >
                        BOOK
                      </CButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
