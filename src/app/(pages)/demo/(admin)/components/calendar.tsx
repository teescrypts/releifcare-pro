"use client";

import {
  Box,
  Card,
  Popover,
  Typography,
  Button,
  useMediaQuery,
  Theme,
  useTheme,
} from "@mui/material";
import { DateTime } from "luxon";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useCallback, useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { CalendarContainer } from "./calendar-container";
import interactionPlugin from "@fullcalendar/interaction";
import { useRouter } from "nextjs-toploader/app";
import { CalendarApi, EventClickArg } from "@fullcalendar/core/index.js";
import { CalendarToolbar } from "./calendar-toolbar";
import { EventContentArg } from "@fullcalendar/core";
import { getDateRange } from "@/app/utils/get-date-range";
import ConfirmationModal from "./confirmation-modal";
import notify from "@/app/utils/toast";
import { updateAppointment } from "@/actions";

type Status = "pending" | "completed" | "cancelled";

export type AppointmentEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  service: string;
  client: { fname: string; lname: string };
  note?: string;
  status: "pending" | "completed" | "cancelled";
};

const STATUS_COLORS = (theme: Theme): Record<Status, string> => {
  return {
    pending: theme.palette.warning.main, // yellow
    completed: theme.palette.success.main, // green
    cancelled: theme.palette.error.main, // red
  };
};

const Calendar = ({ events }: { events: AppointmentEvent[] }) => {
  const calendarRef = useRef<FullCalendar | null>(null);
  const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));
  const router = useRouter();
  const theme = useTheme();

  const timeZone = "America/Chicago";
  const today = DateTime.now().setZone(timeZone).startOf("day").toJSDate();

  const [date, setDate] = useState(today);
  const [view, setView] = useState<
    "timeGridWeek" | "timeGridDay" | "dayGridMonth"
  >(mdUp ? "timeGridWeek" : "timeGridDay");

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<AppointmentEvent | null>(
    null
  );

  const [aptToDelete, setAptToDelete] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleEventSelect = useCallback(
    (arg: EventClickArg) => {
      const found = events.find((e) => e.id === arg.event.id);
      setSelectedEvent(found || null);
      setAnchorEl(arg.el);
    },
    [events]
  );

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setSelectedEvent(null);
  };

  const handleCancelAppointment = (id: string) => {
    handleOpen();
    setAptToDelete(id);
  };

  const handleCanceleBooking = useCallback(() => {
    setLoading(true);
    if (aptToDelete) {
      updateAppointment(aptToDelete, "cancelled").then((result) => {
        if (result) {
          if (result?.error) {
            setMessage(result.error);
            handleClose()
            setLoading(false);
          }

          if (result?.message) {
            notify(result.message);
            setLoading(false);
            handlePopoverClose();
            handleClose()
          }
        }
      });
    }
  }, [aptToDelete]);

  const handleGoToAppointment = () => {
    if (selectedEvent)
      router.push(`/demo/admin/appointment/${selectedEvent.id}`);
    handlePopoverClose();
  };

  const renderEventContent = (eventInfo: EventContentArg) => {
    const status = eventInfo.event.extendedProps.status as Status;

    return (
      <Box
        sx={{
          p: 0.5,
          cursor: "pointer",
          bgcolor: STATUS_COLORS(theme)[status],
          borderRadius: 1,
          fontSize: 12,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {eventInfo.event.title}
      </Box>
    );
  };

  const updateDateFromCalendar = (calendarApi: CalendarApi) => {
    const newDate = DateTime.fromJSDate(calendarApi.getDate())
      .setZone(timeZone)
      .toJSDate();
    setDate(newDate);
  };

  const handleDateNext = useCallback(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.next();
      updateDateFromCalendar(calendarApi);
    }
  }, []);

  const handleDatePrev = useCallback(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.prev();
      updateDateFromCalendar(calendarApi);
    }
  }, []);

  const handleDateToday = useCallback(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.today();
      updateDateFromCalendar(calendarApi);
    }
  }, []);

  const handleViewChange = useCallback((view: string) => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.changeView(view);
      setView(view as "dayGridMonth" | "timeGridDay" | "timeGridWeek");
    }
  }, []);

  useEffect(() => {
    const { start, end } = getDateRange(view, date);
    router.push(`/demo/admin/appointment?start=${start}&end=${end}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, view]);
  

  return (
    <>
      <CalendarToolbar
        date={date}
        onDateNext={handleDateNext}
        onDatePrev={handleDatePrev}
        onDateToday={handleDateToday}
        onViewChange={handleViewChange}
        view={view}
      />
      <Card sx={{ my: 2 }}>
        <CalendarContainer>
          <FullCalendar
            ref={calendarRef}
            initialDate={date}
            initialView={view}
            height={800}
            editable={false}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            eventClick={handleEventSelect}
            events={events}
            eventContent={renderEventContent}
            headerToolbar={false}
            dayMaxEventRows={false}
            moreLinkClick="popover"
          />
        </CalendarContainer>
      </Card>

      {/* Popover for Appointment Details */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {selectedEvent && (
          <Box sx={{ p: 2, maxWidth: 300 }}>
            <Typography variant="h6" gutterBottom>
              {selectedEvent.service}
            </Typography>
            <Typography variant="body2">
              <strong>Client:</strong> {selectedEvent.client.fname}{" "}
              {selectedEvent.client.lname}
            </Typography>
            <Typography variant="body2">
              <strong>Time:</strong>{" "}
              {dayjs(selectedEvent.start).format("h:mm A")} -{" "}
              {dayjs(selectedEvent.end).format("h:mm A")}
            </Typography>
            {selectedEvent.note && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Note:</strong> {selectedEvent.note}
              </Typography>
            )}

            {message && (
              <Typography
                textAlign={"center"}
                color="error"
                variant="subtitle2"
              >
                {message}
              </Typography>
            )}

            {selectedEvent.status !== "cancelled" && (
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  gap: 1,
                  justifyContent: "flex-end",
                }}
              >
                {selectedEvent.status === "pending" && (
                  <Button
                    color="error"
                    onClick={() => handleCancelAppointment(selectedEvent.id)}
                  >
                    Cancel
                  </Button>
                )}
                <Button variant="contained" onClick={handleGoToAppointment}>
                  Go to Appointment
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Popover>

      <ConfirmationModal
        open={open}
        message="Are you sure you want to cancel this appointment?"
        confirmText="Yes, Cancel"
        onClose={handleClose}
        loading={loading}
        cancelText="No, don't cancel"
        onConfirm={handleCanceleBooking}
      />
    </>
  );
};

export default Calendar;
