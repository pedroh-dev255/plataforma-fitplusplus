// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FloatingAction } from "react-native-floating-action";
import NotificationPrompt from '../components/notifyComponent';
import NotificationHandler from '../components/NotificationHandler';
import NotificationIcon from '../components/NotificationIcon';
import Toast from 'react-native-toast-message';
import { useAuth } from '../components/AuthContext';
import { API_URL } from '../config';
import { fetchEvents } from '../api/events';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const { user, setUser } = useAuth();
  const navigation = useNavigation<any>();
  const [events, setEvents] = useState<any[]>([]);

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

  // renderiza os próximos eventos nos próximos 7 dias
  const renderNextEvents = () => {
    if (events.length === 0) {
      return (
        <Text style={{ color: '#fff', textAlign: 'center', marginBottom: 20 }}>
          Nenhum evento próximo.
        </Text>
      );
    }

    const now = new Date();
    const weekLater = new Date();
    weekLater.setDate(now.getDate() + 7);

    const upcoming = events.filter(ev => {
      const evDate = new Date(ev.data_hora);
      return evDate >= now && evDate <= weekLater;
    });

    if (upcoming.length === 0) {
      return (
        <Text style={{ color: '#fff', textAlign: 'center', marginBottom: 20 }}>
          Nenhum evento nos próximos dias.
        </Text>
      );
    }

    return upcoming.map(ev => {
      const evDate = new Date(ev.data_hora);

      // ✅ Formata a data manualmente em dd/mm/yyyy
      const dateStr = evDate.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      const timeStr = evDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // ✅ Verifica se é o mesmo dia
      const isToday =
        evDate.getDate() === now.getDate() &&
        evDate.getMonth() === now.getMonth() &&
        evDate.getFullYear() === now.getFullYear();

      return (
        <View key={ev.id} style={styles.card}>
          <Text style={styles.cardTitle}>{ev.titulo}</Text>
          {ev.descricao ? <Text style={styles.workoutInfo}>{ev.descricao}</Text> : null}

          <View style={styles.nextWorkout}>
            <View
              style={[
                styles.workoutBadge,
                { backgroundColor: isToday ? '#cfb000ff' : '#007bff' },
              ]}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                {dateStr} às {timeStr}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.acceptBtn}
              onPress={() => navigation.navigate('Eventos')}
            >
              <Text style={{ color: '#007bff' }}>Ver detalhes</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    });
  };


  return (
    <View style={styles.container}>
      <NotificationHandler/>
      <View style={{ position: 'absolute', top: 50, right: 15, zIndex: 5 }}>
        <NotificationIcon />
      </View>
      <View style={styles.toastContainer} pointerEvents="box-none">
        <Toast />
      </View>
      
      <ScrollView contentContainerStyle={{ padding: 20, marginTop: 25 }}>
        {/* Header do usuário */}
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <View style={styles.header}>
            <Image
              source={user?.foto_perfil ? { uri: `${API_URL}/public/profile/${user.foto_perfil}` } : (user?.avatar ? { uri: user.avatar } : require('../assets/perfil.png'))}
              style={styles.avatar}
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.greeting}>Olá, {user?.nome || "Usuário"}</Text>
              <Text style={styles.role}>{user?.tipo || "Aluno"}</Text>
            </View>
          </View>
        </TouchableOpacity>
        {/* proximos eventos */}
        <Text style={styles.title}>Proximos eventos</Text>
        {renderNextEvents()}

        <View style={styles.trainCards}>
          <TouchableOpacity onPress={() => navigation.navigate('Eventos')} style={styles.trainCard}>
            <View >
              <Image source={require('../assets/evento.png')} style={styles.trainImage} />
              <Text style={styles.trainTitle}>Eventos</Text>
              <Text style={styles.trainDesc}>Visualize seus eventos e busque por novos</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.trainCard}>
            <View >
              <Image source={require('../assets/forum.png')} style={styles.trainImage} />
              <Text style={styles.trainTitle}>Forum</Text>
              <Text style={styles.trainDesc}>Converse com alunos professores e praticantes</Text>
               
              
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a1f3c' },
  toastContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 1000,
    // assegura que toasts não bloqueiem toques em elementos abaixo
    pointerEvents: 'box-none',
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#ccc' },
  greeting: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  role: { fontSize: 14, color: '#fff' },
  editProfile: { fontSize: 12, color: '#a0c4ff', marginTop: 2 },

  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#fff' },

  /* cards use the same dark translucent card as other screens */
  card: { backgroundColor: 'rgba(95, 95, 95, 0.9)', borderRadius: 20, padding: 15, marginBottom: 20 },
  cardTitle: { color: "#fff", fontWeight: 'bold', fontSize: 16, marginBottom: 10 },
  nextWorkout: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  workoutBadge: { backgroundColor: '#007bffff', padding: 10, borderRadius: 8 },
  acceptBtn: { borderWidth: 1, borderColor: '#bbdcffff', padding: 8, borderRadius: 8 },
  workoutInfo: { fontSize: 12, color: '#e7e7e7ff' },

  progressCard: { backgroundColor: '#004a99', borderRadius: 16, padding: 20, marginBottom: 20, alignItems: 'center' },
  progressText: { fontSize: 36, color: '#fff', fontWeight: 'bold' },
  progressLabel: { color: '#fff', fontSize: 16 },
  progressInfo: { color: '#fff', marginTop: 5 },

  trainCards: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  trainCard: { flex: 1, backgroundColor: 'rgba(12, 61, 131, 0.97)', borderRadius: 16, padding: 15, marginHorizontal: 5, position: 'relative' },
  trainImage: { width: 80, height: 80, borderRadius: 12, marginBottom: 10 },
  trainTitle: { fontWeight: 'bold', fontSize: 16, color: '#fff', marginBottom: 5 },
  trainDesc: { color: '#fff', fontSize: 12 },

  sectionTitle: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginBottom: 10 },
  feedbackCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, padding: 10, marginBottom: 10, alignItems: 'flex-start' },
  feedbackAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  feedbackStars: { fontSize: 14, marginBottom: 5 },
  feedbackPos: { fontSize: 12, color: '#333' },
  feedbackNeg: { fontSize: 12, color: '#555' },
  feedbackDate: { fontSize: 10, color: '#999', marginTop: 2 },
});
