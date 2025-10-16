'use client';
import React, { useEffect, useState } from 'react';
import { create } from '../api/notify';
import { useAuth } from '../app/AuthContext';

interface NotificationPromptProps {
  userId: string;
}

export default function NotificationPrompt({ userId }: NotificationPromptProps) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const askedBefore = localStorage.getItem('notificationsAsked');
    if (!askedBefore) {
      setVisible(true);
    } else {
      // já permitido, pega token se possível
      if ('Notification' in window && Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(async (reg) => {
          const subscription = await reg.pushManager.getSubscription();
          if (subscription) await create(userId, subscription.endpoint);
        });
      }
    }
  }, [userId]);

  const handleAccept = async () => {
    setLoading(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const reg = await navigator.serviceWorker.ready;
        const subscription = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_KEY!,
        });
        await create(userId, subscription.endpoint);
      }
      localStorage.setItem('notificationsAsked', 'true');
    } catch (err) {
      console.error('Erro ao pedir permissão:', err);
    } finally {
      setVisible(false);
      setLoading(false);
    }
  };

  const handleReject = () => {
    localStorage.setItem('notificationsAsked', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl p-6 w-96 text-center">
        <h2 className="text-xl font-semibold mb-3">Ativar notificações?</h2>
        <p className="text-gray-600 mb-5">
          Deseja receber alertas e atualizações diretamente no seu dispositivo?
        </p>

        {loading ? (
          <div className="text-blue-600 font-semibold">Carregando...</div>
        ) : (
          <div className="flex gap-3 justify-center">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              onClick={handleAccept}
            >
              Sim
            </button>
            <button
              className="bg-gray-400 text-white px-4 py-2 rounded-lg"
              onClick={handleReject}
            >
              Não
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
