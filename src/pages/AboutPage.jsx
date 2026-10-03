/**
 * @file AboutPage.jsx
 * @description Dedicated "About Nirbhor" page (route: /about).
 *
 * Architectural Intent:
 * - Previously rendered via the generic SectionPage, which (due to a prop
 *   mismatch in the router) always fell through to the How-It-Works view.
 * - Presents mission, principles and a contact section. The contact form is
 *   presentational only (it does not post anywhere) - same behaviour as before.
 */
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  CreditCard,
  MessageCircle,
  ShieldCheck,
  Users,
} from "../components/ui/Icons.jsx";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";

function AboutPage() {
  const { t } = useTranslation();
  useDocumentTitle(t("about.pageTitle", "About Nirbhor"));

  const pillars = [
    [
      ShieldCheck,
      t("howItWorks.value1Title"),
      t("howItWorks.value1Copy"),
      "from-[#0066FF] to-[#00b3ff]",
    ],
    [
      MessageCircle,
      t("howItWorks.value2Title"),
      t("howItWorks.value2Copy"),
      "from-[#7c3aed] to-[#c084fc]",
    ],
    [
      CheckCircle,
      t("howItWorks.value3Title"),
      t("howItWorks.value3Copy"),
      "from-[#00b386] to-[#00d4a0]",
    ],
  ];

  const highlights = [
    [ShieldCheck, t("about.hl1", "NID-verified profiles")],
    [CreditCard, t("about.hl2", "Protected payments")],
    [MessageCircle, t("about.hl3", "Job-specific chat")],
    [Users, t("about.hl4", "Hirers & providers in one account")],
  ];

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0066FF] focus:bg-white focus:ring-4 focus:ring-[#0066FF]/10";

  return (
    <div className="relative overflow-hidden text-slate-900">
      {/* ── Hero ── */}
      <section className="relative isolate overflow-hidden bg-[#011F50] pb-28 pt-16 text-white sm:pb-36 sm:pt-24">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-32 -top-32 h-[32rem] w-[32rem] rounded-full bg-[#0066FF]/40 blur-[120px]" />
          <div className="absolute -bottom-40 -left-24 h-[28rem] w-[28rem] rounded-full bg-[#00d4a0]/25 blur-[110px]" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />
        </div>

        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 sm:px-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <span className="animate-slide-up inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white/90 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00d4a0]" />
              {t("about.heroTag")}
            </span>
            <h1 className="animate-slide-up mt-7 text-4xl font-extrabold leading-[1.05] tracking-tight [animation-delay:100ms] sm:text-6xl lg:text-7xl">
              Work you can{" "}
              <span className="text-gradient-light">trust.</span>
            </h1>
            <p className="animate-slide-up mt-6 max-w-xl text-base font-medium leading-relaxed text-white/70 [animation-delay:200ms] sm:text-lg">
              {t("about.pageDescription")}
            </p>
            <div className="animate-slide-up mt-9 flex flex-wrap gap-3 [animation-delay:300ms]">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[#011F50] shadow-xl transition hover:scale-105 hover:bg-[#00d4a0] active:scale-95"
              >
                {t("about.talkToTeam")} <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                to="/how-it-works"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                {t("nav.howItWorks", "How It Works")}
              </Link>
            </div>
          </div>

          {/* Floating highlight cards */}
          <div className="relative hidden lg:block">
            <div className="grid gap-4">
              {highlights.map(([Icon, label], i) => (
                <div
                  key={label}
                  style={{ animationDelay: `${i * 0.8}s` }}
                  className={`animate-float flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-xl ${
                    i % 2 ? "ml-10" : "mr-10"
                  }`}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-[#00d4a0]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-bold">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="relative z-10 mx-auto -mt-16 max-w-6xl px-5 sm:px-8">
        <div className="grid gap-10 rounded-[2rem] border border-slate-200/70 bg-white p-8 shadow-[0_20px_60px_-20px_rgba(1,31,80,0.2)] sm:p-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:p-16">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0066FF]">
              {t("about.whyWeExist", "Why we exist")}
            </span>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-[#011F50] sm:text-4xl lg:text-5xl">
              {t("about.betterWork", "Better work begins with better conditions.")}
            </h2>
          </div>
          <div className="space-y-5 border-slate-200 text-base leading-8 text-slate-600 lg:border-l lg:pl-14">
            <p className="text-lg font-medium text-slate-700">
              {t("about.paragraph1")}
            </p>
            <p>{t("about.paragraph2")}</p>
          </div>
        </div>
      </section>

      {/* ── Principles ── */}
      <section className="mx-auto mt-24 max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0066FF]">
            {t("about.valuesTitle", "What guides us")}
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#011F50] sm:text-5xl">
            Principles we build around.
          </h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {pillars.map(([Icon, heading, copy, gradient]) => (
            <article
              key={heading}
              className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_60px_-15px_rgba(1,31,80,0.2)]"
            >
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
              >
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-6 text-xl font-extrabold text-[#011F50]">
                {heading}
              </h3>
              <p className="mt-3 leading-7 text-slate-600">{copy}</p>
              <div
                className={`absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r ${gradient} transition-transform duration-500 group-hover:scale-x-100`}
              />
            </article>
          ))}
        </div>
      </section>

      {/* ── Contact ── */}
      <section
        id="contact"
        className="mx-auto mt-24 max-w-6xl scroll-mt-28 px-5 pb-8 sm:px-8"
      >
        <div className="relative isolate overflow-hidden rounded-[2.5rem] bg-[#011F50] text-white shadow-2xl shadow-[#011F50]/30">
          <div className="pointer-events-none absolute -left-24 -top-24 -z-10 h-80 w-80 rounded-full bg-[#0066FF]/40 blur-[100px]" />
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="p-8 sm:p-12 lg:p-16">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#00d4a0]">
                {t("about.contact", "Contact")}
              </span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                {t("about.contactTitle", "Let’s build better work together.")}
              </h2>
              <p className="mt-4 leading-7 text-white/70">
                {t(
                  "about.contactDesc",
                  "Questions about verification, partnerships, or using Nirbhor? Our team is ready to help.",
                )}
              </p>
              <div className="mt-8 space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#00d4a0]">
                    <Clock className="h-4 w-4" />
                  </span>
                  <p className="pt-1.5 font-semibold text-white/90">
                    {t(
                      "about.supportHours",
                      "Support hours: Sunday to Thursday, 9:00–18:00",
                    )}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#00d4a0]">
                    <MessageCircle className="h-4 w-4" />
                  </span>
                  <p className="pt-1.5 text-white/70">
                    {t(
                      "about.supportResponse",
                      "We respond to marketplace questions with care and context.",
                    )}
                  </p>
                </div>
              </div>
            </div>

            <form
              className="grid gap-5 bg-white p-8 text-slate-700 sm:p-12 lg:p-16"
              onSubmit={(event) => event.preventDefault()}
            >
              <label className="grid gap-2 text-sm font-semibold">
                {t("auth.email")}
                <input
                  className={inputClass}
                  type="email"
                  required
                  placeholder="you@example.com"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                {t("chat.title")}
                <textarea className={`${inputClass} min-h-36`} required />
              </label>
              <button
                type="submit"
                className="mt-1 w-fit rounded-full bg-[#0066FF] px-9 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#0066FF]/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0052cc] hover:shadow-xl focus:ring-4 focus:ring-[#0066FF]/20"
              >
                {t("common.submit")}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
