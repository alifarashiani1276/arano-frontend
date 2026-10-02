import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import { FiArrowLeft, FiRefreshCw } from "react-icons/fi";
import AuthLayout from "../features/auth/AuthLayout";

const otpInput =
  "h-12 min-w-0 flex-1 rounded-xl border border-border bg-surface-2 text-center text-lg font-black text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15 sm:h-14 sm:rounded-2xl sm:text-xl";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [seconds, setSeconds] = useState(120);
  const phone = sessionStorage.getItem("arano_auth_phone") || "شماره شما";

  useEffect(() => {
    const timer = setInterval(
      () => setSeconds((value) => (value > 0 ? value - 1 : 0)),
      1000,
    );
    return () => clearInterval(timer);
  }, []);

  const submit = (event) => {
    event.preventDefault();
    if (otp.length !== 6) return;
    sessionStorage.setItem("arano_otp_verified", "true");
    navigate("/auth/complete-profile");
  };

  const resend = () => setSeconds(120);

  return (
    <AuthLayout
      step={2}
      title="کد تأیید را وارد کن"
      subtitle={
        <>
          کد ۶ رقمی ارسال‌شده به{" "}
          <bdi dir="ltr" className="font-bold text-foreground">
            {phone}
          </bdi>{" "}
          را وارد کن.
        </>
      }
      onBack={() => navigate("/auth/login")}
    >
      <form onSubmit={submit} className="space-y-6 sm:space-y-7">
        <div dir="ltr">
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            shouldAutoFocus
            inputType="tel"
            containerStyle="flex w-full gap-1.5 sm:gap-2.5"
            renderInput={(props) => (
              <input
                {...props}
                style={{}}
                className={otpInput}
                inputMode="numeric"
                autoComplete="one-time-code"
              />
            )}
          />
        </div>

        <button
          type="submit"
          disabled={otp.length !== 6}
          className="group flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 font-black text-primary-foreground transition hover:opacity-90 disabled:opacity-50 sm:h-14"
        >
          تأیید و ادامه
          <FiArrowLeft className="transition-transform group-hover:-translate-x-1" />
        </button>

        <div className="text-center">
          {seconds > 0 ? (
            <p className="text-sm text-muted">
              ارسال مجدد کد تا {Math.floor(seconds / 60)}:
              {String(seconds % 60).padStart(2, "0")}
            </p>
          ) : (
            <button
              type="button"
              onClick={resend}
              className="inline-flex items-center gap-2 text-sm font-black text-primary hover:opacity-80"
            >
              <FiRefreshCw /> ارسال مجدد کد
            </button>
          )}
        </div>
      </form>
    </AuthLayout>
  );
}
