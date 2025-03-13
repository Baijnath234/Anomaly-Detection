import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export const registerUser = async (userData:any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/register`, userData);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};