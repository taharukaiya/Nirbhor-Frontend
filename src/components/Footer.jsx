import { Link } from "react-router-dom";
import logo2 from "../assets/logo2.png";

const platformLinks = [
  { label: "Find Services", to: "/services" },
  { label: "Find Jobs", to: "/jobs" },
  { label: "How It Works", to: "/how-it-works" },
];

const companyLinks = [
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "FAQ", to: "/faq" },
];

const legalLinks = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms & Conditions", to: "/terms" },
];

function Footer() {
  return (
    <footer className="mt-16 bg-[#011F50] text-white">
      <div className="mx-auto w-11/12 py-14 lg:w-10/12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <section className="space-y-5">
            <Link to="/" className="inline-flex items-center">
              <img
                alt="Nirbhor"
                className="h-16 w-auto object-contain sm:h-20"
                src={logo2}
              />
            </Link>
            <p className="max-w-sm text-sm leading-7 text-white/75">
              Nirbhor is a trusted marketplace connecting verified Hirers and
              verified Service Providers through secure jobs, proposals, chat,
              and payments.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/90">
              Platform
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-white/75">
              {platformLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    className="transition-colors hover:text-white"
                    to={link.to}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/90">
              Company
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-white/75">
              {companyLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    className="transition-colors hover:text-white"
                    to={link.to}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/90">
              Legal
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-white/75">
              {legalLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    className="transition-colors hover:text-white"
                    to={link.to}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
