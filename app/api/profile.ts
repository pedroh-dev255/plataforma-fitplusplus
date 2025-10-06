import axios from 'axios';
import { API_URL } from '../config';

type UpdateProfileResponse = {
  user: any;
};

/**
 * Envia dados de perfil para o backend. Se photoFile for um objeto File/uri, envia multipart/form-data.
 * token é o token de autenticação (se aplicável).
 */
export async function updateProfile(token: string | null, data: { nome?: string; photoUri?: string }) {
  const url = `${API_URL}/api/profile`;
  const headers: any = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  // Se houver photoUri, envia como multipart/form-data
  if (data.photoUri) {
    const form = new FormData();
    if (data.nome) form.append('nome', data.nome);
    // react-native image picker uri: file:// for iOS/Android content:// sometimes
    const uri = data.photoUri;
    const fileName = uri.split('/').pop() || `photo_${Date.now()}.jpg`;
    const file: any = {
      uri,
      type: 'image/jpeg',
      name: fileName,
    };
    form.append('foto', file as any);

    const res = await axios.post(url, form, { headers: { ...headers, 'Content-Type': 'multipart/form-data' } });
    return res.data as UpdateProfileResponse;
  }

  // apenas nome
  const res = await axios.post(url, { nome: data.nome }, { headers });
  return res.data as UpdateProfileResponse;
}
