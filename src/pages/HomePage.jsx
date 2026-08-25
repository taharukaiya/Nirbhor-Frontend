import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
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

const slides = [
  {
    tag: "For every home",
    title: "Find skilled help without the guesswork.",
    copy: "Discover verified professionals for repairs, care, transport, and everyday work.",
    image: electricianImage,
    to: "/services",
    action: "Browse services",
  },
  {
    tag: "For trusted professionals",
    title: "Turn your expertise into your next opportunity.",
    copy: "Build a credible profile, respond to real jobs, and grow through work done well.",
    image: plumberImage,
    to: "/jobs",
    action: "Find jobs",
  },
  {
    tag: "Built for confidence",
    title: "Every job starts with a clearer conversation.",
    copy: "Compare proposals, keep communication job-specific, and move forward with confidence.",
    image: driverImage,
    to: "/how-it-works",
    action: "See how it works",
  },
];

const trustItems = [
  [
    ShieldCheck,
    "Identity checked",
    "Profiles built around verification and accountability.",
  ],
  [
    MessageCircle,
    "Focused conversations",
    "Keep every question and decision tied to the job.",
  ],
  [
    CreditCard,
    "Protected payments",
    "A clearer payment flow from agreement to completion.",
  ],
];

const steps = [
  [
    "01",
    "Create your profile",
    "Tell the marketplace what you need or what you do best.",
  ],
  [
    "02",
    "Find your match",
    "Search live services or explore jobs that fit your skills.",
  ],
  [
    "03",
    "Work with clarity",
    "Agree on scope, communicate securely, and finish with confidence.",
  ],
];

function HomePage() {
  const { data: providers, loading } = useRemoteList(getServices);
  const [activeSlide, setActiveSlide] = useState(0);
  const sliderRef = useRef(null);

  useEffect(() => {
    const timer = window.setInterval(
      () => setActiveSlide((current) => (current + 1) % slides.length),
      6000,
    );
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider)
      slider.scrollTo({
        left: slider.clientWidth * activeSlide,
        behavior: "smooth",
      });
  }, [activeSlide]);

  return (
    <div className="min-w-0 overflow-hidden bg-[#f7f9fc] pb-20 text-[#10213f]">
      <section className="relative overflow-hidden bg-[#071f49] text-white">
        <div className="pointer-events-none absolute -right-32 top-8 h-96 w-96 rounded-full bg-[#2e7df6]/20 blur-3xl" />
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-10 pt-16 sm:px-8 lg:px-12 lg:pb-16 lg:pt-24">
          <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white/80">
                Nirbhor marketplace
              </span>
              <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                Good work starts with trust.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
                A dependable place to hire verified service providers, find
                meaningful jobs, and keep every step clear.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2e7df6] px-6 py-3.5 text-sm font-bold transition hover:bg-white hover:text-[#071f49]"
                  to="/services"
                >
                  Find a service <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white hover:text-[#071f49]"
                  to="/jobs"
                >
                  Explore jobs
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                ["01", "Verified"],
                ["02", "Clear"],
                ["03", "Protected"],
              ].map(([number, label]) => (
                <div
                  key={number}
                  className="rounded-2xl border border-white/10 bg-white/10 px-3 py-4 text-center backdrop-blur sm:px-5"
                >
                  <span className="text-xs font-bold text-[#8eb7ff]">
                    {number}
                  </span>
                  <p className="mt-2 text-xs font-semibold sm:text-sm">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-14 min-w-0 overflow-hidden rounded-[2rem] border border-white/15 bg-white/5 shadow-2xl">
            <div
              ref={sliderRef}
              className="flex min-w-0 snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {slides.map((slide) => (
                <article
                  key={slide.title}
                  className="relative min-w-0 basis-full flex-none snap-start overflow-hidden"
                >
                  <div className="grid min-h-[25rem] lg:min-h-[30rem] lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="relative order-2 min-h-64 lg:order-1">
                      <img
                        className="absolute inset-0 h-full w-full object-cover"
                        src={slide.image}
                        alt=""
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#071f49]/50 to-transparent" />
                    </div>
                    <div className="order-1 flex flex-col justify-center p-7 sm:p-12 lg:order-2 lg:p-16">
                      <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#8eb7ff]">
                        {slide.tag}
                      </span>
                      <h2 className="mt-4 max-w-xl text-3xl font-bold leading-tight sm:text-4xl">
                        {slide.title}
                      </h2>
                      <p className="mt-4 max-w-lg leading-7 text-white/65">
                        {slide.copy}
                      </p>
                      <Link
                        className="mt-7 inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#071f49] transition hover:bg-[#8ee0ba]"
                        to={slide.to}
                      >
                        {slide.action} <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-white/10 px-6 py-4">
              <div className="flex gap-2">
                {slides.map((slide, index) => (
                  <button
                    key={slide.title}
                    type="button"
                    aria-label={`Show slide ${index + 1}`}
                    aria-pressed={activeSlide === index}
                    onClick={() => setActiveSlide(index)}
                    className={`h-2 rounded-full transition-all ${activeSlide === index ? "w-8 bg-[#8ee0ba]" : "w-2 bg-white/30"}`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-white/50">
                Swipe to explore
              </span>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto grid w-full max-w-7xl gap-4 px-5 pt-8 sm:grid-cols-3 sm:px-8 lg:px-12">
        {trustItems.map(([Icon, title, copy]) => (
          <article
            key={title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <Icon className="h-5 w-5 text-[#2e7df6]" />
            <h2 className="mt-4 font-bold text-[#071f49]">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{copy}</p>
          </article>
        ))}
      </section>
      <section className="mx-auto grid w-full max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-12">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#2e7df6]">
            Simple by design
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#071f49] sm:text-5xl">
            From first search to finished work.
          </h2>
          <p className="mt-5 max-w-md leading-7 text-slate-500">
            Nirbhor gives both sides the structure to make better decisions and
            build a record of good work.
          </p>
          <Link
            className="mt-7 inline-flex items-center gap-2 font-bold text-[#2e7df6]"
            to="/how-it-works"
          >
            Learn the process <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4">
          {steps.map(([number, title, copy]) => (
            <article
              key={number}
              className="flex gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e9f1ff] text-sm font-bold text-[#2e7df6]">
                {number}
              </span>
              <div>
                <h3 className="font-bold text-[#071f49]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="rounded-[2rem] bg-[#eaf7f0] p-7 sm:p-10 lg:flex lg:items-center lg:justify-between lg:p-14">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#138a59]">
              Live marketplace
            </span>
            <h2 className="mt-4 text-3xl font-bold text-[#071f49]">
              Meet the professionals behind the work.
            </h2>
            <p className="mt-3 text-slate-600">
              {loading
                ? "Loading verified profiles..."
                : `${providers.length} verified profiles available through the marketplace.`}
            </p>
          </div>
          <Link
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#071f49] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#2e7df6] lg:mt-0"
            to="/services"
          >
            View providers <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
      <section className="mx-auto mt-20 w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="rounded-[2rem] bg-[#071f49] px-7 py-12 text-white sm:px-12 lg:flex lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold text-[#8ee0ba]">
              Ready when you are
            </p>
            <h2 className="mt-3 max-w-xl text-3xl font-bold sm:text-4xl">
              Make your next job a better one.
            </h2>
          </div>
          <Link
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#8ee0ba] px-5 py-3 text-sm font-bold text-[#071f49] transition hover:bg-white lg:mt-0"
            to="/register"
          >
            Get started <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
