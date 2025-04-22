import React from "react";
import IntroductionSection from "../_sections/introduction";
import Testimonials from "../_sections/testimonials";

async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const adminId = (await searchParams).admin as string | undefined;

  return (
    <>
      <IntroductionSection admin={adminId} />
      <Testimonials />
    </>
  );
}

export default Page;
