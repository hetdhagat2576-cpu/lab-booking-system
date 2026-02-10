const mongoose = require('mongoose');
const Test = require('../models/test');
require('dotenv').config();

const seedTests = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lab-booking');
    console.log('Connected to MongoDB');

    // Clear existing tests
    await Test.deleteMany({});
    console.log('Cleared existing tests');

    // Sample test data
    const tests = [
      {
        name: "Complete Blood Count (CBC)",
        description: "Comprehensive blood test that measures various components of blood including red blood cells, white blood cells, and platelets.",
        category: "Blood Test",
        price: 450,
        originalPrice: 600,
        duration: "30 mins",
        preparation: "No special preparation required",
        sampleType: "Blood",
        isActive: true,
        isPopular: true,
        tags: ["blood", "routine", "complete"],
      },
      {
        name: "Blood Sugar Fasting",
        description: "Measures the amount of glucose in your blood after fasting for at least 8 hours.",
        category: "Diabetes",
        price: 120,
        originalPrice: 180,
        duration: "15 mins",
        preparation: "Fast for 8-12 hours before the test",
        sampleType: "Blood",
        isActive: true,
        isPopular: true,
        tags: ["diabetes", "glucose", "fasting"],
      },
      {
        name: "HbA1c (Glycated Hemoglobin)",
        description: "Measures your average blood sugar levels over the past 2-3 months.",
        category: "Diabetes",
        price: 350,
        originalPrice: 500,
        duration: "15 mins",
        preparation: "No special preparation required",
        sampleType: "Blood",
        isActive: true,
        isPopular: false,
        tags: ["diabetes", "hba1c", "long-term"],
      },
      {
        name: "Liver Function Test (LFT)",
        description: "Comprehensive panel to assess liver health and function including enzymes, proteins, and bilirubin.",
        category: "Liver",
        price: 650,
        originalPrice: 850,
        duration: "30 mins",
        preparation: "Fast for 10-12 hours before the test",
        sampleType: "Blood",
        isActive: true,
        isPopular: true,
        tags: ["liver", "function", "enzymes"],
      },
      {
        name: "Kidney Function Test (KFT)",
        description: "Evaluates kidney function by measuring creatinine, urea, and electrolytes in blood.",
        category: "Kidney",
        price: 550,
        originalPrice: 750,
        duration: "30 mins",
        preparation: "Drink plenty of water, avoid heavy exercise 24 hours before",
        sampleType: "Blood",
        isActive: true,
        isPopular: false,
        tags: ["kidney", "creatinine", "urea"],
      },
      {
        name: "Thyroid Profile (T3, T4, TSH)",
        description: "Complete thyroid function test measuring T3, T4, and TSH hormones.",
        category: "Thyroid",
        price: 450,
        originalPrice: 650,
        duration: "15 mins",
        preparation: "No special preparation required",
        sampleType: "Blood",
        isActive: true,
        isPopular: true,
        tags: ["thyroid", "hormones", "tsh"],
      },
      {
        name: "Lipid Profile",
        description: "Measures cholesterol and triglycerides in blood to assess cardiovascular risk.",
        category: "Cardiology",
        price: 400,
        originalPrice: 600,
        duration: "30 mins",
        preparation: "Fast for 10-12 hours before the test",
        sampleType: "Blood",
        isActive: true,
        isPopular: false,
        tags: ["cholesterol", "lipids", "heart"],
      },
      {
        name: "Urine Routine & Microscopy",
        description: "Complete urine analysis including physical, chemical, and microscopic examination.",
        category: "Urine Test",
        price: 150,
        originalPrice: 250,
        duration: "15 mins",
        preparation: "Clean catch midstream urine sample, first morning sample preferred",
        sampleType: "Urine",
        isActive: true,
        isPopular: false,
        tags: ["urine", "routine", "microscopy"],
      },
      {
        name: "Chest X-Ray PA View",
        description: "Radiographic examination of the chest including heart, lungs, and major blood vessels.",
        category: "Imaging",
        price: 300,
        originalPrice: 450,
        duration: "15 mins",
        preparation: "Remove jewelry and metallic objects, wear loose clothing",
        sampleType: "Other",
        isActive: true,
        isPopular: false,
        tags: ["xray", "chest", "imaging"],
      },
      {
        name: "Vitamin D Test",
        description: "Measures the level of vitamin D in your blood to check for deficiency or excess.",
        category: "General",
        price: 800,
        originalPrice: 1200,
        duration: "15 mins",
        preparation: "No special preparation required",
        sampleType: "Blood",
        isActive: true,
        isPopular: true,
        tags: ["vitamin", "deficiency", "bones"],
      },
      {
        name: "CRP (C-Reactive Protein)",
        description: "Measures the level of C-reactive protein to detect inflammation in the body.",
        category: "General",
        price: 350,
        originalPrice: 500,
        duration: "15 mins",
        preparation: "No special preparation required",
        sampleType: "Blood",
        isActive: true,
        isPopular: false,
        tags: ["inflammation", "crp", "infection"],
      },
      {
        name: "ESR (Erythrocyte Sedimentation Rate)",
        description: "Measures how quickly red blood cells settle at the bottom of a test tube.",
        category: "Blood Test",
        price: 120,
        originalPrice: 200,
        duration: "30 mins",
        preparation: "No special preparation required",
        sampleType: "Blood",
        isActive: true,
        isPopular: false,
        tags: ["esr", "inflammation", "blood"],
      }
    ];

    // Insert tests
    const insertedTests = await Test.insertMany(tests);
    console.log(`Successfully inserted ${insertedTests.length} tests`);

    // Display inserted tests
    insertedTests.forEach((test, index) => {
      console.log(`${index + 1}. ${test.name} - ₹${test.price} (${test.category})`);
    });

  } catch (error) {
    console.error('Error seeding tests:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the seed function
if (require.main === module) {
  seedTests();
}

module.exports = seedTests;
