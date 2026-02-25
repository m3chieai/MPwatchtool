const axios = require('axios');

const appId = process.env.EBAY_APP_ID;
const certId = process.env.EBAY_CERT_ID;
async function checkRateLimits() {
  console.log('Getting OAuth token...\n');
  
  try {
    // Step 1: Get OAuth token
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
    
    // Step 2: Check rate limits
    console.log('Checking rate limits...\n');
    
    const limitsResponse = await axios.get(
      'https://api.ebay.com/developer/analytics/v1/rate_limit/',
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('📊 YOUR RATE LIMITS:');
    console.log(JSON.stringify(limitsResponse.data, null, 2));
    
  } catch (error) {
    console.log('❌ Error checking limits:');
    console.log('Status:', error.response?.status);
    console.log('Error:', JSON.stringify(error.response?.data, null, 2));
  }
}

checkRateLimits();