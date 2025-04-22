"use client";

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid2,
  Divider,
  Tooltip,
  IconButton,
  Snackbar,
  useTheme,
  Button,
  Alert,
  Stack,
} from "@mui/material";
import Copy from "@/app/icons/untitled-ui/duocolor/copy";
import CheckCircle from "@/app/icons/untitled-ui/duocolor/checked-circle";
import Help from "@/app/icons/untitled-ui/duocolor/help";
import { CouponType } from "@/types";
import { redeemPoint } from "@/actions";
import notify from "@/app/utils/toast";

interface LoyaltyPointsProps {
  totalEarned: number;
  totalRedeemed: number;
  referralLink: string;
  currentBalance: number;
  activeCoupon: CouponType | null;
}

const LoyaltyPointsCard: React.FC<LoyaltyPointsProps> = ({
  totalEarned,
  totalRedeemed,
  referralLink,
  currentBalance,
  activeCoupon,
}) => {
  const [copied, setCopied] = React.useState(false);
  const [redeeming, setRedeeming] = useState(false);
  const [message, setMessage] = useState("");

  const theme = useTheme();

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
  };

  const handleRedeem = () => {
    if (currentBalance > 0) {
      setRedeeming(true);
      redeemPoint().then((result) => {
        if (result) {
          if (result?.error) {
            setMessage(result.error);
            setRedeeming(false);
          }
          if (result?.message) {
            notify(result.message);
            setRedeeming(false);
          }
        }
      });
    }
  };

  return (
    <Card>
      <CardContent>
        <Stack direction={"row"} justifyContent="space-between" mb={2}>
          <Typography variant="h6" fontWeight={600}>
            Loyalty Points
          </Typography>
          <Tooltip title="Earn points by booking or referring friends!">
            <Help color="action" />
          </Tooltip>
        </Stack>

        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                background: theme.palette.success.alpha12,
                borderRadius: 2,
                p: 2,
                textAlign: "center",
              }}
            >
              <Typography variant="h4" color="primary" fontWeight={700}>
                {currentBalance}
              </Typography>
              <Typography variant="subtitle2">Available Points</Typography>
            </Box>
          </Grid2>

          <Grid2 size={{ xs: 6, md: 4 }}>
            <Box
              sx={{
                background: theme.palette.primary.alpha12,
                borderRadius: 2,
                p: 2,
                textAlign: "center",
              }}
            >
              <Typography variant="h4" color="primary" fontWeight={700}>
                {totalEarned}
              </Typography>
              <Typography variant="subtitle2">Points Earned</Typography>
            </Box>
          </Grid2>

          <Grid2 size={{ xs: 6, md: 4 }}>
            <Box
              sx={{
                background: theme.palette.error.alpha12,
                borderRadius: 2,
                p: 2,
                textAlign: "center",
              }}
            >
              <Typography variant="h4" color="secondary" fontWeight={700}>
                {totalRedeemed}
              </Typography>
              <Typography variant="subtitle2">Points Redeemed</Typography>
            </Box>
          </Grid2>
        </Grid2>

        <Divider sx={{ my: 3 }} />

        <Box mb={2}>
          <Typography variant="subtitle1">Your Referral Link</Typography>
          <Box
            sx={{
              border: "1px solid #ddd",
              borderRadius: 2,
              p: 1,
            }}
          >
            <Stack direction={"row"} justifyContent="space-between">
              <Typography
                variant="body2"
                sx={{
                  mr: 1,
                }}
              >
                {referralLink}
              </Typography>
              <IconButton onClick={handleCopy}>
                <Copy fontSize="small" />
              </IconButton>
            </Stack>
          </Box>
        </Box>

        {/* Redeem Section */}
        <Divider sx={{ my: 3 }} />
        {message && (
          <Typography variant="subtitle2" color="error" textAlign={"center"}>
            {message}
          </Typography>
        )}

        {activeCoupon ? (
          <Box>
            <Typography variant="subtitle1" mb={1} fontWeight={600}>
              You have an active coupon!
            </Typography>

            <Alert
              severity="info"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Box>
                <Typography>
                  Code: <strong>{activeCoupon.code}</strong>
                </Typography>
                <Typography>
                  Value: <strong>${activeCoupon.value}</strong>
                </Typography>
              </Box>
              <Tooltip title="Copy code">
                <IconButton
                  onClick={() => {
                    navigator.clipboard.writeText(activeCoupon.code);
                    setCopied(true); // You’ll need `const [copied, setCopied] = useState(false);`
                  }}
                  sx={{ ml: 2 }}
                >
                  <Copy fontSize="small" />
                </IconButton>
              </Tooltip>
            </Alert>

            <Snackbar
              open={copied}
              autoHideDuration={2000}
              onClose={() => setCopied(false)}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <Alert
                onClose={() => setCopied(false)}
                severity="success"
                elevation={6}
                variant="filled"
                icon={<CheckCircle />}
                sx={{ width: "100%" }}
              >
                Coupon code copied!
              </Alert>
            </Snackbar>
          </Box>
        ) : (
          <Box>
            <Typography variant="subtitle1" mb={1}>
              Redeem Points for Coupon
            </Typography>

            <Button
              variant="contained"
              color="primary"
              onClick={handleRedeem}
              disabled={currentBalance <= 0 || redeeming}
            >
              Redeem Coupon
            </Button>
          </Box>
        )}

        <Snackbar
          open={copied}
          autoHideDuration={2000}
          onClose={() => setCopied(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setCopied(false)}
            severity="success"
            elevation={6}
            variant="filled"
            icon={<CheckCircle />}
            sx={{ width: "100%" }}
          >
            Referral link copied!
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default LoyaltyPointsCard;
