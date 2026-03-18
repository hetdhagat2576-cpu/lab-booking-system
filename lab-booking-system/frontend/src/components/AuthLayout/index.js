import React from "react";
import { useNavigate } from "react-router-dom";
import IconConfig from "../icon"; 

const { Shield, UserCog, FaUser, ArrowLeft } = IconConfig || {};

export const AUTH_CONTENT = {
  admin: {
    title: "Administrator",
    subtitle: "Access",
    description: "Full system access with administrative privileges. Manage users, bookings, and system settings.",
    badgeText: "Admin Portal",
    icon: Shield,
    stats: [
      { value: "Full", label: "System Access" },
      { value: "Secure", label: "Admin Portal" }
    ]
  },
  labTechnician: {
    title: "Lab Technician",
    subtitle: "Access",
    description: "Manage lab bookings, view schedules, and handle laboratory operations efficiently.",
    badgeText: "Lab Technician Portal",
    icon: UserCog,
    stats: []
  },
  user: {
    title: "Welcome back",
    subtitle: "User!",
    description: "Access the most advanced laboratory booking system with real-time analytics and secure multi-user management.",
    badgeText: "User Portal",
    icon: FaUser,
    stats: [
      { value: "99.9%", label: "System Uptime" },
      { value: "AES-256", label: "Data Encryption" }
    ]
  },
  register: {
    title: "Create Your Account",
    description: "Start your health journey with us. Book lab tests, track your health, and access reports instantly.",
    badgeText: "Join Our Community",
    icon: Shield,
    stats: [
      { value: "Secure", label: "Data Protection" },
      { value: "Fast", label: "Quick Booking" }
    ]
  }
};

export default function AuthLayout({ 
  type,
  title, 
  subtitle, 
  description, 
  stats, 
  icon, 
  children,
  bgColor = "bg-primary",
  accentColor = "text-secondary",
  badgeText,
  variant = "split",
  rightScrollable = true,
  centerContent = true,
  formMaxWidthClass = "max-w-lg",
  compactPadding = false,
  leftCenter = false
}) {
  const navigate = useNavigate();
  const isSplit = variant === "split";

  // Resolve content based on type if provided
  const content = type ? AUTH_CONTENT[type] : {};

  const displayTitle = title || content.title;
  const displaySubtitle = subtitle || content.subtitle;
  const displayDescription = description || content.description;
  const displayStats = stats || content.stats || [];
  const DisplayIcon = icon || content.icon;
  const displayBadgeText = badgeText || content.badgeText;

  return (
    <div className={`flex-grow flex flex-col ${isSplit ? 'lg:flex-row' : ''} w-full min-h-screen`}>
      {/* LEFT SIDE: DECORATIVE/INFO - STATIC (Only visible in split mode) */}
      {isSplit && (
        <div className={`hidden lg:flex lg:w-1/2 ${bgColor} p-16 flex-col justify-center ${leftCenter ? 'items-center' : ''} text-white relative overflow-hidden min-h-screen`}>
                    
          {/* Static Background Shape */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32 pointer-events-none"></div>
          
          <div className={`relative z-10 max-w-lg ${leftCenter ? 'mx-auto text-center' : ''}`}>
            {DisplayIcon && (
              <div className="mb-8">
                <DisplayIcon className={`w-16 h-16 ${accentColor}`} />
              </div>
            )}
            
            <span className={`inline-block px-4 py-1 rounded-full bg-white/20 ${accentColor} font-bold text-xs uppercase tracking-widest mb-6`}>
              {displayBadgeText}
            </span>
            
            <h1 className="text-2xl font-extrabold leading-tight mb-6">
              {displayTitle}{displaySubtitle && <span className={`ml-1 ${accentColor}`}>{displaySubtitle}</span>}
            </h1>
            
            <p className="text-slate-100 text-lg mb-10 opacity-90">
              {displayDescription}
            </p>

            {displayStats.length > 0 && (
              <div className="grid grid-cols-2 gap-6">
                {displayStats.map((stat, index) => (
                  <div key={index} className={`border-l-2 border-white/30 pl-4`}>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-slate-200">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* RIGHT SIDE: FORM */}
      <div className={`w-full ${isSplit ? 'lg:w-1/2' : 'flex-grow'} bg-white ${rightScrollable ? 'overflow-y-auto' : 'overflow-hidden'} min-h-screen`}>
        <div className={`flex flex-col ${compactPadding ? 'p-4 sm:p-6 lg:p-8' : 'p-6 lg:p-10'} min-h-screen`}>
          <div className={`w-full ${formMaxWidthClass} mx-auto ${centerContent ? 'my-auto' : 'my-0'}`}>
          {/* In centered mode, show title/subtitle inside the form area since left panel is hidden */}
          {!isSplit && (
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                {displayTitle} {displaySubtitle}
              </h1>
              <p className="text-slate-500">
                {displayDescription}
              </p>
            </div>
          )}
          {children}
          </div>
        </div>
      </div>
    </div>
  );
}
