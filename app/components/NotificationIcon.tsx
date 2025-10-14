import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, Modal, FlatList, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NotificationIcon() {
  const [count, setCount] = useState(0);
  type Notification = {
    id: string;
    title?: string;
    body?: string;
    seen?: boolean;
    createdAt?: string;
  };

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem('notifications');
      const data = stored ? JSON.parse(stored) : [];
      setNotifications(data);
      setCount(data.filter((n: any) => !n.seen).length);
    };

    load();

    // Atualiza a cada 5s (pode ser via evento global depois)
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  const openCenter = () => setVisible(true);
  const closeCenter = () => setVisible(false);

  const markAllSeen = async () => {
    const updated = notifications.map(n => ({ ...n, seen: true }));
    await AsyncStorage.setItem('notifications', JSON.stringify(updated));
    setNotifications(updated);
    setCount(0);
  };

  return (
    <>
      <TouchableOpacity onPress={openCenter} style={{ marginRight: 15 }}>
        <Image source={require('../assets/icon-notify.png')} style={{ width: 24, height: 24 }} />
        {count > 0 && (
          <View
            style={{
              position: 'absolute',
              top: -2,
              right: -2,
              backgroundColor: 'red',
              borderRadius: 8,
              width: 16,
              height: 16,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{ color: '#fff', fontSize: 10 }}>{count}</Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal visible={visible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.title}>Notificações</Text>
            <FlatList
              data={notifications}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <View style={[styles.item, item.seen ? styles.itemSeen : styles.itemUnread]}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemBody}>{item.body}</Text>
                </View>
              )}
            />
            <TouchableOpacity onPress={markAllSeen} style={styles.primaryBtn}>
              <Text style={styles.primaryBtnText}>Marcar todas como lidas</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeCenter} style={styles.secondaryBtn}>
              <Text style={styles.secondaryBtnText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: 'rgba(10,31,60,0.95)', borderRadius: 12, padding: 16, maxHeight: '85%' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 12 },
  item: { padding: 10, borderRadius: 8, marginBottom: 8 },
  itemUnread: { backgroundColor: 'rgba(0,122,255,0.08)' },
  itemSeen: { backgroundColor: 'rgba(255,255,255,0.03)' },
  itemTitle: { color: '#fff', fontWeight: 'bold' },
  itemBody: { color: '#cfe8ff', marginTop: 4 },
  primaryBtn: { marginTop: 8, backgroundColor: '#007bff', padding: 10, borderRadius: 8 },
  primaryBtnText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  secondaryBtn: { marginTop: 8, backgroundColor: 'rgba(255,255,255,0.08)', padding: 10, borderRadius: 8 },
  secondaryBtnText: { color: '#fff', textAlign: 'center' },
});
