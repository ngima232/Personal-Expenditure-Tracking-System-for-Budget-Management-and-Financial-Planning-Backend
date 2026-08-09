import {ForecastMethod} from '../enums'

/**
 * Weighted Moving Average
 *
 * Newer months receive greater weight.
 *
 * Example:
 * data = [100, 200, 300]
 *
 * weights = [1, 2, 3]
 *
 * forecast =
 * (100 * 1 + 200 * 2 + 300 * 3) / (1 + 2 + 3)
 */
export function weightedMovingAverage(data: number[]): number {
  if (!data.length) return 0;

  let weightedTotal = 0;
  let totalWeight = 0;

  data.forEach((value, index) => {
    const weight = index + 1;

    weightedTotal += value * weight;
    totalWeight += weight;
  });

  if (totalWeight === 0) return 0;

  return Math.max(
    Number((weightedTotal / totalWeight).toFixed(2)),
    0
  );
}


/**
 * Holt's Linear Trend Method
 *
 * Suitable when more historical observations are available
 * because it estimates both:
 *
 * 1. Level
 * 2. Trend
 */
export function holtLinearTrend(
  data: number[],
  alpha: number = 0.4,
  beta: number = 0.2
): number {
  const n = data.length;

  if (n === 0) return 0;

  if (n === 1) {
    return Number(data[0].toFixed(2));
  }

  let level = data[0];
  let trend = data[1] - data[0];

  for (let i = 1; i < n; i++) {
    const previousLevel = level;

    level =
      alpha * data[i] +
      (1 - alpha) * (level + trend);

    trend =
      beta * (level - previousLevel) +
      (1 - beta) * trend;
  }

  const forecast = level + trend;

  // Expenditure cannot be negative
  return Math.max(
    Number(forecast.toFixed(2)),
    0
  );
}


/**
 * Select forecasting algorithm according to the
 * number of completed monthly observations.
 *
 * 0 months  -> No Forecast
 * 1-3 months -> Weighted Moving Average
 * 4+ months -> Holt's Linear Trend
 */
export function forecastExpense(data: number[]): {
  forecast: number | null;
  method: ForecastMethod;
} {
  if (data.length === 0) {
    return {
      forecast: null,
      method: ForecastMethod.NO_FORECAST,
    };
  }

  if (data.length <= 3) {
    return {
      forecast: weightedMovingAverage(data),
      method: ForecastMethod.WEIGHTED_MOVING_AVERAGE,
    };
  }

  return {
    forecast: holtLinearTrend(data),
    method: ForecastMethod.HOLT_LINEAR_TREND,
  };
}