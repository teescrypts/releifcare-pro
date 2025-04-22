"use client";

import { applyCode, confirmBooking } from "@/actions";
import addDurationToTime from "@/app/utils/add-duration-to-time";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Divider,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material";
import { format, parseISO } from "date-fns";
import { DateTime } from "luxon";
import { useRouter } from "nextjs-toploader/app";
import { useCallback, useState } from "react";
import { AnimatePresence } from "framer-motion";

export type Addon = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
};

export type Service = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
};

type AppointmentModalProps = {
  admin: string | undefined;
  open: boolean;
  onClose: () => void;
  service: Service;
  selectedAddons: Addon[];
  date: string;
  time: string;
  timezone: string; // IANA identifier
};

const AppointmentSummaryModal = ({
  admin,
  open,
  onClose,
  service,
  selectedAddons,
  date,
  time,
  timezone,
}: AppointmentModalProps) => {
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [couponSuccess, setCouponSuccess] = useState(false); // or null
  const [loadingApply, setLoadingApply] = useState(false);
  const [discount, setDiscount] = useState<number>(0);

  const router = useRouter();

  const totalPrice =
    service.price + selectedAddons.reduce((sum, addon) => sum + addon.price, 0);

  const totalDuration =
    service.duration +
    selectedAddons.reduce((sum, addon) => sum + (addon.duration ?? 0), 0);

  const startDateTime = DateTime.fromISO(`${date}T${time}`, {
    zone: timezone,
  });

  const endTime = addDurationToTime(time, { hours: 0, minutes: totalDuration });

  const endDateTime = DateTime.fromISO(`${date}T${endTime}`, {
    zone: timezone,
  });

  const handleConfirmBooking = useCallback(() => {
    setLoading(true);
    const data = {
      service: service._id,
      selectedAddons: selectedAddons.map((addon) => addon._id),
      date,
      bookedTime: { from: time, to: endTime },
      note,
    };

    confirmBooking(data, admin, couponCode).then((result) => {
      if (result?.error) {
        setMessage(result.error);
        setLoading(false);
      }

      if (result?.message) {
        router.push("/demo/dashboard/bookings");
      }
    });
  }, [
    service,
    selectedAddons,
    note,
    date,
    time,
    endTime,
    couponCode,
    admin,
    router,
  ]);

  const handleApplyCoupon = useCallback(() => {
    if (couponCode) {
      setLoadingApply(true);
      applyCode(couponCode).then((result) => {
        if (result?.error) {
          setCouponMessage(result.error);
          setLoadingApply(false);
        }

        if (result?.coupon) {
          setCouponMessage("Coupon applied");
          setCouponSuccess(true);
          setDiscount(result.coupon.value);
          setLoadingApply(false);
        }
      });
    }
  }, [couponCode]);

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
          <DialogTitle>Appointment Summary</DialogTitle>
          <DialogContent dividers>
            <Typography variant="h6">{service.name}</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {service.description}
            </Typography>

            <Typography variant="body2">
              <strong>Price:</strong> ${service.price.toFixed(2)}
            </Typography>
            <Typography variant="body2">
              <strong>Discount:</strong> ${discount.toFixed(2)}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {selectedAddons.length > 0 && (
              <>
                <Typography variant="subtitle1" gutterBottom>
                  Add-ons
                </Typography>
                <List dense disablePadding>
                  {selectedAddons.map((addon) => (
                    <ListItem key={addon._id} sx={{ pl: 0 }}>
                      <ListItemText
                        primary={`${addon.name} - $${addon.price.toFixed(2)}`}
                        secondary={addon.description}
                      />
                    </ListItem>
                  ))}
                </List>
                <Divider sx={{ my: 2 }} />
              </>
            )}

            <Typography variant="body2">
              <strong>Total Price:</strong>$
              {Number(totalPrice - discount).toFixed(2)}
            </Typography>
            <Typography variant="body2">
              <strong>Time:</strong> {startDateTime.toFormat("hh:mm a")} –{" "}
              {endDateTime.toFormat("hh:mm a")} ({startDateTime.zoneName})
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Date:</strong> {format(parseISO(date), "PPPP")}
            </Typography>

            {/* Coupon Code Field */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Apply discount coupon
              </Typography>

              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <TextField
                  label="Coupon Code"
                  variant="outlined"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  fullWidth
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleApplyCoupon}
                  disabled={!couponCode || loadingApply}
                >
                  Apply
                </Button>
              </Box>
            </Box>

            {/* Coupon message */}
            {couponMessage && (
              <Typography
                variant="subtitle2"
                color={couponSuccess ? "success.main" : "error"}
                textAlign="center"
                sx={{ mt: 1 }}
              >
                {couponMessage}
              </Typography>
            )}

            {/* Notes */}
            <TextField
              variant="outlined"
              label="Notes to Therapist (Optional)"
              fullWidth
              multiline
              minRows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              sx={{ mt: 3 }}
            />

            {message && (
              <Typography variant="subtitle2" color="error" textAlign="center">
                {message}
              </Typography>
            )}
          </DialogContent>

          <DialogActions>
            <Button onClick={onClose} color="inherit">
              Cancel
            </Button>
            <Button
              variant="contained"
              disabled={loading}
              onClick={handleConfirmBooking}
            >
              Confirm Appointment
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default AppointmentSummaryModal;
