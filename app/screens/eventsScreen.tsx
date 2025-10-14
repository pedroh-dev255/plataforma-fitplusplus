import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, FlatList } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from 'react-native-toast-message';
import NotificationHandler from '../components/NotificationHandler';
import NotificationIcon from '../components/NotificationIcon';
import FloatingMenu from '../components/FloatingMenu';
import { useAuth } from '../components/AuthContext';
import { fetchEvents } from '../api/events';
import { useNavigation } from '@react-navigation/native';

export default function EventsScreen() {
  const navigation = useNavigation<any>();
  const [events, setEvents] = useState<any[]>([]);
  const { user, setUser } = useAuth();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState<'start' | 'end' | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      if (user?.id) {
        try {
          const ev = await fetchEvents(user.id);
          setEvents(ev || []);
        } catch (err) {
          console.error("Erro ao carregar eventos:", err);
        }
      }
    };
    loadEvents();
  }, [user]);

  let DateTimePicker: any = null;
  try {
    DateTimePicker = require('@react-native-community/datetimepicker').default;
  } catch (e) {
    DateTimePicker = null;
  }

  // 🔍 Filtro de eventos por data
  const filteredEvents = events.filter(ev => {
    if (!ev.data_hora) return false;
    const evDate = new Date(ev.data_hora);
    const evTime = evDate.getTime();

    if (startDate && evTime < startDate.getTime()) return false;
    if (endDate && evTime > endDate.getTime()) return false;

    return true;
  });

  let actions = [];
  if (user && user.tipo === 'professor'){
    actions = [
      { text: "Perfil", icon: require("../assets/perfil.png"), name: "bt_perfil", position: 1 },
      { text: "Eventos", icon: require("../assets/evento.png"), name: "bt_eventos", position: 2 },
      { text: "Logout", icon: require("../assets/icon.png"), name: "bt_logout", position: 3 },
    ];
  } else if (user && user.tipo === 'aluno'){
    actions = [
      { text: "Perfil", icon: require("../assets/perfil.png"), name: "bt_perfil", position: 1 },
      { text: "Eventos", icon: require("../assets/evento.png"), name: "bt_eventos", position: 2 },
      { text: "Logout", icon: require("../assets/icon.png"), name: "bt_logout", position: 3 },
    ];
  } else {
    actions = [
      { text: "Perfil", icon: require("../assets/perfil.png"), name: "bt_perfil", position: 1 },
      { text: "Logout", icon: require("../assets/icon.png"), name: "bt_logout", position: 2 },
    ];
  }

  return (
    <View style={styles.container}>
      <NotificationHandler />
      <View style={{ position: 'absolute', top: 50, right: 15, zIndex: 5 }}>
        <NotificationIcon />
      </View>

      <View style={styles.toastContainer} pointerEvents="box-none">
        <Toast />
      </View>

      {/* 📅 Filtro por data de início */}
      <TouchableOpacity
        style={[styles.input, { justifyContent: 'center' }]}
        onPress={() => setShowPicker('start')}
      >
        <Text style={{ color: startDate ? '#fff' : '#b0c4de' }}>
          {startDate
            ? `Início: ${String(startDate.getDate()).padStart(2, '0')}/${String(startDate.getMonth() + 1).padStart(2, '0')}/${startDate.getFullYear()}`
            : 'Selecionar data inicial'}
        </Text>
      </TouchableOpacity>

      {/* 📅 Filtro por data de fim */}
      <TouchableOpacity
        style={[styles.input, { justifyContent: 'center' }]}
        onPress={() => setShowPicker('end')}
      >
        <Text style={{ color: endDate ? '#fff' : '#b0c4de' }}>
          {endDate
            ? `Fim: ${String(endDate.getDate()).padStart(2, '0')}/${String(endDate.getMonth() + 1).padStart(2, '0')}/${endDate.getFullYear()}`
            : 'Selecionar data final'}
        </Text>
      </TouchableOpacity>

      {/* 📆 DateTimePicker dinâmico */}
      {showPicker && DateTimePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event: any, selectedDate?: Date) => {
            if (event.type === 'dismissed') {
              setShowPicker(null);
              return;
            }

            if (selectedDate) {
              if (showPicker === 'start') setStartDate(selectedDate);
              else if (showPicker === 'end') setEndDate(selectedDate);
            }

            setShowPicker(null);
          }}
        />
      )}

      {/* 📋 Lista de eventos filtrados */}
      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.titulo}</Text>
            <Text style={styles.cardText}>{item.descricao}</Text>
            <Text style={styles.cardDate}>
              {new Date(item.data_hora).toLocaleString('pt-BR', {
                dateStyle: 'short',
                timeStyle: 'short',
              })}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ color: '#b0c4de', textAlign: 'center', marginTop: 20 }}>
            Nenhum evento encontrado.
          </Text>
        }
      />
      <FloatingMenu
        actions={actions}
        color="#007bff"
        floatingIcon={require("../assets/icon.png")}
        iconHeight={100}
        iconWidth={100}
        onPressItem={async (name) => {
          if (name === 'bt_perfil') {
            navigation.navigate('Profile');
          }
          if (name === 'bt_eventos'){
            navigation.navigate('Eventos');
          }

          if (name === 'bt_logout') {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('userData');
            setUser(null);
            // reset navigation stack and go to Login
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
          }
        }}
      />
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
