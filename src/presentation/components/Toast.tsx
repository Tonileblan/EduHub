
import React from "react";

export interface ToastMessage {
  id: string;
  text: string;
  type: "success" | "info";
}

interface ToastProps {
  toasts: ToastMessage[];
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts }) => {
  return (
    <div className="toast-container" aria-live="polite" aria-atomic="true">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span>{t.type === "success" ? "✅" : "ℹ️"}</span>
          <span>{t.text}</span>
        </div>
      ))}
    </div>
  );
};
