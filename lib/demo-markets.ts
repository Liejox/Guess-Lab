export interface DemoMarket {
  id: string;
  question: string;
  description: string;
  category: string;
  endTime: Date;
  commitEndTime: Date;
  revealEndTime: Date;
  totalPool: number;
  yesPool: number;
  noPool: number;
  participants: number;
  phase: 'COMMIT' | 'REVEAL' | 'RESOLVED';
  outcome?: boolean;
  creator: string;
  oracleType: 'MANUAL' | 'PYTH';
  pythPriceId?: string;
  targetPrice?: number;
}

export const DEMO_MARKETS: DemoMarket[] = [
  {
    id: '1',
    question: 'Will Bitcoin reach $100,000 by December 31, 2025?',
    description: 'Prediction on Bitcoin price reaching $100K by end of 2025',
    category: 'Crypto',
    endTime: new Date('2025-12-31T23:59:59Z'),
    commitEndTime: new Date('2025-12-30T23:59:59Z'),
    revealEndTime: new Date('2025-12-31T12:00:00Z'),
    totalPool: 1250.5,
    yesPool: 750.3,
    noPool: 500.2,
    participants: 42,
    phase: 'COMMIT',
    creator: '0x123...abc',
    oracleType: 'PYTH',
    pythPriceId: 'bitcoin',
    targetPrice: 100000
  },
  {
    id: '2',
    question: 'Will Ethereum reach $5,000 by March 2025?',
    description: 'ETH price prediction for Q1 2025',
    category: 'Crypto',
    endTime: new Date('2025-03-31T23:59:59Z'),
    commitEndTime: new Date('2025-03-30T23:59:59Z'),
    revealEndTime: new Date('2025-03-31T12:00:00Z'),
    totalPool: 890.7,
    yesPool: 445.3,
    noPool: 445.4,
    participants: 28,
    phase: 'COMMIT',
    creator: '0x456...def',
    oracleType: 'PYTH',
    pythPriceId: 'ethereum',
    targetPrice: 5000
  },
  {
    id: '3',
    question: 'Will Aptos (APT) reach $50 by June 2025?',
    description: 'Aptos token price prediction for mid-2025',
    category: 'Crypto',
    endTime: new Date('2025-06-30T23:59:59Z'),
    commitEndTime: new Date('2025-06-29T23:59:59Z'),
    revealEndTime: new Date('2025-06-30T12:00:00Z'),
    totalPool: 567.2,
    yesPool: 234.1,
    noPool: 333.1,
    participants: 19,
    phase: 'COMMIT',
    creator: '0x789...ghi',
    oracleType: 'MANUAL'
  },
  {
    id: '4',
    question: 'Will the next US President be from the Democratic Party?',
    description: '2028 US Presidential Election outcome prediction',
    category: 'Politics',
    endTime: new Date('2028-11-07T23:59:59Z'),
    commitEndTime: new Date('2028-11-06T23:59:59Z'),
    revealEndTime: new Date('2028-11-07T12:00:00Z'),
    totalPool: 2340.8,
    yesPool: 1200.4,
    noPool: 1140.4,
    participants: 156,
    phase: 'COMMIT',
    creator: '0xabc...123',
    oracleType: 'MANUAL'
  },
  {
    id: '5',
    question: 'Will AI achieve AGI by 2030?',
    description: 'Artificial General Intelligence breakthrough prediction',
    category: 'Technology',
    endTime: new Date('2030-12-31T23:59:59Z'),
    commitEndTime: new Date('2030-12-30T23:59:59Z'),
    revealEndTime: new Date('2030-12-31T12:00:00Z'),
    totalPool: 1890.3,
    yesPool: 945.1,
    noPool: 945.2,
    participants: 87,
    phase: 'COMMIT',
    creator: '0xdef...456',
    oracleType: 'MANUAL'
  }
];

export function getMarketById(id: string): DemoMarket | undefined {
  return DEMO_MARKETS.find(market => market.id === id);
}

export function getMarketsByCategory(category: string): DemoMarket[] {
  return DEMO_MARKETS.filter(market => market.category === category);
}

export function getActiveMarkets(): DemoMarket[] {
  return DEMO_MARKETS.filter(market => market.phase === 'COMMIT' || market.phase === 'REVEAL');
}