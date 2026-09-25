# Nirbhor Frontend Architecture & Documentation

> **Nirbhor** is a modern, bilingual, and responsive web application built with React and Vite. It provides a seamless interface for users to post jobs, offer services, chat in real-time, and manage digital wallets.

## 🏗️ Architecture & Project Structure

The frontend is a Single Page Application (SPA) designed with performance, maintainability, and aesthetic excellence in mind. It heavily utilizes a custom Glassmorphism design system built on top of Tailwind CSS.

### Tech Stack
- **Build Tool:** Vite (for ultra-fast HMR and optimized production builds)
- **Framework:** React 19
- **Routing:** React Router v7
- **Styling:** Tailwind CSS v4, DaisyUI, Framer Motion (for micro-animations)
- **State Management:** React Context API (Auth, Toast, Admin states)
- **Network Requests:** Axios (with centralized interceptors)
- **Real-Time:** Socket.io-client
- **Localization:** i18next (English & Bangla)

### Directory Structure
```text
Frontend/
├── public/              # Static assets (favicons, manifests)
├── src/
│   ├── assets/          # Images, icons, and SVG illustrations
│   ├── components/      # Reusable UI components (Modals, Buttons, Inputs)
│   ├── contexts/        # Global React Context providers
│   ├── data/            # Static constants (locations, filter options)
│   ├── hooks/           # Custom React hooks (useAuth, useAdmin, useRemoteList)
│   ├── layouts/         # Page wrappers (MainLayout, AdminLayout, AuthLayout)
│   ├── locales/         # i18n JSON dictionary files (en/, bn/)
│   ├── pages/           # Route-level view components
│   ├── routes/          # Routing logic and Protected/Admin route guards
│   ├── services/        # API client abstractions and Socket service
│   ├── utils/           # Helper functions (number formatting, date parsing)
│   ├── index.css        # Global Tailwind base and custom theme variables
│   └── main.jsx         # Application mounting point
├── .env.example         # Environment variable template
├── vite.config.js       # Vite bundler configuration
└── tailwind.config.js   # Tailwind theme customizations
```

---

## ⚙️ Environment & Setup

### Prerequisites
- Node.js (v18+)

### Step 1: Installation
Navigate to the `Frontend` directory and install dependencies:
```bash
cd Frontend
npm install
```

### Step 2: Environment Variables
Create a `.env` file in the `Frontend` root by duplicating `.env.example`.

| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base URL for backend REST API requests. | `/api` |
| `VITE_SOCKET_URL` | Base URL for Socket.io connections. | *(empty string for same-origin)* |

### Step 3: Run the Application
```bash
# Development mode (starts Vite dev server)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 🛣️ Routing & Access Architecture

The application uses centralized routing mapped out in `src/routes/router.jsx`. Routes are strictly segregated by access requirements.

### 🟢 Public Routes (No Authentication Required)
- `/` - Landing Page (Hero, Features, Testimonials)
- `/login` / `/register` - Authentication flows
- `/services` - Browse available services
- `/jobs` - Browse open public jobs
- `/provider/:id` - View a provider's public profile

### 🟡 Protected Routes (User Authentication Required)
Wrapped in `<ProtectedRoute>`. Redirects to `/login` if no valid JWT is present.
- `/dashboard` - Role-based dashboard (Hirer or Provider view)
- `/profile` - User profile management
- `/post-job` - Job creation form (Hirer only)
- `/wallet` - Deposit, withdraw, and transaction history
- `/chat` - Real-time messaging hub
- `/verify-nid` - KYC/NID verification flow

### 🔴 Admin Routes (Admin Role Required)
Wrapped in `<AdminRoute>` and uses `AdminLayout.jsx`.
- `/admin` - Overview and analytics dashboard
- `/admin/users` - User management and bans
- `/admin/jobs` - System-wide job oversight
- `/admin/disputes` - Arbitration and dispute resolution
- `/admin/finances` - Platform revenue and payout management
- `/admin/audit` - Immutable action log viewer


