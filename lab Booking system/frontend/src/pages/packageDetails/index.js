import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Theme from "../../config/theam/index.js";
import ImageConfig from "../../config/image File/index.js";
import IconConfig from "../../components/icon/index.js";
import CButton from "../../components/cButton";
import {
  PACKAGE_TESTS,
  FULL_BODY_PACKAGES,
  LIVER_HEALTH_PACKAGES,
  LUNG_HEALTH_PACKAGES,
  KIDNEY_HEALTH_PACKAGES,
  THYROID_HEALTH_PACKAGES,
  DIABETES_PACKAGES,
  FEVER_PACKAGES,
  RECOMMENDED_TESTS,
  getTestCount,
} from "../../config/staticData";

const CATEGORY_DATA = {
  "fullBodyCheckups": FULL_BODY_PACKAGES,
  "liver": LIVER_HEALTH_PACKAGES,
  "lungs": LUNG_HEALTH_PACKAGES,
  "kidney": KIDNEY_HEALTH_PACKAGES,
  "thyroid": THYROID_HEALTH_PACKAGES,
  "diabetes": DIABETES_PACKAGES,
  "fever": FEVER_PACKAGES,
};

export default function PackageDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const category = params.get("category") || "fullBodyCheckups";
  const id = parseInt(params.get("id") || "1", 10);

  const list = CATEGORY_DATA[category] || [];
  const pkg = list.find((p) => Number(p.id) === id);
  const tests = (PACKAGE_TESTS[category] && PACKAGE_TESTS[category][id]) || [];
  const accurateTestCount = getTestCount(category, id);

  const { ArrowLeft, ShieldCheck, Clock, TestTube2 } = IconConfig;

  // SweetAlert2 utility functions
  const showBookingConfirmation = () => {
    Swal.fire({
      title: 'Confirm Booking',
      text: `Are you sure you want to book ${pkg?.title}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: Theme.colors.primary,
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Book Now!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/new-booking?package=${pkg.id}`);
      }
    });
  };

  const showBookingSuccess = () => {
    Swal.fire({
      title: 'Booking Successful!',
      text: 'Your package has been booked successfully.',
      icon: 'success',
      confirmButtonColor: Theme.colors.primary,
      confirmButtonText: 'Great!'
    });
  };

  const showTestDetails = (testName) => {
    Swal.fire({
      title: testName,
      text: 'This test is included in your package. Detailed information about this test will be available during your visit.',
      icon: 'info',
      confirmButtonColor: Theme.colors.primary,
      confirmButtonText: 'Got it!'
    });
  };

  const showPackageInfo = () => {
    Swal.fire({
      title: pkg?.title,
      html: `
        <div style="text-align: left;">
          <p><strong>Price:</strong> ₹${pkg?.price}</p>
          <p><strong>Original Price:</strong> ₹${pkg?.originalPrice}</p>
          <p><strong>Discount:</strong> ${pkg?.discount}% OFF</p>
          <p><strong>Report Time:</strong> ${pkg?.reportTime}</p>
          <p><strong>Tests Included:</strong> ${tests.length ? tests.length : pkg?.tests}</p>
          ${pkg?.fastingRequired ? '<p><strong>Fasting Required:</strong> Yes</p>' : ''}
        </div>
      `,
      icon: 'info',
      confirmButtonColor: Theme.colors.primary,
      confirmButtonText: 'Close'
    });
  };

  return (
    <div className={Theme.layout.standardPage}>
      <Header />

      <main className="flex-grow">
        <div className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
          <div className="container mx-auto px-4 py-3 flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-slate-50 rounded-lg transition-all border border-gray-100 group shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600 group-hover:text-primary" />
            </button>
            <h1 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">
              Package Details
            </h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 flex justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl w-full">
          {/* Left Column: Image */}
          <div className="lg:col-span-3 hidden lg:block">
            <div className="bg-white rounded-2xl border border-slate200 shadow-sm overflow-hidden sticky top-24">
              <img 
                src={ImageConfig.heroSideImage} 
                alt="Package Visualization" 
                className="w-full h-auto object-cover aspect-[4/5]"
                onError={(e) => e.target.src = ImageConfig.heroSideImageFallback}
              />
              <div className="p-4 bg-slate-50">
                 <p className="text-xs text-center text-slate-500 font-medium">
                   Actual lab facilities may vary
                 </p>
              </div>
            </div>
          </div>

          {/* Middle Column: Package Details */}
          <div className="lg:col-span-6">
            {pkg ? (
              <div className="bg-white rounded-2xl border border-slate200 shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-2xl md:text-3xl font-black text-slate900 tracking-tight mb-2">
                    {pkg.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-gray600 mb-4">
                    <span className="inline-flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                      {accurateTestCount ? `${accurateTestCount} Tests Included` : `${pkg.tests} Tests Included`}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      {pkg.reportTime}
                    </span>
                    {pkg.fastingRequired && (
                      <span className="bg-orange50 text-orange600 text-[10px] font-bold px-2.5 py-1 rounded-full border border-orange100 uppercase">
                        Fasting Req.
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-3 mb-6">
                    <span className="text-2xl font-black text-slate900">₹{pkg.price}</span>
                    <span className="text-gray500 line-through text-xs font-medium">₹{pkg.originalPrice}</span>
                    <span className="text-emerald600 text-[10px] font-bold bg-emerald50 px-2 py-0.5 rounded border border-emerald100">
                      {pkg.discount}% OFF
                    </span>
                  </div>

                  <div className="mt-6">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="p-5 flex-grow flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                            <TestTube2 className="w-6 h-6 text-primary" />
                          </div>
                          <div className="text-right">
                            <div className="flex items-baseline gap-2 justify-end">
                              <span className="text-2xl font-black text-slate-900">₹{pkg.price}</span>
                              <span className="text-slate-400 line-through text-xs font-medium">₹{pkg.originalPrice}</span>
                            </div>
                            <div className="mt-1">
                              <span className="text-emerald-600 text-[10px] font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                {pkg.discount}% OFF SAVINGS
                              </span>
                            </div>
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mb-4">
                          Test Details
                        </h3>

                        <div className="flex flex-col gap-1.5 text-xs font-medium text-slate-500 mb-6">
                          <span className="flex items-center gap-2">
                            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                            {accurateTestCount ? `${accurateTestCount} Tests Included` : `${pkg.tests} Tests Included`}
                          </span>
                          <span className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-primary" />
                            {pkg.reportTime}
                          </span>
                          {pkg.fastingRequired && (
                            <span className="bg-orange-50 text-orange-600 text-[9px] font-bold px-2.5 py-1 rounded-full border border-orange-100 uppercase w-fit">
                              Fasting Required
                            </span>
                          )}
                        </div>

                        {tests.length ? (
                          <ul className="grid grid-cols-1 gap-2">
                            {tests.map((t, idx) => (
                              <li
                                key={`${id}-${idx}-${t}`}
                                className="flex items-center gap-2 text-sm text-slate700 border border-slate100 rounded-lg px-3 py-2 bg-slate50/50"
                              >
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-secondary/20 text-[11px] font-bold text-primary">
                                  {idx + 1}
                                </span>
                                <span>{t}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="rounded-xl border border-slate200 bg-slate50/50 p-4 text-sm text-gray600">
                            Detailed test composition will be available for this package soon.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <CButton
                      fullWidth
                      variant="primary"
                      onClick={() => navigate(`/new-booking?package=${pkg.id}`)}
                      className="h-11 font-bold rounded-xl uppercase tracking-widest"
                    >
                      Book Now
                    </CButton>
                    <CButton
                      fullWidth
                      variant="outline"
                      onClick={() => navigate(-1)}
                      className="h-11 font-bold rounded-xl uppercase tracking-widest border-2"
                      style={{ borderColor: Theme.colors.primary, color: Theme.colors.primary }}
                    >
                      Back
                    </CButton>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-slate200 bg-slate50/50 p-6">
                <p className="text-slate700 text-sm">Package not found.</p>
              </div>
            )}
          </div>

          {/* Right Column: Most Booked */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-slate200 shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-bold text-slate900 mb-4">Most Booked Tests</h3>
              <div className="flex flex-col gap-4">
                {RECOMMENDED_TESTS && Object.keys(RECOMMENDED_TESTS).slice(0, 3).map((category) => {
                  const tests = RECOMMENDED_TESTS[category];
                  if (!tests || tests.length === 0) return null;
                  
                  return tests.slice(0, 2).map((test, index) => (
                    <div 
                      key={`most-booked-${category}-${test.id}-${index}`} 
                      className="border border-slate100 rounded-xl p-3 hover:shadow-md transition-all cursor-pointer bg-slate50/30 group"
                      onClick={() => {
                        navigate(`/new-booking?name=${encodeURIComponent(test.title)}&price=${test.price}`);
                      }}
                    >
                      <h4 className="font-bold text-slate800 text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                        {test.title}
                      </h4>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-primary font-bold text-sm">₹{test.price}</span>
                        <span className="text-xs text-gray500 bg-white px-2 py-1 rounded border border-slate100">
                          {test.discount}% OFF
                        </span>
                      </div>
                    </div>
                  ));
                })}
              </div>
            </div>
          </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
