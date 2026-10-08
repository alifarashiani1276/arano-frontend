import { Navigate } from "react-router-dom";
import { authFlow } from "./authFlow";

// جلوی ورود مستقیم به مرحله‌های بعدی (با تایپ آدرس) را می‌گیرد.
//  step="phone"    => باید مرحله‌ی شماره موبایل انجام شده باشد
//  step="verified" => باید کد تأیید هم تأیید شده باشد
export default function RequireStep({ step, children }) {
  const allowed =
    step === "verified" ? authFlow.isVerified() : authFlow.hasPhone();

  return allowed ? children : <Navigate to="/auth/login" replace />;
}
