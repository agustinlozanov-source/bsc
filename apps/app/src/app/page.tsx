import { redirect } from "next/navigation";
import { getUserContext } from "@/lib/auth";

export default async function RootPage() {
  const ctx = await getUserContext();
  if (!ctx) redirect("/login");
  redirect(ctx.dashboardPath);
}
