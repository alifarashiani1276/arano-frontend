import ConversationPanel from "../../../features/dashboard/ConversationPanel";
import PageHeader from "../../../features/dashboard/PageHeader";

export default function AdminSupport() {
  return (
    <>
      <PageHeader
        title="پشتیبانی"
        subtitle="گفتگوهای کاربران را بررسی و پاسخ دهید"
      />
      <ConversationPanel viewer="ADMIN" />
    </>
  );
}
