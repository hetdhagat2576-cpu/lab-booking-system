import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/index.js";
import Footer from "../../components/footer/index.js";
import Theme from "../../config/theam/index.js";
import CButton from "../../components/cButton/index.js";
import IconConfig from "../../components/icon/index.js";
import { safeFetch } from "../../config/api";
import {
  DIABETES_PACKAGES,
  FEVER_PACKAGES,
  FULL_BODY_PACKAGES,
  KIDNEY_HEALTH_PACKAGES,
  LIVER_HEALTH_PACKAGES,
  LUNG_HEALTH_PACKAGES,
  THYROID_HEALTH_PACKAGES,
  RECOMMENDED_TESTS,
} from "../../config/staticData/index.js";

export default function AllHealthPackages() {
  const navigate = useNavigate();
  const { ArrowLeft, Stethoscope, RotateCw } = IconConfig;
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPackages = async () => {
    try {
      const response = await safeFetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/packages?isActive=true`);
      
      if (response.ok) {
        const data = await response.json();
        const packagesData = data.data || [];
        
        setPackages(packagesData);
      } else {
        console.error('Failed to fetch packages from API');
        setPackages([]);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      setPackages([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPackages();
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  if (loading) {
    return (
      <div className={Theme.layout.standardPage}>
        <Header />
        <main className="flex-grow bg-slate-50/50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading packages...</p>
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
              All Health Packages
            </h1>
            <span className="ml-auto text-xs font-bold text-primary">{packages.length} items</span>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 hover:bg-slate-50 rounded-lg transition-all border border-gray-100 group shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh packages"
            >
              <RotateCw className={`w-4 h-4 text-slate-600 group-hover:text-primary ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg, index) => (
              <div
                key={pkg._id || pkg.packageId || pkg.id || `package-${index}`}
                className="group bg-white rounded-2xl border border-slate-200 hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex flex-col h-full overflow-hidden"
              >
                <div className="p-5 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                      <Stethoscope className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                    </div>
                    {pkg.fastingRequired && (
                      <span className="bg-orange-50 text-orange-600 text-[9px] font-bold px-2.5 py-1 rounded-full border border-orange-100 uppercase">
                        Fasting Required
                      </span>
                    )}
                  </div>
                  <div className="mb-2">
                    <div className="text-xs font-bold text-primary uppercase tracking-widest">
                      {pkg.category}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{pkg.title}</h3>
                  <div className="flex items-center gap-2 mt-2 mb-4">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                      {pkg.tests ? `${pkg.tests} Tests` : 'Package'}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {pkg.reportTime}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-3 mt-4 mb-4">
                    <span className="text-2xl font-black text-slate-900">₹{pkg.price}</span>
                    {pkg.originalPrice && (
                      <span className="text-slate-400 line-through text-xs font-medium">₹{pkg.originalPrice}</span>
                    )}
                  </div>
                  {pkg.discount && pkg.discount > 0 && (
                    <div className="mb-4">
                      <span className="inline-flex items-center bg-red-50 text-red-600 text-[10px] font-bold px-2.5 py-1 rounded-full border border-red-100 uppercase">
                        {pkg.discount}% OFF
                      </span>
                    </div>
                  )}
                  <div className="mt-auto">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          const packageId = pkg._id || pkg.packageId || pkg.id;
                          if (packageId) {
                            navigate(`/recommended-detail?type=${pkg.type || 'package'}&category=${pkg.category}&id=${packageId}`);
                          } else {
                            console.error('Package ID is missing:', pkg);
                          }
                        }}
                        className="h-11 border-2 border-slate-200 text-slate-800 text-xs font-bold rounded-xl hover:border-primary hover:text-primary transition-all uppercase tracking-widest shadow-sm"
                      >
                        Details
                      </button>
                      <CButton
                        variant="primary"
                        fullWidth
                        onClick={() => {
                          const packageId = pkg._id || pkg.packageId || pkg.id;
                          if (packageId) {
                            navigate(`/new-booking?${pkg.type || 'package'}=${packageId}&price=${pkg.price}`);
                          } else {
                            console.error('Package ID is missing for booking:', pkg);
                          }
                        }}
                        className="w-full h-11 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-primary transition-all active:scale-[0.98] uppercase tracking-widest shadow-sm">
                        Book Now
                      </CButton>
                    </div>
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
