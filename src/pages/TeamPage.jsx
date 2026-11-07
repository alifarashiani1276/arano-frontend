import PageShell from "./PageShell";
import Team from "../features/home/Team";

export default function TeamPage() {
  return (
    <PageShell path="/team">
      <Team asH1 />
    </PageShell>
  );
}
