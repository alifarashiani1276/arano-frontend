import PageShell from "./PageShell";
import ServiceView from "../features/services/ServiceView";
import StickyConsult from "../features/services/StickyConsult";

// یک قالب برای هر ۲۲ صفحه‌ی خدمت؛ آدرس از App.jsx و داده از src/data/servicePages.js می‌آید.
export default function ServicePage({ path }) {
  return (
    <PageShell path={path}>
      <ServiceView path={path} />
      <StickyConsult />
    </PageShell>
  );
}
