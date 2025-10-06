import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

export default function NotificationHandler() {
  useEffect(() => {
    // Escuta notificações recebidas enquanto o app está aberto
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const { notification } = remoteMessage;

      if (notification) {
        const newNotification = {
          id: Date.now().toString(),
          title: notification.title,
          body: notification.body,
          seen: false,
          createdAt: new Date().toISOString(),
        };

        // Mostra Toast
        Toast.show({
          type: 'info',
          text1: notification.title,
          text2: notification.body,
          position: 'top',
          visibilityTime: 4000,
        });

        // Salva no AsyncStorage
        const existing = await AsyncStorage.getItem('notifications');
        const notifications = existing ? JSON.parse(existing) : [];
        notifications.unshift(newNotification);
        await AsyncStorage.setItem('notifications', JSON.stringify(notifications));
      }
    });

    return unsubscribe;
  }, []);

  return null;
}
