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
        price: 119,
        originalPrice: 299,
        duration: "15 mins",
        preparation: "Eat a normal meal, test exactly 2 hours after finishing",
        sampleType: "Blood",
        isActive: true,
        isPopular: true,
        tags: ["diabetes", "glucose", "post-meal"],
      },
      {
        name: "Fasting Blood Sugar (FBS) Test",
        description: "Measures blood glucose levels after fasting for 8-12 hours.",
        category: "Diabetes",
        price: 119,
        originalPrice: 299,
        duration: "15 mins",
        preparation: "Fast for 8-12 hours before the test",
        sampleType: "Blood",
        isActive: true,
        isPopular: true,
        tags: ["diabetes", "glucose", "fasting"],
      },
      {
        name: "Insulin Fasting Test",
        description: "Measures insulin levels in blood after fasting to assess insulin production.",
        category: "Diabetes",
        price: 459,
        originalPrice: 849,
        duration: "15 mins",
        preparation: "Fast for 8-12 hours before the test",
        sampleType: "Blood",
        isActive: true,
        isPopular: false,
        tags: ["diabetes", "insulin", "fasting"],
      },
      {
        name: "Insulin Antibodies",
        description: "Detects antibodies against insulin which can affect diabetes treatment.",
        category: "Diabetes",
        price: 999,
        originalPrice: 1649,
        duration: "30 mins",
        preparation: "No special preparation required",
        sampleType: "Blood",
        isActive: true,
        isPopular: false,
        tags: ["diabetes", "antibodies", "insulin"],
      },
      {
        name: "Typhi Test - IgM",
        description: "Detects IgM antibodies against Salmonella typhi to diagnose typhoid fever.",
        category: "Fever",
        price: 399,
        originalPrice: 549,
        duration: "30 mins",
        preparation: "No special preparation required",
        sampleType: "Blood",
        isActive: true,
        isPopular: true,
        tags: ["fever", "typhoid", "antibodies"],
      },
      {
        name: "Malarial Parasite Test",
        description: "Detects malaria parasites in blood to diagnose malaria infection.",
        category: "Fever",
        price: 399,
        originalPrice: 549,
        duration: "30 mins",
        preparation: "No special preparation required",
        sampleType: "Blood",
        isActive: true,
        isPopular: true,
        tags: ["fever", "malaria", "parasites"],
      },
      {
        name: "Dengue Ns1 Antigen Rapid Test",
        description: "Detects dengue virus NS1 antigen for early diagnosis of dengue fever.",
        category: "Fever",
        price: 499,
        originalPrice: 649,
        duration: "15 mins",
        preparation: "No special preparation required",
        sampleType: "Blood",
        isActive: true,
        isPopular: true,
        tags: ["fever", "dengue", "antigen"],
      },
      {
        name: "Albumin Creatinine Ratio (ACR) / Urine For Microalbuminuria Test",
        description: "Measures albumin to creatinine ratio in urine to detect early kidney damage.",
        category: "Kidney",
        price: 669,
        originalPrice: 1299,
        duration: "15 mins",
        preparation: "Clean catch midstream urine sample",
        sampleType: "Urine",
        isActive: true,
        isPopular: false,
        tags: ["kidney", "albumin", "creatinine", "urine"],
      },
      {
        name: "Blood Urea Nitrogen (BUN)/Serum Urea Test",
        description: "Measures urea nitrogen in blood to assess kidney function.",
        category: "Kidney",
        price: 125,
        originalPrice: 249,
        duration: "15 mins",
        preparation: "No special preparation required",
        sampleType: "Blood",
        isActive: true,
        isPopular: false,
        tags: ["kidney", "urea", "bun"],
      },
      {
        name: "Protein Creatinine Ratio (Urine) Test",
        description: "Measures protein to creatinine ratio in urine to assess kidney function.",
        category: "Kidney",
        price: 299,
        originalPrice: 599,
        duration: "15 mins",
        preparation: "Clean catch midstream urine sample",
        sampleType: "Urine",
        isActive: true,
        isPopular: false,
        tags: ["kidney", "protein", "creatinine", "urine"],
      },
      {
        name: "SGPT / ALT (Alanine Transaminase) Test",
        description: "Measures ALT enzyme levels to assess liver health and function.",
        category: "Liver",
        price: 175,
        originalPrice: 349,
        duration: "15 mins",
        preparation: "No special preparation required",
        sampleType: "Blood",
        isActive: true,
        isPopular: false,
        tags: ["liver", "alt", "sgpt", "enzymes"],
      },
      {
        name: "Aspartate Aminotransferase (AST / SGOT) Test",
        description: "Measures AST enzyme levels to assess liver health and function.",
        category: "Liver",
        price: 175,
        originalPrice: 399,
        duration: "15 mins",
        preparation: "No special preparation required",
        sampleType: "Blood",
        isActive: true,
        isPopular: false,
        tags: ["liver", "ast", "sgot", "enzymes"],
      },
      {
        name: "Anti Thyroperoxidase Antibody (Anti-TPO) Test",
        description: "Detects antibodies against thyroid peroxidase to diagnose autoimmune thyroid conditions.",
        category: "Thyroid",
        price: 1099,
        originalPrice: 1399,
        duration: "30 mins",
        preparation: "No special preparation required",
        sampleType: "Blood",
        isActive: true,
        isPopular: false,
        tags: ["thyroid", "antibodies", "autoimmune", "tpo"],
      },
      {
        name: "Thyroxine (T4) Test",
        description: "Measures thyroxine hormone levels to assess thyroid function.",
        category: "Thyroid",
        price: 175,
        originalPrice: 299,
        duration: "15 mins",
        preparation: "No special preparation required",
        sampleType: "Blood",
        isActive: true,
        isPopular: false,
        tags: ["thyroid", "t4", "hormones"],
      },
      {
        name: "Triiodothyronine (T3) Test",
        description: "Measures triiodothyronine hormone levels to assess thyroid function.",
        category: "Thyroid",
        price: 175,
        originalPrice: 349,
        duration: "15 mins",
        preparation: "No special preparation required",
        sampleType: "Blood",
        isActive: true,
        isPopular: false,
        tags: ["thyroid", "t3", "hormones"],
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
