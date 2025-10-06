// src/components/NotificationPrompt.tsx
import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from '../api/notify';

interface NotificationPromptProps {
  userId: string;
}

const NotificationPrompt: React.FC<NotificationPromptProps> = ({ userId }) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkPermissionAndPrompt = async () => {
      const askedBefore = await AsyncStorage.getItem('notificationsAsked');
      if (askedBefore) return; // já perguntamos antes

      const status = await messaging().hasPermission();
      const enabled =
        status === messaging.AuthorizationStatus.AUTHORIZED ||
        status === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        setVisible(true);
      } else {
        // Já tem permissão, envia o token pro servidor
        const deviceToken = await messaging().getToken();
        await create(userId, deviceToken);
      }
    };

    checkPermissionAndPrompt();
  }, [userId]);

  const handleAccept = async () => {
    setLoading(true);
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        const token = await messaging().getToken();
        console.log('✅ Device token:', token);
        await create(userId, token);
        await AsyncStorage.setItem('notificationsAsked', 'true');
      } else {
        console.log('❌ Permissão negada');
        await AsyncStorage.setItem('notificationsAsked', 'true');
      }
    } catch (error) {
      console.error('Erro ao pedir permissão:', error);
    } finally {
      setVisible(false);
      setLoading(false);
    }
  };

  const handleReject = async () => {
    await AsyncStorage.setItem('notificationsAsked', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Ativar notificações?</Text>
          <Text style={styles.text}>
            Deseja receber alertas e atualizações diretamente no seu dispositivo?
          </Text>

          {loading ? (
            <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 10 }} />
          ) : (
            <View style={styles.buttons}>
              <TouchableOpacity style={[styles.btn, styles.yes]} onPress={handleAccept}>
                <Text style={styles.btnText}>Sim</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.btn, styles.no]} onPress={handleReject}>
                <Text style={styles.btnText}>Não</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default NotificationPrompt;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  text: {
    textAlign: 'center',
    color: '#555',
    marginBottom: 20,
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
  },
  btn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  yes: {
    backgroundColor: '#007bff',
  },
  no: {
    backgroundColor: '#aaa',
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
});
