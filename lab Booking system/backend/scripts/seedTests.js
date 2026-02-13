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

    // Sample test data - only 13 specific tests
    const tests = [
      {
        name: "Post Prandial Blood Sugar (PPBS) Test",
        description: "Measures blood glucose levels 2 hours after a meal to assess glucose tolerance.",
        category: "Diabetes",
        duration: "15 mins",
        preparation: "Eat a normal meal, test exactly 2 hours after finishing",
        sampleType: "Blood",
        price: 199,
        isActive: true,
        isPopular: true,
        tags: ["diabetes", "glucose", "post-meal"],
      },
      {
        name: "Fasting Blood Sugar (FBS) Test",
        description: "Measures blood glucose levels after fasting for 8-12 hours.",
        category: "Diabetes",
        duration: "15 mins",
        preparation: "Fast for 8-12 hours before the test",
        sampleType: "Blood",
        price: 149,
        isActive: true,
        isPopular: true,
        tags: ["diabetes", "glucose", "fasting"],
      },
      {
        name: "Insulin Fasting Test",
        description: "Measures insulin levels in blood after fasting to assess insulin production.",
        category: "Diabetes",
        duration: "15 mins",
        preparation: "Fast for 8-12 hours before the test",
        sampleType: "Blood",
        price: 399,
        isActive: true,
        isPopular: false,
        tags: ["diabetes", "insulin", "fasting"],
      },
      {
        name: "Insulin Antibodies",
        description: "Detects antibodies against insulin which can affect diabetes treatment.",
        category: "Diabetes",
        duration: "30 mins",
        preparation: "No special preparation required",
        sampleType: "Blood",
        price: 599,
        isActive: true,
        isPopular: false,
        tags: ["diabetes", "antibodies", "insulin"],
      },
      {
        name: "Typhi Test - IgM",
        description: "Detects IgM antibodies against Salmonella typhi to diagnose typhoid fever.",
        category: "Fever",
        duration: "30 mins",
        preparation: "No special preparation required",
        sampleType: "Blood",
        price: 299,
        isActive: true,
        isPopular: true,
        tags: ["fever", "typhoid", "antibodies"],
      },
      {
        name: "Malarial Parasite Test",
        description: "Detects malaria parasites in blood to diagnose malaria infection.",
        category: "Fever",
        duration: "30 mins",
        preparation: "No special preparation required",
        sampleType: "Blood",
        price: 249,
        isActive: true,
        isPopular: true,
        tags: ["fever", "malaria", "parasites"],
      },
      {
        name: "Dengue Ns1 Antigen Rapid Test",
        description: "Detects dengue virus NS1 antigen for early diagnosis of dengue fever.",
        category: "Fever",
        duration: "15 mins",
        preparation: "No special preparation required",
        sampleType: "Blood",
        price: 349,
        isActive: true,
        isPopular: true,
        tags: ["fever", "dengue", "antigen"],
      },
      {
        name: "Albumin Creatinine Ratio (ACR) / Urine For Microalbuminuria Test",
        description: "Measures albumin to creatinine ratio in urine to detect early kidney damage.",
        category: "Kidney",
        duration: "15 mins",
        preparation: "Clean catch midstream urine sample",
        sampleType: "Urine",
        price: 179,
        isActive: true,
        isPopular: false,
        tags: ["kidney", "albumin", "creatinine", "urine"],
      },
      {
        name: "Blood Urea Nitrogen (BUN)/Serum Urea Test",
        description: "Measures urea nitrogen in blood to assess kidney function.",
        category: "Kidney",
        duration: "15 mins",
        preparation: "No special preparation required",
        sampleType: "Blood",
        price: 129,
        isActive: true,
        isPopular: false,
        tags: ["kidney", "urea", "bun"],
      },
      {
        name: "Protein Creatinine Ratio (Urine) Test",
        description: "Measures protein to creatinine ratio in urine to assess kidney function.",
        category: "Kidney",
        duration: "15 mins",
        preparation: "Clean catch midstream urine sample",
        sampleType: "Urine",
        price: 149,
        isActive: true,
        isPopular: false,
        tags: ["kidney", "protein", "creatinine", "urine"],
      },
      {
        name: "SGPT / ALT (Alanine Transaminase) Test",
        description: "Measures ALT enzyme levels to assess liver health and function.",
        category: "Liver",
        duration: "15 mins",
        preparation: "No special preparation required",
        sampleType: "Blood",
        price: 159,
        isActive: true,
        isPopular: false,
        tags: ["liver", "alt", "sgpt", "enzymes"],
      },
      {
        name: "Aspartate Aminotransferase (AST / SGOT) Test",
        description: "Measures AST enzyme levels to assess liver health and function.",
        category: "Liver",
        duration: "15 mins",
        preparation: "No special preparation required",
        sampleType: "Blood",
        price: 159,
        isActive: true,
        isPopular: false,
        tags: ["liver", "ast", "sgot", "enzymes"],
      },
      {
        name: "Anti Thyroperoxidase Antibody (Anti-TPO) Test",
        description: "Detects antibodies against thyroid peroxidase to diagnose autoimmune thyroid conditions.",
        category: "Thyroid",
        duration: "30 mins",
        preparation: "No special preparation required",
        sampleType: "Blood",
        price: 449,
        isActive: true,
        isPopular: false,
        tags: ["thyroid", "antibodies", "autoimmune", "tpo"],
      }
    ];

    // Insert tests
    const insertedTests = await Test.insertMany(tests);
    console.log(`Successfully inserted ${insertedTests.length} tests`);

    // Display inserted tests
    insertedTests.forEach((test, index) => {
      console.log(`${index + 1}. ${test.name} (${test.category})`);
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
