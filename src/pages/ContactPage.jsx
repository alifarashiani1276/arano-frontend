import PageShell from "./PageShell";
import Contact from "../features/home/Contact";

export default function ContactPage() {
  return (
    <PageShell path="/contact" hideCta>
      <Contact asH1 />
    </PageShell>
  );
}
