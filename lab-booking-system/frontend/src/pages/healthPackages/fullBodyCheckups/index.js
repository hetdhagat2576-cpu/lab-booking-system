import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import IconConfig from "../../../components/icon/index.js";
import Theme from "../../../config/theam/index.js";
import Header from "../../../components/header";
import Footer from "../../../components/footer";
import CButton from "../../../components/cButton";
import { FULL_BODY_PACKAGES, getTestCount } from "../../../config/staticData";
import Swal from "sweetalert2";
const { Home, UserCheck, FileBarChart } = IconConfig;

export default function FullBodyCheckups() {
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);
  const { ArrowLeft, CheckCircle2, Clock, ShieldCheck, Stethoscope } = IconConfig;

  const packages = showAll ? FULL_BODY_PACKAGES : FULL_BODY_PACKAGES.slice(0, 3);

  // Check if user is logged in before booking package
  const handleBook = (packageId) => {
    const storedUser = localStorage.getItem('lab_user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    
    if (user && (user.emailVerified || user.isEmailVerified)) {
      // User is authenticated, navigate to booking page
      navigate(`/new-booking?package=${packageId}`);
    } else {
      // User is not authenticated, show SweetAlert prompt
      Swal.fire({
        title: 'Login Required',
        text: 'Please login to book this package. Would you like to login now?',
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
              redirectTo: `/new-booking?package=${packageId}`,
              message: 'Please login to book this package'
            } 
          });
        }
      });
    }
  };

  return (
    <div className={Theme.layout.standardPage}>
      <Header />

      <main className="flex-grow bg-slate-50/50">
        {/* Navigation Bar */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
          <div className="container mx-auto px-4 py-3 flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-slate-50 rounded-lg transition-all border border-gray-100 group shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600 group-hover:text-primary" />
            </button>
            <h1 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">Full Body Checkups</h1>
          </div>
        </div>

        {/* Guarantee Banner */}
        <div className="bg-primary text-white py-2">
          <div className="container mx-auto px-4 flex items-center gap-3">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              On-time collection or your tests are FREE!
            </span>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Expert Tip Footer */}
          <div className="mt-8 bg-white p-6 md:p-10 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <div className="w-20 h-20 bg-secondary/10 rounded-2xl flex items-center justify-center shrink-0">
              <ShieldCheck className="w-10 h-10 text-primary" strokeWidth={1.5} />
            </div>
            <div className="text-center md:text-left">
              <h4 className="font-bold text-slate-900 text-xl mb-2">Health Expert Tip</h4>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base max-w-3xl">
                A full body checkup is recommended <span className="text-primary font-bold">once every 6 months</span>. 
                Early detection allows for timely intervention and better lifestyle management.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
