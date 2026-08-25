/**
 * Icons — lightweight inline SVG icon library.
 * All icons are 24×24 viewBox by default, styled with currentColor.
 * Pass className for size overrides, e.g. className="h-5 w-5"
 */

const defaults = { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };

export function ShieldCheck({ className = "h-5 w-5" }) {
  return (
    <svg {...defaults} className={className} aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

export function CreditCard({ className = "h-5 w-5" }) {
  return (
    <svg {...defaults} className={className} aria-hidden="true">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

export function MessageCircle({ className = "h-5 w-5" }) {
  return (
    <svg {...defaults} className={className} aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export function Star({ className = "h-5 w-5", filled = false }) {
  return (
    <svg {...defaults} className={className} fill={filled ? "currentColor" : "none"} aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export function MapPin({ className = "h-5 w-5" }) {
  return (
    <svg {...defaults} className={className} aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function Search({ className = "h-5 w-5" }) {
  return (
    <svg {...defaults} className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export function Filter({ className = "h-5 w-5" }) {
  return (
    <svg {...defaults} className={className} aria-hidden="true">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

export function X({ className = "h-5 w-5" }) {
  return (
    <svg {...defaults} className={className} aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function ChevronDown({ className = "h-5 w-5" }) {
  return (
    <svg {...defaults} className={className} aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function ArrowRight({ className = "h-5 w-5" }) {
  return (
    <svg {...defaults} className={className} aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export function CheckCircle({ className = "h-5 w-5" }) {
  return (
    <svg {...defaults} className={className} aria-hidden="true">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

export function Clock({ className = "h-5 w-5" }) {
  return (
    <svg {...defaults} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export function Briefcase({ className = "h-5 w-5" }) {
  return (
    <svg {...defaults} className={className} aria-hidden="true">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

export function Zap({ className = "h-5 w-5" }) {
  return (
    <svg {...defaults} className={className} aria-hidden="true">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

export function Droplets({ className = "h-5 w-5" }) {
  return (
    <svg {...defaults} className={className} aria-hidden="true">
      <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" />
      <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97" />
    </svg>
  );
}

export function Wrench({ className = "h-5 w-5" }) {
  return (
    <svg {...defaults} className={className} aria-hidden="true">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

export function Users({ className = "h-5 w-5" }) {
  return (
    <svg {...defaults} className={className} aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function Menu({ className = "h-5 w-5" }) {
  return (
    <svg {...defaults} className={className} aria-hidden="true">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export function SortDesc({ className = "h-5 w-5" }) {
  return (
    <svg {...defaults} className={className} aria-hidden="true">
      <line x1="11" y1="5" x2="17" y2="5" />
      <line x1="11" y1="9" x2="15" y2="9" />
      <line x1="11" y1="13" x2="13" y2="13" />
      <polyline points="7 20 7 4" />
      <polyline points="3 8 7 4 11 8" />
    </svg>
  );
}
