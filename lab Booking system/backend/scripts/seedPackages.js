const mongoose = require('mongoose');
const Package = require('../models/package');
const Test = require('../models/test');
require('dotenv').config();

const seedPackages = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lab-booking');
    console.log('Connected to MongoDB');

    // Clear existing packages
    await Package.deleteMany({});
    console.log('Cleared existing packages');

    // Get test IDs for reference
    const tests = await Test.find({});
    const testMap = {};
    tests.forEach(test => {
      testMap[test.name] = test._id;
    });

    // Sample package data
    const packages = [
      {
        name: "Complete Health Checkup Package",
        description: "Comprehensive health screening package including all major organ function tests, complete blood count, and vital health markers.",
        category: "Full Body Checkup",
        price: 2499,
        originalPrice: 3500,
        discount: 29,
        duration: "3 hours",
        preparation: "10-12 hours fasting required. Drink plenty of water.",
        testsIncluded: [
          testMap["Complete Blood Count (CBC)"],
          testMap["Liver Function Test (LFT)"],
          testMap["Kidney Function Test (KFT)"],
          testMap["Lipid Profile"],
          testMap["Blood Sugar Fasting"],
          testMap["Thyroid Profile (T3, T4, TSH)"],
          testMap["Urine Routine & Microscopy"]
        ].filter(id => id), // Filter out any undefined values
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
        testsIncluded: [
          testMap["Blood Sugar Fasting"],
          testMap["HbA1c (Glycated Hemoglobin)"],
          testMap["Lipid Profile"],
          testMap["Kidney Function Test (KFT)"],
          testMap["Complete Blood Count (CBC)"]
        ].filter(id => id),
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
        testsIncluded: [
          testMap["Liver Function Test (LFT)"],
          testMap["Complete Blood Count (CBC)"],
          testMap["Blood Sugar Fasting"]
        ].filter(id => id),
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
        testsIncluded: [
          testMap["Kidney Function Test (KFT)"],
          testMap["Complete Blood Count (CBC)"],
          testMap["Blood Sugar Fasting"],
          testMap["Urine Routine & Microscopy"]
        ].filter(id => id),
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
        testsIncluded: [
          testMap["Thyroid Profile (T3, T4, TSH)"],
          testMap["Complete Blood Count (CBC)"]
        ].filter(id => id),
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
        testsIncluded: [
          testMap["Lipid Profile"],
          testMap["Complete Blood Count (CBC)"],
          testMap["Blood Sugar Fasting"],
          testMap["CRP (C-Reactive Protein)"],
          testMap["Kidney Function Test (KFT)"]
        ].filter(id => id),
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
        testsIncluded: [
          testMap["Complete Blood Count (CBC)"],
          testMap["Thyroid Profile (T3, T4, TSH)"],
          testMap["Lipid Profile"],
          testMap["Blood Sugar Fasting"],
          testMap["Kidney Function Test (KFT)"],
          testMap["Vitamin D Test"]
        ].filter(id => id),
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
        testsIncluded: [
          testMap["Complete Blood Count (CBC)"],
          testMap["Liver Function Test (LFT)"],
          testMap["Kidney Function Test (KFT)"],
          testMap["Lipid Profile"],
          testMap["Blood Sugar Fasting"],
          testMap["Thyroid Profile (T3, T4, TSH)"],
          testMap["Urine Routine & Microscopy"],
          testMap["Vitamin D Test"],
          testMap["CRP (C-Reactive Protein)"]
        ].filter(id => id),
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

    // Insert packages
    const insertedPackages = await Package.insertMany(packages);
    console.log(`Successfully inserted ${insertedPackages.length} packages`);

    // Display inserted packages
    insertedPackages.forEach((pkg, index) => {
      console.log(`${index + 1}. ${pkg.name} - ₹${pkg.price} (${pkg.category}) - ${pkg.testsIncluded.length} tests`);
    });

  } catch (error) {
    console.error('Error seeding packages:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the seed function
if (require.main === module) {
  seedPackages();
}

module.exports = seedPackages;
