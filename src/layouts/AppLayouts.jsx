import { Link, NavLink, Outlet } from "react-router-dom";
import {
  adminNavLinks,
  dashboardNavLinks,
  footerLinks,
  publicNavLinks,
} from "../data/mockData.js";

const navClassName = ({ isActive }) =>
  `rounded-full px-4 py-2 transition ${isActive ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`;

const sidebarClassName = ({ isActive }) =>
  `rounded-xl px-3 py-2 text-sm font-medium transition ${isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`;

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="flex items-center gap-3 text-xl font-semibold tracking-tight text-slate-900"
          >
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-900 text-sm text-white shadow-sm">
              N
            </span>
            Nirbhor
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
            {publicNavLinks.map((item) => (
              <NavLink key={item.to} to={item.to} className={navClassName}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 text-sm font-medium">
            <Link
              to="/services"
              className="hidden rounded-full border border-slate-200 px-4 py-2 text-slate-700 transition hover:bg-slate-100 sm:inline-flex"
            >
              Search
            </Link>
            <Link
              to="/auth/login"
              className="rounded-full px-4 py-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Login
            </Link>
            <Link
              to="/auth/register"
              className="rounded-full bg-orange-500 px-4 py-2 text-white shadow-sm transition hover:bg-orange-600"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1fr] lg:px-8">
          <div>
            <div className="flex items-center gap-3 text-lg font-semibold">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-900 text-white">
                N
              </span>
              Nirbhor
            </div>
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-600">
              A verified service marketplace designed for trust, secure
              payments, and transparent hiring.
            </p>
          </div>

          <FooterColumn title="Quick Links" links={footerLinks.quick} />
          <FooterColumn title="Company" links={footerLinks.company} />
          <FooterColumn title="Support" links={footerLinks.support} />
          <FooterColumn title="Policies" links={footerLinks.policies} />
        </div>
      </footer>
    </div>
  );
}

export function AuthLayout() {
  return (
    <div className="grid min-h-screen bg-slate-950 text-white lg:grid-cols-[1.1fr_0.9fr]">
      <section className="hidden flex-col justify-between bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.35),transparent_40%),linear-gradient(145deg,#0f172a,#111827)] p-10 lg:flex">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-3 text-xl font-semibold"
          >
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-slate-950">
              N
            </span>
            Nirbhor
          </Link>
          <div className="mt-16 max-w-xl space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-200">
              Verified marketplace
            </p>
            <h1 className="text-5xl font-semibold tracking-tight">
              Trust-first hiring, built for Bangladesh.
            </h1>
            <p className="max-w-lg text-lg leading-8 text-slate-300">
              Verify once, switch roles instantly, and manage jobs, payments,
              and reviews in one secure account.
            </p>
          </div>
        </div>
        <div className="grid gap-4 text-sm text-slate-200 sm:grid-cols-3">
          <AuthFeature
            title="Email + NID"
            text="Step-by-step verification flow"
          />
          <AuthFeature
            title="Secure Escrow"
            text="Hold payment until completion"
          />
          <AuthFeature
            title="Job Chat"
            text="Private, proposal-based messaging"
          />
        </div>
      </section>

      <section className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
        <div className="w-full max-w-lg rounded-4xl bg-white p-6 text-slate-900 shadow-2xl shadow-black/20 ring-1 ring-slate-200 sm:p-8">
          <Outlet />
        </div>
      </section>
    </div>
  );
}

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="border-r border-slate-200 bg-white px-4 py-5 lg:min-h-screen lg:sticky lg:top-0">
        <Link
          to="/"
          className="flex items-center gap-3 px-2 text-lg font-semibold"
        >
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-900 text-white">
            N
          </span>
          Nirbhor
        </Link>

        <div className="mt-6 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Role Switch
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link
              to="/dashboard/hirer"
              className="rounded-xl bg-slate-900 px-3 py-2 text-center text-sm font-medium text-white"
            >
              Hirer
            </Link>
            <Link
              to="/dashboard/provider"
              className="rounded-xl border border-slate-200 px-3 py-2 text-center text-sm font-medium text-slate-700 hover:bg-white"
            >
              Service Provider
            </Link>
          </div>
        </div>

        <nav className="mt-6 grid gap-1 px-1">
          {dashboardNavLinks.map((item) => (
            <NavLink key={item.to} to={item.to} className={sidebarClassName}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Dashboard
              </p>
              <h1 className="text-lg font-semibold text-slate-900">
                Operations workspace
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                Notifications
              </button>
              <button className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm">
                User Menu
              </button>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-white lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="border-r border-white/10 bg-slate-900 px-4 py-5 lg:min-h-screen lg:sticky lg:top-0">
        <Link
          to="/admin"
          className="flex items-center gap-3 px-2 text-lg font-semibold"
        >
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-slate-950">
            A
          </span>
          Admin
        </Link>

        <nav className="mt-6 grid gap-1 px-1">
          {adminNavLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-xl px-3 py-2 text-sm font-medium transition ${isActive ? "bg-white text-slate-950" : "text-slate-300 hover:bg-white/10 hover:text-white"}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="min-w-0 bg-slate-100 text-slate-900">
        <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Admin dashboard
              </p>
              <h1 className="text-lg font-semibold text-slate-900">
                Verification, disputes, and platform control
              </h1>
            </div>
            <button className="rounded-full bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-600">
              Platform Settings
            </button>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
        {title}
      </h3>
      <ul className="mt-4 space-y-3 text-sm text-slate-600">
        {links.map((link) => (
          <li key={link.label}>
            <Link to={link.to} className="transition hover:text-slate-900">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AuthFeature({ title, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="font-medium text-white">{title}</p>
      <p className="mt-1 text-slate-300">{text}</p>
    </div>
  );
}
