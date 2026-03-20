import * as Notifications from 'expo-notifications';
import { PRAYER_NAMES } from './prayerTimes';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermission() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleAllPrayerNotifications(prayerTimes) {
  // Önce mevcut bildirimleri temizle
  await Notifications.cancelAllScheduledNotificationsAsync();

  const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
  const now = new Date();

  for (const prayer of prayers) {
    const time = prayerTimes[prayer];
    if (time && time > now) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `${PRAYER_NAMES[prayer]} Vakti`,
          body: `${PRAYER_NAMES[prayer]} namazı vakti girdi.`,
          sound: true,
        },
        trigger: {
          type: 'date',
          date: time,
        },
      });
    }
  }
}

export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
