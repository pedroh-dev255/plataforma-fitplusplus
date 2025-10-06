import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground } from "react-native";
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

        await AsyncStorage.setItem("userData", JSON.stringify(user));
        await AsyncStorage.setItem("token", token);
        setUser(user);

    } catch (err) {
        Alert.alert("Erro", err instanceof Error ? err.message : "Falha no login");
    }
  };

  return (
    <ImageBackground 
      source={require('../assets/background-login.png')} // substitua pelo seu arquivo de background
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.card}>
        <ImageBackground 
          source={require('../assets/logo.png')} // logo do FIT+
          style={styles.logoContainer}
          resizeMode="contain"
        />

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={tipoUsuario}
            onValueChange={(itemValue) => setTipoUsuario(itemValue)}
            style={styles.picker}
            dropdownIconColor="#fff"
          >
            <Picker.Item label="Tipo de Usuário" value="" enabled={false} color="#808080ff"/>
            <Picker.Item label="Professor" value="professor" color="#141414ff"/>
            <Picker.Item label="Aluno" value="aluno" color="#141414ff"/>
            <Picker.Item label="Praticante" value="praticante" color="#141414ff"/>
          </Picker>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Preencha seu login"
          placeholderTextColor="#b0c4de"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Preencha sua senha"
          placeholderTextColor="#b0c4de"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <TouchableOpacity>
          <Text style={styles.link}>Esqueci minha senha</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.link}>Não possui uma conta? Cadastre-se agora!</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>ENTRAR</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a1f3c",
  },
  card: {
    width: "85%",
    padding: 20,
    borderRadius: 20,
    backgroundColor: "rgba(10, 31, 60, 0.9)",
    alignItems: "center",
  },
  logoContainer: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  pickerContainer: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    marginBottom: 15,
  },
  picker: {
    color: "#fff",
    width: "100%",
  },
  input: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    color: "#fff",
  },
  link: {
    color: "#87cefa",
    textDecorationLine: "underline",
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    width: "100%",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  buttonText: {
    color: "#0a1f3c",
    fontWeight: "bold",
    fontSize: 16,
  },
});
