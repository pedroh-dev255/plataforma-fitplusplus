import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground, Platform } from 'react-native';
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from '@react-navigation/native';
const DateTimePicker: any = require('@react-native-community/datetimepicker').default;

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [dtNasc, setDtNasc] = useState('');
  const [dtNascDate, setDtNascDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [email, setEmail] = useState('');
  const [schoolCode, setSchoolCode] = useState('');
  const [classeCode, setClasseCode] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('');
  const navigation = useNavigation<any>();

  const handleNext = () => {
    if (!tipoUsuario) return Alert.alert('Erro', 'Selecione o tipo de usuário');
    if (!name.trim() || !email.trim() || !password || !password2) return Alert.alert('Erro', 'Preencha todos os campos');
    if (password !== password2) return Alert.alert('Erro', 'Senhas não conferem');
    if (tipoUsuario === 'aluno' && !classeCode.trim()) return Alert.alert('Erro', 'Informe o código da classe');
    if (tipoUsuario === 'professor' && !schoolCode.trim()) return Alert.alert('Erro', 'Informe o código da instituição');

    // formatar data
    const formatDt = (d: string) => {
      if (!d) return '';
      const parts = d.split(/[\/\-]/).map(p => p.trim());
      if (parts.length === 3) {
        if (parts[2].length === 4 && parts[0].length <= 2) {
          const [dd, mm, yyyy] = parts;
          return `${yyyy}-${mm.padStart(2,'0')}-${dd.padStart(2,'0')}`;
        }
        if (parts[0].length === 4) return `${parts[0]}-${parts[1]}-${parts[2]}`;
      }
      return d;
    };
    const dataNascimento = formatDt(dtNasc);

    const userData = {
      schoolcode: schoolCode,
      classcode: classeCode,
      nome: name,
      email,
      senha: password,
      tipo: tipoUsuario,
      dtNasc: dataNascimento,
    };

    navigation.navigate('BodyMapping', { userData }); // leva os dados pra próxima tela
  };

  return (
    <ImageBackground source={require('../assets/background-register.png')} style={styles.background}>
      <View style={styles.card}>
        <Text style={styles.title}>Criar conta</Text>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={tipoUsuario}
            onValueChange={(itemValue) => setTipoUsuario(itemValue)}
            style={styles.picker}
            dropdownIconColor="#fff"
          >
            <Picker.Item label="Tipo de Usuário" value="" enabled={false} color="#808080ff" />
            <Picker.Item label="Professor" value="professor" color="#141414ff" />
            <Picker.Item label="Aluno" value="aluno" color="#141414ff" />
            <Picker.Item label="Praticante" value="praticante" color="#141414ff" />
          </Picker>
        </View>

        {tipoUsuario === "aluno" && (
          <TextInput style={styles.input} placeholder="Código do Professor" placeholderTextColor="#b0c4de"
            value={classeCode} onChangeText={setClasseCode} />
        )}
        {tipoUsuario === "professor" && (
          <TextInput style={styles.input} placeholder="Código da Instituição" placeholderTextColor="#b0c4de"
            value={schoolCode} onChangeText={setSchoolCode} />
        )}

        <TextInput style={styles.input} placeholder="Nome" placeholderTextColor="#b0c4de" value={name} onChangeText={setName} />
        <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
          <Text style={{ color: dtNascDate ? '#fff' : '#b0c4de' }}>
            {dtNascDate ? `${String(dtNascDate.getDate()).padStart(2,'0')}/${String(dtNascDate.getMonth()+1).padStart(2,'0')}/${dtNascDate.getFullYear()}` : 'Data de Nascimento'}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={dtNascDate || new Date(2000,0,1)}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            maximumDate={new Date()}
            onChange={(event: any, selectedDate?: Date) => {
              setShowDatePicker(Platform.OS === 'ios');
              if (selectedDate) {
                setDtNascDate(selectedDate);
                setDtNasc(`${String(selectedDate.getDate()).padStart(2,'0')}/${String(selectedDate.getMonth()+1).padStart(2,'0')}/${selectedDate.getFullYear()}`);
              }
            }}
          />
        )}

        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#b0c4de" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Senha" placeholderTextColor="#b0c4de" value={password} onChangeText={setPassword} secureTextEntry />
        <TextInput style={styles.input} placeholder="Repita a Senha" placeholderTextColor="#b0c4de" value={password2} onChangeText={setPassword2} secureTextEntry />

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>PRÓXIMO</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginTop: 8 }}>
          <Text style={{ color: '#87cefa' }}>Já tem conta? Entrar</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a1f3c' },
  card: { width: '85%', padding: 20, borderRadius: 20, backgroundColor: 'rgba(10, 31, 60, 0.9)', alignItems: 'center' },
  title: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  input: { width: '100%', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: 12, marginBottom: 12, color: '#fff' },
  pickerContainer: { width: "100%", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 10, marginBottom: 15 },
  picker: { color: "#fff", width: "100%" },
  button: { width: '100%', padding: 15, borderRadius: 10, backgroundColor: '#fff', alignItems: 'center' },
  buttonText: { color: '#0a1f3c', fontWeight: 'bold' },
});
