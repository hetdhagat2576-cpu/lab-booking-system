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
    relative w-fit cursor-pointer py-0.5 text-white/80 transition-all duration-300 ease-out
    hover:text-white hover:pl-2
    after:content-[''] 
    after:absolute 
    after:bottom-0 
    after:left-0 
    after:w-full 
    after:h-[1px] 
    after:bg-gradient-to-r after:from-white after:to-transparent
    after:scale-x-0 
    after:origin-left 
    after:transition-transform 
    after:duration-300
    hover:after:scale-x-100
  `;

  const activeFooterLinkStyles = `
    relative w-fit cursor-pointer py-0.5 text-white transition-all duration-300 ease-out
    hover:pl-2
    after:content-[''] 
    after:absolute 
    after:bottom-0 
    after:left-0 
    after:w-full 
    after:h-[2px] 
    after:bg-gradient-to-r after:from-white after:to-transparent
    after:scale-x-100 
    after:origin-left 
    after:transition-transform 
    after:duration-300
  `;

  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-6 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* LEFT: Logo / About */}
          <div>
            <h2
              onClick={() => navigate("/")}
              className="text-2xl font-bold mb-4 text-white cursor-pointer hover:opacity-80 transition flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              BookMyLab
            </h2>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              A smart and efficient laboratory booking system to manage
              schedules, availability, and research resources with ease.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" aria-label="Facebook" className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <FaFacebook className="text-white" size={18} />
              </a>
              <a href="#" aria-label="Twitter" className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <FaTwitter className="text-white" size={18} />
              </a>
              <a href="#" aria-label="Instagram" className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <FaInstagram className="text-white" size={18} />
              </a>
              <a href="#" aria-label="LinkedIn" className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <FaLinkedin className="text-white" size={18} />
              </a>
            </div>
          </div>

          {/* MIDDLE: Quick Links - Reduced space-y-3 to space-y-1 */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white uppercase tracking-widest text-sm">
              Quick Links
            </h3>
            <ul className="space-y-1">
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

          {/* RIGHT: Contact - Reduced space-y-5 to space-y-2 */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white uppercase tracking-widest text-sm">
              Contact Us
            </h3>
            <div className="space-y-2 text-white/80">
              <div className="flex items-start gap-3 group cursor-pointer py-1">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-white/60 group-hover:text-white transition-colors" />
                <p className="text-sm">India</p>
              </div>

              <div className="flex items-center gap-3 group cursor-pointer py-1">
                <Phone className="w-5 h-5 flex-shrink-0 text-white/60 group-hover:text-white transition-colors" />
                <p className="text-sm">+91 7300028434</p>
              </div>

              <div className="flex items-center gap-3 group cursor-pointer py-1">
                <Mail className="w-5 h-5 flex-shrink-0 text-white/60 group-hover:text-white transition-colors" />
                <p className="text-sm">support@labbooking.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-white/10">
          <div className="flex items-center justify-center py-8">
            <p className="text-xs text-white/50 m-0 tracking-widest uppercase">
              © {new Date().getFullYear()} BookMyLab System. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
