import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Menu, X } from "lucide-react";
import { scrollToId } from "../utils/scroll";

const links = [
  { label: "PHILOSOPHY", id: "top" },
  { label: "PLANNER", id: "planner" },
  { label: "DESTINATIONS", id: "destinations" },
  { label: "METHODOLOGY", id: "how-it-works" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-neutral-200/80 bg-[#FAF9F6]/90 backdrop-blur-md py-4"
          : "border-b border-neutral-200/40 bg-[#FAF9F6]/60 backdrop-blur-sm py-6"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 sm:px-12">
        {/* Editorial Logo */}
        <a
          href="/#top"
          onClick={(e) => go(e, "top")}
          className="group flex items-center tracking-[0.24em] focus-visible:outline-none"
        >
          <span className="font-editorial-serif text-[17px] font-medium tracking-[0.22em] text-neutral-900 transition-colors group-hover:text-black">
            ROAM
          </span>
          <span className="mx-2 text-[14px] font-light text-neutral-300">/</span>
          <span className="font-editorial-serif text-[17px] font-medium tracking-[0.22em] text-neutral-900 transition-colors group-hover:text-black">
            WISE
          </span>
        </a>

        {/* Minimalist Centered Navigation */}
        <ul className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <li key={l.id}>
              <a
                href={`/#${l.id}`}
                onClick={(e) => go(e, l.id)}
                className="text-[11px] font-medium tracking-[0.24em] text-neutral-500 transition-colors hover:text-neutral-900"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Access Button */}
        <div className="flex items-center gap-4">
          <a
            href="/#planner"
            onClick={(e) => go(e, "planner")}
            className="group relative hidden items-center justify-center overflow-hidden border border-neutral-900 bg-transparent px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-900 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm sm:inline-flex"
          >
            <span className="absolute inset-0 translate-y-full bg-neutral-900 transition-transform duration-300 ease-out group-hover:translate-y-0" />
            <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
              Access v1.0
            </span>
          </a>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center border border-neutral-300 text-neutral-900 transition hover:border-neutral-900 md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div
          id="mobile-menu"
          className="border-b border-neutral-200 bg-[#FAF9F6] px-6 py-8 md:hidden"
        >
          <ul className="space-y-5">
            {links.map((l) => (
              <li key={l.id}>
                <a
                  href={`/#${l.id}`}
                  onClick={(e) => go(e, l.id)}
                  className="block text-xs font-medium tracking-[0.24em] text-neutral-700 transition hover:text-neutral-900"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-8 pt-6 border-t border-neutral-200/60">
            <a
              href="/#planner"
              onClick={(e) => go(e, "planner")}
              className="flex w-full items-center justify-center border border-neutral-900 bg-neutral-900 py-3 text-xs font-medium tracking-[0.22em] text-white"
            >
              Access v1.0
            </a>
          </div>
        </div>
      )}
    </header>
  );
}