import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Theme from "../../config/theam/index.js";
import IconConfig from "../../components/icon/index.js";
import CButton from "../../components/cButton";
import { safeFetch } from "../../config/api";
import { safeTestName, safeMap } from "../../services/testSync";
import {
  RECOMMENDED_TESTS,
} from "../../config/staticData";
import Swal from "sweetalert2";

export default function AllTests() {
  const navigate = useNavigate();
  const { ArrowLeft, RotateCw } = IconConfig;
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Clear localStorage to force fresh API fetch
      const healthConcerns = ['diabetes', 'thyroid', 'kidney', 'liver', 'lungs', 'fever'];
      healthConcerns.forEach(concern => {
        localStorage.removeItem(`health_concern_${concern}_tests`);
      });

      // Fetch fresh data from API
      const response = await safeFetch(`${process.env.VITE_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/tests?isActive=true`);
      
      if (response.ok) {
        const data = await response.json();
        const apiTests = data.data || [];
        setTests(apiTests);
        console.log('Refreshed tests from API:', apiTests.length);
      } else {
        console.error('Failed to refresh tests from API');
      }
    } catch (error) {
      console.error('Error refreshing tests:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Check if user is logged in before booking
  const handleBookTest = (testName, price) => {
    const storedUser = localStorage.getItem('lab_user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    
    if (user && (user.emailVerified || user.isEmailVerified)) {
      // User is authenticated, navigate to booking page with query parameters
      navigate(`/new-booking?name=${encodeURIComponent(testName)}&price=${price}`);
    } else {
      // User is not authenticated, show SweetAlert prompt
      Swal.fire({
        title: 'Login Required',
        text: 'Please login to book this test. Would you like to login now?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: Theme.colors.primary,
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Login',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login', { 
            state: { 
              redirectTo: `/new-booking?name=${encodeURIComponent(testName)}&price=${price}`,
              message: 'Please login to book this test'
            } 
          });
        }
      });
    }
  };

  useEffect(() => {
    const fetchTests = async () => {
      try {
        // Clear localStorage cache to ensure fresh data from API
        console.log('=== Clearing localStorage cache for fresh data ===');
        const healthConcerns = ['diabetes', 'thyroid', 'kidney', 'liver', 'lungs', 'fever'];
        healthConcerns.forEach(concern => {
          localStorage.removeItem(`health_concern_${concern}_tests`);
        });

        // Fetch fresh data from API
        console.log('=== Fetching fresh tests from API ===');
        const response = await safeFetch(`${process.env.VITE_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/tests?isActive=true`);
        
        if (response.ok) {
          const data = await response.json();
          const apiTests = data.data || [];
          console.log('✅ Fetched tests from API:', apiTests.length);
          console.log('API tests:', apiTests.map(t => ({ name: t.name, category: t.category, _id: t._id })));
          setTests(apiTests);
        } else {
          console.error('❌ Failed to fetch tests from API');
          setTests([]);
        }
      } catch (error) {
        console.error('❌ Error fetching tests:', error);
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
            <CButton
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-slate-50 rounded-lg transition-all border border-gray-100 group shadow-sm"
              variant="outline"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600 group-hover:text-primary" />
            </CButton>
            <h1 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">
              All Tests
            </h1>
            <span className="ml-auto text-xs font-bold text-primary">{tests.length} items</span>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 hover:bg-slate-50 rounded-lg transition-all border border-gray-100 group shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh tests from API"
            >
              <RotateCw className={`w-4 h-4 text-slate-600 group-hover:text-primary ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test) => (
              <div
                key={test._id || test.id || Math.random()}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="text-lg font-bold text-slate-800 flex-1">
                      {safeTestName(test)}
                    </h4>
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
                          if (!test._id && !test.id) {
                            console.error('Test has no ID!', test);
                            Swal.fire({
                              icon: 'error',
                              title: 'Missing Test ID',
                              text: 'Test ID is missing. Please refresh the page.',
                              confirmButtonColor: Theme.colors.primary
                            });
                            return;
                          }
                          navigate(`/test-details?id=${test._id || test.id}`);
                        }}
                        className="rounded-xl h-10 font-bold uppercase tracking-widest"
                      >
                        DETAIL
                      </CButton>
                      <CButton
                        variant="primary"
                        fullWidth={false}
                        onClick={() => handleBookTest(safeTestName(test), test.price)}
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
