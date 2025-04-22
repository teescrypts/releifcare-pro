"use client";

import Article from "@/app/icons/untitled-ui/duocolor/articule";
import Assignment from "@/app/icons/untitled-ui/duocolor/assignment";
import CheckDone01 from "@/app/icons/untitled-ui/duocolor/check-done-01";
import EventBusy from "@/app/icons/untitled-ui/duocolor/event-busy";
import Loyalty from "@/app/icons/untitled-ui/duocolor/loyalty";
import {
  Box,
  Typography,
  Grid2,
  Card,
  CardContent,
  SvgIcon,
  Container,
} from "@mui/material";

const features = [
  {
    icon: (
      <SvgIcon color="primary" sx={{ fontSize: 40 }}>
        <EventBusy />
      </SvgIcon>
    ),
    title: "Appointment Booking",
    description:
      "Seamlessly book and manage client appointments with a modern, easy-to-use interface.",
  },
  {
    icon: (
      <SvgIcon color="primary" sx={{ fontSize: 40 }}>
        <Loyalty />
      </SvgIcon>
    ),
    title: "Loyalty Point System",
    description:
      "Reward clients for bookings and referrals with redeemable points and coupons.",
  },
  {
    icon: (
      <SvgIcon color="primary" sx={{ fontSize: 40 }}>
        <Assignment />
      </SvgIcon>
    ),
    title: "SOAP Notes",
    description:
      "Create, manage, and review detailed SOAP notes for each client session.",
  },
  {
    icon: (
      <SvgIcon color="primary" sx={{ fontSize: 40 }}>
        <CheckDone01 />
      </SvgIcon>
    ),
    title: "Client Intake Forms",
    description:
      "Collect health history, goals, and preferences before each session.",
  },
  {
    icon: (
      <SvgIcon color="primary" sx={{ fontSize: 40 }}>
        <Article />
      </SvgIcon>
    ),
    title: "Blog & Articles",
    description:
      "Share wellness tips, promote services, and build trust with clients through engaging content.",
  },
];

const FeaturesSection: React.FC = () => {

  return (
    <Container>
      <Box
        sx={{
          py: 10,
          px: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="h4" fontWeight={700}>
          Powerful Websites for Healing Professionals — All in One Place
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          maxWidth={700}
          mx="auto"
          mb={6}
        >
          Customized website for wellness pros who want to save time, stay
          organized, and focus on client results.
        </Typography>

        <Grid2 container spacing={4} justifyContent="center">
          {features.map((feature, index) => (
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  p: 2,
                  boxShadow: 3,
                  textAlign: "center",
                }}
              >
                <CardContent>
                  <Box mb={2}>{feature.icon}</Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      </Box>
    </Container>
  );
};

export default FeaturesSection;
