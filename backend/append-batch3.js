const fs = require('fs');
const path = './data/seed-schemes.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));
const batch3 = [
  {
    "externalId": "SEED-EMP-001",
    "sourceSystem": "CuratedSeed",
    "title": "Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA)",
    "shortDescription": "Provides at least 100 days of guaranteed wage employment in a financial year to every rural household.",
    "description": "MGNREGA is one of the largest work guarantee programmes in the world. It aims to enhance livelihood security in rural areas by providing at least 100 days of guaranteed wage employment in a financial year to every household whose adult members volunteer to do unskilled manual work.",
    "benefits": "Guaranteed 100 days of wage employment per year. If work is not provided within 15 days of demanding it, an unemployment allowance is given.",
    "applicationUrl": "https://nrega.nic.in/",
    "sourceUrl": "https://nrega.nic.in/",
    "ministry": "Ministry of Rural Development",
    "state": "All India",
    "language": "en",
    "categoryName": "Employment & Skill Development",
    "secondaryCategories": ["Rural Development", "Wage Employment", "Social Welfare"],
    "governmentLevel": "CENTRAL",
    "verificationStatus": "VERIFIED",
    "applicationProcess": "Adult members of rural households submit their name, age, and address to the Gram Panchayat. The Gram Panchayat registers households and issues a Job Card, which is essential to demand work.",
    "faq": [
      {
        "question": "What happens if work is not provided within 15 days?",
        "answer": "The applicant is entitled to a daily unemployment allowance, which is paid by the State Government."
      }
    ],
    "eligibility": [
      { "attribute": "residence", "operator": "==", "value": "Rural" },
      { "attribute": "age", "operator": ">=", "value": "18" }
    ],
    "requiredDocuments": [
      "Aadhaar Card",
      "Voter ID / Ration Card",
      "Bank Account details",
      "Passport size photographs"
    ]
  },
  {
    "externalId": "SEED-EMP-002",
    "sourceSystem": "CuratedSeed",
    "title": "Pradhan Mantri Kaushal Vikas Yojana (PMKVY)",
    "shortDescription": "A skill development scheme to enable Indian youth to take up industry-relevant skill training.",
    "description": "PMKVY is the flagship scheme of the Ministry of Skill Development & Entrepreneurship (MSDE). The objective of this Skill Certification Scheme is to enable a large number of Indian youth to take up industry-relevant skill training that will help them in securing a better livelihood.",
    "benefits": "Provides free skill training in various industry-relevant sectors. Also provides placement assistance and a recognized certificate upon successful completion.",
    "applicationUrl": "https://www.pmkvyofficial.org/",
    "sourceUrl": "https://www.pmkvyofficial.org/",
    "ministry": "Ministry of Skill Development and Entrepreneurship",
    "state": "All India",
    "language": "en",
    "categoryName": "Employment & Skill Development",
    "secondaryCategories": ["Skill Training", "Youth", "Employment"],
    "governmentLevel": "CENTRAL",
    "verificationStatus": "VERIFIED",
    "applicationProcess": "Candidates can enroll via the Skill India Digital portal or visit an authorized PMKVY training center for counseling and enrollment.",
    "faq": [
      {
        "question": "Do I have to pay any fee for the training?",
        "answer": "No, the entire cost of training and assessment is paid by the Government of India."
      }
    ],
    "eligibility": [
      { "attribute": "occupation", "operator": "IN", "value": "Unemployed,School Dropout,College Dropout" },
      { "attribute": "nationality", "operator": "==", "value": "Indian" }
    ],
    "requiredDocuments": [
      "Aadhaar Card",
      "Bank Account details",
      "Education certificates"
    ]
  },
  {
    "externalId": "SEED-MSME-001",
    "sourceSystem": "CuratedSeed",
    "title": "Pradhan Mantri Mudra Yojana (PMMY)",
    "shortDescription": "Provides loans up to Rs. 10 Lakhs to non-corporate, non-farm small/micro enterprises.",
    "description": "MUDRA stands for Micro Units Development & Refinance Agency Ltd. The PMMY scheme provides financing support to micro business units. The loans are classified into three categories: Shishu (up to Rs. 50,000), Kishore (Rs. 50,000 to Rs. 5 lakh), and Tarun (Rs. 5 lakh to Rs. 10 lakh).",
    "benefits": "Collateral-free loans up to Rs. 10 Lakhs for setting up new enterprises or expanding existing ones in manufacturing, trading, or service sectors.",
    "applicationUrl": "https://www.mudra.org.in/",
    "sourceUrl": "https://www.mudra.org.in/",
    "ministry": "Ministry of Finance",
    "state": "All India",
    "language": "en",
    "categoryName": "MSME & Entrepreneurship",
    "secondaryCategories": ["Business Loan", "Credit", "Financial Assistance"],
    "governmentLevel": "CENTRAL",
    "verificationStatus": "VERIFIED",
    "applicationProcess": "Borrowers can approach any commercial bank, RRB, small finance bank, cooperative bank, MFI, or NBFC, or apply online through the Udyamimitra portal.",
    "faq": [
      {
        "question": "Is collateral required for Mudra loans?",
        "answer": "No, loans up to Rs. 10 Lakh under PMMY are entirely collateral-free."
      }
    ],
    "eligibility": [
      { "attribute": "businessType", "operator": "IN", "value": "Non-Corporate,Non-Farm,Micro Enterprise" }
    ],
    "requiredDocuments": [
      "Identity Proof (Aadhaar, PAN)",
      "Address Proof",
      "Business Plan/Project Report",
      "Quotation of machinery/items to be purchased"
    ]
  },
  {
    "externalId": "SEED-MSME-002",
    "sourceSystem": "CuratedSeed",
    "title": "PM Vishwakarma Yojana",
    "shortDescription": "Provides end-to-end holistic support to traditional artisans and craftspeople scaling their business.",
    "description": "PM Vishwakarma is a new Central Sector Scheme aimed at supporting traditional artisans and craftspeople of rural and urban India. It offers recognition, skill upgradation, toolkit incentives, credit support, incentive for digital transactions, and marketing support.",
    "benefits": "Provides a PM Vishwakarma Certificate & ID card, toolkit incentive of Rs. 15,000, collateral-free credit support up to Rs. 3 lakh (in two tranches) at a concessional interest rate of 5%, and a stipend during skill training.",
    "applicationUrl": "https://pmvishwakarma.gov.in/",
    "sourceUrl": "https://pmvishwakarma.gov.in/",
    "ministry": "Ministry of Micro, Small and Medium Enterprises",
    "state": "All India",
    "language": "en",
    "categoryName": "MSME & Entrepreneurship",
    "secondaryCategories": ["Artisans", "Skill Development", "Credit"],
    "governmentLevel": "CENTRAL",
    "verificationStatus": "VERIFIED",
    "applicationProcess": "Artisans must register on the PM Vishwakarma portal through Common Service Centres (CSCs). Verification is done via a three-tier process by the Gram Panchayat, District Implementation Committee, and State Committee.",
    "faq": [
      {
        "question": "Are all artisans covered?",
        "answer": "The scheme initially covers 18 traditional trades such as Carpenter, Boat Maker, Blacksmith, Potter, Sculptor, Cobbler, Tailor, Washerman, etc."
      }
    ],
    "eligibility": [
      { "attribute": "occupation", "operator": "==", "value": "Traditional Artisan/Craftsperson" },
      { "attribute": "age", "operator": ">=", "value": "18" }
    ],
    "requiredDocuments": [
      "Aadhaar Card",
      "Mobile Number",
      "Bank Account details",
      "Ration Card"
    ]
  },
  {
    "externalId": "SEED-MSME-003",
    "sourceSystem": "CuratedSeed",
    "title": "Stand-Up India Scheme",
    "shortDescription": "Facilitates bank loans between Rs. 10 lakh and Rs. 1 Crore to at least one SC/ST borrower and at least one woman borrower per bank branch.",
    "description": "The objective of the Stand-Up India scheme is to facilitate bank loans between Rs. 10 lakh and Rs. 1 Crore to at least one Scheduled Caste (SC) or Scheduled Tribe (ST) borrower and at least one woman borrower per bank branch for setting up a greenfield (new) enterprise.",
    "benefits": "Facilitates substantial credit (Rs. 10 Lakh to Rs. 1 Crore) for new enterprises in manufacturing, services, agri-allied activities, or the trading sector.",
    "applicationUrl": "https://www.standupmitra.in/",
    "sourceUrl": "https://www.standupmitra.in/",
    "ministry": "Ministry of Finance",
    "state": "All India",
    "language": "en",
    "categoryName": "MSME & Entrepreneurship",
    "secondaryCategories": ["Women Empowerment", "SC/ST", "Credit", "Business Loan"],
    "governmentLevel": "CENTRAL",
    "verificationStatus": "VERIFIED",
    "applicationProcess": "Applications can be made directly at a bank branch, through the Stand-Up India portal online, or through the Lead District Manager.",
    "faq": [
      {
        "question": "Can an existing business apply for this loan?",
        "answer": "No, the loan is strictly for setting up a new 'greenfield' enterprise."
      }
    ],
    "eligibility": [
      { "attribute": "age", "operator": ">=", "value": "18" },
      { "attribute": "category", "operator": "IN", "value": "SC,ST,Women" },
      { "attribute": "businessStage", "operator": "==", "value": "Greenfield" }
    ],
    "requiredDocuments": [
      "Identity and Address Proof",
      "Caste Certificate (if applicable)",
      "Project Report",
      "Clearance from pollution control board (if necessary)"
    ]
  },
  {
    "externalId": "SEED-MSME-004",
    "sourceSystem": "CuratedSeed",
    "title": "Startup India Seed Fund Scheme (SISFS)",
    "shortDescription": "Provides financial assistance to startups for proof of concept, prototype development, product trials, market entry, and commercialization.",
    "description": "SISFS aims to provide financial assistance to startups to support them in their early stages. This enables startups to graduate to a level where they will be able to raise investments from angel investors or venture capitalists, or seek loans from commercial banks.",
    "benefits": "Up to Rs. 20 Lakhs as grant for validation of Proof of Concept, or up to Rs. 50 Lakhs of investment for market entry, commercialization, or scaling up.",
    "applicationUrl": "https://seedfund.startupindia.gov.in/",
    "sourceUrl": "https://seedfund.startupindia.gov.in/",
    "ministry": "Department for Promotion of Industry and Internal Trade (DPIIT)",
    "state": "All India",
    "language": "en",
    "categoryName": "MSME & Entrepreneurship",
    "secondaryCategories": ["Startup", "Seed Fund", "Innovation"],
    "governmentLevel": "CENTRAL",
    "verificationStatus": "VERIFIED",
    "applicationProcess": "Startups must apply online on the Startup India Seed Fund portal. The application is evaluated by an incubator-level Seed Management Committee (ISMC).",
    "faq": [
      {
        "question": "Is DPIIT recognition mandatory?",
        "answer": "Yes, a startup must be recognized by DPIIT and incorporated not more than 2 years ago at the time of application."
      }
    ],
    "eligibility": [
      { "attribute": "recognition", "operator": "==", "value": "DPIIT Recognized Startup" },
      { "attribute": "ageOfCompany", "operator": "<=", "value": "2 years" }
    ],
    "requiredDocuments": [
      "Certificate of Incorporation",
      "DPIIT Recognition Certificate",
      "Pitch Deck / Business Plan",
      "Details of core team"
    ]
  },
  {
    "externalId": "SEED-EMP-003",
    "sourceSystem": "CuratedSeed",
    "title": "Prime Minister's Employment Generation Programme (PMEGP)",
    "shortDescription": "A credit-linked subsidy program to generate employment opportunities by setting up micro-enterprises in rural and urban areas.",
    "description": "PMEGP is a major credit-linked subsidy programme implemented by Khadi and Village Industries Commission (KVIC). It aims to generate self-employment opportunities through the establishment of micro-enterprises in the non-farm sector. It brings together widely dispersed traditional artisans and unemployed youth to provide them self-employment opportunities.",
    "benefits": "Maximum project cost of Rs. 50 lakh in the manufacturing sector and Rs. 20 lakh in the service sector. Provides a government subsidy ranging from 15% to 35% of the project cost depending on the applicant's category and location.",
    "applicationUrl": "https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp",
    "sourceUrl": "https://msme.gov.in/",
    "ministry": "Ministry of Micro, Small and Medium Enterprises",
    "state": "All India",
    "language": "en",
    "categoryName": "Employment & Skill Development",
    "secondaryCategories": ["Business Loan", "Subsidy", "MSME"],
    "governmentLevel": "CENTRAL",
    "verificationStatus": "VERIFIED",
    "applicationProcess": "Applications are submitted online via the PMEGP e-Portal. Approved applications are forwarded to banks, and beneficiaries must undergo Entrepreneurship Development Programme (EDP) training before loan disbursement.",
    "faq": [
      {
        "question": "What is the education requirement for higher project costs?",
        "answer": "For manufacturing projects above Rs. 10 lakh and service projects above Rs. 5 lakh, the applicant must have passed at least VIII standard."
      }
    ],
    "eligibility": [
      { "attribute": "age", "operator": ">=", "value": "18" }
    ],
    "requiredDocuments": [
      "Aadhaar Card",
      "Project Report",
      "Education/Skill Certificates",
      "Category Certificate (if applicable)"
    ]
  },
  {
    "externalId": "SEED-MSME-005",
    "sourceSystem": "CuratedSeed",
    "title": "Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE)",
    "shortDescription": "Provides guarantee cover for collateral-free credit facilities extended by lending institutions to Micro and Small Enterprises (MSEs).",
    "description": "CGTMSE reassures lenders that in the event an MSE unit fails to discharge its liabilities, the Guarantee Trust would make good the loss incurred by the lender. This highly encourages banks to provide collateral-free loans to new and existing micro and small businesses.",
    "benefits": "Enables MSEs to access collateral-free credit up to Rs. 500 lakh (Rs. 5 Crore) from eligible banks and financial institutions.",
    "applicationUrl": "https://www.cgtmse.in/",
    "sourceUrl": "https://www.cgtmse.in/",
    "ministry": "Ministry of Micro, Small and Medium Enterprises",
    "state": "All India",
    "language": "en",
    "categoryName": "MSME & Entrepreneurship",
    "secondaryCategories": ["Credit Guarantee", "Business Loan", "Financial Assistance"],
    "governmentLevel": "CENTRAL",
    "verificationStatus": "VERIFIED",
    "applicationProcess": "The borrower directly approaches a bank for a collateral-free loan. Once the loan is sanctioned, the bank itself applies to CGTMSE for the guarantee cover.",
    "faq": [
      {
        "question": "Can retail trade businesses apply for this?",
        "answer": "Yes, Retail Trade is eligible for guarantee cover up to Rs. 100 Lakhs."
      }
    ],
    "eligibility": [
      { "attribute": "businessType", "operator": "IN", "value": "Micro Enterprise,Small Enterprise" }
    ],
    "requiredDocuments": [
      "Udyam Registration Certificate",
      "Project Report",
      "Financial statements of the business"
    ]
  }
];

const updatedData = [...data, ...batch3];
fs.writeFileSync(path, JSON.stringify(updatedData, null, 2));
console.log('Successfully appended 8 schemes. Total:', updatedData.length);
