import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "../components/ui/Icons.jsx";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";

/**
 * ARCHITECTURAL INTENT:
 * SectionPage is a generic informational page shell used for FAQ, Privacy and
 * Terms routes. It receives i18n *keys* (`titleKey`, `descKey`) from the router
 * and resolves them itself.
 *
 * NOTE: "About" and "How It Works" now have dedicated pages (AboutPage /
 * HowItWorksPage). This component previously read `title`/`description` props
 * while the router passed `titleKey`/`descKey`, so every route fell into the
 * same branch and rendered identical content - that mismatch is fixed here.
 */
function SectionPage({ titleKey, descKey }) {
  const { t } = useTranslation();
  const title = t(titleKey);
  const description = t(descKey);
  useDocumentTitle(title);

  return (
    <div className="relative overflow-hidden">
      <section className="relative isolate overflow-hidden bg-[#011F50] pb-24 pt-16 text-white sm:pb-32 sm:pt-24">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#0066FF]/40 blur-[110px]" />
          <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-[#00d4a0]/25 blur-[110px]" />
        </div>
        <div className="mx-auto max-w-4xl px-6 text-center sm:px-8">
          <h1 className="animate-slide-up text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            {title}
          </h1>
          <p className="animate-slide-up mx-auto mt-6 max-w-2xl text-base font-medium leading-relaxed text-white/70 [animation-delay:120ms] sm:text-lg">
            {description}
          </p>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-12 max-w-3xl px-5 pb-8 sm:px-8">
        <div className="rounded-3xl border border-slate-200/70 bg-white p-8 text-center shadow-[0_20px_60px_-20px_rgba(1,31,80,0.2)] sm:p-12">
          <p className="text-slate-600">
            This section is being prepared. In the meantime, learn how Nirbhor
            works or get in touch with our team.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 rounded-full bg-[#011F50] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#0066FF]"
            >
              {t("nav.howItWorks", "How It Works")}{" "}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/about#contact"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-7 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              {t("about.contact", "Contact")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SectionPage;
