import { MEAT_DATASET } from '../data/dataset';
import { ClassificationResult, KNNNeighbor, MeatSample } from '../types';

/**
 * Calculates Euclidean distance between two RGB colors
 */
export function calculateEuclideanDistance(
  r1: number,
  g1: number,
  b1: number,
  r2: number,
  g2: number,
  b2: number
): number {
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

/**
 * Classifies an RGB color using k-NN algorithm (k=3) against the MEAT_DATASET
 */
export function classifyRGB(
  r: number,
  g: number,
  b: number,
  k: number = 3,
  imageUrl?: string,
  roiCenter?: { x: number; y: number },
  roiRadius?: number
): ClassificationResult {
  // Compute distance to all dataset points
  const neighbors: KNNNeighbor[] = MEAT_DATASET.map((sample: MeatSample) => {
    const distance = calculateEuclideanDistance(r, g, b, sample.r, sample.g, sample.b);
    return { sample, distance };
  });

  // Sort ascending by distance
  neighbors.sort((a, b) => a.distance - b.distance);

  // Take top k neighbors
  const closestNeighbors = neighbors.slice(0, k);

  let freshVotes = 0;
  let spoiledVotes = 0;

  closestNeighbors.forEach(n => {
    if (n.sample.label === 'xanh lá') {
      freshVotes++;
    } else {
      spoiledVotes++;
    }
  });

  const isFresh = freshVotes >= spoiledVotes;
  const label: 'xanh lá' | 'đỏ' = isFresh ? 'xanh lá' : 'đỏ';
  const conclusion = isFresh
    ? 'THỊT TƯƠI SẠCH – NÊN ĂN NGAY'
    : 'KHÔNG ĂN ĐƯỢC – THỊT ĐÃ ƠI / HỎNG';

  const confidence = Math.round(((isFresh ? freshVotes : spoiledVotes) / k) * 100);

  return {
    r: Math.round(r),
    g: Math.round(g),
    b: Math.round(b),
    label,
    conclusion,
    closestNeighbors,
    freshVotes,
    spoiledVotes,
    confidence,
    extractedAt: new Date(),
    imageUrl,
    roiCenter,
    roiRadius
  };
}

/**
 * Extracts average RGB from a circle ROI on a canvas element
 */
export function extractRGBFromCanvas(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number
): { r: number; g: number; b: number; totalPixels: number } {
  const minX = Math.max(0, Math.floor(centerX - radius));
  const minY = Math.max(0, Math.floor(centerY - radius));
  const maxX = Math.min(ctx.canvas.width, Math.ceil(centerX + radius));
  const maxY = Math.min(ctx.canvas.height, Math.ceil(centerY + radius));
  const width = maxX - minX;
  const height = maxY - minY;

  if (width <= 0 || height <= 0) {
    return { r: 128, g: 128, b: 128, totalPixels: 0 };
  }

  const imgData = ctx.getImageData(minX, minY, width, height);
  const data = imgData.data;

  let sumR = 0;
  let sumG = 0;
  let sumB = 0;
  let count = 0;

  const rSq = radius * radius;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const globalX = minX + x;
      const globalY = minY + y;
      const dx = globalX - centerX;
      const dy = globalY - centerY;

      if (dx * dx + dy * dy <= rSq) {
        const idx = (y * width + x) * 4;
        sumR += data[idx];
        sumG += data[idx + 1];
        sumB += data[idx + 2];
        count++;
      }
    }
  }

  if (count === 0) {
    return { r: 128, g: 128, b: 128, totalPixels: 0 };
  }

  return {
    r: Math.round(sumR / count),
    g: Math.round(sumG / count),
    b: Math.round(sumB / count),
    totalPixels: count
  };
}
