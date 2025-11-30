import axios from 'axios';

const PHOTON_BASE_URL = 'https://stage-api.getstan.app/identity-service/api/v1';

const photonApi = axios.create({
  baseURL: PHOTON_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': process.env.NEXT_PUBLIC_PHOTON_API_KEY || 'your-api-key-here',
  },
});

export interface PhotonEventParams {
  eventId: string;
  eventType: string;
  userId: string;
  campaignId: string;
  metadata?: Record<string, any>;
}

// Rewarded event (gives PAT tokens + XP)
export async function rewardCommit(userId: string, marketId: number, metadata: any = {}) {
  try {
    await photonApi.post('/attribution/events/campaign', {
      event_id: `commit-${marketId}-${userId}-${Date.now()}`,
      event_type: 'prediction_commit',
      client_user_id: userId,
      campaign_id: process.env.NEXT_PUBLIC_REWARDED_CAMPAIGN_ID || 'rewarded-campaign',
      metadata: { marketId, ...metadata },
      timestamp: new Date().toISOString(),
    });
    console.log('✅ Photon commit reward sent');
  } catch (error) {
    console.error('❌ Photon commit reward failed:', error);
  }
}

// Unrewarded event (gives XP only)
export async function rewardReveal(userId: string, marketId: number, metadata: any = {}) {
  try {
    await photonApi.post('/attribution/events/campaign', {
      event_id: `reveal-${marketId}-${userId}-${Date.now()}`,
      event_type: 'prediction_reveal',
      client_user_id: userId,
      campaign_id: process.env.NEXT_PUBLIC_UNREWARDED_CAMPAIGN_ID || 'unrewarded-campaign',
      metadata: { marketId, ...metadata },
      timestamp: new Date().toISOString(),
    });
    console.log('✅ Photon reveal reward sent');
  } catch (error) {
    console.error('❌ Photon reveal reward failed:', error);
  }
}

// Win reward (big PAT tokens + XP)
export async function rewardWin(userId: string, marketId: number, metadata: any = {}) {
  try {
    await photonApi.post('/attribution/events/campaign', {
      event_id: `win-${marketId}-${userId}-${Date.now()}`,
      event_type: 'prediction_win',
      client_user_id: userId,
      campaign_id: process.env.NEXT_PUBLIC_REWARDED_CAMPAIGN_ID || 'rewarded-campaign',
      metadata: { marketId, winAmount: metadata.winAmount || 0, ...metadata },
      timestamp: new Date().toISOString(),
    });
    console.log('✅ Photon win reward sent');
  } catch (error) {
    console.error('❌ Photon win reward failed:', error);
  }
}