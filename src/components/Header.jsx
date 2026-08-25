import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo1 from "../assets/logo1.png";

const navigationLinks = [
  { label: "Find Services", to: "/services" },
  { label: "Find Jobs", to: "/jobs" },
  { label: "How It Works", to: "/how-it-works" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

function linkClass({ isActive }) {
  return [
    "text-sm font-medium transition-colors duration-200",
    isActive ? "text-[#0066FF]" : "text-slate-700 hover:text-[#011F50]",
  ].join(" ");
}

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-[#ffffffa6] backdrop-blur">
      <div className="mx-auto flex w-11/12 items-center justify-between lg:w-10/12">
        <Link
          className="flex items-center gap-4"
          to="/"
          onClick={() => setMobileMenuOpen(false)}
        >
          <img
            alt="Nirbhor"
            className="h-20 w-auto object-contain sm:h-24"
            src={logo1}
          />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navigationLinks.map((link) => (
            <NavLink key={link.to} className={linkClass} to={link.to}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            className="rounded-full border border-[#0066FF] px-5 py-2 text-sm font-semibold text-[#0066FF] transition-colors hover:bg-[#0066FF] hover:text-white"
            to="/login"
          >
            Log In
          </Link>
          <Link
            className="rounded-full bg-[#0066FF] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#011F50]"
            to="/register"
          >
            Get Started
          </Link>
        </div>

        <button
          className="inline-flex items-center justify-center rounded-full border border-slate-200 p-2 text-[#011F50] md:hidden"
          type="button"
          onClick={() => setMobileMenuOpen((currentValue) => !currentValue)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          <span className="sr-only">Toggle menu</span>
          <span className="flex h-5 w-5 flex-col justify-between">
            <span className="h-0.5 w-full rounded bg-current" />
            <span className="h-0.5 w-full rounded bg-current" />
            <span className="h-0.5 w-full rounded bg-current" />
          </span>
        </button>
      </div>

      <div
        className={`fixed inset-0 z-50 bg-slate-950/40 transition-opacity duration-300 md:hidden ${
          mobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden={!mobileMenuOpen}
      >
        <aside
          className={`ml-auto flex h-full w-11/12 max-w-sm flex-col bg-white px-6 py-6 shadow-2xl transition-transform duration-300 ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              <img
                alt="Nirbhor"
                className="h-14 w-auto object-contain sm:h-16"
                src={logo1}
              />
            </Link>
            <button
              className="rounded-full border border-slate-200 px-3 py-1 text-sm font-medium text-slate-600"
              type="button"
              onClick={() => setMobileMenuOpen(false)}
            >
              Close
            </button>
          </div>

          <nav className="mt-6 flex flex-col gap-2">
            {navigationLinks.map((link) => (
              <NavLink
                key={link.to}
                className={({ isActive }) =>
                  [
                    "rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-slate-100 text-[#0066FF]"
                      : "text-slate-700 hover:bg-slate-50",
                  ].join(" ")
                }
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-6 grid gap-3">
            <Link
              className="rounded-full border border-[#0066FF] px-5 py-3 text-center text-sm font-semibold text-[#0066FF]"
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
            >
              Log In
            </Link>
            <Link
              className="rounded-full bg-[#0066FF] px-5 py-3 text-center text-sm font-semibold text-white"
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </aside>
      </div>
    </header>
  );
}

export default Header;
