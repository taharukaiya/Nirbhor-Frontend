import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle,
  MessageCircle,
  ShieldCheck,
} from "../components/ui/Icons.jsx";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { useTranslation } from "react-i18next";

/**
 * ARCHITECTURAL INTENT:
 * SectionPage is a dynamic marketing/informational page component. 
 * It serves dual purposes (e.g., "About Nirbhor" and "How it Works") based on the `title` prop.
 * 
 * STATE MANAGEMENT / LOCALIZATION:
 * - Relies heavily on `react-i18next` for localized static copy.
 * - Uses conditional rendering (`isAbout` boolean derived from `title`) to toggle between 
 *   showing contact information (About) vs workflow steps (How it Works).
 */

const workflows = [
  [
    "01",
    "Set the brief",
    "Share your requirements, timing, location, and budget in one clear job.",
  ],
  [
    "02",
    "Compare the fit",
    "Review verified profiles or proposals, then ask questions in one focused thread.",
  ],
  [
    "03",
    "Agree with confidence",
    "Choose the right match, confirm the scope, and keep the next steps visible.",
  ],
  [
    "04",
    "Finish well",
    "Complete the work through a protected flow and leave a useful review.",
  ],
];

const values = [
  [
    ShieldCheck,
    "Trust is a product feature",
    "Verification and clear records are built into the experience, not added as an afterthought.",
  ],
  [
    MessageCircle,
    "Clarity beats noise",
    "Job-specific conversations help people make decisions without losing the important details.",
  ],
  [
    CheckCircle,
    "Good work compounds",
    "Fair reviews and dependable delivery help strong professionals build momentum over time.",
  ],
];

function SectionPage({ title, description }) {
  useDocumentTitle(title);
  const isAbout = title === "About Nirbhor";
  const { t } = useTranslation();

  const workflows = [
    ["01", t("howItWorks.step1"), t("howItWorks.step1Copy")],
    ["02", t("howItWorks.step2"), t("howItWorks.step2Copy")],
    ["03", t("howItWorks.step3"), t("howItWorks.step3Copy")],
    ["04", t("howItWorks.step4"), t("howItWorks.step4Copy")],
  ];

  const values = [
    [ShieldCheck, t("howItWorks.value1Title"), t("howItWorks.value1Copy")],
    [MessageCircle, t("howItWorks.value2Title"), t("howItWorks.value2Copy")],
    [CheckCircle, t("howItWorks.value3Title"), t("howItWorks.value3Copy")],
  ];

  return (
    <div className="min-h-[100dvh] overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30 py-12 text-[#10213f] sm:py-16 relative">
      {/* Decorative Blur Orbs */}
      <div className="pointer-events-none absolute left-0 top-0 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0066FF]/5 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-[40rem] w-[40rem] translate-x-1/3 translate-y-1/3 rounded-full bg-[#0066FF]/5 blur-[120px]" />

      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12 relative z-10">
        <section className="relative overflow-hidden rounded-3xl border border-white/50 bg-[#011F50] px-7 py-12 text-white sm:px-12 sm:py-16 lg:px-20 lg:py-20 shadow-[0_8px_32px_rgba(1,31,80,0.15)]">
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#2e7df6]/25 blur-3xl" />
          <div className="relative max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8ee0ba]">
              {isAbout ? t("about.heroTag") : t("howItWorks.heroTag")}
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
              {description}
            </p>
            <Link
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#8ee0ba] px-5 py-3 text-sm font-bold text-[#071f49] transition hover:bg-white"
              to={isAbout ? "#contact" : "/services"}
            >
              {isAbout ? t("about.talkToTeam") : t("howItWorks.ctaButton")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
        {isAbout ? (
          <>
            <section className="grid gap-8 py-16 lg:grid-cols-[0.8fr_1.2fr] lg:py-24">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#2e7df6]">
                  Why we exist
                </span>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#071f49] sm:text-5xl">
                  Better work begins with better conditions.
                </h2>
              </div>
              <div className="space-y-5 text-base leading-8 text-slate-600">
                <p>
                  Nirbhor brings Hirers and Service Providers into one
                  dependable marketplace, where identity, expectations, and
                  payment are easier to understand.
                </p>
                <p>
                  We are building for the everyday jobs that deserve
                  professional care, from a quick repair to a long-term working
                  relationship.
                </p>
              </div>
            </section>
            <section className="grid gap-4 sm:grid-cols-3">
              {values.map(([Icon, heading, copy]) => (
                <article
                  key={heading}
                  className="rounded-3xl border border-white/50 bg-white/60 backdrop-blur-xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:-translate-y-1 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
                  <Icon className="h-8 w-8 text-[#0066FF] relative z-10" />
                  <h2 className="mt-5 text-lg font-bold text-[#011F50] relative z-10">{heading}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-500 relative z-10">
                    {copy}
                  </p>
                </article>
              ))}
            </section>
            <section
              id="contact"
              className="mt-16 grid gap-10 rounded-3xl border border-white/50 bg-white/60 backdrop-blur-xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.03)] sm:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:p-14 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
              <div className="relative z-10">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#2e7df6]">
                  Contact
                </span>
                <h2 className="mt-4 text-3xl font-bold text-[#071f49]">
                  Let’s build better work together.
                </h2>
                <p className="mt-4 leading-7 text-slate-500">
                  Questions about verification, partnerships, or using Nirbhor?
                  Our team is ready to help.
                </p>
                <div className="mt-8 space-y-3 text-sm text-slate-600">
                  <p>Support hours: Sunday to Thursday, 9:00–18:00</p>
                  <p>
                    We respond to marketplace questions with care and context.
                  </p>
                </div>
              </div>
              <form
                className="grid gap-5 relative z-10"
                onSubmit={(event) => event.preventDefault()}
              >
                <label className="grid gap-2 text-sm font-semibold text-slate-700">
                  {t("auth.email")}
                  <input
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 font-normal outline-none transition focus:border-[#0066FF] focus:bg-white focus:ring-4 focus:ring-[#0066FF]/10"
                    type="email"
                    required
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-slate-700">
                  {t("chat.title")}
                  <textarea
                    className="min-h-36 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 font-normal outline-none transition focus:border-[#0066FF] focus:bg-white focus:ring-4 focus:ring-[#0066FF]/10"
                    required
                  />
                </label>
                <button
                  className="w-fit rounded-xl bg-[#0066FF] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(0,102,255,0.25)] transition-all duration-300 hover:bg-[#0052cc] hover:shadow-[0_12px_24px_rgba(0,102,255,0.35)] hover:-translate-y-0.5 focus:ring-4 focus:ring-[#0066FF]/20 mt-2"
                  type="submit"
                >
                  {t("common.submit")}
                </button>
              </form>
            </section>
          </>
        ) : (
          <section className="py-16 lg:py-24">
            <div className="mb-10 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#2e7df6]">
                The workflow
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#071f49] sm:text-5xl">
                Every step has a purpose.
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {workflows.map(([number, heading, copy]) => (
                <article
                  key={number}
                  className="rounded-3xl border border-white/50 bg-white/60 backdrop-blur-xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:-translate-y-1 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
                  <span className="inline-block text-sm font-bold text-[#0066FF] bg-[#0066FF]/10 px-3 py-1 rounded-full relative z-10 transition-colors group-hover:bg-[#0066FF] group-hover:text-white">
                    {number}
                  </span>
                  <h2 className="mt-6 text-xl font-bold text-[#011F50] relative z-10">
                    {heading}
                  </h2>
                  <p className="mt-3 max-w-sm leading-7 text-slate-500 relative z-10">
                    {copy}
                  </p>
                </article>
              ))}
            </div>
            <div className="mt-12 rounded-3xl border border-[#0066FF]/20 bg-gradient-to-br from-[#0066FF]/5 to-[#0066FF]/10 p-8 sm:p-12 shadow-[0_8px_32px_rgba(0,102,255,0.05)] backdrop-blur-md relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
              <div className="relative z-10">
                <h2 className="text-3xl font-bold text-[#011F50]">
                  {t("howItWorks.ctaTitle")}
                </h2>
                <p className="mt-3 text-lg text-slate-600 max-w-xl">
                  {t("howItWorks.ctaSubtitle")}
                </p>
                <Link
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#011F50] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(1,31,80,0.25)] transition-all duration-300 hover:bg-[#0066FF] hover:shadow-[0_12px_24px_rgba(0,102,255,0.35)] hover:-translate-y-0.5 focus:ring-4 focus:ring-[#011F50]/20"
                  to="/services"
                >
                  {t("findServices.title")} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default SectionPage;
