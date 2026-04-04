import * as Notification from "expo-notifications"

export async function reset24hNotifications() {
    await Notification.requestPermissionsAsync();
    await Notification.cancelAllScheduledNotificationsAsync()

    await Notification.scheduleNotificationAsync({
        content:{
            title:"Don't break the chain! 🔥",
            body:"You’re on a roll. Spend just 5 minutes today to keep your streak alive"
        },
        trigger: {
            type: Notification.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds : 60*60*24,
            repeats:false
        }
    })
}