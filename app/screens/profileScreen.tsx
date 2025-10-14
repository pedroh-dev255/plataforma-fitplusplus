import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Modal, FlatList, Alert, Platform, Share } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../components/AuthContext';
import Toast from 'react-native-toast-message';
import { launchImageLibrary, launchCamera, ImageLibraryOptions, CameraOptions } from 'react-native-image-picker';
import { updateProfile } from '../api/profile';
import { API_URL } from '../config';
import { useNavigation } from '@react-navigation/native';

type Turma = {
  id: string;
  nome: string;
  descricao?: string;
};

type Evento = {
  id: string;
  titulo: string;
  descricao?: string;
  dataHora?: string;
};

export default function ProfileScreen() {
  const { user, setUser } = useAuth();
  const navigation = useNavigation<any>();
  // modal-based edit flow
  const [showEditModal, setShowEditModal] = useState(false);
  const [name, setName] = useState(user?.nome || '');
  const [photo, setPhoto] = useState(user?.foto_perfil || '');
  const [dtNascDate, setDtNascDate] = useState<Date | null>(null);
  const [dtNasc, setDtNasc] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  // professor-specific
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [showTurmaModal, setShowTurmaModal] = useState(false);
  const [showEventoModal, setShowEventoModal] = useState(false);
  const [newTurmaNome, setNewTurmaNome] = useState('');
  const [newTurmaDescricao, setNewTurmaDescricao] = useState('');
  const [newEventoTitulo, setNewEventoTitulo] = useState('');
  const [newEventoDescricao, setNewEventoDescricao] = useState('');
  const [newEventoDataHora, setNewEventoDataHora] = useState('');

  useEffect(() => {
    setName(user?.nome || '');
    setPhoto(user?.foto_perfil || '');
    // initialize date of birth if available (assumes ISO string)
    if (user?.data_nascimento) {
      try {
        const d = new Date(user.data_nascimento);
        if (!isNaN(d.getTime())) {
          setDtNascDate(d);
          setDtNasc(`${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`);
        }
      } catch (e) {
        // ignore parse errors
      }
    } else {
      setDtNascDate(null);
      setDtNasc('');
    }
    // load professor data if needed
    (async () => {
      if (user?.tipo === 'professor') {
        const sTurmas = await AsyncStorage.getItem(`professor_${user.id}_turmas`);
        const sEventos = await AsyncStorage.getItem(`professor_${user.id}_eventos`);
        setTurmas(sTurmas ? JSON.parse(sTurmas) : []);
        setEventos(sEventos ? JSON.parse(sEventos) : []);
      }
    })();
  }, [user]);

  const saveProfile = async () => {
    if (!name.trim()) return Toast.show({ type: 'error', text1: 'Nome obrigatório' });
    try {
      const token = await AsyncStorage.getItem('token');
      const body: any = { nome: name.trim() };
      if (photo && !photo.startsWith('http')) body.photoUri = photo;
      if (dtNascDate) body.data_nascimento = dtNascDate.toISOString();
      const res = await updateProfile(token, body);
      const updated = res?.user ? res.user : { ...user, nome: name.trim(), foto_perfil: photo, data_nascimento: dtNascDate ? dtNascDate.toISOString() : user?.data_nascimento };
      await AsyncStorage.setItem('userData', JSON.stringify(updated));
      setUser(updated);
      setShowEditModal(false);
      Toast.show({ type: 'success', text1: 'Perfil atualizado' });
    } catch (err: any) {
      console.warn('updateProfile error', err);
      Toast.show({ type: 'error', text1: 'Falha ao atualizar perfil' });
    }
  };

  const pickImageFromLibrary = async () => {
    const options: ImageLibraryOptions = { mediaType: 'photo', quality: 0.8 };
    const resp = await launchImageLibrary(options);
    if (resp.didCancel) return;
    const asset = resp.assets && resp.assets[0];
    if (asset?.uri) {
      setPhoto(asset.uri);
    }
  };

  const takePhoto = async () => {
    const options: CameraOptions = { mediaType: 'photo', quality: 0.8 };
    const resp = await launchCamera(options);
    if (resp.didCancel) return;
    const asset = resp.assets && resp.assets[0];
    if (asset?.uri) setPhoto(asset.uri);
  };

  // try to load clipboard module if available
  let ClipboardModule: any = null;
  try {
    // use require so app doesn't crash if package not installed
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    ClipboardModule = require('@react-native-clipboard/clipboard');
  } catch (e) {
    ClipboardModule = null;
  }

  const handleShareCode = async () => {
    const code = user?.codigo_professor || '';
    const message = `Cadastre-se como meu aluno no Fit++ basta usar o meu codigo no seu cadastro: ${code}`;

    // copy code to clipboard if possible
    try {
      if (ClipboardModule && ClipboardModule.setString) {
        ClipboardModule.setString(code);
        Toast.show({ type: 'success', text1: 'Código copiado para a área de transferência' });
      } else {
        Toast.show({ type: 'info', text1: 'Código pronto para compartilhar' });
      }
    } catch (err) {
      console.warn('Clipboard error', err);
    }

    // open native share sheet
    try {
      await Share.share({ message });
    } catch (err) {
      console.warn('Share error', err);
      Alert.alert('Erro', 'Não foi possível abrir o compartilhamento');
    }
  };

  const handleAddTurma = async () => {
    if (!newTurmaNome.trim()) return Toast.show({ type: 'error', text1: 'Nome da turma obrigatório' });
    const t: Turma = { id: Date.now().toString(), nome: newTurmaNome.trim(), descricao: newTurmaDescricao };
    const next = [t, ...turmas];
    setTurmas(next);
    await AsyncStorage.setItem(`professor_${user.id}_turmas`, JSON.stringify(next));
    setShowTurmaModal(false);
    setNewTurmaNome('');
    setNewTurmaDescricao('');
    Toast.show({ type: 'success', text1: 'Turma criada' });
  };

  // Date picker require (safe)
  let DateTimePicker: any = null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    DateTimePicker = require('@react-native-community/datetimepicker').default;
  } catch (e) {
    DateTimePicker = null;
  }

  const openEditModal = () => {
    setName(user?.nome || '');
    setPhoto(user?.foto_perfil || '');
    if (user?.data_nascimento) {
      const d = new Date(user.data_nascimento);
      if (!isNaN(d.getTime())) {
        setDtNascDate(d);
        setDtNasc(`${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`);
      } else {
        setDtNascDate(null);
        setDtNasc('');
      }
    } else {
      setDtNascDate(null);
      setDtNasc('');
    }
    setShowEditModal(true);
  };

  const handleAddEvento = async () => {
    if (!newEventoTitulo.trim()) return Toast.show({ type: 'error', text1: 'Título do evento obrigatório' });
    const e: Evento = { id: Date.now().toString(), titulo: newEventoTitulo.trim(), descricao: newEventoDescricao, dataHora: newEventoDataHora };
    const next = [e, ...eventos];
    setEventos(next);
    await AsyncStorage.setItem(`professor_${user.id}_eventos`, JSON.stringify(next));
    setShowEventoModal(false);
    setNewEventoTitulo('');
    setNewEventoDescricao('');
    setNewEventoDataHora('');
    Toast.show({ type: 'success', text1: 'Evento criado' });
  };

  if (!user) return (
    <View style={styles.center}><Text style={{ color: '#fff' }}>Usuário não autenticado</Text></View>
  );

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
          <Text style={{ color: '#fff' }}>◀ Voltar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.headerArea}>
        
        <View style={styles.avatarWrap}>
          {photo ? (
            <Image source={{ uri: photo.startsWith('http') ? photo : photo }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}><Text style={{ color: '#fff' }}>{(user.nome || 'U').charAt(0)}</Text></View>
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{user.nome}</Text>
          <TouchableOpacity onPress={handleShareCode}>
            <Text style={styles.code}>Código de Professor: {user.codigo_professor}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.editBtn} onPress={() => setShowEditModal(true)}>
          <Text style={{ color: '#fff' }}>Editar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Biografia</Text>
        <Text style={[styles.value, { opacity: 0.8 }]}>{user.bio}</Text>
        {/* edits happen inside modal */}
      </View>

      {user.tipo === 'professor' && (
        <View style={styles.card}>
          <Text>Meus Alunos</Text>
          
        </View>
      )}

      {/* Modal criar turma */}
      <Modal visible={showTurmaModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Criar turma</Text>
            <TextInput placeholder="Nome da turma" style={styles.input} value={newTurmaNome} onChangeText={setNewTurmaNome} />
            <TextInput placeholder="Descrição" style={styles.input} value={newTurmaDescricao} onChangeText={setNewTurmaDescricao} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity style={styles.modalBtn} onPress={() => setShowTurmaModal(false)}><Text>Cancelar</Text></TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnPrimary} onPress={handleAddTurma}><Text style={{ color: '#fff' }}>Criar</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal criar evento */}
      <Modal visible={showEventoModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Criar evento</Text>
            <TextInput placeholder="Título" style={styles.input} value={newEventoTitulo} onChangeText={setNewEventoTitulo} />
            <TextInput placeholder="Descrição" style={styles.input} value={newEventoDescricao} onChangeText={setNewEventoDescricao} />
            <TextInput placeholder="Data e hora" style={styles.input} value={newEventoDataHora} onChangeText={setNewEventoDataHora} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity style={styles.modalBtn} onPress={() => setShowEventoModal(false)}><Text>Cancelar</Text></TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnPrimary} onPress={handleAddEvento}><Text style={{ color: '#fff' }}>Criar</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal visible={showEditModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Editar perfil</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nome" placeholderTextColor="#b0c4de" />
            <TextInput style={styles.input} value={user?.bio || ''} onChangeText={() => {}} placeholder="Biografia" placeholderTextColor="#b0c4de" />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity style={styles.smallBtn} onPress={pickImageFromLibrary}><Text style={{ color: '#fff' }}>Escolher Imagem</Text></TouchableOpacity>
              <TouchableOpacity style={styles.smallBtn} onPress={takePhoto}><Text style={{ color: '#fff' }}>Tirar Foto</Text></TouchableOpacity>
            </View>
            <TouchableOpacity style={[styles.input, { justifyContent: 'center' }]} onPress={() => setShowDatePicker(true)}>
              <Text style={{ color: dtNascDate ? '#fff' : '#b0c4de' }}>{dtNascDate ? `${String(dtNascDate.getDate()).padStart(2,'0')}/${String(dtNascDate.getMonth()+1).padStart(2,'0')}/${dtNascDate.getFullYear()}` : 'Data de Nascimento'}</Text>
            </TouchableOpacity>
            {showDatePicker && DateTimePicker && (
              <DateTimePicker
                value={dtNascDate || new Date(2000,0,1)}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                maximumDate={new Date()}
                onChange={(event: any, selectedDate?: Date) => {
                  setShowDatePicker(Platform.OS === 'ios');
                  if (selectedDate) {
                    setDtNascDate(selectedDate);
                    const formatted = `${String(selectedDate.getDate()).padStart(2,'0')}/${String(selectedDate.getMonth()+1).padStart(2,'0')}/${selectedDate.getFullYear()}`;
                    setDtNasc(formatted);
                  }
                }}
              />
            )}

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
              <TouchableOpacity style={styles.modalBtn} onPress={() => setShowEditModal(false)}><Text>Cancelar</Text></TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnPrimary} onPress={saveProfile}><Text style={{ color: '#fff' }}>Salvar</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a1f3c', padding: 16, paddingTop: 60 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerArea: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatarWrap: { marginRight: 12 },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  avatarPlaceholder: { backgroundColor: '#004a99', alignItems: 'center', justifyContent: 'center' },
  name: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  code: { color: '#cfe8ff', fontSize: 12 },
  editBtn: { backgroundColor: '#007bff', padding: 8, borderRadius: 8 },
  /* dark translucent card used across screens */
  card: { backgroundColor: 'rgba(0, 39, 83, 0.9)', borderRadius: 12, padding: 12, marginBottom: 12 },
  label: { color: '#cfe8ff', marginTop: 8 },
  value: { color: '#fff', fontSize: 16, marginTop: 4 },
  input: { backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff', padding: 10, borderRadius: 8, marginTop: 6 },
  saveBtn: { backgroundColor: '#00a86b', padding: 12, borderRadius: 10, marginTop: 12, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: 'bold' },
  sectionTitle: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginBottom: 8 },
  smallBtn: { backgroundColor: '#007bff', padding: 8, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 8 },
  listRow: { padding: 8, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.04)', marginBottom: 6 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: 'rgba(10,31,60,0.95)', borderRadius: 12, padding: 16 },
  modalTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#fff' },
  modalBtn: { padding: 10 },
  modalBtnPrimary: { padding: 10, backgroundColor: '#007bff', borderRadius: 8 },
});
