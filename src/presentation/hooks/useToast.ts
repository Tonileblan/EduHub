
import { useState, useCallback } from "react";
import type { ToastMessage } from "../components/Toast";

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((text: string, type: "success" | "info" = "success") => {
    const id = Date.now().toString() + Math.random().toString();
    const newToast: ToastMessage = { id, text, type };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  return {
    toasts,
    showToast
  };
}
