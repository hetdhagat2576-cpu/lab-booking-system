const mongoose = require('mongoose');
const Package = require('../models/package');
const Test = require('../models/test');
require('dotenv').config();

const seedPackages = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lab-booking');
    console.log('✅ Connected to MongoDB');

    // Check if packages already exist
    const existingPackages = await Package.countDocuments();
    if (existingPackages > 0) {
      console.log(`📦 Found ${existingPackages} existing packages`);
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const answer = await new Promise(resolve => {
        readline.question('❓ Do you want to clear existing packages and reseed? (y/N): ', resolve);
      });
      
      readline.close();
      
      if (answer.toLowerCase() !== 'y') {
        console.log('🚫 Seeding cancelled');
        await mongoose.disconnect();
        return;
      }
      
      // Clear existing packages
      await Package.deleteMany({});
      console.log('🗑️ Cleared existing packages');
    }

    // Get test IDs for reference
    const tests = await Test.find({});
    const testMap = {};
    tests.forEach(test => {
      testMap[test.name] = test._id;
    });
    
    console.log(`🧪 Found ${tests.length} tests for reference`);

    // Enhanced package data with validation - using correct test names
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
          testMap["Complete Blood Count (CBC) Test"],
          testMap["Liver Function Test (LFT) Panel"],
          testMap["Kidney Function Test (KFT/RFT) Panel"],
          testMap["Lipid Profile Test"],
          testMap["Blood Sugar Fasting Test"],
          testMap["Thyroid Profile (T3, T4, TSH) Test"],
          testMap["Urine Routine & Microscopy Test"]
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
          testMap["Blood Sugar Fasting Test"],
          testMap["HbA1c (Glycated Hemoglobin) Test"],
          testMap["Lipid Profile Test"],
          testMap["Kidney Function Test (KFT/RFT) Panel"],
          testMap["Complete Blood Count (CBC) Test"]
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
          testMap["Liver Function Test (LFT) Panel"],
          testMap["Complete Blood Count (CBC) Test"],
          testMap["Blood Sugar Fasting Test"]
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
          testMap["Kidney Function Test (KFT/RFT) Panel"],
          testMap["Complete Blood Count (CBC) Test"],
          testMap["Blood Sugar Fasting Test"],
          testMap["Urine Routine & Microscopy Test"]
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
          testMap["Thyroid Profile (T3, T4, TSH) Test"],
          testMap["Complete Blood Count (CBC) Test"]
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
          testMap["Lipid Profile Test"],
          testMap["Complete Blood Count (CBC) Test"],
          testMap["Blood Sugar Fasting Test"],
          testMap["C-Reactive Protein (CRP) Test"],
          testMap["Kidney Function Test (KFT/RFT) Panel"]
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
          testMap["Complete Blood Count (CBC) Test"],
          testMap["Thyroid Profile (T3, T4, TSH) Test"],
          testMap["Lipid Profile Test"],
          testMap["Blood Sugar Fasting Test"],
          testMap["Kidney Function Test (KFT/RFT) Panel"],
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
          testMap["Complete Blood Count (CBC) Test"],
          testMap["Liver Function Test (LFT) Panel"],
          testMap["Kidney Function Test (KFT/RFT) Panel"],
          testMap["Lipid Profile Test"],
          testMap["Blood Sugar Fasting Test"],
          testMap["Thyroid Profile (T3, T4, TSH) Test"],
          testMap["Urine Routine & Microscopy Test"],
          testMap["Vitamin D Test"],
          testMap["C-Reactive Protein (CRP) Test"]
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
      },
      {
        name: "Diabetes Profile Package",
        description: "Comprehensive diabetes monitoring package including glucose levels, long-term sugar control assessment, and related complications screening.",
        category: "Diabetes",
        price: 899,
        originalPrice: 1400,
        discount: 36,
        duration: "2 hours",
        preparation: "8-12 hours fasting required for FBS and PPBS tests.",
        testsIncluded: [
          testMap["Blood Sugar Fasting Test"],
          testMap["Post Prandial Blood Sugar (PPBS) Test"],
          testMap["Random Blood Sugar (RBS) Test"],
          testMap["HbA1c (Glycated Hemoglobin) Test"],
          testMap["Complete Blood Count (CBC) Test"],
          testMap["Kidney Function Test (KFT/RFT) Panel"]
        ].filter(id => id),
        sampleTypes: ["Blood"],
        isActive: true,
        isPopular: true,
        isRecommended: true,
        tags: ["diabetes", "glucose", "hba1c", "monitoring", "comprehensive"],
        includes: [
          "Glucose Fasting (FBS)",
          "Post Prandial Blood Sugar (PPBS)",
          "Random Blood Sugar (RBS)",
          "HbA1c (Glycated Hemoglobin)",
          "Complete Blood Count",
          "Kidney Function Test",
          "Diabetes Consultation"
        ],
        benefits: [
          "Complete diabetes monitoring",
          "Long-term sugar control assessment",
          "Early complication detection",
          "Specialized consultation"
        ],
        suitableFor: [
          "Known diabetes patients",
          "Pre-diabetes individuals",
          "Family history of diabetes",
          "Regular diabetes monitoring"
        ]
      },
      {
        name: "Liver Function Test (LFT) Package",
        description: "Comprehensive liver health assessment including bilirubin levels, liver enzymes, and protein synthesis evaluation.",
        category: "Liver Health",
        price: 899,
        originalPrice: 1400,
        discount: 36,
        duration: "2 hours",
        preparation: "10-12 hours fasting required. Avoid alcohol for 24 hours.",
        testsIncluded: [
          testMap["Liver Function Test (LFT) Panel"],
          testMap["Complete Blood Count (CBC) Test"],
          testMap["Blood Sugar Fasting Test"]
        ].filter(id => id),
        sampleTypes: ["Blood"],
        isActive: true,
        isPopular: true,
        isRecommended: false,
        tags: ["liver", "bilirubin", "enzymes", "function", "detox"],
        includes: [
          "Bilirubin (Total, Direct, Indirect)",
          "SGPT (ALT) & SGOT (AST)",
          "Alkaline Phosphatase (ALP)",
          "Gamma GT (GGT)",
          "Total Protein, Albumin & Globulin",
          "Complete Blood Count",
          "Liver Specialist Consultation"
        ],
        benefits: [
          "Complete liver function assessment",
          "Early detection of liver diseases",
          "Bile duct evaluation",
          "Specialized consultation"
        ],
        suitableFor: [
          "Alcohol consumers",
          "Liver disease patients",
          "Medication users",
          "Routine health screening"
        ]
      },
      {
        name: "Kidney Function Test (KFT/RFT) Package",
        description: "Comprehensive kidney health assessment including waste filtration, electrolyte balance, and renal function evaluation.",
        category: "Kidney Health",
        price: 599,
        originalPrice: 900,
        discount: 33,
        duration: "2 hours",
        preparation: "Drink plenty of water. Avoid heavy exercise 24 hours before.",
        testsIncluded: [
          testMap["Kidney Function Test (KFT/RFT) Panel"],
          testMap["Complete Blood Count (CBC) Test"],
          testMap["Blood Sugar Fasting Test"],
          testMap["Urine Routine & Microscopy Test"]
        ].filter(id => id),
        sampleTypes: ["Blood", "Urine"],
        isActive: true,
        isPopular: true,
        isRecommended: false,
        tags: ["kidney", "renal", "creatinine", "electrolytes", "filtration"],
        includes: [
          "Serum Creatinine",
          "Blood Urea Nitrogen (BUN) & Urea",
          "Uric Acid",
          "Electrolytes (Sodium, Potassium, Chloride)",
          "BUN/Creatinine Ratio",
          "Complete Blood Count",
          "Urine Routine & Microscopy",
          "Nephrologist Consultation"
        ],
        benefits: [
          "Complete kidney function assessment",
          "Early detection of kidney diseases",
          "Electrolyte balance evaluation",
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
        name: "Thyroid Profile Package",
        description: "Complete thyroid assessment including T3, T4, and TSH hormones for comprehensive thyroid health evaluation.",
        category: "Thyroid",
        price: 699,
        originalPrice: 1050,
        discount: 33,
        duration: "1 hour",
        preparation: "No special preparation required.",
        testsIncluded: [
          testMap["Thyroid Profile (T3, T4, TSH) Test"],
          testMap["Complete Blood Count (CBC) Test"]
        ].filter(id => id),
        sampleTypes: ["Blood"],
        isActive: true,
        isPopular: true,
        isRecommended: false,
        tags: ["thyroid", "t3", "t4", "tsh", "hormones", "metabolism"],
        includes: [
          "T3 (Total Triiodothyronine)",
          "T4 (Total Thyroxine)",
          "TSH (Thyroid Stimulating Hormone)",
          "Complete Blood Count",
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
        name: "Fever & Infection Screen Package",
        description: "Comprehensive fever and infection screening to identify the source of acute fever or chronic inflammation.",
        category: "Fever",
        price: 999,
        originalPrice: 1600,
        discount: 38,
        duration: "3 hours",
        preparation: "No special preparation required. Bring recent fever history.",
        testsIncluded: [
          testMap["Complete Blood Count (CBC) Test"],
          testMap["Erythrocyte Sedimentation Rate (ESR) Test"],
          testMap["C-Reactive Protein (CRP) Test"],
          testMap["Urine Routine & Microscopy Test"],
          testMap["Malarial Parasite Test"],
          testMap["Widal Test"]
        ].filter(id => id),
        sampleTypes: ["Blood", "Urine"],
        isActive: true,
        isPopular: true,
        isRecommended: true,
        tags: ["fever", "infection", "inflammation", "malaria", "typhoid"],
        includes: [
          "Complete Blood Count (CBC/Haemogram)",
          "ESR & C-Reactive Protein (CRP)",
          "Urine Routine & Microscopy",
          "Malaria Parasite/Antigen (MP)",
          "Widal Test",
          "Infection Specialist Consultation"
        ],
        benefits: [
          "Comprehensive infection screening",
          "Fever source identification",
          "Inflammation assessment",
          "Specialized consultation"
        ],
        suitableFor: [
          "Patients with acute fever",
          "Chronic inflammation cases",
          "Unexplained fever",
          "Pre-travel screening"
        ]
      },
      {
        name: "Lung & Respiratory Health Package",
        description: "Comprehensive respiratory health assessment including oxygenation, allergies, and specific infections like TB.",
        category: "Lung Health",
        price: 1899,
        originalPrice: 2800,
        discount: 32,
        duration: "3 hours",
        preparation: "Early morning sputum sample preferred if possible. No special fasting required.",
        testsIncluded: [
          testMap["Complete Blood Count (CBC) Test"],
          testMap["Absolute Eosinophil Count (AEC) Test"],
          testMap["Serum IgE Test"],
          testMap["Sputum AFB Stain Test"],
          testMap["Quantiferon TB Gold Test"],
          testMap["Arterial Blood Gas (ABG) Test"],
          testMap["Aspergillus IgE Specific Test"]
        ].filter(id => id),
        sampleTypes: ["Blood", "Sputum"],
        isActive: true,
        isPopular: false,
        isRecommended: true,
        tags: ["lungs", "respiratory", "tb", "allergy", "oxygenation"],
        includes: [
          "Absolute Eosinophil Count (AEC)",
          "Serum IgE Levels",
          "Sputum-AFB Stain/Culture",
          "Quantiferon TB Gold",
          "Arterial Blood Gas (ABG)",
          "Aspergillus IgE Specific",
          "Complete Blood Count",
          "Pulmonologist Consultation"
        ],
        benefits: [
          "Complete respiratory assessment",
          "Allergy evaluation",
          "TB screening and detection",
          "Oxygenation assessment",
          "Specialized consultation"
        ],
        suitableFor: [
          "Chronic cough patients",
          "Asthma patients",
          "TB suspected cases",
          "Allergy sufferers",
          "Smokers"
        ]
      }
    ];

    // Validate packages before insertion
    console.log('🔍 Validating package data...');
    const validPackages = [];
    const invalidPackages = [];
    
    packages.forEach((pkg, index) => {
      // Validate required fields
      if (!pkg.name || !pkg.name.trim()) {
        invalidPackages.push({ index, name: pkg.name, error: 'Missing name' });
        return;
      }
      
      if (!pkg.category) {
        invalidPackages.push({ index, name: pkg.name, error: 'Missing category' });
        return;
      }
      
      if (!pkg.price || pkg.price < 0) {
        invalidPackages.push({ index, name: pkg.name, error: 'Invalid price' });
        return;
      }
      
      if (!pkg.description || !pkg.description.trim()) {
        invalidPackages.push({ index, name: pkg.name, error: 'Missing description' });
        return;
      }
      
      // Validate test references
      const validTestIds = pkg.testsIncluded.filter(id => id);
      if (validTestIds.length === 0) {
        console.warn(`⚠️ Package "${pkg.name}" has no valid test references`);
      }
      
      validPackages.push({
        ...pkg,
        testsIncluded: validTestIds,
        duration: pkg.duration || '30 mins',
        preparation: pkg.preparation || 'No special preparation required',
        isActive: pkg.isActive !== undefined ? pkg.isActive : true,
        isPopular: pkg.isPopular !== undefined ? pkg.isPopular : false,
        isRecommended: pkg.isRecommended !== undefined ? pkg.isRecommended : false,
        tags: pkg.tags || [],
        originalPrice: pkg.originalPrice || pkg.price,
        customTests: pkg.customTests || [],
        sampleTypes: pkg.sampleTypes || ['Blood'],
        includes: pkg.includes || [],
        benefits: pkg.benefits || [],
        suitableFor: pkg.suitableFor || [],
      });
    });
    
    if (invalidPackages.length > 0) {
      console.log('❌ Found invalid packages:');
      invalidPackages.forEach(pkg => {
        console.log(`   - Package ${pkg.index + 1} (${pkg.name}): ${pkg.error}`);
      });
    }
    
    if (validPackages.length === 0) {
      console.log('❌ No valid packages to insert');
      await mongoose.disconnect();
      return;
    }
    
    console.log(`✅ ${validPackages.length} packages validated successfully`);
    
    // Insert packages with error handling
    try {
      console.log('📦 Inserting packages...');
      const insertedPackages = await Package.insertMany(validPackages, { ordered: false });
      console.log(`✅ Successfully inserted ${insertedPackages.length} packages`);

      // Display inserted packages summary
      console.log('\n📋 Inserted Packages Summary:');
      insertedPackages.forEach((pkg, index) => {
        console.log(`${index + 1}. ${pkg.name} - ₹${pkg.price} (${pkg.category}) - ${pkg.testsIncluded.length} tests`);
      });
      
      // Display category summary
      const categorySummary = {};
      insertedPackages.forEach(pkg => {
        categorySummary[pkg.category] = (categorySummary[pkg.category] || 0) + 1;
      });
      
      console.log('\n📊 Category Summary:');
      Object.entries(categorySummary).forEach(([category, count]) => {
        console.log(`   ${category}: ${count} packages`);
      });
      
      // Display statistics
      const totalTests = insertedPackages.reduce((sum, pkg) => sum + pkg.testsIncluded.length, 0);
      const avgPrice = insertedPackages.reduce((sum, pkg) => sum + pkg.price, 0) / insertedPackages.length;
      const popularCount = insertedPackages.filter(pkg => pkg.isPopular).length;
      const recommendedCount = insertedPackages.filter(pkg => pkg.isRecommended).length;
      
      console.log('\n📈 Statistics:');
      console.log(`   Total packages: ${insertedPackages.length}`);
      console.log(`   Total tests included: ${totalTests}`);
      console.log(`   Average price: ₹${Math.round(avgPrice)}`);
      console.log(`   Popular packages: ${popularCount}`);
      console.log(`   Recommended packages: ${recommendedCount}`);
      
    } catch (insertError) {
      console.error('❌ Error inserting packages:', insertError.message);
      
      if (insertError.name === 'BulkWriteError') {
        console.log('💡 Some packages may have been inserted successfully');
        const existingPackages = await Package.countDocuments();
        console.log(`📦 Current package count: ${existingPackages}`);
      }
    }

  } catch (error) {
    console.error('Error seeding packages:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Utility functions for package management
const getPackageStats = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lab-booking');
    
    const stats = await Package.aggregate([
      {
        $group: {
          _id: null,
          totalPackages: { $sum: 1 },
          activePackages: { $sum: { $cond: ['$isActive', 1, 0] } },
          popularPackages: { $sum: { $cond: ['$isPopular', 1, 0] } },
          recommendedPackages: { $sum: { $cond: ['$isRecommended', 1, 0] } },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);

    const categoryStats = await Package.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const statsData = stats[0] || {};

    console.log('\n📊 Current Package Statistics:');
    console.log(`📦 Total Packages: ${statsData.totalPackages || 0}`);
    console.log(`✅ Active Packages: ${statsData.activePackages || 0}`);
    console.log(`⭐ Popular Packages: ${statsData.popularPackages || 0}`);
    console.log(`🎯 Recommended Packages: ${statsData.recommendedPackages || 0}`);
    console.log(`💰 Average Price: ₹${Math.round(statsData.avgPrice || 0)}`);
    console.log(`💸 Price Range: ₹${statsData.minPrice || 0} - ₹${statsData.maxPrice || 0}`);
    
    console.log('\n📋 Packages by Category:');
    categoryStats.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat._id}: ${cat.count} packages (avg: ₹${Math.round(cat.avgPrice)})`);
    });
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error getting package stats:', error.message);
  }
};

const clearPackages = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lab-booking');
    
    const result = await Package.deleteMany({});
    console.log(`🗑️ Cleared ${result.deletedCount} packages`);
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error clearing packages:', error.message);
  }
};

// Run the seed function
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'stats':
      getPackageStats();
      break;
    case 'clear':
      clearPackages();
      break;
    default:
      seedPackages();
  }
}

module.exports = { seedPackages, getPackageStats, clearPackages };
