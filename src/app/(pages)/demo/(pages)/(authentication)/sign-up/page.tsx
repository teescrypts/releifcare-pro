import { Container, Box, Typography } from "@mui/material";
import React from "react";
import Motion from "@/app/components/motion";
import DemoLogin from "../components/demo-login";

function Page() {
  return (
    <Container
      maxWidth="sm"
      sx={{ mt: 8, mb: 8, fontFamily: "Poppins, sans-serif" }}
    >
      <Motion>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" fontWeight="bold">
            Create Your Account
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Sign up for a demo account using any email. The account will be
            deactivated after 2 hours.
          </Typography>
        </Box>
      </Motion>
      <DemoLogin />
    </Container>
  );
}

export default Page;
