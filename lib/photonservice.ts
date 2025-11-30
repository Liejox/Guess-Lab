// Mock Photon SDK service since @photon/sdk doesn't exist
// This provides the same interface without the dependency

interface PhotonConfig {
  env: string;
  apiKey?: string;
}

interface Profile {
  id: string;
  username: string;
  createdAt: Date;
}

interface EventData {
  event: string;
  props: Record<string, any>;
}

class MockPhoton {
  private config: PhotonConfig;

  constructor(config: PhotonConfig) {
    this.config = config;
  }

  async createProfile({ username }: { username: string }): Promise<Profile> {
    // Mock implementation
    return {
      id: `profile_${Date.now()}`,
      username,
      createdAt: new Date(),
    };
  }

  async trackEvent(profileId: string, eventData: EventData): Promise<boolean> {
    // Mock implementation - just log for now
    console.log(`Tracking event for ${profileId}:`, eventData);
    return true;
  }
}

const photon = new MockPhoton({ 
  env: "devnet", 
  apiKey: process.env.PHOTON_KEY 
});

// Create a new user profile
export async function onboardUser(username: string) {
  return await photon.createProfile({ username });
}

// Track an event
export async function trackEvent(profileId: string, event: string, props: Record<string, any>) {
  return await photon.trackEvent(profileId, { event, props });
}