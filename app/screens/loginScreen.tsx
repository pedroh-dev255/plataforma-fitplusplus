import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { login } from "../api/auth"; // importa sua API
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../components/AuthContext";


export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("");
  const { setUser } = useAuth();

  const handleLogin = async () => {
    try {
        const { user, token } = await login(email, senha, tipoUsuario);
        Alert.alert("Sucesso", `Bem-vindo, ${user.nome || "Usuário"}!`);

        console.log("Usuário logado:", user);
        console.log("Token:", token);

        // salvar dados do usuário se necessário
        await AsyncStorage.setItem("userData", JSON.stringify(user));
        await AsyncStorage.setItem("token", token);
        setUser(user);

    } catch (err) {
        if (err instanceof Error) {
            Alert.alert("Erro", err.message || "Falha no login");
        } else {
            if (typeof err === "object" && err !== null && "message" in err) {
                Alert.alert("Erro", err.message ? `Detalhes: ${(err as { message?: string }).message}` : "");
            } else {
                Alert.alert("Erro", "Ocorreu um erro desconhecido.");
            }
        }
    }
  };

  return (
    <>
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
        <Picker
          selectedValue={tipoUsuario}
          onValueChange={(itemValue) => setTipoUsuario(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="Tipo de Usuário" value="" enabled={false} />
          <Picker.Item label="Professor" value="professor" />
          <Picker.Item label="Aluno" value="aluno" />
          <Picker.Item label="Praticante" value="praticante" />
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <Button title="Entrar" onPress={handleLogin} />
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
});
