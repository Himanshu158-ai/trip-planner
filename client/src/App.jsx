
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Compass,
  MapPin,
  Minus,
  Plus,
  Sparkles,
  Users,
  Wallet,
  Mountain,
  Waves,
  Camera,
  Utensils,
  Landmark,
  TreePalm,
  Plane,
  RefreshCw,
  AlertCircle,
  LoaderCircle,
  Lightbulb,
} from "lucide-react";
import { generateTrip } from "./service/tripApi.js";

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
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=700&q=80",
    label: "Tropical escape",
  },
  {
    name: "Swiss Alps",
    image:
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=700&q=80",
    label: "Mountain retreat",
  },
  {
    name: "Goa, India",
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=700&q=80",
    label: "Beach getaway",
  },
];

const money = (amount, currency = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

function Counter({ value, onChange, min, max }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#e2e1d9] bg-[#f8f7f3] px-4 py-3">
      <span className="text-sm text-[#7b857d]">
        {value} {value === 1 ? "person/day" : "people/days"}
      </span>
      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Decrease"
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="rounded-full border border-[#deded5] p-2 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-35"
        >
          <Minus size={14} />
        </button>
        <span className="w-5 text-center text-sm font-semibold">{value}</span>
        <button
          type="button"
          aria-label="Increase"
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="rounded-full border border-[#deded5] p-2 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-35"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}

function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div className="mb-7">
      <p className="text-[11px] font-bold tracking-[0.18em] text-[#82917e]">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-sm leading-6 text-[#778179]">{subtitle}</p>
      )}
    </div>
  );
}

function BudgetOverview({ budget }) {
  const breakdown = budget?.breakdown || {};
  const currency = budget?.currency || "INR";

  const categories = [
    { key: "accommodation", label: "Accommodation" },
    { key: "food", label: "Food" },
    { key: "transport", label: "Transport" },
    { key: "activities", label: "Activities" },
    { key: "miscellaneous", label: "Miscellaneous" },
  ];

  const total = Number(budget?.total) || 0;

  return (
    <section className="rounded-2xl border border-[#e4e3da] bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-[#78847b]">Estimated total budget</p>
          <h3 className="mt-2 text-3xl font-semibold tracking-tight">
            {money(total, currency)}
          </h3>
        </div>
        <span className="rounded-xl bg-[#eaf0e5] p-3 text-[#41674b]">
          <Wallet size={22} />
        </span>
      </div>

      <div className="my-5 h-2 overflow-hidden rounded-full bg-[#eeeee7]">
        <div className="flex h-full w-full">
          {categories.map(({ key }, index) => {
            const value = Math.max(0, Number(breakdown[key]) || 0);
            const widths = total > 0 ? (value / total) * 100 : 0;
            const colors = [
              "#315c43",
              "#66865a",
              "#9aae8a",
              "#c0cfb4",
              "#d9dfd1",
            ];

            return (
              <div
                key={key}
                title={key}
                style={{
                  width: `${widths}%`,
                  backgroundColor: colors[index],
                }}
              />
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        {categories.map(({ key, label }, index) => {
          const value = Number(breakdown[key]) || 0;
          const colors = [
            "#315c43",
            "#66865a",
            "#9aae8a",
            "#c0cfb4",
            "#d9dfd1",
          ];

          return (
            <div key={key} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: colors[index] }}
                />
                <span className="text-sm text-[#68766d]">{label}</span>
              </div>
              <span className="text-sm font-semibold">
                {money(value, currency)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-5 border-t border-[#eeeee7] pt-4 text-xs leading-5 text-[#879087]">
        These are estimated costs. Confirm current prices before booking.
      </div>
    </section>
  );
}

function ActivityCard({ activity, index }) {
  return (
    <div className="relative pb-6 last:pb-0">
      {index !== undefined && (
        <div className="absolute bottom-0 left-[5px] top-5 w-px bg-[#e4e8de]" />
      )}

      <div className="relative flex gap-4">
        <span className="mt-1 h-[11px] w-[11px] shrink-0 rounded-full border-2 border-[#62815a] bg-[#f5f4f0]" />

        <div className="min-w-0 flex-1 rounded-xl border border-[#e9e8e0] bg-[#fdfcf9] p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-[#54764a]">
              <Clock3 size={13} />
              {activity.time || "Time not specified"}
            </span>
            <span className="text-xs font-medium text-[#68766d]">
              {activity.estimatedDuration || "Duration not specified"}
            </span>
          </div>

          <h4 className="mt-2 font-semibold leading-6">
            {activity.place || "Activity"}
          </h4>
          <p className="mt-1 text-sm leading-6 text-[#718077]">
            {activity.activity || "Explore this destination."}
          </p>

          <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#315c43]">
            <Wallet size={13} />
            Estimated cost: {money(activity.estimatedCost)}
          </div>
        </div>
      </div>
    </div>
  );
}

function TripResults({ trip, onBack, onReset }) {
  const [activeDay, setActiveDay] = useState(1);
  const itinerary = Array.isArray(trip.itinerary) ? trip.itinerary : [];
  const selectedDay =
    itinerary.find((item) => item.day === activeDay) || itinerary[0];
  const currency = trip.budget?.currency || "INR";

  return (
    <main className="mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-8">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-sm font-semibold text-[#607267] hover:text-[#214b3a]"
      >
        <ArrowLeft size={16} /> Back to planner
      </button>

      <section className="overflow-hidden rounded-3xl bg-[#214b3a] p-6 text-white sm:p-10">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1.5 text-xs font-medium text-[#e2eadc]">
              <Sparkles size={14} /> YOUR PERSONALIZED ITINERARY
            </span>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-5xl">
              {trip.destination}
            </h1>
            <p className="mt-3 text-sm text-[#d5e0d4] sm:text-base">
              A thoughtfully planned journey, made around your travel style.
            </p>
          </div>

          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-2 rounded-xl border border-white/25 px-4 py-3 text-sm font-semibold transition hover:bg-white/10"
          >
            <RefreshCw size={15} /> New trip
          </button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              icon: CalendarDays,
              label: "Duration",
              value: `${trip.duration ?? itinerary.length} days`,
            },
            { icon: Users, label: "Travelers", value: trip.travelers ?? "—" },
            { icon: Compass, label: "Travel style", value: trip.travelType || "—" },
            {
              icon: Wallet,
              label: "Total budget",
              value: money(trip.budget?.total, currency),
            },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="rounded-2xl border border-white/15 bg-white/[0.07] p-4"
            >
              <Icon size={18} className="text-[#c6d9bb]" />
              <p className="mt-4 text-xs text-[#d5e0d4]">{label}</p>
              <p className="mt-1 break-words text-lg font-semibold">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="min-w-0">
          <SectionHeading
            eyebrow="YOUR JOURNEY"
            title="Day-by-day itinerary"
            subtitle="Choose a day to explore its activities and estimated costs."
          />

          {itinerary.length > 0 ? (
            <>
              <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
                {itinerary.map((day) => (
                  <button
                    key={day.day}
                    type="button"
                    onClick={() => setActiveDay(day.day)}
                    className={`min-w-[82px] rounded-xl border px-4 py-3 text-left transition ${
                      (selectedDay?.day ?? activeDay) === day.day
                        ? "border-[#315c43] bg-[#eaf0e5] text-[#214b3a]"
                        : "border-[#e3e3da] bg-white text-[#718077] hover:border-[#b8c9af]"
                    }`}
                  >
                    <span className="block text-[11px]">DAY</span>
                    <span className="mt-1 block text-lg font-semibold">
                      {day.day}
                    </span>
                  </button>
                ))}
              </div>

              {selectedDay && (
                <div className="rounded-2xl border border-[#e4e3da] bg-white p-5 sm:p-7">
                  <p className="text-xs font-bold tracking-[0.12em] text-[#79966f]">
                    DAY {selectedDay.day}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold sm:text-2xl">
                    {selectedDay.title || "Explore your destination"}
                  </h3>

                  <div className="mt-6">
                    {(selectedDay.activities || []).length > 0 ? (
                      selectedDay.activities.map((activity, index) => (
                        <ActivityCard
                          key={`${selectedDay.day}-${index}`}
                          activity={activity}
                          index={index}
                        />
                      ))
                    ) : (
                      <p className="text-sm text-[#718077]">
                        No activities available for this day.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-2xl border border-[#e4e3da] bg-white p-6 text-sm text-[#718077]">
              No itinerary days were returned by the server.
            </div>
          )}

          <section className="mt-8">
            <SectionHeading
              eyebrow="TRAVEL SMART"
              title="Helpful travel tips"
            />
            <div className="space-y-3">
              {(trip.travelTips || []).map((tip, index) => (
                <div
                  key={index}
                  className="flex gap-3 rounded-xl border border-[#e4e3da] bg-white p-4"
                >
                  <Lightbulb
                    size={18}
                    className="mt-0.5 shrink-0 text-[#6b895d]"
                  />
                  <p className="text-sm leading-6 text-[#68766d]">{tip}</p>
                </div>
              ))}
              {!trip.travelTips?.length && (
                <p className="text-sm text-[#718077]">
                  No additional travel tips were provided.
                </p>
              )}
            </div>
          </section>
        </section>

        <aside className="space-y-6 lg:sticky lg:top-24">
          <BudgetOverview budget={trip.budget} />

          <div className="rounded-2xl border border-[#e4e3da] bg-white p-5">
            <h3 className="font-semibold">Before you go</h3>
            <p className="mt-2 text-sm leading-6 text-[#718077]">
              Check opening hours, local transport, activity availability and
              the latest prices before finalizing your plans.
            </p>
            <button
              type="button"
              onClick={onReset}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#214b3a] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#17392b]"
            >
              Plan another trip <ArrowRight size={16} />
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default function App() {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(5);
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState(25000);
  const [interests, setInterests] = useState(["Nature", "Food"]);
  const [travelType, setTravelType] = useState("Couple");

  const [trip, setTrip] = useState(null);
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
      setError("Please enter a destination.");
      return;
    }

    if (!Number.isFinite(days) || days < 1 || days > 30) {
      setError("Choose a trip duration between 1 and 30 days.");
      return;
    }

    if (!Number.isFinite(travelers) || travelers < 1 || travelers > 20) {
      setError("Choose between 1 and 20 travelers.");
      return;
    }

    if (!Number.isFinite(budget) || budget <= 0) {
      setError("Please enter a valid budget greater than zero.");
      return;
    }

    if (interests.length === 0) {
      setError("Select at least one interest.");
      return;
    }

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
      setTrip(result);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const status = err.response?.status;

      if (status === 400) {
        setError(
          err.response?.data?.message ||
            "Please check your trip details and try again."
        );
      } else if (err.code === "ECONNABORTED") {
        setError("Trip generation took too long. Please try again.");
      } else if (!err.response) {
        setError(
          "Could not connect to the server. Check your backend URL and make sure the server is running."
        );
      } else {
        setError(
          err.response?.data?.message ||
            "Something went wrong while generating your trip."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  function resetTrip() {
    setTrip(null);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-[#f5f4f0] text-[#18352b]">
      <header className="sticky top-0 z-20 border-b border-[#e2e1d9] bg-[#f5f4f0]/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <button
            type="button"
            onClick={resetTrip}
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

          <div className="hidden items-center gap-7 text-sm font-medium text-[#627067] md:flex">
            <button onClick={resetTrip} className="hover:text-[#214b3a]">
              Plan a trip
            </button>
            <a href="#destinations" className="hover:text-[#214b3a]">
              Explore
            </a>
            <span className="rounded-full border border-[#dfe5dc] px-4 py-2 text-[#214b3a]">
              <Sparkles size={13} className="mr-1 inline" />
              AI travel planner
            </span>
          </div>

          <button
            type="button"
            onClick={resetTrip}
            className="rounded-full bg-[#214b3a] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#17392b]"
          >
            {trip ? "New trip" : "Start planning"}
          </button>
        </nav>
      </header>

      {trip ? (
        <TripResults trip={trip} onBack={resetTrip} onReset={resetTrip} />
      ) : (
        <main className="mx-auto max-w-7xl px-5 pb-16 pt-10 sm:px-8 sm:pt-16">
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
                alt="A beautiful lake surrounded by mountains"
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

          <section
            id="planner"
            className="mt-16 grid scroll-mt-24 gap-8 lg:grid-cols-[1fr_300px] lg:items-start"
          >
            <div className="rounded-3xl border border-[#e2e1d9] bg-[#fdfcf9] p-5 shadow-[0_12px_50px_rgba(28,55,39,0.04)] sm:p-8">
              <SectionHeading
                eyebrow="LET'S DESIGN YOUR GETAWAY"
                title="Plan your trip"
                subtitle="A few details are all we need to get started."
              />

              <form onSubmit={handleSubmit} className="space-y-7">
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

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2.5 flex items-center gap-2 text-sm font-semibold">
                      <CalendarDays size={16} className="text-[#79966f]" />
                      Trip duration
                    </label>
                    <Counter
                      value={days}
                      min={1}
                      max={30}
                      onChange={setDays}
                    />
                    <p className="mt-1.5 text-xs text-[#879087]">
                      Up to 30 days
                    </p>
                  </div>
                  <div>
                    <label className="mb-2.5 flex items-center gap-2 text-sm font-semibold">
                      <Users size={16} className="text-[#79966f]" />
                      Travelers
                    </label>
                    <Counter
                      value={travelers}
                      min={1}
                      max={20}
                      onChange={setTravelers}
                    />
                    <p className="mt-1.5 text-xs text-[#879087]">
                      Up to 20 people
                    </p>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="budget"
                    className="mb-2.5 block text-sm font-semibold"
                  >
                    <Wallet size={16} className="mr-2 inline text-[#79966f]" />
                    Total trip budget
                  </label>
                  <div className="flex items-center rounded-xl border border-[#e2e1d9] bg-[#f8f7f3] px-4 focus-within:border-[#7b9d71]">
                    <span className="mr-3 text-[#809080]">₹</span>
                    <input
                      id="budget"
                      type="number"
                      min="1"
                      max="100000000"
                      required
                      value={budget}
                      onChange={(event) =>
                        setBudget(
                          event.target.value === ""
                            ? ""
                            : Number(event.target.value)
                        )
                      }
                      className="w-full bg-transparent py-4 text-sm font-semibold outline-none"
                    />
                    <span className="whitespace-nowrap text-xs text-[#89938a]">
                      INR · Total
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-[#849087]">
                    {budget > 0 && travelers > 0
                      ? `${money(Math.round(budget / travelers))} per traveler, approximately`
                      : "Enter your total trip budget"}
                  </p>
                </div>

                <div>
                  <p className="mb-3 text-sm font-semibold">
                    What are you interested in?
                  </p>
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
                    Select all the experiences you enjoy.
                  </p>
                </div>

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
                      className="w-full appearance-none rounded-xl border border-[#e2e1d9] bg-[#f8f7f3] px-4 py-4 text-sm outline-none focus:border-[#7b9d71]"
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

                {error && (
                  <div
                    role="alert"
                    className="flex gap-3 rounded-xl border border-[#e7c8bd] bg-[#fbefeb] p-4 text-sm leading-6 text-[#8c4030]"
                  >
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#214b3a] px-5 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#17392b] disabled:cursor-not-allowed disabled:opacity-70"
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
                      We're organizing your destination, activities and budget.
                      This can take a little while.
                    </p>
                  </div>
                )}

                <p className="text-center text-xs text-[#929a91]">
                  Estimates may vary by season, availability and actual prices.
                </p>
              </form>
            </div>

            <aside id="destinations" className="space-y-4">
              <div>
                <p className="text-xs font-bold tracking-[0.16em] text-[#82917e]">
                  NEED INSPIRATION?
                </p>
                <h3 className="mt-2 text-xl font-semibold">Popular escapes</h3>
                <p className="mt-1 text-sm text-[#7b857d]">
                  Choose a place to get started.
                </p>
              </div>

              {destinations.map((place) => (
                <button
                  key={place.name}
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    setDestination(place.name);
                    setError("");
                    document.getElementById("planner")?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                  className="group flex w-full items-center gap-4 rounded-2xl border border-[#e2e1d9] bg-[#fdfcf9] p-3 text-left transition hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60"
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
                <Sparkles size={20} className="text-[#54764a]" />
                <p className="mt-3 font-semibold">Your trip, your way.</p>
                <p className="mt-1 text-sm leading-6 text-[#657765]">
                  Get a personalized starting point based on your budget,
                  travel style and interests.
                </p>
              </div>
            </aside>
          </section>
        </main>
      )}

      <footer className="border-t border-[#e2e1d9] px-5 py-6 text-center text-xs text-[#879087]">
        Made for the journey, not just the destination. © Roamwise
      </footer>
    </div>
  );
}
