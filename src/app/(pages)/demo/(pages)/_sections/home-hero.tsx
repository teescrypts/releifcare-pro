"use client";

import { paths } from "@/paths";
import { Box, Button, Container, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { useRouter } from "nextjs-toploader/app";
import { useEffect } from "react";

const HeroSection = ({ admin }: { admin: string | undefined }) => {
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    if (admin) localStorage.setItem("adminId", admin);
  }, [admin]);

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        backgroundImage: "url('/images/hero-bg.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "#fff",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7))",
          zIndex: 1,
        },
      }}
    >
      {/* Soft Glow Accent Circles */}
      <Box
        sx={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
          top: "10%",
          left: "5%",
          filter: "blur(100px)",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
          bottom: "10%",
          right: "5%",
          filter: "blur(100px)",
          zIndex: 0,
        }}
      />

      {/* Hero Content */}
      <Container sx={{ position: "relative", zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Typography
            variant="h2"
            fontWeight="bold"
            sx={{
              fontSize: { xs: "2.5rem", md: "3.75rem" },
              lineHeight: 1.2,
              letterSpacing: "-0.5px",
              color: "white",
              textShadow: "0 2px 8px rgba(0,0,0,0.4)",
            }}
          >
            Relax. Rejuvenate. Restore.
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <Typography
            variant="h5"
            mt={2}
            sx={{
              opacity: 0.95,
              fontWeight: 300,
              color: "rgba(255,255,255,0.95)",
              maxWidth: 600,
              mx: "auto",
              textShadow: "0 1px 6px rgba(0,0,0,0.4)",
            }}
          >
            Curated wellness experiences crafted to gently restore, realign, and
            reconnect you to your truest self
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Button
            variant="contained"
            size="large"
            sx={{
              mt: 4,
              px: 5,
              py: 1.5,
              fontSize: "1rem",
              fontWeight: "bold",
              borderRadius: "999px",
              background: `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.primary.darkest})`,
              color: "#fff",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              "&:hover": {
                background: `linear-gradient(90deg, ${theme.palette.primary.darkest}, ${theme.palette.primary.dark})`,
              },
            }}
            onClick={() =>
              router.push(
                admin
                  ? `${paths.services.index}?admin=${admin}`
                  : paths.services.index
              )
            }
          >
            Book a Session
          </Button>
        </motion.div>
      </Container>
    </Box>
  );
};

export default HeroSection;
