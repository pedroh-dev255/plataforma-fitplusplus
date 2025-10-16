"use client";

import { useEffect, useState } from "react";
import { getToken, requestPermission } from "firebase/messaging";
import { messaging } from "../lib/firebase";
import { create } from "../api/notify";

export default function NotificationPrompt({ userId }) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkPermission = async () => {
      const asked = localStorage.getItem("notificationsAsked");
      if (asked) return;

      const permission = Notification.permission;
      if (permission === "granted") {
        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });
        await create(userId, token);
      } else {
        setVisible(true);
      }
    };

    checkPermission();
  }, [userId]);

  const handleAccept = async () => {
    setLoading(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });
        await create(userId, token);
      }
    } catch (err) {
      console.error("Erro ao ativar notificações", err);
    } finally {
      localStorage.setItem("notificationsAsked", "true");
      setVisible(false);
      setLoading(false);
    }
  };

  const handleReject = () => {
    localStorage.setItem("notificationsAsked", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center",
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: "#fff", borderRadius: 12, padding: 20,
        textAlign: "center", maxWidth: 400
      }}>
        <h2>Ativar notificações?</h2>
        <p>Deseja receber alertas e atualizações diretamente no seu dispositivo?</p>
        {loading ? (
          <p>Ativando...</p>
        ) : (
          <div style={{ display: "flex", justifyContent: "space-around", marginTop: 20 }}>
            <button onClick={handleAccept} style={{ backgroundColor: "#007bff", color: "#fff", padding: "10px 20px", borderRadius: 8 }}>Sim</button>
            <button onClick={handleReject} style={{ backgroundColor: "#aaa", color: "#fff", padding: "10px 20px", borderRadius: 8 }}>Não</button>
          </div>
        )}
      </div>
    </div>
  );
}
