import { Link as RouterLink, Navigate as RouterNavigate, useNavigate as useRouterNavigate } from "react-router-dom";
import { useLang } from "./LangContext";

// Drop-in replacements for react-router-dom's Link / Navigate / useNavigate:
// internal paths ("/services") are automatically prefixed with /en on English pages.
export function Link({ to, ...rest }) {
  const { to: localize } = useLang();
  return <RouterLink to={typeof to === "string" ? localize(to) : to} {...rest} />;
}

export function Navigate({ to, ...rest }) {
  const { to: localize } = useLang();
  return <RouterNavigate to={typeof to === "string" ? localize(to) : to} {...rest} />;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNavigate() {
  const navigate = useRouterNavigate();
  const { to: localize } = useLang();
  return (to, opts) => navigate(typeof to === "string" ? localize(to) : to, opts);
}
