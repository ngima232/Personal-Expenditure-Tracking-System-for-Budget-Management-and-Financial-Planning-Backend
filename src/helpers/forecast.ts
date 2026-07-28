

export function holtLinearTrend(data: number[], alpha: number = 0.3, beta: number = 0.1): number {
  const n = data.length;
  if (n === 0) return 0;
  if (n === 1) return data[0];
  if (n === 2) {
    // With only two points, we can only do linear extrapolation
    return data[1] + (data[1] - data[0]);
  }

  // Initial level and trend using first two points
  let level = data[0];
  let trend = data[1] - data[0];

  // Apply Holt's method for the remaining points
  for (let i = 1; i < n; i++) {
    const prevLevel = level;
    const prevTrend = trend;
    // Update level
    level = alpha * data[i] + (1 - alpha) * (prevLevel + prevTrend);
    // Update trend
    trend = beta * (level - prevLevel) + (1 - beta) * prevTrend;
  }

  // Forecast for next period (k = 1)
  const forecast = level + trend;
  return Math.max(forecast, 0); // expenses cannot be negative
}