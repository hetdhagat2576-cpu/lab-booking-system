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

    // Sample test data - only 13 specific tests with detailed information
    const tests = [
      {
        name: "Post Prandial Blood Sugar (PPBS) Test",
        description: "Measures blood glucose levels 2 hours after a meal to assess glucose tolerance.",
        longDescription: "The Post Prandial Blood Sugar (PPBS) test is crucial for diagnosing diabetes and monitoring glucose control. This test measures how your body processes sugar after a meal, providing insights into insulin function and glucose metabolism. It's particularly useful for detecting post-meal glucose spikes that fasting tests might miss.",
        category: "Diabetes",
        duration: "15 mins",
        preparation: "Eat a normal meal, test exactly 2 hours after finishing",
        sampleType: "Blood",
        price: 199,
        originalPrice: 299,
        discount: 33,
        isActive: true,
        isPopular: true,
        tags: ["diabetes", "glucose", "post-meal"],
        clinicalSignificance: "Helps diagnose diabetes and monitor treatment effectiveness",
        normalRange: "< 140 mg/dL (normal), 140-199 mg/dL (prediabetes), ≥200 mg/dL (diabetes)",
        abnormalIndicates: "Diabetes, insulin resistance, glucose intolerance",
        benefits: [
          "Detects post-meal glucose spikes",
          "Monitors diabetes treatment",
          "Early diabetes detection",
          "Comprehensive glucose assessment"
        ],
        suitableFor: [
          "Diabetes patients",
          "Pre-diabetes individuals",
          "Family history of diabetes",
          "Obese individuals"
        ]
      },
      {
        name: "Fasting Blood Sugar (FBS) Test",
        description: "Measures blood glucose levels after fasting for 8-12 hours.",
        longDescription: "The Fasting Blood Sugar (FBS) test is a fundamental diagnostic tool for diabetes screening and management. This test measures baseline glucose levels when your body is in a fasting state, providing crucial information about your body's ability to regulate blood sugar without the influence of recent food intake.",
        category: "Diabetes",
        duration: "15 mins",
        preparation: "Fast for 8-12 hours before the test",
        sampleType: "Blood",
        price: 149,
        originalPrice: 249,
        discount: 40,
        isActive: true,
        isPopular: true,
        tags: ["diabetes", "glucose", "fasting"],
        clinicalSignificance: "Primary screening test for diabetes and prediabetes",
        normalRange: "< 100 mg/dL (normal), 100-125 mg/dL (prediabetes), ≥126 mg/dL (diabetes)",
        abnormalIndicates: "Diabetes, impaired fasting glucose, metabolic syndrome",
        benefits: [
          "Baseline glucose assessment",
          "Diabetes screening",
          "Treatment monitoring",
          "Early detection"
        ],
        suitableFor: [
          "Adults above 40 years",
          "Diabetes risk individuals",
          "Routine health checkup",
          "Pregnant women"
        ]
      },
      {
        name: "Insulin Fasting Test",
        description: "Measures insulin levels in blood after fasting to assess insulin production.",
        longDescription: "The Insulin Fasting test measures the amount of insulin in your blood after an overnight fast. This test is crucial for evaluating insulin production and function, helping to diagnose conditions like insulin resistance, type 2 diabetes, and pancreatic disorders. It provides valuable information about how your body manages blood sugar regulation.",
        category: "Diabetes",
        duration: "15 mins",
        preparation: "Fast for 8-12 hours before the test",
        sampleType: "Blood",
        price: 399,
        originalPrice: 599,
        discount: 33,
        isActive: true,
        isPopular: false,
        tags: ["diabetes", "insulin", "fasting"],
        clinicalSignificance: "Evaluates insulin production and pancreatic function",
        normalRange: "2.6-24.9 μIU/mL (varies by lab)",
        abnormalIndicates: "Insulin resistance, type 2 diabetes, pancreatic disorders",
        benefits: [
          "Assesses insulin production",
          "Detects insulin resistance",
          "Pancreatic health evaluation",
          "Diabetes management"
        ],
        suitableFor: [
          "Diabetes patients",
          "Insulin resistance suspicion",
          "Metabolic syndrome patients",
          "Weight management patients"
        ]
      },
      {
        name: "Insulin Antibodies",
        description: "Detects antibodies against insulin which can affect diabetes treatment.",
        longDescription: "The Insulin Antibodies test detects the presence of antibodies that your immune system may have produced against insulin. This test is particularly important for patients receiving insulin therapy, as these antibodies can interfere with treatment effectiveness. It's also useful in diagnosing autoimmune conditions related to diabetes.",
        category: "Diabetes",
        duration: "30 mins",
        preparation: "No special preparation required",
        sampleType: "Blood",
        price: 599,
        originalPrice: 899,
        discount: 33,
        isActive: true,
        isPopular: false,
        tags: ["diabetes", "antibodies", "insulin"],
        clinicalSignificance: "Detects autoimmune response to insulin",
        normalRange: "< 5 U/mL (negative)",
        abnormalIndicates: "Autoimmune diabetes, insulin resistance, treatment interference",
        benefits: [
          "Detects insulin antibodies",
          "Guides treatment adjustments",
          "Autoimmune diagnosis",
          "Treatment optimization"
        ],
        suitableFor: [
          "Type 1 diabetes patients",
          "Insulin therapy patients",
          "Autoimmune suspicion",
          "Treatment resistance cases"
        ]
      },
      {
        name: "Typhi Test - IgM",
        description: "Detects IgM antibodies against Salmonella typhi to diagnose typhoid fever.",
        longDescription: "The Typhi IgM test is a rapid diagnostic test that detects IgM antibodies specific to Salmonella typhi, the bacteria responsible for typhoid fever. This test is crucial for early diagnosis and treatment of typhoid fever, especially in areas where the disease is endemic. IgM antibodies indicate recent or current infection.",
        category: "Fever",
        duration: "30 mins",
        preparation: "No special preparation required",
        sampleType: "Blood",
        price: 299,
        originalPrice: 449,
        discount: 33,
        isActive: true,
        isPopular: true,
        tags: ["fever", "typhoid", "antibodies"],
        clinicalSignificance: "Detects recent typhoid infection",
        normalRange: "< 0.5 OD (negative)",
        abnormalIndicates: "Active typhoid fever infection",
        benefits: [
          "Rapid typhoid detection",
          "Early treatment guidance",
          "Infection confirmation",
          "Quick diagnosis"
        ],
        suitableFor: [
          "Fever patients",
          "Typhoid suspicion",
          "Endemic area residents",
          "Travelers to endemic areas"
        ]
      },
      {
        name: "Malarial Parasite Test",
        description: "Detects malaria parasites in blood to diagnose malaria infection.",
        longDescription: "The Malarial Parasite test is a microscopic examination of blood smears to detect Plasmodium parasites, the causative agents of malaria. This test is the gold standard for malaria diagnosis, identifying the specific species and parasite density. Early detection is crucial for effective treatment and preventing complications.",
        category: "Fever",
        duration: "30 mins",
        preparation: "No special preparation required",
        sampleType: "Blood",
        price: 249,
        originalPrice: 399,
        discount: 38,
        isActive: true,
        isPopular: true,
        tags: ["fever", "malaria", "parasites"],
        clinicalSignificance: "Gold standard for malaria diagnosis",
        normalRange: "No parasites detected",
        abnormalIndicates: "Malaria infection with parasite species identification",
        benefits: [
          "Accurate malaria diagnosis",
          "Species identification",
          "Treatment guidance",
          "Severity assessment"
        ],
        suitableFor: [
          "Fever patients",
          "Malaria endemic areas",
          "Recent travelers",
          "Flu-like symptoms"
        ]
      },
      {
        name: "Dengue Ns1 Antigen Rapid Test",
        description: "Detects dengue virus NS1 antigen for early diagnosis of dengue fever.",
        longDescription: "The Dengue NS1 Antigen test is a rapid diagnostic test that detects the NS1 protein, which is secreted by dengue virus-infected cells. This test is highly valuable for early dengue detection, as NS1 antigen can be detected from the first day of fever, even before antibodies appear. Early diagnosis is crucial for proper management and preventing complications.",
        category: "Fever",
        duration: "15 mins",
        preparation: "No special preparation required",
        sampleType: "Blood",
        price: 349,
        originalPrice: 549,
        discount: 36,
        isActive: true,
        isPopular: true,
        tags: ["fever", "dengue", "antigen"],
        clinicalSignificance: "Early dengue detection before antibody development",
        normalRange: "< 0.5 OD (negative)",
        abnormalIndicates: "Active dengue infection",
        benefits: [
          "Early dengue detection",
          "Same-day diagnosis",
          "Treatment guidance",
          "Complication prevention"
        ],
        suitableFor: [
          "High fever patients",
          "Dengue endemic areas",
          "Rash and fever symptoms",
          "Severe headache cases"
        ]
      },
      {
        name: "Albumin Creatinine Ratio (ACR) / Urine For Microalbuminuria Test",
        description: "Measures albumin to creatinine ratio in urine to detect early kidney damage.",
        longDescription: "The Albumin Creatinine Ratio test is a sensitive marker for early kidney damage, particularly in diabetes and hypertension patients. This test measures small amounts of albumin (microalbumin) in urine relative to creatinine, providing early detection of kidney dysfunction before significant damage occurs. Early intervention can prevent progression to chronic kidney disease.",
        category: "Kidney",
        duration: "15 mins",
        preparation: "Clean catch midstream urine sample",
        sampleType: "Urine",
        price: 179,
        originalPrice: 299,
        discount: 40,
        isActive: true,
        isPopular: false,
        tags: ["kidney", "albumin", "creatinine", "urine"],
        clinicalSignificance: "Early detection of kidney damage",
        normalRange: "< 30 mg/g creatinine",
        abnormalIndicates: "Early kidney disease, diabetic nephropathy, hypertension damage",
        benefits: [
          "Early kidney detection",
          "Preventive screening",
          "Treatment monitoring",
          "Disease progression tracking"
        ],
        suitableFor: [
          "Diabetes patients",
          "Hypertension patients",
          "Family history of kidney disease",
          "Long-term medication users"
        ]
      },
      {
        name: "Blood Urea Nitrogen (BUN)/Serum Urea Test",
        description: "Measures urea nitrogen in blood to assess kidney function.",
        longDescription: "The Blood Urea Nitrogen (BUN) test measures the amount of urea nitrogen in your blood, which is a waste product filtered by the kidneys. This test is essential for evaluating kidney function and monitoring kidney disease progression. Elevated BUN levels can indicate impaired kidney function, dehydration, or other conditions affecting kidney performance.",
        category: "Kidney",
        duration: "15 mins",
        preparation: "No special preparation required",
        sampleType: "Blood",
        price: 129,
        originalPrice: 199,
        discount: 35,
        isActive: true,
        isPopular: false,
        tags: ["kidney", "urea", "bun"],
        clinicalSignificance: "Assesses kidney filtration function",
        normalRange: "7-20 mg/dL (varies by lab)",
        abnormalIndicates: "Kidney dysfunction, dehydration, high protein diet, heart failure",
        benefits: [
          "Kidney function monitoring",
          "Disease detection",
          "Treatment guidance",
          "Health status assessment"
        ],
        suitableFor: [
          "Kidney disease patients",
          "Diabetes patients",
          "Hypertension patients",
          "Elderly individuals"
        ]
      },
      {
        name: "Protein Creatinine Ratio (Urine) Test",
        description: "Measures protein to creatinine ratio in urine to assess kidney function.",
        longDescription: "The Protein Creatinine Ratio test measures the amount of protein relative to creatinine in urine, providing a comprehensive assessment of kidney function. This test helps detect and monitor kidney disease, particularly conditions causing protein loss through urine. It's more accurate than measuring protein alone as it accounts for urine concentration.",
        category: "Kidney",
        duration: "15 mins",
        preparation: "Clean catch midstream urine sample",
        sampleType: "Urine",
        price: 149,
        originalPrice: 249,
        discount: 40,
        isActive: true,
        isPopular: false,
        tags: ["kidney", "protein", "creatinine", "urine"],
        clinicalSignificance: "Assesses protein loss and kidney function",
        normalRange: "< 150 mg/g creatinine",
        abnormalIndicates: "Kidney disease, proteinuria, nephrotic syndrome",
        benefits: [
          "Kidney function monitoring",
          "Protein loss detection",
          "Disease progression tracking",
          "Treatment effectiveness"
        ],
        suitableFor: [
          "Kidney disease patients",
          "Diabetes patients",
          "Hypertension patients",
          "Proteinuria suspicion"
        ]
      },
      {
        name: "SGPT / ALT (Alanine Transaminase) Test",
        description: "Measures ALT enzyme levels to assess liver health and function.",
        longDescription: "The SGPT/ALT test measures Alanine Transaminase levels, an enzyme primarily found in liver cells. This test is crucial for detecting liver damage and monitoring liver health. Elevated ALT levels indicate liver cell injury or inflammation, making this test essential for diagnosing liver diseases, monitoring medication effects, and assessing overall liver function.",
        category: "Liver",
        duration: "15 mins",
        preparation: "No special preparation required",
        sampleType: "Blood",
        price: 159,
        originalPrice: 259,
        discount: 39,
        isActive: true,
        isPopular: false,
        tags: ["liver", "alt", "sgpt", "enzymes"],
        clinicalSignificance: "Primary marker for liver cell damage",
        normalRange: "7-56 U/L (varies by lab)",
        abnormalIndicates: "Liver damage, hepatitis, fatty liver, medication toxicity",
        benefits: [
          "Liver damage detection",
          "Disease monitoring",
          "Treatment effectiveness",
          "Health status tracking"
        ],
        suitableFor: [
          "Liver disease patients",
          "Alcohol consumers",
          "Medication users",
          "Routine health screening"
        ]
      },
      {
        name: "Aspartate Aminotransferase (AST / SGOT) Test",
        description: "Measures AST enzyme levels to assess liver health and function.",
        longDescription: "The AST/SGOT test measures Aspartate Aminotransferase levels, an enzyme found in liver, heart, and muscle tissues. This test helps assess liver function and detect tissue damage. While primarily used for liver evaluation, elevated AST can also indicate heart or muscle damage. Often used alongside ALT for comprehensive liver assessment.",
        category: "Liver",
        duration: "15 mins",
        preparation: "No special preparation required",
        sampleType: "Blood",
        price: 159,
        originalPrice: 259,
        discount: 39,
        isActive: true,
        isPopular: false,
        tags: ["liver", "ast", "sgot", "enzymes"],
        clinicalSignificance: "Marker for tissue damage, primarily liver",
        normalRange: "10-40 U/L (varies by lab)",
        abnormalIndicates: "Liver damage, hepatitis, heart disease, muscle injury",
        benefits: [
          "Liver damage detection",
          "Tissue injury assessment",
          "Disease monitoring",
          "Health status evaluation"
        ],
        suitableFor: [
          "Liver disease patients",
          "Heart disease patients",
          "Muscle disorder suspicion",
          "Routine health screening"
        ]
      },
      {
        name: "Anti Thyroperoxidase Antibody (Anti-TPO) Test",
        description: "Detects antibodies against thyroid peroxidase to diagnose autoimmune thyroid conditions.",
        longDescription: "The Anti-TPO test detects antibodies against thyroid peroxidase, an enzyme crucial for thyroid hormone production. This test is essential for diagnosing autoimmune thyroid conditions like Hashimoto's thyroiditis and Graves' disease. Presence of these antibodies indicates the immune system is attacking the thyroid gland, helping differentiate autoimmune from other thyroid disorders.",
        category: "Thyroid",
        duration: "30 mins",
        preparation: "No special preparation required",
        sampleType: "Blood",
        price: 449,
        originalPrice: 699,
        discount: 36,
        isActive: true,
        isPopular: false,
        tags: ["thyroid", "antibodies", "autoimmune", "tpo"],
        clinicalSignificance: "Detects autoimmune thyroid conditions",
        normalRange: "< 35 IU/mL (negative)",
        abnormalIndicates: "Hashimoto's thyroiditis, Graves' disease, autoimmune thyroiditis",
        benefits: [
          "Autoimmune detection",
          "Thyroid disease diagnosis",
          "Treatment guidance",
          "Condition monitoring"
        ],
        suitableFor: [
          "Thyroid disorder patients",
          "Autoimmune suspicion",
          "Family history of thyroid disease",
          "Unexplained thyroid symptoms"
        ]
      },
      {
        name: "Thyroid Stimulating Hormone (TSH) Test",
        description: "Measures TSH levels to assess thyroid function and detect thyroid disorders.",
        longDescription: "The TSH test measures Thyroid Stimulating Hormone levels, which regulate thyroid gland function. This test is the most sensitive indicator of thyroid function, detecting both hyperthyroidism and hypothyroidism. TSH is produced by the pituitary gland and stimulates the thyroid to produce hormones, making it essential for diagnosing and monitoring thyroid disorders.",
        category: "Thyroid",
        duration: "15 mins",
        preparation: "No special preparation required",
        sampleType: "Blood",
        price: 299,
        originalPrice: 449,
        discount: 33,
        isActive: true,
        isPopular: true,
        tags: ["thyroid", "tsh", "hormone"],
        clinicalSignificance: "Primary screening test for thyroid function",
        normalRange: "0.4-4.0 mIU/L (varies by lab)",
        abnormalIndicates: "Hypothyroidism (high TSH), Hyperthyroidism (low TSH)",
        benefits: [
          "Thyroid function monitoring",
          "Disorder detection",
          "Treatment effectiveness",
          "Health status tracking"
        ],
        suitableFor: [
          "Thyroid patients",
          "Women with hormonal issues",
          "Pregnancy planning",
          "Routine health screening"
        ]
      },
      {
        name: "Complete Blood Count (CBC) Test",
        description: "Comprehensive blood test that measures various components of blood including red and white blood cells.",
        longDescription: "The Complete Blood Count (CBC) is one of the most common and important blood tests, providing a comprehensive overview of your overall health. This test measures red blood cells, white blood cells, hemoglobin, hematocrit, and platelets. It helps detect conditions like anemia, infections, bleeding disorders, and various blood diseases, making it essential for routine health screening.",
        category: "General",
        duration: "15 mins",
        preparation: "No special preparation required",
        sampleType: "Blood",
        price: 249,
        originalPrice: 399,
        discount: 38,
        isActive: true,
        isPopular: true,
        tags: ["blood", "cbc", "general", "health"],
        clinicalSignificance: "Comprehensive health screening and disease detection",
        normalRange: "Multiple parameters with specific ranges",
        abnormalIndicates: "Anemia, infections, blood disorders, inflammation",
        benefits: [
          "Comprehensive health assessment",
          "Disease detection",
          "Infection monitoring",
          "Anemia screening"
        ],
        suitableFor: [
          "Routine health screening",
          "Pre-operative assessment",
          "Chronic disease monitoring",
          "Symptom investigation"
        ]
      },
      {
        name: "Lipid Profile Test",
        description: "Measures cholesterol and triglycerides to assess cardiovascular health risk.",
        longDescription: "The Lipid Profile test is essential for assessing cardiovascular health by measuring various types of cholesterol and triglycerides in your blood. This test includes total cholesterol, LDL (bad cholesterol), HDL (good cholesterol), and triglycerides. It helps evaluate heart disease risk, monitor treatment effectiveness, and guide lifestyle and medication interventions for cardiovascular health.",
        category: "Heart",
        duration: "15 mins",
        preparation: "Fast for 10-12 hours before the test",
        sampleType: "Blood",
        price: 349,
        originalPrice: 549,
        discount: 36,
        isActive: true,
        isPopular: true,
        tags: ["heart", "cholesterol", "lipids", "cardiovascular"],
        clinicalSignificance: "Assesses cardiovascular disease risk",
        normalRange: "Total: <200 mg/dL, LDL: <100 mg/dL, HDL: >40 mg/dL, Triglycerides: <150 mg/dL",
        abnormalIndicates: "High cholesterol, cardiovascular risk, metabolic syndrome",
        benefits: [
          "Heart disease risk assessment",
          "Cholesterol monitoring",
          "Treatment guidance",
          "Preventive screening"
        ],
        suitableFor: [
          "Adults above 30 years",
          "Heart disease risk",
          "High cholesterol patients",
          "Routine health screening"
        ]
      },
      {
        name: "Pulmonary Function Test (PFT)",
        description: "Measures lung function including capacity, flow rates, and gas exchange to assess respiratory health.",
        longDescription: "The Pulmonary Function Test (PFT) is a comprehensive evaluation of lung function that measures how well your lungs work. This test assesses lung capacity, airflow rates, gas exchange efficiency, and overall respiratory health. It's crucial for diagnosing conditions like asthma, COPD, and other respiratory disorders, as well as monitoring treatment effectiveness and disease progression.",
        category: "Lungs",
        duration: "30 mins",
        preparation: "Avoid heavy meals and smoking for 2 hours before the test",
        sampleType: "Other",
        price: 599,
        originalPrice: 899,
        discount: 33,
        isActive: true,
        isPopular: false,
        tags: ["lungs", "pulmonary", "respiratory", "breathing"],
        clinicalSignificance: "Comprehensive lung function assessment",
        normalRange: "FEV1: >80% predicted, FVC: >80% predicted",
        abnormalIndicates: "Asthma, COPD, restrictive lung disease, pulmonary disorders",
        benefits: [
          "Lung function assessment",
          "Respiratory disease detection",
          "Treatment monitoring",
          "Health status evaluation"
        ],
        suitableFor: [
          "Asthma patients",
          "COPD patients",
          "Smokers",
          "Respiratory symptoms",
          "Pre-operative assessment"
        ]
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
