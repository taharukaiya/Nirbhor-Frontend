import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle,
  MessageCircle,
  ShieldCheck,
} from "../components/ui/Icons.jsx";

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
  const isAbout = title === "About Nirbhor";

  return (
    <div className="min-w-0 overflow-hidden bg-[#f7f9fc] py-12 text-[#10213f] sm:py-16">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        <section className="relative overflow-hidden rounded-[2rem] bg-[#071f49] px-7 py-12 text-white sm:px-12 sm:py-16 lg:px-20 lg:py-20">
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#2e7df6]/25 blur-3xl" />
          <div className="relative max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8ee0ba]">
              {isAbout ? "The Nirbhor standard" : "A clearer way forward"}
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
              {isAbout ? "Talk to our team" : "Start exploring"}
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
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <Icon className="h-6 w-6 text-[#2e7df6]" />
                  <h2 className="mt-5 font-bold text-[#071f49]">{heading}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {copy}
                  </p>
                </article>
              ))}
            </section>
            <section
              id="contact"
              className="mt-16 grid gap-10 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm sm:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:p-14"
            >
              <div>
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
                className="grid gap-4"
                onSubmit={(event) => event.preventDefault()}
              >
                <label className="grid gap-2 text-sm font-semibold text-slate-700">
                  Email address
                  <input
                    className="rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none transition focus:border-[#2e7df6] focus:ring-4 focus:ring-[#2e7df6]/10"
                    type="email"
                    required
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-slate-700">
                  Message
                  <textarea
                    className="min-h-36 rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none transition focus:border-[#2e7df6] focus:ring-4 focus:ring-[#2e7df6]/10"
                    required
                  />
                </label>
                <button
                  className="w-fit rounded-xl bg-[#071f49] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#2e7df6]"
                  type="submit"
                >
                  Send message
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
                  className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <span className="text-sm font-bold text-[#2e7df6]">
                    {number}
                  </span>
                  <h2 className="mt-8 text-xl font-bold text-[#071f49]">
                    {heading}
                  </h2>
                  <p className="mt-3 max-w-sm leading-7 text-slate-500">
                    {copy}
                  </p>
                </article>
              ))}
            </div>
            <div className="mt-10 rounded-2xl bg-[#eaf7f0] p-7 sm:p-10">
              <h2 className="text-2xl font-bold text-[#071f49]">
                Ready to make a start?
              </h2>
              <p className="mt-3 text-slate-600">
                Browse the live marketplace and see what is possible.
              </p>
              <Link
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#071f49] px-5 py-3 text-sm font-bold text-white hover:bg-[#2e7df6]"
                to="/services"
              >
                Browse services <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default SectionPage;
