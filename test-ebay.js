const axios = require('axios');

const EBAY_APP_ID = 'JamesSu-MPWatche-PRD-f248d9cff-5e1e40f1';

async function testEbay() {
  console.log('Testing eBay API...\n');
  
  const url = 'https://svcs.ebay.com/services/search/FindingService/v1';
  
  const requestBody = {
    'findCompletedItems': {
      'keywords': 'Rolex Submariner',
      'itemFilter': [
        { 'name': 'SoldItemsOnly', 'value': 'true' }
      ],
      'paginationInput': {
        'entriesPerPage': '5',
        'pageNumber': '1'
      }
    }
  };

  try {
    const response = await axios.post(url, requestBody, {
      headers: {
        'X-EBAY-SOA-SECURITY-APPNAME': EBAY_APP_ID,
        'X-EBAY-SOA-OPERATION-NAME': 'findCompletedItems',
        'X-EBAY-SOA-SERVICE-VERSION': '1.13.0',
        'X-EBAY-SOA-REQUEST-DATA-FORMAT': 'JSON',
        'X-EBAY-SOA-RESPONSE-DATA-FORMAT': 'JSON',
        'Content-Type': 'application/json',
      },
    });

    console.log('SUCCESS!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('ERROR!');
    console.log('Status:', error.response?.status);
    console.log('\nFull Error Data:');
    console.log(JSON.stringify(error.response?.data, null, 2));
  }
}

testEbay();