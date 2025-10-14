import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
import { resetPass } from '../api/auth';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function ResetScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const email = route.params?.email;
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleReset = async () => {
    if (!code.trim() || !password) return Alert.alert('Erro', 'Preencha código e senha');
    if (password !== confirm) return Alert.alert('Erro', 'Senhas não conferem');
    try {
      await resetPass(code.trim(), password);
      Alert.alert('Sucesso', 'Senha redefinida');
      navigation.navigate('Login');
    } catch (err: any) {
      Alert.alert('Erro', err?.message || 'Falha ao redefinir senha');
    }
  };

  return (
    <ImageBackground source={require('../assets/background-reset.png')} style={styles.background} resizeMode="cover">
      <View style={styles.card}>
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Redefinir senha</Text>
        <Text style={{ color: '#cfe8ff', marginBottom: 8 }}>Email: {email || '—'}</Text>
        <TextInput style={styles.input} placeholder="Código" placeholderTextColor="#b0c4de" value={code} onChangeText={setCode} />
        <TextInput style={styles.input} placeholder="Nova senha" placeholderTextColor="#b0c4de" secureTextEntry value={password} onChangeText={setPassword} />
        <TextInput style={styles.input} placeholder="Confirmar senha" placeholderTextColor="#b0c4de" secureTextEntry value={confirm} onChangeText={setConfirm} />
        <TouchableOpacity style={styles.button} onPress={handleReset}><Text style={{ color: '#0a1f3c', fontWeight: 'bold' }}>Enviar</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginTop: 8 }}><Text style={{ color: '#87cefa' }}>Voltar ao login</Text></TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a1f3c' },
  card: { width: '85%', padding: 20, borderRadius: 20, backgroundColor: 'rgba(10,31,60,0.95)', alignItems: 'center' },
  input: { width: '100%', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: 12, marginBottom: 12, color: '#fff' },
  button: { width: '100%', padding: 15, borderRadius: 10, backgroundColor: '#fff', alignItems: 'center' },
  buttonText: { color: '#0a1f3c', fontWeight: 'bold' },
});