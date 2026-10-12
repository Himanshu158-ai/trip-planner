
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 120000,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function generateTrip(tripData) {
  const response = await api.post("/api/trips/generate", tripData);

  if (!response.data?.success || !response.data?.data) {
    throw new Error(
      response.data?.message || "Unable to generate your trip."
    );
  }

  return response.data.data;
}
