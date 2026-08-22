export interface MeatSample {
  time: string;
  group: 'A' | 'B';
  r: number;
  g: number;
  b: number;
  obs: string;
  status: string;
  label: 'xanh lá' | 'đỏ';
  conclusion: string;
  experiment?: number;
}

export interface KNNNeighbor {
  sample: MeatSample;
  distance: number;
}

export interface ClassificationResult {
  r: number;
  g: number;
  b: number;
  label: 'xanh lá' | 'đỏ';
  conclusion: string;
  closestNeighbors: KNNNeighbor[];
  freshVotes: number;
  spoiledVotes: number;
  confidence: number;
  extractedAt: Date;
  imageUrl?: string;
  roiCenter?: { x: number; y: number };
  roiRadius?: number;
}
