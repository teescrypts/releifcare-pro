"use client";

import { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  SvgIcon,
} from "@mui/material";
import { useRouter } from "nextjs-toploader/app";
import Close from "@/app/icons/untitled-ui/duocolor/close";
import Loyalty from "@/app/icons/untitled-ui/duocolor/loyalty";
import Group from "@/app/icons/untitled-ui/duocolor/group";
import Percentage from "@/app/icons/untitled-ui/duocolor/percentage";

const ReferralLoyaltyModal = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const popUpViewed = localStorage.getItem("popUpViewed");

    if (!popUpViewed) {
      const timer = setTimeout(() => {
        setOpen(true);
        localStorage.setItem("popUpViewed", "true");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => setOpen(false);

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 420 },
          bgcolor: "rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 4,
          p: 4,
          textAlign: "center",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          color: "#fff",
          animation: "modalFade 0.6s ease",
          "@keyframes modalFade": {
            from: {
              opacity: 0,
              transform: "translate(-50%, -60%) scale(0.96)",
            },
            to: {
              opacity: 1,
              transform: "translate(-50%, -50%) scale(1)",
            },
          },
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            color: "white",
            bgcolor: "rgba(255,255,255,0.1)",
            "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
          }}
        >
          <Close />
        </IconButton>

        {/* Modal Title */}
        <Typography
          variant="h5"
          fontWeight="bold"
          gutterBottom
          sx={{
            fontFamily: "'Playfair Display', serif",
            letterSpacing: "0.5px",
            textShadow: "0 0 10px rgba(255,255,255,0.4)",
          }}
        >
          Loyalty Looks Good On You ✨
        </Typography>

        {/* Modal Subtitle */}
        <Typography variant="body2" sx={{ opacity: 0.9, mb: 3 }}>
          Earn exclusive perks, points, and offers — just for being you.
        </Typography>

        {/* Perk Sections */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
            textAlign: "left",
          }}
        >
          {/* Perk Item */}
          {[
            {
              icon: <Loyalty />,
              color: "#FFD700",
              text: "Earn points when you book sessions — redeem for discounts.",
            },
            {
              icon: <Group />,
              color: "#1E90FF",
              text: "Refer friends and receive bonus rewards when they book with us.",
            },
            {
              icon: <Percentage />,
              color: "#32CD32",
              text: "Apply points toward premium services & spa packages.",
            },
          ].map((perk, index) => (
            <Box
              key={index}
              sx={{ display: "flex", alignItems: "center", gap: 2 }}
            >
              <Box
                sx={{
                  bgcolor: "rgba(255,255,255,0.1)",
                  p: 1.5,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SvgIcon sx={{ color: perk.color }}>{perk.icon}</SvgIcon>
              </Box>
              <Typography
                variant="body2"
                sx={{ color: "#fff", lineHeight: 1.6 }}
              >
                {perk.text}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* CTA Button */}
        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 4,
            py: 1.5,
            fontWeight: "bold",
            bgcolor: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "white",
            backdropFilter: "blur(6px)",
            borderRadius: 8,
            transition: "all 0.3s ease",
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.25)",
              transform: "scale(1.02)",
            },
          }}
          onClick={() => router.push("/demo/form")}
        >
          Sign Up & Start Earning
        </Button>
      </Box>
    </Modal>
  );
};

export default ReferralLoyaltyModal;
