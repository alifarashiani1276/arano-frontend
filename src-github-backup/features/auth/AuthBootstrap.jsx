import { useEffect } from "react";
import { getMe } from "../../services/authService";
import { session } from "./session";
import { tokenStore } from "./token";

export default function AuthBootstrap({ children }) {
  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      const token = tokenStore.get();

      if (!token) {
        return;
      }

      try {
        const user = await getMe();

        if (!cancelled && user) {
          session.setUser(user);
        }
      } catch {
        // اگر Token نامعتبر باشد، interceptor مربوط به 401
        // Token و Session را پاک خواهد کرد.
        //
        // خطاهای موقتی شبکه باعث حذف Session محلی نمی‌شوند.
      }
    };

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  return children;
}
