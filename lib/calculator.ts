import { lookupTable, purityFactors, sgLookup, temperatures, observedDegrees } from './ethanolData';

export interface CalculationResult {
  inputTemp: number;
  inputObs: number;
  degreeAt20C: number;
  conversionFactor: number;
  purity: number;
  specificGravity: number | null;
}

export interface CalculationError {
  error: string;
}

const TEMP_MIN = Math.min(...temperatures) / 10;
const TEMP_MAX = Math.max(...temperatures) / 10;
const OBS_MIN  = Math.min(...observedDegrees) / 10;
const OBS_MAX  = Math.max(...observedDegrees) / 10;

export function getTempRange() { return { min: TEMP_MIN, max: TEMP_MAX }; }
export function getObsRange()  { return { min: OBS_MIN,  max: OBS_MAX  }; }

function findClosestKey(arr: number[], targetKey: number, toleranceSteps = 3): number | null {
  for (let d = 0; d <= toleranceSteps; d++) {
    if (arr.includes(targetKey + d)) return targetKey + d;
    if (arr.includes(targetKey - d)) return targetKey - d;
  }
  return null;
}

export function calculate(
  temperature: number,
  observedDegree: number
): CalculationResult | CalculationError {
  if (temperature < TEMP_MIN || temperature > TEMP_MAX) {
    return { error: `Temperature ${temperature}°C is out of range. Valid range: ${TEMP_MIN}°C – ${TEMP_MAX}°C` };
  }
  if (observedDegree < OBS_MIN || observedDegree > OBS_MAX) {
    return { error: `Observed degree ${observedDegree} is out of range. Valid range: ${OBS_MIN} – ${OBS_MAX}` };
  }

  const tempKey = Math.round(temperature * 10);
  const obsKey  = Math.round(observedDegree * 10);

  const closestTempKey = findClosestKey(temperatures, tempKey, 3);
  if (closestTempKey === null) {
    return { error: `No calibration data for observed degree ${observedDegree} at ${temperature}°C, please repeat your test at different parameters.` };
  }

  const obsArr = Object.keys(lookupTable[closestTempKey] || {}).map(Number);
  const closestObsKey = findClosestKey(obsArr, obsKey, 1);
  if (closestObsKey === null) {
    return { error: `No calibration data for observed degree ${observedDegree} at ${temperature}°C, please repeat your test at different parameters.` };
  }

  const degreeAt20C = lookupTable[closestTempKey]?.[closestObsKey];
  if (degreeAt20C === undefined) {
    return { error: `No calibration data for observed degree ${observedDegree} at ${temperature}°C, please repeat your test at different parameters.` };
  }

  const conversionFactor = purityFactors[closestTempKey];
  if (conversionFactor === undefined || conversionFactor === 0) {
    return { error: `No calibration data for observed degree ${observedDegree} at ${temperature}°C, please repeat your test at different parameters.` };
  }

  const purity = degreeAt20C / conversionFactor;

  // SG lookup
  let specificGravity: number | null = null;
  const sgKeys = Object.keys(sgLookup).map(Number);
  const purityKey = Math.round(purity * 100);
  const closestSgKey = findClosestKey(sgKeys, purityKey, 5);
  if (closestSgKey !== null) {
    specificGravity = sgLookup[closestSgKey];
  }

  return {
    inputTemp: closestTempKey / 10,
    inputObs: closestObsKey / 10,
    degreeAt20C,
    conversionFactor,
    purity,
    specificGravity,
  };
}
