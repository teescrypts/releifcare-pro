import React from "react";
import HomeHeroSection from "./components/home-hero";
import FeaturesSection from "./components/features";
import StripeOnDemandSection from "./components/stripe-on-demand";

function Page() {
  return (
    <div>
      <HomeHeroSection />
      <FeaturesSection />
      <StripeOnDemandSection />
    </div>
  );
}

export default Page;
