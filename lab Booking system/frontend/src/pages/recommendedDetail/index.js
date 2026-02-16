import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Theme from "../../config/theam/index.js";
import IconConfig from "../../components/icon/index.js";
import CButton from "../../components/cButton";
import { safeFetch } from "../../config/api";
import {
  RECOMMENDED_TESTS,
  FULL_BODY_PACKAGES,
  LIVER_HEALTH_PACKAGES,
  LUNG_HEALTH_PACKAGES,
  KIDNEY_HEALTH_PACKAGES,
  THYROID_HEALTH_PACKAGES,
  DIABETES_PACKAGES,
  FEVER_PACKAGES,
  PACKAGE_TESTS,
} from "../../config/staticData";

const PACKAGE_DATA = {
  "Full Body": FULL_BODY_PACKAGES,
  "Liver": LIVER_HEALTH_PACKAGES,
  "Lungs": LUNG_HEALTH_PACKAGES,
  "Kidney": KIDNEY_HEALTH_PACKAGES,
  "Thyroid": THYROID_HEALTH_PACKAGES,
  "Diabetes": DIABETES_PACKAGES,
  "Fever": FEVER_PACKAGES,
};

export default function RecommendedDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const type = params.get("type"); // 'test' or 'package'
  const category = params.get("category");
  const id = params.get("id");
  const { 
    ArrowLeft, ShieldCheck,FlaskConical, 
    CheckCircle2, Droplets, FileText
  } = IconConfig;

  // State for fetched data
  const [fetchedItem, setFetchedItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch data from API or use static data as fallback
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
      let apiData = null;
      
      // Helper to normalize category for API
      const normalizeCategory = (cat) => {
         if (!cat) return "";
         if (cat === "Full Body") return "fullBodyCheckups";
         // Map capitalized categories to lowercase for PACKAGE_TESTS lookup
         if (cat === "Liver") return "liver";
         if (cat === "Lungs") return "lungs";
         if (cat === "Kidney") return "kidney";
         if (cat === "Thyroid") return "thyroid";
         if (cat === "Diabetes") return "diabetes";
         if (cat === "Fever") return "fever";
         return cat.toLowerCase();
      };

      try {
        let url = "";
        let apiCategory = "";

        if (type === "test" && id) {
          url = `${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/tests/${id}`;
        } else if (type === "package" && id) {
          url = `${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/packages/${id}`;
        }

        if (url) {
           const res = await safeFetch(url);
           if (res.ok) {
             const json = await res.json();
             
             if (type === "package") {
               // Package API returns { success: true, data: { package: {...}, tests: [...] } }
               if (json.success && json.data && json.data.package) {
                 apiData = {
                   ...json.data.package,
                   testsList: json.data.tests || []
                 };
               }
             } else {
               // Test API returns the test object directly
               apiData = json;
             }
           }
        }
      } catch (e) {
        console.log("API fetch failed, using static data", e);
      }

      let item = null;
      if (apiData) {
        item = apiData;
      } else {
        // Fallback to static data
        if (type === "test") {
           const getStaticKey = (cat) => {
             if (!cat) return null;
             if (cat === "Full Body") return "fullBodyCheckups";
             return cat.toLowerCase();
           };
           
           const key = getStaticKey(category);
           const categoryTests = (key && RECOMMENDED_TESTS[key]) ? RECOMMENDED_TESTS[key] : [];
           item = categoryTests.find((t) => String(t.id) === String(id));
           
           if (!item && !key) {
               // Try searching all categories if no category provided
               for (const catKey in RECOMMENDED_TESTS) {
                   const found = RECOMMENDED_TESTS[catKey].find(t => String(t.id) === String(id));
                   if (found) {
                       item = found;
                       break;
                   }
               }
           }
        } else if (type === "package") {
          const categoryPackages = PACKAGE_DATA[category] || [];
          item = categoryPackages.find((p) => String(p.id) === String(id));
        }
      }

      // Normalize data for display
      if (item) {
        const normalizedItem = {
           ...item,
           title: item.title || item.name || "Test Package",
           price: item.price || 500,
           actualPrice: item.originalPrice || item.mrp || item.actualPrice || (item.price ? Math.round(item.price * 1.2) : 600),
           details: item.details || item.description || "No details available.",
           fasting: (typeof item.fasting === 'string' ? item.fasting : 
                     (item.fastingRequired === true || item.isFasting === true) ? "8-10 Hrs" : 
                     (item.preTestRequirements || "No Fasting Required")),
           reportTime: item.reportTime || "24-48 Hrs",
           testsList: item.testsList || [],
           // Enhanced fields from our updated static data
           sampleType: item.sampleType || 'Blood',
           discount: item.discount || 0
        };
        
        // Calculate discount if missing
        if (!normalizedItem.discount && normalizedItem.actualPrice > normalizedItem.price) {
           normalizedItem.discount = Math.round(((normalizedItem.actualPrice - normalizedItem.price) / normalizedItem.actualPrice) * 100);
        }

        setFetchedItem(normalizedItem);
      } else {
        setFetchedItem(null);
      }

    } catch (err) {
        console.error("Error fetching data:", err);
    } finally {
        setLoading(false);
    }
    };

    fetchData();
  }, [type, category, id]);

  if (loading) {
     return (
        <div className={Theme.layout.standardPage}>
           <Header />
           <div className="flex justify-center items-center h-screen">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
           </div>
           <Footer />
        </div>
     );
  }

  const item = fetchedItem;

  if (!item) {
    return (
      <div className={Theme.layout.standardPage}>
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 mt-20">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Item Not Found</h2>
            <CButton variant="primary" onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </CButton>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Derived Data
  const getTestsList = () => {
      if (item.testsList) return item.testsList;
      
      if (type === "package") {
          const catKey = category?.toLowerCase();
          // Try exact match first, then lower case
          if (PACKAGE_TESTS[category] && PACKAGE_TESTS[category][item.id]) {
              return PACKAGE_TESTS[category][item.id];
          }
          if (catKey && PACKAGE_TESTS[catKey] && PACKAGE_TESTS[catKey][item.id]) {
              return PACKAGE_TESTS[catKey][item.id];
          }
          // Handle special keys like 'fullBodyCheckups'
           const normalizeCategory = (cat) => {
               if (!cat) return "";
               if (cat === "Full Body") return "fullBodyCheckups";
               // Map capitalized categories to lowercase for PACKAGE_TESTS lookup
               if (cat === "Liver") return "liver";
               if (cat === "Lungs") return "lungs";
               if (cat === "Kidney") return "kidney";
               if (cat === "Thyroid") return "thyroid";
               if (cat === "Diabetes") return "diabetes";
               if (cat === "Fever") return "fever";
               return cat.toLowerCase();
            };
            const normalizedKey = normalizeCategory(category);
            if (PACKAGE_TESTS[normalizedKey] && PACKAGE_TESTS[normalizedKey][item.id]) {
                return PACKAGE_TESTS[normalizedKey][item.id];
            }
      } else if (type === "test") {
          // For individual tests, return a meaningful description
          return [
            `Individual Test: ${item.title || item.name}`,
            "This is a standalone test with specific parameters",
            "No additional sub-tests included"
          ];
      }
      return [item.title];
  };

  const includedTests = getTestsList();
  
  const testCount = type === "test" ? 1 : (item.tests || item.testCount || (includedTests.length > 0 ? includedTests.length : 1));

  const getSampleType = () => {
    if (item.sampleType) {
      if (typeof item.sampleType === 'string') {
        if (item.sampleType.toLowerCase() === 'blood') return 'Blood';
        if (item.sampleType.toLowerCase() === 'urine') return 'Urine';
        if (item.sampleType.toLowerCase().includes('blood') && item.sampleType.toLowerCase().includes('urine')) return 'Blood & Urine';
        return item.sampleType.charAt(0).toUpperCase() + item.sampleType.slice(1);
      }
      return item.sampleType;
    }
    return 'Blood'; // Default fallback
  };
  
  const sampleType = getSampleType(); 
  const sampleIcon = <Droplets className="w-4 h-4 text-red-500" />;
  const reportTime = item.reportTime || "24-48 Hrs";
  const fasting = item.fasting || ((item.fastingRequired || item.isFasting) ? "8-10 Hrs" : "Not Required");
  
  const discount = item.discount || Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) || 0;

  return (
    <div className={Theme.layout.standardPage}>
      <Header />
      <main className="flex-grow pt-8 pb-12 bg-slate-50/50">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-primary font-bold mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex flex-col gap-8">
            
            {/* MAIN CONTENT */}
            <div className="w-full space-y-6">
              
              {/* Card 1: Main Info */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
                <div className="flex justify-between items-start mb-2">
                  <div className="bg-secondary/20 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {category || type}
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 text-xs font-bold">
                    <ShieldCheck className="w-3 h-3" />
                    100% NABL & ISO Certified Lab
                  </div>
                </div>

                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-6 leading-tight">
                  {item.title || item.name || 'Test Package'}
                </h1>

                <div className="flex items-end gap-3 mb-6">
                  <span className="text-3xl font-black text-slate-900">₹{item.price || 500}</span>
                  {item.originalPrice && (
                     <span className="text-lg text-slate-400 line-through font-medium">₹{item.originalPrice || item.mrp}</span>
                  )}
                  {discount > 0 && (
                      <span className="text-red-500 font-bold bg-red-50 px-2 py-1 rounded-lg text-sm">
                        {discount}% OFF
                      </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <CButton
                    fullWidth={false}
                    variant="primary"
                    className="flex-1 justify-center text-lg"
                    onClick={() => navigate(`/new-booking?${type}=${item.packageId || item.id}&price=${item.price || 500}`)}
                  >
                    Book Now at ₹{item.price || 500}
                  </CButton>
                </div>
              </div>

              {/* Card 3: Test Packages Detail */}
              {type === "package" && (
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Tests Included</h2>
                  
                  <div className="space-y-2">
                    {includedTests && includedTests.length > 0 ? (
                      includedTests.map((test, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          <FlaskConical className="w-4 h-4 text-primary" />
                          <span className="text-sm text-slate-700">
                            {(() => {
                              let testName = 'Test';
                              if (typeof test === 'string') {
                                testName = test;
                              } else if (test && typeof test === 'object') {
                                // Check if name exists and is a string
                                if (test?.name && typeof test.name === 'string') {
                                  testName = test.name;
                                } else if (test?.testName && typeof test.testName === 'string') {
                                  testName = test.testName;
                                } else {
                                  // Handle nested objects
                                  if (test?.name && typeof test.name === 'object' && test.name !== null) {
                                    testName = test.name.name || test.name.title || JSON.stringify(test.name);
                                  } else if (test?.testName && typeof test.testName === 'object' && test.testName !== null) {
                                    testName = test.testName.name || test.testName.title || JSON.stringify(test.testName);
                                  } else {
                                    testName = test._id ? `Test ${test._id}` : 'Unknown Test';
                                  }
                                }
                              }
                              // Ensure we always return a string
                              return typeof testName === 'string' ? testName : String(testName);
                            })()}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 text-sm italic">No test details available</p>
                    )}
                  </div>
                </div>
              )}

              {/* Card 2: Details (Samples, Time) */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
                
                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0">
                  
                  {/* Report Time */}
                  <div className="md:pr-6 md:border-r border-slate-100">
                    <div className="text-slate-400 font-medium mb-1">Reports Within</div>
                    <div className="font-bold text-slate-900 text-lg mb-2">{reportTime}</div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-primary bg-secondary/20 px-2 py-1 rounded inline-block">
                      <ShieldCheck className="w-3 h-3" />
                      100% NABL CERTIFIED
                    </div>
                  </div>

                  {/* Sample */}
                  <div className="md:px-6 md:border-r border-slate-100">
                    <div className="text-slate-400 font-medium mb-1">Sample</div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-lg">{sampleType}</span>
                      {sampleIcon}
                    </div>
                  </div>

                  {(item.fastingRequired || item.isFasting || (item.fasting && item.fasting.includes("Hrs"))) && (
                    <div className="md:pl-6">
                      <div className="text-slate-400 font-medium mb-1">Preparation</div>
                      <div className="space-y-2">
                        <div className="font-bold text-slate-900 text-lg">
                          {fasting}
                        </div>
                        <div className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-lg inline-block">
                          ⚠️ Fasting Required
                        </div>
                      </div>
                    </div>
                  )}

                </div>

              </div>

            </div>

            {/* RIGHT COLUMN - SIDEBAR */}
            <div className="lg:w-1/3 flex flex-col justify-center">

              
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
