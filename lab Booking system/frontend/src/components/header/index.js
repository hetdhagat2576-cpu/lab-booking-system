import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import IconConfig from "../icon/index.js";
import LogoutConfirmation from "../logoutConfirmation/index.js";
import NotificationBell from "../notificationBell/index.js";
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
      if (!event.target.closest('.mobile-menu-container') && !event.target.closest('[data-mobile-menu-button]')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Prevent body scroll when mobile menu is open
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      // Ensure body scroll is restored when component unmounts
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

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
  
  // Filter nav links based on authentication state
  const visibleNavLinks = isAuthenticated ? [] : navLinks;
    
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
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between min-h-0">
        
        {/* LOGO */}
        <div className="flex-shrink-0">
          <button 
            onClick={() => {
              if (isAuthenticated) {
                if (isAdmin) {
                  navigate("/admin-dashboard");
                } else if (isLabTechnician) {
                  navigate("/lab-technician-dashboard");
                } else {
                  navigate("/dashboard");
                }
              } else {
                navigate("/");
              }
            }} 
            className="flex items-center gap-1.5 sm:gap-3 group"
          >
            <div className="w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-md rounded-lg sm:rounded-2xl flex items-center justify-center border border-white/20 group-hover:border-white/40 transition-all shadow-inner">
              <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs sm:text-base md:text-xl lg:text-2xl font-black text-white leading-none tracking-tight">BookMyLab</span>
              <span className="text-[6px] sm:text-[9px] md:text-[10px] text-white/50 font-bold uppercase tracking-[0.1em] sm:tracking-[0.3em] hidden xs:block">System</span>
            </div>
          </button>
        </div>
        
        {/* CENTER NAV */}
        {!hideNavItems && (
          <>
            {/* Desktop Navigation */}
            <nav className={`hidden lg:flex items-center ${isAuthenticated ? 'justify-center' : 'gap-6 xl:gap-10'}`}>
              {visibleNavLinks.map((link) => (
                <button 
                  key={link.name} 
                  onClick={() => navigate(link.path)} 
                  className={location.pathname === link.path ? activeBeamUnderline : beamUnderline}
                >
                  {link.name}
                </button>
              ))}
              
              {/* Always show Contact Us and Booking for logged-in users, centered */}
              {isAuthenticated && (
                <>
                  <button 
                    onClick={() => navigate("/contact")} 
                    className={location.pathname === "/contact" ? activeBeamUnderline : beamUnderline}
                  >
                    Contact Us
                  </button>
                  <div className="relative dropdown-container ml-10">
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
                </>
              )}
              
              {/* Show Contact Us and Booking for non-logged-in users (original behavior) */}
              {!isAuthenticated && (
                <>
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
                </>
              )}
            </nav>
          </>
        )}

        {/* RIGHT SIDE */}
        <div className="flex-shrink-0 flex items-center gap-2 sm:gap-4">
          
          {/* Desktop: Auth Buttons or Profile */}
          <div className="hidden lg:flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <button onClick={() => navigate("/login-selection")} className={`${beamUnderline}`}>
                  Login
                </button>
                <button 
                  onClick={() => navigate("/register")} 
                  className="px-6 py-2.5 text-white rounded-full text-sm font-black transition-all active:scale-95 flex items-center gap-2"
                  style={{
                    backgroundColor: Theme.colors.primary,
                    boxShadow: `0 4px 15px ${Theme.colors.primary}40`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = Theme.colors.primaryHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = Theme.colors.primary;
                  }}
                >
                  REGISTER
                </button>
              </>
            ) : (
              <>
                {!isAdmin && !isLabTechnician && !hideProfileIcon && (
                  <NotificationBell />
                )}
                {!hideProfileIcon && (
                  <div className="relative dropdown-container">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-all"
                    >
                      <div className="w-9 h-9 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                        {UserCircle && <UserCircle className="w-6 h-6 text-white" />}
                      </div>
                      {ChevronDown && <ChevronDown className={`w-4 h-4 text-white/70 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />}
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50">
                        {!isAdmin && !isLabTechnician && (
                          <button
                            onClick={() => { navigate("/user-profile"); setIsDropdownOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            {UserCircle && <UserCircle className="w-4 h-4 text-gray-400" />} Profile
                          </button>
                        )}
                        <button
                          onClick={() => { navigate("/settings"); setIsDropdownOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          {Settings && <Settings className="w-4 h-4 text-gray-400" />} Settings
                        </button>
                        <div className="border-t border-gray-100">
                          <button
                            onClick={handleLogoutClick}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            {LogOut && <LogOut className="w-4 h-4" />} Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile: Auth Buttons or Profile Icon */}
          <div className="flex lg:hidden items-center gap-2">
            {!isAuthenticated ? (
              <>
                <button 
                  onClick={() => navigate("/login-selection")} 
                  className="px-3 py-1.5 text-white text-xs font-medium rounded-lg hover:bg-white/10 transition-all"
                >
                  Login
                </button>
                <button 
                  onClick={() => navigate("/register")} 
                  className="px-3 py-1.5 text-white rounded-full text-xs font-black transition-all active:scale-95"
                  style={{ backgroundColor: Theme.colors.primary, boxShadow: `0 4px 15px ${Theme.colors.primary}40` }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = Theme.colors.primaryHover; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = Theme.colors.primary; }}
                >
                  REGISTER
                </button>
              </>
            ) : (
              <>
                {!isAdmin && !isLabTechnician && !hideProfileIcon && (
                  <NotificationBell />
                )}
                {!hideProfileIcon && (
                  <div className="relative dropdown-container">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/10 transition-all"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                        {UserCircle && <UserCircle className="w-5 h-5 text-white" />}
                      </div>
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50">
                        {!isAdmin && !isLabTechnician && (
                          <button
                            onClick={() => { navigate("/user-profile"); setIsDropdownOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            {UserCircle && <UserCircle className="w-4 h-4 text-gray-400" />} Profile
                          </button>
                        )}
                        <button
                          onClick={() => { navigate("/settings"); setIsDropdownOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          {Settings && <Settings className="w-4 h-4 text-gray-400" />} Settings
                        </button>
                        <div className="border-t border-gray-100">
                          <button
                            onClick={handleLogoutClick}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            {LogOut && <LogOut className="w-4 h-4" />} Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* Mobile Menu Button (always at the end) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            data-mobile-menu-button
          >
            {isMobileMenuOpen ? (X && <X className="w-6 h-6" />) : (Menu && <Menu className="w-6 h-6" />)}
          </button>
        </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
        <div className="mobile-menu-container lg:hidden bg-primary/95 backdrop-blur-md border-t border-white/10">
          <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
            <nav className={`flex flex-col space-y-3 ${isAuthenticated ? 'items-center' : ''}`}>
              {/* Show nav links for non-logged-in users */}
              {!isAuthenticated && visibleNavLinks.map((link) => (
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
              
              {/* Always show Contact Us and Booking for logged-in users, centered */}
              {isAuthenticated && (
                <>
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
                </>
              )}
              
              {/* Show Contact Us and Booking for non-logged-in users (original behavior) */}
              {!isAuthenticated && (
                <>
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
                </>
              )}

              {isAuthenticated && !hideProfileIcon && (
                <>
                  {!isAdmin && !isLabTechnician && (
                    <button
                      onClick={() => {
                        navigate("/user-profile");
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-left px-4 py-3 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all"
                    >
                      Profile
                    </button>
                  )}
                  <button
                    onClick={() => {
                      navigate("/settings");
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left px-4 py-3 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all"
                  >
                    Settings
                  </button>
                  <button
                    onClick={() => {
                      handleLogoutClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left px-4 py-3 rounded-lg text-red-500 hover:text-red-400 hover:bg-white/10 transition-all"
                  >
                    Logout
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
      </div>
    </header>
  );
}
