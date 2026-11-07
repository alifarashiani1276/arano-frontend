import PageShell from "./PageShell";
import Portfolio from "../features/home/Portfolio";

export default function PortfolioPage() {
  return (
    <PageShell path="/portfolio">
      <Portfolio asH1 />
    </PageShell>
  );
}
