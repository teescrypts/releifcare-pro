"use client";

import { useActionState, useEffect, useState } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { useRouter } from "nextjs-toploader/app";
import { SubmitButton } from "@/app/components/submit-buttton";
import { ActionStateType } from "@/types";
import { signIn } from "@/actions";

const initialValue: ActionStateType = null;

export default function SignInPage() {
  const router = useRouter();

  const [state, formAction] = useActionState(signIn, initialValue);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (state) {
      if (state?.error) setMessage(state.error);
      if (state?.message) {
        const message = state.message;

        if (message === "admin login") {
          router.push("/demo/admin/appointment");
        } else {
          router.push("/demo/dashboard/bookings");
        }
      }
    }
  }, [state, router]);

  return (
    <Container maxWidth="sm">
      <Card sx={{ mt: 10, p: 3, textAlign: "center", boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Sign In
          </Typography>

          {message && (
            <Typography variant="body2" color="error" mb={2}>
              {message}
            </Typography>
          )}

          <form action={formAction}>
            <Stack spacing={4}>
              <TextField
                label="Email"
                type="email"
                name="email"
                fullWidth
                required
              />
              <TextField
                label="Password"
                type="password"
                name="password"
                fullWidth
                required
              />

              <SubmitButton title="Sign In" isFullWidth />

              <Typography variant="body2">
                Don&apos;t have an account?{" "}
                <Button
                  variant="text"
                  color="primary"
                  size="small"
                  onClick={() => router.push("/demo/form")}
                >
                  Sign Up
                </Button>
              </Typography>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}
