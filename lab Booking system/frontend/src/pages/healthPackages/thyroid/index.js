import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import IconConfig from "../../../components/icon/index.js";
import Theme from "../../../config/theam/index.js";
import Header from "../../../components/header";
import Footer from "../../../components/footer";
import CButton from "../../../components/cButton";
import { THYROID_HEALTH_PACKAGES, RECOMMENDED_TESTS, getTestCount } from "../../../config/staticData";
import { getSynchronizedTests, formatTestForDisplay } from "../../../services/testSync";

const { Home, UserCheck, FileBarChart } = IconConfig;

export default function Thyroid() {
  const navigate = useNavigate();
  const [showAllPackages, setShowAllPackages] = useState(false);
  const [synchronizedTests, setSynchronizedTests] = useState([]);
  
  const { ArrowLeft, CheckCircle2, ShieldCheck, Clock, FlaskConical } = IconConfig;

  // Load synchronized tests from localStorage on component mount
  useEffect(() => {
    // Clear localStorage to ensure we use static data with enhanced details
    localStorage.removeItem('health_concern_thyroid_tests');
    const tests = getSynchronizedTests('thyroid');
    setSynchronizedTests(tests);
  }, []);

  // Use synchronized tests if available, otherwise fall back to static data
  const recommendedTests = synchronizedTests.length > 0 ? synchronizedTests : RECOMMENDED_TESTS.thyroid;

  const displayPackages = showAllPackages ? THYROID_HEALTH_PACKAGES : THYROID_HEALTH_PACKAGES.slice(0, 3);
  const displayTests = recommendedTests;

  const handleBook = (packageId) => navigate(`/new-booking?package=${packageId}`);

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
            <h1 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">Thyroid Health</h1>
          </div>
        </div>

        <div className="bg-primary text-white py-2">
          <div className="container mx-auto px-4 flex items-center gap-3">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              On-time collection or your tests are FREE!
            </span>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          
          <div className="mt-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div className="space-y-1">
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                  Recommended Tests
                </h3>
                <p className="text-slate-500 font-medium text-sm">
                  Core thyroid hormones and antibodies for accurate diagnosis
                </p>
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayTests.map((t) => {
                const formattedTest = formatTestForDisplay(t);
                return (
                <div
                  key={formattedTest.displayId}
                  className="group bg-white rounded-2xl border border-slate-200 hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex flex-col h-full overflow-hidden"
                >
                  <div className="p-6 flex flex-col h-full">
                    <div className="h-14 mb-2">
                      <h4 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {formattedTest.displayTitle}
                      </h4>
                    </div>

                    {formattedTest.description && (
                      <p className="text-slate-600 text-sm mb-4 line-clamp-2">{formattedTest.description}</p>
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-100 uppercase">
                        {typeof formattedTest.sampleType === 'string' ? formattedTest.sampleType : formattedTest.sampleType?.name || formattedTest.sampleType?.title || 'Blood'}
                      </span>
                    </div>

                    {formattedTest.displayDiscount && (
                      <div className="mb-6">
                        <span className="inline-flex items-center bg-red-50 text-red-600 text-[10px] font-bold px-2.5 py-1 rounded-full border border-red-100 uppercase">
                          {formattedTest.displayDiscount}% OFF
                        </span>
                      </div>
                    )}

                    <div className="mt-auto">
                      <div className="flex items-baseline gap-3 mb-6">
                        <span className="text-2xl font-black text-slate-900">₹{formattedTest.displayPrice}</span>
                        {formattedTest.displayOriginalPrice && (
                          <span className="text-slate-400 line-through text-xs font-medium">₹{formattedTest.displayOriginalPrice}</span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <CButton
                          variant="outline"
                          fullWidth={true}
                          onClick={() => navigate(`/recommended-detail?type=test&category=thyroid&id=${formattedTest.displayId}`)}
                          className="rounded-xl h-11 font-bold uppercase tracking-widest border-2 border-slate-200 hover:border-primary hover:text-primary transition-all shadow-sm"
                        >
                          Details
                        </CButton>
                        <CButton
                          variant="primary"
                          fullWidth={true}
                          onClick={() => navigate(`/new-booking?name=${encodeURIComponent(formattedTest.displayTitle)}&price=${formattedTest.displayPrice}`)}
                          className="rounded-xl h-11 font-bold uppercase tracking-widest"
                        >
                          Book
                        </CButton>
                      </div>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          </div>

          <div className="mt-16 bg-white p-6 md:p-10 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <div className="w-20 h-20 bg-secondary/10 rounded-2xl flex items-center justify-center shrink-0">
              <ShieldCheck className="w-10 h-10 text-primary" strokeWidth={1.5} />
            </div>
            <div className="text-center md:text-left flex-grow">
              <h4 className="font-bold text-slate-900 text-xl mb-4">Health Expert Tip</h4>
              
              <div className="mb-6 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 flex justify-center p-4">
                 
              </div>

              <p className="text-slate-600 leading-relaxed text-sm md:text-base max-w-3xl mt-4">
                The thyroid gland regulates your body's temperature, metabolism, and energy levels. Common symptoms of imbalance include unexplained weight changes and fatigue. A <span className="text-primary font-bold underline underline-offset-4 decoration-2">TSH test</span> is gold standard for initial screening to detect hormonal imbalances early.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
