import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { generateTrip } from "../service/tripApi";
import Navbar from "../components/Navbar";
import { DESTINATIONS, HERO_IMAGE } from "../data/destinations";
import { scrollToId } from "../utils/scroll";
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  Camera,
  Check,
  ChevronDown,
  Compass,
  Landmark,
  ListChecks,
  LoaderCircle,
  MapPin,
  Minus,
  Mountain,
  Plus,
  Sparkles,
  TreePalm,
  Users,
  Utensils,
  Wallet,
  Waves,
} from "lucide-react";

const interestsList = [
  { name: "Adventure", icon: Mountain },
  { name: "Beaches", icon: Waves },
  { name: "Photography", icon: Camera },
  { name: "Food", icon: Utensils },
  { name: "Culture", icon: Landmark },
  { name: "Nature", icon: TreePalm },
];

const steps = [
  {
    num: "01",
    title: "Define The Coordinates",
    text: "Articulate your destination, travel party, and ideal financial parameters.",
  },
  {
    num: "02",
    title: "Intelligent Synthesis",
    text: "Proprietary curation algorithms structure a balanced, day-by-day expedition.",
  },
  {
    num: "03",
    title: "Bespoke Exploration",
    text: "Review curated timings, vetted venues, and estimated costs with effortless clarity.",
  },
];

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

function Counter({ label, unit, value, onChange, min, max, icon: Icon }) {
  return (
    <div role="group" aria-label={label}>
      <span className="mb-2.5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
        <Icon size={14} className="text-neutral-400" /> {label}
      </span>
      <div className="flex h-[52px] items-center justify-between border border-neutral-200 bg-[#FAF9F6] px-4 transition focus-within:border-neutral-900">
        <span className="text-[14px] font-medium text-neutral-900" aria-live="polite">
          {value} {unit}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label={`Decrease ${label}`}
            disabled={value <= min}
            onClick={() => onChange(Math.max(min, value - 1))}
            className="flex h-8 w-8 items-center justify-center border border-neutral-300 bg-white text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900 disabled:opacity-30 disabled:hover:border-neutral-300"
          >
            <Minus size={13} />
          </button>
          <button
            type="button"
            aria-label={`Increase ${label}`}
            disabled={value >= max}
            onClick={() => onChange(Math.max(max, value + 1))}
            className="flex h-8 w-8 items-center justify-center border border-neutral-300 bg-white text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900 disabled:opacity-30 disabled:hover:border-neutral-300"
          >
            <Plus size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionHeading({
  overline,
  titlePrimary,
  titleAccent,
  text,
  className = "",
  align = "left",
}) {
  return (
    <div
      className={`${className} ${
        align === "center" ? "text-center mx-auto" : ""
      }`}
    >
      {overline && (
        <div
          className={`flex items-center gap-3 mb-4 ${
            align === "center" ? "justify-center" : ""
          }`}
        >
          <span className="w-8 h-px bg-neutral-400" />
          <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-neutral-500">
            {overline}
          </span>
        </div>
      )}
      <h2 className="font-editorial-serif tracking-[-0.02em] leading-[1.04] text-[34px] sm:text-[46px] lg:text-[54px] text-neutral-900 font-normal">
        <span>{titlePrimary}</span>{" "}
        {titleAccent && (
          <span className="italic text-[#C5A059] font-normal font-editorial-serif">
            {titleAccent}
          </span>
        )}
      </h2>
      {text && (
        <p
          className={`mt-4 text-[15px] sm:text-base leading-[1.7] text-neutral-600 font-normal ${
            align === "center" ? "mx-auto max-w-xl" : "max-w-xl"
          }`}
        >
          {text}
        </p>
      )}
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { hash } = useLocation();

  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(5);
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState("25000");
  const [interests, setInterests] = useState(["Nature", "Food"]);
  const [travelType, setTravelType] = useState("Couple");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!hash) return;
    const t = setTimeout(() => scrollToId(hash.slice(1)), 50);
    return () => clearTimeout(t);
  }, [hash]);

  function toggleInterest(name) {
    setInterests((c) =>
      c.includes(name) ? c.filter((i) => i !== name) : [...c, name]
    );
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (loading) return;
    setError("");

    if (!destination.trim()) return setError("Please enter your destination.");
    if (!interests.length)
      return setError("Please select at least one interest.");
    const numericBudget = Number(budget);
    if (!Number.isFinite(numericBudget) || numericBudget <= 0)
      return setError("Please enter a valid budget greater than zero.");

    setLoading(true);
    try {
      const result = await generateTrip({
        destination: destination.trim(),
        days,
        travelers,
        budget: numericBudget,
        interests,
        travelType,
      });
      sessionStorage.setItem("generatedTrip", JSON.stringify(result));
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
    scrollToId("planner");
  }

  return (
    <div id="top" className="relative min-h-screen bg-[#FAF9F6] text-[#1A1A1A]">
      {/* Architectural vertical guide lines */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 mx-auto max-w-7xl px-6 sm:px-12"
      >
        <div className="grid h-full w-full grid-cols-4 sm:grid-cols-6 lg:grid-cols-12">
          <div className="border-r border-neutral-900/[0.035] h-full" />
          <div className="border-r border-neutral-900/[0.035] h-full hidden sm:block" />
          <div className="border-r border-neutral-900/[0.035] h-full" />
          <div className="border-r border-neutral-900/[0.035] h-full hidden lg:block" />
          <div className="border-r border-neutral-900/[0.035] h-full hidden sm:block" />
          <div className="border-r border-neutral-900/[0.035] h-full" />
          <div className="border-r border-neutral-900/[0.035] h-full hidden lg:block" />
          <div className="border-r border-neutral-900/[0.035] h-full" />
          <div className="border-r border-neutral-900/[0.035] h-full hidden sm:block" />
          <div className="border-r border-neutral-900/[0.035] h-full hidden lg:block" />
          <div className="border-r border-neutral-900/[0.035] h-full" />
        </div>
      </div>

      <Navbar />

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-24 pb-16 sm:px-12 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Exact Typography Aesthetic */}
          <div className="lg:col-span-7">
            {/* Overline with fine rule line */}
            <div className="mb-6 flex items-center gap-3 sm:mb-8">
              <span className="h-px w-8 bg-neutral-400 sm:w-12" />
              <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-neutral-500 sm:text-[12px]">
                EDITORIAL / REFERENCE GUIDE
              </span>
            </div>

            {/* Exact Serif Headline */}
            <h1 className="font-editorial-serif tracking-[-0.02em] leading-[0.93]">
              <span className="block text-[62px] font-normal text-neutral-900 sm:text-[88px] lg:text-[104px]">
                Curated
              </span>
              <span className="mt-1 block font-editorial-serif text-[62px] font-normal italic text-[#C5A059] sm:mt-2 sm:text-[88px] lg:text-[104px]">
                Excellence
              </span>
            </h1>

            {/* Editorial Body Text */}
            <p className="mt-8 max-w-lg text-[15px] font-normal leading-[1.75] text-neutral-600 sm:mt-10 sm:text-[17px]">
              Luxury isn't about adding decoration—it's about removing
              everything unnecessary and perfecting what remains. Every element
              must feel intentional and considered.
            </p>

            {/* Architectural Actions */}
            <div className="mt-10 flex flex-wrap items-center gap-4 sm:mt-12">
              <a
                href="#planner"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId("planner");
                }}
                className="group inline-flex items-center justify-center gap-3 border border-neutral-900 bg-neutral-900 px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.22em] text-white transition-all hover:bg-neutral-800"
              >
                Plan My Journey
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>

              <a
                href="#destinations"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId("destinations");
                }}
                className="inline-flex items-center justify-center border border-neutral-300 bg-transparent px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-800 transition-colors hover:border-neutral-900 hover:text-neutral-950"
              >
                View Sanctuaries
              </a>
            </div>
          </div>

          {/* Right Column: Framed Editorial Photography */}
          <div className="lg:col-span-5">
            <div className="relative flex flex-col items-start lg:items-end">
              <div className="relative aspect-[4/5] w-full max-w-[480px] overflow-hidden border border-neutral-200/80 bg-neutral-200 shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
                <img
                  src={HERO_IMAGE}
                  alt="Curated travel retreat architecture"
                  fetchPriority="high"
                  className="h-full w-full object-cover object-center grayscale contrast-[1.08] transition-all duration-700 hover:grayscale-0"
                />
              </div>
              <div className="mt-4 flex w-full max-w-[480px] items-center gap-2.5 text-left">
                <span className="h-px w-5 shrink-0 bg-neutral-400" />
                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500 sm:text-[11px]">
                  EXQUISITE RESTRAINT IN MODERN LIVING SPACES.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Planner Section */}
      <section
        id="planner"
        className="relative z-10 scroll-mt-24 border-t border-neutral-200/60 px-6 py-20 sm:px-12 sm:py-28"
      >
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            overline="BESPOKE ENGINE / PARAMETERS"
            titlePrimary="Intelligent"
            titleAccent="Curation."
            text="Articulate your destination, duration, and financial boundaries. Our intelligence arranges a seamless day-by-day expedition."
            align="center"
            className="mb-14"
          />

          <form
            onSubmit={handleSubmit}
            noValidate
            className="border border-neutral-200/90 bg-white p-6 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.04)] sm:p-12"
          >
            <div className="grid gap-7 md:grid-cols-2">
              <div className="md:col-span-2">
                <label
                  htmlFor="destination"
                  className="mb-2.5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500"
                >
                  <MapPin size={14} className="text-neutral-400" /> Target
                  Destination
                </label>
                <input
                  id="destination"
                  maxLength={120}
                  value={destination}
                  disabled={loading}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    setError("");
                  }}
                  placeholder="e.g. Kyoto, Amalfi Coast, Swiss Alps"
                  className="h-[52px] w-full border border-neutral-200 bg-[#FAF9F6] px-4 text-[14px] text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white"
                />
              </div>

              <Counter
                label="Duration of stay"
                unit={days === 1 ? "day" : "days"}
                value={days}
                min={1}
                max={30}
                onChange={setDays}
                icon={CalendarDays}
              />

              <Counter
                label="Party size"
                unit={travelers === 1 ? "traveler" : "travelers"}
                value={travelers}
                min={1}
                max={20}
                onChange={setTravelers}
                icon={Users}
              />

              <div>
                <label
                  htmlFor="budget"
                  className="mb-2.5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500"
                >
                  <Wallet size={14} className="text-neutral-400" /> Total Budget
                  (INR)
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400">
                    ₹
                  </span>
                  <input
                    id="budget"
                    type="number"
                    inputMode="numeric"
                    min="1"
                    max="100000000"
                    value={budget}
                    disabled={loading}
                    onChange={(e) => {
                      setBudget(e.target.value);
                      setError("");
                    }}
                    className="h-[52px] w-full border border-neutral-200 bg-[#FAF9F6] pl-8 pr-4 text-[14px] font-medium text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white"
                  />
                </div>
                <p className="mt-2 text-[11px] tracking-wide text-neutral-400">
                  {Number(budget) > 0
                    ? `Estimated ${money(
                        Number(budget) / travelers
                      )} per traveler`
                    : "Enter total expedition allocation"}
                </p>
              </div>

              <div>
                <label
                  htmlFor="travelType"
                  className="mb-2.5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500"
                >
                  <Compass size={14} className="text-neutral-400" /> Travel Dynamic
                </label>
                <div className="relative">
                  <select
                    id="travelType"
                    value={travelType}
                    disabled={loading}
                    onChange={(e) => setTravelType(e.target.value)}
                    className="h-[52px] w-full appearance-none border border-neutral-200 bg-[#FAF9F6] px-4 pr-10 text-[14px] text-neutral-900 outline-none transition focus:border-neutral-900 focus:bg-white"
                  >
                    <option>Solo Expedition</option>
                    <option>Couple</option>
                    <option>Intimate Friends</option>
                    <option>Family</option>
                  </select>
                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400"
                  />
                </div>
              </div>
            </div>

            <fieldset className="mt-8 border-t border-neutral-200/60 pt-7">
              <legend className="mb-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                Interests & Focus
              </legend>
              <div className="flex flex-wrap gap-2.5">
                {interestsList.map(({ name, icon: Icon }) => {
                  const on = interests.includes(name);
                  return (
                    <button
                      key={name}
                      type="button"
                      aria-pressed={on}
                      disabled={loading}
                      onClick={() => toggleInterest(name)}
                      className={`inline-flex h-10 items-center gap-2.5 border px-4 text-[11px] font-medium tracking-[0.14em] uppercase transition ${
                        on
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 bg-[#FAF9F6] text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
                      }`}
                    >
                      <Icon size={14} className={on ? "text-[#C5A059]" : ""} />
                      {name}
                      {on && <Check size={12} className="text-[#C5A059]" />}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {error && (
              <div
                role="alert"
                className="mt-6 flex items-center gap-3 border border-red-200 bg-red-50/50 p-4 text-[13px] text-red-800"
              >
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                className="group inline-flex items-center justify-center gap-3 border border-neutral-900 bg-neutral-900 px-8 py-4 text-[11px] font-medium uppercase tracking-[0.22em] text-white transition hover:bg-neutral-800 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span>Orchestrating Dossier…</span>
                    <LoaderCircle size={14} className="animate-spin" />
                  </>
                ) : (
                  <>
                    <span>Generate Itinerary — v1.0</span>
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>

              {loading && (
                <p
                  role="status"
                  aria-live="polite"
                  className="text-[12px] font-normal text-neutral-500"
                >
                  Synthesizing venues, routes, and timing with restraint.
                </p>
              )}
            </div>
          </form>
        </div>
      </section>

      {/* Destinations Section */}
      <section
        id="destinations"
        className="relative z-10 scroll-mt-24 border-t border-neutral-200/60 px-6 py-20 sm:px-12 sm:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            overline="CURATED ARCHIVE / GLOBAL RETREATS"
            titlePrimary="Enduring"
            titleAccent="Sanctuaries."
            text="Quiet coastal promontories and high alpine preserves where landscape and architecture exist in pure harmony."
            className="mb-14"
          />

          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {DESTINATIONS.map((d, index) => (
              <li key={d.name}>
                <button
                  type="button"
                  onClick={() => selectDestination(d.name)}
                  className="group relative block aspect-[4/5] w-full overflow-hidden border border-neutral-200/80 bg-neutral-100 text-left transition focus-visible:outline-none"
                >
                  <img
                    src={d.image}
                    alt={`${d.name} landscape`}
                    loading="lazy"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent transition-opacity group-hover:from-black/85"
                  />
                  <div className="absolute inset-x-0 top-0 p-5">
                    <span className="font-editorial-serif text-[13px] tracking-[0.2em] text-white/70">
                      0{index + 1}
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 text-white">
                    <div>
                      <span className="block font-editorial-serif text-2xl font-normal tracking-tight">
                        {d.name}
                      </span>
                      <span className="mt-1 block text-[11px] uppercase tracking-[0.18em] text-[#C5A059]">
                        {d.phrase}
                      </span>
                    </div>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/30 bg-white/10 text-white backdrop-blur-sm transition-colors group-hover:border-white group-hover:bg-white group-hover:text-neutral-900">
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works / Methodology */}
      <section
        id="how-it-works"
        className="relative z-10 scroll-mt-24 border-t border-neutral-200/60 bg-[#F4F3F0]/50 px-6 py-20 sm:px-12 sm:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            overline="METHODOLOGY / THREE MOVEMENTS"
            titlePrimary="Effortless By"
            titleAccent="Design."
            text="Stripped of superfluous distraction, leaving only an intentional, curated voyage."
            className="mb-16"
          />

          <ol className="grid gap-10 md:grid-cols-3 md:gap-12">
            {steps.map(({ num, title, text }) => (
              <li
                key={title}
                className="border-t border-neutral-300/80 pt-6 transition hover:border-neutral-900"
              >
                <span className="font-editorial-serif text-2xl font-normal italic text-[#C5A059]">
                  {num}
                </span>
                <h3 className="mt-4 font-editorial-serif text-xl font-normal text-neutral-900">
                  {title}
                </h3>
                <p className="mt-3 text-[14px] font-normal leading-[1.7] text-neutral-600">
                  {text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Final Editorial Call to Action */}
      <section className="relative z-10 px-6 py-20 sm:px-12 sm:py-28">
        <div className="mx-auto max-w-7xl border border-neutral-900 bg-neutral-900 p-8 text-white sm:p-16">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-[#C5A059]" />
                <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#C5A059]">
                  COMMENCE / VOYAGE
                </span>
              </div>
              <h2 className="font-editorial-serif text-[36px] font-normal tracking-[-0.02em] sm:text-[54px]">
                Your Journey,{" "}
                <span className="italic text-[#C5A059]">Considered.</span>
              </h2>
              <p className="mt-3 max-w-md text-[14px] text-neutral-300">
                Quiet luxury is knowing every hour has been thoughtfully
                composed. Begin your itinerary in seconds.
              </p>
            </div>
            <a
              href="#planner"
              onClick={(e) => {
                e.preventDefault();
                scrollToId("planner");
              }}
              className="inline-flex items-center gap-3 border border-white bg-white px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-900 transition hover:bg-neutral-100"
            >
              Start Planning
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* Editorial Footer */}
      <footer className="relative z-10 border-t border-neutral-200/80 px-6 py-12 sm:px-12">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 sm:flex-row sm:items-center">
          <div className="flex items-center tracking-[0.2em]">
            <span className="font-editorial-serif text-sm font-medium uppercase text-neutral-900">
              ROAM
            </span>
            <span className="mx-2 text-xs font-light text-neutral-300">/</span>
            <span className="font-editorial-serif text-sm font-medium uppercase text-neutral-900">
              WISE
            </span>
            <span className="ml-4 text-[12px] text-neutral-400">
              · Curated travel intelligence.
            </span>
          </div>

          <ul className="flex flex-wrap gap-8 text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
            {[
              ["Philosophy", "top"],
              ["Planner", "planner"],
              ["Destinations", "destinations"],
              ["Methodology", "how-it-works"],
            ].map(([l, id]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToId(id);
                  }}
                  className="transition hover:text-neutral-900"
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </div>
  );
}