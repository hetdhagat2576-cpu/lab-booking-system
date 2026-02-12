import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Theme from "../../config/theam/index.js";
import IconConfig from "../../components/icon/index.js";
import CButton from "../../components/cButton";
import { safeFetch } from "../../config/api";

export default function PackageDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const packageId = params.get("id");
  
  const [packageData, setPackageData] = useState(null);
  const [packageDetails, setPackageDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const { ArrowLeft, ShieldCheck, Clock, TestTube2, Droplets } = IconConfig;

  // Fetch package basic data and details
  const fetchPackageData = async () => {
    if (!packageId) {
      console.error('No package ID provided');
      setLoading(false);
      return;
    }

    try {
      // Fetch basic package data
      const packageResponse = await safeFetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/packages/${packageId}`);
      
      if (packageResponse.ok) {
        const packageResult = await packageResponse.json();
        setPackageData(packageResult.data);
      } else {
        console.error('Failed to fetch package data');
      }

      // Fetch package details
      const detailsResponse = await safeFetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/package-details/${packageId}`);
      
      if (detailsResponse.ok) {
        const detailsResult = await detailsResponse.json();
        setPackageDetails(detailsResult.data);
      } else {
        console.error('Failed to fetch package details');
      }
    } catch (error) {
      console.error('Error fetching package data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackageData();
  }, [packageId]);

  // SweetAlert2 utility functions
  const showBookingConfirmation = () => {
    Swal.fire({
      title: 'Confirm Booking',
      text: `Are you sure you want to book ${packageData?.name || packageData?.title}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: Theme.colors.primary,
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Book Now!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/new-booking?package=${packageId}`);
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
      title: packageData?.name || packageData?.title,
      html: `
        <div style="text-align: left;">
          <p><strong>Price:</strong> ₹${packageData?.price}</p>
          ${packageData?.originalPrice ? `<p><strong>Original Price:</strong> ₹${packageData.originalPrice}</p>` : ''}
          ${packageData?.discount ? `<p><strong>Discount:</strong> ${packageData.discount}% OFF</p>` : ''}
          <p><strong>Report Time:</strong> ${packageDetails?.reportingTime || packageData?.reportTime}</p>
          <p><strong>Tests Included:</strong> ${packageDetails?.includedTests?.length || packageData?.testsIncluded?.length || 'N/A'}</p>
          ${packageData?.fastingRequired ? '<p><strong>Fasting Required:</strong> Yes</p>' : ''}
        </div>
      `,
      icon: 'info',
      confirmButtonColor: Theme.colors.primary,
      confirmButtonText: 'Close'
    });
  };

  if (loading) {
    return (
      <div className={Theme.layout.standardPage}>
        <Header />
        <main className="flex-grow pt-8 pb-12 bg-slate-50/50">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-slate-600">Loading package details...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className={Theme.layout.standardPage}>
        <Header />
        <main className="flex-grow pt-8 pb-12 bg-slate-50/50">
          <div className="container mx-auto px-4">
            <CButton
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-500 hover:text-primary font-bold mb-6 transition-colors"
              variant="outline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </CButton>
            
            <div className="bg-white rounded-3xl p-8 text-center shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Package Not Found</h2>
              <p className="text-slate-600 mb-6">The package you're looking for is not available in our database.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <CButton variant="primary" onClick={() => navigate("/all")}>
                  View All Packages
                </CButton>
                <CButton variant="outline" onClick={() => navigate(-1)}>
                  Go Back
                </CButton>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={Theme.layout.standardPage}>
      <Header />

      <main className="flex-grow pt-8 pb-12 bg-slate-50/50">
        <div className="container mx-auto px-4">
          <CButton
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-primary font-bold mb-6 transition-colors"
            variant="outline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </CButton>

          <div className="flex flex-col gap-8">
            
            {/* MAIN CONTENT */}
            <div className="w-full space-y-6">
              
              {/* Card 1: Main Info */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
                <div className="flex justify-between items-start mb-2">
                  <div className="bg-secondary/20 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {packageData?.category || "Package"}
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 text-xs font-bold">
                    <ShieldCheck className="w-3 h-3" />
                    100% NABL & ISO Certified Lab
                  </div>
                </div>

                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-6 leading-tight">
                  {packageData?.name || packageData?.title || 'Package'}
                </h1>

                <div className="flex items-end gap-3 mb-6">
                  <span className="text-3xl font-black text-slate-900">₹{packageData?.price || 0}</span>
                  {packageData?.originalPrice && (
                     <span className="text-lg text-slate-400 line-through font-medium">₹{packageData.originalPrice}</span>
                  )}
                  {packageData?.discount > 0 && (
                      <span className="text-red-500 font-bold bg-red-50 px-2 py-1 rounded-lg text-sm">
                        {packageData.discount}% OFF
                      </span>
                  )}
                </div>

                {packageData?.description && (
                  <div className="mb-6">
                    <p className="text-slate-600 leading-relaxed">{packageData.description}</p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4">
                  <CButton
                    fullWidth={false}
                    variant="primary"
                    className="flex-1 justify-center text-lg"
                    onClick={() => navigate(`/new-booking?package=${packageId}`)}
                  >
                    Book Now at ₹{packageData?.price || 0}
                  </CButton>
                </div>
              </div>

              {/* Card 2: Included Tests */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Included Tests</h2>
                
                {packageDetails?.includedTests && packageDetails.includedTests.length > 0 ? (
                  <ul className="grid grid-cols-1 gap-3">
                    {packageDetails.includedTests.map((testName, idx) => (
                      <li
                        key={`${packageId}-test-${idx}`}
                        className="flex items-center gap-3 text-slate-700 border border-slate-100 rounded-lg px-4 py-3 bg-slate-50/50"
                      >
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-secondary/20 text-sm font-bold text-primary">
                          {idx + 1}
                        </span>
                        <span className="font-medium">{testName}</span>
                      </li>
                    ))}
                  </ul>
                ) : packageData?.testsIncluded && packageData.testsIncluded.length > 0 ? (
                  <ul className="grid grid-cols-1 gap-3">
                    {packageData.testsIncluded.map((test, idx) => (
                      <li
                        key={`${packageId}-test-${idx}`}
                        className="flex items-center gap-3 text-slate-700 border border-slate-100 rounded-lg px-4 py-3 bg-slate-50/50"
                      >
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-secondary/20 text-sm font-bold text-primary">
                          {idx + 1}
                        </span>
                        <span className="font-medium">{test.name || test}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-6 text-sm text-slate-600">
                    Detailed test composition will be available for this package soon.
                  </div>
                )}
              </div>

              {/* Card 3: Details (Report Time, Sample Type) */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
                
                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-0">
                  
                  {/* Report Time */}
                  <div className="md:pr-6 md:border-r border-slate-100">
                    <div className="text-slate-400 font-medium mb-1">Reports Within</div>
                    <div className="font-bold text-slate-900 text-lg mb-2">
                      {packageDetails?.reportingTime || packageData?.reportTime || 'N/A'}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-primary bg-secondary/20 px-2 py-1 rounded inline-block">
                      <ShieldCheck className="w-3 h-3" />
                      100% NABL CERTIFIED
                    </div>
                  </div>

                  {/* Sample Type */}
                  <div className="md:pl-6">
                    <div className="text-slate-400 font-medium mb-1">Sample Type</div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-lg">
                        {packageDetails?.requiredSamples && packageDetails.requiredSamples.length > 0 
                          ? packageDetails.requiredSamples.join(' & ') 
                          : packageData?.sampleTypes?.join(' & ') || 'Blood'}
                      </span>
                      <Droplets className="w-4 h-4 text-red-500" />
                    </div>
                  </div>

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
