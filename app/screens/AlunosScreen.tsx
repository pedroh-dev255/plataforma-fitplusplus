import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, FlatList } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from 'react-native-toast-message';
import NotificationHandler from '../components/NotificationHandler';
import NotificationIcon from '../components/NotificationIcon';
import { useAuth } from '../components/AuthContext';
import { getAlunos } from '../api/profile';
import { useNavigation } from '@react-navigation/native';

export default function AlunosScreen() {
  const navigation = useNavigation<any>();
  const [alunos, setAlunos] = useState<any[]>([]);
  const { user, setUser } = useAuth();


  useEffect(() => {
    const loadAlunos = async () => {
      if (user?.id) {
        try {
          const ev = await getAlunos(user.id);
          setAlunos(ev || []);
        } catch (err) {
          console.error("Erro ao carregar eventos:", err);
        }
      }
    };
    loadAlunos();
  }, [user]);


  return (
    <View style={styles.container}>
      <NotificationHandler />
      <View style={{ position: 'absolute', top: 50, right: 15, zIndex: 5 }}>
        <NotificationIcon />
      </View>

      <View style={styles.toastContainer} pointerEvents="box-none">
        <Toast />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
          <Text style={{ color: '#fff' }}>◀ Voltar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1f3c',
    padding: 10,
    paddingTop: 50
  },
  toastContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 1000,
    pointerEvents: 'box-none',
  },
  input: {
    backgroundColor: '#1b2c4a',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#1e3557',
    padding: 15,
    borderRadius: 10,
    marginVertical: 6,
  },
  cardTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardText: {
    color: '#b0c4de',
    marginTop: 4,
  },
  cardDate: {
    color: '#9fc5ff',
    marginTop: 6,
    fontSize: 12,
  },
});
