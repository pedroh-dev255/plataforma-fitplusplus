import axios from 'axios';
import { API_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: API_URL,
});


export async function fetchEvents(userID: string, dtinicio?: string, dtfim?: string) {
    const token = await AsyncStorage.getItem("token");
    try {
        const response = await api.post('/api/events/getEvents',
            { userId: userID , dtinicio, dtfim },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        console.debug('Eventos recebidos:', response.data);
        return response.data.events;
    } catch (err) {
        console.error('Erro ao buscar eventos:', err);
        throw err;
    }
}