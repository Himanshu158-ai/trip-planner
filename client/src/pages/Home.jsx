import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { generateTrip } from "../service/tripApi";
import Navbar from "../components/Navbar";
import { DESTINATIONS, HERO_IMAGE } from "../data/destinations";
import { scrollToId } from "../utils/scroll";
import {
  AlertCircle, ArrowRight, CalendarDays, Camera, Check, ChevronDown, Compass,
  Landmark, ListChecks, LoaderCircle, MapPin, Minus, Mountain, Plus, Sparkles,
  TreePalm, Users, Utensils, Wallet, Waves,
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
  { icon: MapPin, title: "Choose your destination", text: "Tell us where you want to go, your budget, and your interests." },
  { icon: Sparkles, title: "Generate your itinerary", text: "Let AI organize your trip into a practical day-by-day plan." },
  { icon: ListChecks, title: "Explore with confidence", text: "Review activities, estimated costs, and useful travel tips." },
];

const money = (amount) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(amount) || 0);

const field =
  "w-full rounded-2xl border border-[#E7E1D5] bg-[#FDFBF6] text-[15px] text-[#211F1A] outline-none transition placeholder:text-[#77746C]/70 focus:border-[#211F1A] focus:ring-4 focus:ring-[#FFF0C5]";

function Counter({ label, unit, value, onChange, min, max, icon: Icon }) {
  const btn =
    "flex h-9 w-9 items-center justify-center rounded-full border border-[#E7E1D5] bg-white transition hover:bg-[#FFF0C5] disabled:opacity-35 disabled:hover:bg-white";
  return (
    <div role="group" aria-label={label}>
      <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#211F1A]">
        <Icon size={16} className="text-[#77746C]" /> {label}
      </span>
      <div className="flex h-[54px] items-center justify-between rounded-2xl border border-[#E7E1D5] bg-[#FDFBF6] px-4">
        <span className="text-[15px] text-[#211F1A]" aria-live="polite">
          {value} {unit}
        </span>
        <div className="flex items-center gap-2">
          <button type="button" aria-label={`Decrease ${label}`} disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))} className={btn}>
            <Minus size={14} />
          </button>
          <button type="button" aria-label={`Increase ${label}`} disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))} className={btn}>
            <Plus size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ title, text, className = "" }) {
  return (
    <div className={className}>
      <h2 className="text-[34px] font-extrabold leading-[1.08] tracking-[-0.03em] text-[#211F1A] sm:text-5xl">{title}</h2>
      <p className="mt-3 max-w-xl text-base leading-7 text-[#77746C] sm:text-lg">{text}</p>
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
  const [heroOk, setHeroOk] = useState(true);

  useEffect(() => {
    if (!hash) return;
    const t = setTimeout(() => scrollToId(hash.slice(1)), 50);
    return () => clearTimeout(t);
  }, [hash]);

  function toggleInterest(name) {
    setInterests((c) => (c.includes(name) ? c.filter((i) => i !== name) : [...c, name]));
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (loading) return;
    setError("");

    if (!destination.trim()) return setError("Please enter your destination.");
    if (!interests.length) return setError("Please select at least one interest.");
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

  const ctaPrimary =
    "group inline-flex h-[52px] items-center gap-3 rounded-full bg-[#FFC943] pl-6 pr-1.5 text-[15px] font-bold text-[#211F1A] transition-colors hover:bg-[#F1B82D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#211F1A]";
  const arrowDisc = "flex h-10 w-10 items-center justify-center rounded-full bg-white";
  const arrowMove = "transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none";

  return (
    <div id="top" className="min-h-screen bg-[#F7F4EC] font-['Manrope','DM_Sans',system-ui,sans-serif] text-[#211F1A]">
      <Navbar />

      {/* Hero */}
      <section className="relative mx-2 mt-2 flex min-h-[calc(100svh-1rem)] items-end overflow-hidden rounded-[24px] bg-[#E9DFC8] sm:mx-3 sm:mt-3 sm:rounded-[28px]">
        {heroOk && (
          <img
            src={HERO_IMAGE}
            alt="Cliffside coastal town overlooking the sea at golden hour"
            fetchPriority="high"
            onError={() => setHeroOk(false)}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(247,244,236,0.86) 0%, rgba(247,244,236,0.45) 52%, rgba(247,244,236,0) 100%), linear-gradient(0deg, rgba(247,244,236,0.5) 0%, rgba(247,244,236,0) 45%)",
          }}
        />
        <div className="relative z-10 w-full px-5 pb-12 pt-36 sm:px-[4.5vw] sm:pb-16">
          <div className="max-w-[780px]">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#E7E1D5] bg-[#FDFBF6]/90 px-3.5 py-2 text-xs font-semibold tracking-wide text-[#211F1A]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FFC943]" />
              ✦ YOUR NEXT ADVENTURE STARTS HERE
            </span>
            <h1 className="mt-6 text-[42px] font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-[64px] lg:text-[76px]">
              Travel smarter.
              <br />
              Discover more.
            </h1>
            <p className="mt-6 max-w-[540px] text-base leading-7 text-[#4d4a43] sm:text-lg">
              Create personalized travel itineraries in minutes, discover incredible places, and plan every detail of your next adventure with AI.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#planner" onClick={(e) => { e.preventDefault(); scrollToId("planner"); }} className={ctaPrimary + " justify-between sm:justify-start"}>
                Plan my trip
                <span className={arrowDisc}><ArrowRight size={17} className={arrowMove} /></span>
              </a>
              <a href="#destinations" onClick={(e) => { e.preventDefault(); scrollToId("destinations"); }} className="group inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-[#211F1A] px-6 text-[15px] font-semibold text-white transition-colors hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#211F1A]">
                Explore destinations
                <ArrowRight size={16} className={arrowMove} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Planner */}
      <section id="planner" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-[920px]">
          <SectionHeading title="Your trip, your way." text="Tell us what you love. We'll help plan the rest." className="mb-10 text-center [&>p]:mx-auto" />

          <form onSubmit={handleSubmit} noValidate className="space-y-6 rounded-[28px] border border-[#E7E1D5] bg-white p-5 shadow-[0_20px_60px_rgba(33,31,26,0.06)] sm:p-10">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label htmlFor="destination" className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <MapPin size={16} className="text-[#77746C]" /> Destination
                </label>
                <input
                  id="destination"
                  maxLength={120}
                  value={destination}
                  disabled={loading}
                  onChange={(e) => { setDestination(e.target.value); setError(""); }}
                  placeholder="Try Goa, Bali or the Swiss Alps"
                  className={field + " h-[54px] px-4"}
                />
              </div>

              <Counter label="Number of days" unit={days === 1 ? "day" : "days"} value={days} min={1} max={30} onChange={setDays} icon={CalendarDays} />
              <Counter label="Travelers" unit={travelers === 1 ? "person" : "people"} value={travelers} min={1} max={20} onChange={setTravelers} icon={Users} />

              <div>
                <label htmlFor="budget" className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <Wallet size={16} className="text-[#77746C]" /> Total budget (INR)
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#77746C]">₹</span>
                  <input
                    id="budget"
                    type="number"
                    inputMode="numeric"
                    min="1"
                    max="100000000"
                    value={budget}
                    disabled={loading}
                    onChange={(e) => { setBudget(e.target.value); setError(""); }}
                    className={field + " h-[54px] pl-9 pr-4 font-semibold"}
                  />
                </div>
                <p className="mt-2 text-xs text-[#77746C]">
                  {Number(budget) > 0 ? `About ${money(Number(budget) / travelers)} per traveler` : "Enter your total trip budget"}
                </p>
              </div>

              <div>
                <label htmlFor="travelType" className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <Compass size={16} className="text-[#77746C]" /> Travel type
                </label>
                <div className="relative">
                  <select id="travelType" value={travelType} disabled={loading} onChange={(e) => setTravelType(e.target.value)} className={field + " h-[54px] appearance-none px-4 pr-10"}>
                    <option>Solo</option>
                    <option>Couple</option>
                    <option>Friends</option>
                    <option>Family</option>
                  </select>
                  <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#77746C]" />
                </div>
              </div>
            </div>

            <fieldset>
              <legend className="mb-3 text-sm font-semibold">Interests</legend>
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
                      className={`inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition ${
                        on ? "border-[#211F1A] bg-[#FFF0C5] text-[#211F1A]" : "border-[#E7E1D5] bg-[#FDFBF6] text-[#77746C] hover:border-[#211F1A]/40"
                      }`}
                    >
                      <Icon size={16} /> {name} {on && <Check size={14} />}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {error && (
              <div role="alert" className="flex gap-3 rounded-2xl border border-[#E8C4B8] bg-[#FBEFEA] p-4 text-sm leading-6 text-[#8A3B27]">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" disabled={loading} aria-busy={loading} className={ctaPrimary + " w-full justify-between disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"}>
              {loading ? (
                <>Creating your itinerary… <span className={arrowDisc}><LoaderCircle size={17} className="animate-spin motion-reduce:animate-none" /></span></>
              ) : (
                <>Generate my itinerary <span className={arrowDisc}><ArrowRight size={17} className={arrowMove} /></span></>
              )}
            </button>

            {loading && (
              <p role="status" aria-live="polite" className="text-sm leading-6 text-[#77746C]">
                Building your day-by-day plan. This can take a little while, so please keep this page open.
              </p>
            )}
          </form>
        </div>
      </section>

      {/* Destinations */}
      <section id="destinations" className="scroll-mt-24 px-5 pb-20 sm:px-8 sm:pb-28">
        <div className="mx-auto max-w-[1200px]">
          <SectionHeading title="Find your next favorite place." text="From quiet coastal escapes to unforgettable mountain adventures." className="mb-10" />
          <ul className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {DESTINATIONS.map((d) => (
              <li key={d.name}>
                <button type="button" onClick={() => selectDestination(d.name)} className="group relative block aspect-[4/5] w-full overflow-hidden rounded-[22px] bg-[#E9DFC8] text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#211F1A] sm:aspect-[5/6]">
                  <img src={d.image} alt={`${d.name} landscape`} loading="lazy" onError={(e) => (e.currentTarget.style.display = "none")} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100" />
                  <div aria-hidden="true" className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(25,23,18,0.62) 0%, rgba(25,23,18,0.18) 38%, rgba(25,23,18,0) 60%)" }} />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-white">
                    <span>
                      <span className="block text-xl font-bold tracking-tight">{d.name}</span>
                      <span className="mt-1 block text-sm text-white/85">{d.phrase}</span>
                    </span>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFC943] text-[#211F1A]">
                      <ArrowRight size={16} className={arrowMove} />
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-24 border-y border-[#E7E1D5] bg-[#FDFBF6] px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-[1100px]">
          <SectionHeading title="Three steps to a plan." text="No spreadsheets, no endless tabs." className="mb-12" />
          <ol className="grid gap-10 md:grid-cols-3 md:gap-12">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <li key={title}>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF0C5] text-[#211F1A]"><Icon size={22} /></span>
                <h3 className="mt-5 text-xl font-bold tracking-tight">
                  <span className="sr-only">Step {i + 1}: </span>{title}
                </h3>
                <p className="mt-2 leading-7 text-[#77746C]">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto flex max-w-[1100px] flex-col items-start justify-between gap-8 rounded-[28px] bg-[#211F1A] p-8 text-white sm:p-14 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-extrabold leading-[1.1] tracking-[-0.03em] sm:text-5xl">Ready when you are.</h2>
            <p className="mt-3 max-w-md text-white/70">Your first itinerary is a few details away.</p>
          </div>
          <a href="#planner" onClick={(e) => { e.preventDefault(); scrollToId("planner"); }} className={ctaPrimary + " shrink-0"}>
            Plan my trip <span className={arrowDisc}><ArrowRight size={17} className={arrowMove} /></span>
          </a>
        </div>
      </section>

      <footer className="border-t border-[#E7E1D5] px-5 py-10 sm:px-8">
        <div className="mx-auto flex max-w-[1100px] flex-col justify-between gap-6 text-sm text-[#77746C] sm:flex-row sm:items-center">
          <p><span className="font-bold text-[#211F1A]">Wayfinder AI</span> · AI-generated travel itineraries. Check details before you book.</p>
          <ul className="flex flex-wrap gap-6">
            {[["Explore", "planner"], ["Destinations", "destinations"], ["How it works", "how-it-works"]].map(([l, id]) => (
              <li key={id}><a href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollToId(id); }} className="hover:text-[#211F1A]">{l}</a></li>
            ))}
          </ul>
        </div>
      </footer>
    </div>
  );
}