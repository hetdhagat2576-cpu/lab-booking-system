import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Activity, Stethoscope, Loader2 } from 'lucide-react';

const Loader = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative inline-flex items-center justify-center">
          <div className="relative animate-bounce">
            <Stethoscope className="w-12 h-12 text-primary" />
          </div>
        </div>
        
        <div className="mt-6 flex items-center justify-center space-x-2">
          <Activity className="w-6 h-6 text-secondary animate-pulse" />
          <span className="text-xl font-semibold text-gray-800">Lab Booking System</span>
          <Activity className="w-6 h-6 text-secondary animate-pulse" />
        </div>
        
        <div className="mt-4 flex justify-center space-x-2">
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '0.8s' }}></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '200ms', animationDuration: '0.8s' }}></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '400ms', animationDuration: '0.8s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;

