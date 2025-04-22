"use client";

import { convertToAmPmFormat } from "@/app/utils/convert-to-am-pm";
import { formatToUSDate } from "@/app/utils/format-date";
import { AppointmentType } from "@/types";
import { Box, Typography, Stack, Chip, Paper, Divider } from "@mui/material";

export default function AppointmentDetails({
  data,
}: {
  data: AppointmentType;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      default:
        return "error";
    }
  };

  return (
    <Paper elevation={3} sx={{ borderRadius: 3, p: 4 }}>
      <Stack spacing={3}>
        <Typography variant="h5" fontWeight={600}>
          Appointment Details
        </Typography>

        <Divider />

        <Stack spacing={1}>
          <DetailItem
            label="Client"
            value={`${data.client.fname} ${data.client.lname}`}
          />
          <DetailItem label="Service" value={data.service.name} />
          <DetailItem
            label="Add-ons"
            value={
              data.addons.length > 0
                ? data.addons.map((addon) => addon.name).join(", ")
                : "None"
            }
          />
          <DetailItem label="Date" value={formatToUSDate(data.date)} />
          <DetailItem
            label="Time"
            value={`${convertToAmPmFormat(
              data.bookedTime.from
            )} - ${convertToAmPmFormat(data.bookedTime.to)}`}
          />
          <DetailItem label="Discount" value={`$${data.discount}`} />
          <DetailItem label="Total Price" value={`$${data.price}`} />
          {data.note && <DetailItem label="Client Note" value={data.note} />}
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="subtitle2" fontWeight={500}>
              Status:
            </Typography>
            <Chip
              label={data.status.toUpperCase()}
              color={getStatusColor(data.status)}
              sx={{ fontWeight: 600, letterSpacing: 0.5 }}
            />
          </Stack>
        </Stack>

        {data.reschedule.isRescheduled && (
          <>
            <Divider />
            <Box>
              <Typography variant="subtitle1">Reschedule History</Typography>

              <Typography variant="body2" mb={1}>
                Appointment was rescheduled{" "}
                {data.reschedule.previousDates.length} times
              </Typography>
              <Stack component="ul" spacing={0.5} pl={2}>
                {data.reschedule.previousDates.map((entry, idx) => (
                  <li key={idx}>
                    <Typography variant="body2">
                      {formatToUSDate(entry.date)} (
                      {convertToAmPmFormat(entry.bookedTime.from)} -{" "}
                      {convertToAmPmFormat(entry.bookedTime.to)})
                    </Typography>
                  </li>
                ))}
              </Stack>
            </Box>
          </>
        )}
      </Stack>
    </Paper>
  );
}

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <>
    <Stack direction="row" spacing={1}>
      <Typography variant="subtitle2">{label}:</Typography>
      <Typography variant="body1" color="text.secondary">
        {value}
      </Typography>
    </Stack>
  </>
);
