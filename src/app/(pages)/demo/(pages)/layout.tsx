import React, { ReactNode } from "react";
import { AuthGuard } from "@/app/guards/dashboard/auth";
import CustomerLayout from "./components/customer-layout";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "ReliefCare Pro | Massage & Chiropractic Demo",
  description:
    "Experience ReliefCare Pro — a modern live demo website built for massage therapists and chiropractors. Explore features like appointment booking, client records, SOAP notes, loyalty rewards, and more.",
  keywords:
    "massage therapist demo, chiropractic software, appointment booking, client intake form, SOAP notes, loyalty system, modern wellness platform, ReliefCare Pro, massage software",
  icons: {
    icon: "/images/logo.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "ReliefCare Pro | Massage & Chiropractic Demo",
    description:
      "A complete demo solution for wellness professionals. Explore ReliefCare Pro — built with modern tools for streamlined practice management.",
    url: "https://releifcare.live",
    type: "website",
    images: [
      {
        url: "https://releifcare.live/images/logo.png",
        width: 1200,
        height: 630,
        alt: "ReliefCare Pro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ReliefCare Pro | Massage & Chiropractic Demo",
    description:
      "Check out the live demo of ReliefCare Pro — built for massage therapists and chiropractors with powerful features like booking, records, notes, and rewards.",
    images: ["https://releifcare.live/images/logo.png"],
  },
};

function Layout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <CustomerLayout>{children}</CustomerLayout>
    </AuthGuard>
  );
}

export default Layout;
