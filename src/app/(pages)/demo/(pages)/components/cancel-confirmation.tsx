"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  PaperProps,
  Slide,
} from "@mui/material";
import { forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

// Safe wrapper component
const MotionDialogPaper = forwardRef<HTMLDivElement, PaperProps>(
  ({ children, ...muiProps }, ref) => {
    // Strip unsupported props
    const { ...safeProps } = muiProps;

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        style={{
          backgroundColor: "#fff", // ✅ give it a proper background
          borderRadius: 8,
          boxShadow:
            "0px 11px 15px -7px rgba(0,0,0,0.2), 0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12)",
          padding: "16px", // optional, usually DialogContent handles padding
        }}
        {...(safeProps as HTMLMotionProps<"div">)}
      >
        {children}
      </motion.div>
    );
  }
);

MotionDialogPaper.displayName = "MotionDialogPaper";

interface CancelConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  serviceName?: string;
  loading: boolean;
}

const CancelConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  serviceName,
  loading,
}: CancelConfirmationModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      slots={{ transition: Slide }}
      keepMounted
      maxWidth="xs"
      fullWidth
      PaperComponent={MotionDialogPaper}
    >
      <DialogTitle>Cancel Appointment</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to cancel your appointment
          {serviceName ? ` for "${serviceName}"` : ""}?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          No, Keep it
        </Button>
        <Button
          disabled={loading}
          onClick={onConfirm}
          color="error"
          variant="contained"
        >
          Yes, Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelConfirmationModal;
