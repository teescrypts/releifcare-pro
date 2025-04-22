import React from "react";
import MarketingPage from "../../components/marketing-page";
import { cookies } from "next/headers";
import apiRequest from "@/app/lib/api-request";
import { LoyaltyPointType } from "@/types";

async function Page() {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const response = await apiRequest<{ data: { settings: LoyaltyPointType } }>(
    "admin/loyalty-settings",
    {
      token,
      tag: "fetchAdminLoyaltySettings",
      cache: "force-cache",
    }
  );

  const settings = response.data.settings;

  return (
    <div>
      <MarketingPage settings={settings} />
    </div>
  );
}

export default Page;
