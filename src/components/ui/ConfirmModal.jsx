/**
 * Generic Confirmation Modal
 * 
 * Architectural Intent:
 * A highly reusable UI primitive for interrupting dangerous or consequential user actions
 * (e.g., deletions, final submissions) to ask for explicit confirmation.
 * 
 * Features:
 * - Supports a "destructive" mode which styles the confirmation action prominently in red.
 * - Prevents background clicks from bypassing the confirmation implicitly, requiring 
 *   explicit `onConfirm` or `onClose` resolution.
 */
import React from "react";
import { X, AlertTriangle } from "lucide-react";

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", isDestructive = false }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="w-full max-w-sm overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-2xl transition-all border border-slate-200 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-5 py-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className={`h-5 w-5 ${isDestructive ? 'text-red-500' : 'text-[#0066FF]'}`} />
            <h2 className="text-base font-bold text-[#011F50] dark:text-white">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 py-4">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">{message}</p>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition ${
                isDestructive 
                  ? "bg-red-500 hover:bg-red-600" 
                  : "bg-[#0066FF] hover:bg-blue-700"
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
