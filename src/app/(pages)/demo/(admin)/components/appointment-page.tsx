"use client";

import { useCallback, useState } from "react";
import { Box, Typography, Stack } from "@mui/material";
import AppointmentDetails from "./appointment-details";
import ActionsPanel from "./action-panel";
import SOAPNoteDrawer from "./SOAP-note";
import ClientRecordDrawer from "./client-record-modal";
import { AppointmentType, ClientDataType, SOAPDataType } from "@/types";
import {
  fetchClientData,
  fetchPrevNote,
  getAdminAvailability,
  updateAppointment,
} from "@/actions";
import { DateTime } from "luxon";
import { DateItem } from "../../(pages)/components/booking-date-time";
import RescheduleApt from "../../(pages)/components/reschedule-modal";
import PreviousSOAPModal from "./previous-SOAP-modal";
import notify from "@/app/utils/toast";

export interface NoteType {
  notes: SOAPDataType[];
  nextCursor: string | null;
  hasMore: boolean;
}

export default function AppointmentPage({
  appointment,
}: {
  appointment: AppointmentType;
}) {
  const [openSOAP, setOpenSOAP] = useState(false);
  const [openReschedule, setOpenReschedule] = useState(false);
  const [openClientDrawer, setOpenClientDrawer] = useState(false);
  const [openPrevSOAP, setOpenPrevSOAP] = useState(false);

  const [fullZoneName, setFullZoneName] = useState<string | null>(null);
  const [offset, setOffset] = useState("");
  const [duration, setDuration] = useState<number>();
  const [message, setMessage] = useState("");
  const [dates, setDates] = useState<DateItem[]>([]);
  const [clientData, setClientData] = useState<ClientDataType | undefined>();
  const [noteData, setNoteData] = useState<NoteType | undefined>();
  const [loading, setLoading] = useState(false);

  const HandlgetAvailabiltiy = useCallback(() => {
    let addonMinutes = 0;

    if (appointment?.addons && appointment.addons.length > 0) {
      addonMinutes = appointment.addons.reduce(
        (total, addon) => total + (addon.duration || 0),
        0
      );
    }

    const service = appointment.service;
    const totalMinutes = service.duration! + addonMinutes;
    setDuration(totalMinutes);

    getAdminAvailability(totalMinutes).then((result) => {
      if (result) {
        if (result?.error) {
          setMessage(result.error);
          setOpenReschedule(false);
        }

        if (result?.availability && result?.timeZone) {
          setDates(result.availability);

          const now = DateTime.now().setZone(result.timeZone);
          setFullZoneName(now.offsetNameLong);
          setOffset(now.toFormat("ZZZZ"));
        }
      }
    });
  }, [appointment.service, appointment.addons]);

  const handleGetClientData = useCallback(() => {
    fetchClientData(appointment.client._id).then((result) => {
      if (result) {
        if (result?.error) {
          setMessage(result.error);
          setOpenClientDrawer(false);
        }

        if (result?.clientData) {
          setClientData(result.clientData);
        }
      }
    });
  }, [appointment.client._id]);

  const handleGetPreviousSOAPNote = useCallback(() => {
    fetchPrevNote(appointment.client._id, null).then((result) => {
      if (result) {
        if (result?.error) {
          setMessage(result.error);
          setOpenPrevSOAP(false);
        }

        if (result?.message) {
          setNoteData(result.message);
        }
      }
    });
  }, [appointment.client._id]);

  const handleCompleteBooking = useCallback(() => {
    setLoading(true);
    updateAppointment(appointment._id, "completed").then((result) => {
      if (result) {
        if (result?.error) {
          setMessage(result.error);
          setLoading(false);
        }

        if (result?.message) {
          notify(result.message);
          setLoading(false);
        }
      }
    });
  }, [appointment._id]);

  return (
    <Box>
      {message && (
        <Typography textAlign={"center"} color="error" variant="subtitle2">
          {message}
        </Typography>
      )}
      <Stack spacing={4} sx={{ mb: 10 }}>
        <AppointmentDetails data={appointment} />

        <ActionsPanel
          loading={loading}
          handleCompleteBooking={handleCompleteBooking}
          onOpenSOAP={() => setOpenSOAP(true)}
          onOpenPreviousSOAP={() => {
            setOpenPrevSOAP(true);
            handleGetPreviousSOAPNote();
          }}
          onOpenReschedule={() => {
            setOpenReschedule(true);
            HandlgetAvailabiltiy();
          }}
          onOpenClientRecord={() => {
            setOpenClientDrawer(true);
            handleGetClientData();
          }}
        />
      </Stack>

      <SOAPNoteDrawer
        open={openSOAP}
        onClose={() => setOpenSOAP(false)}
        client={appointment.client._id}
        appointment={appointment._id}
      />

      {duration && (
        <RescheduleApt
          open={openReschedule}
          onClose={() => {
            setOpenReschedule(false);
            setDates([]);
            setFullZoneName("");
            setOffset("");
            setDuration(undefined);
          }}
          dates={dates}
          fullZoneName={fullZoneName}
          offset={offset}
          apt={appointment._id}
          duration={duration}
          isAdmin={true}
        />
      )}

      <ClientRecordDrawer
        open={openClientDrawer}
        onClose={() => setOpenClientDrawer(false)}
        clientData={clientData}
      />

      <PreviousSOAPModal
        open={openPrevSOAP}
        onClose={() => setOpenPrevSOAP(false)}
        clientName={`${appointment.client.fname} ${appointment.client.lname}`}
        clientId={appointment.client._id}
        noteData={noteData}
      />
    </Box>
  );
}
