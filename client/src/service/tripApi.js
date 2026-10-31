
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"; 

const api = axios.create({
  baseURL: API_URL,
  timeout: 120000,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function generateTrip(tripData) {
  const response = await api.post("/api/ai/chat", tripData);

  if (!response.data?.success || !response.data?.data) {
    throw new Error(
      response.data?.message || "Unable to generate your trip."
    );
  }

  return response.data.data;
}
