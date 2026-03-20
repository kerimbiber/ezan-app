// Kabe koordinatları
const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

function toDegrees(radians) {
  return (radians * 180) / Math.PI;
}

export function calculateQiblaDirection(latitude, longitude) {
  const phiK = toRadians(KAABA_LAT);
  const lambdaK = toRadians(KAABA_LNG);
  const phi = toRadians(latitude);
  const lambda = toRadians(longitude);

  const numerator = Math.sin(lambdaK - lambda);
  const denominator =
    Math.cos(phi) * Math.tan(phiK) -
    Math.sin(phi) * Math.cos(lambdaK - lambda);

  let qibla = toDegrees(Math.atan2(numerator, denominator));
  if (qibla < 0) qibla += 360;

  return qibla;
}

export function getDistanceToKaaba(latitude, longitude) {
  const R = 6371; // km
  const dLat = toRadians(KAABA_LAT - latitude);
  const dLon = toRadians(KAABA_LNG - longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(latitude)) *
      Math.cos(toRadians(KAABA_LAT)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}
