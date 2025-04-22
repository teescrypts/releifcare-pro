import React from "react";
import HeroSection from "./_sections/home-hero";
import IntroductionSection from "./_sections/introduction";
import ServicesOverview from "./_sections/services-overview";
import Testimonials from "./_sections/testimonials";
import ContactLocation from "./_sections/contact-location";
import LatestBlogSection from "./_sections/latest-blog";
import ReferralLoyaltyPopup from "./components/referral-loyalty-popup";
import apiRequest from "@/app/lib/api-request";
import { LateestBlogType } from "@/types";

async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const adminId = (await searchParams).admin as string | undefined;
  const response = await apiRequest<{
    data: { latestBlogs: LateestBlogType[] };
  }>(`public/home-data?adminId=${adminId}`, {
    tag: "fetchPublicHomeData",
    cache: "force-cache",
  });

  const data = response.data.latestBlogs;

  return (
    <div>
      <HeroSection admin={adminId} />
      <IntroductionSection admin={adminId} />
      <ServicesOverview admin={adminId} />
      <LatestBlogSection blogs={data} admin={adminId} />
      <Testimonials />
      <ContactLocation />
      <ReferralLoyaltyPopup />
    </div>
  );
}

export default Page;
