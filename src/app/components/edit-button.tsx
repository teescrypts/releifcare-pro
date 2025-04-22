"use client";

import { Button, CircularProgress, Box } from "@mui/material";
import { FormEvent, ReactNode } from "react";

export function ManualSubmitButton({
  title,
  isFullWidth,
  icon,
  onClick,
  loading,
}: {
  title: string;
  isFullWidth: boolean;
  icon?: ReactNode;
  onClick: (e?: FormEvent) => void;
  loading: boolean;
}) {
  return (
    <Button
      disabled={loading}
      onClick={onClick}
      fullWidth={isFullWidth}
      variant="contained"
      startIcon={!loading ? icon : undefined}
      sx={{
        position: "relative",
        minWidth: "120px", // Ensures consistent width
        height: "40px",
        my: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          position: "absolute",
          opacity: loading ? 0 : 1,
          transition: "opacity 0.2s ease-in-out",
        }}
      >
        {title}
      </Box>
      {loading && <CircularProgress size={24} />}
    </Button>
  );
}
