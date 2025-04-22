"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Button,
  Alert,
  Chip,
  useTheme,
  Stack,
  Box,
  Grid2,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import ChevronLeft from "@/app/icons/untitled-ui/duocolor/chevron-left";
import ChevronRight from "@/app/icons/untitled-ui/duocolor/chevron-right";
import { AnimatePresence, motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { useEffect, useRef, useState } from "react";
import SimpleBarCore from "simplebar-core";
import { Scrollbar } from "@/app/components/scrollbar";
import { convertTo12HourFormat } from "@/app/utils/convert-to-12hrs-format";
import Close from "@/app/icons/untitled-ui/duocolor/close";
import addDurationToTime from "@/app/utils/add-duration-to-time";
import notify from "@/app/utils/toast";
import { rescheduleAptAdmin, rescheduleAptClient } from "@/actions";

export type DateItem = {
  date: string;
  slots: string[];
};

type BookingDateAndTimeModalProps = {
  open: boolean;
  onClose: () => void;
  admin?: string;
  dates: DateItem[];
  fullZoneName: string | null;
  offset: string;
  apt: string;
  duration: number;
  isAdmin: boolean;
};

const RescheduleApt = ({
  open,
  onClose,
  dates,
  fullZoneName,
  offset,
  apt,
  duration,
  isAdmin,
}: BookingDateAndTimeModalProps) => {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<DateItem | null>(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [visibleSlots, setVisibleSlots] = useState(10);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const scrollbarRef = useRef<SimpleBarCore | null>(null);
  const [isProgrammaticScroll, setIsProgrammaticScroll] = useState(false);

  const handleDateClick = (date: DateItem) => {
    if (date.slots.length > 0) {
      setSelectedDate(date);
      setSelectedSlot("");
    }
  };

  const handleScrollLeft = () => {
    if (currentIndex > 0) {
      setIsProgrammaticScroll(true);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleScrollRight = () => {
    if (currentIndex < dates.length - 1) {
      setIsProgrammaticScroll(true);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (scrollbarRef.current && isProgrammaticScroll) {
      const scrollbarElement = scrollbarRef.current.getScrollElement();
      if (scrollbarElement) {
        const itemWidth = scrollbarElement.scrollWidth / dates.length;
        scrollbarElement.scrollTo({
          left: currentIndex * itemWidth,
          behavior: "smooth",
        });
      }
      const timer = setTimeout(() => setIsProgrammaticScroll(false), 300);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, dates.length, isProgrammaticScroll]);

  useEffect(() => {
    const handleScroll = () => {
      if (isProgrammaticScroll) return;
      if (scrollbarRef.current) {
        const scrollbarElement = scrollbarRef.current.getScrollElement();
        if (scrollbarElement) {
          const itemWidth = scrollbarElement.scrollWidth / dates.length;
          const newIndex = Math.round(scrollbarElement.scrollLeft / itemWidth);
          if (newIndex !== currentIndex) {
            setCurrentIndex(newIndex);
          }
        }
      }
    };
    const scrollbarElement = scrollbarRef.current?.getScrollElement();
    scrollbarElement?.addEventListener("scroll", handleScroll);
    return () => {
      scrollbarElement?.removeEventListener("scroll", handleScroll);
    };
  }, [currentIndex, dates.length, isProgrammaticScroll]);

  const handleShowMore = () => setVisibleSlots((prev) => prev + 10);

  const handleReschedule = () => {
    if (selectedDate && selectedSlot) {
      setLoading(true);
      const data = {
        newDate: selectedDate.date,
        newTime: {
          from: selectedSlot,
          to: addDurationToTime(selectedSlot, {
            hours: 0,
            minutes: duration,
          }),
        },
      };

      if (isAdmin) {
        rescheduleAptAdmin(apt, data).then((result) => {
          if (result) {
            if (result?.error) {
              setMessage(result.error);
              setLoading(false);
              onClose();
            }

            if (result?.message) {
              notify(result.message);
              onClose();
              setLoading(false);
            }
          }
        });
      } else {
        rescheduleAptClient(apt, data).then((result) => {
          if (result) {
            if (result?.error) {
              setMessage(result.error);
              setLoading(false);
              onClose();
            }

            if (result?.message) {
              notify(result.message);
              onClose();
              setLoading(false);
            }
          }
        });
      }
    } else {
      alert("Please select date and time");
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Typography variant="h4">Reschedule Appointment</Typography>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          {message && (
            <Typography textAlign={"center"} color="error" variant="subtitle2">
              {message}
            </Typography>
          )}
          {dates.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Grid2 container spacing={3} justifyContent="center" mb={4}>
                <Box sx={{ p: 2 }}>
                  {dates[currentIndex] && (
                    <div>
                      <Typography variant="h3" align="center" sx={{ my: 2 }}>
                        Select Date
                      </Typography>
                      {fullZoneName && (
                        <Alert
                          severity="info"
                          sx={{
                            mt: 3,
                            borderRadius: 2,
                            backgroundColor: "#e3f2fd",
                          }}
                        >
                          <Typography variant="body2">
                            You’re booking in{" "}
                            <strong>
                              {fullZoneName} ({offset})
                            </strong>
                            .
                          </Typography>
                        </Alert>
                      )}
                      <Typography variant="h5" align="center">
                        {`${format(
                          parseISO(dates[currentIndex].date),
                          "MMMM yyyy"
                        )}`}
                      </Typography>
                    </div>
                  )}
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    overflow: "hidden",
                    mb: 2,
                  }}
                >
                  <IconButton
                    onClick={handleScrollLeft}
                    disabled={currentIndex === 0}
                  >
                    <ChevronLeft />
                  </IconButton>

                  <Scrollbar
                    ref={scrollbarRef}
                    style={{ width: "100%", overflowX: "auto" }}
                  >
                    <Grid2 container wrap="nowrap" spacing={2}>
                      {dates.map((date: DateItem) => (
                        <Grid2
                          key={date.date}
                          sx={{
                            flex: "0 0 auto",
                            textAlign: "center",
                          }}
                        >
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Card
                              sx={{
                                minWidth: 80,
                                cursor:
                                  date.slots.length > 0
                                    ? "pointer"
                                    : "not-allowed",
                                backgroundColor:
                                  date.slots.length > 0
                                    ? selectedDate?.date === date.date
                                      ? theme.palette.primary.main
                                      : theme.palette.grey[100]
                                    : theme.palette.grey[200],
                                color:
                                  date.slots.length > 0
                                    ? selectedDate?.date === date.date
                                      ? "white"
                                      : "black"
                                    : theme.palette.grey[500],
                                border:
                                  selectedDate?.date === date.date
                                    ? `2px solid ${theme.palette.primary.dark}`
                                    : "1px solid #ccc",
                                opacity: date.slots.length > 0 ? 1 : 0.6,
                                boxShadow:
                                  selectedDate?.date === date.date ? 3 : 1,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  boxShadow: date.slots.length > 0 ? 4 : 1,
                                  backgroundColor:
                                    date.slots.length > 0 &&
                                    selectedDate?.date !== date.date
                                      ? theme.palette.grey[200]
                                      : undefined,
                                },
                                borderRadius: 2,
                              }}
                              onClick={() => handleDateClick(date)}
                            >
                              <CardContent>
                                <Box textAlign="center">
                                  <Typography
                                    variant="subtitle1"
                                    fontWeight="bold"
                                  >
                                    {format(parseISO(date.date), "d")}
                                  </Typography>
                                  <Typography variant="subtitle2">
                                    {format(parseISO(date.date), "EEE")}
                                  </Typography>
                                </Box>
                              </CardContent>
                            </Card>
                          </motion.div>
                        </Grid2>
                      ))}
                    </Grid2>
                  </Scrollbar>

                  <IconButton
                    onClick={handleScrollRight}
                    disabled={currentIndex === dates.length - 1}
                  >
                    <ChevronRight />
                  </IconButton>
                </Box>
              </Grid2>
            </motion.div>
          ) : (
            <Stack alignItems={"center"} justifyContent={"center"}>
              <CircularProgress />
            </Stack>
          )}

          {selectedDate && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <Box textAlign="center" mb={4}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Typography variant="h6" gutterBottom sx={{ my: 4 }}>
                    Time slots for {format(parseISO(selectedDate.date), "PPPP")}
                    :
                  </Typography>
                </motion.div>

                <Grid2 container spacing={2} justifyContent="center">
                  <AnimatePresence>
                    {selectedDate.slots.length > 0 ? (
                      selectedDate.slots
                        .slice(0, visibleSlots)
                        .map((slot, index) => (
                          <Grid2
                            key={slot}
                            size={{ xs: 6, sm: 4, md: 4 }}
                            display="flex"
                            justifyContent="center"
                          >
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{
                                duration: 0.3,
                                delay: index * 0.05,
                              }}
                            >
                              <Chip
                                label={convertTo12HourFormat(slot)}
                                onClick={() => setSelectedSlot(slot)}
                                sx={{
                                  px: 2,
                                  py: 1,
                                  borderRadius: "20px",
                                  cursor: "pointer",
                                  background:
                                    slot === selectedSlot
                                      ? `${theme.palette.primary.main}`
                                      : "default",
                                  color:
                                    slot === selectedSlot ? "#fff" : "inherit",
                                  transition: "all 0.3s ease",
                                }}
                              />
                            </motion.div>
                          </Grid2>
                        ))
                    ) : (
                      <Typography textAlign={"center"} variant="body1">
                        No slots available.
                      </Typography>
                    )}
                  </AnimatePresence>
                </Grid2>

                {visibleSlots < selectedDate.slots.length && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Button onClick={handleShowMore} sx={{ mt: 2 }}>
                      Show More
                    </Button>
                  </motion.div>
                )}

                {selectedDate && selectedSlot && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Stack>
                      <Button
                        sx={{ my: 4 }}
                        variant="contained"
                        onClick={handleReschedule}
                        disabled={loading}
                      >
                        RESCHEDULE APPOINTMENT
                      </Button>
                    </Stack>
                  </motion.div>
                )}
              </Box>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RescheduleApt;
