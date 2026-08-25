import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import electricianImage from "../assets/worker-slider/electrician.jpg";
import driverImage from "../assets/worker-slider/driver.avif";
import maidImage from "../assets/worker-slider/maid.jpg";
import plumberImage from "../assets/worker-slider/plumber.jpg";

const heroSlides = [
  {
    eyebrow: "Verified marketplace",
    title: "Find trusted people for the work that matters.",
    description:
      "Hire verified Service Providers or post a job as a verified Hirer. Every conversation stays job-specific, every payment stays protected.",
    primaryCta: "Find a Service",
    primaryTo: "/services",
    secondaryCta: "Find Jobs",
    secondaryTo: "/jobs",
    metricLabel: "Verified users",
    metricValue: "100%",
    image: electricianImage,
  },
  {
    eyebrow: "Popular service",
    title: "Electricians ready for fast, safe, and reliable work.",
    description:
      "Browse trusted electricians for wiring, installations, maintenance, and repairs with proposal-based hiring.",
    primaryCta: "Explore Electricians",
    primaryTo: "/services",
    secondaryCta: "Post a Job",
    secondaryTo: "/jobs/create",
    metricLabel: "Average rating",
    metricValue: "4.9",
    image: plumberImage,
  },
  {
    eyebrow: "Fast home help",
    title: "Plumbers for urgent fixes and planned installations.",
    description:
      "Connect with plumbers for leak repairs, fittings, kitchen work, and complete bathroom solutions.",
    primaryCta: "Browse Plumbers",
    primaryTo: "/services",
    secondaryCta: "How It Works",
    secondaryTo: "/how-it-works",
    metricLabel: "Completed jobs",
    metricValue: "5k+",
    image: maidImage,
  },
  {
    eyebrow: "Reliable support",
    title: "Cleaners and drivers for everyday convenience.",
    description:
      "Find dependable help for homes, offices, and transportation with a professional marketplace experience.",
    primaryCta: "Explore Services",
    primaryTo: "/services",
    secondaryCta: "Get Started",
    secondaryTo: "/register",
    metricLabel: "Trust score",
    metricValue: "98%",
    image: driverImage,
  },
];

const trustIndicators = [
  ["Verified Users", "Identity checked with NID"],
  ["Secure Payments", "SSLCommerz sandbox ready"],
  ["Secure Job Chat", "Job-based communication only"],
  ["Trusted Reviews", "Independent role ratings"],
];

const popularServices = [
  ["Electrician", "Fast help for wiring, repair, and installations."],
  ["Plumber", "Leak fixes, fittings, and emergency plumbing support."],
  ["Cleaner", "Reliable home and office cleaning services."],
  ["Driver", "Verified drivers for personal or business needs."],
  ["Carpenter", "Furniture, repair, and custom woodwork support."],
  ["Mechanic", "Maintenance and repair for vehicles and machines."],
];

const workSteps = [
  ["01", "Verify", "Create a trusted account with NID verification."],
  ["02", "Post / Find", "Publish jobs or browse services and providers."],
  ["03", "Connect", "Use job-specific chat to compare proposals safely."],
  ["04", "Complete", "Pay securely, finish the work, and leave reviews."],
];

const featuredProviders = [
  ["Rahim Uddin", "Electrician", "Dhaka", "4.9", "120"],
  ["Karim Hasan", "Plumber", "Chattogram", "4.8", "98"],
  ["Sadia Akter", "Cleaner", "Dhaka", "4.9", "76"],
];

function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef(null);
  const slideRefs = useRef([]);

  useEffect(() => {
    const carouselElement = carouselRef.current;

    if (!carouselElement) {
      return undefined;
    }

    let animationFrameId = 0;

    const handleScroll = () => {
      window.cancelAnimationFrame(animationFrameId);

      animationFrameId = window.requestAnimationFrame(() => {
        const slideWidth = carouselElement.clientWidth;

        if (!slideWidth) {
          return;
        }

        const nextIndex = Math.round(carouselElement.scrollLeft / slideWidth);

        setActiveSlide(Math.max(0, Math.min(heroSlides.length - 1, nextIndex)));
      });
    };

    carouselElement.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      carouselElement.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSlide = (slideIndex) => {
    slideRefs.current[slideIndex]?.scrollIntoView({
      behavior: "smooth",
      inline: "start",
      block: "nearest",
    });
  };

  const previousSlide = () => {
    const nextIndex = (activeSlide - 1 + heroSlides.length) % heroSlides.length;
    scrollToSlide(nextIndex);
  };

  const nextSlide = () => {
    const nextIndex = (activeSlide + 1) % heroSlides.length;
    scrollToSlide(nextIndex);
  };

  return (
    <div className="pb-12">
      <section className="relative overflow-hidden bg-[#011F50] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.16),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(0,102,255,0.2),_transparent_30%)]" />
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-[#0066FF]/20 blur-3xl" />
        <div className="absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-[#00C853]/10 blur-3xl" />

        <div className="relative mx-auto w-11/12 py-8 lg:w-10/12 lg:py-12">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur">
                Verified marketplace for trusted services
              </span>
              <h1 className="text-4xl font-bold leading-tight md:text-5xl xl:text-6xl">
                A cleaner, safer way to hire and work.
              </h1>
              <p className="max-w-xl text-base leading-7 text-white/75 md:text-lg">
                Nirbhor connects verified Hirers and verified Service Providers
                through secure jobs, proposal-based hiring, job-specific chat,
                and protected payments.
              </p>
            </div>

            <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur sm:grid-cols-3 lg:min-w-[30rem]">
              {[
                ["NID", "Verified"],
                ["Chat", "Job-based"],
                ["Pay", "Escrowed"],
              ].map(([label, value]) => (
                <article
                  key={label}
                  className="rounded-2xl bg-white/10 px-4 py-3 text-center"
                >
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                    {label}
                  </div>
                  <div className="mt-1 text-lg font-bold text-white">
                    {value}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl backdrop-blur">
            <div
              ref={carouselRef}
              className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {heroSlides.map((slide, slideIndex) => (
                <article
                  key={slide.title}
                  ref={(element) => {
                    slideRefs.current[slideIndex] = element;
                  }}
                  className="relative min-h-[540px] w-full flex-none snap-center overflow-hidden sm:min-h-[620px]"
                >
                  <img
                    alt={slide.title}
                    className="absolute inset-0 h-full w-full object-cover"
                    src={slide.image}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(1,31,80,0.08)_0%,rgba(1,31,80,0.5)_40%,rgba(1,31,80,0.92)_100%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_28%)]" />

                  <div className="relative flex h-full min-h-[540px] flex-col justify-end p-6 sm:p-8 lg:min-h-[620px] lg:p-12">
                    <div className="max-w-2xl space-y-5">
                      <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/90 backdrop-blur">
                        {slide.eyebrow}
                      </span>
                      <div className="space-y-4">
                        <h2 className="max-w-2xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                          {slide.title}
                        </h2>
                        <p className="max-w-xl text-sm leading-7 text-white/80 sm:text-base lg:text-lg">
                          {slide.description}
                        </p>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row">
                        <Link
                          className="rounded-full bg-[#0066FF] px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#011F50]"
                          to={slide.primaryTo}
                        >
                          {slide.primaryCta}
                        </Link>
                        <Link
                          className="rounded-full border border-white/30 px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#011F50]"
                          to={slide.secondaryTo}
                        >
                          {slide.secondaryCta}
                        </Link>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 pt-2 text-sm text-white/80">
                        <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">
                          {slide.metricLabel}: {slide.metricValue}
                        </span>
                        <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">
                          Secure job chat
                        </span>
                        <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">
                          5% commission model
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="flex flex-col gap-4 border-t border-white/10 bg-[#011F50]/90 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div className="flex items-center gap-2">
                {heroSlides.map((slide, slideIndex) => (
                  <button
                    key={slide.title}
                    className={`h-2.5 rounded-full transition-all duration-200 ${
                      slideIndex === activeSlide
                        ? "w-10 bg-white"
                        : "w-2.5 bg-white/35"
                    }`}
                    type="button"
                    onClick={() => scrollToSlide(slideIndex)}
                    aria-label={`View ${slide.title}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#011F50]"
                  type="button"
                  onClick={previousSlide}
                >
                  Prev
                </button>
                <button
                  className="rounded-full border border-white/20 bg-white px-4 py-2 text-sm font-semibold text-[#011F50] transition-colors hover:bg-[#00C853] hover:text-white"
                  type="button"
                  onClick={nextSlide}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 w-11/12 rounded-[2rem] bg-white px-6 py-8 shadow-sm ring-1 ring-slate-200 lg:w-10/12 lg:px-10 lg:py-10">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-4">
            <span className="inline-flex rounded-full bg-[#0066FF]/10 px-4 py-2 text-sm font-semibold text-[#0066FF]">
              Smart search
            </span>
            <h2 className="text-3xl font-bold text-[#011F50]">
              Search services in a cleaner, faster way.
            </h2>
            <p className="max-w-xl text-slate-600">
              Use service, location, and budget filters to find the right
              verified provider without noise.
            </p>
          </div>

          <div className="grid gap-3 rounded-[1.5rem] bg-slate-50 p-4 sm:grid-cols-[1.2fr_0.8fr_0.55fr]">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                What service do you need?
              </span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-[#0066FF]"
                placeholder="Search for a service"
                type="text"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Location
              </span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-[#0066FF]"
                placeholder="Dhaka"
                type="text"
              />
            </label>
            <Link
              className="flex items-center justify-center rounded-2xl bg-[#0066FF] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#011F50]"
              to="/services"
            >
              Search
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 w-11/12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4 lg:w-10/12">
        {trustIndicators.map(([title, description]) => (
          <article
            key={title}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <h3 className="text-base font-semibold text-[#011F50]">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {description}
            </p>
          </article>
        ))}
      </section>

      <section className="mx-auto mt-10 w-11/12 rounded-[2rem] bg-[#011F50] px-6 py-8 text-white lg:w-10/12 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="space-y-4">
            <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/85">
              Popular services
            </span>
            <h2 className="text-3xl font-bold">
              Find the right service quickly.
            </h2>
            <p className="max-w-lg text-white/75">
              Browse the most requested service categories and connect with the
              right verified provider for your need.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {popularServices.map(([title, description]) => (
              <article
                key={title}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 transition-transform duration-200 hover:-translate-y-1"
              >
                <h3 className="text-base font-semibold">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-white/75">
                  {description}
                </p>
                <Link
                  className="mt-4 inline-flex text-sm font-semibold text-[#00C853] transition-colors hover:text-white"
                  to="/services"
                >
                  View service
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 w-11/12 rounded-[2rem] bg-white px-6 py-8 shadow-sm ring-1 ring-slate-200 lg:w-10/12 lg:px-10 lg:py-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-[#0066FF]/10 px-4 py-2 text-sm font-semibold text-[#0066FF]">
              How Nirbhor Works
            </span>
            <h2 className="mt-4 text-3xl font-bold text-[#011F50]">
              A simple, trust-first workflow.
            </h2>
          </div>
          <Link
            className="text-sm font-semibold text-[#0066FF] transition-colors hover:text-[#011F50]"
            to="/how-it-works"
          >
            Learn more
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {workSteps.map(([stepNumber, title, description]) => (
            <article
              key={stepNumber}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-5 transition-shadow duration-200 hover:shadow-md"
            >
              <span className="text-sm font-semibold tracking-[0.2em] text-[#00C853]">
                {stepNumber}
              </span>
              <h3 className="mt-3 text-xl font-semibold text-[#011F50]">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-10 w-11/12 grid gap-6 rounded-[2rem] bg-slate-50 px-6 py-8 lg:w-10/12 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
        <div>
          <span className="inline-flex rounded-full bg-[#00C853]/10 px-4 py-2 text-sm font-semibold text-[#00C853]">
            Featured providers
          </span>
          <h2 className="mt-4 text-3xl font-bold text-[#011F50]">
            Meet top verified professionals.
          </h2>
          <p className="mt-3 max-w-xl text-slate-600">
            Highlight trusted providers with strong ratings, completed jobs, and
            NID verification badges.
          </p>
        </div>

        <div className="grid gap-4">
          {featuredProviders.map(
            ([name, category, location, rating, completedJobs]) => (
              <article
                key={name}
                className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div>
                  <h3 className="text-lg font-semibold text-[#011F50]">
                    {name}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {category} · {location}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    {completedJobs} completed jobs
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-[#00C853]">
                    NID Verified
                  </div>
                  <div className="mt-1 text-lg font-bold text-[#0066FF]">
                    {rating} ★
                  </div>
                </div>
              </article>
            ),
          )}
        </div>
      </section>

      <section className="mx-auto mt-10 w-11/12 rounded-[2rem] bg-[#011F50] px-6 py-10 text-white lg:w-10/12 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-4">
            <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/85">
              Ready to get started?
            </span>
            <h2 className="text-3xl font-bold md:text-4xl">
              Post a job or start offering services today.
            </h2>
            <p className="max-w-xl text-white/75">
              Join a marketplace built around trust, verification, and secure
              work flow.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Link
              className="rounded-full bg-white px-6 py-3 text-center text-sm font-semibold text-[#011F50] transition-colors hover:bg-slate-100"
              to="/services"
            >
              Find a Service
            </Link>
            <Link
              className="rounded-full border border-white/30 px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#011F50]"
              to="/register"
            >
              Become a Service Provider
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
