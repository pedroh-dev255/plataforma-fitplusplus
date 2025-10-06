import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, Modal, FlatList, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NotificationIcon() {
  const [count, setCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem('notifications');
      const data = stored ? JSON.parse(stored) : [];
      setNotifications(data);
      setCount(data.filter(n => !n.seen).length);
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

      <Modal visible={visible} animationType="slide">
        <View style={{ flex: 1, padding: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Notificações</Text>
          <FlatList
            data={notifications}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View
                style={{
                  padding: 10,
                  marginVertical: 5,
                  backgroundColor: item.seen ? '#eee' : '#fff',
                  borderRadius: 8,
                }}>
                <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
                <Text>{item.body}</Text>
              </View>
            )}
          />
          <TouchableOpacity
            onPress={markAllSeen}
            style={{
              marginTop: 10,
              backgroundColor: '#007bff',
              padding: 10,
              borderRadius: 8,
            }}>
            <Text style={{ color: '#fff', textAlign: 'center' }}>Marcar todas como lidas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={closeCenter}
            style={{
              marginTop: 10,
              backgroundColor: '#ccc',
              padding: 10,
              borderRadius: 8,
            }}>
            <Text style={{ textAlign: 'center' }}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}
