import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Compass, Menu, X } from "lucide-react";
import { scrollToId } from "../utils/scroll";

const links = [
  { label: "Home", id: "top" },
  { label: "Explore", id: "planner" },
  { label: "Destinations", id: "destinations" },
  { label: "How it works", id: "how-it-works" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function go(e, id) {
    e.preventDefault();
    setOpen(false);
    if (pathname === "/") scrollToId(id);
    else navigate(`/#${id}`);
  }

  return (
    <header className="fixed inset-x-0 top-4 z-40 px-4 sm:top-5">
      <nav
        aria-label="Primary"
        className="mx-auto max-w-[1120px] rounded-[32px] border border-[#E7E1D5] bg-[#FDFBF6]/90 shadow-[0_8px_30px_rgba(33,31,26,0.08)] backdrop-blur-md"
      >
        <div className="flex h-[60px] items-center justify-between pl-4 pr-2 md:h-[64px] md:pl-5">
          <a href="/#top" onClick={(e) => go(e, "top")} className="flex items-center gap-2.5 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#211F1A]">
            <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#FFC943] text-[#211F1A]">
              <Compass size={18} strokeWidth={2.4} />
            </span>
            <span className="text-[19px] font-extrabold tracking-[-0.03em] text-[#211F1A]">Wayfinder AI</span>
          </a>

          <ul className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <li key={l.id}>
                <a href={`/#${l.id}`} onClick={(e) => go(e, l.id)} className="text-[14.5px] font-medium text-[#77746C] transition-colors hover:text-[#211F1A] focus-visible:text-[#211F1A]">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a href="/#planner" onClick={(e) => go(e, "planner")} className="group hidden h-11 items-center gap-2.5 rounded-full bg-[#FFC943] pl-5 pr-1.5 text-sm font-bold text-[#211F1A] transition-colors hover:bg-[#F1B82D] sm:inline-flex">
              Plan my trip
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
              </span>
            </a>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
              className="flex h-11 w-11 items-center justify-center rounded-full text-[#211F1A] hover:bg-[#F7F4EC] md:hidden"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {open && (
          <div id="mobile-menu" className="border-t border-[#E7E1D5] p-3 md:hidden">
            <ul>
              {links.map((l) => (
                <li key={l.id}>
                  <a href={`/#${l.id}`} onClick={(e) => go(e, l.id)} className="block rounded-2xl px-4 py-3.5 text-[15px] font-medium text-[#211F1A] hover:bg-[#F7F4EC]">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <a href="/#planner" onClick={(e) => go(e, "planner")} className="mt-2 flex h-12 items-center justify-center gap-2 rounded-full bg-[#FFC943] text-sm font-bold text-[#211F1A] sm:hidden">
              Plan my trip <ArrowRight size={16} />
            </a>
          </div>
        )}
      </nav>
    </header>
  );
}