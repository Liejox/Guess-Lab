#!/usr/bin/env node

const axios = require('axios');

const PHOTON_API_KEY = '7bc5d06eb53ad73716104742c7e8a5377da9fe8156378dcfebfb8253da4e8800';
const CAMPAIGN_ID = 'ea3bcaca-9ce4-4b54-b803-8b9be1f142ba';
const BASE_URL = 'https://stage-api.getstan.app/identity-service/api/v1';

const photonApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': PHOTON_API_KEY,
  },
});

async function testPhotonEvents() {
  console.log('🧪 Testing PHOTON Integration...\n');

  // Test unrewarded event (commit/reveal)
  try {
    console.log('📝 Testing unrewarded event (commit)...');
    await photonApi.post('/attribution/events/campaign', {
      event_id: `test-commit-${Date.now()}`,
      event_type: 'prediction_commit',
      client_user_id: 'test-user-123',
      campaign_id: CAMPAIGN_ID,
      metadata: { marketId: 1, side: 1, amount: 1000000 },
      timestamp: new Date().toISOString(),
    });
    console.log('✅ Unrewarded event sent successfully');
  } catch (error) {
    console.log('❌ Unrewarded event failed:', error.response?.data || error.message);
  }

  // Test rewarded event (claim)
  try {
    console.log('🎁 Testing rewarded event (claim)...');
    await photonApi.post('/attribution/events/campaign', {
      event_id: `test-win-${Date.now()}`,
      event_type: 'prediction_win',
      client_user_id: 'test-user-123',
      campaign_id: CAMPAIGN_ID,
      metadata: { marketId: 1 },
      timestamp: new Date().toISOString(),
    });
    console.log('✅ Rewarded event sent successfully');
  } catch (error) {
    console.log('❌ Rewarded event failed:', error.response?.data || error.message);
  }

  console.log('\n🎯 PHOTON integration test completed!');
}

testPhotonEvents().catch(console.error);