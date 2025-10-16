import axios from 'axios';
import { API_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: API_URL,
});


export async function getAlunos(userID: string) {

  const token = await AsyncStorage.getItem("token");
    try {
        const response = await api.post('/api/teacher/getAlunos',
            { id_prof: userID },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        console.debug('Alunos recebidos:', response.data);
        return response.data.alunos;
    } catch (err) {
        console.error('Erro ao buscar alunos:', err);
        throw err;
    }
  
}
