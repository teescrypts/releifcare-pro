"use client";

import { fetchSOAPNoteForApt } from "@/actions";
import Close from "@/app/icons/untitled-ui/duocolor/close";
import {
  Drawer,
  Box,
  Typography,
  Stack,
  IconButton,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import SOAPFormEdit from "./SOAP-form-edit";
import SOAPFormAdd from "./SOAP-form-add";

interface SOAPNoteDrawerProps {
  open: boolean;
  onClose: () => void;
  client: string;
  appointment: string;
}

export interface FormType {
  _id: string;
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
}

export default function SOAPNoteDrawer({
  open,
  onClose,
  client,
  appointment,
}: SOAPNoteDrawerProps) {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState<FormType | undefined>();

  const theme = useTheme();

  useEffect(() => {
    if (open) {
      fetchSOAPNoteForApt(client, appointment).then((result) => {
        if (result?.error) {
          setMessage(result.error);
          setLoading(false);
        }

        if (result?.message) {
          if (typeof result.message !== "string") {
            const SOAPData = result.message;
            setForm({
              _id: SOAPData._id,
              subjective: SOAPData.subjective,
              objective: SOAPData.objective,
              assessment: SOAPData.assessment,
              plan: SOAPData.plan,
            });
            setLoading(false);
            setMessage("");
          }
        }
      });
    }
  }, [open, appointment, client]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { width: 440, borderRadius: "12px 0 0 12px", overflow: "hidden" },
        },
      }}
    >
      {/* Sticky Header */}
      <Box
        px={3}
        py={2}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          backgroundColor: theme.palette.background.paper,
          backdropFilter: "blur(6px)",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Add SOAP Note
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      {loading && (
        <Stack justifyContent={"center"} alignItems={"center"}>
          <CircularProgress />
          <Typography variant="subtitle1">Loading records...</Typography>
        </Stack>
      )}

      {message && (
        <Typography variant="subtitle2" color="warning" textAlign={"center"}>
          {message}
        </Typography>
      )}

      {!loading && form && (
        <SOAPFormEdit
          onClose={onClose}
          client={client}
          appointmentId={appointment}
          form={form}
          setForm={setForm}
        />
      )}

      {!loading && !form && (
        <SOAPFormAdd
          onClose={onClose}
          client={client}
          appointmentId={appointment}
        />
      )}
    </Drawer>
  );
}
