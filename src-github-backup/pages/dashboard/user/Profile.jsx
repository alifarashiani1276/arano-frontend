import toast from "react-hot-toast";
import PageHeader from "../../../features/dashboard/PageHeader";
import ProfileForm from "../../../features/dashboard/ProfileForm";
import { updateUserProfile } from "../../../services/dashboardService";
import { apiMessage } from "../../../lib/api";

export default function Profile() {
  return (
    <>
      <PageHeader title="پروفایل" subtitle="اطلاعات حساب خود را ویرایش کنید" />
      <ProfileForm
        update={updateUserProfile}
        onUpdated={() => toast.success("اطلاعات پروفایل ذخیره شد.")}
        onError={(error) =>
          toast.error(apiMessage(error, "ذخیره پروفایل انجام نشد."))
        }
      />
    </>
  );
}
