import React from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  Link,
  SvgIcon,
  Container,
} from "@mui/material";
import ImpactLogo from "@/app/icons/untitled-ui/duocolor/impact-logo";
import CustomTheme from "@/app/components/custom-theme";
import { Metadata } from "next/types";
import TopLoader from "../demo/(admin)/components/top-loader";

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

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CustomTheme>
      <CssBaseline />
      <TopLoader />
      <Container>
        <AppBar position="static" color="inherit" elevation={1}>
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Box display="flex" alignItems="center" gap={1}>
              <SvgIcon style={{ height: 40 }}>
                <ImpactLogo />
              </SvgIcon>

              <Typography variant="h6" fontWeight="bold">
                ReliefCare Pro
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Built by{" "}
              <Link
                href="https://www.instagram.com/impact_illustration1?igsh=NTc4MTIwNjQ2YQ=="
                target="_blank"
                rel="noopener"
                underline="hover"
                color="primary"
                fontWeight="bold"
              >
                Impact Illustration
              </Link>
            </Typography>
          </Toolbar>
        </AppBar>
      </Container>

      <main>{children}</main>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: "auto",
          textAlign: "center",
          borderTop: "1px solid #e0e0e0",
          backgroundColor: "#fafafa",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} ReleifCare Pro — All rights reserved.
        </Typography>
      </Box>
    </CustomTheme>
  );
}
