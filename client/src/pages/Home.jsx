
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateTrip } from "../service/tripApi";
import {
  ArrowRight,
  CalendarDays,
  Camera,
  Check,
  Clock3,
  Compass,
  Lightbulb,
  LoaderCircle,
  MapPin,
  Minus,
  Mountain,
  Plus,
  Sparkles,
  TreePalm,
  Users,
  Wallet,
  Waves,
  Utensils,
  Landmark,
  Plane,
  AlertCircle,
  ChevronDown,
} from "lucide-react";

const interestsList = [
  { name: "Adventure", icon: Mountain },
  { name: "Beaches", icon: Waves },
  { name: "Photography", icon: Camera },
  { name: "Food", icon: Utensils },
  { name: "Culture", icon: Landmark },
  { name: "Nature", icon: TreePalm },
];

const destinations = [
  {
    name: "Bali, Indonesia",
    label: "Tropical escape",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=700&q=85",
  },
  {
    name: "Swiss Alps",
    label: "Mountain retreat",
    image:
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=700&q=85",
  },
  {
    name: "Goa, India",
    label: "Beach getaway",
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=700&q=85",
  },
];

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

function Counter({ label, value, onChange, min, max, icon: Icon }) {
  return (
    <div>
      <label className="mb-2.5 flex items-center gap-2 text-sm font-semibold">
        <Icon size={16} className="text-[#79966f]" />
        {label}
      </label>

      <div className="flex items-center justify-between rounded-xl border border-[#e2e1d9] bg-[#f8f7f3] px-4 py-3">
        <span className="text-sm text-[#7b857d]">
          {value} {label === "Trip duration" ? "days" : "people"}
        </span>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={`Decrease ${label}`}
            disabled={value <= min}
            onClick={() => onChange(Math.max(min, value - 1))}
            className="rounded-full border border-[#deded5] p-1.5 transition hover:bg-white disabled:opacity-35"
          >
            <Minus size={14} />
          </button>

          <span className="w-5 text-center text-sm font-semibold">
            {value}
          </span>

          <button
            type="button"
            aria-label={`Increase ${label}`}
            disabled={value >= max}
            onClick={() => onChange(Math.min(max, value + 1))}
            className="rounded-full border border-[#deded5] p-1.5 transition hover:bg-white disabled:opacity-35"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();

  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(5);
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState("25000");
  const [interests, setInterests] = useState(["Nature", "Food"]);
  const [travelType, setTravelType] = useState("Couple");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggleInterest(name) {
    setInterests((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name]
    );
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!destination.trim()) {
      setError("Please enter your destination.");
      return;
    }

    if (!interests.length) {
      setError("Please select at least one interest.");
      return;
    }

    const numericBudget = Number(budget);

    if (!Number.isFinite(numericBudget) || numericBudget <= 0) {
      setError("Please enter a valid budget greater than zero.");
      return;
    }

    const tripData = {
      destination: destination.trim(),
      days,
      travelers,
      budget: numericBudget,
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
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (err.code === "ECONNABORTED"
            ? "Trip generation is taking longer than expected. Please try again."
            : !err.response
              ? "Cannot connect to the server. Check your backend and API URL."
              : "Unable to generate your trip. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  }

  function selectDestination(name) {
    setDestination(name);
    setError("");
    document.getElementById("planner")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <div className="min-h-screen bg-[#f5f4f0] text-[#18352b]">
      {/* Navbar */}
      <header className="sticky top-0 z-30 border-b border-[#e2e1d9] bg-[#f5f4f0]/95 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <button
            type="button"
            onClick={() =>
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
            className="flex items-center gap-2.5 text-left"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#214b3a] text-white">
              <Compass size={22} />
            </span>

            <span>
              <span className="block text-lg font-bold tracking-tight">
                roam<span className="text-[#7a9b65]">wise</span>
              </span>
              <span className="block text-[10px] tracking-[0.2em] text-[#718077]">
                TRAVEL, THOUGHTFULLY
              </span>
            </span>
          </button>

          <div className="hidden items-center gap-8 text-sm font-medium text-[#627067] md:flex">
            <a href="#planner" className="transition hover:text-[#214b3a]">
              Plan a trip
            </a>
            <a
              href="#destinations"
              className="transition hover:text-[#214b3a]"
            >
              Explore
            </a>
            <span className="rounded-full border border-[#dfe5dc] px-4 py-2 text-[#214b3a]">
              <Sparkles size={13} className="mr-1 inline" />
              AI travel planner
            </span>
          </div>

          <a
            href="#planner"
            className="rounded-full bg-[#214b3a] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#17392b]"
          >
            Start planning
          </a>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-5 pb-16 pt-10 sm:px-8 sm:pt-16">
        {/* Hero */}
        <section className="grid items-center gap-10 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#dce6d8] bg-[#fdfcf9] px-3.5 py-2 text-xs font-semibold text-[#41674b]">
              <Sparkles size={14} />
              YOUR NEXT ADVENTURE STARTS HERE
            </div>

            <h1 className="max-w-2xl text-4xl font-semibold leading-[1.12] tracking-[-0.045em] sm:text-6xl">
              Less planning.
              <br />
              <span className="font-serif font-normal italic text-[#729467]">
                More wandering.
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-[#68766d] sm:text-lg">
              Tell us what you love, where you want to go, and your budget.
              We'll help turn it into a trip worth remembering.
            </p>

            <div className="mt-7 flex flex-wrap gap-5 text-sm text-[#637168]">
              <span className="flex items-center gap-2">
                <Check size={16} className="text-[#6c9263]" />
                Personalized itineraries
              </span>
              <span className="flex items-center gap-2">
                <Check size={16} className="text-[#6c9263]" />
                Budget-aware planning
              </span>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=90"
              alt="A beautiful alpine lake surrounded by mountains"
              fetchPriority="high"
              className="h-[300px] w-full rounded-[28px] object-cover sm:h-[410px]"
            />

            <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/60 bg-[#fdfcf9]/95 p-4 shadow-lg backdrop-blur sm:inset-x-5 sm:bottom-5 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-[#718077]">
                    YOUR NEXT CHAPTER
                  </p>
                  <p className="mt-1 text-lg font-semibold">
                    Somewhere beautiful.
                  </p>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e9f0e4] text-[#41674b]">
                  <Plane size={21} />
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Planner */}
        <section
          id="planner"
          className="mt-16 grid scroll-mt-24 gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start"
        >
          <div className="rounded-3xl border border-[#e2e1d9] bg-[#fdfcf9] p-5 shadow-[0_12px_50px_rgba(28,55,39,0.04)] sm:p-8">
            <div className="mb-8">
              <p className="text-[11px] font-bold tracking-[0.18em] text-[#82917e]">
                LET'S DESIGN YOUR GETAWAY
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                Plan your trip
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#778179]">
                A few details are all we need to get started.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-7">
              {/* Destination */}
              <div>
                <label
                  htmlFor="destination"
                  className="mb-2.5 block text-sm font-semibold"
                >
                  Where do you want to go?
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-[#e2e1d9] bg-[#f8f7f3] px-4 transition focus-within:border-[#7b9d71] focus-within:ring-4 focus-within:ring-[#eaf0e5]">
                  <MapPin size={19} className="shrink-0 text-[#79966f]" />
                  <input
                    id="destination"
                    required
                    maxLength={120}
                    value={destination}
                    onChange={(event) => {
                      setDestination(event.target.value);
                      setError("");
                    }}
                    placeholder="Try Goa, Bali or the Swiss Alps..."
                    className="min-w-0 flex-1 bg-transparent py-4 text-sm outline-none placeholder:text-[#a1aaa1]"
                  />
                </div>
              </div>

              {/* Duration and travelers */}
              <div className="grid gap-5 sm:grid-cols-2">
                <Counter
                  label="Trip duration"
                  value={days}
                  min={1}
                  max={30}
                  onChange={setDays}
                  icon={CalendarDays}
                />

                <Counter
                  label="Travelers"
                  value={travelers}
                  min={1}
                  max={20}
                  onChange={setTravelers}
                  icon={Users}
                />
              </div>

              {/* Budget */}
              <div>
                <label
                  htmlFor="budget"
                  className="mb-2.5 block text-sm font-semibold"
                >
                  <Wallet size={16} className="mr-2 inline text-[#79966f]" />
                  Total trip budget
                </label>

                <div className="flex items-center rounded-xl border border-[#e2e1d9] bg-[#f8f7f3] px-4 transition focus-within:border-[#7b9d71]">
                  <span className="mr-3 text-[#809080]">₹</span>
                  <input
                    id="budget"
                    type="number"
                    min="1"
                    max="100000000"
                    required
                    value={budget}
                    onChange={(event) => {
                      setBudget(event.target.value);
                      setError("");
                    }}
                    className="w-full bg-transparent py-4 text-sm font-semibold outline-none"
                  />
                  <span className="whitespace-nowrap text-xs text-[#89938a]">
                    INR · Total
                  </span>
                </div>

                <p className="mt-2 text-xs text-[#849087]">
                  {Number(budget) > 0
                    ? `${money(Number(budget) / travelers)} per traveler, approximately`
                    : "Enter your total trip budget"}
                </p>
              </div>

              {/* Interests */}
              <fieldset>
                <legend className="mb-3 text-sm font-semibold">
                  What are you interested in?
                </legend>

                <div className="flex flex-wrap gap-2.5">
                  {interestsList.map(({ name, icon: Icon }) => {
                    const selected = interests.includes(name);

                    return (
                      <button
                        key={name}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => toggleInterest(name)}
                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition ${
                          selected
                            ? "border-[#315c43] bg-[#eaf0e5] text-[#214b3a]"
                            : "border-[#e2e1d9] bg-[#f8f7f3] text-[#69766d] hover:border-[#a9bca0]"
                        }`}
                      >
                        <Icon size={16} />
                        {name}
                        {selected && <Check size={14} />}
                      </button>
                    );
                  })}
                </div>

                <p className="mt-2 text-xs text-[#879087]">
                  Choose all experiences you enjoy.
                </p>
              </fieldset>

              {/* Travel style */}
              <div>
                <label
                  htmlFor="travelType"
                  className="mb-2.5 block text-sm font-semibold"
                >
                  Who are you traveling with?
                </label>

                <div className="relative">
                  <select
                    id="travelType"
                    value={travelType}
                    onChange={(event) => setTravelType(event.target.value)}
                    className="w-full appearance-none rounded-xl border border-[#e2e1d9] bg-[#f8f7f3] px-4 py-4 text-sm outline-none transition focus:border-[#7b9d71]"
                  >
                    <option value="Solo">Solo</option>
                    <option value="Couple">Couple</option>
                    <option value="Friends">Friends</option>
                    <option value="Family">Family</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#718077]"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  role="alert"
                  className="flex gap-3 rounded-xl border border-[#e7c8bd] bg-[#fbefeb] p-4 text-sm leading-6 text-[#8c4030]"
                >
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#214b3a] px-5 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#17392b] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <LoaderCircle size={18} className="animate-spin" />
                    Creating your itinerary...
                  </>
                ) : (
                  <>
                    <Sparkles size={17} />
                    Generate my itinerary
                    <ArrowRight size={17} />
                  </>
                )}
              </button>

              {loading && (
                <div
                  role="status"
                  aria-live="polite"
                  className="rounded-xl bg-[#edf1e8] p-4 text-center"
                >
                  <p className="text-sm font-semibold text-[#315c43]">
                    Your trip is being planned
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[#718077]">
                    We're organizing your activities, destination and budget.
                    This can take a little while.
                  </p>
                </div>
              )}

              <p className="text-center text-xs text-[#929a91]">
                Your journey starts with a few simple details.
              </p>
            </form>
          </div>

          {/* Destination suggestions */}
          <aside id="destinations" className="space-y-4">
            <div>
              <p className="text-[11px] font-bold tracking-[0.18em] text-[#82917e]">
                NEED INSPIRATION?
              </p>
              <h3 className="mt-2 text-xl font-semibold">
                Popular escapes
              </h3>
              <p className="mt-1 text-sm text-[#7b857d]">
                Pick a place to start dreaming.
              </p>
            </div>

            {destinations.map((place) => (
              <button
                key={place.name}
                type="button"
                disabled={loading}
                onClick={() => selectDestination(place.name)}
                className="group flex w-full items-center gap-4 rounded-2xl border border-[#e2e1d9] bg-[#fdfcf9] p-3 text-left transition hover:-translate-y-0.5 hover:border-[#c6d2bf] hover:shadow-md disabled:opacity-60"
              >
                <img
                  src={place.image}
                  alt={place.name}
                  loading="lazy"
                  className="h-[76px] w-[88px] shrink-0 rounded-xl object-cover"
                />

                <span className="min-w-0 flex-1">
                  <span className="block text-xs text-[#89958a]">
                    {place.label}
                  </span>
                  <span className="mt-1 block font-semibold">
                    {place.name}
                  </span>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#567b4d]">
                    Use destination <ArrowRight size={12} />
                  </span>
                </span>
              </button>
            ))}

            <div className="rounded-2xl border border-[#e1e4d9] bg-[#ecefe6] p-5">
              <Lightbulb size={20} className="text-[#54764a]" />
              <p className="mt-3 font-semibold">Travel your way.</p>
              <p className="mt-1 text-sm leading-6 text-[#657765]">
                Start with your budget, interests and travel style. Your
                personalized itinerary is just a click away.
              </p>
            </div>

            <div className="flex items-center gap-3 px-1 pt-2 text-xs text-[#879087]">
              <Clock3 size={15} />
              <span>Plan a weekend or a longer escape</span>
            </div>
          </aside>
        </section>
      </main>

      <footer className="border-t border-[#e2e1d9] px-5 py-6 text-center text-xs text-[#879087]">
        Made for the journey, not just the destination. © Roamwise
      </footer>
    </div>
  );
}
