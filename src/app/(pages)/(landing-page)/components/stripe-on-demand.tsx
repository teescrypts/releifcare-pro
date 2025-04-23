"use client";

import CheckCircle from "@/app/icons/untitled-ui/duocolor/checked-circle";
import CreditCard01 from "@/app/icons/untitled-ui/duocolor/credit-card-01";
import {
  Container,
  Stack,
  Typography,
  Box,
  Grid2,
  useTheme,
  SvgIcon,
} from "@mui/material";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionStack = motion(Stack);

export default function StripeOnDemandSection() {
  const theme = useTheme();

  const checklist = [
    "Accept payments via Stripe (credit/debit, Apple Pay, etc.)",
    "HIPAA-friendly, secure implementation",
    "Branded checkout experience with optional receipts",
    "Available as a paid upgrade — only if you need it",
  ];

  return (
    <Box
      component="section"
      sx={{
        mb:4,
        background: `linear-gradient(180deg, ${theme.palette.background.default}, ${theme.palette.grey[100]})`,
      }}
    >
      <Container maxWidth="md">
        <MotionStack
          spacing={4}
          alignItems="center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              backgroundColor: theme.palette.primary.light,
              color: theme.palette.primary.main,
            }}
          >
            <SvgIcon fontSize={"large"}>
              <CreditCard01 />
            </SvgIcon>
          </Box>

          <Typography variant="h4" fontWeight={600} align="center">
            Online Payments? Available On Demand
          </Typography>

          <Typography
            variant="body1"
            align="center"
            color="text.secondary"
            maxWidth="sm"
          >
            Online payments are not included in the demo by default. However,
            secure Stripe integration can be added on demand to enable credit
            card and digital payments — designed to fit your workflow and
            branding. Available as a paid upgrade.
          </Typography>

          <Grid2 container spacing={2} mt={2}>
            {checklist.map((item, index) => (
              <Grid2 size={{xs:12, sm: 6}}  key={index}>
                <MotionBox
                  display="flex"
                  alignItems="flex-start"
                  gap={1}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  viewport={{ once: true }}
                >
                  <SvgIcon color="success">
                    <CheckCircle />
                  </SvgIcon>

                  <Typography variant="body2" color="text.primary">
                    {item}
                  </Typography>
                </MotionBox>
              </Grid2>
            ))}
          </Grid2>
        </MotionStack>
      </Container>
    </Box>
  );
}
