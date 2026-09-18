import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  CreditCard,
  MessageCircle,
  ShieldCheck,
} from "../components/ui/Icons.jsx";
import { useRemoteList } from "../hooks/useRemoteList.js";
import { getServices } from "../services/api.js";
import electricianImage from "../assets/worker-slider/electrician.jpg";
import plumberImage from "../assets/worker-slider/plumber.jpg";
import driverImage from "../assets/worker-slider/driver.avif";

function HomePage() {
  useDocumentTitle("Home");
  const { t } = useTranslation();
  const { data: providers, loading } = useRemoteList(getServices);
  const [activeSlide, setActiveSlide] = useState(0);
  const sliderRef = useRef(null);

  const slides = [
    {
      tag: t("home.slide1Tag"),
      title: t("home.slide1Title"),
      copy: t("home.slide1Copy"),
      image: electricianImage,
      to: "/services",
      action: t("home.slide1Action"),
    },
    {
      tag: t("home.slide2Tag"),
      title: t("home.slide2Title"),
      copy: t("home.slide2Copy"),
      image: plumberImage,
      to: "/jobs",
      action: t("home.slide2Action"),
    },
    {
      tag: t("home.slide3Tag"),
      title: t("home.slide3Title"),
      copy: t("home.slide3Copy"),
      image: driverImage,
      to: "/how-it-works",
      action: t("home.slide3Action"),
    },
  ];

  const trustItems = [
    [ShieldCheck, t("home.trustIdentity"), t("home.trustIdentityCopy")],
    [MessageCircle, t("home.trustConversations"), t("home.trustConversationsCopy")],
    [CreditCard, t("home.trustPayments"), t("home.trustPaymentsCopy")],
  ];

  const steps = [
    ["01", t("home.step1Title"), t("home.step1Copy")],
    ["02", t("home.step2Title"), t("home.step2Copy")],
    ["03", t("home.step3Title"), t("home.step3Copy")],
  ];

  useEffect(() => {
    const timer = window.setInterval(
      () => setActiveSlide((current) => (current + 1) % slides.length),
      6000,
    );
    return () => window.clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider)
      slider.scrollTo({
        left: slider.clientWidth * activeSlide,
        behavior: "smooth",
      });
  }, [activeSlide]);

  return (
    <div className="min-w-0 overflow-hidden bg-slate-50 pb-24 text-slate-900 font-sans selection:bg-[#0066FF]/20 selection:text-[#0066FF]">
      {/* ── Hero Section ── */}
      <section className="relative min-h-[95vh] overflow-hidden bg-[#011F50] text-white flex flex-col justify-center pt-20">
        {/* Abstract Background Elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] h-[50vw] w-[50vw] rounded-full bg-gradient-to-br from-[#0066FF]/30 to-purple-600/30 blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute top-[20%] -right-[10%] h-[40vw] w-[40vw] rounded-full bg-gradient-to-tl from-[#00b3ff]/20 to-teal-400/20 blur-[120px] animate-pulse" style={{ animationDuration: '12s' }} />
          <div className="absolute -bottom-[20%] left-[20%] h-[60vw] w-[60vw] rounded-full bg-gradient-to-tr from-[#0066FF]/10 to-transparent blur-[80px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
        </div>

        <div className="relative mx-auto w-full max-w-[90rem] px-6 sm:px-8 lg:px-12 z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md mb-8 transition-transform hover:scale-105 cursor-default shadow-xl shadow-black/10">
            <span className="flex h-2 w-2 rounded-full bg-[#00b3ff] animate-ping" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/90">
              {t("home.heroTag")}
            </span>
          </div>
          
          <h1 className="max-w-5xl text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl lg:text-[5.5rem] bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/60 drop-shadow-sm">
            {t("home.heroTitle")}
          </h1>
          
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-xl font-medium">
            {t("home.heroSubtitle")}
          </p>
          
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row w-full sm:w-auto">
            <Link
              className="group relative flex w-full sm:w-auto items-center justify-center gap-3 overflow-hidden rounded-full bg-white px-8 py-4 text-sm font-bold text-[#011F50] shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] active:scale-95"
              to="/services"
            >
              <span className="relative z-10">{t("home.heroCta1")}</span>
              <ArrowRight className="h-4 w-4 relative z-10 transition-transform group-hover:translate-x-1" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-100 to-white opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
            <Link
              className="group flex w-full sm:w-auto items-center justify-center gap-3 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-bold text-white backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/40 active:scale-95"
              to="/jobs"
            >
              <span>{t("home.heroCta2")}</span>
            </Link>
          </div>

          {/* Quick stats floating bar */}
          <div className="mt-20 hidden md:flex items-center justify-center gap-8 rounded-full border border-white/10 bg-white/5 px-10 py-5 backdrop-blur-xl shadow-2xl">
            {[
              ["01", t("home.featureVerified"), ShieldCheck],
              ["02", t("home.featureCommunication"), MessageCircle],
              ["03", t("home.featurePayments"), CreditCard],
            ].map(([number, label, Icon]) => (
              <div key={number} className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0066FF]/20 text-[#00b3ff]">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <span className="block text-xs font-bold text-[#00b3ff]">{number}</span>
                  <span className="block text-sm font-bold text-white">{label}</span>
                </div>
                {number !== "03" && <div className="h-8 w-px bg-white/10 ml-8" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Carousel Section ── */}
      <section className="relative -mt-16 z-20 mx-auto w-full max-w-[90rem] px-5 sm:px-8 lg:px-12">
        <div className="min-w-0 overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/40 shadow-[0_20px_80px_-15px_rgba(0,0,0,0.1)] backdrop-blur-3xl">
          <div
            ref={sliderRef}
            className="flex min-w-0 snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {slides.map((slide) => (
              <article
                key={slide.title}
                className="relative min-w-0 basis-full flex-none snap-start overflow-hidden group"
              >
                <div className="grid min-h-[30rem] lg:min-h-[38rem] lg:grid-cols-[1.2fr_1fr]">
                  <div className="relative order-2 lg:order-1 overflow-hidden">
                    <img
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      src={slide.image}
                      alt=""
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent lg:block hidden" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:hidden block" />
                  </div>
                  <div className="order-1 flex flex-col justify-center p-8 sm:p-12 lg:order-2 lg:p-20 relative z-10 bg-white lg:bg-transparent">
                    <span className="inline-flex w-fit items-center rounded-full bg-[#0066FF]/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#0066FF]">
                      {slide.tag}
                    </span>
                    <h2 className="mt-6 max-w-xl text-3xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl drop-shadow-sm">
                      {slide.title}
                    </h2>
                    <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600 font-medium">
                      {slide.copy}
                    </p>
                    <Link
                      className="mt-10 inline-flex w-fit items-center gap-3 rounded-full bg-[#011F50] px-8 py-4 text-sm font-bold text-white shadow-xl shadow-[#011F50]/20 transition-all hover:scale-105 hover:bg-[#0066FF] hover:shadow-[#0066FF]/30 active:scale-95"
                      to={slide.to}
                    >
                      {slide.action} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-slate-200/50 bg-white/50 px-8 py-5 backdrop-blur-md">
            <div className="flex gap-3">
              {slides.map((slide, index) => (
                <button
                  key={slide.title}
                  type="button"
                  aria-label={`Show slide ${index + 1}`}
                  aria-pressed={activeSlide === index}
                  onClick={() => setActiveSlide(index)}
                  className={`h-2.5 rounded-full transition-all duration-500 ${activeSlide === index ? "w-10 bg-[#0066FF]" : "w-2.5 bg-slate-300 hover:bg-slate-400"}`}
                />
              ))}
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              {t("home.swipeOrClick")}
            </span>
          </div>
        </div>
      </section>

      {/* ── Steps Section ── */}
      <section className="mx-auto mt-32 grid w-full max-w-[90rem] gap-16 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-12 items-center">
        <div className="relative">
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[#00b3ff]/10 blur-3xl" />
          <span className="inline-flex w-fit items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-slate-500">
            {t("home.simpleByDesign")}
          </span>
          <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.1]">
            {t("home.stepsTitle")}
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-slate-600 font-medium">
            {t("home.stepsCopy")}
          </p>
          <Link
            className="mt-8 inline-flex items-center gap-2 font-bold text-[#0066FF] hover:text-[#011F50] transition-colors group text-lg"
            to="/how-it-works"
          >
            {t("home.learnProcess")} <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="grid gap-6 relative">
          <div className="absolute -right-10 -bottom-10 h-60 w-60 rounded-full bg-[#0066FF]/5 blur-3xl" />
          {steps.map(([number, title, copy], i) => (
            <article
              key={number}
              className={`group flex items-start gap-6 rounded-[2rem] border border-slate-200/60 bg-white/80 backdrop-blur-xl p-8 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#0066FF]/5 relative overflow-hidden`}
              style={{ transform: `translateY(${i * 10}px)` }}
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#00b3ff] to-[#0066FF] opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-xl font-extrabold text-[#0066FF] shadow-inner group-hover:bg-[#0066FF] group-hover:text-white transition-colors duration-300">
                {number}
              </span>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{title}</h3>
                <p className="mt-3 text-base leading-relaxed text-slate-600 font-medium">{copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── CTA Sections ── */}
      <section className="mx-auto mt-40 w-full max-w-[90rem] px-5 sm:px-8 lg:px-12">
        <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-teal-50 to-emerald-50 p-10 sm:p-14 lg:flex lg:items-center lg:justify-between lg:p-20 shadow-xl shadow-teal-900/5 border border-teal-100">
          <div className="absolute top-0 right-0 h-full w-1/2 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-200/40 via-transparent to-transparent opacity-60" />
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex w-fit items-center rounded-full bg-teal-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-teal-800">
              {t("home.ctaTag")}
            </span>
            <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              {t("home.ctaTitle")}
            </h2>
            <p className="mt-4 text-lg text-slate-600 font-medium">
              {loading
                ? t("home.ctaLoadingProviders")
                : t("home.ctaProvidersCount", { count: providers.length })}
            </p>
          </div>
          <Link
            className="relative z-10 mt-8 inline-flex items-center justify-center gap-3 rounded-full bg-teal-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-teal-600/30 transition-all hover:scale-105 hover:bg-teal-700 active:scale-95 lg:mt-0 whitespace-nowrap"
            to="/services"
          >
            {t("home.ctaViewProviders")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-16 w-full max-w-[90rem] px-5 sm:px-8 lg:px-12 mb-20">
        <div className="relative overflow-hidden rounded-[3rem] bg-[#011F50] px-10 py-16 sm:p-20 text-white shadow-2xl shadow-[#011F50]/40 flex flex-col items-center text-center">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[80%] w-[80%] rounded-full bg-[#0066FF]/20 blur-[100px] pointer-events-none" />
          
          <div className="relative z-10">
            <p className="text-sm font-bold uppercase tracking-widest text-[#00b3ff]">
              {t("home.ctaReadyTag")}
            </p>
            <h2 className="mt-6 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl leading-[1.1]">
              {t("home.ctaReadyTitle")}
            </h2>
            <p className="mt-6 text-lg text-slate-300 font-medium max-w-xl mx-auto">
              {t("home.ctaReadyCopy")}
            </p>
            <Link
              className="mt-10 inline-flex items-center justify-center gap-3 rounded-full bg-white px-10 py-4 text-base font-bold text-[#011F50] shadow-xl shadow-white/10 transition-all hover:scale-105 hover:bg-slate-50 active:scale-95"
              to="/register"
            >
              {t("home.ctaGetStarted")} <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
