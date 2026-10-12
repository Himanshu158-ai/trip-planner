import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Users,
  Wallet,
  Clock3,
  MapPin,
  Sparkles,
} from "lucide-react";

const money = (amount, currency = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

export default function TripResult() {
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [activeDay, setActiveDay] = useState(1);

  useEffect(() => {
    const storedTrip = sessionStorage.getItem("generatedTrip");

    if (!storedTrip) {
      navigate("/", { replace: true });
      return;
    }

    try {
      setTrip(JSON.parse(storedTrip));
    } catch {
      sessionStorage.removeItem("generatedTrip");
      navigate("/", { replace: true });
    }
  }, [navigate]);

  if (!trip) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF9F6]">
        <p className="font-editorial-serif text-lg italic text-[#C5A059]">
          Retrieving curated dossier…
        </p>
      </main>
    );
  }

  const itinerary = trip.itinerary || [];
  const selectedDay =
    itinerary.find((day) => day.day === activeDay) || itinerary[0];

  const currency = trip.budget?.currency || "INR";

  return (
    <main className="relative min-h-screen bg-[#FAF9F6] px-6 py-12 text-[#1A1A1A] sm:px-12">
      {/* Subtle vertical architectural grid */}
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
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <button
          onClick={() => navigate("/")}
          className="group mb-8 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500 transition hover:text-neutral-900"
        >
          <ArrowLeft
            size={14}
            className="transition-transform group-hover:-translate-x-1"
          />
          Return to Curator
        </button>

        {/* Dossier Hero Banner */}
        <section className="border border-neutral-900 bg-neutral-900 p-8 text-white sm:p-14">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#C5A059]" />
            <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#C5A059]">
              CONFIRMED DOSSIER / EXPEDITION ARCHIVE
            </span>
          </div>

          <h1 className="mt-5 font-editorial-serif text-4xl font-normal tracking-tight sm:text-6xl lg:text-7xl">
            {trip.destination}{" "}
            <span className="block font-editorial-serif text-2xl font-normal italic text-[#C5A059] sm:inline sm:text-4xl">
              · Tailored Itinerary
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-neutral-300">
            A harmonious sequence of vetted experiences, paced with restraint
            and curated for seamless discovery.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4 border-t border-neutral-800 pt-8 sm:grid-cols-4">
            {[
              {
                label: "DURATION",
                value: `${trip.duration ?? itinerary.length} Days`,
                icon: CalendarDays,
              },
              {
                label: "TRAVELERS",
                value: `${trip.travelers} Guests`,
                icon: Users,
              },
              {
                label: "DYNAMIC",
                value: trip.travelType,
                icon: MapPin,
              },
              {
                label: "TOTAL ALLOCATION",
                value: money(trip.budget?.total, currency),
                icon: Wallet,
              },
            ].map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="border border-neutral-800 bg-neutral-900/60 p-4 transition hover:border-neutral-700"
              >
                <div className="flex items-center justify-between text-[#C5A059]">
                  <span className="text-[10px] font-medium tracking-[0.2em] text-neutral-400">
                    {label}
                  </span>
                  <Icon size={14} />
                </div>
                <p className="mt-3 font-editorial-serif text-lg sm:text-xl font-normal text-white">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-[1fr_360px]">
          {/* Main Day-by-Day Content */}
          <section>
            <div className="flex items-center gap-3">
              <span className="h-px w-6 bg-neutral-400" />
              <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-neutral-500">
                CHRONOLOGY / ITINERARY
              </p>
            </div>

            <h2 className="mt-2 font-editorial-serif text-3xl font-normal text-neutral-900 sm:text-4xl">
              Day-by-Day <span className="italic text-[#C5A059]">Program</span>
            </h2>

            {/* Day Selector Pills */}
            <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
              {itinerary.map((day) => (
                <button
                  key={day.day}
                  onClick={() => setActiveDay(day.day)}
                  className={`min-w-[84px] border px-4 py-3 text-left transition ${
                    selectedDay?.day === day.day
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-900"
                  }`}
                >
                  <span
                    className={`block text-[10px] font-medium tracking-[0.2em] uppercase ${
                      selectedDay?.day === day.day
                        ? "text-[#C5A059]"
                        : "text-neutral-400"
                    }`}
                  >
                    Day
                  </span>
                  <span className="mt-1 block font-editorial-serif text-xl font-normal">
                    0{day.day}
                  </span>
                </button>
              ))}
            </div>

            {selectedDay && (
              <section className="mt-4 border border-neutral-200/90 bg-white p-6 sm:p-9 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.03)]">
                <div className="flex items-center justify-between border-b border-neutral-200/60 pb-4">
                  <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#C5A059]">
                    DAY 0{selectedDay.day}
                  </span>
                  <span className="text-[11px] uppercase tracking-wider text-neutral-400">
                    {(selectedDay.activities || []).length} Movements
                  </span>
                </div>

                <h3 className="mt-4 font-editorial-serif text-2xl font-normal text-neutral-900 sm:text-3xl">
                  {selectedDay.title}
                </h3>

                <div className="mt-8 space-y-5">
                  {(selectedDay.activities || []).map((activity, index) => (
                    <article
                      key={`${selectedDay.day}-${index}`}
                      className="border border-neutral-200/80 bg-[#FAF9F6] p-5 transition hover:border-neutral-900"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200/50 pb-3">
                        <span className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#C5A059]">
                          <Clock3 size={13} />
                          {activity.time}
                        </span>
                        <span className="text-[11px] tracking-wide text-neutral-400">
                          {activity.estimatedDuration}
                        </span>
                      </div>

                      <h4 className="mt-3 font-editorial-serif text-xl font-normal text-neutral-900">
                        {activity.place}
                      </h4>

                      <p className="mt-2 text-[14px] leading-relaxed text-neutral-600">
                        {activity.activity}
                      </p>

                      <div className="mt-4 flex items-center justify-between pt-2">
                        <span className="text-[11px] uppercase tracking-wider text-neutral-400">
                          Estimated Outlay
                        </span>
                        <span className="text-sm font-semibold text-neutral-900">
                          {money(activity.estimatedCost, currency)}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* Travel Guidance */}
            <section className="mt-8 border border-neutral-200/90 bg-white p-6 sm:p-8 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.03)]">
              <div className="flex items-center gap-3">
                <span className="h-px w-6 bg-[#C5A059]" />
                <h3 className="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
                  CURATED NOTES & ADVISORIES
                </h3>
              </div>
              <ul className="mt-5 space-y-3.5">
                {(trip.travelTips || []).map((tip, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 border-b border-neutral-100 pb-3.5 text-[14px] leading-relaxed text-neutral-600 last:border-0 last:pb-0"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C5A059]" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </section>
          </section>

          {/* Sticky Financial Allocation Dossier */}
          <aside className="border border-neutral-200/90 bg-white p-6 sm:p-8 lg:sticky lg:top-28 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.03)]">
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-400">
              <Wallet size={14} className="text-[#C5A059]" />
              FINANCIAL AUDIT
            </div>

            <p className="mt-3 text-xs text-neutral-500">Estimated Allocation</p>

            <h2 className="mt-1 font-editorial-serif text-3xl font-normal text-neutral-900 sm:text-4xl">
              {money(trip.budget?.total, currency)}
            </h2>

            <div className="mt-6 space-y-3 border-t border-neutral-200/60 pt-5">
              {Object.entries(trip.budget?.breakdown || {}).map(
                ([category, amount]) => (
                  <div
                    key={category}
                    className="flex items-center justify-between gap-3 text-[13px]"
                  >
                    <span className="capitalize tracking-wide text-neutral-500">
                      {category.replace(/([A-Z])/g, " $1")}
                    </span>
                    <span className="font-medium text-neutral-900">
                      {money(amount, currency)}
                    </span>
                  </div>
                )
              )}
            </div>

            <div className="mt-6 border-t border-neutral-200/60 pt-4 text-[11px] leading-5 text-neutral-400">
              All quotes are approximate references. Validate venue timings
              prior to arrival.
            </div>

            <button
              onClick={() => {
                sessionStorage.removeItem("generatedTrip");
                navigate("/");
              }}
              className="mt-6 w-full border border-neutral-900 bg-neutral-900 py-3.5 text-[11px] font-medium uppercase tracking-[0.22em] text-white transition hover:bg-neutral-800"
            >
              Compose Another Journey
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}
