const fs = require('fs');
const path = './data/seed-schemes.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));
const batch5 = [
  {
    "externalId": "SEED-MISC-001",
    "sourceSystem": "CuratedSeed",
    "title": "PM Street Vendor's AtmaNirbhar Nidhi (PM SVANidhi)",
    "shortDescription": "A special micro-credit facility for street vendors to resume their livelihoods.",
    "description": "PM SVANidhi was launched to help street vendors resume their livelihood activities impacted by COVID-19. It provides affordable collateral-free working capital loans to street vendors.",
    "benefits": "Provides collateral-free working capital loan up to Rs. 10,000 for a 1-year tenure. Enhanced loan limits (up to Rs. 20,000 and Rs. 50,000) are available on timely repayment. Includes 7% interest subvention.",
    "applicationUrl": "https://pmsvanidhi.mohua.gov.in/",
    "sourceUrl": "https://pmsvanidhi.mohua.gov.in/",
    "ministry": "Ministry of Housing and Urban Affairs",
    "state": "All India",
    "language": "en",
    "categoryName": "Employment & Skill Development",
    "secondaryCategories": ["Micro Credit", "Street Vendors", "Financial Assistance"],
    "governmentLevel": "CENTRAL",
    "verificationStatus": "VERIFIED",
    "applicationProcess": "Vendors can apply directly on the PM SVANidhi portal or through a Common Service Centre (CSC) or Banking Correspondent (BC).",
    "faq": [
      {
        "question": "Is collateral required for the loan?",
        "answer": "No, the loan is entirely collateral-free."
      }
    ],
    "eligibility": [
      { "attribute": "occupation", "operator": "==", "value": "Street Vendor" }
    ],
    "requiredDocuments": [
      "Aadhaar Card",
      "Vending Certificate/ID Card issued by Urban Local Body"
    ]
  },
  {
    "externalId": "SEED-MISC-002",
    "sourceSystem": "CuratedSeed",
    "title": "Pradhan Mantri Suraksha Bima Yojana (PMSBY)",
    "shortDescription": "A highly affordable accidental death and disability insurance scheme.",
    "description": "PMSBY provides affordable insurance coverage for accidental death and disability. It is available to people in the age group 18 to 70 years with a bank or post office account who give their consent to join and enable auto-debit.",
    "benefits": "Provides risk coverage of Rs. 2 Lakh for accidental death and full disability, and Rs. 1 Lakh for partial disability, at an annual premium of just Rs. 20.",
    "applicationUrl": "https://jansuraksha.gov.in/",
    "sourceUrl": "https://financialservices.gov.in/",
    "ministry": "Ministry of Finance",
    "state": "All India",
    "language": "en",
    "categoryName": "Senior Citizens & Social Welfare",
    "secondaryCategories": ["Insurance", "Accident Cover", "Social Security"],
    "governmentLevel": "CENTRAL",
    "verificationStatus": "VERIFIED",
    "applicationProcess": "Enrollment is done by submitting a simple form and auto-debit consent at the bank or post office where the individual holds a savings account.",
    "faq": [
      {
        "question": "What is the annual premium amount?",
        "answer": "The premium is Rs. 20 per annum, deducted automatically from the bank account."
      }
    ],
    "eligibility": [
      { "attribute": "age", "operator": ">=", "value": "18" },
      { "attribute": "age", "operator": "<=", "value": "70" }
    ],
    "requiredDocuments": [
      "Bank Savings Account details",
      "Aadhaar Card"
    ]
  },
  {
    "externalId": "SEED-MISC-003",
    "sourceSystem": "CuratedSeed",
    "title": "Pradhan Mantri Kisan Maan Dhan Yojana (PM-KMY)",
    "shortDescription": "A voluntary and contributory pension scheme for Small and Marginal Farmers (SMF).",
    "description": "PM-KMY is an old age pension scheme for Small and Marginal Farmers (SMFs). It serves as a social security net as they have minimal or no savings and do not have other sources of livelihood when they reach old age.",
    "benefits": "Provides a guaranteed minimum pension of Rs. 3,000 per month after attaining the age of 60 years. The Central Government matches the farmer's monthly contribution (Rs. 55 to Rs. 200 depending on entry age).",
    "applicationUrl": "https://maandhan.in/",
    "sourceUrl": "https://agricoop.nic.in/",
    "ministry": "Ministry of Agriculture and Farmers Welfare",
    "state": "All India",
    "language": "en",
    "categoryName": "Farmers",
    "secondaryCategories": ["Pension", "Social Security", "Agriculture"],
    "governmentLevel": "CENTRAL",
    "verificationStatus": "VERIFIED",
    "applicationProcess": "Farmers can enroll through the nearest Common Service Centre (CSC) or online through the Maandhan portal by paying the initial contribution.",
    "faq": [
      {
        "question": "Who is considered a Small and Marginal Farmer?",
        "answer": "Farmers who own cultivable land up to 2 hectares as per land records of the concerned State/UT."
      }
    ],
    "eligibility": [
      { "attribute": "occupation", "operator": "==", "value": "Farmer" },
      { "attribute": "age", "operator": ">=", "value": "18" },
      { "attribute": "age", "operator": "<=", "value": "40" },
      { "attribute": "landOwnership", "operator": "<=", "value": "2 hectares" }
    ],
    "requiredDocuments": [
      "Aadhaar Card",
      "Savings Bank Account details",
      "Khasra/Khatauni (Land records)"
    ]
  },
  {
    "externalId": "SEED-MISC-004",
    "sourceSystem": "CuratedSeed",
    "title": "Pradhan Mantri Matsya Sampada Yojana (PMMSY)",
    "shortDescription": "A flagship scheme for focused and sustainable development of the fisheries sector in India.",
    "description": "PMMSY aims to bring about the Blue Revolution through sustainable and responsible development of the fisheries sector in India. It addresses critical gaps in fish production and productivity, quality, technology, post-harvest infrastructure, and management.",
    "benefits": "Provides financial assistance for establishment of new freshwater/marine finfish hatcheries, construction of ponds, provision of boats and nets, and cold chain infrastructure.",
    "applicationUrl": "https://pmmsy.dof.gov.in/",
    "sourceUrl": "https://dof.gov.in/pmmsy",
    "ministry": "Ministry of Fisheries, Animal Husbandry and Dairying",
    "state": "All India",
    "language": "en",
    "categoryName": "Farmers",
    "secondaryCategories": ["Fisheries", "Agriculture Allied", "Infrastructure"],
    "governmentLevel": "CENTRAL",
    "verificationStatus": "VERIFIED",
    "applicationProcess": "Beneficiaries must submit detailed project proposals through the respective State/UT Fisheries Department.",
    "faq": [
      {
        "question": "What is the subsidy pattern for general category?",
        "answer": "The subsidy is generally up to 40% of the project cost for General category, and 60% for SC/ST/Women category."
      }
    ],
    "eligibility": [
      { "attribute": "occupation", "operator": "IN", "value": "Fisher/Fish Farmer/Fish Worker/Entrepreneur" }
    ],
    "requiredDocuments": [
      "Aadhaar Card",
      "Detailed Project Report (DPR)",
      "Land possession certificates (for infrastructure projects)"
    ]
  },
  {
    "externalId": "SEED-MISC-005",
    "sourceSystem": "CuratedSeed",
    "title": "SVAMITVA Scheme",
    "shortDescription": "Provides rural people with the right to document their residential properties to use as a financial asset.",
    "description": "SVAMITVA (Survey of Villages and Mapping with Improvised Technology in Village Areas) aims to provide property rights to the residents of rural inhabited areas. It uses drone technology to map parcels of land, paving the way for using property as a financial asset for taking loans.",
    "benefits": "Provides a 'Property Card' to rural households, establishing clear ownership which can be used to avail bank loans and resolve property disputes.",
    "applicationUrl": "https://svamitva.nic.in/",
    "sourceUrl": "https://svamitva.nic.in/",
    "ministry": "Ministry of Panchayati Raj",
    "state": "All India",
    "language": "en",
    "categoryName": "Housing",
    "secondaryCategories": ["Rural Development", "Property Rights", "Digitization"],
    "governmentLevel": "CENTRAL",
    "verificationStatus": "VERIFIED",
    "applicationProcess": "This is an administrative scheme. State revenue departments and the Survey of India conduct drone surveys. Property cards are automatically distributed to villagers after the survey and dispute resolution period.",
    "faq": [
      {
        "question": "Can I apply for a survey individually?",
        "answer": "No, surveys are conducted on a village-wide basis systematically by the State Government."
      }
    ],
    "eligibility": [
      { "attribute": "residence", "operator": "==", "value": "Rural" },
      { "attribute": "houseOwnership", "operator": "==", "value": "Owned" }
    ],
    "requiredDocuments": []
  },
  {
    "externalId": "SEED-MISC-006",
    "sourceSystem": "CuratedSeed",
    "title": "Innovation in Science Pursuit for Inspired Research (INSPIRE) Scholarship",
    "shortDescription": "Provides scholarships for higher education to attract talented youth to study basic and natural sciences.",
    "description": "The INSPIRE Scholarship (SHE) aims to encourage young, meritorious students to pursue undergraduate and postgraduate courses in Basic and Natural Sciences. The objective is to build the required critical human resource pool for strengthening and expanding the R&D base.",
    "benefits": "Provides a scholarship of Rs. 80,000 per annum (Rs. 60k cash + Rs. 20k mentorship grant) for 5 years while pursuing B.Sc/M.Sc or Integrated M.Sc/M.S.",
    "applicationUrl": "https://online-inspire.gov.in/",
    "sourceUrl": "https://online-inspire.gov.in/",
    "ministry": "Ministry of Science and Technology (DST)",
    "state": "All India",
    "language": "en",
    "categoryName": "Students",
    "secondaryCategories": ["Scholarship", "Higher Education", "Science & Research"],
    "governmentLevel": "CENTRAL",
    "verificationStatus": "VERIFIED",
    "applicationProcess": "Students must apply online on the INSPIRE portal after securing admission in a recognized college/university in eligible science subjects.",
    "faq": [
      {
        "question": "Who is eligible based on marks?",
        "answer": "Students who happen to be among the top 1% in their 12th standard board exams or rank within the top 10,000 in JEE/NEET."
      }
    ],
    "eligibility": [
      { "attribute": "occupation", "operator": "==", "value": "Student" },
      { "attribute": "age", "operator": ">=", "value": "17" },
      { "attribute": "age", "operator": "<=", "value": "22" }
    ],
    "requiredDocuments": [
      "Class 12th Board Marksheet",
      "Endorsement Certificate from College Principal",
      "SBI Bank Account Details"
    ]
  },
  {
    "externalId": "SEED-MISC-007",
    "sourceSystem": "CuratedSeed",
    "title": "National Career Service (NCS)",
    "shortDescription": "A national portal that brings together job seekers, employers, and skill providers on a single platform.",
    "description": "NCS is a one-stop solution that provides a wide array of employment and career-related services to the citizens of India. It works towards bridging the gap between job seekers and employers, candidates seeking training and skill providers, and candidates seeking career guidance.",
    "benefits": "Free access to job postings across India, career counseling services, skill training directories, and participation in online/offline job fairs.",
    "applicationUrl": "https://www.ncs.gov.in/",
    "sourceUrl": "https://www.ncs.gov.in/",
    "ministry": "Ministry of Labour and Employment",
    "state": "All India",
    "language": "en",
    "categoryName": "Employment & Skill Development",
    "secondaryCategories": ["Job Portal", "Career Counseling", "Employment"],
    "governmentLevel": "CENTRAL",
    "verificationStatus": "VERIFIED",
    "applicationProcess": "Job seekers can register on the NCS portal for free by creating an account and completing their profile and resume details.",
    "faq": [
      {
        "question": "Is there any fee for registration on NCS?",
        "answer": "No, registration and all services on the NCS portal are completely free of charge."
      }
    ],
    "eligibility": [
      { "attribute": "nationality", "operator": "==", "value": "Indian" }
    ],
    "requiredDocuments": [
      "Aadhaar Card / PAN Card (for ID verification)",
      "Educational certificates",
      "Resume/CV"
    ]
  },
  {
    "externalId": "SEED-MISC-008",
    "sourceSystem": "CuratedSeed",
    "title": "Atal Innovation Mission (AIM)",
    "shortDescription": "A flagship initiative to promote a culture of innovation and entrepreneurship in the country.",
    "description": "AIM establishes Atal Tinkering Labs (ATLs) in schools across India to foster curiosity and innovation in young minds. It also supports startups through Atal Incubation Centres (AICs) and Atal Community Innovation Centres (ACICs).",
    "benefits": "Schools get a grant-in-aid of Rs. 20 Lakh to set up an ATL. Incubators get up to Rs. 10 Crore scale-up support to foster startups.",
    "applicationUrl": "https://aim.gov.in/",
    "sourceUrl": "https://aim.gov.in/",
    "ministry": "NITI Aayog",
    "state": "All India",
    "language": "en",
    "categoryName": "MSME & Entrepreneurship",
    "secondaryCategories": ["Innovation", "Education", "Startup"],
    "governmentLevel": "CENTRAL",
    "verificationStatus": "VERIFIED",
    "applicationProcess": "Schools or organizations must apply online when AIM opens the application window for ATLs or AICs. Proposals undergo rigorous screening by NITI Aayog.",
    "faq": [
      {
        "question": "Can private schools apply for ATL?",
        "answer": "Yes, both government and private schools can apply for setting up an Atal Tinkering Lab."
      }
    ],
    "eligibility": [
      { "attribute": "organizationType", "operator": "IN", "value": "School,University,NGO,Startup" }
    ],
    "requiredDocuments": [
      "Institution Registration Details",
      "Infrastructure availability proof (for ATL/AIC)"
    ]
  }
];

const updatedData = [...data, ...batch5];
fs.writeFileSync(path, JSON.stringify(updatedData, null, 2));
console.log('Successfully appended 8 schemes. Total:', updatedData.length);
