const fs = require('fs');
const path = './data/seed-schemes.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));
const batch2 = [
  {
    "externalId": "SEED-STUDENT-001",
    "sourceSystem": "CuratedSeed",
    "title": "Central Sector Scheme of Scholarship for College and University Students",
    "shortDescription": "Financial assistance to meritorious students from low-income families to meet their day-to-day expenses while pursuing higher studies.",
    "description": "This scheme provides scholarships to meritorious students who fall within the top 20th percentile of successful candidates in the Class XII Examination of their respective Boards. It aims to support students from low-income families pursuing regular courses at recognized educational institutions. The scholarship is awarded on the basis of results in the Senior Secondary Examination.",
    "benefits": "Rs. 12,000 per annum at Graduation level for first three years of College and University courses, and Rs. 20,000 per annum at Post-Graduation level.",
    "applicationUrl": "https://scholarships.gov.in/",
    "sourceUrl": "https://scholarships.gov.in/",
    "ministry": "Ministry of Education",
    "state": "All India",
    "language": "en",
    "categoryName": "Students",
    "secondaryCategories": ["Scholarship", "Higher Education", "Financial Assistance"],
    "governmentLevel": "CENTRAL",
    "verificationStatus": "VERIFIED",
    "applicationProcess": "Eligible students must apply online through the National Scholarship Portal (NSP). Applications must be verified by the respective institutions and State Education Boards.",
    "faq": [
      {
        "question": "Can I receive this scholarship along with another scholarship?",
        "answer": "No, a student receiving this scholarship cannot avail any other scholarship from the Central or State Government."
      }
    ],
    "eligibility": [
      { "attribute": "occupation", "operator": "==", "value": "Student" },
      { "attribute": "income", "operator": "<=", "value": "450000" }
    ],
    "requiredDocuments": [
      "Aadhaar Card",
      "Income Certificate",
      "Class 12th Marksheet",
      "Bank account details"
    ]
  },
  {
    "externalId": "SEED-STUDENT-002",
    "sourceSystem": "CuratedSeed",
    "title": "AICTE - Pragati Scholarship Scheme for Girl Students (Degree/Diploma)",
    "shortDescription": "Financial assistance for the advancement of girls pursuing technical education.",
    "description": "The Pragati Scholarship aims to provide assistance for the advancement of girls pursuing technical education (Degree or Diploma). It empowers women by ensuring they have the financial backing necessary to pursue successful careers in technical fields.",
    "benefits": "Rs. 50,000 per annum for every year of study as a lump sum amount towards payment of college fees, purchase of computers, books, and equipment.",
    "applicationUrl": "https://scholarships.gov.in/",
    "sourceUrl": "https://www.aicte-india.org/schemes/students-development-schemes/Pragati",
    "ministry": "All India Council for Technical Education (AICTE)",
    "state": "All India",
    "language": "en",
    "categoryName": "Students",
    "secondaryCategories": ["Scholarship", "Technical Education", "Women"],
    "governmentLevel": "CENTRAL",
    "verificationStatus": "VERIFIED",
    "applicationProcess": "Applications are invited online through the National Scholarship Portal (NSP) once a year. The respective AICTE approved institution verifies the application online.",
    "faq": [
      {
        "question": "How many girls per family can apply?",
        "answer": "Maximum two girl children per family are eligible for the scholarship."
      }
    ],
    "eligibility": [
      { "attribute": "occupation", "operator": "==", "value": "Student" },
      { "attribute": "gender", "operator": "==", "value": "Female" },
      { "attribute": "income", "operator": "<=", "value": "800000" }
    ],
    "requiredDocuments": [
      "Aadhaar Card",
      "Income Certificate",
      "Admission letter issued by Directorate of Technical Education",
      "Tuition fee receipt"
    ]
  },
  {
    "externalId": "SEED-STUDENT-003",
    "sourceSystem": "CuratedSeed",
    "title": "AICTE - Saksham Scholarship Scheme for Specially Abled Students",
    "shortDescription": "Encouragement and support for specially abled children to pursue technical education.",
    "description": "The Saksham Scholarship promotes and supports specially abled children who wish to pursue technical education (Degree or Diploma). It ensures that financial constraints do not hinder students with disabilities from achieving their educational and career aspirations.",
    "benefits": "Rs. 50,000 per annum for every year of study as a lump sum amount towards payment of college fees, purchase of specialized software, equipment, or vehicles.",
    "applicationUrl": "https://scholarships.gov.in/",
    "sourceUrl": "https://www.aicte-india.org/schemes/students-development-schemes/Saksham",
    "ministry": "All India Council for Technical Education (AICTE)",
    "state": "All India",
    "language": "en",
    "categoryName": "Students",
    "secondaryCategories": ["Scholarship", "Disability Support", "Technical Education"],
    "governmentLevel": "CENTRAL",
    "verificationStatus": "VERIFIED",
    "applicationProcess": "Eligible candidates apply online via the National Scholarship Portal (NSP). The AICTE approved host institution must verify the application details.",
    "faq": [
      {
        "question": "What is the minimum disability percentage required?",
        "answer": "The student must have a disability of not less than 40%."
      }
    ],
    "eligibility": [
      { "attribute": "occupation", "operator": "==", "value": "Student" },
      { "attribute": "income", "operator": "<=", "value": "800000" },
      { "attribute": "disability", "operator": "==", "value": "Yes" }
    ],
    "requiredDocuments": [
      "Disability Certificate issued by a competent authority",
      "Income Certificate",
      "Aadhaar Card",
      "Admission letter"
    ]
  },
  {
    "externalId": "SEED-STUDENT-004",
    "sourceSystem": "CuratedSeed",
    "title": "PM Vidyalaxmi Scheme",
    "shortDescription": "A unified portal providing a single window for students to access information and apply for educational loans.",
    "description": "PM Vidyalaxmi is a first-of-its-kind portal for students seeking educational loans. Developed under the guidance of the Department of Financial Services (DFS) and the Ministry of Education, it integrates multiple banks and loan schemes into a single platform, ensuring no student is deprived of higher education due to lack of funds. It provides collateral-free, guarantor-free loans.",
    "benefits": "Provides collateral-free, guarantor-free education loans up to Rs. 7.5 lakh. Offers 3% interest subvention for students with family income up to Rs. 8 lakh per annum.",
    "applicationUrl": "https://www.vidyalakshmi.co.in/",
    "sourceUrl": "https://www.vidyalakshmi.co.in/",
    "ministry": "Ministry of Education / Ministry of Finance",
    "state": "All India",
    "language": "en",
    "categoryName": "Students",
    "secondaryCategories": ["Education Loan", "Higher Education", "Financial Assistance"],
    "governmentLevel": "CENTRAL",
    "verificationStatus": "VERIFIED",
    "applicationProcess": "Students register on the Vidyalaxmi portal, fill out a single Common Educational Loan Application Form (CELAF), and apply to multiple banks and loan schemes simultaneously.",
    "faq": [
      {
        "question": "Is collateral required for loans under Vidyalaxmi?",
        "answer": "No, loans up to Rs. 7.5 lakh are collateral-free and guarantor-free."
      }
    ],
    "eligibility": [
      { "attribute": "occupation", "operator": "==", "value": "Student" }
    ],
    "requiredDocuments": [
      "Admission confirmation letter",
      "Fee structure document",
      "Aadhaar Card",
      "PAN Card of student and co-borrower",
      "Income proof of co-borrower"
    ]
  },
  {
    "externalId": "SEED-STUDENT-005",
    "sourceSystem": "CuratedSeed",
    "title": "Post Matric Scholarship for SC/ST Students",
    "shortDescription": "Financial assistance to Scheduled Caste and Scheduled Tribe students studying at post matriculation or post-secondary stage.",
    "description": "This scheme provides financial assistance to SC and ST students to enable them to complete their education. It covers students studying in recognized institutions from Class 11 up to Post-Graduation. The objective is to appreciably increase the Gross Enrolment Ratio of SC/ST students in higher education.",
    "benefits": "Covers compulsory non-refundable fees (including tuition fee) and provides a monthly maintenance allowance depending on the course of study.",
    "applicationUrl": "https://scholarships.gov.in/",
    "sourceUrl": "https://socialjustice.gov.in/",
    "ministry": "Ministry of Social Justice and Empowerment / Ministry of Tribal Affairs",
    "state": "All India",
    "language": "en",
    "categoryName": "Students",
    "secondaryCategories": ["Scholarship", "SC/ST", "Social Welfare"],
    "governmentLevel": "CENTRAL",
    "verificationStatus": "VERIFIED",
    "applicationProcess": "Students must apply online on the National Scholarship Portal (NSP) or their respective State Scholarship Portals. Direct Benefit Transfer (DBT) is used to disburse the funds directly to the student's Aadhaar-seeded bank account.",
    "faq": [
      {
        "question": "Is there an income limit for this scholarship?",
        "answer": "Yes, the total family income from all sources should not exceed Rs. 2.50 lakh per annum."
      }
    ],
    "eligibility": [
      { "attribute": "occupation", "operator": "==", "value": "Student" },
      { "attribute": "category", "operator": "IN", "value": "SC,ST" },
      { "attribute": "income", "operator": "<=", "value": "250000" }
    ],
    "requiredDocuments": [
      "Caste Certificate",
      "Income Certificate",
      "Previous year's mark sheet",
      "Fee receipt of current course year",
      "Aadhaar Card"
    ]
  },
  {
    "externalId": "SEED-STUDENT-006",
    "sourceSystem": "CuratedSeed",
    "title": "National Means-cum-Merit Scholarship Scheme (NMMSS)",
    "shortDescription": "Awards scholarships to meritorious students of economically weaker sections to arrest their drop out at class VIII.",
    "description": "NMMSS aims to award scholarships to meritorious students from economically weaker sections to prevent them from dropping out of school at Class 8 and encourage them to continue their studies at the secondary stage. Scholarships are disbursed directly into the bank accounts of selected students.",
    "benefits": "A scholarship of Rs. 12,000 per annum (Rs. 1,000 per month) is awarded to selected students from Class IX to Class XII.",
    "applicationUrl": "https://scholarships.gov.in/",
    "sourceUrl": "https://dsel.education.gov.in/scheme/nmmss",
    "ministry": "Ministry of Education",
    "state": "All India",
    "language": "en",
    "categoryName": "Students",
    "secondaryCategories": ["Scholarship", "School Education", "Financial Assistance"],
    "governmentLevel": "CENTRAL",
    "verificationStatus": "VERIFIED",
    "applicationProcess": "Selection is made through an examination conducted by State Governments/UT Administrations. Selected candidates must apply on the National Scholarship Portal (NSP) for disbursement.",
    "faq": [
      {
        "question": "Who can appear for the selection exam?",
        "answer": "Students studying in Class 8 in Government, Government-aided, and local body schools with at least 55% marks in Class 7 (relaxable by 5% for SC/ST)."
      }
    ],
    "eligibility": [
      { "attribute": "occupation", "operator": "==", "value": "Student" },
      { "attribute": "income", "operator": "<=", "value": "350000" }
    ],
    "requiredDocuments": [
      "Income Certificate",
      "Class 7th Marksheet",
      "Caste Certificate (if applicable)",
      "Aadhaar Card"
    ]
  },
  {
    "externalId": "SEED-WOMEN-001",
    "sourceSystem": "CuratedSeed",
    "title": "Sukanya Samriddhi Yojana (SSY)",
    "shortDescription": "A small savings scheme backed by the Government of India targeted at the parents of girl children to build a fund for their future education and marriage.",
    "description": "Launched as part of the 'Beti Bachao, Beti Padhao' campaign, the Sukanya Samriddhi Yojana is a deposit scheme designed to ensure a bright future for girl children in India. It offers a highly attractive interest rate and substantial tax benefits under Section 80C. The account matures 21 years after the date of opening.",
    "benefits": "Provides an attractive interest rate (currently around 8.2% p.a., subject to quarterly revision) which is fully exempt from tax. Deposits are eligible for deduction under Section 80C up to Rs. 1.5 lakh.",
    "applicationUrl": "https://www.indiapost.gov.in/Financial/Pages/Content/Post-Office-Saving-Schemes.aspx",
    "sourceUrl": "https://www.nsiindia.gov.in/",
    "ministry": "Ministry of Finance",
    "state": "All India",
    "language": "en",
    "categoryName": "Women",
    "secondaryCategories": ["Savings", "Child Welfare", "Financial Assistance"],
    "governmentLevel": "CENTRAL",
    "verificationStatus": "VERIFIED",
    "applicationProcess": "Parents or legal guardians can open an SSY account in any post office or authorized commercial bank branch by submitting the account opening form along with the required documents.",
    "faq": [
      {
        "question": "What is the age limit for opening the account?",
        "answer": "The account can be opened in the name of a girl child anytime before she attains the age of 10 years."
      },
      {
        "question": "Can I withdraw money for the child's education before maturity?",
        "answer": "Yes, a partial withdrawal of up to 50% of the balance is allowed after the girl reaches 18 years of age or passes the 10th standard, exclusively for higher education expenses."
      }
    ],
    "eligibility": [
      { "attribute": "gender", "operator": "==", "value": "Female" },
      { "attribute": "age", "operator": "<=", "value": "10" }
    ],
    "requiredDocuments": [
      "Birth Certificate of the girl child",
      "Identity Proof of the parent/guardian",
      "Address Proof of the parent/guardian"
    ]
  },
  {
    "externalId": "SEED-WOMEN-002",
    "sourceSystem": "CuratedSeed",
    "title": "Pradhan Mantri Ujjwala Yojana (PMUY)",
    "shortDescription": "Provides clean cooking fuel (LPG) to poor households, protecting the health of women and children.",
    "description": "PMUY aims to safeguard the health of women and children by providing them with a clean cooking fuel (LPG). It ensures that they don't have to compromise their health in smoky kitchens or wander in unsafe areas collecting firewood. The scheme provides a deposit-free LPG connection in the name of an adult woman of a BPL family.",
    "benefits": "Provides financial support of Rs. 1600 for a 14.2 kg cylinder (or Rs. 1150 for a 5 kg cylinder) which covers the security deposit, pressure regulator, LPG hose, and installation charges. Beneficiaries also receive a targeted subsidy per cylinder.",
    "applicationUrl": "https://www.pmuy.gov.in/",
    "sourceUrl": "https://www.pmuy.gov.in/",
    "ministry": "Ministry of Petroleum and Natural Gas",
    "state": "All India",
    "language": "en",
    "categoryName": "Women",
    "secondaryCategories": ["Health", "Subsidy", "Energy"],
    "governmentLevel": "CENTRAL",
    "verificationStatus": "VERIFIED",
    "applicationProcess": "Eligible women can apply by filling out the application form available at LPG distributor agencies or submitting it online via the PMUY portal.",
    "faq": [
      {
        "question": "Can any woman apply for PMUY?",
        "answer": "The applicant must be a woman above 18 years of age, belonging to a BPL household, SC/ST, PMAY(G), AAY, or other specified weaker sections."
      }
    ],
    "eligibility": [
      { "attribute": "gender", "operator": "==", "value": "Female" },
      { "attribute": "age", "operator": ">=", "value": "18" }
    ],
    "requiredDocuments": [
      "Aadhaar Card of applicant and all adult family members",
      "Ration Card or document identifying family composition",
      "Bank Account Details",
      "Passport size photograph"
    ]
  },
  {
    "externalId": "SEED-WOMEN-003",
    "sourceSystem": "CuratedSeed",
    "title": "Lakhpati Didi Scheme",
    "shortDescription": "Aims to empower rural women by helping them earn a sustainable income of at least Rs. 1 Lakh per annum per household.",
    "description": "The Lakhpati Didi initiative, driven by the Deendayal Antyodaya Yojana - National Rural Livelihoods Mission (DAY-NRLM), aims to catalyze economic empowerment for women in Self-Help Groups (SHGs). It focuses on diversifying livelihood activities, providing skill training, and ensuring credit linkage so that every SHG woman can earn a sustainable income of Rs. 1 Lakh or more annually.",
    "benefits": "Provides capacity building, micro-credit support, and specialized skill training in areas like drone operation, LED bulb making, plumbing, and agriculture. Facilitates market linkages for products manufactured by women.",
    "applicationUrl": "https://lakhpatididi.gov.in/",
    "sourceUrl": "https://nrlm.gov.in/",
    "ministry": "Ministry of Rural Development",
    "state": "All India",
    "language": "en",
    "categoryName": "Women",
    "secondaryCategories": ["Employment", "Skill Development", "Financial Assistance"],
    "governmentLevel": "CENTRAL",
    "verificationStatus": "VERIFIED",
    "applicationProcess": "Women must be members of registered Self-Help Groups (SHGs) under DAY-NRLM. Local block-level mission management units identify and prepare livelihood plans for these women.",
    "faq": [
      {
        "question": "Is this a direct cash transfer scheme?",
        "answer": "No, it is a livelihood enablement scheme that provides training, mentorship, and credit to help women start or scale micro-enterprises to earn 1 lakh per annum."
      }
    ],
    "eligibility": [
      { "attribute": "gender", "operator": "==", "value": "Female" },
      { "attribute": "occupation", "operator": "==", "value": "SHG Member" }
    ],
    "requiredDocuments": [
      "Aadhaar Card",
      "SHG Membership proof",
      "Bank Account details"
    ]
  },
  {
    "externalId": "SEED-WOMEN-004",
    "sourceSystem": "CuratedSeed",
    "title": "Pradhan Mantri Matru Vandana Yojana (PMMVY)",
    "shortDescription": "A maternity benefit program providing conditional cash transfer to pregnant women and lactating mothers.",
    "description": "PMMVY is a direct benefit transfer scheme that compensates for partial wage loss, enabling women to take adequate rest before and after delivery of their first living child. It also aims to improve the health-seeking behavior of pregnant women and lactating mothers by providing cash incentives tied to specific health conditions.",
    "benefits": "Cash incentive of Rs. 5,000 paid in three installments directly into the bank account upon early registration of pregnancy, antenatal check-up, and registration of the child's birth and completion of the first cycle of vaccination.",
    "applicationUrl": "https://pmmvy.wcd.gov.in/",
    "sourceUrl": "https://wcd.nic.in/schemes/pradhan-mantri-matru-vandana-yojana",
    "ministry": "Ministry of Women and Child Development",
    "state": "All India",
    "language": "en",
    "categoryName": "Women",
    "secondaryCategories": ["Health", "Maternity Benefit", "Financial Assistance"],
    "governmentLevel": "CENTRAL",
    "verificationStatus": "VERIFIED",
    "applicationProcess": "Eligible women can apply by submitting the prescribed forms at their local Anganwadi Centre (AWC) or approved Health facility, or by applying online through the PMMVY CAS portal.",
    "faq": [
      {
        "question": "Are government employees eligible for PMMVY?",
        "answer": "No, women who are in regular employment with the Central Government, State Governments, or PSUs, or who are in receipt of similar benefits under any law, are excluded."
      }
    ],
    "eligibility": [
      { "attribute": "gender", "operator": "==", "value": "Female" }
    ],
    "requiredDocuments": [
      "Aadhaar Card",
      "Mother and Child Protection (MCP) Card",
      "Bank or Post Office Account details",
      "Child's Birth Certificate (for 3rd installment)"
    ]
  },
  {
    "externalId": "SEED-WOMEN-005",
    "sourceSystem": "CuratedSeed",
    "title": "Beti Bachao Beti Padhao (BBBP)",
    "shortDescription": "A national initiative to address the declining Child Sex Ratio (CSR) and empower girl children.",
    "description": "Beti Bachao Beti Padhao is a joint initiative of the Ministry of Women and Child Development, Ministry of Health and Family Welfare, and Ministry of Education. It aims to prevent gender-biased sex selective elimination, ensure the survival and protection of the girl child, and ensure the education and participation of the girl child.",
    "benefits": "It is not a Direct Benefit Transfer (DBT) scheme. It provides community-level awareness, strict enforcement of the PC&PNDT Act, and promotes girls' education through improved school infrastructure and gender-sensitive curricula.",
    "applicationUrl": "https://wcd.nic.in/bbbp-schemes",
    "sourceUrl": "https://wcd.nic.in/bbbp-schemes",
    "ministry": "Ministry of Women and Child Development",
    "state": "All India",
    "language": "en",
    "categoryName": "Women",
    "secondaryCategories": ["Child Welfare", "Education", "Social Welfare"],
    "governmentLevel": "CENTRAL",
    "verificationStatus": "VERIFIED",
    "applicationProcess": "As this is an awareness and structural enforcement scheme, individual applications for cash benefits are not applicable. Citizens participate by reporting PC&PNDT violations and utilizing educational resources.",
    "faq": [
      {
        "question": "Does BBBP provide any cash incentive for the birth of a girl child?",
        "answer": "No, BBBP has no provision for individual cash transfers. It focuses on awareness and systemic improvements."
      }
    ],
    "eligibility": [
      { "attribute": "gender", "operator": "==", "value": "Female" }
    ],
    "requiredDocuments": []
  },
  {
    "externalId": "SEED-WOMEN-006",
    "sourceSystem": "CuratedSeed",
    "title": "Mission Shakti - Nari Adalat",
    "shortDescription": "Provides women with an alternate dispute resolution mechanism at the village level for issues like domestic violence and property rights.",
    "description": "Nari Adalat is a component under the Sambal sub-scheme of Mission Shakti. It operates as an alternate grievance redressal mechanism exclusively for women at the Gram Panchayat level. It aims to provide speedy, accessible, and affordable justice to women facing domestic violence, dowry harassment, or property disputes, led by trained community women.",
    "benefits": "Offers free, accessible legal counseling, mediation, and dispute resolution services at the grassroots level, empowering women to seek justice without the heavy financial burden of formal courts.",
    "applicationUrl": "https://wcd.nic.in/schemes/mission-shakti",
    "sourceUrl": "https://wcd.nic.in/schemes/mission-shakti",
    "ministry": "Ministry of Women and Child Development",
    "state": "All India",
    "language": "en",
    "categoryName": "Women",
    "secondaryCategories": ["Legal Support", "Social Welfare", "Empowerment"],
    "governmentLevel": "CENTRAL",
    "verificationStatus": "VERIFIED",
    "applicationProcess": "Women can approach the local Nari Adalat established at their Gram Panchayat level directly. Cases are registered and mediated locally by the selected Nyaya Sakhis.",
    "faq": [
      {
        "question": "Is the decision of Nari Adalat legally binding like a court order?",
        "answer": "No, it functions primarily as a mediation and alternate dispute resolution body. However, it can guide women to formal legal channels if mediation fails."
      }
    ],
    "eligibility": [
      { "attribute": "gender", "operator": "==", "value": "Female" }
    ],
    "requiredDocuments": [
      "Any supporting documents regarding the dispute (if available)"
    ]
  }
];

const updatedData = [...data, ...batch2];
fs.writeFileSync(path, JSON.stringify(updatedData, null, 2));
console.log('Successfully appended 12 schemes. Total:', updatedData.length);
