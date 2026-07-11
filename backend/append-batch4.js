const fs = require('fs');
const path = './data/seed-schemes.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));
const batch4 = [
  {
    "externalId": "SEED-HEALTH-001",
    "sourceSystem": "CuratedSeed",
    "title": "Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (PM-JAY)",
    "shortDescription": "The world's largest health insurance/assurance scheme providing health cover for secondary and tertiary care hospitalization.",
    "description": "PM-JAY is a flagship scheme of the Government of India aiming to provide health cover of Rs. 5 lakhs per family per year for secondary and tertiary care hospitalization. It targets poor, deprived rural families and identified occupational category of urban workers' families as per the latest Socio-Economic Caste Census (SECC) data.",
    "benefits": "Provides cashless access to healthcare services. Covers up to Rs. 5,000,000 per family per year for medical treatment in empanelled public and private hospitals.",
    "applicationUrl": "https://pmjay.gov.in/",
    "sourceUrl": "https://nha.gov.in/PM-JAY",
    "ministry": "Ministry of Health and Family Welfare",
    "state": "All India",
    "language": "en",
    "categoryName": "Health & Healthcare",
    "secondaryCategories": ["Health Insurance", "Social Welfare", "Medical Treatment"],
    "governmentLevel": "CENTRAL",
    "verificationStatus": "VERIFIED",
    "applicationProcess": "There is no formal enrollment process. Eligible families are automatically covered based on SECC data. Beneficiaries must verify their eligibility at empanelled hospitals or CSCs using an identification document to get their e-card.",
    "faq": [
      {
        "question": "Is there a cap on family size or age?",
        "answer": "No, there is no restriction on family size, age, or gender."
      }
    ],
    "eligibility": [
      { "attribute": "incomeStatus", "operator": "IN", "value": "BPL,SECC Identified" }
    ],
    "requiredDocuments": [
      "Aadhaar Card or Ration Card (for identity verification at the hospital)"
    ]
  },
  {
    "externalId": "SEED-HEALTH-002",
    "sourceSystem": "CuratedSeed",
    "title": "Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP)",
    "shortDescription": "A campaign to provide quality medicines at affordable prices to the masses through special kendras.",
    "description": "PMBJP is a campaign launched by the Department of Pharmaceuticals to provide quality generic medicines at affordable prices to the masses. The scheme operates through Pradhan Mantri Bhartiya Janaushadhi Kendras (PMBJK), which are special medical outlets opened across the country.",
    "benefits": "Provides high-quality generic medicines at prices 50% to 90% lesser than the branded medicines available in the open market.",
    "applicationUrl": "http://janaushadhi.gov.in/",
    "sourceUrl": "http://janaushadhi.gov.in/",
    "ministry": "Ministry of Chemicals and Fertilizers",
    "state": "All India",
    "language": "en",
    "categoryName": "Health & Healthcare",
    "secondaryCategories": ["Generic Medicines", "Public Health", "Affordable Healthcare"],
    "governmentLevel": "CENTRAL",
    "verificationStatus": "VERIFIED",
    "applicationProcess": "No individual application is required to buy medicines. Citizens can simply visit the nearest PMBJP Kendra with a valid prescription.",
    "faq": [
      {
        "question": "Are the generic medicines sold at PMBJP kendras safe?",
        "answer": "Yes, all medicines procured are strictly tested at NABL accredited laboratories to ensure quality and efficacy."
      }
    ],
    "eligibility": [
      { "attribute": "nationality", "operator": "==", "value": "Indian" }
    ],
    "requiredDocuments": [
      "Medical Prescription (for prescription drugs)"
    ]
  },
  {
    "externalId": "SEED-HOUSING-001",
    "sourceSystem": "CuratedSeed",
    "title": "Pradhan Mantri Awas Yojana - Urban (PMAY-U)",
    "shortDescription": "Aims to provide all-weather pucca houses to all eligible beneficiaries in the urban areas.",
    "description": "PMAY-U addresses the urban housing shortage among the EWS/LIG and MIG categories, including slum dwellers, by ensuring a pucca house to all eligible urban households. It operates through various verticals like Beneficiary-led Construction (BLC), Affordable Housing in Partnership (AHP), and In-situ Slum Redevelopment (ISSR).",
    "benefits": "Provides central assistance/subsidy (e.g., Rs. 1.5 Lakh per house under BLC) for the construction, acquisition, or enhancement of houses in urban areas.",
    "applicationUrl": "https://pmaymis.gov.in/",
    "sourceUrl": "https://mohua.gov.in/",
    "ministry": "Ministry of Housing and Urban Affairs",
    "state": "All India",
    "language": "en",
    "categoryName": "Housing",
    "secondaryCategories": ["Urban Development", "Financial Assistance", "Subsidized Housing"],
    "governmentLevel": "CENTRAL",
    "verificationStatus": "VERIFIED",
    "applicationProcess": "Eligible individuals can apply online on the PMAY-U MIS portal or through Common Service Centres (CSCs) or their respective Urban Local Bodies (ULBs).",
    "faq": [
      {
        "question": "Can I apply if I already own a pucca house?",
        "answer": "No, the beneficiary family should not own a pucca house in their name anywhere in India."
      }
    ],
    "eligibility": [
      { "attribute": "residence", "operator": "==", "value": "Urban" },
      { "attribute": "houseOwnership", "operator": "==", "value": "None" }
    ],
    "requiredDocuments": [
      "Aadhaar Card",
      "Income Proof",
      "Land ownership documents (for BLC vertical)"
    ]
  },
  {
    "externalId": "SEED-HOUSING-002",
    "sourceSystem": "CuratedSeed",
    "title": "Pradhan Mantri Awas Yojana - Gramin (PMAY-G)",
    "shortDescription": "Aims to provide a pucca house with basic amenities to all houseless households and households living in kutcha houses in rural areas.",
    "description": "PMAY-G is a rural housing scheme aimed at achieving 'Housing for All'. Beneficiaries are identified using parameters from the SECC data, verified by the Gram Sabha. It focuses on the construction of disaster-resilient houses in rural areas.",
    "benefits": "Provides financial assistance of Rs. 1.20 Lakh in plain areas and Rs. 1.30 Lakh in hilly, difficult, and IAP districts. Beneficiaries also receive 90/95 person-days of unskilled labor wages under MGNREGA.",
    "applicationUrl": "https://pmayg.nic.in/",
    "sourceUrl": "https://rural.nic.in/",
    "ministry": "Ministry of Rural Development",
    "state": "All India",
    "language": "en",
    "categoryName": "Housing",
    "secondaryCategories": ["Rural Development", "Financial Assistance", "Social Welfare"],
    "governmentLevel": "CENTRAL",
    "verificationStatus": "VERIFIED",
    "applicationProcess": "Beneficiaries do not typically apply; they are selected based on SECC 2011 data and Gram Sabha verification. However, individuals missing from the list can approach the Gram Panchayat appellate committee.",
    "faq": [
      {
        "question": "Is toilet construction included in PMAY-G?",
        "answer": "Yes, an additional assistance of Rs. 12,000 is provided for the construction of toilets under Swachh Bharat Mission-Gramin."
      }
    ],
    "eligibility": [
      { "attribute": "residence", "operator": "==", "value": "Rural" },
      { "attribute": "houseOwnership", "operator": "IN", "value": "None,Kutcha House" }
    ],
    "requiredDocuments": [
      "Aadhaar Card",
      "Job Card (MGNREGA)",
      "Bank Account details",
      "Swachh Bharat Mission (SBM) number"
    ]
  },
  {
    "externalId": "SEED-SOCIAL-001",
    "sourceSystem": "CuratedSeed",
    "title": "Atal Pension Yojana (APY)",
    "shortDescription": "A pension scheme focusing on workers in the unorganized sector to guarantee a minimum pension after the age of 60.",
    "description": "APY was launched to create a universal social security system for all Indians, especially the poor, the under-privileged, and workers in the unorganized sector. Administered by the Pension Fund Regulatory and Development Authority (PFRDA).",
    "benefits": "Subscribers receive a guaranteed minimum monthly pension of Rs. 1,000 to Rs. 5,000 (depending on contributions) starting at the age of 60. The spouse is also guaranteed the same pension after the subscriber's death.",
    "applicationUrl": "https://www.npscra.nsdl.co.in/scheme-details.php",
    "sourceUrl": "https://financialservices.gov.in/",
    "ministry": "Ministry of Finance",
    "state": "All India",
    "language": "en",
    "categoryName": "Senior Citizens & Social Welfare",
    "secondaryCategories": ["Pension", "Social Security", "Unorganized Sector"],
    "governmentLevel": "CENTRAL",
    "verificationStatus": "VERIFIED",
    "applicationProcess": "Individuals can open an APY account by visiting their bank branch or post office where they hold a savings account, or via net banking.",
    "faq": [
      {
        "question": "What is the age criteria for joining APY?",
        "answer": "The minimum age of joining APY is 18 years and maximum age is 40 years."
      }
    ],
    "eligibility": [
      { "attribute": "age", "operator": ">=", "value": "18" },
      { "attribute": "age", "operator": "<=", "value": "40" }
    ],
    "requiredDocuments": [
      "Bank Savings Account Details",
      "Aadhaar Card"
    ]
  },
  {
    "externalId": "SEED-SOCIAL-002",
    "sourceSystem": "CuratedSeed",
    "title": "Indira Gandhi National Old Age Pension Scheme (IGNOAPS)",
    "shortDescription": "Provides a monthly pension to destitute elderly persons aged 60 years and above.",
    "description": "IGNOAPS is a core component of the National Social Assistance Programme (NSAP). It provides financial assistance to senior citizens belonging to Below Poverty Line (BPL) households, ensuring they have basic financial support in their old age.",
    "benefits": "Provides a central contribution of Rs. 200 per month for persons between 60-79 years, and Rs. 500 per month for persons aged 80 years and above. States usually add their own contribution, making the final pension amount higher.",
    "applicationUrl": "https://nsap.nic.in/",
    "sourceUrl": "https://nsap.nic.in/",
    "ministry": "Ministry of Rural Development",
    "state": "All India",
    "language": "en",
    "categoryName": "Senior Citizens & Social Welfare",
    "secondaryCategories": ["Pension", "Senior Citizens", "Social Security"],
    "governmentLevel": "CENTRAL",
    "verificationStatus": "VERIFIED",
    "applicationProcess": "Applications are submitted to the local Gram Panchayat/Municipality. Verified applications are forwarded to the district administration, and the pension is disbursed directly to the beneficiary's bank account.",
    "faq": [
      {
        "question": "Is the pension only for BPL families?",
        "answer": "Yes, the applicant must belong to a household Below Poverty Line (BPL) according to the criteria prescribed by the Government of India."
      }
    ],
    "eligibility": [
      { "attribute": "age", "operator": ">=", "value": "60" },
      { "attribute": "incomeStatus", "operator": "==", "value": "BPL" }
    ],
    "requiredDocuments": [
      "Age Proof (Aadhaar/Voter ID)",
      "BPL Card / Income Certificate",
      "Bank/Post Office Account Details"
    ]
  },
  {
    "externalId": "SEED-SOCIAL-003",
    "sourceSystem": "CuratedSeed",
    "title": "Indira Gandhi National Disability Pension Scheme (IGNDPS)",
    "shortDescription": "Provides financial assistance to individuals with severe and multiple disabilities.",
    "description": "Also a component of the National Social Assistance Programme (NSAP), IGNDPS aims to provide a monthly pension to BPL individuals living with severe or multiple disabilities, ensuring they receive basic social security and a life of dignity.",
    "benefits": "Provides a central pension of Rs. 300 per month for disabled individuals up to the age of 79 years. For those aged 80 years and above, it increases to Rs. 500 per month (co-funded by State Governments).",
    "applicationUrl": "https://nsap.nic.in/",
    "sourceUrl": "https://nsap.nic.in/",
    "ministry": "Ministry of Rural Development",
    "state": "All India",
    "language": "en",
    "categoryName": "Senior Citizens & Social Welfare",
    "secondaryCategories": ["Disability Assistance", "Pension", "Social Security"],
    "governmentLevel": "CENTRAL",
    "verificationStatus": "VERIFIED",
    "applicationProcess": "Applicants can apply at their local Gram Panchayat (rural) or Municipality (urban) along with the requisite disability certificates.",
    "faq": [
      {
        "question": "What level of disability is required?",
        "answer": "The applicant must have severe (80% or more) or multiple disabilities as defined under the Rights of Persons with Disabilities Act."
      }
    ],
    "eligibility": [
      { "attribute": "disability", "operator": "==", "value": "Severe" },
      { "attribute": "age", "operator": ">=", "value": "18" },
      { "attribute": "incomeStatus", "operator": "==", "value": "BPL" }
    ],
    "requiredDocuments": [
      "Disability Certificate (minimum 80%)",
      "BPL Ration Card",
      "Aadhaar Card",
      "Bank Account details"
    ]
  },
  {
    "externalId": "SEED-SOCIAL-004",
    "sourceSystem": "CuratedSeed",
    "title": "Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)",
    "shortDescription": "A one-year renewable life insurance scheme offering coverage for death due to any reason.",
    "description": "PMJJBY is a social security scheme aimed at bringing the unbanked and uninsured population into the financial mainstream. It provides life insurance cover for death due to any reason, making insurance affordable for the common citizen.",
    "benefits": "Provides a life cover of Rs. 2 Lakhs in case of death of the insured due to any reason, at a highly subsidized premium of Rs. 436 per annum.",
    "applicationUrl": "https://jansuraksha.gov.in/",
    "sourceUrl": "https://financialservices.gov.in/",
    "ministry": "Ministry of Finance",
    "state": "All India",
    "language": "en",
    "categoryName": "Senior Citizens & Social Welfare",
    "secondaryCategories": ["Life Insurance", "Social Security"],
    "governmentLevel": "CENTRAL",
    "verificationStatus": "VERIFIED",
    "applicationProcess": "Individuals can enroll by filling an auto-debit consent form at their respective bank branches or post offices where they hold an eligible savings account.",
    "faq": [
      {
        "question": "How is the premium paid?",
        "answer": "The premium of Rs. 436 is auto-debited in one installment from the subscriber's bank account every year on or before 31st May."
      }
    ],
    "eligibility": [
      { "attribute": "age", "operator": ">=", "value": "18" },
      { "attribute": "age", "operator": "<=", "value": "50" }
    ],
    "requiredDocuments": [
      "Bank Savings Account details",
      "Aadhaar Card",
      "Nominee details"
    ]
  }
];

const updatedData = [...data, ...batch4];
fs.writeFileSync(path, JSON.stringify(updatedData, null, 2));
console.log('Successfully appended 8 schemes. Total:', updatedData.length);
