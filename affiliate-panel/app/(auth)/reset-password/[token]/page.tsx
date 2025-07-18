import { getAffiliateById } from "@/models/affiliates-model";
import { AppRoutes } from "@/utils/routes";
import ResetPasswordPage from "./ResetPassword";
import { redirect } from "next/navigation";

export default async function page({
  params,
  searchParams,
}: {
  params: { token: string };
  searchParams: { userId?: string };
}) {
  const { token } = params;
  const { userId } = searchParams;

  if (!userId || !token) {
    redirect(AppRoutes.auth.signIn);
  }
  const affiliate = (await getAffiliateById(Number(userId)))?.data;
  if (!affiliate || affiliate.token !== token) {
    redirect(AppRoutes.auth.signIn);
  }

  return (
    <>
      <ResetPasswordPage id={userId || "1"} />
    </>
  );
}
