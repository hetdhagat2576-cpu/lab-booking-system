const FAQ_CATEGORIES = [
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

// Default home content data
const DEFAULT_WHY_BOOK_DATA = [
  {
    id: 1,
    iconKey: "Home",
    title: "Home Sample Collection",
    desc: "Free and timely sample pickup by certified professionals."
  },
  {
    id: 2,
    iconKey: "CheckCircle", 
    title: "Certified Labs",
    desc: "ISO & NABL certified laboratories for accurate results."
  },
  {
    id: 3,
    iconKey: "Users",
    title: "Best Prices", 
    desc: "Compare labs and save up to 70% on test bookings."
  },
  {
    id: 4,
    iconKey: "FileText",
    title: "Digital Reports",
    desc: "Get your test reports delivered digitally within 24-48 hours."
  }
];

const DEFAULT_HOW_IT_WORKS_DATA = [
  {
    id: 1,
    stepNumber: 1,
    iconKey: "Search",
    title: "Search & Select",
    desc: "Search for tests and labs, compare prices, and select what you need."
  },
  {
    id: 2,
    stepNumber: 2,
    iconKey: "CreditCard",
    title: "Book & Pay",
    desc: "Book your test and pay securely online or choose cash on collection."
  },
  {
    id: 3,
    stepNumber: 3,
    iconKey: "Home",
    title: "Sample Collection",
    desc: "Get your sample collected at home or visit the lab."
  },
  {
    id: 4,
    stepNumber: 4,
    iconKey: "FileText",
    title: "Get Reports",
    desc: "Receive your test reports digitally within 24-48 hours."
  }
];

// In-memory storage for home content (in production, use a database)
let homeWhyBookData = [...DEFAULT_WHY_BOOK_DATA];
let homeHowItWorksData = [...DEFAULT_HOW_IT_WORKS_DATA];
let nextWhyBookId = DEFAULT_WHY_BOOK_DATA.length + 1;
let nextHowItWorksId = DEFAULT_HOW_IT_WORKS_DATA.length + 1;

const TERMS_SECTIONS = [
  {
    id: 1,
    iconKey: "FileText",
    title: "1. Acceptance of Terms & Eligibility",
    content: [
      "Legal Affirmation: By accessing the BookMyLab platform, you agree to be bound by this Agreement.",
      "Eligibility Criteria: You must be 18+; minors require guardian supervision.",
      "Entire Agreement: These Terms, Privacy Policy, and Cookie Policy form the full agreement.",
      "Right to Amend: We may modify these terms; changes take effect upon posting."
    ]
  },
  {
    id: 2,
    iconKey: "UserCircle",
    title: "2. User Accounts & Prohibited Conduct",
    content: [
      "Registration Veracity: Provide accurate identity and medical information.",
      "Account Custodianship: Keep credentials secure; avoid unsafe networks.",
      "Automated Access: Scrapers/crawlers to extract data are prohibited.",
      "Community Standards: Do not transmit defamatory content or harvest partner data."
    ]
  },
  {
    id: 3,
    iconKey: "CalendarClock",
    title: "3. Booking & Sample Collection Protocols",
    content: [
      "Booking Validity: Contract forms upon lab confirmation of dispatch.",
      "Pre-Analytic Requirements: Fasting may be required for certain tests.",
      "Home Collection Access: Provide a safe, accessible environment.",
      "Turnaround Time (TAT): Estimates may vary due to clinical factors."
    ]
  },
  {
    id: 4,
    iconKey: "CreditCard",
    title: "4. Financial Terms & Refund Architecture",
    content: [
      "Pricing Structure: Prices include taxes unless stated.",
      "Payment Gateway: Encrypted gateways; we do not store CVV/PIN.",
      "Cancellation Window: Tiered refunds based on time.",
      "Dispute Window: Report billing discrepancies within 14 days."
    ]
  },
  {
    id: 5,
    iconKey: "ShieldAlert",
    title: "5. Data Sovereignty & Medical Privacy",
    content: [
      "Clinical Data Usage: Labs act as Data Controllers; platform as Processor.",
      "HIPAA/GDPR Alignment: No health data sales for marketing.",
      "Data Retention: Records retained per regulation.",
      "Breach Notification: Notify users/regulators within stipulated time."
    ]
  },
  {
    id: 6,
    iconKey: "Lock",
    title: "6. Intellectual Property & Brand Assets",
    content: [
      "Proprietary Rights: Code, graphics, branding owned by Company.",
      "Limited License: Personal, non-commercial use only.",
      "Software Integrity: No reverse engineering.",
      "User Contributions: Feedback becomes Company property."
    ]
  },
  {
    id: 7,
    iconKey: "Scale",
    title: "7. Limitation of Liability & Disclaimers",
    content: [
      "Medical Disclaimer: Platform is facilitator; consult practitioners.",
      "Exclusion of Warranties: Service provided as-is.",
      "Indemnification: You indemnify for violations/misuse.",
      "Liability Ceiling: Capped to amount paid for the session."
    ]
  }
];

const PRIVACY_POLICY_SECTIONS = [
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

const getFaq = (req, res) => {
  res.status(200).json({
    success: true,
    data: FAQ_CATEGORIES
  });
};

const getLegal = (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      privacyPolicy: PRIVACY_POLICY_SECTIONS,
      termsAndConditions: TERMS_SECTIONS
    }
  });
};

// Home Why Book Content Functions
const getHomeWhyBook = (req, res) => {
  res.status(200).json({
    success: true,
    data: homeWhyBookData
  });
};

const createHomeWhyBookItem = (req, res) => {
  try {
    const { iconKey, title, desc } = req.body;
    
    if (!iconKey || !title || !desc) {
      return res.status(400).json({
        success: false,
        message: 'iconKey, title, and desc are required'
      });
    }

    const newItem = {
      id: nextWhyBookId++,
      iconKey,
      title,
      desc
    };

    homeWhyBookData.push(newItem);

    res.status(201).json({
      success: true,
      message: 'Why Book item created successfully',
      data: newItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

const updateHomeWhyBookItem = (req, res) => {
  try {
    const { id } = req.params;
    const { iconKey, title, desc } = req.body;

    const itemIndex = homeWhyBookData.findIndex(item => item.id === parseInt(id));
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Why Book item not found'
      });
    }

    const updatedItem = {
      ...homeWhyBookData[itemIndex],
      iconKey: iconKey || homeWhyBookData[itemIndex].iconKey,
      title: title || homeWhyBookData[itemIndex].title,
      desc: desc || homeWhyBookData[itemIndex].desc
    };

    homeWhyBookData[itemIndex] = updatedItem;

    res.status(200).json({
      success: true,
      message: 'Why Book item updated successfully',
      data: updatedItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

const deleteHomeWhyBookItem = (req, res) => {
  try {
    const { id } = req.params;

    const itemIndex = homeWhyBookData.findIndex(item => item.id === parseInt(id));
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Why Book item not found'
      });
    }

    homeWhyBookData.splice(itemIndex, 1);

    res.status(200).json({
      success: true,
      message: 'Why Book item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Home How It Works Content Functions
const getHomeHowItWorks = (req, res) => {
  res.status(200).json({
    success: true,
    data: homeHowItWorksData
  });
};

const createHomeHowItWorksItem = (req, res) => {
  try {
    const { stepNumber, iconKey, title, desc } = req.body;
    
    if (!stepNumber || !iconKey || !title || !desc) {
      return res.status(400).json({
        success: false,
        message: 'stepNumber, iconKey, title, and desc are required'
      });
    }

    const newItem = {
      id: nextHowItWorksId++,
      stepNumber,
      iconKey,
      title,
      desc
    };

    homeHowItWorksData.push(newItem);

    res.status(201).json({
      success: true,
      message: 'How It Works item created successfully',
      data: newItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

const updateHomeHowItWorksItem = (req, res) => {
  try {
    const { id } = req.params;
    const { stepNumber, title, desc } = req.body;

    const itemIndex = homeHowItWorksData.findIndex(item => item.id === parseInt(id));
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'How It Works item not found'
      });
    }

    const updatedItem = {
      ...homeHowItWorksData[itemIndex],
      stepNumber: stepNumber !== undefined ? stepNumber : homeHowItWorksData[itemIndex].stepNumber,
      title: title || homeHowItWorksData[itemIndex].title,
      desc: desc || homeHowItWorksData[itemIndex].desc
    };

    homeHowItWorksData[itemIndex] = updatedItem;

    res.status(200).json({
      success: true,
      message: 'How It Works item updated successfully',
      data: updatedItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

const deleteHomeHowItWorksItem = (req, res) => {
  try {
    const { id } = req.params;

    const itemIndex = homeHowItWorksData.findIndex(item => item.id === parseInt(id));
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'How It Works item not found'
      });
    }

    homeHowItWorksData.splice(itemIndex, 1);

    res.status(200).json({
      success: true,
      message: 'How It Works item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getFaq,
  getLegal,
  getHomeWhyBook,
  getHomeHowItWorks,
  createHomeWhyBookItem,
  createHomeHowItWorksItem,
  updateHomeWhyBookItem,
  updateHomeHowItWorksItem,
  deleteHomeWhyBookItem,
  deleteHomeHowItWorksItem
};
