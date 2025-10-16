'use client';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function NotificationHandler() {
  useEffect(() => {
    // Web Push Notifications via Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((sub) => {
          if (sub) {
            console.log('Subscription active:', sub.endpoint);
          }
        });
      });
    }





  }, []);

  return null;
}
