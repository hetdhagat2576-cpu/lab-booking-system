import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import Header from "../../components/header";
import CButton from "../../components/cButton";
import IconConfig from "../../components/icon/index.js";
import Theme from "../../config/theam/index.js";
import LogoutConfirmation from "../../components/logoutConfirmation/index.js";
import { } from "../../config/staticData";


const SidebarItem = ({ id, label, icon: Icon, activeTab, setActiveTab, ChevronRight }) => (
  <button
    onClick={() => setActiveTab(id)}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
      activeTab === id ? "text-white shadow-md" : "text-gray-600 hover:bg-gray-100"
    }`}
    style={{
      backgroundColor: activeTab === id ? Theme.colors.primary : 'transparent'
    }}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
    {activeTab === id && <ChevronRight size={16} className="ml-auto" />}
  </button>
);

export default function AdminDashboardIndex() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { 
    CheckCircle2, XCircle, LayoutDashboard, 
    ClipboardList, MessageSquare, PhoneCall, ChevronRight, Menu, X, Trash2, LogOut,
    FileText, Settings, HelpCircle, ShieldCheck, Globe, Home, TestTube, Package, Plus, Edit2, Calendar, Zap, Cloud, Eye, Lock
  } = IconConfig;

  const [activeTab, setActiveTab] = useState("registration");
  const [bookings, setBookings] = useState([]);
  const [bookingFilter, setBookingFilter] = useState('all');
  const [stats, setStats] = useState({ totalBookings: 0, pendingBookings: 0, approvedBookings: 0, rejectedBookings: 0, totalUsers: 0, adminUsers: 0, labtechUsers: 0, regularUsers: 0 });
  const [feedbackStats, setFeedbackStats] = useState({ totalFeedbacks: 0, pendingFeedbacks: 0, reviewedFeedbacks: 0, resolvedFeedbacks: 0 });
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [contactFilter, setContactFilter] = useState('all');
  const [feedbackFilter, setFeedbackFilter] = useState('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // User Management State
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userFilter, setUserFilter] = useState('all');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  
  // Tests and Packages state
  const [tests, setTests] = useState([]);
  const [packages, setPackages] = useState([]);
  const [testLoading, setTestLoading] = useState(false);
  const [packageLoading, setPackageLoading] = useState(false);
  
  // Test Details and Package Details state
  const [testDetails, setTestDetails] = useState({});
  const [packageDetails, setPackageDetails] = useState({});
  const [testDetailsLoading, setTestDetailsLoading] = useState(false);
  const [packageDetailsLoading, setPackageDetailsLoading] = useState(false);
  
  // Test Details and Package Details editing states
  const [editingTestDetails, setEditingTestDetails] = useState(false);
  const [editingPackageDetails, setEditingPackageDetails] = useState(false);
  const [testDetailsFormData, setTestDetailsFormData] = useState({
    testName: '',
    requiredSamples: [],
    reportingTime: ''
  });
  const [packageDetailsFormData, setPackageDetailsFormData] = useState({
    packageName: '',
    requiredSamples: [],
    reportingTime: '',
    includedTests: []
  });
  
  const [homeContent, setHomeContent] = useState({ 
    whyBook: [], 
    howItWorks: [] 
  });
  const [homeContentSubTab, setHomeContentSubTab] = useState('why-book');
  const [serviceContentSubTab, setServiceContentSubTab] = useState('features');

  // Content Management States
  const [serviceContent, setServiceContent] = useState({ features: [], highlights: [] });
  const [termsContent, setTermsContent] = useState({ sections: [] });
  const [aboutContent, setAboutContent] = useState({ mainHeading: '', sections: [] });
  const [aboutLoading, setAboutLoading] = useState(false);
  const [privacyContent, setPrivacyContent] = useState({ sections: [] });
  const [faqs, setFaqs] = useState([]);
  const [contentLoading, setContentLoading] = useState(false);


  // Form states for content management
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showHighlightForm, setShowHighlightForm] = useState(false);
  const [showFAQForm, setShowFAQForm] = useState(false);
  const [showTermsForm, setShowTermsForm] = useState(false);
  const [showPrivacyForm, setShowPrivacyForm] = useState(false);
  const [showAboutForm, setShowAboutForm] = useState(false);
  
  const [editingServiceItem, setEditingServiceItem] = useState(null);
  const [editingHighlightItem, setEditingHighlightItem] = useState(null);
  const [editingFAQItem, setEditingFAQItem] = useState(null);
  const [editingTermsItem, setEditingTermsItem] = useState(null);
  const [editingPrivacyItem, setEditingPrivacyItem] = useState(null);
  const [editingAboutItem, setEditingAboutItem] = useState(null);

  const [serviceFormData, setServiceFormData] = useState({
    title: '',
    description: '',
    iconKey: 'FlaskConical'
  });
  
  const [highlightFormData, setHighlightFormData] = useState({
    title: '',
    description: '',
    iconKey: 'Zap'
  });
  
  const [faqFormData, setFaqFormData] = useState({
    question: '',
    answer: ''
  });
  
  const [termsFormData, setTermsFormData] = useState({
    title: '',
    content: '',
    sectionNumber: 1
  });
  
  const [privacyFormData, setPrivacyFormData] = useState({
    title: '',
    content: '',
    sectionNumber: 1
  });
  
  const [aboutFormData, setAboutFormData] = useState({
    icon: 'bolt',
    title: '',
    description: ''
  });

  // Form states for home content management
  const [showWhyBookForm, setShowWhyBookForm] = useState(false);
  const [showHowItWorksForm, setShowHowItWorksForm] = useState(false);
  const [editingWhyBookItem, setEditingWhyBookItem] = useState(null);
  const [editingHowItWorksItem, setEditingHowItWorksItem] = useState(null);
  const [whyBookFormData, setWhyBookFormData] = useState({
    title: '',
    desc: '',
    iconKey: 'Home'
  });
  const [howItWorksFormData, setHowItWorksFormData] = useState({
    stepNumber: 1,
    title: '',
    desc: '',
    iconKey: 'CheckCircle'
  });

  // Form states for test and package management
  const [showTestForm, setShowTestForm] = useState(false);
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [editingPackage, setEditingPackage] = useState(null);
  const [testFormData, setTestFormData] = useState({
    name: '',
    description: '',
    icon: '',
    price: '',
    category: '',
    sampleType: 'blood',
    time: '',
    preTestRequirements: 'No specific requirements.'
  });
  const [packageFormData, setPackageFormData] = useState({
    name: '',
    description: '',
    icon: '',
    includedTests: [],
    price: '',
    category: '',
    timeDuration: '',
    requiredSample: 'blood',
    fastingRequired: false
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Don't make API calls if user or token is not available
      if (!user?.token) {
        console.log('No user token available, using mock data');
        return;
      }
      
      // User management removed - no user fetching needed
      
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Admin: Fetch bookings
  const fetchBookings = useCallback(async () => {
    if (!user?.token) return;
    try {
      const resp = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/bookings`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (resp.ok) {
        const result = await resp.json();
        const list = result.data || [];
        setBookings(list);
        const pending = list.filter(b => (b.adminStatus || '').toLowerCase() === 'pending').length;
        const approved = list.filter(b => (b.adminStatus || '').toLowerCase() === 'approved').length;
        const rejected = list.filter(b => (b.adminStatus || '').toLowerCase() === 'rejected').length;
        setStats(prev => ({
          ...prev,
          totalBookings: list.length,
          pendingBookings: pending,
          approvedBookings: approved,
          rejectedBookings: rejected
        }));
      } else {
        console.error('Failed to fetch bookings - Status:', resp.status);
        // If 401 Unauthorized, redirect to login
        if (resp.status === 401) {
          console.log('Authentication failed - redirecting to login');
          logout();
          navigate('/admin-login');
          return;
        }
        setBookings([]);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setBookings([]);
    }
  }, [user, logout, navigate]);

  // Admin: Fetch feedbacks
  const fetchFeedbacksAdmin = useCallback(async () => {
    if (!user?.token) return;
    try {
      const resp = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/feedback?limit=100`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (resp.ok) {
        const result = await resp.json();
        const list = result.data || [];
        setFeedbacks(list);
        const pending = list.filter(f => (f.status || '').toLowerCase() === 'pending').length;
        const reviewed = list.filter(f => (f.status || '').toLowerCase() === 'reviewed').length;
        const resolved = list.filter(f => (f.status || '').toLowerCase() === 'resolved').length;
        setFeedbackStats({ totalFeedbacks: list.length, pendingFeedbacks: pending, reviewedFeedbacks: reviewed, resolvedFeedbacks: resolved });
      } else {
        console.error('Failed to fetch feedbacks - Status:', resp.status);
        // If 401 Unauthorized, redirect to login
        if (resp.status === 401) {
          console.log('Authentication failed - redirecting to login');
          logout();
          navigate('/admin-login');
          return;
        }
        setFeedbacks([]);
        setFeedbackStats({ totalFeedbacks: 0, pendingFeedbacks: 0, reviewedFeedbacks: 0, resolvedFeedbacks: 0 });
      }
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
      setFeedbacks([]);
      setFeedbackStats({ totalFeedbacks: 0, pendingFeedbacks: 0, reviewedFeedbacks: 0, resolvedFeedbacks: 0 });
    }
  }, [user]);

  // Admin: Fetch contacts
  const fetchContactsAdmin = useCallback(async () => {
    if (!user?.token) return;
    try {
      const resp = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/contact`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (resp.ok) {
        const result = await resp.json();
        const list = result.data || [];
        setContacts(list);
      } else {
        console.error('Failed to fetch contacts - Status:', resp.status);
        // If 401 Unauthorized, redirect to login
        if (resp.status === 401) {
          console.log('Authentication failed - redirecting to login');
          logout();
          navigate('/admin-login');
          return;
        }
        setContacts([]);
      }
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setContacts([]);
    }
  }, [user]);

  // User Management API Functions
  const fetchUsers = useCallback(async () => {
    if (!user?.token) return;
    
    try {
      setUsersLoading(true);
      const token = user.token;
      console.log('Fetching users with token:', token.substring(0, 20) + '...');
      console.log('Token length:', token.length);
      
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Users API response status:', response.status);
      console.log('Users API response headers:', response.headers);
      
      if (response.ok) {
        const result = await response.json();
        const usersData = result.data || [];
        setUsers(usersData);
        
        // Update user stats
        const totalUsers = usersData.length;
        const adminUsers = usersData.filter(u => u.role === 'admin').length;
        const labtechUsers = usersData.filter(u => u.role === 'labtechnician').length;
        const regularUsers = usersData.filter(u => u.role === 'user').length;
        
        setStats(prev => ({
          ...prev,
          totalUsers,
          adminUsers,
          labtechUsers,
          regularUsers
        }));
      } else {
        console.error('Failed to fetch users - Status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        
        // If 401 Unauthorized, redirect to login
        if (response.status === 401) {
          console.log('Authentication failed - redirecting to login');
          logout();
          navigate('/admin-login');
          return;
        }
        
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  }, [user]);

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      if (response.ok) {
        // Refresh users list
        fetchUsers();
        alert('User deleted successfully');
      } else {
        const errorData = await response.json();
        alert(`Failed to delete user: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user. Please try again.');
    }
  };

  // Filter users based on role and search term
  const getFilteredUsers = () => {
    let filteredUsers = users;
    
    // Filter by role
    if (userFilter !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.role === userFilter);
    }
    
    // Filter by search term
    if (userSearchTerm) {
      const searchLower = userSearchTerm.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.role?.toLowerCase().includes(searchLower)
      );
    }
    
    return filteredUsers;
  };

  // Content Management API Functions
  const fetchContentData = useCallback(async () => {
    if (!user?.token) return;
    
    try {
      setContentLoading(true);
      // Fetch real data from APIs
      const [whyBookResponse, howItWorksResponse, serviceContentResponse, aboutResponse, termsResponse, privacyResponse, faqResponse] = await Promise.all([
        fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/content/home/why-book`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        }),
        fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/content/home/how-it-works`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        }),
        fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/service-content`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        }),
        fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/about`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        }),
        fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/terms`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        }),
        fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/privacy`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        }),
        fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/faq/admin`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        })
      ]);

      let whyBookData = [];
      let howItWorksData = [];
      let serviceFeaturesData = [];
      let serviceHighlightsData = [];
      let aboutData = { mainHeading: '', sections: [] };
      let termsData = [];
      let privacyData = [];
      let faqData = [];

      if (whyBookResponse.ok) {
        const whyBookResult = await whyBookResponse.json();
        whyBookData = whyBookResult.data || [];
      } else {
        console.error('Failed to fetch why book data');
        // Use mock data as fallback
        whyBookData = [
          { _id: '1', title: 'Home Sample Collection', desc: 'Free and timely sample pickup by certified professionals.', iconKey: 'Home' },
          { _id: '2', title: 'Certified Labs', desc: 'ISO & NABL certified laboratories for accurate results.', iconKey: 'CheckCircle' },
          { _id: '3', title: 'Best Prices', desc: 'Compare labs and save up to 70% on test bookings.', iconKey: 'Users' },
          { _id: '4', title: 'Digital Reports', desc: 'Get your test reports delivered digitally within 24-48 hours.', iconKey: 'FileText' }
        ];
      }

      if (howItWorksResponse.ok) {
        const howItWorksResult = await howItWorksResponse.json();
        howItWorksData = howItWorksResult.data || [];
      } else {
        console.error('Failed to fetch how it works data');
        // Use mock data as fallback - matching the image data
        howItWorksData = [
          { _id: '1', stepNumber: 1, title: 'Search & Select', desc: 'Search for tests and labs, compare prices, and select what you need.', iconKey: 'Search' },
          { _id: '2', stepNumber: 2, title: 'Book & Pay', desc: 'Book your test and pay securely online or choose cash on collection.', iconKey: 'CreditCard' },
          { _id: '3', stepNumber: 3, title: 'Sample Collection', desc: 'Get your sample collected at home or visit the lab.', iconKey: 'Home' },
          { _id: '4', stepNumber: 4, title: 'Get Reports', desc: 'Receive your test reports digitally within 24-48 hours.', iconKey: 'FileText' }
        ];
      }

      if (serviceContentResponse.ok) {
        const serviceResult = await serviceContentResponse.json();
        const serviceData = serviceResult.data || {};
        serviceFeaturesData = serviceData.features || [];
        serviceHighlightsData = serviceData.highlights || [];
      } else {
        console.error('Failed to fetch service content');
        // Use comprehensive features data as fallback
        serviceFeaturesData = [
          { _id: '1', title: 'Laboratory Booking', description: 'Reserve chemistry, physics, biology, and computer labs with real-time availability.', iconKey: 'FlaskConical' },
          { _id: '2', title: 'Streamlined Scheduling', description: 'Effortlessly manage lab schedules, preventing conflicts and optimizing resource allocation.', iconKey: 'CalendarCheck2' },
          { _id: '3', title: 'Equipment Access', description: 'Gain access to a comprehensive inventory of lab equipment, ensuring your experiments are well-supported.', iconKey: 'Microscope' },
          { _id: '4', title: 'Secure Data Management', description: 'Safeguard your research data with robust security protocols and reliable storage solutions.', iconKey: 'Database' },
          { _id: '5', title: 'Collaborative Environment', description: 'Foster teamwork and knowledge sharing among researchers with integrated collaboration tools.', iconKey: 'Users' },
          { _id: '6', title: 'Usage Analytics', description: 'Monitor lab utilization, track equipment performance, and generate insightful reports for informed decision-making.', iconKey: 'BarChart2' }
        ];
        serviceHighlightsData = [
          { _id: '1', title: 'Advanced Equipment', description: 'Access to state-of-the-art laboratory equipment.', iconKey: 'TestTube' },
          { _id: '2', title: 'Expert Support', description: 'Dedicated support from experienced lab technicians.', iconKey: 'LifeBuoy' },
          { _id: '3', title: 'Flexible Scheduling', description: 'Book labs at your convenience with flexible time slots.', iconKey: 'Clock' },
          { _id: '4', title: 'Secure Environment', description: 'Conduct experiments in a safe and secure laboratory setting.', iconKey: 'ShieldCheck' }
        ];
      }

      if (aboutResponse.ok) {
        const aboutResult = await aboutResponse.json();
        aboutData = {
          mainHeading: aboutResult.mainHeading || 'Why Our System is Smarter Care',
          sections: aboutResult.sections || []
        };
      } else {
        console.error('Failed to fetch about content');
        aboutData = {
          mainHeading: 'Why Our System is Smarter Care',
          sections: []
        };
      }

      if (termsResponse.ok) {
        const termsResult = await termsResponse.json();
        termsData = termsResult.data && termsResult.data.sections ? termsResult.data.sections : [];
        console.log('Terms data fetched from API:', termsData);
      } else {
        console.error('Failed to fetch terms data from API, using seed data fallback');
        // Use terms data from seedTerms.js as fallback
        termsData = [
          {
            _id: '1',
            sectionNumber: 1,
            title: "Acceptance of Terms & Eligibility",
            content: `Legal Affirmation: By accessing the BookMyLab platform, you agree to be bound by this Agreement.\nEligibility Criteria: You must be 18+, minors require guardian supervision.\nEntire Agreement: These Terms, Privacy Policy, and Cookie Policy form the full agreement.\nRight to Amend: We may modify these terms, changes take effect upon posting.`,
            order: 0,
            isActive: true
          },
          {
            _id: '2',
            sectionNumber: 2,
            title: "User Accounts & Prohibited Conduct",
            content: `Registration Veracity: Provide accurate identity and medical information.\nAccount Custodianship: Keep credentials secure, avoid unsafe networks.\nAutomated Access: Scrapers/crawlers to extract data are prohibited.\nCommunity Standards: Do not transmit defamatory content or harvest partner data.`,
            order: 1,
            isActive: true
          },
          {
            _id: '3',
            sectionNumber: 3,
            title: "Booking & Sample Collection Protocols",
            content: `Booking Validity: Contract forms upon lab confirmation of dispatch.\nPre-Analytic Requirements: Fasting may be required for certain tests.\nHome Collection Access: Provide a safe, accessible environment.\nTurnaround Time (TAT) Estimates: may vary due to clinical factors.`,
            order: 2,
            isActive: true
          },
          {
            _id: '4',
            sectionNumber: 4,
            title: "Financial Terms & Refund Architecture",
            content: `Pricing Structure: Prices include taxes unless stated.\nPayment Gateway: Encrypted gateways, we do not store CVV/PIN.\nCancellation Window: Tiered refunds based on time.\nDispute Window: Report billing discrepancies within 14 days.`,
            order: 3,
            isActive: true
          },
          {
            _id: '5',
            sectionNumber: 5,
            title: "Data Sovereignty & Medical Privacy",
            content: `Clinical Data Usage: Labs act as Data Controllers, platform as Processor.\nHIPAA/GDPR Alignment: No health data sales for marketing.\nData Retention: Records retained per regulation.\nBreach Notification: Notify users/regulators within stipulated time.`,
            order: 4,
            isActive: true
          },
          {
            _id: '6',
            sectionNumber: 6,
            title: "Intellectual Property & Brand Assets",
            content: `Proprietary Rights: Code, graphics, branding owned by Company.\nLimited License: Personal, non-commercial use only.\nSoftware Integrity: No reverse engineering.\nUser Contributions: Feedback becomes Company property.`,
            order: 5,
            isActive: true
          },
          {
            _id: '7',
            sectionNumber: 7,
            title: "Limitation of Liability & Disclaimers",
            content: `Medical Disclaimer: Platform is facilitator, consult practitioners.\nExclusion of Warranties: Service provided as-is.\nIndemnification: You indemnify for violations/misuse.`,
            order: 6,
            isActive: true
          }
        ];
      }

      if (privacyResponse.ok) {
        const privacyResult = await privacyResponse.json();
        privacyData = (privacyResult.data && privacyResult.data.sections) ? privacyResult.data.sections : [];
      } else {
        console.error('Failed to fetch privacy data');
        // Use privacy data from backend as fallback
        privacyData = [
          { _id: '1', iconKey: 'Lock', title: '01. Data Protection & Security', content: ['AES-256 at rest and TLS 1.3 in transit.', 'Regular penetration tests and vulnerability assessments.', 'Strong access controls and audit trails.'], order: 1, isActive: true },
          { _id: '2', iconKey: 'Eye', title: '02. Information Collection & Usage', content: ['Collected for account, booking, and personalization.', 'Examples: Name, email, ID, department, preferences, device info.'], order: 2, isActive: true },
          { _id: '3', iconKey: 'HardDrive', title: '03. Log Data & Analytics', content: ['IP, browser version, pages visited, timestamps, duration.', 'Used to monitor performance and improve service.'], order: 3, isActive: true },
          { _id: '4', iconKey: 'FileText', title: '04. Cookies & Tracking Technologies', content: ['Authentication, session management, analytics.', 'You can refuse cookies; some features may be unavailable.'], order: 4, isActive: true },
          { _id: '5', iconKey: 'Clock', title: '05. Data Retention Policy', content: ['Retain as necessary for requested services and legal obligations.', 'Typical retention with anonymization or deletion thereafter.'], order: 5, isActive: true },
          { _id: '6', iconKey: 'Share2', title: '06. Third-Party Sharing & Disclosure', content: ['No sale of PII; trusted partners operate under confidentiality.', 'Release when legally required or to protect rights/safety.'], order: 6, isActive: true },
          { _id: '7', iconKey: 'Trash2', title: '07. Your Data Rights (GDPR/CCPA)', content: ['Access, rectification, erasure, restrict processing, object, portability.', 'Contact DPO to exercise rights.'], order: 7, isActive: true },
          { _id: '8', iconKey: 'Users', title: '08. Children\'s Privacy', content: ['No intentional collection from under 13 without consent.', 'Remove data if collected without verification.'], order: 8, isActive: true },
          { _id: '9', iconKey: 'AlertCircle', title: '09. Changes to This Privacy Policy', content: ['Notify via page, email, and prominent notice.', 'Review periodically; effective upon posting.'], order: 9, isActive: true }
        ];
      }

      if (faqResponse.ok) {
        const faqResult = await faqResponse.json();
        faqData = faqResult.data || [];
      } else {
        console.error('Failed to fetch FAQ data');
        faqData = [
          { _id: '1', question: 'How do I book a test?', answer: 'You can book through our website or call us...', isActive: true },
          { _id: '2', question: 'What is the turnaround time?', answer: 'Most tests are completed within 24 hours...', isActive: true }
        ];
      }

      setHomeContent({
        whyBook: whyBookData,
        howItWorks: howItWorksData
      });
      setServiceContent({ 
        features: serviceFeaturesData,
        highlights: serviceHighlightsData
      });
      setAboutContent(aboutData);
      setTermsContent({ 
        sections: termsData
      });
      console.log('Terms content set:', termsData);
      setPrivacyContent({ 
        sections: privacyData
      });
      setFaqs(faqData);
    } catch (error) {
      console.error('Error setting default content data:', error);
    } finally {
      setContentLoading(false);
    }
  }, [user]);

  // Test Management Functions
  const fetchTests = useCallback(async () => {
    if (!user?.token) return;
    
    try {
      setTestLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/tests`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        const testsData = result.data || [];
        setTests(testsData);
      } else {
        console.error('Failed to fetch tests');
        setTests([]);
      }
    } catch (error) {
      console.error('Error fetching tests:', error);
      setTests([]);
    } finally {
      setTestLoading(false);
    }
  }, [user]);

  

  const handleDeleteTest = async (id) => {
    if (window.confirm('Are you sure you want to delete this test?')) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/tests/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        
        if (response.ok) {
          fetchTests();
        } else {
          console.error('Failed to delete test');
        }
      } catch (error) {
        console.error('Error deleting test:', error);
      }
    }
  };

  const handleTestSubmit = async (e) => {
    e.preventDefault();
    try {
      const testData = {
        ...testFormData,
        price: parseFloat(testFormData.price)
      };

      const url = editingTest 
        ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/tests/${editingTest._id}`
        : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/tests`;
      
      const method = editingTest ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(testData)
      });

      if (response.ok) {
        fetchTests();
        setShowTestForm(false);
        setEditingTest(null);
        setTestFormData({
          name: '',
          description: '',
          icon: '',
          price: '',
          category: '',
          sampleType: 'blood',
          time: '',
          preTestRequirements: 'No specific requirements.'
        });
      } else {
        console.error('Failed to save test');
      }
    } catch (error) {
      console.error('Error saving test:', error);
    }
  };

  const handlePackageSubmit = async (e) => {
    e.preventDefault();
    try {
      const packageData = {
        ...packageFormData,
        price: parseFloat(packageFormData.price)
      };

      const url = editingPackage 
        ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/packages/${editingPackage._id}`
        : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/packages`;
      
      const method = editingPackage ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(packageData)
      });

      if (response.ok) {
        fetchPackages();
        setShowPackageForm(false);
        setEditingPackage(null);
        setPackageFormData({
          name: '',
          description: '',
          icon: '',
          includedTests: [],
          price: '',
          category: '',
          timeDuration: '',
          requiredSample: 'blood',
          fastingRequired: false
        });
      } else {
        console.error('Failed to save package');
      }
    } catch (error) {
      console.error('Error saving package:', error);
    }
  };

  // Package Management Functions
  const fetchPackages = useCallback(async () => {
    if (!user?.token) return;
    
    try {
      setPackageLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/packages`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        const packagesData = result.data || [];
        setPackages(packagesData);
      } else {
        console.error('Failed to fetch packages');
        setPackages([]);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      setPackages([]);
    } finally {
      setPackageLoading(false);
    }
  }, [user]);

  // Test Details and Package Details Functions
  const fetchTestDetails = useCallback(async (testId) => {
    if (!user?.token || !testId) return;
    
    try {
      setTestDetailsLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/test-details/${testId}/details`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        setTestDetails(prev => ({
          ...prev,
          [testId]: result.data
        }));
        return result.data;
      } else {
        console.error('Failed to fetch test details');
        return null;
      }
    } catch (error) {
      console.error('Error fetching test details:', error);
      return null;
    } finally {
      setTestDetailsLoading(false);
    }
  }, [user]);

  const fetchPackageDetails = useCallback(async (packageId) => {
    if (!user?.token || !packageId) return;
    
    try {
      setPackageDetailsLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/package-details/${packageId}/details`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        setPackageDetails(prev => ({
          ...prev,
          [packageId]: result.data
        }));
        return result.data;
      } else {
        console.error('Failed to fetch package details');
        return null;
      }
    } catch (error) {
      console.error('Error fetching package details:', error);
      return null;
    } finally {
      setPackageDetailsLoading(false);
    }
  }, [user]);

  // Update Test Details Function
  const updateTestDetails = async (testId, detailsData) => {
    if (!user?.token || !testId) return false;
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/test-details/${testId}/details`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(detailsData)
      });
      
      if (response.ok) {
        // Refresh the test details
        await fetchTestDetails(testId);
        return true;
      } else {
        console.error('Failed to update test details');
        return false;
      }
    } catch (error) {
      console.error('Error updating test details:', error);
      return false;
    }
  };

  // Update Package Details Function
  const updatePackageDetails = async (packageId, detailsData) => {
    if (!user?.token || !packageId) return false;
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/package-details/${packageId}/details`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(detailsData)
      });
      
      if (response.ok) {
        // Refresh the package details
        await fetchPackageDetails(packageId);
        return true;
      } else {
        console.error('Failed to update package details');
        return false;
      }
    } catch (error) {
      console.error('Error updating package details:', error);
      return false;
    }
  };

  const handleDeletePackage = async (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/packages/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        
        if (response.ok) {
          fetchPackages();
        } else {
          console.error('Failed to delete package');
        }
      } catch (error) {
        console.error('Error deleting package:', error);
      }
    }
  };

  // Service Content Functions
  const createServiceFeature = async (formData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/service-content/features`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        fetchContentData();
        return true;
      } else {
        console.error('Failed to create service feature');
        return false;
      }
    } catch (error) {
      console.error('Error creating service feature:', error);
      return false;
    }
  };

  const updateServiceFeature = async (id, formData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/service-content/features/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        fetchContentData();
        return true;
      } else {
        console.error('Failed to update service feature');
        return false;
      }
    } catch (error) {
      console.error('Error updating service feature:', error);
      return false;
    }
  };

  const deleteServiceFeature = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feature?')) return false;
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/service-content/features/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      if (response.ok) {
        fetchContentData();
        return true;
      } else {
        console.error('Failed to delete service feature');
        return false;
      }
    } catch (error) {
      console.error('Error deleting service feature:', error);
      return false;
    }
  };

  // Highlight Functions (Mock Data)
  const addHighlight = async (formData) => {
    const newHighlight = {
      _id: Date.now().toString(),
      title: formData.title,
      description: formData.description
    };
    setServiceContent(prev => ({
      ...prev,
      highlights: [...prev.highlights, newHighlight]
    }));
    return true;
  };

  const createHighlight = async (formData) => {
    return addHighlight(formData);
  };

  const updateHighlight = async (id, formData) => {
    setServiceContent(prev => ({
      ...prev,
      highlights: prev.highlights.map(highlight => 
        highlight._id === id 
          ? { ...highlight, title: formData.title, description: formData.description }
          : highlight
      )
    }));
    return true;
  };

  const deleteHighlight = async (id) => {
    if (!window.confirm('Are you sure you want to delete this highlight?')) return false;
    
    setServiceContent(prev => ({
      ...prev,
      highlights: prev.highlights.filter(highlight => highlight._id !== id)
    }));
    return true;
  };

  // About Content Functions
  const createAboutSection = async (formData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/about/section`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        fetchContentData();
        return true;
      } else {
        console.error('Failed to create about section');
        return false;
      }
    } catch (error) {
      console.error('Error creating about section:', error);
      return false;
    }
  };

  const updateAboutSection = async (id, formData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/about/section/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        fetchContentData();
        return true;
      } else {
        console.error('Failed to update about section');
        return false;
      }
    } catch (error) {
      console.error('Error updating about section:', error);
      return false;
    }
  };

  const deleteAboutSection = async (id) => {
    if (!window.confirm('Are you sure you want to delete this section?')) return false;
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/about/section/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      if (response.ok) {
        fetchContentData();
        return true;
      } else {
        console.error('Failed to delete about section');
        return false;
      }
    } catch (error) {
      console.error('Error deleting about section:', error);
      return false;
    }
  };

  const updateAboutContent = async (formData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/about`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        fetchContentData();
        return true;
      } else {
        console.error('Failed to update about content');
        return false;
      }
    } catch (error) {
      console.error('Error updating about content:', error);
      return false;
    }
  };

  // Add default About sections
  const addDefaultAboutSections = async () => {
    const defaultSections = [
      {
        icon: 'bolt',
        title: 'All-in-One',
        description: 'Schedules and equipment in one place.'
      },
      {
        icon: 'shield',
        title: 'Secure',
        description: 'Data stays protected.'
      },
      {
        icon: 'cloud',
        title: 'Accessible',
        description: '24/7 cloud access.'
      },
      {
        icon: 'dollar',
        title: 'Affordable',
        description: 'Clear pricing.'
      }
    ];

    for (const section of defaultSections) {
      await createAboutSection(section);
    }
  };

  // FAQ Functions (Persist to backend)
  const createFAQ = async (formData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/faq`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        fetchContentData();
        return true;
      } else {
        console.error('Failed to create FAQ');
        return false;
      }
    } catch (error) {
      console.error('Error creating FAQ:', error);
      return false;
    }
  };

  const updateFAQ = async (id, formData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/faq/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        fetchContentData();
        return true;
      } else {
        console.error('Failed to update FAQ');
        return false;
      }
    } catch (error) {
      console.error('Error updating FAQ:', error);
      return false;
    }
  };

  const deleteFAQ = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return false;
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/faq/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (response.ok) {
        fetchContentData();
        return true;
      } else {
        console.error('Failed to delete FAQ');
        return false;
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      return false;
    }
  };

  const toggleFAQStatus = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/faq/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (response.ok) {
        fetchContentData();
        return true;
      } else {
        console.error('Failed to toggle FAQ status');
        return false;
      }
    } catch (error) {
      console.error('Error toggling FAQ status:', error);
      return false;
    }
  };

  // Terms Functions
  const addTermsSection = async (formData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/terms-and-conditions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        fetchContentData();
        return true;
      } else {
        console.error('Failed to create terms section');
        return false;
      }
    } catch (error) {
      console.error('Error creating terms section:', error);
      return false;
    }
  };

  const createTermsSection = async (formData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/terms/sections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        fetchContentData();
        return true;
      } else {
        console.error('Failed to create terms section');
        return false;
      }
    } catch (error) {
      console.error('Error creating terms section:', error);
      return false;
    }
  };

  const updateTermsSection = async (id, formData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/terms/sections/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        fetchContentData();
        return true;
      } else {
        console.error('Failed to update terms section');
        return false;
      }
    } catch (error) {
      console.error('Error updating terms section:', error);
      return false;
    }
  };

  const deleteTermsSection = async (id) => {
    if (!window.confirm('Are you sure you want to delete this terms section?')) return false;
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/terms/sections/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      if (response.ok) {
        fetchContentData();
        return true;
      } else {
        console.error('Failed to delete terms section');
        return false;
      }
    } catch (error) {
      console.error('Error deleting terms section:', error);
      return false;
    }
  };

  // Privacy Functions
  const createPrivacySection = async (formData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/privacy/sections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        fetchContentData();
        return true;
      } else {
        console.error('Failed to create privacy section');
        return false;
      }
    } catch (error) {
      console.error('Error creating privacy section:', error);
      return false;
    }
  };

  const updatePrivacySection = async (id, formData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/privacy/sections/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        fetchContentData();
        return true;
      } else {
        console.error('Failed to update privacy section');
        return false;
      }
    } catch (error) {
      console.error('Error updating privacy section:', error);
      return false;
    }
  };

  const deletePrivacySection = async (id) => {
    if (!window.confirm('Are you sure you want to delete this privacy section?')) return false;
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/privacy/sections/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      if (response.ok) {
        fetchContentData();
        return true;
      } else {
        console.error('Failed to delete privacy section');
        return false;
      }
    } catch (error) {
      console.error('Error deleting privacy section:', error);
      return false;
    }
  };

  const storeSeedData = useCallback(async () => {
    if (!user?.token) return;
    
    try {
        // Store seed packages data
        const seedPackagesData = [
          {
            name: "Complete Health Checkup Package",
            description: "Comprehensive health screening package including all major organ function tests, complete blood count, and vital health markers.",
            category: "Full Body Checkup",
            price: 2499,
            originalPrice: 3500,
            discount: 29,
            duration: "3 hours",
            preparation: "10-12 hours fasting required. Drink plenty of water.",
            sampleTypes: ["Blood", "Urine"],
            isActive: true,
            isPopular: true,
            isRecommended: true,
            tags: ["comprehensive", "full-body", "screening", "preventive"],
            includes: [
              "Complete Blood Count (CBC)",
              "Liver Function Test (LFT)",
              "Kidney Function Test (KFT)",
              "Lipid Profile",
              "Blood Sugar Fasting",
              "Thyroid Profile",
              "Urine Routine & Microscopy",
              "Doctor Consultation",
              "Report Analysis"
            ],
            benefits: [
              "Early detection of health issues",
              "Complete health assessment",
              "Preventive health screening",
              "Expert doctor consultation",
              "Comprehensive report analysis"
            ],
            suitableFor: [
              "Adults above 30 years",
              "Annual health checkup",
              "Preventive health screening",
              "Family health monitoring"
            ]
          },
          {
            name: "Diabetes Care Package",
            description: "Specialized package for diabetes monitoring and management including blood sugar tests, HbA1c, and related complications screening.",
            category: "Diabetes",
            price: 1299,
            originalPrice: 1800,
            discount: 28,
            duration: "2 hours",
            preparation: "8-12 hours fasting required for blood sugar test.",
            sampleTypes: ["Blood"],
            isActive: true,
            isPopular: true,
            isRecommended: false,
            tags: ["diabetes", "blood-sugar", "hba1c", "monitoring"],
            includes: [
              "Blood Sugar Fasting",
              "HbA1c (Glycated Hemoglobin)",
              "Lipid Profile",
              "Kidney Function Test",
              "Complete Blood Count",
              "Diabetes Consultation"
            ],
            benefits: [
              "Complete diabetes monitoring",
              "Long-term sugar control assessment",
              "Complication screening",
              "Specialized consultation"
            ],
            suitableFor: [
              "Known diabetes patients",
              "Pre-diabetes individuals",
              "Family history of diabetes",
              "Obese individuals"
            ]
          },
          {
            name: "Liver Health Package",
            description: "Comprehensive liver health assessment including liver function tests, hepatitis screening, and liver damage markers.",
            category: "Liver Health",
            price: 999,
            originalPrice: 1400,
            discount: 29,
            duration: "2 hours",
            preparation: "10-12 hours fasting required. Avoid alcohol for 24 hours.",
            sampleTypes: ["Blood"],
            isActive: true,
            isPopular: false,
            isRecommended: false,
            tags: ["liver", "hepatitis", "function", "detox"],
            includes: [
              "Liver Function Test (LFT)",
              "Complete Blood Count (CBC)",
              "Blood Sugar Fasting",
              "Liver Specialist Consultation"
            ],
            benefits: [
              "Complete liver function assessment",
              "Early detection of liver diseases",
              "Hepatitis screening",
              "Specialized consultation"
            ],
            suitableFor: [
              "Alcohol consumers",
              "Liver disease patients",
              "Medication users",
              "Obesity patients"
            ]
          },
          {
            name: "Kidney Health Package",
            description: "Specialized kidney health assessment including renal function tests, urine analysis, and electrolyte balance.",
            category: "Kidney Health",
            price: 899,
            originalPrice: 1200,
            discount: 25,
            duration: "2 hours",
            preparation: "Drink plenty of water. Avoid heavy exercise 24 hours before.",
            sampleTypes: ["Blood", "Urine"],
            isActive: true,
            isPopular: false,
            isRecommended: false,
            tags: ["kidney", "renal", "creatinine", "urine"],
            includes: [
              "Kidney Function Test (KFT)",
              "Complete Blood Count (CBC)",
              "Blood Sugar Fasting",
              "Urine Routine & Microscopy",
              "Nephrologist Consultation"
            ],
            benefits: [
              "Complete kidney function assessment",
              "Early detection of kidney diseases",
              "Urine analysis",
              "Specialized consultation"
            ],
            suitableFor: [
              "Hypertension patients",
              "Diabetes patients",
              "Kidney disease family history",
              "Elderly individuals"
            ]
          },
          {
            name: "Thyroid Care Package",
            description: "Complete thyroid assessment including T3, T4, TSH, and related antibodies for comprehensive thyroid health evaluation.",
            category: "Thyroid",
            price: 799,
            originalPrice: 1100,
            discount: 27,
            duration: "1 hour",
            preparation: "No special preparation required.",
            sampleTypes: ["Blood"],
            isActive: true,
            isPopular: true,
            isRecommended: false,
            tags: ["thyroid", "hormones", "tsh", "metabolism"],
            includes: [
              "Thyroid Profile (T3, T4, TSH)",
              "Complete Blood Count (CBC)",
              "Endocrinologist Consultation"
            ],
            benefits: [
              "Complete thyroid function assessment",
              "Hormone level evaluation",
              "Metabolism assessment",
              "Specialized consultation"
            ],
            suitableFor: [
              "Thyroid patients",
              "Women with hormonal issues",
              "Obesity patients",
              "Family history of thyroid disorders"
            ]
          },
          {
            name: "Heart Health Package",
            description: "Cardiovascular health assessment including lipid profile, cardiac markers, and risk factor evaluation.",
            category: "Heart Health",
            price: 1499,
            originalPrice: 2000,
            discount: 25,
            duration: "2 hours",
            preparation: "10-12 hours fasting required. Avoid heavy meals.",
            sampleTypes: ["Blood"],
            isActive: true,
            isPopular: false,
            isRecommended: true,
            tags: ["heart", "cardiac", "cholesterol", "lipids"],
            includes: [
              "Lipid Profile",
              "Complete Blood Count (CBC)",
              "Blood Sugar Fasting",
              "CRP (C-Reactive Protein)",
              "Kidney Function Test",
              "Cardiologist Consultation"
            ],
            benefits: [
              "Complete cardiac risk assessment",
              "Cholesterol evaluation",
              "Inflammation markers",
              "Specialized consultation"
            ],
            suitableFor: [
              "Heart disease patients",
              "High cholesterol individuals",
              "Hypertension patients",
              "Family history of heart disease"
            ]
          },
          {
            name: "Women's Health Package",
            description: "Comprehensive health screening specifically designed for women including hormonal balance, anemia screening, and vital health markers.",
            category: "Women Health",
            price: 1799,
            originalPrice: 2500,
            discount: 28,
            duration: "3 hours",
            preparation: "10-12 hours fasting required. Avoid hormonal medications if possible.",
            sampleTypes: ["Blood"],
            isActive: true,
            isPopular: true,
            isRecommended: false,
            tags: ["women", "hormones", "anemia", "preventive"],
            includes: [
              "Complete Blood Count (CBC)",
              "Thyroid Profile",
              "Lipid Profile",
              "Blood Sugar Fasting",
              "Kidney Function Test",
              "Vitamin D Test",
              "Gynecologist Consultation"
            ],
            benefits: [
              "Women-specific health assessment",
              "Hormonal balance evaluation",
              "Anemia screening",
              "Specialized consultation"
            ],
            suitableFor: [
              "Women above 25 years",
              "Pregnancy planning",
              "Menopausal women",
              "Women with hormonal issues"
            ]
          },
          {
            name: "Senior Citizen Package",
            description: "Comprehensive health package for elderly individuals focusing on age-related health concerns and preventive screening.",
            category: "Senior Citizen",
            price: 2999,
            originalPrice: 4000,
            discount: 25,
            duration: "4 hours",
            preparation: "10-12 hours fasting required. Bring medications list.",
            sampleTypes: ["Blood", "Urine"],
            isActive: true,
            isPopular: false,
            isRecommended: true,
            tags: ["senior", "elderly", "comprehensive", "age-related"],
            includes: [
              "Complete Blood Count (CBC)",
              "Liver Function Test (LFT)",
              "Kidney Function Test (KFT)",
              "Lipid Profile",
              "Blood Sugar Fasting",
              "Thyroid Profile",
              "Urine Routine & Microscopy",
              "Vitamin D Test",
              "CRP (C-Reactive Protein)",
              "Geriatric Specialist Consultation"
            ],
            benefits: [
              "Age-appropriate health screening",
              "Multiple organ function assessment",
              "Inflammation markers",
              "Specialized geriatric consultation"
            ],
            suitableFor: [
              "Adults above 60 years",
              "Elderly with chronic conditions",
              "Preventive health screening",
              "Medication monitoring"
            ]
          }
        ];

        // Store seed service content data
        const seedServiceData = {
          features: [
            {
              title: 'Laboratory Booking',
              description: 'Reserve chemistry, physics, biology, and computer labs with real-time availability.',
              iconKey: 'FlaskConical',
              order: 1,
              isActive: true
            },
            {
              title: 'Smart Scheduling',
              description: 'Avoid clashes with an intelligent calendar that respects classes, exams, and holidays.',
              iconKey: 'CalendarCheck',
              order: 2,
              isActive: true
            },
            {
              title: 'Role-Based Access',
              description: 'Separate views for students, faculty, and admins with the right level of control.',
              iconKey: 'Users2',
              order: 3,
              isActive: true
            },
            {
              title: 'Notifications & Reminders',
              description: 'Email or in-app reminders so you never miss an important lab session.',
              iconKey: 'BellRing',
              order: 4,
              isActive: true
            },
            {
              title: 'Usage Analytics',
              description: 'Understand lab usage patterns to plan resources and maintenance better.',
              iconKey: 'BarChart4',
              order: 5,
              isActive: true
            },
            {
              title: 'Anywhere Access',
              description: 'Responsive web app that works on mobile, tablet, and desktop.',
              iconKey: 'Globe',
              order: 6,
              isActive: true
            }
          ],
          highlights: [
            {
              title: 'Fast Booking',
              description: 'Book a lab in just a few clicks.',
              iconKey: 'Zap',
              order: 1,
              isActive: true
            },
            {
              title: 'Secure Platform',
              description: 'Protected data and controlled access.',
              iconKey: 'ShieldCheck',
              order: 2,
              isActive: true
            },
            {
              title: 'Clear History',
              description: 'Track past and upcoming reservations.',
              iconKey: 'Clock',
              order: 3,
              isActive: true
            },
            {
              title: 'Collaboration Ready',
              description: 'Share booking details with teams.',
              iconKey: 'Handshake',
              order: 4,
              isActive: true
            }
          ]
        };

        // Store packages data (only if not already exists)
        const existingPackagesResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/packages`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        
        if (existingPackagesResponse.ok) {
          const existingPackagesResult = await existingPackagesResponse.json();
          const existingPackages = existingPackagesResult.data || [];
          
          // Only insert packages if database is empty
          if (existingPackages.length === 0) {
            for (const packageData of seedPackagesData) {
              try {
                const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/packages`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                  },
                  body: JSON.stringify(packageData)
                });
                if (!response.ok) {
                  console.error('Failed to store package:', packageData.name);
                }
              } catch (error) {
                console.error('Error storing package:', error);
              }
            }
          }
        }

        // Store service features data (only if not already exists)
        const existingServiceContentResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/service-content`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        
        if (existingServiceContentResponse.ok) {
          const existingServiceResult = await existingServiceContentResponse.json();
          const existingServiceData = existingServiceResult.data || {};
          const existingFeatures = existingServiceData.features || [];
          const existingHighlights = existingServiceData.highlights || [];
          
          // Only insert service features if database is empty
          if (existingFeatures.length === 0) {
            for (const featureData of seedServiceData.features) {
              try {
                const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/service-content/features`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                  },
                  body: JSON.stringify(featureData)
                });
                if (!response.ok) {
                  console.error('Failed to store feature:', featureData.title);
                }
              } catch (error) {
                console.error('Error storing feature:', error);
              }
            }
          }
          
          // Only insert service highlights if database is empty
          if (existingHighlights.length === 0) {
            for (const highlightData of seedServiceData.highlights) {
              try {
                const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/service-content/highlights`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                  },
                  body: JSON.stringify(highlightData)
                });
                if (!response.ok) {
                  console.error('Failed to store highlight:', highlightData.title);
                }
              } catch (error) {
                console.error('Error storing highlight:', error);
              }
            }
          }
        }

        // Store seed terms data
        const seedTermsData = [
          {
            sectionNumber: 1,
            title: "Acceptance of Terms & Eligibility",
            content: `Legal Affirmation: By accessing the BookMyLab platform, you agree to be bound by this Agreement.\nEligibility Criteria: You must be 18+, minors require guardian supervision.\nEntire Agreement: These Terms, Privacy Policy, and Cookie Policy form the full agreement.\nRight to Amend: We may modify these terms, changes take effect upon posting.`,
            order: 0,
            isActive: true
          },
          {
            sectionNumber: 2,
            title: "User Accounts & Prohibited Conduct",
            content: `Registration Veracity: Provide accurate identity and medical information.\nAccount Custodianship: Keep credentials secure, avoid unsafe networks.\nAutomated Access: Scrapers/crawlers to extract data are prohibited.\nCommunity Standards: Do not transmit defamatory content or harvest partner data.`,
            order: 1,
            isActive: true
          },
          {
            sectionNumber: 3,
            title: "Booking & Sample Collection Protocols",
            content: `Booking Validity: Contract forms upon lab confirmation of dispatch.\nPre-Analytic Requirements: Fasting may be required for certain tests.\nHome Collection Access: Provide a safe, accessible environment.\nTurnaround Time (TAT) Estimates: may vary due to clinical factors.`,
            order: 2,
            isActive: true
          },
          {
            sectionNumber: 4,
            title: "Financial Terms & Refund Architecture",
            content: `Pricing Structure: Prices include taxes unless stated.\nPayment Gateway: Encrypted gateways, we do not store CVV/PIN.\nCancellation Window: Tiered refunds based on time.\nDispute Window: Report billing discrepancies within 14 days.`,
            order: 3,
            isActive: true
          },
          {
            sectionNumber: 5,
            title: "Data Sovereignty & Medical Privacy",
            content: `Clinical Data Usage: Labs act as Data Controllers, platform as Processor.\nHIPAA/GDPR Alignment: No health data sales for marketing.\nData Retention: Records retained per regulation.\nBreach Notification: Notify users/regulators within stipulated time.`,
            order: 4,
            isActive: true
          },
          {
            sectionNumber: 6,
            title: "Intellectual Property & Brand Assets",
            content: `Proprietary Rights: Code, graphics, branding owned by Company.\nLimited License: Personal, non-commercial use only.\nSoftware Integrity: No reverse engineering.\nUser Contributions: Feedback becomes Company property.`,
            order: 5,
            isActive: true
          },
          {
            sectionNumber: 7,
            title: "Limitation of Liability & Disclaimers",
            content: `Medical Disclaimer: Platform is facilitator, consult practitioners.\nExclusion of Warranties: Service provided as-is.\nIndemnification: You indemnify for violations/misuse.`,
            order: 6,
            isActive: true
          }
        ];

        // Store seed FAQ data
        const seedFAQData = [
          {
            question: 'How do I book a laboratory?',
            answer: 'You can book a laboratory through our online platform by selecting your desired lab, choosing an available time slot, and providing the necessary details. You can also book through our mobile app or contact our support team for assistance.',
            category: 'booking',
            order: 1,
            isActive: true
          },
          {
            question: 'Can I book multiple labs at the same time?',
            answer: 'Yes, you can book multiple labs simultaneously, subject to availability. Our system will show you all available time slots across different labs, allowing you to coordinate bookings efficiently.',
            category: 'booking',
            order: 2,
            isActive: true
          },
          {
            question: 'When can my sample be rejected?',
            answer: 'Samples may be rejected if they are improperly collected, contaminated, not stored at the correct temperature, or collected outside the specified time window. Following all pre-test instructions carefully helps ensure sample acceptance.',
            category: 'general',
            order: 3,
            isActive: true
          },
          {
            question: 'How can I create a user account on your platform?',
            answer: 'Creating an account is simple. Click on the "Sign Up" button, provide your basic information including email and phone number, verify your email, and set a secure password. The entire process takes less than 5 minutes.',
            category: 'account',
            order: 4,
            isActive: true
          },
          {
            question: 'Is my personal and medical data secure?',
            answer: 'Absolutely. We use industry-standard encryption and security measures to protect your data. Our platform complies with HIPAA and other privacy regulations, ensuring your personal and medical information remains confidential and secure.',
            category: 'security',
            order: 5,
            isActive: true
          },
          {
            question: 'Can I save my medical records on my account?',
            answer: 'Yes, you can securely store your medical records in your account. All records are encrypted and accessible only to you. You can also grant temporary access to healthcare providers when needed.',
            category: 'account',
            order: 6,
            isActive: true
          },
          {
            question: 'Can I add family members to my account?',
            answer: 'Yes, you can add family members to your account as dependents. This allows you to manage bookings and view results for your children, elderly parents, or other family members with their consent.',
            category: 'account',
            order: 7,
            isActive: true
          },
          {
            question: 'What should I do if I cannot log in to my account?',
            answer: 'If you cannot log in, first try resetting your password using the "Forgot Password" link. If issues persist, contact our support team at support@labbooking.com or call our helpline for immediate assistance.',
            category: 'technical',
            order: 8,
            isActive: true
          },
          {
            question: 'How long does it take to resolve a technical issue?',
            answer: 'Most technical issues are resolved within 24-48 hours. Critical issues affecting multiple users are prioritized and typically resolved within 4-6 hours. You can track your support ticket status online.',
            category: 'technical',
            order: 9,
            isActive: true
          },
          {
            question: 'Can my medical data be misused?',
            answer: 'No, your medical data cannot be misused. We have strict policies and technical safeguards in place. We never sell your data to third parties, and access is limited to authorized personnel for legitimate purposes only.',
            category: 'security',
            order: 10,
            isActive: true
          },
          {
            question: 'How can I know how my data is being used?',
            answer: 'You can view your data usage history in your account settings. We provide transparent logs of when your data is accessed and for what purpose. Our privacy policy clearly outlines all data usage practices.',
            category: 'security',
            order: 11,
            isActive: true
          },
          {
            question: 'Who can access my medical history and records?',
            answer: 'Only you and authorized healthcare providers with your explicit consent can access your medical records. Our staff can only access data necessary for providing services, and all access is logged and audited regularly.',
            category: 'security',
            order: 12,
            isActive: true
          },
          {
            question: 'Can I delete my account if I no longer want to use the service?',
            answer: 'Yes, you can delete your account at any time from your account settings. Upon deletion, your personal data will be removed from our active systems, though we may retain certain information as required by law or for legitimate business purposes.',
            category: 'account',
            order: 13,
            isActive: true
          }
        ];

        // Store terms data
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/terms`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
              },
              body: JSON.stringify({
                sections: seedTermsData,
                version: '1.0',
                lastUpdated: new Date().toISOString()
              })
            });
            if (!response.ok) {
              console.error('Failed to store terms data');
            }
          } catch (error) {
            console.error('Error storing terms data:', error);
          }

        // Store FAQ data (only if not already exists)
        const existingFAQsResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/faq/admin`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        
        if (existingFAQsResponse.ok) {
          const existingFAQsResult = await existingFAQsResponse.json();
          const existingFAQs = existingFAQsResult.data || [];
          
          // Only insert FAQs if database is empty
          if (existingFAQs.length === 0) {
            for (const faqData of seedFAQData) {
              try {
                const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/faq`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                  },
                  body: JSON.stringify(faqData)
                });
                if (!response.ok) {
                  console.error('Failed to store FAQ:', faqData.question);
                }
              } catch (error) {
                console.error('Error storing FAQ:', error);
              }
            }
          }
        }

        console.log('Seed data stored successfully');
      } catch (error) {
        console.error('Error storing seed data:', error);
      }
    }, [user]);

  // Auto-store seed data on component mount
  useEffect(() => {
    // Store seed data only once when component mounts
    const hasStoredData = sessionStorage.getItem('seedDataStored');
    if (!hasStoredData && user?.token) {
      storeSeedData();
      sessionStorage.setItem('seedDataStored', 'true');
    }
  }, [user]);

  useEffect(() => {
    // Debug: Log user object to see what's available
    console.log('Admin Dashboard - User object:', user);
    console.log('User token exists:', !!user?.token);
    console.log('User token length:', user?.token?.length || 0);
    console.log('User role:', user?.role);
    console.log('Is authenticated:', !!user && (user.emailVerified || user.isEmailVerified));
    
    // Since we're using ProtectedRoute, we can assume user is admin and authenticated
    // Only fetch data if user is authenticated and has token
    if (user?.token) {
      console.log('Fetching dashboard data...');
      fetchDashboardData();
      fetchContentData();
      fetchBookings();
      fetchFeedbacksAdmin();
      fetchContactsAdmin();
      // fetchUsers() will be called when registration tab is active
    } else {
      console.warn('No user token found - skipping API calls');
      // Redirect to login if no token
      navigate('/admin-login');
    }
  }, [user]);

  // Fetch tests when tests tab is active or filters change
  useEffect(() => {
    if (activeTab === 'tests' && user?.token) {
      fetchTests();
    }
  }, [activeTab, user]);

  // Fetch packages when packages tab is active or filters change
  useEffect(() => {
    if (activeTab === 'packages' && user?.token) {
      fetchPackages();
    }
  }, [activeTab, user]);

  // Fetch bookings when bookings tab is active
  useEffect(() => {
    if (activeTab === 'bookings' && user?.token) {
      fetchBookings();
    }
  }, [activeTab, user]);

  // Fetch feedbacks when feedback tab is active
  useEffect(() => {
    if (activeTab === 'feedback' && user?.token) {
      fetchFeedbacksAdmin();
    }
  }, [activeTab, user]);

  // Fetch contacts when contact tab is active
  useEffect(() => {
    if (activeTab === 'contact' && user?.token) {
      fetchContactsAdmin();
    }
  }, [activeTab, user]);

  // Fetch users when registration tab is active
  useEffect(() => {
    if (activeTab === 'registration' && user?.token) {
      fetchUsers();
    }
  }, [activeTab, user]);

  // Fetch content data when content tabs are active
  useEffect(() => {
    if ((activeTab === 'service-content' || activeTab === 'home-content' || activeTab === 'terms' || activeTab === 'privacy' || activeTab === 'faq' || activeTab === 'about') && user?.token) {
      fetchContentData();
    }
  }, [activeTab, user]);

  const handleApprove = async (id) => {
    try {
      console.log('Approving booking:', id);
      
      // Show loading state
      const originalBookings = [...bookings];
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking._id === id 
            ? { ...booking, adminStatus: 'approving' }
            : booking
        )
      );
      
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ adminStatus: 'approved' })
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();

      if (response.ok && responseData.success) {
        // Update local state with approved status
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking._id === id 
              ? { ...booking, adminStatus: 'approved' }
              : booking
          )
        );
        
        // Update stats
        const updatedBookings = bookings.map(booking => 
          booking._id === id 
            ? { ...booking, adminStatus: 'approved' }
            : booking
        );
        const pending = updatedBookings.filter(b => (b.adminStatus || '').toLowerCase() === 'pending').length;
        const approved = updatedBookings.filter(b => (b.adminStatus || '').toLowerCase() === 'approved').length;
        const rejected = updatedBookings.filter(b => (b.adminStatus || '').toLowerCase() === 'rejected').length;
        
        setStats(prev => ({
          ...prev,
          pendingBookings: pending,
          approvedBookings: approved,
          rejectedBookings: rejected
        }));
        
        // Show success message
        alert('Booking approved successfully! The lab technician can now access this booking.');
        console.log(`Booking ${id} approved successfully`);
        
        // Refresh bookings to ensure data consistency
        setTimeout(() => fetchBookings(), 1000);
      } else {
        // Revert on error
        setBookings(originalBookings);
        console.error('Failed to approve booking:', responseData);
        alert(`Failed to approve booking: ${responseData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error approving booking:', error);
      alert(`Error approving booking: ${error.message}`);
    }
  };

  const handleRejectWithReason = async (id, reason) => {
    if (!reason || reason.trim() === '') {
      alert('Please provide a reason for rejection.');
      return;
    }
    
    try {
      console.log('Rejecting booking:', id, 'with reason:', reason);
      
      // Show loading state
      const originalBookings = [...bookings];
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking._id === id 
            ? { ...booking, adminStatus: 'rejecting' }
            : booking
        )
      );
      
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ adminStatus: 'rejected', rejectionReason: reason.trim() })
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();

      if (response.ok && responseData.success) {
        // Update local state with rejected status
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking._id === id 
              ? { ...booking, adminStatus: 'rejected', rejectionReason: reason.trim() }
              : booking
          )
        );
        
        // Update stats
        const updatedBookings = bookings.map(booking => 
          booking._id === id 
            ? { ...booking, adminStatus: 'rejected', rejectionReason: reason.trim() }
            : booking
        );
        const pending = updatedBookings.filter(b => (b.adminStatus || '').toLowerCase() === 'pending').length;
        const approved = updatedBookings.filter(b => (b.adminStatus || '').toLowerCase() === 'approved').length;
        const rejected = updatedBookings.filter(b => (b.adminStatus || '').toLowerCase() === 'rejected').length;
        
        setStats(prev => ({
          ...prev,
          pendingBookings: pending,
          approvedBookings: approved,
          rejectedBookings: rejected
        }));
        
        // Show success message
        alert('Booking rejected successfully! The user will be notified.');
        console.log(`Booking ${id} rejected successfully`);
        
        // Refresh bookings to ensure data consistency
        setTimeout(() => fetchBookings(), 1000);
      } else {
        // Revert on error
        setBookings(originalBookings);
        console.error('Failed to reject booking:', responseData);
        alert(`Failed to reject booking: ${responseData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error rejecting booking:', error);
      alert(`Error rejecting booking: ${error.message}`);
    }
  };

  const updateFeedbackStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/feedback/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        fetchFeedbacksAdmin();
      } else {
        console.error('Failed to update feedback status');
      }
    } catch (error) {
      console.error('Error updating feedback status:', error);
    }
  };

  const markFeedbackAsReviewed = async (id) => {
    setFeedbacks(prevFeedbacks => 
      prevFeedbacks.map(f => 
        f._id === id 
          ? { ...f, status: 'reviewed' }
          : f
      )
    );
  };

  const markFeedbackAsResolved = async (id) => {
    setFeedbacks(prevFeedbacks => 
      prevFeedbacks.map(f => 
        f._id === id 
          ? { ...f, status: 'resolved' }
          : f
      )
    );
  };

  const deleteFeedback = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/feedback/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (response.ok) {
        fetchFeedbacksAdmin();
      } else {
        console.error('Failed to delete feedback');
      }
    } catch (error) {
      console.error('Error deleting feedback:', error);
    }
  };

  const deleteContact = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/contact/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (response.ok) {
        fetchContactsAdmin();
      } else {
        console.error('Failed to delete contact');
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const updateContactStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/contact/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        fetchContactsAdmin();
      } else {
        console.error('Failed to update contact status');
      }
    } catch (error) {
      console.error('Error updating contact status:', error);
    }
  };

  

  // Home Content Functions
  const createHomeWhyBookItem = async (itemData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/content/home/why-book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(itemData)
      });
      
      if (response.ok) {
        fetchContentData();
        return true;
      } else {
        console.error('Failed to create why book item');
        return false;
      }
    } catch (error) {
      console.error('Error creating why book item:', error);
      return false;
    }
  };

  const updateHomeWhyBookItem = async (id, itemData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/content/home/why-book/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(itemData)
      });
      
      if (response.ok) {
        fetchContentData();
        return true;
      } else {
        console.error('Failed to update why book item');
        return false;
      }
    } catch (error) {
      console.error('Error updating why book item:', error);
      return false;
    }
  };

  const deleteHomeWhyBookItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return false;
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/content/home/why-book/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      if (response.ok) {
        fetchContentData();
        return true;
      } else {
        console.error('Failed to delete why book item');
        return false;
      }
    } catch (error) {
      console.error('Error deleting why book item:', error);
      return false;
    }
  };

  const createHomeHowItWorksItem = async (itemData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/content/home/how-it-works`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(itemData)
      });
      
      if (response.ok) {
        fetchContentData();
        return true;
      } else {
        console.error('Failed to create how it works item');
        return false;
      }
    } catch (error) {
      console.error('Error creating how it works item:', error);
      return false;
    }
  };

  const updateHomeHowItWorksItem = async (id, itemData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/content/home/how-it-works/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(itemData)
      });
      
      if (response.ok) {
        fetchContentData();
        return true;
      } else {
        console.error('Failed to update how it works item');
        return false;
      }
    } catch (error) {
      console.error('Error updating how it works item:', error);
      return false;
    }
  };

  const deleteHomeHowItWorksItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this step?')) return false;
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/content/home/how-it-works/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      if (response.ok) {
        fetchContentData();
        return true;
      } else {
        console.error('Failed to delete how it works item');
        return false;
      }
    } catch (error) {
      console.error('Error deleting how it works item:', error);
      return false;
    }
  };

  // Form handling functions
  const handleWhyBookFormSubmit = async (e) => {
    e.preventDefault();
    let success = false;
    
    if (editingWhyBookItem) {
      success = await updateHomeWhyBookItem(editingWhyBookItem._id, whyBookFormData);
    } else {
      success = await createHomeWhyBookItem(whyBookFormData);
    }
    
    if (success) {
      resetWhyBookForm();
    } else {
      alert('Failed to save item. Please try again.');
    }
  };

  const handleHowItWorksFormSubmit = async (e) => {
    e.preventDefault();
    let success = false;
    
    if (editingHowItWorksItem) {
      success = await updateHomeHowItWorksItem(editingHowItWorksItem._id, howItWorksFormData);
    } else {
      success = await createHomeHowItWorksItem(howItWorksFormData);
    }
    
    if (success) {
      resetHowItWorksForm();
    } else {
      alert('Failed to save step. Please try again.');
    }
  };

  const resetWhyBookForm = () => {
    setWhyBookFormData({ title: '', desc: '', iconKey: 'Home' });
    setEditingWhyBookItem(null);
    setShowWhyBookForm(false);
  };

  const resetHowItWorksForm = () => {
    setHowItWorksFormData({ stepNumber: 1, title: '', desc: '', iconKey: 'CheckCircle' });
    setEditingHowItWorksItem(null);
    setShowHowItWorksForm(false);
  };

  const resetServiceForm = () => {
    setServiceFormData({ title: '', description: '', iconKey: 'FlaskConical' });
    setEditingServiceItem(null);
    setShowServiceForm(false);
  };

  const resetHighlightForm = () => {
    setHighlightFormData({ title: '', description: '', iconKey: 'Zap' });
    setEditingHighlightItem(null);
    setShowHighlightForm(false);
  };

  const switchToWhyBookTab = () => {
    setHomeContentSubTab('why-book');
    resetHowItWorksForm();
  };

  const switchToHowItWorksTab = () => {
    setHomeContentSubTab('how-it-works');
    resetWhyBookForm();
  };

  const switchToFeaturesTab = () => {
    setServiceContentSubTab('features');
    resetHighlightForm();
  };

  const switchToHighlightsTab = () => {
    setServiceContentSubTab('highlights');
    resetServiceForm();
  };

  const startEditWhyBookItem = (item) => {
    setEditingWhyBookItem(item);
    setWhyBookFormData({
      title: item.title,
      desc: item.desc || item.description,
      iconKey: item.iconKey
    });
    setShowWhyBookForm(true);
  };

  const startEditHowItWorksItem = (item) => {
    setEditingHowItWorksItem(item);
    setHowItWorksFormData({
      stepNumber: item.stepNumber || 1,
      title: item.title,
      desc: item.desc || item.description,
      iconKey: item.iconKey
    });
    setShowHowItWorksForm(true);
  };

  // FAQ Functions
  const createFAQItem = async (faqData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/faq`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(faqData)
      });
      
      if (response.ok) {
        fetchContentData();
        return true;
      }
    } catch (error) {
      console.error('Error creating FAQ item:', error);
    }
    return false;
  };

  const updateFAQItem = async (id, faqData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/faq/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(faqData)
      });
      
      if (response.ok) {
        fetchContentData();
        return true;
      }
    } catch (error) {
      console.error('Error updating FAQ item:', error);
    }
    return false;
  };

  const deleteFAQItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ item?')) return false;
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/faq/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      
      if (response.ok) {
        fetchContentData();
        return true;
      }
    } catch (error) {
      console.error('Error deleting FAQ item:', error);
    }
    return false;
  };

  // Privacy Policy Functions
  const updatePrivacyPolicy = async (policyData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/privacy-policy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(policyData)
      });
      
      if (response.ok) {
        fetchContentData();
        return true;
      }
    } catch (error) {
      console.error('Error updating privacy policy:', error);
    }
    return false;
  };

  // Terms & Conditions Functions
  const updateTermsConditions = async (termsData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/terms-and-conditions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(termsData)
      });
      
      if (response.ok) {
        fetchContentData();
        return true;
      }
    } catch (error) {
      console.error('Error updating terms & conditions:', error);
    }
    return false;
  };


  const handleLogout = (reason) => {
    logout();
    navigate("/admin-login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Header hideNavItems={true} />
      <div className="flex flex-1 container mx-auto px-4 py-8 gap-8">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden fixed top-20 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Sidebar */}
        <aside className={`${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative top-0 left-0 h-full md:h-auto w-64 bg-white md:bg-transparent border-r md:border-r-0 border-gray-200 md:border-none z-40 transition-transform duration-300 ease-in-out pt-20 md:pt-0`}>
          <div className="p-4 mb-4">
            <h2 className="text-xl font-bold" style={{ color: Theme.colors.primary }}>Admin Panel</h2>
            <p className="text-xs text-gray-500">Hospital Management</p>
          </div>
          <div className="flex flex-col gap-2 p-4 md:p-0">
            <SidebarItem id="registration" label="Registration" icon={LayoutDashboard} activeTab={activeTab} setActiveTab={setActiveTab} ChevronRight={ChevronRight} />
            <SidebarItem id="bookings" label="Lab Bookings" icon={ClipboardList} activeTab={activeTab} setActiveTab={setActiveTab} ChevronRight={ChevronRight} />
            <SidebarItem id="feedback" label="User Feedback" icon={MessageSquare} activeTab={activeTab} setActiveTab={setActiveTab} ChevronRight={ChevronRight} />
            <SidebarItem id="contact" label="Contact Requests" icon={PhoneCall} activeTab={activeTab} setActiveTab={setActiveTab} ChevronRight={ChevronRight} />
            
            <div className="border-t border-gray-200 my-2"></div>
            
            <SidebarItem id="tests" label="Test Management" icon={TestTube} activeTab={activeTab} setActiveTab={setActiveTab} ChevronRight={ChevronRight} />
            <SidebarItem id="packages" label="Package Management" icon={Package} activeTab={activeTab} setActiveTab={setActiveTab} ChevronRight={ChevronRight} />
            
            <div className="border-t border-gray-200 my-2"></div>
            
            <SidebarItem id="service-content" label="Service Content" icon={Globe} activeTab={activeTab} setActiveTab={setActiveTab} ChevronRight={ChevronRight} />
            <SidebarItem id="about" label="About Content" icon={FileText} activeTab={activeTab} setActiveTab={setActiveTab} ChevronRight={ChevronRight} />
            <SidebarItem id="home-content" label="Home Content" icon={Home} activeTab={activeTab} setActiveTab={setActiveTab} ChevronRight={ChevronRight} />
            <SidebarItem id="terms" label="Terms & Conditions" icon={FileText} activeTab={activeTab} setActiveTab={setActiveTab} ChevronRight={ChevronRight} />
            <SidebarItem id="privacy" label="Privacy Policy" icon={ShieldCheck} activeTab={activeTab} setActiveTab={setActiveTab} ChevronRight={ChevronRight} />
            <SidebarItem id="faq" label="FAQ Management" icon={HelpCircle} activeTab={activeTab} setActiveTab={setActiveTab} ChevronRight={ChevronRight} />
          </div>
        </aside>

        {/* Overlay for mobile */}
        {mobileMenuOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 md:ml-0 ml-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r p-6 border-b border-gray-100"
              style={{
                background: `linear-gradient(to right, ${Theme.colors.primary}, ${Theme.colors.secondary})`
              }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white capitalize">{activeTab}</h1>
                  <p className="text-white/80 text-sm mt-1">Manage your {activeTab} efficiently</p>
                </div>
                <div className="flex gap-3">
                  <CButton variant="secondary" onClick={fetchDashboardData} className="text-xs py-2 px-3 text-white border-white"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      borderColor: 'rgba(255, 255, 255, 0.3)'
                    }}
                  >
                    Refresh Data
                  </CButton>
                </div>
              </div>
            </div>

            <div className="p-4 md:p-6">
              {activeTab === "registration" && (
                <div className="space-y-6">
                  {/* User Statistics Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
                    <div className="p-6 rounded-xl border border-gray-100 bg-white shadow-sm">
                      <p className="text-gray-400 text-xs font-bold uppercase">Total Users</p>
                      <p className="text-3xl font-black mt-2" style={{ color: Theme.colors.primary }}>{usersLoading ? "..." : stats.totalUsers}</p>
                    </div>
                  </div>

                  {/* Users Table */}
                  <div className="overflow-x-auto">
                      {usersLoading ? (
                        <div className="text-center py-8">
                          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          <p className="mt-2 text-gray-500">Loading users...</p>
                        </div>
                      ) : getFilteredUsers().length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-gray-500">No users found matching your criteria.</p>
                        </div>
                      ) : (
                        <table className="w-full text-left">
                          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                            <tr>
                              <th className="p-4">User Details</th>
                              <th className="p-4">Role</th>
                              <th className="p-4">Email Verified</th>
                              <th className="p-4">Registration Date</th>
                              <th className="p-4">Last Login</th>
                              <th className="p-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {users.map((userItem) => (
                              <tr key={userItem._id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="p-4">
                                  <div>
                                    <div className="font-medium text-gray-900">{userItem.name || 'N/A'}</div>
                                    <div className="text-sm text-gray-500">{userItem.email || 'N/A'}</div>
                                    {userItem.phone && (
                                      <div className="text-xs text-gray-400">{userItem.phone}</div>
                                    )}
                                  </div>
                                </td>
                                <td className="p-4">
                                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                    userItem.role === 'admin' ? 'bg-emerald-100 text-emerald-800' :
                                    userItem.role === 'labtechnician' ? 'bg-blue-100 text-blue-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {userItem.role || 'user'}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                    userItem.emailVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {userItem.emailVerified ? 'Verified' : 'Not Verified'}
                                  </span>
                                </td>
                                <td className="p-4 text-sm">
                                  {userItem.createdAt ? new Date(userItem.createdAt).toLocaleDateString() : 'N/A'}
                                </td>
                                <td className="p-4 text-sm">
                                  {userItem.lastLogin ? new Date(userItem.lastLogin).toLocaleDateString() : 'Never'}
                                </td>
                                <td className="p-4 text-right">
                                  <button
                                    onClick={() => handleDeleteUser(userItem._id, userItem.name)}
                                    className="p-2 rounded-full text-red-600 hover:bg-red-50 transition-colors"
                                    title="Delete User"
                                    disabled={userItem.role === 'admin' && userItem._id === user._id}
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                </div>
              )}

              {activeTab === "bookings" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div 
                      className={`p-6 rounded-xl border shadow-sm cursor-pointer transition-all ${
                        bookingFilter === 'all' 
                          ? 'border-blue-500 bg-blue-50 shadow-md' 
                          : 'border-gray-100 bg-white hover:shadow-md'
                      }`}
                      onClick={() => setBookingFilter('all')}
                    >
                      <p className="text-gray-400 text-xs font-bold uppercase">Total Bookings</p>
                      <p className="text-3xl font-black mt-2" style={{ color: Theme.colors.primary }}>{loading ? "..." : stats.totalBookings}</p>
                    </div>
                    <div 
                      className={`p-6 rounded-xl border shadow-sm cursor-pointer transition-all ${
                        bookingFilter === 'pending' 
                          ? 'border-yellow-500 bg-yellow-50 shadow-md' 
                          : 'border-gray-100 bg-white hover:shadow-md'
                      }`}
                      onClick={() => setBookingFilter('pending')}
                    >
                      <p className="text-gray-400 text-xs font-bold uppercase">Pending Bookings</p>
                      <p className="text-3xl font-black mt-2" style={{ color: Theme.colors.yellow600 }}>{loading ? "..." : stats.pendingBookings}</p>
                    </div>
                    <div 
                      className={`p-6 rounded-xl border shadow-sm cursor-pointer transition-all ${
                        bookingFilter === 'approved' 
                          ? 'border-emerald-500 bg-emerald-50 shadow-md' 
                          : 'border-gray-100 bg-white hover:shadow-md'
                      }`}
                      onClick={() => setBookingFilter('approved')}
                    >
                      <p className="text-gray-400 text-xs font-bold uppercase">Approved Bookings</p>
                      <p className="text-3xl font-black mt-2" style={{ color: Theme.colors.emerald600 }}>{loading ? "..." : stats.approvedBookings}</p>
                    </div>
                  </div>
                  <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Lab Booking Management</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Filter:</span>
                        <span 
                          className="px-3 py-1 text-xs rounded-full font-medium"
                          style={{
                            backgroundColor: bookingFilter === 'all' ? Theme.colors.primary : Theme.colors.gray100,
                            color: bookingFilter === 'all' ? 'white' : Theme.colors.gray600
                          }}
                        >
                          {bookingFilter === 'all' ? 'All Bookings' : 
                           bookingFilter === 'pending' ? 'Pending Bookings' : 
                           'Approved Bookings'}
                        </span>
                      </div>
                    </div>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                          <tr>
                            <th className="p-4">User Details</th>
                            <th className="p-4">Lab/Service</th>
                            <th className="p-4">Date & Time</th>
                            <th className="p-4">Purpose</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookings
                            .filter(b => {
                              if (bookingFilter === 'all') return true;
                              if (bookingFilter === 'pending') return (b.adminStatus || '').toLowerCase() === 'pending';
                              if (bookingFilter === 'approved') return (b.adminStatus || '').toLowerCase() === 'approved';
                              return true;
                            })
                            .map((b) => (
                            <tr key={b._id || b.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="p-4 text-sm">
                                <div className="font-medium">{b.patientName || b.user?.name || 'Unknown User'}</div>
                                <div className="text-xs text-gray-500">{b.user?.email || 'No email'}</div>
                                {b.user?.phone && <div className="text-xs text-gray-500">{b.user.phone}</div>}
                              </td>
                              <td className="p-4 text-sm">
                                <div className="font-medium">{b.labName || b.labAppointment}</div>
                                <>
                                  {b.packageName && <div className="text-xs text-gray-500">{b.packageName}</div>}
                                  {b.packagePrice > 0 && <div className="text-xs font-semibold" style={{ color: Theme.colors.primary }}>₹{b.packagePrice}</div>}
                                </>
                              </td>
                              <td className="p-4 text-sm">
                                <div className="font-medium">{b.date}</div>
                                <div className="text-xs font-medium" style={{ color: Theme.colors.accentBlue }}>{b.time}</div>
                                <div className="text-xs text-gray-500">{b.duration}</div>
                              </td>
                              <td className="p-4 text-sm">
                                <div className="max-w-xs truncate" title={b.purpose}>
                                  {b.purpose}
                                </div>
                              </td>
                              <td className="p-4">
                                <span className={`px-2 py-1 text-xs rounded-full`}
                                  style={{
                                    backgroundColor: b.adminStatus === 'approved' ? Theme.colors.emerald100 : 
                                                   b.adminStatus === 'rejected' ? Theme.colors.red50 : Theme.colors.yellow50,
                                    color: b.adminStatus === 'approved' ? Theme.colors.emerald600 : 
                                           b.adminStatus === 'rejected' ? Theme.colors.red600 : Theme.colors.yellow600
                                  }}
                                >
                                  {b.adminStatus || 'pending'}
                                </span>
                                {b.rejectionReason && (
                                  <div className="text-xs mt-1" style={{ color: Theme.colors.red600 }} title={b.rejectionReason}>
                                    {b.rejectionReason.length > 20 ? b.rejectionReason.substring(0, 20) + '...' : b.rejectionReason}
                                  </div>
                                )}
                              </td>
                              <td className="p-4 text-right">
                                {b.adminStatus === 'pending' && (
                                  <div className="flex justify-end gap-2">
                                    <button 
                                      onClick={() => handleApprove(b._id || b.id)} 
                                      className="p-2 rounded-full transition-colors" 
                                      title="Approve"
                                      style={{
                                        color: Theme.colors.emerald600
                                      }}
                                      onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = Theme.colors.emerald50;
                                      }}
                                      onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = 'transparent';
                                      }}
                                    >
                                      <CheckCircle2 size={20}/>
                                    </button>
                                    <button 
                                      onClick={() => {
                                        const reason = prompt('Please enter rejection reason:');
                                        if (reason) {
                                          handleRejectWithReason(b._id || b.id, reason);
                                        }
                                      }} 
                                      className="p-2 rounded-full transition-colors" 
                                      title="Reject"
                                      style={{
                                        color: Theme.colors.red600
                                      }}
                                      onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = Theme.colors.red50;
                                      }}
                                      onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = 'transparent';
                                      }}
                                    >
                                      <XCircle size={20}/>
                                    </button>
                                  </div>
                                )}
                                {b.adminStatus === 'approved' && (
                                  <span className="text-sm font-medium" style={{ color: Theme.colors.emerald600 }}>Approved</span>
                                )}
                                {b.adminStatus === 'rejected' && (
                                  <span className="text-sm font-medium" style={{ color: Theme.colors.red600 }}>Rejected</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                      {bookings
                        .filter(b => {
                          if (bookingFilter === 'all') return true;
                          if (bookingFilter === 'pending') return (b.adminStatus || '').toLowerCase() === 'pending';
                          if (bookingFilter === 'approved') return (b.adminStatus || '').toLowerCase() === 'approved';
                          return true;
                        })
                        .map((b) => (
                        <div key={b._id || b.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg">{b.patientName || b.user?.name || 'Unknown'}</h4>
                              <p className="text-sm text-gray-600">{b.user?.email || 'No email'}</p>
                              {b.user?.phone && <p className="text-sm text-gray-600">{b.user.phone}</p>}
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full`}
                              style={{
                                backgroundColor: b.adminStatus === 'approved' ? Theme.colors.emerald100 : 
                                               b.adminStatus === 'rejected' ? Theme.colors.red50 : Theme.colors.yellow50,
                                color: b.adminStatus === 'approved' ? Theme.colors.emerald600 : 
                                       b.adminStatus === 'rejected' ? Theme.colors.red600 : Theme.colors.yellow600
                              }}
                            >
                              {b.adminStatus || 'pending'}
                            </span>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-gray-500">Lab: </span>
                              <span className="font-medium">{b.labName || b.labAppointment}</span>
                            </div>
                            {b.packageName && (
                              <div>
                                <span className="text-gray-500">Package: </span>
                                <span>{b.packageName}</span>
                              </div>
                            )}
                            {b.packagePrice > 0 && (
                              <div>
                                <span className="text-gray-500">Price: </span>
                                <span className="text-primary font-semibold">₹{b.packagePrice}</span>
                              </div>
                            )}
                            <div>
                              <span className="text-gray-500">Schedule: </span>
                              <span>{b.date} at {b.time} ({b.duration})</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Purpose: </span>
                              <span>{b.purpose}</span>
                            </div>
                            {b.rejectionReason && (
                              <div>
                                <span className="text-gray-500">Reason: </span>
                                <span style={{ color: Theme.colors.red600 }}>{b.rejectionReason}</span>
                              </div>
                            )}
                          </div>
                          {b.adminStatus === 'pending' && (
                            <div className="flex justify-end gap-2 mt-4">
                              <button 
                                onClick={() => handleApprove(b._id || b.id)} 
                                className="px-3 py-1 rounded-full text-sm transition-colors text-white"
                                style={{
                                  backgroundColor: Theme.colors.emerald600
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.backgroundColor = Theme.colors.emerald700;
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.backgroundColor = Theme.colors.emerald600;
                                }}
                              >
                                Approve
                              </button>
                              <button 
                                onClick={() => {
                                  const reason = prompt('Please enter rejection reason:');
                                  if (reason) {
                                    handleRejectWithReason(b._id || b.id, reason);
                                  }
                                }} 
                                className="px-3 py-1 rounded-full text-sm transition-colors text-white"
                                style={{
                                  backgroundColor: Theme.colors.red600
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.backgroundColor = Theme.colors.red700;
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.backgroundColor = Theme.colors.red600;
                                }}
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    {bookings.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No bookings found.
                      </div>
                    )}
                  </div>
                </div>
              )}

              

              {activeTab === "feedback" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="p-4 rounded-lg border"
                      style={{
                        backgroundColor: `${Theme.colors.primary}10`,
                        borderColor: `${Theme.colors.primary}30`
                      }}
                    >
                      <div className="text-2xl font-bold" style={{ color: Theme.colors.primary }}>{loading ? "..." : feedbackStats.totalFeedbacks}</div>
                      <div className="text-sm" style={{ color: Theme.colors.primary }}>Total Feedbacks</div>
                    </div>
                    <div className="p-4 rounded-lg border"
                      style={{
                        backgroundColor: Theme.colors.emerald50,
                        borderColor: Theme.colors.emerald100
                      }}
                    >
                      <div className="text-2xl font-bold" style={{ color: Theme.colors.emerald600 }}>{loading ? "..." : feedbackStats.reviewedFeedbacks}</div>
                      <div className="text-sm" style={{ color: Theme.colors.emerald600 }}>Reviewed</div>
                    </div>
                  </div>

                  {/* Filter buttons */}
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => setFeedbackFilter('all')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        feedbackFilter === 'all'
                          ? 'text-white'
                          : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                      }`}
                      style={{
                        backgroundColor: feedbackFilter === 'all' ? Theme.colors.primary : undefined
                      }}
                    >
                      All Feedbacks
                    </button>
                    <button
                      onClick={() => setFeedbackFilter('reviewed')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        feedbackFilter === 'reviewed'
                          ? 'text-white'
                          : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                      }`}
                      style={{
                        backgroundColor: feedbackFilter === 'reviewed' ? Theme.colors.emerald600 : undefined
                      }}
                    >
                      Reviewed
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="p-4">User Info</th>
                          <th className="p-4">Rating</th>
                          <th className="p-4">Feedback</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Date</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {feedbacks.filter(f => feedbackFilter === 'all' || f.status === feedbackFilter).map((f) => (
                          <tr key={f._id} className="border-b">
                            <td className="p-4">
                              <div className="font-bold">{f.user?.name || f.userName || 'Anonymous'}</div>
                              <div className="text-xs text-gray-400">{f.user?.email || f.userEmail || 'No email'}</div>
                              {f.user?.phone && <div className="text-xs text-gray-400">{f.user.phone}</div>}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-4 h-4 ${i < (f.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                  </svg>
                                ))}
                                <span className="ml-1 text-sm font-medium">{f.rating || 0}/5</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="max-w-xs">
                                <div className="font-medium text-sm mb-1">{f.subject || 'No subject'}</div>
                                <div className="text-xs text-gray-600 line-clamp-3" title={f.message}>
                                  {f.message || 'No message'}
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-1 text-xs rounded-full capitalize`}
                                style={{
                                  backgroundColor: f.status === 'pending' ? Theme.colors.yellow50 :
                                                 f.status === 'reviewed' ? Theme.colors.emerald50 : `${Theme.colors.secondary}20`,
                                  color: f.status === 'pending' ? Theme.colors.yellow600 :
                                         f.status === 'reviewed' ? Theme.colors.emerald600 : Theme.colors.primary
                                }}
                              >
                                {f.status || 'pending'}
                              </span>
                            </td>
                            <td className="p-4 text-xs text-gray-500">{new Date(f.createdAt || Date.now()).toLocaleDateString()}</td>
                            <td className="p-4 text-right">
                              <div className="flex gap-2 justify-end">
                                {f.status === 'pending' && (
                                  <CButton 
                                    variant="primary" 
                                    className="py-1 px-3 text-xs text-white border"
                                    style={{
                                      backgroundColor: Theme.colors.emerald600,
                                      borderColor: Theme.colors.emerald600
                                    }}
                                    onClick={() => markFeedbackAsReviewed(f._id)}
                                  >
                                    Mark Reviewed
                                  </CButton>
                                )}
                                {f.status === 'reviewed' && (
                                  <CButton 
                                    variant="outline" 
                                    className="py-1 px-3 text-xs border text-gray-600"
                                    style={{
                                      borderColor: '#e5e7eb',
                                      backgroundColor: 'transparent'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.target.style.backgroundColor = '#f9fafb';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.target.style.backgroundColor = 'transparent';
                                    }}
                                    onClick={() => updateFeedbackStatus(f._id, 'pending')}
                                  >
                                    Back to Pending
                                  </CButton>
                                )}
                                <CButton 
                                  variant="danger" 
                                  className="py-1 px-3 text-xs" 
                                  onClick={() => deleteFeedback(f._id)}
                                >
                                  Delete
                                </CButton>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {feedbacks.filter(f => feedbackFilter === 'all' || f.status === feedbackFilter).length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No {feedbackFilter === 'all' ? '' : feedbackFilter} feedback found.
                      </div>
                    )}
                  </div>
                </div>
              )}
                
              {activeTab === "contact" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div className="p-4 rounded-lg border"
                        style={{
                          backgroundColor: `${Theme.colors.primary}10`,
                          borderColor: `${Theme.colors.primary}30`
                        }}
                      >
                        <div className="text-2xl font-bold" style={{ color: Theme.colors.primary }}>{contacts.length}</div>
                        <div className="text-sm" style={{ color: Theme.colors.primary }}>Total Contacts</div>
                      </div>
                      <div className="p-4 rounded-lg border"
                        style={{
                          backgroundColor: Theme.colors.emerald50,
                          borderColor: Theme.colors.emerald100
                        }}
                      >
                        <div className="text-2xl font-bold" style={{ color: Theme.colors.emerald600 }}>{contacts.filter(c => c.status === 'reviewed').length}</div>
                        <div className="text-sm" style={{ color: Theme.colors.emerald600 }}>Reviewed</div>
                      </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="p-4">Contact Info</th>
                            <th className="p-4">Subject</th>
                            <th className="p-4">Message</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Date</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {contacts.map((c) => (
                            <tr key={c._id} className="border-b">
                              <td className="p-4">
                                <div className="font-bold">{c.name}</div>
                                <div className="text-xs text-gray-400">{c.email}</div>
                                {c.phone && <div className="text-xs text-gray-400">{c.phone}</div>}
                              </td>
                              <td className="p-4">
                                <div className="font-semibold" style={{ color: Theme.colors.primary }}>{c.subject}</div>
                              </td>
                              <td className="p-4">
                                <div className="text-xs max-w-xs truncate" title={c.message}>{c.message}</div>
                              </td>
                              <td className="p-4">
                                <span className={`px-2 py-1 text-xs rounded-full capitalize`}
                                  style={{
                                    backgroundColor: c.status === 'new' ? `${Theme.colors.secondary}20` :
                                                   c.status === 'reviewed' ? Theme.colors.emerald50 : `${Theme.colors.secondary}20`,
                                    color: c.status === 'new' ? Theme.colors.primary :
                                           c.status === 'reviewed' ? Theme.colors.emerald600 : Theme.colors.primary,
                                    borderColor: c.status === 'reviewed' ? Theme.colors.emerald600 : 'transparent'
                                  }}
                                >
                                  {c.status || 'new'}
                                </span>
                              </td>
                              <td className="p-4 text-xs text-gray-500">{new Date(c.createdAt || Date.now()).toLocaleDateString()}</td>
                              <td className="p-4 text-right">
                                <div className="flex gap-2 justify-end">
                                  {c.status === 'new' && (
                                    <CButton 
                                      variant="primary" 
                                      className="py-1 px-3 text-xs text-white border"
                                      style={{
                                        backgroundColor: Theme.colors.emerald600,
                                        borderColor: Theme.colors.emerald600
                                      }}
                                      onClick={() => updateContactStatus(c._id, 'reviewed')}
                                    >
                                      Mark as Reviewed
                                    </CButton>
                                  )}
                                  {/* Once marked as reviewed, status cannot be reverted */}
                                  <CButton 
                                    variant="danger" 
                                    className="py-1 px-3 text-xs" 
                                    onClick={() => deleteContact(c._id)}
                                  >
                                    Delete
                                  </CButton>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {contacts.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          No contact requests found.
                        </div>
                      )}
                    </div>
                  </div>
                )}

              {/* Test Management */}
              {activeTab === "tests" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Test Management</h3>
                      <p className="text-sm text-gray-600 mt-1">Manage laboratory tests and pricing</p>
                    </div>
                    <div className="flex justify-end">
                      <CButton
                        variant="primary"
                        fullWidth={false}
                        className="px-3 py-2 text-xs rounded-md"
                        onClick={() => setShowTestForm(true)}
                      >
                        <Plus size={14} className="mr-1" />
                        Add New Test
                      </CButton>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      {testLoading ? 'Loading...' : `${tests.length} tests found`}
                    </div>
                  </div>

                  {/* Tests Table */}
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto max-w-full">
                      <div className="min-w-[600px] lg:min-w-full">
                        <table className="w-full table-responsive-stack">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Icon</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">Name</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Price</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Sample Type</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Time</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">Lab</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {testLoading ? (
                            <tr>
                              <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                                Loading tests...
                              </td>
                            </tr>
                          ) : tests.length === 0 ? (
                            <tr>
                              <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                                No tests found
                              </td>
                            </tr>
                          ) : (
                            tests.map((test) => (
                              <tr key={test._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-3 py-3" data-label="Icon">
                                  <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                                    <TestTube size={16} className="text-gray-500" />
                                  </div>
                                </td>
                                <td className="px-3 py-3" data-label="Name">
                                  <div className="text-sm font-medium text-gray-900" title={test.name}>{test.name}</div>
                                  {test.description && (
                                    <div className="text-xs text-gray-500 mt-1 line-clamp-2" title={test.description}>{test.description}</div>
                                  )}
                                </td>
                                <td className="px-3 py-3 text-sm text-gray-900" data-label="Price">
                                  ₹{test.price}
                                </td>
                                <td className="px-3 py-3" data-label="Sample Type">
                                  <span className="inline-block px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full capitalize">
                                    {test.sampleType}
                                  </span>
                                </td>
                                <td className="px-3 py-3 text-sm text-gray-900" data-label="Time">
                                  {test.time}
                                </td>
                                <td className="px-3 py-3 text-sm text-gray-900" data-label="Lab">
                                  {test.labId?.name || 'N/A'}
                                </td>
                                <td className="px-3 py-3 text-sm font-medium" data-label="Actions">
                                  <div className="flex flex-col sm:flex-row gap-2">
                                    <button 
                                      className="text-green-600 hover:text-green-900 p-1"
                                      onClick={() => fetchTestDetails(test._id)}
                                      title="View Details"
                                    >
                                      <FileText size={16} />
                                    </button>
                                    <button 
                                      className="text-blue-600 hover:text-blue-900 p-1"
                                      onClick={() => {
                                        setEditingTest(test);
                                        setTestFormData({
                                          name: test.name || '',
                                          description: test.description || '',
                                          icon: test.icon || '',
                                          price: test.price?.toString() || '',
                                          sampleType: test.sampleType || 'blood',
                                          time: test.time || '',
                                          category: test.category || 'general',
                                          preTestRequirements: test.preTestRequirements || 'No specific requirements.'
                                        });
                                        setShowTestForm(true);
                                      }}
                                      title="Edit Test"
                                    >
                                      <Edit2 size={16} />
                                    </button>
                                    <button className="text-red-600 hover:text-red-900 p-1" onClick={() => handleDeleteTest(test._id)}>
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Package Management */}
              {activeTab === "packages" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Package Management</h3>
                      <p className="text-sm text-gray-600 mt-1">Manage test packages and bundles</p>
                    </div>
                    <div className="flex justify-end">
                      <CButton
                        variant="primary"
                        fullWidth={false}
                        className="px-3 py-2 text-xs rounded-md"
                        onClick={() => setShowPackageForm(true)}
                      >
                        <Plus size={14} className="mr-1" />
                        Add New Package
                      </CButton>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      {packageLoading ? 'Loading...' : `${packages.length} packages found`}
                    </div>
                  </div>

                  {/* Packages Table */}
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto max-w-full">
                      <div className="min-w-[700px] lg:min-w-full">
                        <table className="w-full table-responsive-stack">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Icon</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">Name</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Price</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Tests</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Time Duration</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Required Sample</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {packageLoading ? (
                            <tr>
                              <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                                Loading packages...
                              </td>
                            </tr>
                          ) : packages.length === 0 ? (
                            <tr>
                              <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                                No packages found
                              </td>
                            </tr>
                          ) : (
                            packages.map((pkg) => (
                              <tr key={pkg._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-3 py-3 whitespace-nowrap" data-label="Icon">
                                  <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                                    <Package size={16} className="text-gray-500" />
                                  </div>
                                </td>
                                <td className="px-3 py-3" data-label="Name">
                                  <div className="text-sm font-medium text-gray-900" title={pkg.name || pkg.title}>{pkg.name || pkg.title}</div>
                                  {pkg.description && (
                                    <div className="text-xs text-gray-500 mt-1 line-clamp-2" title={pkg.description}>{pkg.description}</div>
                                  )}
                                </td>
                                <td className="px-3 py-3 text-sm text-gray-900" data-label="Price">
                                  ₹{pkg.price}
                                  {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                                    <span className="text-xs text-gray-500 line-through ml-2">₹{pkg.originalPrice}</span>
                                  )}
                                </td>
                                <td className="px-3 py-3 text-sm text-gray-900" data-label="Tests">
                                  {pkg.tests || pkg.testsList?.length || pkg.includedTests?.length || 0} tests
                                </td>
                                <td className="px-3 py-3 text-sm text-gray-900" data-label="Time Duration">
                                  {pkg.timeDuration || pkg.reportTime || 'N/A'}
                                </td>
                                <td className="px-3 py-3" data-label="Required Sample">
                                  <span className="inline-block px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full capitalize">
                                    {pkg.requiredSample || 'N/A'}
                                  </span>
                                </td>
                                <td className="px-3 py-3 text-sm font-medium" data-label="Actions">
                                  <div className="flex flex-col sm:flex-row gap-2">
                                    <button 
                                      className="text-green-600 hover:text-green-900 p-1"
                                      onClick={() => fetchPackageDetails(pkg._id)}
                                      title="View Details"
                                    >
                                      <FileText size={16} />
                                    </button>
                                    <button 
                                      className="text-blue-600 hover:text-blue-900 p-1"
                                      onClick={() => {
                                        setEditingPackage(pkg);
                                        setPackageFormData({
                                          name: pkg.name || pkg.title || '',
                                          description: pkg.description || '',
                                          icon: pkg.icon || '',
                                          includedTests: pkg.includedTests || [],
                                          price: pkg.price?.toString() || '',
                                          timeDuration: pkg.timeDuration || pkg.reportTime || '',
                                          requiredSample: pkg.requiredSample || 'blood',
                                          category: pkg.category || 'general',
                                          fastingRequired: pkg.fastingRequired || false
                                        });
                                        setShowPackageForm(true);
                                      }}
                                      title="Edit Package"
                                    >
                                      <Edit2 size={16} />
                                    </button>
                                    <button className="text-red-600 hover:text-red-900 p-1" onClick={() => handleDeletePackage(pkg._id)}>
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Home Content Management */}
              {activeTab === "home-content" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Home Page Content Management</h3>
                      <p className="text-sm text-gray-600 mt-1">Manage homepage sections and content</p>
                    </div>
                    <div className="flex gap-2">
                    </div>
                  </div>
                  
                  {/* Sub-tabs Navigation */}
                  <div className="border-b border-gray-200">
                    <nav className="flex space-x-8">
                      <button
                        onClick={switchToWhyBookTab}
                        className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                          homeContentSubTab === 'why-book'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        Why Book With Us
                      </button>
                      <button
                        onClick={switchToHowItWorksTab}
                        className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                          homeContentSubTab === 'how-it-works'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        How It Works
                      </button>
                    </nav>
                  </div>

                  {/* Tab Content */}
                  <div className="mt-6">
                    {/* Why Book With Us Tab */}
                    {homeContentSubTab === 'why-book' && (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <h4 className="text-lg font-medium">Why Book With Us</h4>
                          <div className="flex justify-end">
                            <CButton 
                              variant="primary"
                              fullWidth={false}
                              className="px-3 py-2 text-xs rounded-md"
                              onClick={() => setShowWhyBookForm(true)}
                            >
                              <Plus size={14} className="mr-1" />
                              Add Item
                            </CButton>
                          </div>
                        </div>

                        {/* Why Book With Us Form */}
                        {showWhyBookForm && (
                          <div className="border rounded-lg p-6 bg-white shadow-sm">
                            <h5 className="font-semibold mb-4">
                              {editingWhyBookItem ? 'Edit Item' : 'Add New Item'}
                            </h5>
                            <form onSubmit={handleWhyBookFormSubmit} className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Icon
                                  </label>
                                  <select 
                                    value={whyBookFormData.iconKey}
                                    onChange={(e) => setWhyBookFormData(prev => ({ ...prev, iconKey: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  >
                                    <option value="Home">Home</option>
                                    <option value="CheckCircle">CheckCircle</option>
                                    <option value="Users">Users</option>
                                    <option value="FileText">FileText</option>
                                    <option value="Clock">Clock</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title
                                  </label>
                                  <input 
                                    type="text"
                                    value={whyBookFormData.title}
                                    onChange={(e) => setWhyBookFormData(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter title"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                  </label>
                                  <textarea 
                                    value={whyBookFormData.desc}
                                    onChange={(e) => setWhyBookFormData(prev => ({ ...prev, desc: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter description"
                                    rows="3"
                                    required
                                  />
                                </div>
                              </div>
                              <div className="flex gap-3">
                                <CButton type="submit" variant="primary">
                                  {editingWhyBookItem ? 'Update Item' : 'Add Item'}
                                </CButton>
                                <CButton type="button" variant="secondary" onClick={resetWhyBookForm}>
                                  Cancel
                                </CButton>
                              </div>
                            </form>
                          </div>
                        )}

                        {/* Why Book With Us Items List */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {homeContent.whyBook.map((item, index) => (
                            <div key={item._id || item.id || index} className="border rounded-lg p-4 bg-gray-50 hover:shadow-md transition-shadow">
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2">
                                  {(() => {
                                    const Icon = IconConfig[item.iconKey] || IconConfig.Home;
                                    return Icon ? <Icon size={20} className="text-primary" /> : <Home size={20} className="text-primary" />;
                                  })()}
                                  <h5 className="font-semibold text-sm">{item.title}</h5>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{item.desc || item.description}</p>
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => startEditWhyBookItem(item)}
                                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => deleteHomeWhyBookItem(item._id)}
                                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}
                          {homeContent.whyBook.length === 0 && (
                            <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
                              <p className="text-gray-500">No items added yet</p>
                              <div className="flex justify-end">
                                <CButton 
                                  variant="primary"
                                  fullWidth={false}
                                  className="px-3 py-2 text-xs rounded-md"
                                  onClick={() => setShowWhyBookForm(true)}
                                >
                                  <Plus size={14} className="mr-1" />
                                  Add Your First Item
                                </CButton>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* How It Works Tab */}
                    {homeContentSubTab === 'how-it-works' && (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <h4 className="text-lg font-medium">How It Works</h4>
                          <div className="flex justify-end">
                            <CButton 
                              variant="primary"
                              fullWidth={false}
                              className="px-3 py-2 text-xs rounded-md"
                              onClick={() => setShowHowItWorksForm(true)}
                            >
                              <Plus size={14} className="mr-1" />
                              Add Step
                            </CButton>
                          </div>
                        </div>

                        {/* How It Works Form */}
                        {showHowItWorksForm && (
                          <div className="border rounded-lg p-6 bg-white shadow-sm">
                            <h5 className="font-semibold mb-4">
                              {editingHowItWorksItem ? 'Edit Step' : 'Add New Step'}
                            </h5>
                            <form onSubmit={handleHowItWorksFormSubmit} className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Step Number
                                  </label>
                                  <input 
                                    type="number"
                                    min="1"
                                    value={howItWorksFormData.stepNumber}
                                    onChange={(e) => setHowItWorksFormData(prev => ({ ...prev, stepNumber: parseInt(e.target.value) || 1 }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter step number"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Icon
                                  </label>
                                  <select 
                                    value={howItWorksFormData.iconKey}
                                    onChange={(e) => setHowItWorksFormData(prev => ({ ...prev, iconKey: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  >
                                    <option value="Search">Search</option>
                                    <option value="CreditCard">CreditCard</option>
                                    <option value="Home">Home</option>
                                    <option value="FileText">FileText</option>
                                    <option value="CheckCircle">CheckCircle</option>
                                    <option value="Clock">Clock</option>
                                    <option value="Users">Users</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title
                                  </label>
                                  <input 
                                    type="text"
                                    value={howItWorksFormData.title}
                                    onChange={(e) => setHowItWorksFormData(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter title"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                  </label>
                                  <textarea 
                                    value={howItWorksFormData.desc}
                                    onChange={(e) => setHowItWorksFormData(prev => ({ ...prev, desc: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter description"
                                    rows="3"
                                    required
                                  />
                                </div>
                              </div>
                              <div className="flex gap-3">
                                <CButton type="submit" variant="primary">
                                  {editingHowItWorksItem ? 'Update Step' : 'Add Step'}
                                </CButton>
                                <CButton type="button" variant="secondary" onClick={resetHowItWorksForm}>
                                  Cancel
                                </CButton>
                              </div>
                            </form>
                          </div>
                        )}

                        {/* How It Works Items List */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {homeContent.howItWorks.map((item, index) => (
                            <div key={item._id || item.id || index} className="border rounded-lg p-4 bg-gray-50 hover:shadow-md transition-shadow">
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2">
                                  {(() => {
                                    const Icon = IconConfig[item.iconKey] || IconConfig.Home;
                                    return Icon ? <Icon size={20} className="text-primary" /> : <Home size={20} className="text-primary" />;
                                  })()}
                                  <h5 className="font-semibold text-sm">{item.title}</h5>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{item.desc || item.description}</p>
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => startEditHowItWorksItem(item)}
                                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => deleteHomeHowItWorksItem(item._id)}
                                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}
                          {homeContent.howItWorks.length === 0 && (
                            <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
                              <p className="text-gray-500">No steps added yet</p>
                              <div className="flex justify-end">
                                <CButton 
                                  variant="primary"
                                  fullWidth={false}
                                  className="px-3 py-2 text-xs rounded-md"
                                  onClick={() => setShowHowItWorksForm(true)}
                                >
                                  <Plus size={14} className="mr-1" />
                                  Add Your First Step
                                </CButton>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Service Content Management */}
              {activeTab === "service-content" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Service Content Management</h3>
                      <p className="text-sm text-gray-600 mt-1">Manage service features and highlights</p>
                    </div>
                  </div>

                  {/* Tabs Navigation */}
                  <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                      <button
                        onClick={switchToFeaturesTab}
                        className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                          serviceContentSubTab === 'features'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        Service Features
                      </button>
                      <button
                        onClick={switchToHighlightsTab}
                        className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                          serviceContentSubTab === 'highlights'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        Service Highlights
                      </button>
                    </nav>
                  </div>

                  {/* Tab Content */}
                  <div className="mt-6">
                    {/* Service Features Tab */}
                    {serviceContentSubTab === 'features' && (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <h4 className="text-lg font-medium">Service Features</h4>
                          <div className="flex justify-end">
                            <CButton 
                              variant="primary"
                              fullWidth={false}
                              className="px-3 py-2 text-xs rounded-md"
                              onClick={() => setShowServiceForm(true)}
                            >
                              <Plus size={14} className="mr-1" />
                              Add Feature
                            </CButton>
                          </div>
                        </div>

                        {/* Service Features Form */}
                        {showServiceForm && (
                          <div className="border rounded-lg p-6 bg-white shadow-sm">
                            <h5 className="font-semibold mb-4">
                              {editingServiceItem ? 'Edit Feature' : 'Add New Feature'}
                            </h5>
                            <form onSubmit={async (e) => {
                              e.preventDefault();
                              let success = false;
                              
                              if (editingServiceItem) {
                                success = await updateServiceFeature(editingServiceItem._id, serviceFormData);
                              } else {
                                success = await createServiceFeature(serviceFormData);
                              }
                              
                              if (success) {
                                resetServiceForm();
                              } else {
                                alert('Failed to save feature. Please try again.');
                              }
                            }}>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium mb-1">Title</label>
                                  <input
                                    type="text"
                                    value={serviceFormData.title}
                                    onChange={(e) => setServiceFormData(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full p-2 border rounded-lg"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-1">Icon Key</label>
                                  <select
                                    value={serviceFormData.iconKey}
                                    onChange={(e) => setServiceFormData(prev => ({ ...prev, iconKey: e.target.value }))}
                                    className="w-full p-2 border rounded-lg"
                                  >
                                    <option value="FlaskConical">FlaskConical</option>
                                    <option value="CalendarCheck">CalendarCheck</option>
                                    <option value="Users2">Users2</option>
                                    <option value="BellRing">BellRing</option>
                                    <option value="BarChart4">BarChart4</option>
                                    <option value="Globe">Globe</option>
                                  </select>
                                </div>
                              </div>
                              <div className="mt-4">
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                  value={serviceFormData.description}
                                  onChange={(e) => setServiceFormData(prev => ({ ...prev, description: e.target.value }))}
                                  className="w-full p-2 border rounded-lg"
                                  rows={3}
                                  required
                                />
                              </div>
                              <div className="flex gap-2 mt-4">
                                <CButton type="submit" variant="primary">
                                  {editingServiceItem ? 'Update' : 'Create'}
                                </CButton>
                                <CButton 
                                  type="button" 
                                  variant="outline" 
                                  onClick={resetServiceForm}
                                >
                                  Cancel
                                </CButton>
                              </div>
                            </form>
                          </div>
                        )}

                        {/* Service Features Items List */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {serviceContent.features.map((feature, index) => (
                            <div key={feature._id || feature.id || index} className="border rounded-lg p-4 bg-gray-50 hover:shadow-md transition-shadow">
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2">
                                  {(() => {
                                    const Icon = IconConfig[feature.iconKey] || IconConfig.FileText;
                                    return Icon ? <Icon size={20} className="text-primary" /> : <FileText size={20} className="text-primary" />;
                                  })()}
                                  <h5 className="font-semibold text-sm">{feature.title}</h5>
                                </div>
                                <div className={`w-2 h-2 rounded-full ${feature.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => {
                                    setEditingServiceItem(feature);
                                    setServiceFormData({
                                      title: feature.title,
                                      description: feature.description,
                                      iconKey: feature.iconKey
                                    });
                                    setShowServiceForm(true);
                                  }}
                                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => deleteServiceFeature(feature._id)}
                                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}
                          {serviceContent.features.length === 0 && (
                            <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
                              <p className="text-gray-500">No features added yet</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Service Highlights Tab */}
                    {serviceContentSubTab === 'highlights' && (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <h4 className="text-lg font-medium">Service Highlights</h4>
                          <div className="flex justify-end">
                            <CButton 
                              variant="primary"
                              fullWidth={false}
                              className="px-3 py-2 text-xs rounded-md"
                              onClick={() => setShowHighlightForm(true)}
                            >
                              <Plus size={14} className="mr-1" />
                              Add Highlight
                            </CButton>
                          </div>
                        </div>

                        {/* Service Highlights Form */}
                        {showHighlightForm && (
                          <div className="border rounded-lg p-6 bg-white shadow-sm">
                            <h5 className="font-semibold mb-4">
                              {editingHighlightItem ? 'Edit Highlight' : 'Add New Highlight'}
                            </h5>
                            <form onSubmit={async (e) => {
                              e.preventDefault();
                              let success = false;
                              
                              if (editingHighlightItem) {
                                success = await updateHighlight(editingHighlightItem._id, highlightFormData);
                              } else {
                                success = await createHighlight(highlightFormData);
                              }
                              
                              if (success) {
                                resetHighlightForm();
                              } else {
                                alert('Failed to save highlight. Please try again.');
                              }
                            }}>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium mb-1">Title</label>
                                  <input
                                    type="text"
                                    value={highlightFormData.title}
                                    onChange={(e) => setHighlightFormData(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full p-2 border rounded-lg"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-1">Icon Key</label>
                                  <select
                                    value={highlightFormData.iconKey}
                                    onChange={(e) => setHighlightFormData(prev => ({ ...prev, iconKey: e.target.value }))}
                                    className="w-full p-2 border rounded-lg"
                                  >
                                    <option value="Zap">Zap</option>
                                    <option value="ShieldCheck">ShieldCheck</option>
                                    <option value="Clock">Clock</option>
                                    <option value="Handshake">Handshake</option>
                                    <option value="Rocket">Rocket</option>
                                  </select>
                                </div>
                              </div>
                              <div className="mt-4">
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                  value={highlightFormData.description}
                                  onChange={(e) => setHighlightFormData(prev => ({ ...prev, description: e.target.value }))}
                                  className="w-full p-2 border rounded-lg"
                                  rows={3}
                                  required
                                />
                              </div>
                              <div className="flex gap-2 mt-4">
                                <CButton type="submit" variant="primary">
                                  {editingHighlightItem ? 'Update' : 'Create'}
                                </CButton>
                                <CButton 
                                  type="button" 
                                  variant="outline" 
                                  onClick={resetHighlightForm}
                                >
                                  Cancel
                                </CButton>
                              </div>
                            </form>
                          </div>
                        )}

                        {/* Service Highlights Items List */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {serviceContent.highlights.slice(0, 4).map((highlight, index) => (
                            <div key={highlight._id || highlight.id || index} className="border rounded-lg p-4 bg-gray-50 hover:shadow-md transition-shadow">
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2">
                                  {(() => {
                                    const Icon = IconConfig[highlight.iconKey] || IconConfig.Zap;
                                    return <Icon size={20} className="text-primary" />;
                                  })()}
                                  <h5 className="font-semibold text-sm">{highlight.title}</h5>
                                </div>
                                <div className={`w-2 h-2 rounded-full ${highlight.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{highlight.description}</p>
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => {
                                    setEditingHighlightItem(highlight);
                                    setHighlightFormData({
                                      title: highlight.title,
                                      description: highlight.description,
                                      iconKey: highlight.iconKey
                                    });
                                    setShowHighlightForm(true);
                                  }}
                                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => deleteHighlight(highlight._id)}
                                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}
                          {serviceContent.highlights.length === 0 && (
                            <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
                              <p className="text-gray-500">No highlights added yet</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* About Content Management */}
              {activeTab === "about" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">About Content Management</h3>
                      <p className="text-sm text-gray-600 mt-1">Manage about page content and sections</p>
                    </div>
                  </div>
                  
                  {/* Main Heading */}
                  <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-md font-medium">Main Heading</h4>
                      <div className="flex gap-2">
                        <CButton 
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newHeading = prompt('Enter main heading:', aboutContent.mainHeading);
                            if (newHeading && newHeading.trim()) {
                              updateAboutContent({
                                mainHeading: newHeading.trim(),
                                sections: aboutContent.sections
                              });
                            }
                          }}
                        >
                          <Edit2 size={14} className="mr-1" />
                          Edit Heading
                        </CButton>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded">
                      <p className="text-lg font-medium">{aboutContent.mainHeading || 'No heading set'}</p>
                    </div>
                  </div>

                  {/* About Sections */}
                  <div className="bg-white rounded-lg border">
                    <div className="flex items-center justify-between p-4 border-b">
                      <h4 className="text-md font-medium">About Sections</h4>
                      <CButton 
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setEditingAboutItem(null);
                          setAboutFormData({ icon: 'bolt', title: '', description: '' });
                          setShowAboutForm(true);
                        }}
                      >
                        <Plus size={14} className="mr-1" />
                        Add Section
                      </CButton>
                    </div>
                    
                    {showAboutForm && (
                      <div className="bg-gray-50 p-4 border-b">
                        <h5 className="font-medium mb-3">
                          {editingAboutItem ? 'Edit Section' : 'Add New Section'}
                        </h5>
                        <form onSubmit={async (e) => {
                          e.preventDefault();
                          let success = false;
                          
                          if (editingAboutItem) {
                            success = await updateAboutSection(editingAboutItem._id, aboutFormData);
                          } else {
                            success = await createAboutSection(aboutFormData);
                          }
                          
                          if (success) {
                            setShowAboutForm(false);
                            setEditingAboutItem(null);
                            setAboutFormData({ icon: 'bolt', title: '', description: '' });
                          } else {
                            alert('Failed to save section. Please try again.');
                          }
                        }}>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Icon</label>
                              <select
                                value={aboutFormData.icon}
                                onChange={(e) => setAboutFormData(prev => ({ ...prev, icon: e.target.value }))}
                                className="w-full p-2 border rounded-lg"
                                required
                              >
                                <option value="bolt">Bolt</option>
                                <option value="heart">Heart</option>
                                <option value="shield">Shield</option>
                                <option value="star">Star</option>
                                <option value="home">Home</option>
                                <option value="users">Users</option>
                                <option value="check">Check</option>
                                <option value="zap">Zap</option>
                                <option value="cloud">Cloud</option>
                                <option value="dollar">Dollar</option>
                              </select>
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium mb-1">Title</label>
                              <input
                                type="text"
                                value={aboutFormData.title}
                                onChange={(e) => setAboutFormData(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full p-2 border rounded-lg"
                                placeholder="Enter section title"
                                required
                              />
                            </div>
                          </div>
                          <div className="mt-4">
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                              value={aboutFormData.description}
                              onChange={(e) => setAboutFormData(prev => ({ ...prev, description: e.target.value }))}
                              className="w-full p-2 border rounded-lg"
                              rows={3}
                              placeholder="Enter section description"
                              required
                            />
                          </div>
                          <div className="flex gap-2 mt-4">
                            <CButton type="submit" variant="primary" size="sm">
                              {editingAboutItem ? 'Update' : 'Create'} Section
                            </CButton>
                            <CButton 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setShowAboutForm(false);
                                setEditingAboutItem(null);
                                setAboutFormData({ icon: 'bolt', title: '', description: '' });
                              }}
                            >
                              Cancel
                            </CButton>
                          </div>
                        </form>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
                      {aboutContent.sections && aboutContent.sections.length > 0 ? (
                        aboutContent.sections.map((section, index) => (
                          <div key={section._id || index} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  {section.icon === 'bolt' && <Zap size={16} className="text-blue-600" />}
                                  {section.icon === 'heart' && <span className="text-red-500">❤️</span>}
                                  {section.icon === 'shield' && <ShieldCheck size={16} className="text-green-600" />}
                                  {section.icon === 'star' && <span className="text-yellow-500">⭐</span>}
                                  {section.icon === 'home' && <Home size={16} className="text-purple-600" />}
                                  {section.icon === 'users' && <span className="text-blue-500">👥</span>}
                                  {section.icon === 'check' && <span className="text-green-500">✅</span>}
                                  {section.icon === 'zap' && <Zap size={16} className="text-yellow-600" />}
                                  {section.icon === 'cloud' && <Cloud size={16} className="text-blue-500" />}
                                  {section.icon === 'dollar' && <span className="text-green-600">💰</span>}
                                </div>
                                <h5 className="font-medium text-gray-900">{section.title}</h5>
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm mb-4 leading-relaxed">{section.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setEditingAboutItem(section);
                                    setAboutFormData({
                                      icon: section.icon || 'bolt',
                                      title: section.title,
                                      description: section.description
                                    });
                                    setShowAboutForm(true);
                                  }}
                                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                                >
                                  <Edit2 size={14} />
                                  Edit
                                </button>
                                <button
                                  onClick={() => deleteAboutSection(section._id)}
                                  className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1"
                                >
                                  <Trash2 size={14} />
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full p-8 text-center text-gray-500">
                          <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                          <p>No about sections found. Click "Add Section" to create your first section.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Terms & Conditions Management */}
              {activeTab === "terms" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Terms & Conditions Management</h3>
                      <p className="text-sm text-gray-600 mt-1">Manage terms and conditions sections</p>
                    </div>
                    <div className="flex gap-2">
                      <CButton 
                        variant="primary"
                        fullWidth={false}
                        className="px-3 py-2 text-xs rounded-md"
                        onClick={() => setShowTermsForm(true)}
                      >
                        <Plus size={14} className="mr-1" />
                        Add Section
                      </CButton>
                    </div>
                  </div>
                  
                  {showTermsForm && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h5 className="font-medium mb-3">
                        {editingTermsItem ? 'Edit Section' : 'Add New Section'}
                      </h5>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        if (editingTermsItem) {
                          updateTermsSection(editingTermsItem._id, termsFormData);
                        } else {
                          createTermsSection(termsFormData);
                        }
                        setShowTermsForm(false);
                        setEditingTermsItem(null);
                        setTermsFormData({ title: '', content: '', sectionNumber: 1 });
                      }}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Section Number</label>
                            <input
                              type="number"
                              value={termsFormData.sectionNumber}
                              onChange={(e) => setTermsFormData(prev => ({ ...prev, sectionNumber: parseInt(e.target.value) }))}
                              className="w-full p-2 border rounded-lg"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <input
                              type="text"
                              value={termsFormData.title}
                              onChange={(e) => setTermsFormData(prev => ({ ...prev, title: e.target.value }))}
                              className="w-full p-2 border rounded-lg"
                              required
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-1">Content</label>
                          <textarea
                            value={termsFormData.content}
                            onChange={(e) => setTermsFormData(prev => ({ ...prev, content: e.target.value }))}
                            className="w-full p-2 border rounded-lg"
                            rows={5}
                            required
                          />
                        </div>
                        <div className="flex gap-2 mt-4">
                          <CButton type="submit" variant="primary">
                            {editingTermsItem ? 'Update' : 'Create'}
                          </CButton>
                          <CButton 
                            type="button" 
                            variant="outline" 
                            onClick={() => {
                              setShowTermsForm(false);
                              setEditingTermsItem(null);
                              setTermsFormData({ title: '', content: '', sectionNumber: 1 });
                            }}
                          >
                            Cancel
                          </CButton>
                        </div>
                      </form>
                    </div>
                  )}
                  
                  {contentLoading ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Loading terms data...</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4">
                        {termsContent.sections.sort((a, b) => a.sectionNumber - b.sectionNumber).map((section, index) => (
                      <div key={section._id || section.id || index} className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-gray-500 font-medium">Order: {section.order || 0}</span>
                              <span className="text-xs text-gray-500 font-medium">Section: {section.sectionNumber}</span>
                            </div>
                            <h5 className="font-semibold">{section.title}</h5>
                          </div>
                          <div className={`w-2 h-2 rounded-full ${section.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                        </div>
                        <p className="text-sm text-gray-600 mb-3 whitespace-pre-wrap">{section.content}</p>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              setEditingTermsItem(section);
                              setTermsFormData({
                                title: section.title,
                                content: section.content,
                                sectionNumber: section.sectionNumber,
                                order: section.order || 0
                              });
                              setShowTermsForm(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => deleteTermsSection(section._id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                    {termsContent.sections.length === 0 && (
                      <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No sections added yet</p>
                      </div>
                    )}
                  </div>
                    </>
                  )}
                </div>
              )}

              {/* Privacy Policy Management */}
              {activeTab === "privacy" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Privacy Policy Management</h3>
                      <p className="text-sm text-gray-600 mt-1">Manage privacy policy sections and compliance</p>
                    </div>
                    <div className="flex gap-2">
                      <CButton 
                        variant="primary"
                        fullWidth={false}
                        className="px-3 py-2 text-xs rounded-md"
                        onClick={() => setShowPrivacyForm(true)}
                      >
                        <Plus size={14} className="mr-1" />
                        Add Section
                      </CButton>
                    </div>
                  </div>
                  
                  {showPrivacyForm && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h5 className="font-medium mb-3">
                        {editingPrivacyItem ? 'Edit Section' : 'Add New Section'}
                      </h5>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        if (editingPrivacyItem) {
                          updatePrivacySection(editingPrivacyItem._id, privacyFormData);
                        } else {
                          createPrivacySection(privacyFormData);
                        }
                        setShowPrivacyForm(false);
                        setEditingPrivacyItem(null);
                        setPrivacyFormData({ title: '', content: '', sectionNumber: 1 });
                      }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Section Number</label>
                            <input
                              type="number"
                              value={privacyFormData.sectionNumber}
                              onChange={(e) => setPrivacyFormData(prev => ({ ...prev, sectionNumber: parseInt(e.target.value) }))}
                              className="w-full p-2 border rounded-lg"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <input
                              type="text"
                              value={privacyFormData.title}
                              onChange={(e) => setPrivacyFormData(prev => ({ ...prev, title: e.target.value }))}
                              className="w-full p-2 border rounded-lg"
                              required
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-1">Content</label>
                          <textarea
                            value={privacyFormData.content}
                            onChange={(e) => setPrivacyFormData(prev => ({ ...prev, content: e.target.value }))}
                            className="w-full p-2 border rounded-lg"
                            rows={5}
                            required
                          />
                        </div>
                        <div className="flex gap-2 mt-4">
                          <CButton type="submit" variant="primary">
                            {editingPrivacyItem ? 'Update' : 'Create'}
                          </CButton>
                          <CButton 
                            type="button" 
                            variant="outline" 
                            onClick={() => {
                              setShowPrivacyForm(false);
                              setEditingPrivacyItem(null);
                              setPrivacyFormData({ title: '', content: '', sectionNumber: 1 });
                            }}
                          >
                            Cancel
                          </CButton>
                        </div>
                      </form>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    {privacyContent.sections.sort((a, b) => a.sectionNumber - b.sectionNumber).map((section, index) => (
                      <div key={section._id || section.id || index} className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h5 className="font-semibold">Section {section.sectionNumber}: {section.title}</h5>
                          </div>
                          <div className={`w-2 h-2 rounded-full ${section.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                        </div>
                        <p className="text-sm text-gray-600 mb-3 whitespace-pre-wrap">{section.content}</p>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              setEditingPrivacyItem(section);
                              setPrivacyFormData({
                                title: section.title,
                                content: section.content,
                                sectionNumber: section.sectionNumber
                              });
                              setShowPrivacyForm(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => deletePrivacySection(section._id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                    {privacyContent.sections.length === 0 && (
                      <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No sections added yet</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* FAQ Management */}
              {activeTab === "faq" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">FAQ Management</h3>
                      <p className="text-sm text-gray-600 mt-1">Manage frequently asked questions and answers</p>
                    </div>
                    <div className="flex gap-2">
                      <CButton 
                        variant="primary"
                        fullWidth={false}
                        className="px-3 py-2 text-xs rounded-md"
                        onClick={() => setShowFAQForm(true)}
                      >
                        <Plus size={14} className="mr-1" />
                        Add FAQ
                      </CButton>
                    </div>
                  </div>
                  
                  {/* FAQ List */}
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      {faqs?.length || 0} FAQs found
                    </div>
                  </div>
                  
                  {showFAQForm && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h5 className="font-medium mb-3">
                        {editingFAQItem ? 'Edit FAQ' : 'Add New FAQ'}
                      </h5>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        if (editingFAQItem) {
                          updateFAQ(editingFAQItem._id, faqFormData);
                        } else {
                          createFAQ(faqFormData);
                        }
                        setShowFAQForm(false);
                        setEditingFAQItem(null);
                        setFaqFormData({ question: '', answer: '', category: 'general', order: 0 });
                      }}>
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Question</label>
                            <input
                              type="text"
                              value={faqFormData.question}
                              onChange={(e) => setFaqFormData(prev => ({ ...prev, question: e.target.value }))}
                              className="w-full p-2 border rounded-lg"
                              required
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-1">Answer</label>
                          <textarea
                            value={faqFormData.answer}
                            onChange={(e) => setFaqFormData(prev => ({ ...prev, answer: e.target.value }))}
                            className="w-full p-2 border rounded-lg"
                            rows={4}
                            required
                          />
                        </div>
                        <div className="flex gap-2 mt-4">
                          <CButton type="submit" variant="primary">
                            {editingFAQItem ? 'Update' : 'Create'}
                          </CButton>
                          <CButton 
                            type="button" 
                            variant="outline" 
                            onClick={() => {
                              setShowFAQForm(false);
                              setEditingFAQItem(null);
                              setFaqFormData({ question: '', answer: '' });
                            }}
                          >
                            Cancel
                          </CButton>
                        </div>
                      </form>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    {faqs.map((faq) => (
                      <div key={faq._id} className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-gray-500 font-medium">Order: {faq.order || 0}</span>
                              <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                                {faq.category}
                              </span>
                            </div>
                            <h5 className="font-semibold text-sm">{faq.question}</h5>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${faq.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                            <button 
                              onClick={() => toggleFAQStatus(faq._id)}
                              className="text-yellow-600 hover:text-yellow-800 text-sm"
                            >
                              {faq.isActive ? 'Disable' : 'Enable'}
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{faq.answer}</p>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              setEditingFAQItem(faq);
                              setFaqFormData({
                                question: faq.question,
                                answer: faq.answer,
                                category: faq.category,
                                order: faq.order || 0
                              });
                              setShowFAQForm(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => deleteFAQ(faq._id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                    {faqs.length === 0 && (
                      <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No FAQs added yet</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </main>
      </div>
      {/* Footer hidden for admin users */}
      {/* <Footer /> */}

      {/* Test Form Modal */}
      {showTestForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingTest ? 'Edit Test' : 'Add New Test'}
            </h3>
            <form onSubmit={handleTestSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Test Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={testFormData.name}
                    onChange={(e) => setTestFormData({...testFormData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={testFormData.description}
                    onChange={(e) => setTestFormData({...testFormData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icon URL
                  </label>
                  <input
                    type="text"
                    value={testFormData.icon}
                    onChange={(e) => setTestFormData({...testFormData, icon: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter icon URL or icon name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price *
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={testFormData.price}
                    onChange={(e) => setTestFormData({...testFormData, price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sample Type *
                  </label>
                  <select
                    required
                    value={testFormData.sampleType}
                    onChange={(e) => setTestFormData({...testFormData, sampleType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="blood">Blood</option>
                    <option value="urine">Urine</option>
                    <option value="swab">Swab</option>
                    <option value="saliva">Saliva</option>
                    <option value="stool">Stool</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time Duration *
                  </label>
                  <input
                    type="text"
                    required
                    value={testFormData.time}
                    onChange={(e) => setTestFormData({...testFormData, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 24 hours, 2-3 days"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={testFormData.category}
                    onChange={(e) => setTestFormData({...testFormData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <CButton type="submit" variant="primary">
                  {editingTest ? 'Update' : 'Create'} Test
                </CButton>
                <CButton 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowTestForm(false);
                    setEditingTest(null);
                    setTestFormData({
                      name: '',
                      description: '',
                      icon: '',
                      price: '',
                      sampleType: 'blood',
                      time: '',
                      category: 'general',
                      preTestRequirements: 'No specific requirements.'
                    });
                  }}
                >
                  Cancel
                </CButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Package Form Modal */}
      {showPackageForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingPackage ? 'Edit Package' : 'Add New Package'}
            </h3>
            <form onSubmit={handlePackageSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Package Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={packageFormData.name}
                    onChange={(e) => setPackageFormData({...packageFormData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={packageFormData.description}
                    onChange={(e) => setPackageFormData({...packageFormData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icon URL
                  </label>
                  <input
                    type="text"
                    value={packageFormData.icon}
                    onChange={(e) => setPackageFormData({...packageFormData, icon: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter icon URL or icon name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Included Tests
                  </label>
                  <textarea
                    value={packageFormData.includedTests.join('\n')}
                    onChange={(e) => setPackageFormData({...packageFormData, includedTests: e.target.value.split('\n').filter(test => test.trim())})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter each test on a new line"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price *
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={packageFormData.price}
                    onChange={(e) => setPackageFormData({...packageFormData, price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time Duration *
                  </label>
                  <input
                    type="text"
                    required
                    value={packageFormData.timeDuration}
                    onChange={(e) => setPackageFormData({...packageFormData, timeDuration: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 24 hours, 2-3 days"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Required Sample *
                  </label>
                  <select
                    required
                    value={packageFormData.requiredSample}
                    onChange={(e) => setPackageFormData({...packageFormData, requiredSample: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="blood">Blood</option>
                    <option value="urine">Urine</option>
                    <option value="swab">Swab</option>
                    <option value="saliva">Saliva</option>
                    <option value="stool">Stool</option>
                    <option value="mixed">Mixed</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={packageFormData.category}
                    onChange={(e) => setPackageFormData({...packageFormData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={packageFormData.fastingRequired}
                    onChange={(e) => setPackageFormData({...packageFormData, fastingRequired: e.target.checked})}
                    className="mr-2"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Fasting Required
                  </label>
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <CButton type="submit" variant="primary">
                  {editingPackage ? 'Update' : 'Create'} Package
                </CButton>
                <CButton 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowPackageForm(false);
                    setEditingPackage(null);
                    setPackageFormData({
                      name: '',
                      description: '',
                      icon: '',
                      includedTests: [],
                      price: '',
                      timeDuration: '',
                      requiredSample: 'blood',
                      category: 'general',
                      fastingRequired: false
                    });
                  }}
                >
                  Cancel
                </CButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Test Details Display */}
      {Object.keys(testDetails).length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Test Details</h3>
              <div className="flex gap-2">
                {!editingTestDetails && (
                  <button 
                    onClick={() => {
                      const testId = Object.keys(testDetails)[0];
                      const details = testDetails[testId];
                      setTestDetailsFormData({
                        testName: details.testName || '',
                        requiredSamples: details.requiredSamples || [],
                        reportingTime: details.reportingTime || ''
                      });
                      setEditingTestDetails(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 p-1"
                    title="Edit Details"
                  >
                    <Edit2 size={16} />
                  </button>
                )}
                <button 
                  onClick={() => {
                    setTestDetails({});
                    setEditingTestDetails(false);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            {Object.entries(testDetails).map(([testId, details]) => (
              <div key={testId} className="space-y-4">
                {editingTestDetails ? (
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    const success = await updateTestDetails(testId, testDetailsFormData);
                    if (success) {
                      setEditingTestDetails(false);
                    }
                  }}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Test Name</label>
                        <input
                          type="text"
                          value={testDetailsFormData.testName}
                          onChange={(e) => setTestDetailsFormData(prev => ({ ...prev, testName: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Required Samples (comma-separated)</label>
                        <input
                          type="text"
                          value={testDetailsFormData.requiredSamples.join(', ')}
                          onChange={(e) => setTestDetailsFormData(prev => ({ 
                            ...prev, 
                            requiredSamples: e.target.value.split(',').map(s => s.trim()).filter(s => s) 
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="blood, urine, saliva"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reporting Time</label>
                        <input
                          type="text"
                          value={testDetailsFormData.reportingTime}
                          onChange={(e) => setTestDetailsFormData(prev => ({ ...prev, reportingTime: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="24-48 hours"
                        />
                      </div>
                      <div className="flex gap-2">
                        <CButton type="submit" variant="primary">
                          Save Changes
                        </CButton>
                        <CButton 
                          type="button" 
                          variant="outline" 
                          onClick={() => setEditingTestDetails(false)}
                        >
                          Cancel
                        </CButton>
                      </div>
                    </div>
                  </form>
                ) : (
                  <>
                    <div>
                      <h4 className="font-medium text-gray-900">Test Name</h4>
                      <p className="text-gray-600">{details.testName}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Required Samples</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {details.requiredSamples.map((sample, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {sample}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Reporting Time</h4>
                      <p className="text-gray-600">{details.reportingTime}</p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Package Details Display */}
      {Object.keys(packageDetails).length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Package Details</h3>
              <div className="flex gap-2">
                {!editingPackageDetails && (
                  <button 
                    onClick={() => {
                      const packageId = Object.keys(packageDetails)[0];
                      const details = packageDetails[packageId];
                      setPackageDetailsFormData({
                        packageName: details.packageName || '',
                        requiredSamples: details.requiredSamples || [],
                        reportingTime: details.reportingTime || '',
                        includedTests: details.includedTests || []
                      });
                      setEditingPackageDetails(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 p-1"
                    title="Edit Details"
                  >
                    <Edit2 size={16} />
                  </button>
                )}
                <button 
                  onClick={() => {
                    setPackageDetails({});
                    setEditingPackageDetails(false);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            {Object.entries(packageDetails).map(([packageId, details]) => (
              <div key={packageId} className="space-y-4">
                {editingPackageDetails ? (
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    const success = await updatePackageDetails(packageId, packageDetailsFormData);
                    if (success) {
                      setEditingPackageDetails(false);
                    }
                  }}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Package Name</label>
                        <input
                          type="text"
                          value={packageDetailsFormData.packageName}
                          onChange={(e) => setPackageDetailsFormData(prev => ({ ...prev, packageName: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Required Samples (comma-separated)</label>
                        <input
                          type="text"
                          value={packageDetailsFormData.requiredSamples.join(', ')}
                          onChange={(e) => setPackageDetailsFormData(prev => ({ 
                            ...prev, 
                            requiredSamples: e.target.value.split(',').map(s => s.trim()).filter(s => s) 
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="blood, urine, saliva"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reporting Time</label>
                        <input
                          type="text"
                          value={packageDetailsFormData.reportingTime}
                          onChange={(e) => setPackageDetailsFormData(prev => ({ ...prev, reportingTime: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="24-48 hours"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Included Tests (JSON format)</label>
                        <textarea
                          value={JSON.stringify(packageDetailsFormData.includedTests, null, 2)}
                          onChange={(e) => {
                            try {
                              const parsed = JSON.parse(e.target.value);
                              setPackageDetailsFormData(prev => ({ ...prev, includedTests: parsed }));
                            } catch (err) {
                              // Invalid JSON, don't update state
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 font-mono text-sm"
                          placeholder='[{"name": "Test Name", "description": "Test Description"}]'
                        />
                      </div>
                      <div className="flex gap-2">
                        <CButton type="submit" variant="primary">
                          Save Changes
                        </CButton>
                        <CButton 
                          type="button" 
                          variant="outline" 
                          onClick={() => setEditingPackageDetails(false)}
                        >
                          Cancel
                        </CButton>
                      </div>
                    </div>
                  </form>
                ) : (
                  <>
                    <div>
                      <h4 className="font-medium text-gray-900">Package Name</h4>
                      <p className="text-gray-600">{details.packageName}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Required Samples</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {details.requiredSamples.map((sample, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {sample}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Reporting Time</h4>
                      <p className="text-gray-600">{details.reportingTime}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Included Tests</h4>
                      {details.includedTests && details.includedTests.length > 0 ? (
                        <ul className="mt-1 space-y-1">
                          {details.includedTests.map((test, index) => (
                            <li key={index} className="text-gray-600 flex items-start">
                              <span className="text-blue-500 mr-2">•</span>
                              <div>
                                <span className="font-medium">{test.name}</span>
                                {test.description && (
                                  <p className="text-sm text-gray-500">{test.description}</p>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 mt-1">No tests included</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
