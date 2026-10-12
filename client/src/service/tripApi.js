
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
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
