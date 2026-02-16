import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import IconConfig from "../icon/index.js";
import LogoutConfirmation from "../logoutConfirmation/index.js";
import Theme from "../../config/theam/index.js";


export default function Header({ hideNavItems = false, hideProfileIcon = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, isLabTechnician, logout } = useAuth();
  const { UserCircle, LogOut, ChevronDown, Settings, Menu, X } = IconConfig || {};
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
      if (!event.target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isDropdownOpen || isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isDropdownOpen, isMobileMenuOpen]);

  const handleLogout = (reason) => {
    logout();
    navigate("/login-selection");
  };

  const handleLogoutClick = () => {
    const logoutComp = LogoutConfirmation({ onConfirm: handleLogout, userRole: getUserRole() });
    logoutComp.props.onClick();
  };

  const getUserRole = () => {
    if (isAdmin) return 'admin';
    if (isLabTechnician) return 'labtechnician';
    return 'user';
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Service", path: "/services" },
    { name: "About Us", path: "/about" },
    ];
    
  const beamUnderline = `
    relative py-2 text-sm font-bold text-white/90 transition-all duration-300
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

  const activeBeamUnderline = `
    relative py-2 text-sm font-bold text-white transition-all duration-300
    
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
    <header className="bg-gradient-to-r from-primary to-secondary shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* LOGO */}
        <div className="flex-1">
          <button 
            onClick={() => navigate("/")} 
            className="flex items-center gap-3 group"
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
          </button>
        </div>
        
        {/* CENTER NAV */}
        {!hideNavItems && (
          <>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <button 
                  key={link.name} 
                  onClick={() => navigate(link.path)} 
                  className={location.pathname === link.path ? activeBeamUnderline : beamUnderline}
                >
                  {link.name}
                </button>
              ))}
              <button 
                onClick={() => navigate("/contact")} 
                className={location.pathname === "/contact" ? activeBeamUnderline : beamUnderline}
              >
                Contact Us
              </button>
              <div className="relative dropdown-container">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`${(location.pathname === "/tests" || location.pathname === "/health-packages/all") ? activeBeamUnderline : beamUnderline} flex items-center gap-1`}
                >
                  Booking
                  {ChevronDown && <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />}
                </button>
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50">
                    <button
                      onClick={() => {
                        navigate("/tests");
                        setIsDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                        location.pathname === "/tests" 
                          ? "text-primary bg-gray-50" 
                          : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                      }`}
                    >
                      Tests
                    </button>
                    <button
                      onClick={() => {
                        navigate("/health-packages/all");
                        setIsDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                        location.pathname === "/health-packages/all" 
                          ? "text-primary bg-gray-50" 
                          : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                      }`}
                    >
                      Packages
                    </button>
                  </div>
                )}
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isMobileMenuOpen ? (X && <X className="w-6 h-6" />) : (Menu && <Menu className="w-6 h-6" />)}
            </button>
          </>
        )}

        {/* RIGHT SIDE */}
        <div className="flex-1 flex justify-end items-center gap-4 md:gap-8">
          {!isAuthenticated ? (
            <>
              <button onClick={() => navigate("/login-selection")} className={`${beamUnderline} hidden md:block`}>
                Login
              </button>
              
              <button 
                onClick={() => navigate("/register")} 
                className="px-4 md:px-7 py-2.5 text-white rounded-full text-sm font-black transition-all active:scale-95 flex items-center gap-2"
                style={{ 
                  backgroundColor: Theme.colors.primary,
                  border: `1px solid ${Theme.colors.primary}20`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = Theme.colors.primaryHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = Theme.colors.primary;
                }}
              >
                <span className="hidden md:inline">REGISTER</span>
                <span className="md:hidden">SIGN UP</span>
              </button>
            </>
          ) : (
            <>
              {!hideProfileIcon && !isAdmin && (
                <button
                  onClick={() => {
                    const route = isLabTechnician ? "/lab-technician-profile" : "/user-profile";
                    navigate(route);
                  }}
                  className="hidden md:flex items-center gap-2 text-white/90 hover:text-white font-bold transition-all"
                  title={user?.name || user?.email || "Profile"}
                >
                  {UserCircle && <UserCircle className="w-5 h-5" />}
                  <span>Profile</span>
                </button>
              )}
              <button
                onClick={handleLogoutClick}
                className="px-4 md:px-6 py-2 text-white rounded-full text-sm font-black transition-all active:scale-95 flex items-center gap-2"
                style={{ 
                  backgroundColor: Theme.colors.primary,
                  border: `1px solid ${Theme.colors.primary}20`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = Theme.colors.primaryHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = Theme.colors.primary;
                }}
              >
                {LogOut && <LogOut className="w-4 h-4 md:w-5 md:h-5" />}
                <span className="hidden md:inline">Logout</span>
              </button>
            </>
          )}
        </div>

      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-container md:hidden bg-primary/95 backdrop-blur-md border-t border-white/10">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <button 
                  key={link.name} 
                  onClick={() => {
                    navigate(link.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left px-4 py-3 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all ${
                    location.pathname === link.path ? 'bg-white/10 text-white' : ''
                  }`}
                >
                  {link.name}
                </button>
              ))}
              <button 
                onClick={() => {
                  navigate("/contact");
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left px-4 py-3 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all ${
                  location.pathname === "/contact" ? 'bg-white/10 text-white' : ''
                }`}
              >
                Contact Us
              </button>
              
              {/* Booking Dropdown for Mobile */}
              <div className="px-4 py-2">
                <p className="text-white/60 text-sm font-semibold mb-2">Booking</p>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      navigate("/tests");
                      setIsMobileMenuOpen(false);
                    }}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all ${
                      location.pathname === "/tests" ? 'bg-white/10 text-white' : ''
                    }`}
                  >
                    Tests
                  </button>
                  <button
                    onClick={() => {
                      navigate("/health-packages/all");
                      setIsMobileMenuOpen(false);
                    }}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all ${
                      location.pathname === "/health-packages/all" ? 'bg-white/10 text-white' : ''
                    }`}
                  >
                    Packages
                  </button>
                </div>
              </div>

              {/* Mobile Auth Buttons */}
              {!isAuthenticated && (
                <button 
                  onClick={() => {
                    navigate("/login-selection");
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left px-4 py-3 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all"
                >
                  Login
                </button>
              )}

              {/* Mobile Profile Button */}
              {isAuthenticated && !hideProfileIcon && !isAdmin && (
                <button
                  onClick={() => {
                    const route = isLabTechnician ? "/lab-technician-profile" : "/user-profile";
                    navigate(route);
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left px-4 py-3 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all"
                >
                  Profile
                </button>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
