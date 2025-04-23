"use client";

import { Box, Button, Typography, useTheme } from "@mui/material";
import Image from "next/image";
import { useRouter } from "nextjs-toploader/app";
import React from "react";

const HomeHeroSection: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        color: "#1a1a1a",
        pb: 16,
        pt: 12,
        background: `linear-gradient(180deg, #fefefe 0%, #f3f4f6 100%)`,
        textAlign: "center",
      }}
    >
      {/* Top Decorative Wave */}
      <Box
        component="svg"
        viewBox="0 0 1440 320"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          transform: "translateY(-99%)",
        }}
      >
        <path
          fill="#fff"
          d="M0,32L60,48C120,64,240,96,360,122.7C480,149,600,171,720,181.3C840,192,960,192,1080,176C1200,160,1320,128,1380,112L1440,96V0H1380C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0H0Z"
        />
      </Box>

      {/* Text Content */}
      <Box sx={{ px: 2, zIndex: 2, position: "relative" }}>
        <Typography
          variant="h2"
          fontWeight={700}
          sx={{ maxWidth: 800, mx: "auto", mb: 2 }}
        >
          Empowering Massage Therapists and Chiropractors
        </Typography>

        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 700, mx: "auto", mb: 4 }}
        >
          Explore this live demo website built for independent massage
          therapists and chiropractors. It showcases powerful features like
          appointment booking and management, client intake forms, and loyalty
          rewards — all customizable for your unique practice
        </Typography>

        <Button
          variant="contained"
          size="large"
          sx={{
            borderRadius: "999px",
            px: 4,
            py: 1.5,
            fontWeight: "bold",
            textTransform: "none",
            backgroundColor: theme.palette.primary.dark,
            ":hover": {
              backgroundColor: theme.palette.primary.darkest,
            },
          }}
          onClick={() => router.push("/demo/sign-up")}
        >
          Explore Demo
        </Button>
      </Box>

      {/* Hero Illustration */}
      <Box
        sx={{
          mt: 8,
          position: "relative",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Image
          src="/images/hero-illustration.png"
          alt="Massage Therapy Illustration"
          width={800}
          height={500}
          style={{
            maxWidth: "100%",
            height: "auto",
            zIndex: 2,
            borderRadius: 12,
            boxShadow: "0px 20px 40px rgba(0,0,0,0.1)",
          }}
        />
      </Box>

      {/* Bottom Decorative Wave */}
      <Box
        component="svg"
        viewBox="0 0 1440 320"
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
        }}
      >
        <path
          fill="#fff"
          d="M0,288L60,272C120,256,240,224,360,208C480,192,600,192,720,213.3C840,235,960,277,1080,277.3C1200,277,1320,235,1380,213.3L1440,192V320H1380C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320H0Z"
        />
      </Box>
    </Box>
  );
};

export default HomeHeroSection;
