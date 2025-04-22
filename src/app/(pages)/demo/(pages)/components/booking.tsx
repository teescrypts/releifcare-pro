"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Grid2,
  Card,
  CardContent,
  Divider,
  Stack,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { CustomerServiceType } from "@/types";
import { getAvailability } from "@/actions";
import BookingDateAndTime, { DateItem } from "./booking-date-time";
import { DateTime } from "luxon";
import { useUserData } from "@/app/guards/dashboard/auth";
import LoginPrompt from "./login-prompt";

const BookingPage = ({
  service,
  admin,
}: {
  service: CustomerServiceType;
  admin: string | undefined;
}) => {
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fullZoneName, setFullZoneName] = useState<string | null>(null);
  const [offset, setOffset] = useState("");
  const [timeZone, setTimeZone] = useState("");
  const [message, setMessage] = useState("");
  const [dates, setDates] = useState<DateItem[]>([]);

  const user = useUserData();
  const theme = useTheme();

  useEffect(() => {
    if (service) {
      setSelectedAddOns([]);
    }
  }, [service]);

  const handleAddOnToggle = (id: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleContinue = useCallback(() => {
    setLoading(true);
    let addonMinutes;

    if (selectedAddOns.length > 0) {
      addonMinutes = service.addons
        .filter((addon) => selectedAddOns.includes(addon._id))
        .reduce((total, addon) => total + (addon.duration || 0), 0);
    } else {
      addonMinutes = 0;
    }

    const totalMinutes = service?.duration
      ? service.duration + addonMinutes
      : 0 + addonMinutes;

    getAvailability(totalMinutes, admin).then((result) => {
      if (result) {
        if (result?.error) {
          setMessage(result.error);
          setLoading(false);
        }

        if (result?.availability && result?.timeZone) {
          setDates(result.availability);

          const now = DateTime.now().setZone(result.timeZone);
          setFullZoneName(now.offsetNameLong);
          setOffset(now.toFormat("ZZZZ"));
          setTimeZone(result.timeZone);
          setLoading(false);
        }
      }
    });
  }, [selectedAddOns, admin, service.addons, service.duration]);

  if (typeof user === "string") {
    return <LoginPrompt />;
  }

  return (
    <Container sx={{ mt: 12, pb: 6 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
          Book {service.name}
        </Typography>

        {service.description && (
          <Typography variant="body1" sx={{ color: "text.secondary", mb: 2 }}>
            {service.description}
          </Typography>
        )}

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 2,
          }}
        >
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: "medium", color: "text.secondary" }}
            >
              Price
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              ${service.price.toFixed(2)}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: "medium", color: "text.secondary" }}
            >
              Duration
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {service.duration} minutes
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Add-Ons */}
      {service.addons &&
        service.addons.length > 0 &&
        service.addons.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Add-Ons (Optional)
            </Typography>
            <Grid2 container spacing={2}>
              {service.addons.map((addon) => (
                <Grid2 size={{ xs: 12, sm: 6 }} key={addon._id}>
                  <Card
                    onClick={() => handleAddOnToggle(addon._id)}
                    sx={{
                      cursor: "pointer",
                      border: selectedAddOns.includes(addon._id)
                        ? `2px solid ${theme.palette.primary.main}`
                        : "1px solid #ddd",
                      transition: "0.3s",
                      "&:hover": {
                        borderColor: `${theme.palette.primary.main}`,
                        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        gutterBottom
                      >
                        {addon.name} - ${addon.price}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        {addon.description || "No description provided."}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Duration:{" "}
                        {addon.duration ? `${addon.duration} min` : "N/A"}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid2>
              ))}
            </Grid2>
          </Box>
        )}

      <Button variant="contained" onClick={handleContinue}>
        Continue
      </Button>

      {dates.length > 0 && <Divider sx={{ my: 3 }} />}

      {message && (
        <Typography variant="subtitle2" color="error" textAlign={"center"}>
          {message}
        </Typography>
      )}

      {loading && (
        <Stack alignItems={"center"} justifyContent={"center"}>
          <CircularProgress />
          <Typography variant="body2" textAlign={"center"}>
            Fetching available date and time...
          </Typography>
        </Stack>
      )}

      {dates && (
        <BookingDateAndTime
          admin={admin}
          dates={dates}
          fullZoneName={fullZoneName}
          offset={offset}
          bookedService={{
            _id: service._id,
            name: service.name,
            price: service.price,
            description: service.description,
            duration: service.duration!,
          }}
          addons={
            selectedAddOns.length > 0
              ? service.addons
                  .filter((addon) => selectedAddOns.includes(addon._id))
                  .map((addon) => {
                    return {
                      _id: addon._id,
                      name: addon.name,
                      description: addon.description,
                      price: addon.price,
                      duration: addon.duration!,
                    };
                  })
              : []
          }
          timeZone={timeZone}
        />
      )}

      <Divider sx={{ my: 3 }} />
    </Container>
  );
};

export default BookingPage;
