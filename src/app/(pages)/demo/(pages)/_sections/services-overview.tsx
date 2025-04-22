"use client";

import Favorite from "@/app/icons/untitled-ui/duocolor/favorite";
import SelfImprovement from "@/app/icons/untitled-ui/duocolor/self-improv";
import Spa from "@/app/icons/untitled-ui/duocolor/spa";
import { paths } from "@/paths";
import {
  Box,
  Container,
  Typography,
  Grid2,
  Card,
  CardContent,
  Button,
  SvgIcon,
  useTheme,
} from "@mui/material";
import { useRouter } from "nextjs-toploader/app";

const services = [
  {
    title: "Swedish Massage",
    description:
      "A gentle, relaxing massage to relieve tension and promote circulation.",
    icon: <Spa />,
  },
  {
    title: "Deep Tissue Massage",
    description:
      "Target deeper layers of muscle for relief from chronic pain and stress.",
    icon: <SelfImprovement />,
  },
  {
    title: "Aromatherapy Massage",
    description:
      "Enjoy the benefits of essential oils combined with expert massage techniques.",
    icon: <Favorite />,
  },
];

const ServicesOverview = ({ admin }: { admin: string | undefined }) => {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Box
      sx={{
        position: "relative",
        py: { xs: 8, md: 12 },
        background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
        color: "white",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      {/* Decorative Wave Top */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 100,
          background: "white",
          borderBottomLeftRadius: "50% 20%",
          borderBottomRightRadius: "50% 20%",
        }}
      />

      <Container sx={{ position: "relative", zIndex: 1 }}>
        <Box sx={{mt: 8}}>
          <Typography variant="h3" fontWeight="bold">
            Our Services
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Discover the healing benefits of professional massage therapy.
          </Typography>
        </Box>

        <Grid2 container spacing={4} sx={{ mt: 6 }}>
          {services.map((service, index) => (
            <Grid2 size={{ xs: 12, md: 4 }} key={index}>
              <Card
                sx={{
                  p: 4,
                  borderRadius: 4,
                  textAlign: "center",
                  background: "white",
                  color: "text.primary",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    mx: "auto",
                    mb: 2,
                    borderRadius: "50%",
                    backgroundColor: theme.palette.primary.light,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <SvgIcon fontSize="large" color="primary">
                    {service.icon}
                  </SvgIcon>
                </Box>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {service.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ mt: 1, color: "text.secondary" }}
                  >
                    {service.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>

        <Box sx={{ mt: 8 }}>
          <Button
            variant="contained"
            size="large"
            sx={{
              borderRadius: "999px",
              px: 4,
              py: 1.5,
              fontWeight: 600,
              textTransform: "none",
            }}
            onClick={() =>
              router.push(
                admin
                  ? `${paths.services.index}?admin=${admin}`
                  : paths.services.index
              )
            }
          >
            View All Services
          </Button>
        </Box>
      </Container>

      {/* Decorative Wave Bottom */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 100,
          background: "white",
          borderTopLeftRadius: "50% 20%",
          borderTopRightRadius: "50% 20%",
        }}
      />
    </Box>
  );
};

export default ServicesOverview;
