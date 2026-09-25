/**
 * Global Iconography Library
 * 
 * Architectural Intent:
 * A centralized, dependency-free SVG icon system for the frontend.
 * 
 * Rationale:
 * By maintaining our own lightweight, inline SVG functions instead of importing a heavy 
 * icon library bundle (like FontAwesome or full Lucide-React), we significantly reduce 
 * the initial JavaScript payload size.
 * 
 * All icons inherit the `currentColor` stroke, automatically matching their parent's text color.
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

export function AlertCircle({ className = "h-5 w-5" }) {
  return (
    <svg {...defaults} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
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

export function ArrowLeft({ className = "h-5 w-5" }) {
  return (
    <svg {...defaults} className={className} aria-hidden="true">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

export function MessageSquare({ className = "h-5 w-5" }) {
  return (
    <svg {...defaults} className={className} aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export function Send({ className = "h-5 w-5" }) {
  return (
    <svg {...defaults} className={className} aria-hidden="true">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

export function User({ className = "h-5 w-5" }) {
  return (
    <svg {...defaults} className={className} aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export function Plus({ className = "h-5 w-5" }) {
  return (
    <svg {...defaults} className={className} aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export function DollarSign({ className = "h-5 w-5" }) {
  return (
    <svg {...defaults} className={className} aria-hidden="true">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

export function UserCheck({ className = "h-5 w-5" }) {
  return (
    <svg {...defaults} className={className} aria-hidden="true">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <polyline points="17 11 19 13 23 9" />
    </svg>
  );
}

export function Calendar({ className = "h-5 w-5" }) {
  return (
    <svg {...defaults} className={className} aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

export function ChevronRight({ className = "h-5 w-5" }) {
  return (
    <svg {...defaults} className={className} aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export function Info({ className = "h-5 w-5" }) {
  return (
    <svg {...defaults} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

export function Check({ className = "h-5 w-5" }) {
  return (
    <svg {...defaults} className={className} aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function CheckCheck({ className = "h-5 w-5" }) {
  return (
    <svg {...defaults} className={className} aria-hidden="true">
      <path d="M18 7L9.7 15 6 11.4" />
      <path d="M23 7l-8.3 8L13 13.4" />
    </svg>
  );
}

export function Flag({ className = "h-5 w-5" }) {
  return (
    <svg {...defaults} className={className} aria-hidden="true">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  );
}

export function Trash2({ className = "h-5 w-5" }) {
  return (
    <svg {...defaults} className={className} aria-hidden="true">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

export function Eye({ className = "h-5 w-5" }) {
  return (
    <svg {...defaults} className={className} aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function Lock({ className = "h-5 w-5" }) {
  return (
    <svg {...defaults} className={className} aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export function Camera({ className = "h-5 w-5" }) {
  return (
    <svg {...defaults} className={className} aria-hidden="true">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

export function MoreVertical({ className = "h-5 w-5" }) {
  return (
    <svg {...defaults} className={className} aria-hidden="true">
      <circle cx="12" cy="5" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function EyeOff({ className = "h-5 w-5" }) {
  return (
    <svg {...defaults} className={className} aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export function Loader2({ className = "h-5 w-5" }) {
  return (
    <svg {...defaults} className={className} aria-hidden="true">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

export function RefreshCcw({ className = "h-5 w-5" }) {
  return (
    <svg {...defaults} className={className} aria-hidden="true">
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 21v-5h5" />
    </svg>
  );
}

export function RefreshCw({ className = "h-5 w-5" }) {
  return (
    <svg {...defaults} className={className} aria-hidden="true">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

export function AlertTriangle({ className = "h-5 w-5" }) {
  return (
    <svg {...defaults} className={className} aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

export function XCircle({ className = "h-5 w-5" }) {
  return (
    <svg {...defaults} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}

export function Home({ className = "h-5 w-5" }) {
  return (
    <svg {...defaults} className={className} aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

export function Bell({ className = "h-5 w-5" }) {
  return (
    <svg {...defaults} className={className} aria-hidden="true">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

export function CheckCircle2({ className = "h-5 w-5" }) {
  return (
    <svg {...defaults} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 11.5L11 14.5L16 9.5" />
    </svg>
  );
}

export function FileText({ className = "h-5 w-5" }) {
  return (
    <svg {...defaults} className={className} aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}
