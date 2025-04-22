"use client";

import { paths } from "@/paths";
import { Box, Container, Typography, Grid2, Button } from "@mui/material";
import Image from "next/image";
import { useRouter } from "nextjs-toploader/app";

const IntroductionSection = ({ admin }: { admin: string | undefined }) => {
  const router = useRouter();

  return (
    <Box
      sx={{
        py: { xs: 6, md: 12 },
        backgroundColor: "background.default",
      }}
    >
      <Container>
        <Grid2 container spacing={4} alignItems="center">
          {/* Left: Text Content */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Typography variant="h3" fontWeight="bold" color="primary">
              Meet Your Therapist
            </Typography>
            <Typography variant="body1" sx={{ mt: 2, opacity: 0.8 }}>
              Hi, I&apos;m Andrea, a certified massage therapist with 5 years of
              experience in holistic healing and relaxation therapy. My mission
              is to help you feel rejuvenated, reduce stress, and restore
              balance to your body and mind through the power of touch.
            </Typography>
            <Typography variant="body1" sx={{ mt: 2, opacity: 0.8 }}>
              Whether you&apos;re looking for deep tissue therapy, Swedish massage,
              or a moment of pure relaxation, I create personalized treatments
              to meet your needs in a tranquil and welcoming environment.
            </Typography>
            <Button
              variant="contained"
              sx={{
                mt: 3,
                bgcolor: "primary.main",
                "&:hover": { bgcolor: "primary.dark" },
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
          </Grid2>

          {/* Right: Image */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: { xs: "300px", md: "400px" },
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: 3,
              }}
            >
              <Image
                src="/images/therapist.webp" // Update with actual image path
                alt="Massage Therapist"
                layout="fill"
                objectFit="cover"
              />
            </Box>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
};

export default IntroductionSection;
