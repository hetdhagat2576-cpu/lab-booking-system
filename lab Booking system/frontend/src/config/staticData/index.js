// Static credentials for Admin and Lab Technician
export const adminCredentials = {
    email: "admin@labbooking.com",
    password: "admin123",
    role: "admin",
    name: "System Administrator"
};

export const labTechnicianCredentials = {
    email: "labtech@labbooking.com",
    password: "labtech123",
    role: "labtechnician",
    name: "Lab Technician"
};

// Array format for easy access
export const staticCredentials = [
    {
        id: 1,
        email: "admin@labbooking.com",
        password: "admin123",
        role: "admin",
        name: "System Administrator"
    },
    {
        id: 2,
        email: "labtech@labbooking.com",
        password: "labtech123",
        role: "labtechnician",
        name: "Lab Technician"
    }
];

// Role options for login selection page
export const roleOptions = [
    {
        id: 1,
        title: "Admin",
        description: "System Administrator Access",
        route: "/admin-login",
        primaryColor: "primary",
        lightColor: "secondary"
    },
    {
        id: 2,
        title: "Lab Technician",
        description: "Laboratory Technician Portal",
        route: "/lab-technician-login",
        primaryColor: "primary",
        lightColor: "secondary"
    },
    {
        id: 3,
        title: "User",
        description: "Regular User Login",
        route: "/user-login",
        primaryColor: "primary",
        lightColor: "secondary"
    }
];

// Real data only - using backend API

// Fake booking functions removed - using real backend API

// Hospital Lab Appointments for booking form
export const labNames = [
    "City General Hospital Lab Appointment",
    "Metro Hospital Lab Appointment",
    "Regional Medical Center Lab Appointment",
    "Community Health Lab Appointment",
    "University Hospital Lab Appointment",
    "Premium Care Lab Appointment",
    "Wellness Center Lab Appointment",
    "Central Diagnostic Lab Appointment"
];

// Duration options for booking
export const durationOptions = [
    "30 mins",
    "1 hour",
    "1.5 hours",
    "2 hours",
    "2.5 hours",
    "3 hours",
    "4 hours",
    "Half Day",
    "Full Day"
];

// Time slots for booking
export const timeSlots = [
    "8:00 AM",
    "8:30 AM",
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
    "5:00 PM",
    "5:30 PM",
    "6:00 PM"
];


//this is diabetes packages
export const DIABETES_PACKAGES = [
  { 
    id: 1, 
    title: "Diabetes Care Package", 
    tests: 28, 
    price: 799, 
    originalPrice: 1299, 
    discount: 38, 
    fastingRequired: true, 
    reportTime: "10 Hrs" 
  },
  { 
    id: 2, 
    title: "HbA1c (Glycated Hemoglobin)", 
    tests: 1, 
    price: 399, 
    originalPrice: 600, 
    discount: 33, 
    fastingRequired: false, 
    reportTime: "6 Hrs" 
  }
];

// this is fever packages 
export const FEVER_PACKAGES = [
  { 
    id: 1, 
    title: "Monsoon Fever Package", 
    tests: 31, 
    price: 899, 
    originalPrice: 1599, 
    discount: 44, 
    fastingRequired: true, 
    reportTime: "12 Hrs" 
  }
];

// this is fullbodycheckups file
export const FULL_BODY_PACKAGES = [
  {
    id: 1,
    title: "Comprehensive Plus Full Body Checkup with Vitamin D B12 & Electrolytes",
    tests: 55,
    price: 1249,
    originalPrice: 2199,
    discount: 43,
    fastingRequired: true,
    reportTime: "15 Hrs"
  },
  {
    id: 2,
    title: "Senior Citizen Health Checkup",
    tests: 79,
    price: 3099,
    originalPrice: 4599,
    discount: 33,
    fastingRequired: true,
    reportTime: "24 Hrs"
  }
];
// this is kidney packages 
export const KIDNEY_HEALTH_PACKAGES = [
  {
    id: 1,
    title: "Kidney Function Test (KFT) - Complete",
    tests: 14,
    price: 799,
    originalPrice: 1199,
    discount: 33,
    fastingRequired: true,
    reportTime: "12 Hrs"
  },
  {
    id: 2,
    title: "Comprehensive Renal Profile (with Urine ACR)",
    tests: 15,
    price: 699,
    originalPrice: 999,
    discount: 30,
    fastingRequired: true,
    reportTime: "10 Hrs"
  }
];

// this is liver packages 
export const LIVER_HEALTH_PACKAGES = [
  {
      id: 1,
      title: "Liver Function Test (LFT) - Complete",
      tests: 15,
      price: 599,
      originalPrice: 899,
      discount: 33,
      fastingRequired: true,
      reportTime: "12 Hrs"
    },
    {
      id: 2,
      title: "Comprehensive Liver Care & Hepatitis Screening",
      tests: 21,
      price: 1299,
      originalPrice: 1899,
      discount: 31,
      fastingRequired: true,
      reportTime: "15 Hrs"
    }
];

// this is lungs packages
export const LUNG_HEALTH_PACKAGES = [
  { 
    id: 1, 
    title: "Lung Function Test - Complete Profile", 
    tests: 12, 
    price: 699, 
    originalPrice: 999, 
    discount: 30, 
    fastingRequired: false, 
    reportTime: "10 Hrs" 
  },
  { 
    id: 2, 
    title: "Respiratory Health Screening (Smoker's Health)", 
    tests: 18, 
    price: 899, 
    originalPrice: 1299, 
    discount: 31, 
    fastingRequired: false, 
    reportTime: "12 Hrs" 
  }
];

//this is thyroid packages
export const THYROID_HEALTH_PACKAGES = [
  { 
    id: 1, 
    title: "Thyroid Profile Total (T3, T4, TSH)", 
    tests: 3, 
    price: 599, 
    originalPrice: 999, 
    discount: 40, 
    fastingRequired: false, 
    reportTime: "8 Hrs" 
  },
  { 
    id: 2, 
    title: "Basic Thyroid Function Test", 
    tests: 2, 
    price: 599, 
    originalPrice: 999, 
    discount: 40, 
    fastingRequired: false, 
    reportTime: "8 Hrs" 
  }
];

// Women's health packages removed

export const PAGE_SECTIONS = {
  healthPackages: {
    id: "healthPackages",
    title: "Health Packages",
    items: [
      { key: "diabetes", title: "Diabetes Management", route: "/health-packages/diabetes", iconKey: "Droplets" },
      { key: "fever", title: "Fever & Viral", route: "/health-packages/fever", iconKey: "Activity" },
      { key: "fullBodyCheckups", title: "Full Body Checkups", route: "/health-packages/full-body-checkups", iconKey: "Stethoscope" },
      { key: "kidney", title: "Kidney Health", route: "/health-packages/kidney", iconKey: "Droplets" },
      { key: "liver", title: "Liver Health", route: "/health-packages/liver", iconKey: "FlaskConical" },
      { key: "lungs", title: "Lung Health", route: "/health-packages/lungs", iconKey: "Activity" },
      { key: "thyroid", title: "Thyroid Health", route: "/health-packages/thyroid", iconKey: "FlaskConical" }
    ]
  },
  infoPages: {
    id: "infoPages",
    title: "Information Pages",
    items: [
      { key: "privacyPolicy", title: "Privacy Policy", route: "/privacy-policy", iconKey: "ShieldCheck" },
      { key: "termsCondition", title: "Terms & Condition", route: "/terms-condition", iconKey: "Scale" },
      { key: "contactUs", title: "Contact Us", route: "/contact-us", iconKey: "HelpCircle" }
    ]
  }
};

export const TERMS_SECTIONS = [
  {
    id: 1,
    iconKey: "FileText",
    title: "1. Acceptance of Terms",
    content: [
      "By accessing and using BookMyLab, you accept and agree to be bound by the terms and provision of this agreement.",
      "If you do not agree to abide by the above, please do not use this service."
    ]
  },
  {
    id: 2,
    iconKey: "UserCircle",
    title: "2. User Accounts",
    content: [
      "Registration: You must provide accurate, complete, and up-to-date information.",
      "Account Security: You are responsible for maintaining the confidentiality of your account credentials.",
      "Age Requirement: You must be at least 18 years old to create an account.",
      "Prohibited Activities: Unauthorized use of the platform is strictly prohibited."
    ]
  },
  {
    id: 3,
    iconKey: "CalendarClock",
    title: "3. Booking and Appointments",
    content: [
      "Booking Process: Lab bookings must be made through the official platform.",
      "Payment: Full payment is required at the time of booking.",
      "Cancellation: Cancellations must be made at least 24 hours before the appointment.",
      "Rescheduling: Changes to appointments are subject to availability."
    ]
  },
  {
    id: 4,
    iconKey: "CreditCard",
    title: "4. Payment Terms",
    content: [
      "Payment Methods: We accept credit/debit cards, net banking, and digital wallets.",
      "Refund Policy: Refunds are processed within 7-10 business days.",
      "Price Changes: Prices are subject to change without prior notice.",
      "Billing Disputes: Any billing disputes must be reported within 48 hours."
    ]
  },
  {
    id: 5,
    iconKey: "ShieldAlert",
    title: "5. Privacy and Data Protection",
    content: [
      "Data Collection: We collect only necessary personal and medical information.",
      "Data Usage: Your data is used solely for providing lab services.",
      "Data Security: We implement industry-standard security measures.",
      "Third-Party Sharing: We do not sell your personal information to third parties."
    ]
  },
  {
    id: 6,
    iconKey: "Lock",
    title: "6. Confidentiality",
    content: [
      "Medical Records: All medical information is kept strictly confidential.",
      "Access Control: Only authorized personnel can access your medical data.",
      "Legal Compliance: We comply with all applicable medical privacy laws.",
      "Data Breach: You will be notified promptly in case of any data breach."
    ]
  },
  {
    id: 7,
    iconKey: "Scale",
    title: "7. Liability and Disclaimers",
    content: [
      "Medical Advice: Our platform does not provide medical advice.",
      "Test Results: Test results should be interpreted by qualified healthcare professionals.",
      "Service Availability: We do not guarantee uninterrupted service availability.",
      "Limitation of Liability: Our liability is limited to the amount paid for the service."
    ]
  },
  {
    id: 8,
    iconKey: "AlertTriangle",
    title: "8. Medical Disclaimer",
    content: [
      "Emergency Services: This platform is not for emergency medical services.",
      "Professional Consultation: Always consult with healthcare professionals for medical advice.",
      "Test Interpretation: Lab test results require professional medical interpretation.",
      "Treatment Decisions: Do not make treatment decisions based solely on test results."
    ]
  },
  {
    id: 9,
    iconKey: "FileText",
    title: "9. Intellectual Property",
    content: [
      "Content Ownership: All content on this platform is owned by BookMyLab.",
      "Usage Rights: Users are granted limited, non-exclusive rights to use the service.",
      "Copyright: All materials are protected by copyright laws.",
      "Trademark: BookMyLab and related marks are our trademarks."
    ]
  },
  {
    id: 10,
    iconKey: "Users",
    title: "10. User Responsibilities",
    content: [
      "Accurate Information: Provide accurate health and contact information.",
      "Follow Guidelines: Adhere to all preparation instructions for tests.",
      "Timely Arrival: Arrive on time for scheduled appointments.",
      "Feedback: Provide constructive feedback to improve our services."
    ]
  },
  {
    id: 11,
    iconKey: "MessageSquare",
    title: "11. Communication",
    content: [
      "Email Notifications: We may send important service-related emails.",
      "SMS Alerts: Appointment reminders and updates via SMS.",
      "Customer Support: Available through multiple channels for assistance.",
      "Language: All communications are primarily in English."
    ]
  },
  {
    id: 12,
    iconKey: "Globe",
    title: "12. Service Modifications",
    content: [
      "Service Updates: We reserve the right to modify or discontinue services.",
      "Feature Changes: New features may be added or existing ones modified.",
      "Platform Maintenance: Scheduled maintenance may temporarily affect services.",
      "User Notification: Major changes will be communicated in advance."
    ]
  },
  {
    id: 13,
    iconKey: "Scale",
    title: "13. Dispute Resolution",
    content: [
      "Governing Law: These terms are governed by applicable state laws.",
      "Arbitration: Disputes will be resolved through binding arbitration.",
      "Jurisdiction: Courts of appropriate jurisdiction will have exclusive authority.",
      "Legal Costs: Each party bears their own legal costs unless otherwise determined."
    ]
  },
  {
    id: 14,
    iconKey: "AlertCircle",
    title: "14. Termination",
    content: [
      "User Termination: You may terminate your account at any time.",
      "Platform Termination: We may suspend or terminate accounts for violations.",
      "Effect of Termination: Some provisions survive termination.",
      "Data Retention: We may retain certain data as required by law."
    ]
  },
  {
    id: 15,
    iconKey: "FileText",
    title: "15. General Provisions",
    content: [
      "Entire Agreement: These terms constitute the entire agreement between parties.",
      "Severability: If any provision is invalid, remaining terms remain in effect.",
      "Waiver: Failure to enforce a provision does not waive our rights.",
      "Updates: We may update these terms periodically with user notification."
    ]
  }
];

export const PRIVACY_POLICY_SECTIONS = [
  {
    id: 1,
    iconKey: "Lock",
    title: "01. Data Protection & Security",
    content: [
      "AES-256 at rest and TLS 1.3 in transit.",
      "Regular penetration tests and vulnerability assessments.",
      "Strong access controls and audit trails."
    ]
  },
  {
    id: 2,
    iconKey: "Eye",
    title: "02. Information Collection & Usage",
    content: [
      "Collected for account, booking, and personalization.",
      "Examples: Name, email, ID, department, preferences, device info."
    ]
  },
  {
    id: 3,
    iconKey: "HardDrive",
    title: "03. Log Data & Analytics",
    content: [
      "IP, browser version, pages visited, timestamps, duration.",
      "Used to monitor performance and improve service."
    ]
  },
  {
    id: 4,
    iconKey: "FileText",
    title: "04. Cookies & Tracking Technologies",
    content: [
      "Authentication, session management, analytics.",
      "You can refuse cookies; some features may be unavailable."
    ]
  },
  {
    id: 5,
    iconKey: "Clock",
    title: "05. Data Retention Policy",
    content: [
      "Retain as necessary for requested services and legal obligations.",
      "Typical retention with anonymization or deletion thereafter."
    ]
  },
  {
    id: 6,
    iconKey: "Share2",
    title: "06. Third-Party Sharing & Disclosure",
    content: [
      "No sale of PII; trusted partners operate under confidentiality.",
      "Release when legally required or to protect rights/safety."
    ]
  },
  {
    id: 7,
    iconKey: "Trash2",
    title: "07. Your Data Rights (GDPR/CCPA)",
    content: [
      "Access, rectification, erasure, restrict processing, object, portability.",
      "Contact DPO to exercise rights."
    ]
  },
  {
    id: 8,
    iconKey: "Users",
    title: "08. Children's Privacy",
    content: [
      "No intentional collection from under 13 without consent.",
      "Remove data if collected without verification."
    ]
  },
  {
    id: 9,
    iconKey: "AlertCircle",
    title: "09. Changes to This Privacy Policy",
    content: [
      "Notify via page, email, and prominent notice.",
      "Review periodically; effective upon posting."
    ]
  }
];

export const SERVICES = [
  { iconKey: "FlaskConical", title: "Laboratory Booking", desc: "Reserve chemistry, physics, biology, and computer labs with real-time availability." },
  { iconKey: "CalendarRange", title: "Smart Scheduling", desc: "Avoid clashes with an intelligent calendar that respects classes, exams, and holidays." },
  { iconKey: "Users2", title: "Role-Based Access", desc: "Separate views for students, faculty, and admins with the right level of control." },
  { iconKey: "BellRing", title: "Notifications & Reminders", desc: "Email or in-app reminders so you never miss an important lab session." },
  { iconKey: "BarChart4", title: "Usage Analytics", desc: "Understand lab usage patterns to plan resources and maintenance better." },
  { iconKey: "Globe", title: "Anywhere Access", desc: "Responsive web app that works on mobile, tablet, and desktop." }
];

export const SERVICE_FEATURES = [
  { iconKey: "Zap", title: "Fast Booking", desc: "Book a lab in just a few clicks." },
  { iconKey: "ShieldCheck", title: "Secure Platform", desc: "Protected data and controlled access." },
  { iconKey: "ClipboardList", title: "Clear History", desc: "Track past and upcoming reservations." },
  { iconKey: "Handshake", title: "Collaboration Ready", desc: "Share booking details with teams." }
];

export const BOOKING_BENEFITS = [
  { iconKey: "Zap", title: "Instant Booking", desc: "Book a lab in just a few clicks with smart validation." },
  { iconKey: "Calendar", title: "Clash-Free Schedule", desc: "Pick available slots only, reducing overlap." },
  { iconKey: "Bell", title: "Reminders", desc: "Get reminders before your session." },
  { iconKey: "BarChart3", title: "Clear History", desc: "View all your past and upcoming bookings." }
];

export const NEW_BOOKING_PACKAGES = {
  1: { title: "Comprehensive Plus Full Body Checkup", price: 1249 },
  2: { title: "Comprehensive Full Body Checkup Test", price: 1499 },
  3: { title: "Senior Citizen Health Checkup", price: 3099 },
  4: { title: "Complete Health Checkup - Basic", price: 899 },
  5: { title: "Advanced Full Body Checkup", price: 2499 },
  6: { title: "Executive Health Checkup Package", price: 1899 },
  7: { title: "Women's Health Checkup", price: 1699 },
  8: { title: "Cardiac Health Checkup", price: 1299 },
  9: { title: "Diabetes Care Package", price: 799 },
  10: { title: "Thyroid Function Test Package", price: 599 },
  11: { title: "Monsoon Fever Package", price: 899 },
  12: { title: "Cancer Screening Package", price: 3499 }
};

export const HOME_WHY_BOOK = [
  { iconKey: "Truck", title: "Home Sample Collection", desc: "Free and timely sample pickup by certified professionals." },
  { iconKey: "Award", title: "Certified Labs", desc: "ISO & NABL certified laboratories for accurate results." },
  { iconKey: "CircleDollarSign", title: "Best Prices", desc: "Compare labs and save up to 70% on test bookings." },
  { iconKey: "Smartphone", title: "Digital Reports", desc: "View and share your reports anytime, anywhere." }
];

export const HOME_HOW_IT_WORKS = [
  { iconKey: "TestTube2", title: "Select Test", desc: "Choose from a wide range of diagnostic tests." },
  { iconKey: "CalendarDays", title: "Book Slot", desc: "Select your preferred date and time easily." },
  { iconKey: "FileText", title: "Get Reports", desc: "Receive secure digital reports online." }
];

export const DASHBOARD_HEALTH_CONCERNS = [
  { id: "liver", title: "Liver", iconKey: "FlaskConical", description: "Liver function tests" },
  { id: "lungs", title: "Lungs", iconKey: "Activity", description: "Respiratory health screening" },
  { id: "kidney", title: "Kidney", iconKey: "Droplets", description: "Kidney function tests" },
  { id: "fever", title: "Fever", iconKey: "Droplets", description: "Fever and infection tests" },
  { id: "thyroid", title: "Thyroid", iconKey: "FlaskConical", description: "Thyroid function tests" },
  { id: "diabetes", title: "Diabetes", iconKey: "Droplets", description: "Blood sugar monitoring" }
];

export const LAB_TECH_STATS_META = [
  { key: "todayTests", iconKey: "CalendarCheck", title: "Today's Tests", desc: "Scheduled appointments", bgColor: "bg-primary/10" },
  { key: "inProgress", iconKey: "Clock", title: "In Progress", desc: "Currently processing", bgColor: "bg-secondary/30" },
  { key: "completed", iconKey: "CheckCircle2", title: "Completed", desc: "Tests finished today", bgColor: "bg-secondary/10" },
  { key: "pending", iconKey: "AlertCircle", title: "Pending", desc: "Awaiting action", bgColor: "bg-yellow-50" }
];

export const LAB_TECH_QUICK_ACTIONS = [
  { iconKey: "FileText", title: "View Reports", desc: "Check test results", route: "/history" },
  { iconKey: "Users", title: "Profile", desc: "Manage your account", route: "/lab-technician-profile" }
];

// Admin dashboard stats card meta
export const ADMIN_STATS_META = [
  { key: "totalBookings", iconKey: "FileText", title: "Total Bookings", bgColor: "bg-primary/10", iconColor: "text-primary" },
  { key: "pendingBookings", iconKey: "AlertCircle", title: "Pending Approval", bgColor: "bg-yellow-50", iconColor: "text-yellow-600" },
  { key: "approvedBookings", iconKey: "CheckCircle2", title: "Approved", bgColor: "bg-green-50", iconColor: "text-green-600" },
  { key: "rejectedBookings", iconKey: "XCircle", title: "Rejected", bgColor: "bg-red-50", iconColor: "text-red-600" }
];

export const CONTACT_OPTIONS = [
  { iconKey: "Mail", title: "Email Us", desc: "Send us an email anytime", contact: "support@labbooking.com", link: "mailto:support@labbooking.com" },
  { iconKey: "Phone", title: "Call Us", desc: "Mon to Fri 9am to 6pm", contact: "8866218281", link: "tel:+918866218281" },
  { iconKey: "MapPin", title: "Visit Us", desc: "Physical office details will be announced shortly", contact: "Coming Soon", link: "#" }
];


export const CONTACT_FAQ_ITEMS = [
  { iconKey: "HelpCircle", title: "How do I book a lab?", desc: "Login, select lab, choose date & time, confirm booking." },
  { iconKey: "Calendar", title: "Can I cancel a booking?", desc: "Yes, cancel up to 24 hours before the session." },
  { iconKey: "ClipboardList", title: "What information do I need?", desc: "Student ID, department, and contact details." },
  { iconKey: "CreditCard", title: "Is there a booking fee?", desc: "No, the system is completely free." }
];

export const FAQ_CATEGORIES = [
  {
    title: "General Questions",
    questions: [
      { question: "How do I book a laboratory?", answer: "To book a laboratory, log in to your account, navigate to the booking section, select your preferred lab, choose an available date and time slot, and confirm your booking." },
      { question: "Can I book multiple labs at the same time?", answer: "Yes, but only at different time slots. Double booking is not allowed." },
      { question: "When can my sample be rejected?", answer: "If the blood sample is hemolysed, clotted, quantity is not sufficient, or if standard protocols are not followed (such as in the case of a urine sample)." },
      { question: "How can I create a user account on your platform?", answer: "Creating an account is quick and simple. Just go to our website or download the app, enter your name, mobile number, and email address, and complete the sign-up." },
      { question: "Is my personal and medical data secure?", answer: "Absolutely. We use advanced encryption technology to keep your data safe. Your medical records, prescriptions, and personal details are stored securely." },
      { question: "Can I save my medical records on my account?", answer: "Yes, your medical records can be safely stored in your account and accessed whenever you need them. Keeping your history in one place helps doctors provide better care." },
      { question: "Can I add family members to my account?", answer: "Yes. You can add family members under your profile and book consultations on their behalf. Each member's medical records are stored separately." },
      { question: "What should I do if I cannot log in to my account?", answer: "First, check your internet connection and credentials. If the problem continues, you can raise a ticket through our Help Centre or email support@labbooking.com." },
      { question: "How long does it take to resolve a technical issue?", answer: "Most technical problems are reviewed within 24 to 48 hours. We prioritize urgent cases to ensure you can continue using our services without disruption." },
      { question: "Can my medical data be misused?", answer: "No. We never misuse or sell your personal or medical data. Your information is used only for providing services as per our strict privacy policies." },
      { question: "How can I know how my data is being used?", answer: "You can read our Privacy Policy and Terms & Conditions for full details. We maintain complete transparency in our data handling processes." },
      { question: "Who can access my medical history and records?", answer: "Only you and the doctor you consult with can access your history. No unauthorized third party has access to your records." },
      { question: "Can I delete my account if I no longer want to use the service?", answer: "Yes, you can delete your account via the app settings or by contacting support@labbooking.com. Your data will be removed securely." }
    ]
  }
];

export const REGISTER_PAGE_CONTENT = {
  title: "Create your  Account",
  description: "Enter your details to create a new account.",
  labels: {
    name: "Full Name",
    email: "Email Address",
    password: "Password",
    confirmPassword: "Confirm Password"
  },
  buttons: {
    submit: "Create Account",
    back: "Back to Home",
    signIn: "Sign In"
  }
};

export const ABOUT_FEATURES = [
  { title: "Efficiency", desc: "Streamlined booking workflows" },
  { title: "Security", desc: "Safe, role-based access control" },
  { title: "Performance", desc: "Fast and responsive system" }
];

export const ABOUT_COMMITMENT_POINTS = [
  "Conflict-free lab scheduling",
  "Centralized booking management",
  "Admin-level visibility and reports"
];

// Utility function to get accurate test count
export const getTestCount = (category, packageId) => {
  const tests = PACKAGE_TESTS[category] && PACKAGE_TESTS[category][packageId];
  return tests ? tests.length : null;
};

export const PACKAGE_TESTS = {
  fullBodyCheckups: {
    1: [
      // Liver Function Tests
      "SGPT / ALT","SGOT / AST","Alkaline Phosphatase","Gamma‑GT (GGT)","Total Bilirubin","Direct Bilirubin","Indirect Bilirubin","Albumin","Globulin","Total Protein","A/G Ratio",
      // Lung Function Tests
      "Total IgE","Procalcitonin","CRP","ESR",
      // Kidney Function Tests
      "Serum Urea","Creatinine","Uric Acid","Blood Urea Nitrogen (BUN)","BUN/Creatinine Ratio","Estimated GFR (eGFR)","Urine Albumin","Urine Creatinine","Albumin/Creatinine Ratio (ACR)","Microalbumin (Urine)","Sodium (Na)","Potassium (K)","Chloride (Cl)","Calcium (Ca)",
      // Fever Tests
      "Malaria Parasite (MP) Smear","Dengue NS1 Antigen","Dengue IgM","Dengue IgG","Malaria Rapid Test","Typhoid Widal","Urine Protein","Urine Glucose","Urine Ketones","Urine Blood","Microscopy WBC","Microscopy RBC","Bacteria",
      // Thyroid Tests
      "Total T3 (T3)","Total T4 (T4)","TSH",
      // Diabetes Tests
      "Fasting Blood Glucose","Post‑Prandial Blood Glucose (PPBS)","HbA1c","Average Glucose (eAG)",
      // Essential Hematology for these conditions
      "Hemoglobin","Total WBC Count","Neutrophils %","Lymphocytes %","Monocytes %","Eosinophils %","Basophils %","Platelet Count"
    ],
    2: [
      // Liver Function Tests
      "SGPT / ALT","SGOT / AST","Alkaline Phosphatase","Gamma‑GT (GGT)","Total Bilirubin","Albumin","Globulin","Total Protein","A/G Ratio",
      // Lung Function Tests
      "Total IgE","Procalcitonin","CRP","ESR",
      // Kidney Function Tests
      "Serum Urea","Creatinine","Uric Acid","Blood Urea Nitrogen (BUN)","Estimated GFR (eGFR)","Urine Albumin","Urine Creatinine","Albumin/Creatinine Ratio (ACR)","Sodium (Na)","Potassium (K)","Chloride (Cl)","Calcium (Ca)",
      // Fever Tests
      "Dengue NS1 Antigen","Dengue IgM","Dengue IgG","Malaria Rapid Test","Typhoid Widal","Urine Protein","Urine Glucose","Urine Ketones","Urine Blood",
      // Thyroid Tests
      "Free T3 (FT3)","Free T4 (FT4)","TSH",
      // Diabetes Tests
      "Fasting Blood Glucose","HbA1c",
      // Essential Hematology for these conditions
      "Hemoglobin","Total WBC Count","Neutrophils %","Lymphocytes %","Platelet Count"
    ],
    3: [
      // Liver Function Tests - Senior Citizen Focus
      "SGPT / ALT","SGOT / AST","Alkaline Phosphatase","Gamma‑GT (GGT)","Total Bilirubin","Direct Bilirubin","Indirect Bilirubin","Albumin","Globulin","Total Protein","A/G Ratio","LDH","Ferritin",
      // Lung Function Tests
      "Total IgE","Procalcitonin","CRP","ESR","D‑Dimer","LDH",
      // Kidney Function Tests
      "Serum Urea","Creatinine","Uric Acid","Blood Urea Nitrogen (BUN)","BUN/Creatinine Ratio","Estimated GFR (eGFR)","Cystatin C","Urine Albumin","Urine Creatinine","Albumin/Creatinine Ratio (ACR)","Microalbumin (Urine)","Sodium (Na)","Potassium (K)","Chloride (Cl)","Calcium (Ca)","Phosphorus (P)","Magnesium (Mg)",
      // Fever Tests
      "Malaria Parasite (MP) Smear","Dengue NS1 Antigen","Dengue IgM","Dengue IgG","Malaria Rapid Test","Typhoid Widal","Salmonella Typhi IgM","Salmonella Typhi IgG","CRP","Procalcitonin","Urine Protein","Urine Glucose","Urine Ketones","Urine Blood",
      // Thyroid Tests
      "Free T3 (FT3)","Free T4 (FT4)","TSH","Anti‑TPO Antibody","Thyroglobulin Antibody",
      // Diabetes Tests
      "Fasting Blood Glucose","Post‑Prandial Blood Glucose (PPBS)","HbA1c","Average Glucose (eAG)",
      // Essential Hematology for these conditions
      "Hemoglobin","Total RBC Count","Hematocrit (PCV)","MCV","MCH","MCHC","RDW-CV","RDW-SD","Total WBC Count","Neutrophils %","Lymphocytes %","Monocytes %","Eosinophils %","Basophils %","Platelet Count","MPV","PDW","P-LCR","PCT","NRBC Count","NRBC %","RBC Morphology","Peripheral Smear Review"
    ]
  },
  kidney: {
    1: [
      "Serum Urea","Creatinine","Uric Acid","Blood Urea Nitrogen (BUN)","BUN/Creatinine Ratio","Estimated GFR (eGFR)",
      "Urine Albumin","Urine Creatinine","Albumin/Creatinine Ratio (ACR)","Microalbumin (Urine)",
      "Sodium (Na)","Potassium (K)","Chloride (Cl)","Calcium (Ca)"
    ],
    2: [
      "Serum Urea","Creatinine","Uric Acid","Blood Urea Nitrogen (BUN)","Estimated GFR (eGFR)","Cystatin C",
      "Urine Albumin","Urine Creatinine","Albumin/Creatinine Ratio (ACR)","Microalbumin (Urine)",
      "Sodium (Na)","Potassium (K)","Chloride (Cl)","Calcium (Ca)","Phosphorus (P)"
    ],
    3: [
      "Serum Urea","Creatinine","Uric Acid","Blood Urea Nitrogen (BUN)","Estimated GFR (eGFR)","Cystatin C",
      "Sodium (Na)","Potassium (K)","Chloride (Cl)","Calcium (Ca)","Phosphorus (P)","Magnesium (Mg)"
    ],
    4: [
      "Serum Urea","Creatinine","Uric Acid","Blood Urea Nitrogen (BUN)","BUN/Creatinine Ratio","Estimated GFR (eGFR)",
      "Urine Albumin","Urine Creatinine","Albumin/Creatinine Ratio (ACR)","Microalbumin (Urine)",
      "Sodium (Na)","Potassium (K)","Chloride (Cl)","Calcium (Ca)","Phosphorus (P)",
      "Hemoglobin","Total WBC Count","Neutrophils %","Lymphocytes %","Platelet Count"
    ]
  },
  liver: {
    1: [
      "SGPT / ALT","SGOT / AST","Alkaline Phosphatase","Gamma‑GT (GGT)","Total Bilirubin","Direct Bilirubin","Indirect Bilirubin","Albumin","Globulin","Total Protein","A/G Ratio","LDH","Ferritin","Uric Acid","Glucose (Fasting)"
    ],
    2: [
      "SGPT / ALT","SGOT / AST","Alkaline Phosphatase","Gamma‑GT (GGT)","Total Bilirubin","Direct Bilirubin","Indirect Bilirubin","Albumin","Globulin","Total Protein","A/G Ratio",
      "HBsAg","Anti‑HCV","HAV IgM","Anti‑HAV IgG",
      "Hemoglobin","Total WBC Count","Neutrophils %","Lymphocytes %","Platelet Count","ESR"
    ],
    3: [
      "HBsAg","Anti‑HCV","Total Bilirubin","SGPT / ALT","SGOT / AST","Alkaline Phosphatase","Gamma‑GT (GGT)","Albumin"
    ],
    4: [
      "SGPT / ALT","SGOT / AST","Alkaline Phosphatase","Gamma‑GT (GGT)","Total Bilirubin","Albumin","Globulin","Total Protein","A/G Ratio","LDH","Ferritin","Uric Acid","Glucose (Fasting)","HS‑CRP","GGT","Direct Bilirubin","Indirect Bilirubin","ESR"
    ]
  },
  lungs: {
    1: [
      "Hemoglobin","Total WBC Count","Neutrophils %","Lymphocytes %","Monocytes %","Eosinophils %","Basophils %","Platelet Count",
      "Total IgE","Procalcitonin","Sputum Routine","Sputum Culture"
    ],
    2: [
      "Hemoglobin","Total WBC Count","Neutrophils %","Lymphocytes %","Monocytes %","Eosinophils %","Basophils %","Platelet Count","ESR","CRP",
      "Total IgE","Procalcitonin","Sputum Routine","Sputum Culture","D‑Dimer","Ferritin","LDH","COVID‑19 IgG"
    ],
    3: [
      "Hemoglobin","Total RBC Count","Hematocrit (PCV)","MCV","MCH","MCHC","RDW-CV","RDW-SD","Total WBC Count","Neutrophils %","Lymphocytes %","Monocytes %","Eosinophils %","Basophils %","Platelet Count","ESR",
      "Total IgE","Procalcitonin","Sputum Routine","Sputum Culture","D‑Dimer","Ferritin","LDH","CRP"
    ],
    4: [
      "Hemoglobin","Total WBC Count","Neutrophils %","Lymphocytes %","Platelet Count","ESR","CRP","Total IgE","Procalcitonin","Ferritin","LDH","D‑Dimer","Sputum Routine","Sputum Culture","COVID‑19 IgG"
    ]
  },
  thyroid: {
    1: ["Total T3 (T3)","Total T4 (T4)","TSH"],
    2: ["Free T3 (FT3)","Free T4 (FT4)","TSH"],
    3: ["Free T3 (FT3)","Free T4 (FT4)","TSH","Anti‑TPO Antibody","Thyroglobulin Antibody"],
    4: [
      "Free T3 (FT3)","Free T4 (FT4)","TSH",
      "Vitamin D (25‑OH)","Vitamin B12",
      "Hemoglobin","Total WBC Count","Neutrophils %","Lymphocytes %","Platelet Count",
      "Total Cholesterol","Triglycerides","HDL Cholesterol","LDL Cholesterol (Calculated)","VLDL Cholesterol","Non‑HDL Cholesterol","HbA1c","Average Glucose (eAG)"
    ]
  },
  diabetes: {
    1: [
      "Hemoglobin","Total RBC Count","Hematocrit (PCV)","MCV","MCH","MCHC","RDW-CV","RDW-SD","Total WBC Count","Neutrophils %","Lymphocytes %","Monocytes %","Eosinophils %","Basophils %","Platelet Count","ESR",
      "Fasting Blood Glucose","Post‑Prandial Blood Glucose (PPBS)","HbA1c","Average Glucose (eAG)",
      "Total Cholesterol","Triglycerides","HDL Cholesterol","LDL Cholesterol (Calculated)","VLDL Cholesterol","Non‑HDL Cholesterol","Chol/HDL Ratio","LDL/HDL Ratio"
    ],
    2: ["HbA1c"],
    3: [
      "Hemoglobin","Total RBC Count","Hematocrit (PCV)","MCV","MCH","MCHC","RDW-CV","RDW-SD","Total WBC Count","Neutrophils %","Lymphocytes %","Monocytes %","Eosinophils %","Basophils %","Platelet Count","ESR",
      "Fasting Blood Glucose","Post‑Prandial Blood Glucose (PPBS)","HbA1c","Average Glucose (eAG)",
      "Total Cholesterol","Triglycerides","HDL Cholesterol","LDL Cholesterol (Calculated)","VLDL Cholesterol",
      "Serum Urea","Creatinine","Estimated GFR (eGFR)","Uric Acid",
      "TSH"
    ],
    4: ["Fasting Blood Glucose","Post‑Prandial Blood Glucose (PPBS)","HbA1c"],
    5: ["Fasting Insulin","Post‑Prandial Insulin","HOMA‑IR","C‑Peptide","HbA1c"],
    6: [
      "Hemoglobin","Total RBC Count","Hematocrit (PCV)","MCV","MCH","MCHC","RDW-CV","RDW-SD","Total WBC Count","Neutrophils %","Lymphocytes %","Monocytes %","Eosinophils %","Basophils %","Platelet Count","ESR",
      "Fasting Blood Glucose","Post‑Prandial Blood Glucose (PPBS)","HbA1c","Average Glucose (eAG)",
      "Total Cholesterol","Triglycerides","HDL Cholesterol","LDL Cholesterol (Calculated)","VLDL Cholesterol",
      "SGPT / ALT","SGOT / AST","Alkaline Phosphatase","Gamma‑GT (GGT)","Total Bilirubin","Albumin","Total Protein",
    ]
  },
  fever: {
    1: [
      "Hemoglobin","Total RBC Count","Hematocrit (PCV)","MCV","MCH","MCHC","RDW-CV","RDW-SD","Total WBC Count","Neutrophils %","Lymphocytes %","Monocytes %","Eosinophils %","Basophils %","Platelet Count","ESR",
      "Malaria Parasite (MP) Smear","CRP","Urine Protein","Urine Glucose","Urine Ketones","Urine Blood","Microscopy WBC","Microscopy RBC","Bacteria"
    ],
    2: [
      "Hemoglobin","Total RBC Count","Total WBC Count","Neutrophils %","Lymphocytes %","Platelet Count","ESR","CRP",
      "Dengue NS1 Antigen","Dengue IgM","Dengue IgG","Malaria Rapid Test","Typhoid Widal","Urine Protein","Urine Glucose","Urine Ketones","Urine Blood","Microscopy WBC","Microscopy RBC","Bacteria","Urobilinogen","Nitrite","Specific Gravity","Urine pH","Appearance","Color","Procalcitonin","LDH","Ferritin","D‑Dimer","C‑Reactive Protein (Quant)"
    ],
    3: [
      "Hemoglobin","Total RBC Count","Hematocrit (PCV)","MCV","MCH","MCHC","RDW-CV","RDW-SD","Total WBC Count","Neutrophils %","Lymphocytes %","Monocytes %","Eosinophils %","Basophils %","Platelet Count","ESR",
      "Dengue NS1 Antigen","Dengue IgM","Dengue IgG","Malaria Parasite (MP) Smear","Malaria Rapid Test","Typhoid Widal","Salmonella Typhi IgM","Salmonella Typhi IgG","CRP","Procalcitonin","Urine Protein","Urine Glucose","Urine Ketones","Urine Blood"
    ],
    4: ["Dengue NS1 Antigen","Malaria Rapid Test"],
    5: ["Typhoid Widal","Salmonella Typhi IgM","Salmonella Typhi IgG","CRP","ESR","Urine Protein","Urine Glucose","Urine Ketones","Urine Blood","Microscopy WBC"],
    6: [
      "Hemoglobin","Total RBC Count","Hematocrit (PCV)","MCV","MCH","MCHC","RDW-CV","RDW-SD","Total WBC Count","Neutrophils %","Lymphocytes %","Monocytes %","Eosinophils %","Basophils %","Platelet Count","ESR",
      "Dengue NS1 Antigen","Dengue IgM","Dengue IgG","Malaria Parasite (MP) Smear","Malaria Rapid Test","Typhoid Widal","Salmonella Typhi IgM","Salmonella Typhi IgG","CRP","Procalcitonin","COVID‑19 IgG","Influenza A/B Antigen","Sputum Routine","Sputum Culture","LDH","Ferritin"
    ]
  },
  hairSkin: {
    1: [
      "Vitamin D (25‑OH)","Vitamin B12","Ferritin","Serum Iron","TIBC","Transferrin Saturation","Zinc","Copper","Biotin (Vitamin B7)","TSH","Free T3 (FT3)","Free T4 (FT4)","Folate","Vitamin A","Vitamin E"
    ],
    2: [
      "Vitamin D (25‑OH)","Vitamin B12","Ferritin","Serum Iron","TIBC","Transferrin Saturation","Zinc","Copper","Biotin (Vitamin B7)","TSH",
      "Serum Iron","TIBC","Transferrin Saturation","Ferritin",
      "Free T3 (FT3)","Free T4 (FT4)",
      "Testosterone (Total)","DHEA‑S","SHBG","Cortisol","Homocysteine","LDH"
    ],
    3: [
      "Vitamin D (25‑OH)","Vitamin B12","Serum Iron","TIBC","Transferrin Saturation","Ferritin","TSH","Free T3 (FT3)","Free T4 (FT4)","Zinc","Copper","Folate"
    ],
    4: [
      "Vitamin D (25‑OH)","Vitamin B12","Ferritin","Serum Iron","TIBC","Transferrin Saturation","Zinc","Copper","Biotin (Vitamin B7)","TSH",
      "LH","FSH","Prolactin","Estradiol (E2)","Progesterone","Testosterone (Total)","AMH","DHEA‑S","SHBG","17‑OH Progesterone",
      "Free T3 (FT3)","Free T4 (FT4)",
      "Folate","Vitamin A"
    ]
  },
};

export const RECOMMENDED_TESTS = {
  diabetes: [
    { id: "ppbs", title: "Post Prandial Blood Sugar (PPBS) Test", price: 119, originalPrice: 299, discount: 60 },
    { id: "fbs", title: "Fasting Blood Sugar (FBS) Test", price: 119, originalPrice: 299, discount: 60 },
    { id: "insulin-fasting", title: "Insulin Fasting Test", price: 459, originalPrice: 849, discount: 46 },
    { id: "insulin-antibodies", title: "Insulin Antibodies", price: 999, originalPrice: 1649, discount: 39 }
  ],
  fever: [
    { id: "esr", title: "Erythrocyte Sedimentation Rate (ESR) Test", price: 199, originalPrice: 349, discount: 43 },
    { id: "typhi-igm", title: "Typhi Test - IgM", price: 399, originalPrice: 549, discount: 27 },
    { id: "malarial-parasite", title: "Malarial Parasite Test", price: 399, originalPrice: 549, discount: 27 },
    { id: "dengue-ns1-rapid", title: "Dengue Ns1 Antigen Rapid Test", price: 499, originalPrice: 649, discount: 23 }
  ],
  kidney: [
    { id: "acr-microalbumin", title: "Albumin Creatinine Ratio (ACR) / Urine For Microalbuminuria Test", price: 669, originalPrice: 1299, discount: 48 },
    { id: "bun-urea", title: "Blood Urea Nitrogen (BUN)/Serum Urea Test", price: 125, originalPrice: 249, discount: 50 },
    { id: "protein-creatinine-ratio", title: "Protein Creatinine Ratio (Urine) Test", price: 299, originalPrice: 599, discount: 50 }
  ],
  liver: [
    { id: "sgpt-alt", title: "SGPT / ALT (Alanine Transaminase) Test", price: 175, originalPrice: 349, discount: 50 },
    { id: "sgot-ast", title: "Aspartate Aminotransferase (AST / SGOT) Test", price: 175, originalPrice: 399, discount: 56 },
    { id: "liver-acr-microalbumin", title: "Albumin Creatinine Ratio (ACR) / Urine For Microalbuminuria Test", price: 669, originalPrice: 1299, discount: 48 }
  ],
  lungs: [
    { id: "healthy-lung-body", title: "Healthy Lung & Body Checkup", price: 1249, originalPrice: 3200, discount: 62 }
  ],
  thyroid: [
    { id: "anti-tpo", title: "Anti Thyroperoxidase Antibody (Anti-TPO) Test", price: 1099, originalPrice: 1399, discount: 21 },
    { id: "t4", title: "Thyroxine (T4) Test", price: 175, originalPrice: 299, discount: 41 },
    { id: "t3", title: "Triiodothyronine (T3) Test", price: 175, originalPrice: 349, discount: 50 }
  ]
};
