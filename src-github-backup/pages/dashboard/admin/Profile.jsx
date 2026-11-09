import toast from "react-hot-toast";
import PageHeader from "../../../features/dashboard/PageHeader";
import ProfileForm from "../../../features/dashboard/ProfileForm";
import { updateAdminProfile } from "../../../services/dashboardService";
import { apiMessage } from "../../../lib/api";

export default function AdminProfile() {
  return (
    <>
      <PageHeader
        title="پروفایل مدیر"
        subtitle="اطلاعات حساب مدیریتی خود را ویرایش کنید"
      />
      <ProfileForm
        update={updateAdminProfile}
        onUpdated={() => toast.success("پروفایل مدیر ذخیره شد.")}
        onError={(error) =>
          toast.error(apiMessage(error, "ذخیره پروفایل مدیر انجام نشد."))
        }
      />
    </>
  );
}
