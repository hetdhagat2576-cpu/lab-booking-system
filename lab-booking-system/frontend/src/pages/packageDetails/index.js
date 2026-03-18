import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Theme from "../../config/theam/index.js";
import IconConfig from "../../components/icon/index.js";
import CButton from "../../components/cButton";
import { safeFetch, createApiUrl } from "../../config/api";
import { safeTestName } from "../../services/testSync";
import Swal from "sweetalert2";

export default function PackageDetails() {
  const navigate = useNavigate();
  const { id: packageId } = useParams();
  
  const [packageData, setPackageData] = useState(null);
  const [packageDetails, setPackageDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const { ArrowLeft, ShieldCheck, Clock, TestTube2, Droplets } = IconConfig;

  // Fetch package basic data and details
  const fetchPackageData = useCallback(async () => {
    if (!packageId) {
      console.error('No package ID provided');
      setLoading(false);
      return;
    }

    try {
      // Fetch basic package data
      const packageResponse = await safeFetch(createApiUrl(`/api/packages/${packageId}`));
      
      if (packageResponse.ok) {
        const packageResult = await packageResponse.json();
        console.log('Package basic data:', packageResult.data);
        setPackageData(packageResult.data);
      } else {
        console.error('Failed to fetch package data:', packageResponse.status);
      }

      // Fetch package details with populated tests
      const detailsResponse = await safeFetch(createApiUrl(`/api/package-details/${packageId}`));
      
      if (detailsResponse.ok) {
        const detailsResult = await detailsResponse.json();
        console.log('Package details data:', detailsResult.data);
        setPackageDetails(detailsResult.data);
      } else {
        console.error('Failed to fetch package details:', detailsResponse.status);
        
        // Fallback: try to get package data with populated tests from packages endpoint
        try {
          const fallbackResponse = await safeFetch(createApiUrl(`/api/packages/${packageId}?populate=tests`));
          if (fallbackResponse.ok) {
            const fallbackResult = await fallbackResponse.json();
            console.log('Fallback package data:', fallbackResult.data);
            // Create a mock packageDetails structure if needed
            if (fallbackResult.data) {
              setPackageDetails({
                includedTests: fallbackResult.data.testsIncluded || [],
                includedTestNames: fallbackResult.data.testsIncluded?.map(test => test.name) || [],
                reportingTime: fallbackResult.data.duration,
                requiredSamples: fallbackResult.data.sampleTypes || ['Blood'],
                benefits: fallbackResult.data.benefits || [],
                suitableFor: fallbackResult.data.suitableFor || []
              });
            }
          }
        } catch (fallbackError) {
          console.error('Fallback fetch also failed:', fallbackError);
        }
      }
    } catch (error) {
      console.error('Error fetching package data:', error);
    } finally {
      setLoading(false);
    }
  }, [packageId]);

  useEffect(() => {
    fetchPackageData();
  }, [packageId, fetchPackageData]);

  const handleBookNow = () => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem('lab_user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    
    // Check if user is authenticated and email is verified
    if (user && (user.emailVerified || user.isEmailVerified)) {
      // User is authenticated, navigate to booking page
      navigate(`/new-booking?package=${packageId}`);
    } else {
      // User is not authenticated, show SweetAlert prompt
      Swal.fire({
        title: 'Login Required',
        text: 'Please log in to your account to book this package.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: Theme.colors.primary,
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Login Now',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login', { 
            state: { 
              redirectTo: `/new-booking?package=${packageId}`,
              message: 'Please log in to your account to book this package'
            } 
          });
        }
      });
    }
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
                    onClick={handleBookNow}
                  >
                    Book Now at ₹{packageData?.price || 0}
                  </CButton>
                </div>
              </div>

              {/* Card 2: Included Tests Summary */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900">Tests Included</h2>
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {(() => {
                      const includedTests = packageDetails?.includedTests || 
                                         packageData?.testsIncluded || 
                                         packageData?.includes || 
                                         [];
                      return `${includedTests.length} Tests`;
                    })()}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(() => {
                    const includedTests = packageDetails?.includedTests || 
                                       packageData?.testsIncluded || 
                                       packageData?.includes || 
                                       [];
                    
                    if (includedTests.length === 0) {
                      return (
                        <div className="col-span-full">
                          <p className="text-slate-500 text-sm italic text-center py-4">No tests included in this package</p>
                        </div>
                      );
                    }
                    
                    return includedTests.slice(0, 6).map((test, index) => {
                      let testName = '';
                      
                      if (typeof test === 'string') {
                        testName = test;
                      } else if (test?.name) {
                        testName = test.name;
                      } else if (test?.testName) {
                        testName = test.testName;
                      } else {
                        testName = JSON.stringify(test);
                      }
                      
                      return (
                        <div key={`test-${index}`} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                          <TestTube2 className="w-3 h-3 text-primary flex-shrink-0" />
                          <span className="text-xs text-slate-700 font-medium truncate">
                            {safeTestName(testName)}
                          </span>
                        </div>
                      );
                    });
                  })()}
                </div>
                
                {(() => {
                  const includedTests = packageDetails?.includedTests || 
                                     packageData?.testsIncluded || 
                                     packageData?.includes || 
                                     [];
                  
                  if (includedTests.length > 6) {
                    return (
                      <div className="mt-4 text-center">
                        <p className="text-slate-500 text-sm">
                          And {includedTests.length - 6} more tests...
                        </p>
                      </div>
                    );
                  }
                })()}
                
                              </div>

              
              {/* Card 3: Details (Report Time, Sample Type, Preparation) */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
                
                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0">
                  
                  {/* Report Time */}
                  <div className="md:pr-6 md:border-r border-slate-100">
                    <div className="text-slate-400 font-medium mb-1">Reports Within</div>
                    <div className="font-bold text-slate-900 text-lg mb-2">
                      {packageDetails?.reportingTime || packageData?.duration || packageData?.reportTime || 'N/A'}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-primary bg-secondary/20 px-2 py-1 rounded inline-block">
                      <ShieldCheck className="w-3 h-3" />
                      100% NABL CERTIFIED
                    </div>
                  </div>

                  {/* Sample Type */}
                  <div className="md:px-6 md:border-r border-slate-100">
                    <div className="text-slate-400 font-medium mb-1">Sample Type</div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-slate-900 text-lg">
                        {packageData?.sampleTypes?.[0] || packageDetails?.requiredSamples?.[0] || 'Blood'}
                      </span>
                      <Droplets className="w-4 h-4 text-red-500" />
                    </div>
                    {(() => {
                      const sampleTypes = packageData?.sampleTypes || packageDetails?.requiredSamples || [];
                      if (sampleTypes.length > 1) {
                        return (
                          <div className="text-xs text-slate-500">
                            +{sampleTypes.length - 1} more
                          </div>
                        );
                      }
                    })()}
                  </div>

                  {/* Preparation */}
                  <div className="md:pl-6">
                    <div className="text-slate-400 font-medium mb-1">Preparation</div>
                    <div className="text-sm text-slate-700 leading-relaxed">
                      {packageData?.preparation || packageData?.fastingRequired ? 
                        (packageData?.preparation || 'Fasting may be required') : 
                        'No special preparation required'
                      }
                    </div>
                    {packageData?.fastingRequired && (
                      <div className="mt-2 inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded">
                        <Clock className="w-3 h-3" />
                        Fasting Required
                      </div>
                    )}
                  </div>

                </div>

              </div>

              {/* Card 4: Benefits and Suitable For - Side by Side */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Benefits Section */}
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Benefits</h2>
                    
                    <div className="space-y-3">
                      {(() => {
                        const benefits = packageDetails?.benefits || packageData?.benefits || [];
                        
                        if (benefits.length === 0) {
                          return (
                            <p className="text-slate-500 text-sm italic">No benefits listed for this package</p>
                          );
                        }
                        
                        return benefits.map((benefit, index) => (
                          <div key={`benefit-${index}`} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2"></div>
                            <span className="text-slate-700 leading-relaxed">{benefit}</span>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>

                  {/* Suitable For Section */}
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Suitable For</h2>
                    
                    <div className="space-y-3">
                      {(() => {
                        const suitableFor = packageDetails?.suitableFor || packageData?.suitFor || packageData?.suitableFor || [];
                        
                        if (suitableFor.length === 0) {
                          return (
                            <p className="text-slate-500 text-sm italic">No suitability information available</p>
                          );
                        }
                        
                        return suitableFor.map((group, index) => (
                          <div key={`suitable-${index}`} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                            <span className="text-slate-700 leading-relaxed">{group}</span>
                          </div>
                        ));
                      })()}
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
