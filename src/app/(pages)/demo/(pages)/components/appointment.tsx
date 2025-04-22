"use client";

import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Divider,
  Button,
  Stack,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { CustomerAptType } from "@/types";
import { useSearchParams } from "next/navigation";
import EmptyState from "@/app/components/empty-state";
import { useRouter } from "nextjs-toploader/app";
import { useUserData } from "@/app/guards/dashboard/auth";
import { cancelApt, getDasboardAvailability } from "@/actions";
import notify from "@/app/utils/toast";
import CancelConfirmationModal from "./cancel-confirmation";
import { DateTime } from "luxon";
import { DateItem } from "./booking-date-time";
import RescheduleApt from "./reschedule-modal";
import { convertToAmPmFormat } from "@/app/utils/convert-to-am-pm";
import BookAgainModal from "./book-again-modal";

const AppointmentsPage = ({
  appointments,
}: {
  appointments: CustomerAptType[];
}) => {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("status") === "past" ? 1 : 0;
  const [tab, setTab] = useState<number>();
  const [fullZoneName, setFullZoneName] = useState<string | null>(null);
  const [offset, setOffset] = useState("");
  const [duration, setDuration] = useState<number>();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState<{
    name: string;
    id: string;
  }>();
  const [selectedApt, setSelectedApt] = useState<CustomerAptType>();
  const [dates, setDates] = useState<DateItem[]>([]);

  const [openCancel, setOpenCancel] = useState(false);
  const handleOpenCancel = () => setOpenCancel(true);
  const handleCloseCancel = () => setOpenCancel(false);

  const [openRes, setOpenRes] = useState(false);
  const handleOpenRes = () => setOpenRes(true);
  const handleCloseRes = () => setOpenRes(false);

  const [openBookAgain, setOpenBookAgain] = useState(false);
  const handleOpenBookAgain = () => setOpenBookAgain(true);
  const handleCloseBookAgain = () => setOpenBookAgain(false);

  const user = useUserData();
  const theme = useTheme();
  const router = useRouter();

  useEffect(() => {
    setTab(currentTab);
  }, [currentTab]);

  const handleChange = (e: React.SyntheticEvent, newValue: number) => {
    const value = newValue === 0 ? "upcoming" : "past";
    router.push(`/demo/dashboard/bookings?status=${value}`);
  };

  useEffect(() => {
    if (selectedApt) {
      setLoading(true);
      let addonMinutes = 0;

      if (selectedApt?.addons && selectedApt.addons.length > 0) {
        addonMinutes = selectedApt.addons.reduce(
          (total, addon) => total + (addon.duration || 0),
          0
        );
      }

      const service = selectedApt.service;

      const totalMinutes = service.duration! + addonMinutes;

      setDuration(totalMinutes);

      getDasboardAvailability(totalMinutes).then((result) => {
        if (result) {
          if (result?.error) {
            setMessage(result.error);
            setLoading(false);
            handleCloseRes();
          }

          if (result?.availability && result?.timeZone) {
            setDates(result.availability);

            const now = DateTime.now().setZone(result.timeZone);
            setFullZoneName(now.offsetNameLong);
            setOffset(now.toFormat("ZZZZ"));
            setLoading(false);
          }
        }
      });
    }
  }, [selectedApt]);

  const handleCancel = (id: string) => {
    setLoading(true);
    cancelApt(id).then((result) => {
      if (result) {
        if (result?.error) {
          setMessage(result.error);
          setLoading(false);
          handleCloseCancel();
        }

        if (result?.message) {
          notify(result.message);
          setLoading(false);
          handleCloseCancel();
        }
      }
    });
  };

  const renderAppointmentCard = (appt: CustomerAptType) => {
    return (
      <Card
        key={appt.createdAt.toString()}
        sx={{
          mb: 3,
          boxShadow: 4,
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {appt.service.name}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {appt.service.description}
          </Typography>

          <Typography variant="subtitle2">
            <strong>Price:</strong> ${appt.service.price}
          </Typography>
          <Typography variant="subtitle2">
            <strong>Duration:</strong> {appt.service.duration} minutes
          </Typography>
          <Typography variant="subtitle2">
            <strong>Status:</strong> {appt.status}
          </Typography>

          {appt.addons.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1">Add-ons:</Typography>
              {appt.addons.map((addon) => (
                <Box key={addon.bookedAddon} sx={{ ml: 2, mt: 1 }}>
                  <Typography variant="body2">
                    • {addon.name} - ${addon.price} ({addon.duration} min)
                  </Typography>
                  {addon.description && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                      {addon.description}
                    </Typography>
                  )}
                </Box>
              ))}
            </>
          )}

          <Divider sx={{ my: 2 }} />

          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Date:</strong>{" "}
            {dayjs(appt.date).format("dddd, MMMM D, YYYY")}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Time:</strong> {convertToAmPmFormat(appt.bookedTime.from)} -{" "}
            {convertToAmPmFormat(appt.bookedTime.to)}
          </Typography>

          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Discount:</strong> ${appt.discount}
          </Typography>

          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Total Price:</strong> $
            {(appt.price - appt.discount)}
          </Typography>

          {appt.note && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              <strong>Note to therapist:</strong> {appt.note}
            </Typography>
          )}

          {appt.reschedule.isRescheduled && (
            <Typography color="warning.main" sx={{ mt: 2 }}>
              This appointment was rescheduled{" "}
              {appt.reschedule.previousDates.length} times.
            </Typography>
          )}

          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            {appt.status === "pending" ? (
              <>
                <Button
                  variant="contained"
                  onClick={() => {
                    handleOpenRes();
                    setSelectedApt(appt);
                  }}
                >
                  Reschedule
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    handleOpenCancel();
                    setSelectedService({
                      name: appt.service.name,
                      id: appt._id,
                    });
                  }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  handleOpenBookAgain();
                  setSelectedApt(appt);
                }}
              >
                Book Again
              </Button>
            )}
          </Stack>
        </CardContent>

        {selectedService && (
          <CancelConfirmationModal
            open={openCancel}
            onClose={handleCloseCancel}
            onConfirm={() => {
              handleCancel(selectedService.id);
            }}
            serviceName={selectedService.name}
            loading={loading}
          />
        )}

        {selectedApt && duration && (
          <RescheduleApt
            open={openRes}
            onClose={handleCloseRes}
            dates={dates}
            fullZoneName={fullZoneName}
            offset={offset}
            apt={selectedApt._id}
            duration={duration}
            isAdmin={false}
          />
        )}

        {selectedApt && duration && (
          <BookAgainModal
            open={openBookAgain}
            onClose={handleCloseBookAgain}
            dates={dates}
            fullZoneName={fullZoneName}
            offset={offset}
            bookedService={selectedApt.service.bookedService}
            addons={
              selectedApt.addons.length > 0
                ? selectedApt.addons.map((addon) => addon.bookedAddon)
                : []
            }
            note={selectedApt?.note ? selectedApt.note : undefined}
            duration={duration}
          />
        )}
      </Card>
    );
  };

  if (!tab) {
    <Stack alignItems={"center"} justifyContent={"center"}>
      <CircularProgress />
      <Typography textAlign={"center"} variant="body2">
        Fetching appointments...
      </Typography>
    </Stack>;
  }

  return (
    <Box sx={{ maxWidth: "900px", mx: "auto", p: 3 }}>
      <Typography variant="h3" fontWeight="bold" sx={{ mb: 3 }}>
        My Appointments
      </Typography>

      {message && (
        <Typography textAlign={"center"} color="error" variant="subtitle1">
          {message}
        </Typography>
      )}

      {typeof tab !== "undefined" && (
        <Tabs value={tab} onChange={handleChange} variant="fullWidth">
          <Tab label="Upcoming" />
          <Tab label="Past" />
        </Tabs>
      )}

      <Divider sx={{ my: 2 }} />

      {appointments.length > 0 ? (
        appointments.map(renderAppointmentCard)
      ) : (
        <EmptyState
          actionText="Start Booking"
          onAction={() =>
            router.push(
              typeof user !== "string"
                ? `/demo/services?admin=${user.admin}`
                : `/demo/services`
            )
          }
          title={`No Appointment found`}
        />
      )}
    </Box>
  );
};

export default AppointmentsPage;
