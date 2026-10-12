
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateTrip } from "../service/tripApi";

export default function Home() {
  const navigate = useNavigate();

  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(5);
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState(25000);
  const [interests, setInterests] = useState(["Nature", "Food"]);
  const [travelType, setTravelType] = useState("Couple");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const tripData = {
      destination: destination.trim(),
      days,
      travelers,
      budget,
      interests,
      travelType,
    };

    setLoading(true);

    try {
      const result = await generateTrip(tripData);

      sessionStorage.setItem(
        "generatedTrip",
        JSON.stringify(result)
      );

      navigate("/trip-result");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to generate your trip. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f4f0] p-8 text-[#18352b]">
      <h1 className="mb-6 text-3xl font-semibold">
        Plan your trip
      </h1>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
        <input
          required
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Enter destination"
          className="w-full rounded-xl border p-3"
        />

        <input
          type="number"
          min="1"
          max="30"
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="w-full rounded-xl border p-3"
        />

        <input
          type="number"
          min="1"
          max="20"
          value={travelers}
          onChange={(e) => setTravelers(Number(e.target.value))}
          className="w-full rounded-xl border p-3"
        />

        <input
          type="number"
          min="1"
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="w-full rounded-xl border p-3"
        />

        <input
          value={interests.join(", ")}
          onChange={(e) =>
            setInterests(
              e.target.value
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
            )
          }
          placeholder="Nature, Food, Beaches"
          className="w-full rounded-xl border p-3"
        />

        <select
          value={travelType}
          onChange={(e) => setTravelType(e.target.value)}
          className="w-full rounded-xl border p-3"
        >
          <option value="Solo">Solo</option>
          <option value="Couple">Couple</option>
          <option value="Friends">Friends</option>
          <option value="Family">Family</option>
        </select>

        {error && (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#214b3a] p-4 font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Generating trip..." : "Generate my itinerary"}
        </button>
      </form>
    </main>
  );
}
