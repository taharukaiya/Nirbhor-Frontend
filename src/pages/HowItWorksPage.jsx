/**
 * @file HowItWorksPage.jsx
 * @description Dedicated "How It Works" page (route: /how-it-works).
 *
 * Architectural Intent:
 * - Previously served by the generic SectionPage; split out so /about and
 *   /how-it-works can no longer collide on the same rendered content.
 * - Lets visitors toggle between the Hirer and Service Provider journeys
 *   (the platform is dual-mode), each rendered as a vertical timeline.
 * - All copy goes through react-i18next (`howItWorks.*`) with English
 *   fallbacks for the newer strings.
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  Briefcase,
  CheckCircle,
  CreditCard,
  MessageCircle,
  Search,
  ShieldCheck,
  Star,
  UserCheck,
} from "../components/ui/Icons.jsx";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";

function HowItWorksPage() {
  const { t } = useTranslation();
  useDocumentTitle(t("howItWorks.pageTitle", "How It Works"));
  const [audience, setAudience] = useState("hirer");

  const journeys = {
    hirer: [
      {
        icon: Briefcase,
        title: t("howItWorks.step1"),
        copy: t("howItWorks.step1Copy"),
      },
      {
        icon: Search,
        title: t("howItWorks.step2"),
        copy: t("howItWorks.step2Copy"),
      },
      {
        icon: MessageCircle,
        title: t("howItWorks.step3"),
        copy: t("howItWorks.step3Copy"),
      },
      {
        icon: Star,
        title: t("howItWorks.step4"),
        copy: t("howItWorks.step4Copy"),
      },
    ],
    provider: [
      {
        icon: UserCheck,
        title: t("howItWorks.p1", "Build a verified profile"),
        copy: t(
          "howItWorks.p1Copy",
          "Verify your NID, list your skills and show clients you are the real deal.",
        ),
      },
      {
        icon: Search,
        title: t("howItWorks.p2", "Find real jobs"),
        copy: t(
          "howItWorks.p2Copy",
          "Browse open jobs by category and location, then send a proposal with your price.",
        ),
      },
      {
        icon: MessageCircle,
        title: t("howItWorks.p3", "Agree the details"),
        copy: t(
          "howItWorks.p3Copy",
          "Chat inside the job thread so scope, timing and expectations are clear to both sides.",
        ),
      },
      {
        icon: CreditCard,
        title: t("howItWorks.p4", "Get paid securely"),
        copy: t(
          "howItWorks.p4Copy",
          "Payment is protected from the start and released to your wallet when the work is done.",
        ),
      },
    ],
  };

  const steps = journeys[audience];

  const guarantees = [
    [ShieldCheck, t("howItWorks.value1Title"), t("howItWorks.value1Copy")],
    [MessageCircle, t("howItWorks.value2Title"), t("howItWorks.value2Copy")],
    [CheckCircle, t("howItWorks.value3Title"), t("howItWorks.value3Copy")],
  ];

  return (
    <div className="relative overflow-hidden text-slate-900">
      {/* ── Hero ── */}
      <section className="relative isolate overflow-hidden bg-[#011F50] pb-32 pt-32 text-white sm:pb-40 sm:pt-44">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-[#0066FF]/40 blur-[110px]" />
          <div className="absolute -right-24 top-1/3 h-[26rem] w-[26rem] rounded-full bg-[#00d4a0]/25 blur-[110px]" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
          />
        </div>

        <div className="mx-auto max-w-5xl px-6 text-center sm:px-8">
          <span className="animate-slide-up inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white/90 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00d4a0]" />
            {t("howItWorks.heroTag")}
          </span>
          <h1 className="animate-slide-up mt-7 text-4xl font-extrabold leading-[1.05] tracking-tight [animation-delay:100ms] sm:text-6xl lg:text-7xl">
            {t("howItWorks.pageTitle")}{" "}
            <span className="text-gradient-light">in four steps.</span>
          </h1>
          <p className="animate-slide-up mx-auto mt-6 max-w-2xl text-base font-medium leading-relaxed text-white/70 [animation-delay:200ms] sm:text-lg">
            {t("howItWorks.pageDescription")}
          </p>

          {/* Audience toggle */}
          <div
            role="tablist"
            aria-label="Choose your journey"
            className="animate-slide-up mx-auto mt-10 inline-flex rounded-full border border-white/15 bg-white/10 p-1.5 backdrop-blur-md [animation-delay:300ms]"
          >
            {[
              ["hirer", t("howItWorks.imHirer", "I want to hire")],
              ["provider", t("howItWorks.imProvider", "I want to work")],
            ].map(([key, label]) => (
              <button
                key={key}
                role="tab"
                type="button"
                aria-selected={audience === key}
                onClick={() => setAudience(key)}
                className={`rounded-full px-6 py-2.5 text-sm font-bold transition-all duration-300 ${
                  audience === key
                    ? "bg-white text-[#011F50] shadow-lg"
                    : "text-white/75 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="relative z-10 mx-auto -mt-20 max-w-6xl px-5 sm:-mt-24 sm:px-8">
        <div className="relative grid gap-5 md:grid-cols-2">
          {/* connector line (desktop) */}
          <div className="pointer-events-none absolute left-1/2 top-10 bottom-10 hidden w-px -translate-x-1/2 bg-gradient-to-b from-[#0066FF]/0 via-[#0066FF]/30 to-[#0066FF]/0 md:block" />
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <article
                key={`${audience}-${index}`}
                style={{ animationDelay: `${index * 90}ms` }}
                className={`animate-slide-up group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-8 shadow-[0_12px_40px_-12px_rgba(1,31,80,0.12)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_-15px_rgba(0,102,255,0.25)] ${
                  index % 2 === 1 ? "md:mt-12" : ""
                }`}
              >
                <span className="pointer-events-none absolute -right-3 -top-6 select-none text-[8rem] font-black leading-none text-slate-100 transition-colors group-hover:text-[#0066FF]/10">
                  {index + 1}
                </span>
                <div className="relative">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0066FF] to-[#00b3ff] text-white shadow-lg shadow-[#0066FF]/30 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h2 className="mt-6 text-xl font-extrabold text-[#011F50]">
                    {step.title}
                  </h2>
                  <p className="mt-3 max-w-sm leading-7 text-slate-600">
                    {step.copy}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── Guarantees ── */}
      <section className="mx-auto mt-28 max-w-6xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0066FF]">
            {t("howItWorks.valuesTitle")}
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#011F50] sm:text-5xl">
            {t("howItWorks.everyStep", "Every step has a purpose.")}
          </h2>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {guarantees.map(([Icon, heading, copy]) => (
            <article
              key={heading}
              className="rounded-3xl border border-slate-200/70 bg-gradient-to-b from-white to-slate-50 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[#0066FF]/30 hover:shadow-xl hover:shadow-[#0066FF]/10"
            >
              <Icon className="h-8 w-8 text-[#0066FF]" />
              <h3 className="mt-5 text-lg font-bold text-[#011F50]">
                {heading}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-500">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mx-auto mt-28 max-w-6xl px-5 pb-8 sm:px-8">
        <div className="relative isolate overflow-hidden rounded-[2.5rem] bg-[#011F50] px-8 py-16 text-center text-white shadow-2xl shadow-[#011F50]/30 sm:px-16 sm:py-20">
          <div className="pointer-events-none absolute -left-20 -top-20 -z-10 h-72 w-72 rounded-full bg-[#0066FF]/40 blur-[90px]" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 -z-10 h-72 w-72 rounded-full bg-[#00d4a0]/30 blur-[90px]" />
          <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight sm:text-5xl">
            {t("howItWorks.ctaTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">
            {t("howItWorks.ctaSubtitle")}
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-[#011F50] shadow-xl transition hover:scale-105 hover:bg-[#00d4a0] active:scale-95"
            >
              {t("howItWorks.ctaButton")} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-8 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
            >
              {t("nav.about", "About")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HowItWorksPage;
