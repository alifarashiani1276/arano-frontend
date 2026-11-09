import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useLang } from "./LangContext";

// "Forward" arrow: points left in RTL (Persian) and right in LTR (English).
export function ArrowForward(props) {
  const { isEn } = useLang();
  const Icon = isEn ? FiArrowRight : FiArrowLeft;
  return <Icon {...props} />;
}

// "Back" arrow: points right in RTL and left in LTR.
export function ArrowBack(props) {
  const { isEn } = useLang();
  const Icon = isEn ? FiArrowLeft : FiArrowRight;
  return <Icon {...props} />;
}
