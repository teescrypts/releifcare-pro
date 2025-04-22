import React from "react";
import LoyaltyPointsCard from "../../components/loyalty-page";
import { cookies } from "next/headers";
import apiRequest from "@/app/lib/api-request";
import { CouponType, LoyaltyPointType } from "@/types";
import { Container } from "@mui/material";

async function Page() {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("client-token");
  const token = tokenObj?.value;

  const response = await apiRequest<{
    data: { loyaltyPoint: LoyaltyPointType; coupon: CouponType | null };
  }>("dashboard/loyalty-point", {
    token,
    tag: "fetchCustomerPoint",
    cache: "force-cache",
  });

  const point = response.data.loyaltyPoint;
  const totalEarned = point.totalEarned;
  const totalRedeemed = point.totalRedeemed;
  const referralLink = point.referralLink;
  const currentBalance = point.currentBalance;
  const activeCoupon = response.data.coupon;

  return (
    <Container>
      <LoyaltyPointsCard
        totalEarned={totalEarned}
        totalRedeemed={totalRedeemed}
        referralLink={referralLink}
        currentBalance={currentBalance}
        activeCoupon={activeCoupon}
      />
    </Container>
  );
}

export default Page;
