import PageShell from "./PageShell";
import About from "../features/home/About";

export default function AboutPage() {
  return (
    <PageShell path="/about">
      <About asH1 />
    </PageShell>
  );
}
