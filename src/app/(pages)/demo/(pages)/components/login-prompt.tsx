"use client";

import Lock01 from "@/app/icons/untitled-ui/duocolor/lock-01";
import {
  Box,
  Button,
  Typography,
  Stack,
  Card,
  CardContent,
  SvgIcon,
} from "@mui/material";
import Link from "next/link";

const LoginPrompt = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      mt={8}
      px={2}
    >
      <Card sx={{ maxWidth: 500, width: "100%", textAlign: "center", p: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="center" mb={2}>
            <SvgIcon sx={{ fontSize: 48, color: "primary.main" }}>
              <Lock01 />
            </SvgIcon>
          </Box>

          <Typography variant="h6" gutterBottom>
            Sign in to Book an Appointment
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            You need to be signed in to book a massage appointment. Create a
            free account or log in to continue.
          </Typography>

          <Stack
            spacing={2}
            direction={{ xs: "column", sm: "row" }}
            justifyContent="center"
          >
            <Link href={"/demo/form"}>
              <Button variant="outlined" color="primary" fullWidth>
                Sign Up
              </Button>
            </Link>

            <Link href={"/demo/login"}>
              <Button variant="contained" color="primary" fullWidth>
                Log In
              </Button>
            </Link>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPrompt;
