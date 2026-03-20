import {
  PrayerTimes,
  CalculationMethod,
  Coordinates,
  SunnahTimes,
} from 'adhan';

/**
 * Konuma göre en uygun hesaplama metodunu seç
 */
function getCalculationMethod(latitude, longitude) {
  // Türkiye
  if (latitude >= 36 && latitude <= 42 && longitude >= 26 && longitude <= 45) {
    return CalculationMethod.Turkey();
  }
  // Kuzey Amerika
  if (latitude >= 15 && latitude <= 72 && longitude >= -170 && longitude <= -50) {
    return CalculationMethod.NorthAmerica();
  }
  // Mısır ve çevre
  if (latitude >= 20 && latitude <= 35 && longitude >= 25 && longitude <= 40) {
    return CalculationMethod.Egyptian();
  }
  // Pakistan, Hindistan, Bangladeş
  if (latitude >= 5 && latitude <= 38 && longitude >= 60 && longitude <= 95) {
    return CalculationMethod.Karachi();
  }
  // Güneydoğu Asya
  if (latitude >= -10 && latitude <= 20 && longitude >= 95 && longitude <= 145) {
    return CalculationMethod.Singapore();
  }
  // Avrupa
  if (latitude >= 35 && latitude <= 72 && longitude >= -10 && longitude <= 40) {
    return CalculationMethod.MuslimWorldLeague();
  }
  // Varsayılan
  return CalculationMethod.MuslimWorldLeague();
}

export function getPrayerTimes(latitude, longitude, date = new Date()) {
  const coordinates = new Coordinates(latitude, longitude);
  const params = getCalculationMethod(latitude, longitude);
  const prayerTimes = new PrayerTimes(coordinates, date, params);
  const sunnahTimes = new SunnahTimes(prayerTimes);

  return {
    fajr: prayerTimes.fajr,
    sunrise: prayerTimes.sunrise,
    dhuhr: prayerTimes.dhuhr,
    asr: prayerTimes.asr,
    maghrib: prayerTimes.maghrib,
    isha: prayerTimes.isha,
    middleOfTheNight: sunnahTimes.middleOfTheNight,
    currentPrayer: prayerTimes.currentPrayer(),
    nextPrayer: prayerTimes.nextPrayer(),
    timeForPrayer: (prayer) => prayerTimes.timeForPrayer(prayer),
  };
}

export function formatTime(date) {
  if (!date) return '--:--';
  return date.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function getTimeRemaining(targetDate) {
  const now = new Date();
  const diff = targetDate - now;
  if (diff <= 0) return null;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  if (hours > 0) {
    return `${hours}s ${minutes}dk`;
  }
  return `${minutes}dk ${seconds}sn`;
}

export const PRAYER_NAMES = {
  fajr: 'İmsak',
  sunrise: 'Güneş',
  dhuhr: 'Öğle',
  asr: 'İkindi',
  maghrib: 'Akşam',
  isha: 'Yatsı',
};

export const PRAYER_ICONS = {
  fajr: 'weather-night',
  sunrise: 'weather-sunset-up',
  dhuhr: 'weather-sunny',
  asr: 'weather-partly-cloudy',
  maghrib: 'weather-sunset-down',
  isha: 'white-balance-sunny',
};
