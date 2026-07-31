export const publicNavLinks = [
  { label: "Home", to: "/" },
  { label: "Browse Services", to: "/services" },
  { label: "Browse Jobs", to: "/jobs" },
  { label: "How It Works", to: "/how-it-works" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export const footerLinks = {
  quick: [
    { label: "Browse Services", to: "/services" },
    { label: "Browse Jobs", to: "/jobs" },
    { label: "Providers", to: "/providers" },
  ],
  company: [
    { label: "About", to: "/about" },
    { label: "How It Works", to: "/how-it-works" },
    { label: "Contact", to: "/contact" },
  ],
  support: [
    { label: "Help Center", to: "/contact" },
    { label: "Safety", to: "/about" },
    { label: "Disputes", to: "/dashboard/disputes/1" },
  ],
  policies: [
    { label: "Privacy", to: "/" },
    { label: "Terms", to: "/" },
    { label: "Trust & Safety", to: "/" },
  ],
};

export const categories = [
  { name: "Electrician", providers: 42, icon: "⚡" },
  { name: "Plumber", providers: 36, icon: "🔧" },
  { name: "Tutor", providers: 54, icon: "📘" },
  { name: "Painter", providers: 28, icon: "🎨" },
  { name: "Mechanic", providers: 31, icon: "🛠️" },
  { name: "Cleaner", providers: 65, icon: "🧹" },
  { name: "Computer Repair", providers: 23, icon: "💻" },
  { name: "Gardener", providers: 19, icon: "🌿" },
];

export const featuredProviders = [
  {
    id: "1",
    name: "Rahim Uddin",
    category: "Electrician",
    location: "Dhaka",
    rating: "4.9",
    jobs: 187,
    price: "1,200 BDT",
    bio: "Residential wiring, fan repair, and emergency power fixes.",
  },
  {
    id: "2",
    name: "Nusrat Jahan",
    category: "Cleaner",
    location: "Chattogram",
    rating: "4.8",
    jobs: 142,
    price: "900 BDT",
    bio: "Reliable home and office cleaning with verified references.",
  },
  {
    id: "3",
    name: "Arif Hasan",
    category: "Computer Repair",
    location: "Gazipur",
    rating: "4.95",
    jobs: 211,
    price: "1,500 BDT",
    bio: "Laptop diagnostics, OS recovery, and hardware replacement.",
  },
];

export const testimonials = [
  {
    name: "Sadia Khan",
    role: "Hirer",
    quote:
      "The verification and job-specific chat made the whole process feel safe and professional.",
  },
  {
    name: "Imran Hossain",
    role: "Service Provider",
    quote:
      "Escrow payment and clear job tracking give providers confidence to accept work.",
  },
  {
    name: "Maya Rahman",
    role: "Hirer",
    quote:
      "The platform looks premium and the structure makes it easy to compare providers.",
  },
];

export const journeySteps = [
  "Register",
  "Verify NID",
  "Hire Professionals",
  "Secure Payment & Review",
];

export const benefits = [
  "Verified Users",
  "Secure Escrow Payments",
  "AI Smart Search",
  "Dispute Protection",
  "Real-Time Job Chat",
  "Transparent Reviews",
];

export const serviceCards = categories.map((category) => ({
  ...category,
  description: `Browse trusted ${category.name.toLowerCase()}s with verified profiles and ratings.`,
}));

export const jobs = [
  {
    id: "101",
    title: "Repair leaking ceiling fan",
    budget: "1,500 BDT",
    location: "Dhanmondi, Dhaka",
    category: "Electrician",
    posted: "2 hours ago",
    proposals: 7,
    status: "Open",
    description:
      "Need an experienced electrician to inspect and fix a ceiling fan that is leaking oil and making noise.",
    hirer: "Farhana Ahmed",
    preferredDate: "Tomorrow evening",
  },
  {
    id: "102",
    title: "Deep clean 2-bedroom apartment",
    budget: "2,800 BDT",
    location: "Uttara, Dhaka",
    category: "Cleaner",
    posted: "5 hours ago",
    proposals: 5,
    status: "Open",
    description:
      "Thorough apartment cleaning including kitchen, windows, and bathroom surfaces.",
    hirer: "Tanvir Islam",
    preferredDate: "Friday morning",
  },
  {
    id: "103",
    title: "Math tutor for SSC student",
    budget: "4,000 BDT",
    location: "Sylhet",
    category: "Tutor",
    posted: "Yesterday",
    proposals: 9,
    status: "Closed",
    description:
      "Looking for a patient tutor with a strong track record in secondary school mathematics.",
    hirer: "Aminul Hoque",
    preferredDate: "Weekends",
  },
];

export const dashboardStats = {
  hirer: [
    { label: "Active Jobs", value: "5" },
    { label: "Completed Jobs", value: "18" },
    { label: "Pending Proposals", value: "12" },
    { label: "Payments", value: "3" },
  ],
  provider: [
    { label: "Available Jobs", value: "24" },
    { label: "My Proposals", value: "11" },
    { label: "Accepted Jobs", value: "6" },
    { label: "Pending Payments", value: "4" },
  ],
};

export const adminMetrics = [
  { label: "New Users", value: "128", trend: "+18%" },
  { label: "Jobs Created", value: "84", trend: "+12%" },
  { label: "Revenue", value: "76k BDT", trend: "+9%" },
  { label: "Active Users", value: "312", trend: "+24%" },
];

export const notifications = {
  today: [
    "New proposal received",
    "Payment successful",
    "New review submitted",
  ],
  yesterday: ["Proposal accepted", "New chat message", "Verification approved"],
  earlier: ["Dispute opened", "Payment released"],
};

export const messages = [
  { from: "System", text: "Proposal accepted", meta: "10:05 AM" },
  { from: "Provider", text: "I can start tomorrow morning.", meta: "10:06 AM" },
  {
    from: "Hirer",
    text: "Please confirm the replacement parts first.",
    meta: "10:08 AM",
  },
];

export const reviews = [
  {
    name: "Rafiq",
    rating: 5,
    text: "Great communication and on-time delivery.",
  },
  {
    name: "Nabila",
    rating: 5,
    text: "Professional and transparent throughout the job.",
  },
  { name: "Hasib", rating: 4.8, text: "Reliable and easy to work with." },
];

export const adminNavLinks = [
  { label: "Dashboard", to: "/admin" },
  { label: "Users", to: "/admin/users" },
  { label: "Verifications", to: "/admin/verifications" },
  { label: "Jobs", to: "/admin/jobs" },
  { label: "Disputes", to: "/admin/disputes" },
  { label: "Analytics", to: "/admin/analytics" },
  { label: "Settings", to: "/admin/settings" },
];

export const dashboardNavLinks = [
  { label: "Overview", to: "/dashboard/hirer" },
  { label: "Create Job", to: "/dashboard/jobs/create" },
  { label: "My Jobs", to: "/dashboard/jobs" },
  { label: "Payments", to: "/dashboard/payments" },
  { label: "Reviews", to: "/dashboard/reviews" },
  { label: "Profile", to: "/dashboard/profile" },
  { label: "Notifications", to: "/dashboard/notifications" },
];
