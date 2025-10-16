"use client";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "next/navigation";
import Toast from "react-hot-toast";

//  import NotificationHandler from "../components/NotificationHandler";
//import NotificationIcon from "../components/NotificationIcon";
import { useAuth } from "../AuthContext";
//import { API_URL } from "@/config";
import { fetchEvents } from "../../api/events";

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState('');

  useEffect(() => {
    const loadEvents = async () => {
      if (user?.id) {
        try {
          const ev = await fetchEvents(user.id);
          setEvents(ev || []);
        } catch (err) {
          console.error("Erro ao carregar eventos:", err);
          Toast.error("Erro ao carregar eventos");
        }
      }
    };
    loadEvents();
  }, [user]);

  const renderNextEvents = () => {
    if (events.length === 0) {
      return (
        <Text style={{ color: "#fff", textAlign: "center", marginBottom: 20 }}>
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
        <Text style={{ color: "#fff", textAlign: "center", marginBottom: 20 }}>
          Nenhum evento nos próximos dias.
        </Text>
      );
    }

    return upcoming.map(ev => {
      const evDate = new Date(ev.data_hora);
      const dateStr = evDate.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const timeStr = evDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

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
                { backgroundColor: isToday ? "#cfb000ff" : "#007bff" },
              ]}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                {dateStr} às {timeStr}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.acceptBtn}
              onPress={() => router.push("/eventos")}
            >
              <Text style={{ color: "#007bff" }}>Ver detalhes</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      <NotificationHandler />
      <View style={{ position: "absolute", top: 50, right: 15, zIndex: 5 }}>
        <NotificationIcon />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, marginTop: 25 }}>
        <TouchableOpacity onPress={() => router.push("/profile")}>
          <View style={styles.header}>
            <Image
              source={"/perfil.png"}
              style={styles.avatar}
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.greeting}>Olá, {user?.nome || "Usuário"}</Text>
              <Text style={styles.role}>{user?.tipo || "Aluno"}</Text>
            </View>
          </View>
        </TouchableOpacity>

        <Text style={styles.title}>Próximos eventos</Text>
        {renderNextEvents()}

        <View style={styles.trainCards}>
          <TouchableOpacity
            onPress={() => router.push("/eventos")}
            style={styles.trainCard}
          >
            <View>
              <Image
                source={"/evento.png"}
                style={styles.trainImage}
              />
              <Text style={styles.trainTitle}>Eventos</Text>
              <Text style={styles.trainDesc}>
                Visualize seus eventos e busque por novos
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.trainCard}>
            <View>
              <Image
                source={"/forum.png"}
                style={styles.trainImage}
              />
              <Text style={styles.trainTitle}>Fórum</Text>
              <Text style={styles.trainDesc}>
                Converse com alunos, professores e praticantes
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a1f3c" },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#ccc" },
  greeting: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  role: { fontSize: 14, color: "#fff" },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#fff",
  },
  card: {
    backgroundColor: "rgba(95, 95, 95, 0.9)",
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
  },
  cardTitle: { color: "#fff", fontWeight: "bold", fontSize: 16, marginBottom: 10 },
  nextWorkout: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  workoutBadge: { backgroundColor: "#007bff", padding: 10, borderRadius: 8 },
  acceptBtn: { borderWidth: 1, borderColor: "#bbdcff", padding: 8, borderRadius: 8 },
  workoutInfo: { fontSize: 12, color: "#e7e7e7" },
  trainCards: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  trainCard: {
    flex: 1,
    backgroundColor: "rgba(12, 61, 131, 0.97)",
    borderRadius: 16,
    padding: 15,
    marginHorizontal: 5,
  },
  trainImage: { width: 80, height: 80, borderRadius: 12, marginBottom: 10 },
  trainTitle: { fontWeight: "bold", fontSize: 16, color: "#fff", marginBottom: 5 },
  trainDesc: { color: "#fff", fontSize: 12 },
});
