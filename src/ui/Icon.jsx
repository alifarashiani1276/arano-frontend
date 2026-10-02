import {
  FiCode,
  FiServer,
  FiLayout,
  FiLayers,
  FiGithub,
  FiLinkedin,
  FiInstagram,
  FiSend,
  FiMail,
  FiPhone,
  FiMapPin,
  FiZap,
  FiCpu,
  FiTerminal,
  FiGitBranch,
  FiDatabase,
} from "react-icons/fi";

// برای تغییر آیکون‌ها فقط این نقشه را ویرایش کنید؛
// داده‌ها (services/team/site) فقط کلید متنی را نگه می‌دارند.
const ICONS = {
  code: FiCode,
  server: FiServer,
  layout: FiLayout,
  layers: FiLayers,
  github: FiGithub,
  linkedin: FiLinkedin,
  instagram: FiInstagram,
  send: FiSend,
  mail: FiMail,
  phone: FiPhone,
  pin: FiMapPin,
  zap: FiZap,
  cpu: FiCpu,
  terminal: FiTerminal,
  git: FiGitBranch,
  database: FiDatabase,
};

export default function Icon({ name, ...props }) {
  const Component = ICONS[name] ?? FiCode;
  return <Component aria-hidden="true" {...props} />;
}
