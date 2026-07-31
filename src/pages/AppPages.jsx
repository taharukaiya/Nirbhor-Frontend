import { Link, useParams } from "react-router-dom";
import {
  adminMetrics,
  benefits,
  categories,
  dashboardStats,
  featuredProviders,
  journeySteps,
  jobs,
  messages,
  notifications,
  reviews,
  serviceCards,
  testimonials,
} from "../data/mockData.js";

export function HomePage() {
  return (
    <div className="space-y-16 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <section className="grid gap-10 rounded-4xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:grid-cols-[1.15fr_0.85fr] lg:p-10 xl:p-12">
        <div className="space-y-8">
          <div className="inline-flex rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
            Verified service marketplace for trusted hiring
          </div>
          <div className="space-y-5">
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl xl:text-6xl">
              Find Trusted Professionals for Every Service.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Nirbhor connects verified hirers and service providers through
              identity verification, secure escrow payments, private job chat,
              and transparent reviews.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/providers"
              className="rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
            >
              Find a Service Provider
            </Link>
            <Link
              to="/auth/register"
              className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
            >
              Become a Service Provider
            </Link>
          </div>

          <SearchPanel />
        </div>

        <div className="relative overflow-hidden rounded-4xl bg-[linear-gradient(145deg,#eff6ff,#f8fafc_55%,#ecfeff)] p-6 ring-1 ring-slate-200">
          <div className="absolute right-8 top-8 h-32 w-32 rounded-full bg-blue-200/50 blur-3xl" />
          <div className="absolute bottom-10 left-6 h-24 w-24 rounded-full bg-orange-200/60 blur-2xl" />
          <div className="relative grid gap-4 sm:grid-cols-2">
            {[
              "Electrician",
              "Plumber",
              "Painter",
              "Tutor",
              "Mechanic",
              "Cleaner",
            ].map((label, index) => (
              <div
                key={label}
                className={`rounded-3xl border border-white/70 bg-white p-4 shadow-sm ${index === 0 ? "sm:col-span-2" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-slate-900">{label}</p>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500">
                    Verified
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Skilled, reviewed, and available for trusted home and business
                  work.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 rounded-4xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:grid-cols-[1fr_auto] lg:items-center lg:p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            Global Search
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            Search by service, location, price, and rating.
          </h2>
        </div>
        <SearchPanel compact />
      </section>

      <SectionBlock
        title="Popular Categories"
        subtitle="Explore the most requested services on Nirbhor."
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              to="/providers"
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-2xl">
                  {category.icon}
                </span>
                <span className="text-sm text-slate-500">
                  {category.providers} providers
                </span>
              </div>
              <h3 className="mt-6 text-lg font-semibold text-slate-900">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock
        title="Featured Service Providers"
        subtitle="Verified professionals with strong ratings and completed jobs."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {featuredProviders.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      </SectionBlock>

      <SectionBlock
        title="How Nirbhor Works"
        subtitle="A simple flow for secure, trust-first service hiring."
      >
        <Timeline items={journeySteps} />
      </SectionBlock>

      <SectionBlock
        title="Why Choose Nirbhor"
        subtitle="The platform is designed around trust and accountability."
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {benefits.map((item) => (
            <div
              key={item}
              className="rounded-3xl bg-slate-900 p-6 text-white shadow-sm"
            >
              <p className="text-lg font-semibold">{item}</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Built to reduce fraud, improve communication, and keep payments
                secure.
              </p>
            </div>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock
        title="Testimonials"
        subtitle="Early trust signals from both hirers and service providers."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {testimonials.map((item) => (
            <blockquote
              key={item.name}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm leading-7 text-slate-600">“{item.quote}”</p>
              <footer className="mt-6 flex items-center justify-between text-sm">
                <div>
                  <p className="font-semibold text-slate-900">{item.name}</p>
                  <p className="text-slate-500">{item.role}</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                  Verified
                </span>
              </footer>
            </blockquote>
          ))}
        </div>
      </SectionBlock>
    </div>
  );
}

export function ServicesPage() {
  return (
    <PageShell
      title="Browse Services"
      subtitle="Explore service categories and jump directly to verified providers."
    >
      <SearchPanel compact />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {serviceCards.map((card) => (
          <CategoryCard key={card.name} card={card} />
        ))}
      </div>
    </PageShell>
  );
}

export function ProvidersPage() {
  return (
    <PageShell
      title="Browse Service Providers"
      subtitle="Filter verified providers by category, price, rating, and availability."
    >
      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <FilterPanel
          title="Filters"
          items={[
            "Location",
            "Category",
            "Rating",
            "Availability",
            "Experience",
            "Price",
          ]}
        />
        <div className="grid gap-4">
          {featuredProviders.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} horizontal />
          ))}
        </div>
      </div>
    </PageShell>
  );
}

export function ProviderProfilePage() {
  const { id } = useParams();
  const provider =
    featuredProviders.find((item) => item.id === id) ?? featuredProviders[0];

  return (
    <PageShell
      title={provider.name}
      subtitle={`${provider.category} • ${provider.location} • Verified service provider`}
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-4xl bg-slate-900 p-6 text-white shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-300">Cover Photo</p>
                <h2 className="mt-2 text-2xl font-semibold">
                  Verified Provider Profile
                </h2>
              </div>
              <span className="rounded-full bg-emerald-500 px-3 py-1 text-sm font-medium text-white">
                Verified Badge
              </span>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <div className="grid h-20 w-20 place-items-center rounded-3xl bg-white text-2xl font-semibold text-slate-900">
                {provider.name.slice(0, 1)}
              </div>
              <div>
                <p className="text-xl font-semibold">{provider.name}</p>
                <p className="text-slate-300">
                  {provider.category} • {provider.location}
                </p>
              </div>
            </div>
          </div>

          <DetailGrid title="About" value={provider.bio} />
          <DetailGrid
            title="Skills"
            value="Electrical troubleshooting, fan repair, wiring, appliance setup."
          />
          <DetailGrid
            title="Experience"
            value="8+ years of verified professional experience."
          />
          <DetailGrid
            title="Portfolio"
            value="Project gallery with completed work samples and before-after photos."
          />
        </div>

        <div className="space-y-4">
          <StatCard label="Rating" value={provider.rating} />
          <StatCard label="Completed Jobs" value={provider.jobs} />
          <StatCard label="Starting Price" value={provider.price} />
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <Link
              to="/jobs"
              className="inline-flex rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-600"
            >
              Create or browse job postings
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

export function JobsPage() {
  return (
    <PageShell
      title="Browse Jobs"
      subtitle="Verified service providers can search available work and submit proposals."
    >
      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <FilterPanel
          title="Job Filters"
          items={["Category", "Budget", "Location", "Date", "Search"]}
        />
        <div className="grid gap-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </PageShell>
  );
}

export function JobDetailsPage() {
  const { id } = useParams();
  const job = jobs.find((item) => item.id === id) ?? jobs[0];

  return (
    <PageShell
      title={job.title}
      subtitle={`${job.category} • ${job.location} • ${job.status}`}
    >
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6 rounded-4xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <DetailGrid title="Description" value={job.description} />
          <DetailGrid title="Budget" value={job.budget} />
          <DetailGrid title="Preferred Date" value={job.preferredDate} />
          <DetailGrid title="Hirer" value={job.hirer} />
          <div className="rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Service Provider Actions
            </p>
            <button className="mt-4 rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-600">
              Submit Proposal
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <StatCard label="Budget" value={job.budget} />
          <StatCard label="Proposal Count" value={job.proposals} />
          <StatCard label="Status" value={job.status} />
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Hirer information
            </p>
            <p className="mt-3 text-lg font-semibold text-slate-900">
              {job.hirer}
            </p>
            <p className="text-sm text-slate-600">
              Verified hirer profile with job-specific chat once proposals are
              submitted.
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

export function AboutPage() {
  return (
    <PageShell
      title="How Nirbhor Works"
      subtitle="A verified, escrow-backed marketplace designed to reduce fraud and improve accountability."
    >
      <Timeline items={journeySteps} />
    </PageShell>
  );
}

export function ContactPage() {
  return (
    <PageShell
      title="Contact"
      subtitle="Support, trust, and safety channels for verified users and administrators."
    >
      <div className="grid gap-4 lg:grid-cols-3">
        {["Support", "Safety Team", "Platform Admin"].map((item) => (
          <div
            key={item}
            className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
          >
            <p className="font-semibold text-slate-900">{item}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Contact Nirbhor for verification help, dispute support, or
              platform questions.
            </p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

export function LoginPage() {
  return (
    <AuthFormShell
      title="Welcome back"
      subtitle="Login to continue as a verified hirer or service provider."
    >
      <AuthField label="Email" type="email" placeholder="you@example.com" />
      <AuthField label="Password" type="password" placeholder="••••••••" />
      <div className="flex items-center justify-between text-sm text-slate-600">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="rounded border-slate-300" />
          Remember me
        </label>
        <Link
          to="/auth/forgot-password"
          className="font-medium text-blue-600 hover:text-blue-700"
        >
          Forgot password?
        </Link>
      </div>
      <button className="w-full rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-600">
        Login
      </button>
    </AuthFormShell>
  );
}

export function RegisterPage() {
  return (
    <AuthFormShell
      title="Create your account"
      subtitle="Complete registration and verification in a guided flow."
    >
      <WizardStep
        title="Step 1 • Personal Information"
        items={["Name", "Email", "Phone", "Password", "Confirm Password"]}
      />
      <WizardStep title="Step 2 • Email Verification" items={["OTP code"]} />
      <WizardStep
        title="Step 3 • NID Verification"
        items={["Upload NID", "NID Number", "Date of Birth", "OCR Preview"]}
      />
      <WizardStep
        title="Step 4 • Account Created"
        items={["Verified Badge", "Continue to Dashboard"]}
      />
    </AuthFormShell>
  );
}

export function ForgotPasswordPage() {
  return (
    <AuthFormShell
      title="Reset password"
      subtitle="Request a secure reset link by email."
    >
      <AuthField label="Email" type="email" placeholder="you@example.com" />
      <button className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800">
        Send reset link
      </button>
    </AuthFormShell>
  );
}

export function DashboardHomePage({ role }) {
  const stats = dashboardStats[role];

  return (
    <PageShell
      title={
        role === "hirer" ? "Hirer Dashboard" : "Service Provider Dashboard"
      }
      subtitle="Role-based overview with switchable navigation, notifications, and quick actions."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <ActionPanel
          title="Quick Actions"
          items={
            role === "hirer"
              ? [
                  "Create Job",
                  "View My Jobs",
                  "View Payments",
                  "Recent Activities",
                ]
              : [
                  "Browse Jobs",
                  "My Services",
                  "View Earnings",
                  "Completed Jobs",
                ]
          }
        />
        <ActionPanel
          title="Notifications"
          items={[
            "New proposal",
            "Chat update",
            "Payment status",
            "Review received",
          ]}
        />
      </div>
    </PageShell>
  );
}

export function CreateJobPage() {
  return (
    <PageShell
      title="Create Job"
      subtitle="Publish a new verified job request in a multi-step form."
    >
      <WizardStep
        title="Job details"
        items={[
          "Title",
          "Category",
          "Description",
          "Budget",
          "Location",
          "Preferred Date",
          "Images (optional)",
        ]}
      />
      <button className="mt-6 rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-600">
        Publish Job
      </button>
    </PageShell>
  );
}

export function MyJobsPage() {
  return (
    <PageShell
      title="My Jobs"
      subtitle="Track all jobs across open, in progress, completed, disputed, and archived states."
    >
      <div className="flex flex-wrap gap-2">
        {["Open", "In Progress", "Completed", "Disputed", "Archived"].map(
          (tab) => (
            <span
              key={tab}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
            >
              {tab}
            </span>
          ),
        )}
      </div>
      <div className="mt-6 grid gap-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} compact />
        ))}
      </div>
    </PageShell>
  );
}

export function JobChatPage() {
  return (
    <PageShell
      title="Job Chat"
      subtitle="Private chat between the hirer and a specific service provider for one job proposal."
    >
      <div className="grid gap-4 rounded-4xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        {messages.map((message) => (
          <div
            key={`${message.from}-${message.meta}`}
            className={`max-w-3xl rounded-3xl px-4 py-3 ${message.from === "Hirer" ? "ml-auto bg-slate-900 text-white" : "bg-slate-100 text-slate-900"}`}
          >
            <p className="text-sm font-medium">{message.from}</p>
            <p className="mt-1 text-sm leading-6">{message.text}</p>
            <p
              className={`mt-2 text-xs ${message.from === "Hirer" ? "text-slate-300" : "text-slate-500"}`}
            >
              {message.meta}
            </p>
          </div>
        ))}
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Messages containing phone numbers, email addresses, external links, or
          attempts to move communication outside the platform are blocked before
          sending.
        </div>
      </div>
    </PageShell>
  );
}

export function PaymentPage() {
  return (
    <PageShell
      title="Payment"
      subtitle="Escrow summary and SSLCommerz redirect after proposal acceptance."
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="rounded-4xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Job Amount" value="5,000 BDT" />
            <StatCard label="Platform Fee" value="250 BDT" />
            <StatCard label="Total" value="5,000 BDT" />
          </div>
          <button className="mt-6 rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-600">
            Redirect to SSLCommerz
          </button>
        </div>
        <ActionPanel
          title="Payment Status"
          items={["Escrow Funded", "Job Active", "Release on completion"]}
        />
      </div>
    </PageShell>
  );
}

export function ProfilePage() {
  return (
    <PageShell
      title="Profile"
      subtitle="Manage personal information, verification, portfolio, reviews, security, and settings."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          "Personal Information",
          "Verification",
          "Portfolio",
          "Reviews",
          "Security",
          "Settings",
        ].map((tab) => (
          <div
            key={tab}
            className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
          >
            <p className="font-semibold text-slate-900">{tab}</p>
            <p className="mt-2 text-sm text-slate-600">
              Detailed settings for {tab.toLowerCase()}.
            </p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

export function NotificationsPage() {
  return (
    <PageShell
      title="Notifications"
      subtitle="Grouped by time and category for jobs, payments, reviews, messages, and verification."
    >
      <NotificationGroup title="Today" items={notifications.today} />
      <NotificationGroup title="Yesterday" items={notifications.yesterday} />
      <NotificationGroup title="Earlier" items={notifications.earlier} />
    </PageShell>
  );
}

export function ReviewsPage() {
  return (
    <PageShell
      title="Reviews"
      subtitle="Separate review interfaces for completed jobs."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <ActionPanel
          title="Hirer reviews Service Provider"
          items={reviews.map((item) => `${item.name} • ${item.rating} stars`)}
        />
        <ActionPanel
          title="Service Provider reviews Hirer"
          items={[
            "Communication",
            "Fairness",
            "Timely confirmation",
            "Professionalism",
          ]}
        />
      </div>
    </PageShell>
  );
}

export function DisputePage() {
  const { jobId } = useParams();

  return (
    <PageShell
      title={`Dispute ${jobId ? `• Job ${jobId}` : ""}`}
      subtitle="Evidence, timeline, payment status, and admin decision support."
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="rounded-4xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <WizardStep
            title="Reason"
            items={[
              "Written explanation",
              "Images",
              "Videos",
              "Documents",
              "Screenshots",
            ]}
          />
          <div className="mt-4 rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Status Timeline
            </p>
            <Timeline
              items={[
                "Dispute opened",
                "Admin review",
                "Decision",
                "Payment released",
              ]}
            />
          </div>
        </div>
        <ActionPanel
          title="Admin Decision"
          items={[
            "Release Payment",
            "Refund Hirer",
            "Partial Refund",
            "Issue Warning",
            "Suspend Account",
          ]}
        />
      </div>
    </PageShell>
  );
}

export function AdminDashboardPage() {
  return (
    <PageShell
      title="Admin Dashboard"
      subtitle="Overview of verifications, disputes, jobs, and platform health."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {adminMetrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
          >
            <p className="text-sm text-slate-500">{metric.label}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">
              {metric.value}
            </p>
            <p className="mt-2 text-sm text-emerald-600">{metric.trend}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <ActionPanel
          title="Recent platform activity"
          items={[
            "Pending verifications",
            "Open disputes",
            "Reported content",
            "Completed jobs",
          ]}
        />
        <ActionPanel
          title="Admin shortcuts"
          items={[
            "Users",
            "Verifications",
            "Jobs",
            "Disputes",
            "Payments",
            "Analytics",
          ]}
        />
      </div>
    </PageShell>
  );
}

export function AdminUsersPage() {
  return (
    <AdminTablePage
      title="Admin Users"
      rows={["Search", "Filter", "Suspend", "Ban", "View Details"]}
    />
  );
}

export function AdminVerificationsPage() {
  return (
    <AdminTablePage
      title="Admin Verifications"
      rows={["Pending NID Requests", "Approve", "Reject", "View OCR Data"]}
    />
  );
}

export function AdminJobsPage() {
  return (
    <AdminTablePage
      title="Admin Jobs"
      rows={["All jobs", "Status", "Payments", "Chat history", "Escrow state"]}
    />
  );
}

export function AdminDisputesPage() {
  return (
    <AdminTablePage
      title="Admin Disputes"
      rows={[
        "Job",
        "Proposal",
        "Payment",
        "Evidence",
        "Chat History",
        "Timeline",
      ]}
    />
  );
}

export function AdminAnalyticsPage() {
  return (
    <PageShell
      title="Analytics"
      subtitle="High-level charts for growth, activity, revenue, and active users."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {["New Users", "Jobs Created", "Completed Jobs", "Revenue"].map(
          (label, index) => (
            <div
              key={label}
              className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
            >
              <p className="font-semibold text-slate-900">{label}</p>
              <div className="mt-4 h-40 rounded-2xl bg-linear-to-t from-slate-200 to-slate-50 p-4">
                <div className="flex h-full items-end gap-2">
                  {[30, 60, 45, 75, 50].map((height, barIndex) => (
                    <div
                      key={`${label}-${barIndex}`}
                      className="w-full rounded-t-xl bg-slate-900/80"
                      style={{ height: `${height + index * 5}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ),
        )}
      </div>
    </PageShell>
  );
}

export function AdminSettingsPage() {
  return (
    <AdminTablePage
      title="Admin Settings"
      rows={[
        "System settings",
        "Rates",
        "Policies",
        "Notifications",
        "Audit logs",
      ]}
    />
  );
}

export function NotFoundPage() {
  return (
    <PageShell
      title="Page not found"
      subtitle="The route you requested does not exist."
    >
      <Link
        to="/"
        className="inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
      >
        Return home
      </Link>
    </PageShell>
  );
}

function SectionBlock({ title, subtitle, children }) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
          {title}
        </h2>
        <p className="mt-2 max-w-3xl text-slate-600">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

function PageShell({ title, subtitle, children }) {
  return (
    <div className="space-y-6">
      <section className="rounded-4xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            Nirbhor
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-8 text-slate-600">
            {subtitle}
          </p>
        </div>
      </section>
      {children}
    </div>
  );
}

function SearchPanel({ compact = false }) {
  return (
    <div
      className={`grid gap-3 rounded-[1.75rem] bg-white p-4 shadow-sm ring-1 ring-slate-200 ${compact ? "sm:grid-cols-2 lg:grid-cols-[1.1fr_1.1fr_auto]" : "xl:grid-cols-[1.1fr_1.1fr_0.8fr_0.8fr_auto]"}`}
    >
      <SearchField label="Service" placeholder="Electrician, cleaner, tutor" />
      <SearchField label="Location" placeholder="Dhaka, Chattogram, Sylhet" />
      {!compact && <SearchField label="Category" placeholder="Optional" />}
      {!compact && <SearchField label="Price" placeholder="Optional" />}
      <button className="rounded-2xl bg-orange-500 px-5 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600">
        Search
      </button>
    </div>
  );
}

function SearchField({ label, placeholder }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </span>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
      />
    </label>
  );
}

function CategoryCard({ card }) {
  return (
    <Link
      to="/providers"
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-2xl">
          {card.icon}
        </span>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
          Popular
        </span>
      </div>
      <h3 className="mt-6 text-lg font-semibold text-slate-900">{card.name}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        {card.description}
      </p>
    </Link>
  );
}

function ProviderCard({ provider, horizontal = false }) {
  return (
    <div
      className={`rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm ${horizontal ? "flex flex-col gap-5 md:flex-row md:items-start" : ""}`}
    >
      <div className="flex items-start gap-4">
        <div className="grid h-16 w-16 place-items-center rounded-3xl bg-slate-100 text-2xl font-semibold text-slate-900">
          {provider.name.slice(0, 1)}
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-slate-900">
              {provider.name}
            </h3>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              Verified
            </span>
          </div>
          <p className="text-sm text-slate-500">
            {provider.category} • {provider.location}
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-600">{provider.bio}</p>
      <div className="mt-5 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
        <span>Rating: {provider.rating}</span>
        <span>Completed Jobs: {provider.jobs}</span>
        <span>Starting Price: {provider.price}</span>
        <span>Location: {provider.location}</span>
      </div>
      <Link
        to={`/providers/${provider.id}`}
        className="mt-5 inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white"
      >
        View Profile
      </Link>
    </div>
  );
}

function JobCard({ job, compact = false }) {
  return (
    <div
      className={`rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm ${compact ? "grid gap-3" : "grid gap-4 md:grid-cols-[1fr_auto]"}`}
    >
      <div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <span
            className={`rounded-full px-3 py-1 ${job.status === "Open" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}
          >
            {job.status}
          </span>
          <span>{job.category}</span>
          <span>{job.posted}</span>
        </div>
        <h3 className="mt-3 text-lg font-semibold text-slate-900">
          {job.title}
        </h3>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          {job.description}
        </p>
      </div>
      <div className="space-y-3 md:text-right">
        <p className="text-sm text-slate-500">Budget</p>
        <p className="text-2xl font-semibold text-slate-900">{job.budget}</p>
        <p className="text-sm text-slate-600">{job.location}</p>
        <p className="text-sm text-slate-500">{job.proposals} proposals</p>
        <Link
          to={`/jobs/${job.id}`}
          className="inline-flex rounded-full bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-600"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

function FilterPanel({ title, items }) {
  return (
    <aside className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600 ring-1 ring-slate-200"
          >
            {item}
          </div>
        ))}
      </div>
    </aside>
  );
}

function Timeline({ items }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => (
        <div
          key={item}
          className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">
              {index + 1}
            </span>
            <p className="font-semibold text-slate-900">{item}</p>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Milestone {index + 1} in the trust-first workflow.
          </p>
        </div>
      ))}
    </div>
  );
}

function DetailGrid({ title, value }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
        {title}
      </p>
      <p className="mt-3 text-base leading-7 text-slate-700">{value}</p>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function ActionPanel({ title, items }) {
  return (
    <div className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
        {title}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function NotificationGroup({ title, items }) {
  return (
    <div className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
        {title}
      </p>
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function AuthFormShell({ title, subtitle, children }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Authentication
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          {title}
        </h1>
        <p className="mt-3 text-slate-600">{subtitle}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function AuthField({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </span>
      <input
        {...props}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
      />
    </label>
  );
}

function WizardStep({ title, items }) {
  return (
    <div className="rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
        {title}
      </p>
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminTablePage({ title, rows }) {
  return (
    <PageShell
      title={title}
      subtitle="Structured administration pages for moderation and platform operations."
    >
      <div className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-wrap gap-2">
          <button className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">
            Search
          </button>
          <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
            Filter
          </button>
        </div>
        <div className="mt-6 grid gap-3">
          {rows.map((row) => (
            <div
              key={row}
              className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200"
            >
              {row}
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
