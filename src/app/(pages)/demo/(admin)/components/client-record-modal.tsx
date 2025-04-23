"use client";

import Close from "@/app/icons/untitled-ui/duocolor/close";
import { ClientDataType } from "@/types";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Stack,
  Grid2,
  Chip,
  Paper,
  CircularProgress,
} from "@mui/material";

interface ClientRecordDrawerProps {
  open: boolean;
  onClose: () => void;
  clientData: ClientDataType | undefined;
}

export default function ClientRecordDrawer({
  open,
  onClose,
  clientData,
}: ClientRecordDrawerProps) {
  const data = clientData;

  const InfoGroup = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Typography variant="subtitle1" fontWeight={600} mb={1}>
        {title}
      </Typography>
      {children}
    </Paper>
  );

  const InfoItem = ({ label, value }: { label: string; value: string }) => (
    <Grid2 size={{ xs: 12 }}>
      <Typography variant="body2">
        <strong>{label}:</strong> {value}
      </Typography>
    </Grid2>
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: 420, borderRadius: "12px 0 0 12px" } }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        px={3}
        py={2}
      >
        <Typography variant="h6" fontWeight={600}>
          Client Record
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      <Divider />

      {data ? (
        <Box px={3} py={2} sx={{ overflowY: "auto", height: "100%" }}>
          <Stack spacing={3}>
            <InfoGroup title="Personal Information">
              <Grid2 container spacing={1}>
                <InfoItem label="Name" value={`${data.fname} ${data.lname}`} />
                <InfoItem label="Email" value={data.email} />
                <InfoItem label="Phone" value={data.phone} />

                <InfoItem label="Gender" value={data.gender} />
                <InfoItem
                  label="Emergency Contact"
                  value={data.emergencyContact}
                />
              </Grid2>
            </InfoGroup>

            <InfoGroup title="Massage Preferences">
              <Grid2 container spacing={1}>
                {/* Optional: Massage Pressure & Focus Areas can be included if it's needed */}
                <InfoItem
                  label="Massage Pressure"
                  value={data?.massagePressure || "Not entered"}
                />
                <InfoItem
                  label="Focus Areas"
                  value={data?.focusAreas || "Not entered"}
                />
                {/* Allergies should be treated with care */}
                <InfoItem
                  label="Allergies"
                  value={data?.allergies || "Not entered"}
                />
              </Grid2>
            </InfoGroup>

            <InfoGroup title="Consent">
              <Chip
                label={data.consent ? "Consent Given" : "No Consent"}
                color={data.consent ? "success" : "error"}
                sx={{ fontWeight: 500, width: "fit-content" }}
              />
            </InfoGroup>
          </Stack>
        </Box>
      ) : (
        <Stack justifyContent={"center"} alignItems={"center"}>
          <CircularProgress />
          <Typography>Loading Data...</Typography>
        </Stack>
      )}
    </Drawer>
  );
}
