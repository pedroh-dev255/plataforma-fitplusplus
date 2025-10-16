'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../app/AuthContext';

type Notification = {
  id: string;
  title?: string;
  body?: string;
  seen?: boolean;
  createdAt?: string;
};

export default function NotificationIcon() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [visible, setVisible] = useState(false);

  const count = notifications.filter(n => !n.seen).length;

  useEffect(() => {
    const stored = localStorage.getItem('notifications');
    const data = stored ? JSON.parse(stored) : [];
    setNotifications(data);

    const interval = setInterval(() => {
      const stored = localStorage.getItem('notifications');
      const data = stored ? JSON.parse(stored) : [];
      setNotifications(data);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const markAllSeen = () => {
    const updated = notifications.map(n => ({ ...n, seen: true }));
    setNotifications(updated);
    localStorage.setItem('notifications', JSON.stringify(updated));
  };

  return (
    <>
      <button
        onClick={() => setVisible(true)}
        className="relative mr-4 focus:outline-none"
      >
        <img src="/icon-notify.png" alt="Notificações" className="w-6 h-6" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
            {count}
          </span>
        )}
      </button>

      {visible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div className="bg-[#0a1f3c] rounded-xl p-4 max-h-[85%] overflow-auto w-full sm:w-96">
            <h2 className="text-white text-lg font-bold mb-3">Notificações</h2>
            {notifications.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-lg mb-2 ${
                  item.seen ? 'bg-white/5' : 'bg-blue-500/10'
                }`}
              >
                <h3 className="text-white font-semibold">{item.title}</h3>
                <p className="text-blue-100 text-sm mt-1">{item.body}</p>
              </div>
            ))}

            <button
              onClick={markAllSeen}
              className="w-full bg-blue-600 text-white py-2 rounded-lg mt-2"
            >
              Marcar todas como lidas
            </button>
            <button
              onClick={() => setVisible(false)}
              className="w-full bg-white/10 text-white py-2 rounded-lg mt-2"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
