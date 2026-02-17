import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import IconConfig from "../icon/index.js";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const { MapPin, Phone, Mail } = IconConfig || {};

  const quickLinks = [
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Terms & Conditions", path: "/terms-condition" },
    { name: "FAQ", path: "/faq" },
    { name: "Feedback", path: "/feedback" },
    { name: "Contact Us", path: "/contact" },
  ];

  const footerLinkStyles = `
    relative w-fit py-2 text-sm font-bold text-white/80 transition-all duration-300
    hover:text-white
    
    /* The Beam */
    after:content-[''] 
    after:absolute 
    after:bottom-0 
    after:left-0 
    after:right-0 
    after:h-[2px] 
    after:bg-gradient-to-r after:from-transparent after:via-white after:to-transparent
    after:scale-x-0 
    after:transition-transform 
    after:duration-500 
    after:ease-in-out
    
    /* Hover Animation */
    hover:after:scale-x-100
    
    /* The Glow Effect */
    before:content-['']
    before:absolute
    before:bottom-0
    before:left-1/2
    before:-translate-x-1/2
    before:w-0
    before:h-[4px]
    before:bg-white/40
    before:blur-md
    before:transition-all
    before:duration-500
    hover:before:w-full
  `;

  const activeFooterLinkStyles = `
    relative w-fit py-2 text-sm font-bold text-white transition-all duration-300
    
    /* Active Beam */
    after:content-[''] 
    after:absolute 
    after:bottom-0 
    after:left-0 
    after:right-0 
    after:h-[2px] 
    after:bg-gradient-to-r after:from-transparent after:via-white after:to-transparent
    after:scale-x-100 
    after:transition-transform 
    after:duration-500 
    after:ease-in-out
    
    /* Active Glow */
    before:content-['']
    before:absolute
    before:bottom-0
    before:left-1/2
    before:-translate-x-1/2
    before:w-full
    before:h-[4px]
    before:bg-white/60
    before:blur-md
    before:transition-all
    before:duration-500
  `;

  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
          
          {/* LEFT: Logo / About */}
          <div className="sm:col-span-2 md:col-span-1">
            <h2
              onClick={() => navigate("/")}
              className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white cursor-pointer hover:opacity-80 transition flex items-center gap-3"
            >
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 group-hover:border-white/40 transition-all shadow-inner">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xl font-black text-white leading-none tracking-tight">BookMyLab</span>
                <span className="text-[10px] text-white/50 font-bold uppercase tracking-[0.3em]"> System</span>
              </div>
            </h2>
            <p className="text-white/70 text-xs sm:text-sm leading-relaxed max-w-xs">
              A smart and efficient laboratory booking system to manage
              schedules, availability, and research resources with ease.
            </p>
            <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
              <a href="#" aria-label="Facebook" className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <FaFacebook className="text-white" size={16} />
              </a>
              <a href="#" aria-label="Twitter" className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <FaTwitter className="text-white" size={16} />
              </a>
              <a href="#" aria-label="Instagram" className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <FaInstagram className="text-white" size={16} />
              </a>
              <a href="#" aria-label="LinkedIn" className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <FaLinkedin className="text-white" size={16} />
              </a>
            </div>
          </div>

          {/* MIDDLE: Quick Links */}
          <div>
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-white uppercase tracking-widest text-sm">
              Quick Links
            </h3>
            <ul className="space-y-1 sm:space-y-2">
              {quickLinks.map((link) => (
                <li
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={location.pathname === link.path ? activeFooterLinkStyles : footerLinkStyles}
                >
                  {link.name}
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT: Contact */}
          <div>
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-white uppercase tracking-widest text-sm">
              Contact Us
            </h3>
            <div className="space-y-1 sm:space-y-2 text-white/80">
              <div className="flex items-start gap-2 sm:gap-3 group cursor-pointer py-1">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0 text-white/60 group-hover:text-white transition-colors" />
                <p className="text-xs sm:text-sm">India</p>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 group cursor-pointer py-1">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-white/60 group-hover:text-white transition-colors" />
                <p className="text-xs sm:text-sm">+91 7300028434</p>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 group cursor-pointer py-1">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-white/60 group-hover:text-white transition-colors" />
                <p className="text-xs sm:text-sm">support@labbooking.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 sm:mt-12 border-t border-white/10">
          <div className="flex items-center justify-center py-4 sm:py-8">
            <p className="text-xs text-white/50 m-0 tracking-widest uppercase">
              © {new Date().getFullYear()} BookMyLab System. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
