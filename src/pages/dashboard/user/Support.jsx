import ConversationPanel from "../../../features/dashboard/ConversationPanel";
import PageHeader from "../../../features/dashboard/PageHeader";

export default function UserSupport() {
  return (
    <>
      <PageHeader title="پشتیبانی" subtitle="با تیم آرا نو در ارتباط باشید" />
      <ConversationPanel viewer="USER" />
    </>
  );
}
