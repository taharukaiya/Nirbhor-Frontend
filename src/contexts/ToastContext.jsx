/**
 * Global Toast Notification Context
 * 
 * Architectural Intent:
 * Standardizes the visual presentation and usage of ephemeral notifications (Toasts)
 * across the application using `react-hot-toast`.
 * 
 * UI/UX:
 * - Implements a glassmorphism base style (`backdropFilter`).
 * - Exposes easy-to-use semantic wrappers: `showSuccess`, `showError`, `showInfo`.
 */
import { createContext, useContext, useMemo } from "react";
import toast, { Toaster } from "react-hot-toast";
import { X } from "lucide-react";

const ToastContext = createContext(null);

/* ── Shared style ─────────────────────────────── */
const base = {
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  borderRadius: "14px",
  padding: "12px 16px",
  fontSize: "0.875rem",
  fontWeight: "500",
  maxWidth: "380px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.05) inset",
};

const styles = {
  success: {
    ...base,
    background: "#0d9f6e",
    border: "1px solid #059669",
    color: "#ffffff",
  },
  error: {
    ...base,
    background: "#dc2626",
    border: "1px solid #b91c1c",
    color: "#ffffff",
  },
  info: {
    ...base,
    background: "#1d4ed8",
    border: "1px solid #1e40af",
    color: "#ffffff",
  },
};

const iconThemes = {
  success: { primary: "#ffffff", secondary: "rgba(255,255,255,0.3)" },
  error:   { primary: "#ffffff", secondary: "rgba(255,255,255,0.3)" },
};

export function ToastProvider({ children }) {
  const showToast = (message, type = "info") => {
    const duration = type === "error" ? 3500 : 2500;

    const content = (t) => (
      <div className="flex items-center gap-2">
        <span className="flex-1">{message}</span>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="ml-2 rounded-full p-1 opacity-70 hover:bg-white/20 hover:opacity-100 transition-all"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );

    if (type === "success") {
      toast.success(content, {
        style: styles.success,
        iconTheme: iconThemes.success,
        duration,
      });
    } else if (type === "error") {
      toast.error(content, {
        style: styles.error,
        iconTheme: iconThemes.error,
        duration,
      });
    } else {
      toast(content, {
        icon: "💙",
        style: styles.info,
        duration,
      });
    }
  };

  const value = useMemo(
    () => ({
      showToast,
      showSuccess: (msg) => showToast(msg, "success"),
      showError:   (msg) => showToast(msg, "error"),
      showInfo:    (msg) => showToast(msg, "info"),
    }),
    []
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={10}
        containerStyle={{ top: 20 }}
        toastOptions={{
          duration: 2500,
        }}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider.");
  return context;
}
