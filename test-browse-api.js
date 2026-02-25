const axios = require('axios');

const appId = process.env.EBAY_APP_ID;
const certId = process.env.EBAY_CERT_ID;
async function testBrowseAPI() {
  console.log('Testing eBay Browse API (alternative to Finding API)...\n');
  
  try {
    // Get OAuth token
    const credentials = Buffer.from(`${EBAY_APP_ID}:${EBAY_CERT_ID}`).toString('base64');
    
    const tokenResponse = await axios.post(
      'https://api.ebay.com/identity/v1/oauth2/token',
      'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${credentials}`,
        },
      }
    );
    
    console.log('✅ OAuth token obtained!\n');
    const token = tokenResponse.data.access_token;
    
    // Try Browse API to search for sold items
    console.log('Searching for Rolex Submariner sold items...\n');
    
    const searchResponse = await axios.get(
      'https://api.ebay.com/buy/browse/v1/item_summary/search',
      {
        params: {
          q: 'Rolex Submariner 116610LN',
          filter: 'buyingOptions:{FIXED_PRICE|AUCTION},itemLocationCountry:US',
          limit: 10,
        },
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('✅ SUCCESS! Browse API works!');
    console.log('Found:', searchResponse.data.total, 'items');
    console.log('\nFirst item:');
    if (searchResponse.data.itemSummaries && searchResponse.data.itemSummaries[0]) {
      const item = searchResponse.data.itemSummaries[0];
      console.log('Title:', item.title);
      console.log('Price:', item.price?.value, item.price?.currency);
    }
    
  } catch (error) {
    console.log('❌ Error:');
    console.log('Status:', error.response?.status);
    console.log('Error:', JSON.stringify(error.response?.data, null, 2));
  }
}

testBrowseAPI();