import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo2 from "../assets/logo2.png";

const socialLinks = [
  {
    label: "Facebook",
    href: "https://facebook.com/nirbhor",
    icon: (
      <svg
        className="h-4 w-4"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/nirbhor",
    icon: (
      <svg
        className="h-4 w-4"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Twitter / X",
    href: "https://twitter.com/nirbhor",
    icon: (
      <svg
        className="h-4 w-4"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const platformLinks = [
    { label: t("footer.findServices"), to: "/services" },
    { label: t("footer.findJobs"), to: "/jobs" },
    { label: t("footer.howItWorks"), to: "/how-it-works" },
  ];
  const companyLinks = [
    { label: t("footer.about"), to: "/about" },
    { label: t("footer.faq"), to: "/faq" },
  ];
  const legalLinks = [
    { label: t("footer.privacyPolicy"), to: "/privacy" },
    { label: t("footer.termsConditions"), to: "/terms" },
  ];

  return (
    <footer className="mt-16 bg-[#011F50]">
      <div className="mx-auto w-11/12 py-14 lg:w-10/12">
        {/* Top grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.7fr_0.7fr_0.7fr]">
          {/* Brand column */}
          <section className="space-y-5">
            <Link to="/" aria-label="Nirbhor homepage" className="inline-flex">
              <img
                alt="Nirbhor"
                className="h-14 w-auto object-contain sm:h-16"
                src={logo2}
              />
            </Link>
            <p className="max-w-sm text-sm leading-7 text-white/65">
              {t("footer.description")}
            </p>

            {/* Social links */}
            <div className="flex items-center gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/60 transition-all duration-150 hover:border-white/40 hover:bg-white/10 hover:text-white"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </section>

          {/* Link columns */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">{t("footer.platform")}</h2>
            <ul className="mt-4 space-y-3">
              {platformLinks.map((link) => (
                <li key={link.to}>
                  <Link className="text-sm text-white/70 transition-colors duration-150 hover:text-white" to={link.to}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">{t("footer.company")}</h2>
            <ul className="mt-4 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.to}>
                  <Link className="text-sm text-white/70 transition-colors duration-150 hover:text-white" to={link.to}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">{t("footer.legal")}</h2>
            <ul className="mt-4 space-y-3">
              {legalLinks.map((link) => (
                <li key={link.to}>
                  <Link className="text-sm text-white/70 transition-colors duration-150 hover:text-white" to={link.to}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Newsletter */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 px-6 py-6 sm:flex sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">
              {t("footer.newsletter")}
            </h3>
            <p className="mt-1 text-sm text-white/60">
              {t("footer.newsletterCopy")}
            </p>
          </div>
          <form
            className="mt-4 flex gap-2 sm:mt-0 sm:shrink-0"
            onSubmit={(e) => e.preventDefault()}
          >
            <label className="sr-only" htmlFor="newsletter-email">
              {t("footer.emailPlaceholder")}
            </label>
            <input
              id="newsletter-email"
              className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] sm:w-64"
              placeholder={t("footer.emailPlaceholder")}
              type="email"
              autoComplete="email"
            />
            <button
              className="rounded-xl bg-[#0066FF] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#011F50] shrink-0"
              type="submit"
            >
              {t("footer.subscribe")}
            </button>
          </form>
        </div>

        {/* Divider + copyright */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-8 text-xs text-white/40 sm:flex-row">
          <p>{t("footer.copyright", { year: currentYear })}</p>
          <p>{t("footer.builtWith")}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
