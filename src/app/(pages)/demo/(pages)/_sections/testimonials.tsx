"use client";

import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  useTheme,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const testimonials = [
  {
    name: "Jessica M.",
    review:
      "Absolutely amazing experience! I feel so much more relaxed and stress-free. Highly recommend!",
    avatar: "/images/testimonials/jessica.jpg",
  },
  {
    name: "Michael R.",
    review:
      "The best massage I've ever had. My back pain is gone, and I feel completely rejuvenated.",
    avatar: "/images/testimonials/michael.jpg",
  },
  {
    name: "Sarah L.",
    review:
      "Professional, calming, and therapeutic. This is now my go-to massage therapist!",
    avatar: "/images/testimonials/sarah.jpg",
  },
  {
    name: "David K.",
    review:
      "A truly wonderful experience. I felt a deep sense of relaxation after my session.",
    avatar: "/images/testimonials/david.jpg",
  },
];

const Testimonials = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "relative",
        py: { xs: 8, md: 12 },
        background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.dark} 100%)`,
        color: "white",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      <Container>
        <Typography variant="h3" fontWeight="bold">
          What Our Clients Say
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, opacity: 0.9 }}>
          Hear from satisfied clients who have experienced the benefits of our
          massage therapy.
        </Typography>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{ delay: 5000 }}
          pagination={{ clickable: true }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1200: { slidesPerView: 3 },
          }}
          style={{ marginTop: "50px", paddingBottom: "40px" }}
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <Card
                sx={{
                  px: 4,
                  py: 6,
                  borderRadius: 4,
                  textAlign: "center",
                  color: "white",
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 4px 30px rgba(0,0,0,0.2)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
                  },
                }}
              >
                <CardContent>
                  <Avatar
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    sx={{
                      width: 80,
                      height: 80,
                      mx: "auto",
                      mb: 2,
                      border: "3px solid white",
                    }}
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      fontStyle: "italic",
                      opacity: 0.9,
                      mb: 2,
                    }}
                  >
                    “{testimonial.review}”
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {testimonial.name}
                  </Typography>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>

      {/* Decorative Soft Glow */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 300,
          height: 300,
          background: theme.palette.primary.main,
          borderRadius: "50%",
          filter: "blur(120px)",
          opacity: 0.15,
          zIndex: 0,
        }}
      />
    </Box>
  );
};

export default Testimonials;
