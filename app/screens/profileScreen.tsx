import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Modal, FlatList, Alert, Platform } from 'react-native';
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
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user?.nome || '');
  const [photo, setPhoto] = useState(user?.foto_perfil || '');

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
      // primeiro, enviar para backend (se tiver endpoint)
      const token = await AsyncStorage.getItem('token');
      const res = await updateProfile(token, { nome: name.trim(), photoUri: photo && photo.startsWith('http') ? undefined : photo });
      // backend deve retornar user atualizado
      const updated = res?.user ? res.user : { ...user, nome: name.trim(), foto_perfil: photo };
      await AsyncStorage.setItem('userData', JSON.stringify(updated));
      setUser(updated);
      setEditMode(false);
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
      <View style={styles.headerArea}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
          <Text style={{ color: '#fff' }}>◀ Voltar</Text>
        </TouchableOpacity>
        <View style={styles.avatarWrap}>
          {photo ? (
            <Image source={{ uri: photo.startsWith('http') ? photo : photo }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}><Text style={{ color: '#fff' }}>{(user.nome || 'U').charAt(0)}</Text></View>
          )}
        </View>
        <View style={{ flex: 1 }}>
          {!editMode ? (
            <Text style={styles.name}>{user.nome}</Text>
          ) : (
            <TextInput style={styles.input} value={name} onChangeText={setName} />
          )}
          <Text style={styles.email}>{user.email}</Text>
        </View>
        <TouchableOpacity style={styles.editBtn} onPress={() => setEditMode(!editMode)}>
          <Text style={{ color: '#fff' }}>{editMode ? 'Cancelar' : 'Editar'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Nome</Text>
        {!editMode ? (
          <Text style={styles.value}>{user.nome}</Text>
        ) : (
          <TextInput style={styles.input} value={name} onChangeText={setName} />
        )}

        <Text style={styles.label}>Email</Text>
        <Text style={[styles.value, { opacity: 0.8 }]}>{user.email}</Text>

        <Text style={styles.label}>Foto de perfil</Text>
        {!editMode ? (
          photo ? <Text style={styles.value}>{photo}</Text> : <Text style={styles.value}>Sem foto</Text>
        ) : (
          <>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity style={styles.smallBtn} onPress={pickImageFromLibrary}><Text style={{ color: '#fff' }}>Escolher</Text></TouchableOpacity>
              <TouchableOpacity style={styles.smallBtn} onPress={takePhoto}><Text style={{ color: '#fff' }}>Câmera</Text></TouchableOpacity>
            </View>
            <Text style={{ color: '#fff', marginTop: 8 }}>{photo}</Text>
          </>
        )}

        {editMode && (
          <TouchableOpacity style={styles.saveBtn} onPress={saveProfile}><Text style={styles.saveBtnText}>Salvar</Text></TouchableOpacity>
        )}
      </View>

      {user.tipo === 'professor' && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Suas turmas</Text>
          <TouchableOpacity style={styles.smallBtn} onPress={() => setShowTurmaModal(true)}><Text style={{ color: '#fff' }}>Criar turma</Text></TouchableOpacity>
          <FlatList data={turmas} keyExtractor={t => t.id} renderItem={({ item }) => (
            <View style={styles.listRow}><Text style={{ color: '#fff' }}>{item.nome}</Text></View>
          )} ListEmptyComponent={() => <Text style={{ color: '#fff', opacity: 0.8 }}>Nenhuma turma</Text>} />

          <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Seus eventos</Text>
          <TouchableOpacity style={styles.smallBtn} onPress={() => setShowEventoModal(true)}><Text style={{ color: '#fff' }}>Criar evento</Text></TouchableOpacity>
          <FlatList data={eventos} keyExtractor={e => e.id} renderItem={({ item }) => (
            <View style={styles.listRow}><Text style={{ color: '#fff' }}>{item.titulo}</Text><Text style={{ color: '#fff', opacity: 0.7 }}>{item.dataHora}</Text></View>
          )} ListEmptyComponent={() => <Text style={{ color: '#fff', opacity: 0.8 }}>Nenhum evento</Text>} />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a3f7d', padding: 16, paddingTop: 60 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerArea: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatarWrap: { marginRight: 12 },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  avatarPlaceholder: { backgroundColor: '#004a99', alignItems: 'center', justifyContent: 'center' },
  name: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  email: { color: '#cfe8ff', fontSize: 12 },
  editBtn: { backgroundColor: '#007bff', padding: 8, borderRadius: 8 },
  card: { backgroundColor: '#074b86', borderRadius: 12, padding: 12, marginBottom: 12 },
  label: { color: '#cfe8ff', marginTop: 8 },
  value: { color: '#fff', fontSize: 16, marginTop: 4 },
  input: { backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff', padding: 10, borderRadius: 8, marginTop: 6 },
  saveBtn: { backgroundColor: '#00a86b', padding: 12, borderRadius: 10, marginTop: 12, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: 'bold' },
  sectionTitle: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginBottom: 8 },
  smallBtn: { backgroundColor: '#007bff', padding: 8, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 8 },
  listRow: { padding: 8, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.04)', marginBottom: 6 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  modalTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  modalBtn: { padding: 10 },
  modalBtnPrimary: { padding: 10, backgroundColor: '#007bff', borderRadius: 8 },
});
