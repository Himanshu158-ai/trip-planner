
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
      <main className="flex min-h-screen items-center justify-center bg-[#f5f4f0]">
        <p className="text-sm text-[#718077]">Loading your itinerary...</p>
      </main>
    );
  }

  const itinerary = trip.itinerary || [];
  const selectedDay =
    itinerary.find((day) => day.day === activeDay) || itinerary[0];

  const currency = trip.budget?.currency || "INR";

  return (
    <main className="min-h-screen bg-[#f5f4f0] px-5 py-8 text-[#18352b] sm:px-8">
      <div className="mx-auto max-w-7xl">
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2 text-sm font-semibold text-[#607267] hover:text-[#214b3a]"
        >
          <ArrowLeft size={17} />
          Back to planner
        </button>

        <section className="rounded-3xl bg-[#214b3a] p-6 text-white sm:p-10">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-[#d6e5ce]">
            <Sparkles size={15} />
            YOUR PERSONALIZED TRIP
          </span>

          <h1 className="mt-4 text-3xl font-semibold sm:text-5xl">
            {trip.destination}
          </h1>

          <p className="mt-3 text-sm text-[#d5e0d4]">
            Your journey, thoughtfully planned.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              {
                label: "Duration",
                value: `${trip.duration ?? itinerary.length} days`,
                icon: CalendarDays,
              },
              {
                label: "Travelers",
                value: trip.travelers,
                icon: Users,
              },
              {
                label: "Travel type",
                value: trip.travelType,
                icon: MapPin,
              },
              {
                label: "Total budget",
                value: money(trip.budget?.total, currency),
                icon: Wallet,
              },
            ].map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="rounded-2xl border border-white/15 bg-white/[0.07] p-4"
              >
                <Icon size={19} className="text-[#c6d9bb]" />
                <p className="mt-4 text-xs text-[#d5e0d4]">{label}</p>
                <p className="mt-1 break-words font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_340px]">
          <section>
            <p className="text-xs font-bold tracking-widest text-[#82917e]">
              YOUR JOURNEY
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Day-by-day itinerary
            </h2>

            <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
              {itinerary.map((day) => (
                <button
                  key={day.day}
                  onClick={() => setActiveDay(day.day)}
                  className={`min-w-[75px] rounded-xl border px-4 py-3 text-left ${
                    selectedDay?.day === day.day
                      ? "border-[#315c43] bg-[#eaf0e5] text-[#214b3a]"
                      : "border-[#e2e1d9] bg-[#fdfcf9] text-[#718077]"
                  }`}
                >
                  <span className="block text-xs">DAY</span>
                  <span className="mt-1 block text-lg font-semibold">
                    {day.day}
                  </span>
                </button>
              ))}
            </div>

            {selectedDay && (
              <section className="mt-3 rounded-2xl border border-[#e2e1d9] bg-[#fdfcf9] p-5 sm:p-7">
                <p className="text-xs font-bold tracking-widest text-[#79966f]">
                  DAY {selectedDay.day}
                </p>

                <h3 className="mt-2 text-xl font-semibold">
                  {selectedDay.title}
                </h3>

                <div className="mt-6 space-y-4">
                  {(selectedDay.activities || []).map((activity, index) => (
                    <article
                      key={`${selectedDay.day}-${index}`}
                      className="rounded-xl border border-[#e9e8e0] bg-[#f8f7f3] p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="flex items-center gap-2 text-xs font-semibold text-[#54764a]">
                          <Clock3 size={14} />
                          {activity.time}
                        </span>
                        <span className="text-xs text-[#718077]">
                          {activity.estimatedDuration}
                        </span>
                      </div>

                      <h4 className="mt-3 font-semibold">
                        {activity.place}
                      </h4>

                      <p className="mt-1 text-sm leading-6 text-[#718077]">
                        {activity.activity}
                      </p>

                      <p className="mt-3 text-sm font-semibold text-[#315c43]">
                        Estimated cost:{" "}
                        {money(activity.estimatedCost, currency)}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            )}

            <section className="mt-8 rounded-2xl border border-[#e2e1d9] bg-[#fdfcf9] p-5">
              <h3 className="text-xl font-semibold">Travel tips</h3>
              <ul className="mt-4 space-y-3">
                {(trip.travelTips || []).map((tip, index) => (
                  <li
                    key={index}
                    className="border-b border-[#eeeee7] pb-3 text-sm leading-6 text-[#68766d] last:border-0 last:pb-0"
                  >
                    {tip}
                  </li>
                ))}
              </ul>
            </section>
          </section>

          <aside className="rounded-2xl border border-[#e2e1d9] bg-[#fdfcf9] p-5 sm:p-6 lg:sticky lg:top-24">
            <p className="text-sm text-[#78847b]">Estimated trip budget</p>

            <h2 className="mt-2 text-3xl font-semibold">
              {money(trip.budget?.total, currency)}
            </h2>

            <div className="mt-6 space-y-4">
              {Object.entries(trip.budget?.breakdown || {}).map(
                ([category, amount]) => (
                  <div
                    key={category}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="text-sm capitalize text-[#68766d]">
                      {category.replace(/([A-Z])/g, " $1")}
                    </span>
                    <span className="text-sm font-semibold">
                      {money(amount, currency)}
                    </span>
                  </div>
                )
              )}
            </div>

            <div className="mt-6 border-t border-[#e2e1d9] pt-4 text-xs leading-5 text-[#879087]">
              All costs are estimates. Verify availability and prices before
              making reservations.
            </div>

            <button
              onClick={() => {
                sessionStorage.removeItem("generatedTrip");
                navigate("/");
              }}
              className="mt-5 w-full rounded-xl bg-[#214b3a] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#17392b]"
            >
              Plan another trip
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}
