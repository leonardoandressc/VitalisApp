// src/api/auth.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function registerUser({ name, email, password }) {
  try {
    const response = await axios.post(`${API_URL}/users/users/`, {
      name,
      email,
      password,
    });

    return response.data;
  } catch (error) {
    console.error("Error en registro:", error);
    throw error.response?.data || error;
  }
}
