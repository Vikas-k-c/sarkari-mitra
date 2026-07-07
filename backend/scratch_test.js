const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  const category = await prisma.schemeCategory.create({
    data: { name: 'Agriculture ' + Date.now(), description: 'Schemes for farmers' }
  });
  console.log('Created Category ID:', category.id);
  
  const response = await fetch('http://localhost:5000/api/v1/schemes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'PM Kisan Samman Nidhi',
      description: 'Income support scheme for landholding farmer families.',
      categoryId: category.id,
      benefits: 'Rs. 6000 per year',
      eligibility: [{ attribute: 'occupation', operator: '==', value: 'farmer' }]
    })
  });
  
  console.log('POST Status:', response.status);
  const data = await response.json();
  console.log('POST Response:', JSON.stringify(data, null, 2));

  const getResponse = await fetch('http://localhost:5000/api/v1/schemes');
  const getData = await getResponse.json();
  console.log('GET Schemes Count:', getData.data.length);
}

test().catch(console.error).finally(() => prisma.$disconnect());
