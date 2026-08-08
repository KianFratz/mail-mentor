import React from "react";
import { Button } from "./ui/button";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const ConfirmDialog = ({
  open,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-slate-800">{title}</h2>

        <p className="mt-3 text-sm text-slate-600">{message}</p>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="
              rounded-lg px-4 py-2
              text-sm font-semibold
              text-white
              bg-gradient-to-r from-rose-500 to-orange-500
              hover:opacity-90
              disabled:opacity-50
            "
          >
            {cancelText}
          </Button>

          <Button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="
              flex items-center gap-2 px-5 py-2.5
              bg-gradient-to-r from-violet-600 to-indigo-600
              text-white rounded-lg text-sm font-semibold
              hover:from-violet-700 hover:to-indigo-700
              active:scale-95 transition-all shadow-md shadow-violet-200
              disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
            "
          >
            {loading ? "Processing..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
