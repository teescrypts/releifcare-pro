"use client";

import Assignment from "@/app/icons/untitled-ui/duocolor/assignment";
import CheckDone01 from "@/app/icons/untitled-ui/duocolor/check-done-01";
import EventAvailable from "@/app/icons/untitled-ui/duocolor/event-available";
import FolderShared from "@/app/icons/untitled-ui/duocolor/folder-shared";
import type {
  ButtonPropsColorOverrides,
  ButtonPropsVariantOverrides,
} from "@mui/material/Button";
import type { OverridableStringUnion } from "@mui/types";

import {
  Button,
  Grid2,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

type Action = {
  label: string;
  onClick: () => void;
  color?: OverridableStringUnion<
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning",
    ButtonPropsColorOverrides
  >;
  variant?: OverridableStringUnion<
    "text" | "outlined" | "contained",
    ButtonPropsVariantOverrides
  >;
  icon?: React.ReactNode;
  disabled?: boolean;
};

interface ActionsPanelProps {
  loading: boolean;
  handleCompleteBooking: () => void;
  onOpenSOAP: () => void;
  onOpenReschedule: () => void;
  onOpenClientRecord: () => void;
  onOpenPreviousSOAP: () => void;
}

export default function ActionsPanel({
  loading,
  handleCompleteBooking,
  onOpenSOAP,
  onOpenReschedule,
  onOpenClientRecord,
  onOpenPreviousSOAP,
}: ActionsPanelProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const actions: Action[] = [
    {
      label: "Mark as Completed",
      onClick: () => handleCompleteBooking(),
      color: "success",
      variant: "contained",
      icon: <CheckDone01 />,
      disabled: loading,
    },
    {
      label: "Reschedule Appointment",
      onClick: onOpenReschedule,
      color: "primary",
      variant: "outlined",
      icon: <EventAvailable />,
    },
    {
      label: "View Client Record",
      onClick: onOpenClientRecord,
      color: "primary",
      variant: "outlined",
      icon: <FolderShared />,
    },
    {
      label: "Read SOAP Notes",
      onClick: onOpenPreviousSOAP,
      color: "primary",
      variant: "outlined",
      icon: <Assignment />,
    },
    {
      label: "Update SOAP Note",
      onClick: onOpenSOAP,
      color: "secondary",
      variant: "outlined",
      icon: <Assignment />,
    },
  ];

  return (
    <Paper
      elevation={4}
      sx={{
        borderRadius: 4,
        p: 3,
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(to right, #1e1e1e, #2c2c2c)"
            : "linear-gradient(to right, #fff, #f9f9f9)",
        boxShadow: `0px 4px 20px ${
          theme.palette.mode === "dark" ? "#111" : "#ddd"
        }`,
        transition: "all 0.3s ease-in-out",
      }}
    >
      <Typography variant="h6" fontWeight={700} mb={3}>
        Quick Actions
      </Typography>

      <Grid2 container spacing={2}>
        {actions.map((action, index) => (
          <Grid2 key={index} size={{ xs: 12, sm: 6, md: 4 }}>
            <Button
              fullWidth
              variant={action.variant}
              color={action.color}
              startIcon={action.icon}
              onClick={action.onClick}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                px: 2,
                py: 1.5,
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: theme.shadows[4],
                },
              }}
              size={isMobile ? "medium" : "large"}
            >
              {action.label}
            </Button>
          </Grid2>
        ))}
      </Grid2>
    </Paper>
  );
}
