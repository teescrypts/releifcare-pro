"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Stack,
  Card,
  CardContent,
  Typography,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { LoyaltyPointType } from "@/types";
import { editLoyaltyPointSettings } from "@/actions";
import notify from "@/app/utils/toast";
import { ManualSubmitButton } from "@/app/components/edit-button";

function MarketingPage({ settings }: { settings: LoyaltyPointType }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentSettings, setCurrentSettings] = useState<LoyaltyPointType>();

  useEffect(() => {
    const { isActive, bookingsForPoint, referralsForPoint, pointValue } =
      settings;

    setCurrentSettings({
      isActive,
      bookingsForPoint,
      referralsForPoint,
      pointValue,
    } as LoyaltyPointType);
  }, [settings]);

  const handleEditSettings = () => {
    if (currentSettings) {
      setLoading(true);
      editLoyaltyPointSettings(currentSettings).then((result) => {
        if (result?.error) {
          setMessage(result.error);
          setLoading(false);
        }

        if (result?.message) {
          notify(result.message);
          setLoading(false);
        }
      });
    }
  };

  if (!currentSettings) {
    return (
      <Typography variant="subtitle1" textAlign={"center"}>
        Fetching Settings
      </Typography>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
        Loyalty & Referral Settings
      </Typography>

      {message && (
        <Typography variant="subtitle2" textAlign={"center"} color="error">
          {message}
        </Typography>
      )}

      {/* Loyalty Points */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <FormControlLabel
            name="isActive"
            control={
              <Switch
                checked={currentSettings.isActive}
                onChange={(e) =>
                  setCurrentSettings((prev) => {
                    if (prev) {
                      return { ...prev, [e.target.name]: e.target.checked };
                    }
                  })
                }
              />
            }
            label="Enable Loyalty Program"
          />
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Loyalty Points
          </Typography>
          <Stack spacing={2}>
            <TextField
              value={currentSettings.bookingsForPoint}
              onChange={(e) =>
                setCurrentSettings((prev) => {
                  if (prev) {
                    return { ...prev, [e.target.name]: e.target.value };
                  }
                })
              }
              variant="outlined"
              label="Bookings Required to Earn 1 Point"
              type="number"
              name="bookingsForPoint"
              fullWidth
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Referral Points */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Referral Points
          </Typography>
          <Stack spacing={2}>
            <TextField
              value={currentSettings.referralsForPoint}
              onChange={(e) =>
                setCurrentSettings((prev) => {
                  if (prev) {
                    return { ...prev, [e.target.name]: e.target.value };
                  }
                })
              }
              variant="outlined"
              label="Referrals Required to Earn 1 Point"
              type="number"
              name="referralsForPoint"
              fullWidth
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Point Value */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Point Value
          </Typography>
          <Stack spacing={2}>
            <TextField
              value={currentSettings.pointValue}
              onChange={(e) =>
                setCurrentSettings((prev) => {
                  if (prev) {
                    return { ...prev, [e.target.name]: e.target.value };
                  }
                })
              }
              label="Monetary Equivalent of 1 Point ($)"
              type="number"
              name="pointValue"
              variant="outlined"
              fullWidth
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Save Button */}
      <ManualSubmitButton
        loading={loading}
        onClick={handleEditSettings}
        isFullWidth={true}
        title="Save Settings"
      />
    </Container>
  );
}

export default MarketingPage;
