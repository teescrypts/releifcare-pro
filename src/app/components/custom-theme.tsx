"use client";

import React, { ReactNode, useEffect, useState } from "react";
import {
  CssBaseline,
  ThemeProvider,
  IconButton,
  Drawer,
  Box,
  Typography,
  Button,
} from "@mui/material";
import { createTheme } from "../theme";
import "../globals.css";
import Settings from "../icons/untitled-ui/duocolor/settings";
import { useRouter } from "next/navigation";

type Config = {
  direction: "ltr" | "rtl";
  colorPreset: string;
  contrast: string;
  responsiveFontSizes: boolean;
  paletteMode?: "dark" | "light";
};

const availableColors = [
  { name: "SageGreen", value: "sageGreen", code: "#9CAF88" },
  { name: "TranquilBlue", value: "tranquilBlue", code: "#89CFF0" },
  { name: "Lavender", value: "lavender", code: "#E6E6FA" },
  { name: "WarmBeige", value: "warmBeige", code: "#D8B998" },
];

function CustomTheme({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [paletteMode, setPaletteMode] = useState<"light" | "dark">("light");
  const [primaryColor, setPrimaryColor] = useState<string>("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const router = useRouter();
  const [isAdminRoute, setIsAdminRoute] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Detect system theme
    const prefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setPaletteMode(prefersDarkMode ? "dark" : "light");

    // Load saved theme from localStorage
    const savedColor = localStorage.getItem("themeColorPreset") || "sageGreen";
    setPrimaryColor(savedColor);

    // Check if the current path contains "admin"
    setIsAdminRoute(window.location.pathname.includes("admin"));
  }, []);

  if (!mounted) return null; // Prevent hydration mismatch

  const handleColorChange = (newColor: string) => {
    setPrimaryColor(newColor);
    localStorage.setItem("themeColorPreset", newColor);
    setSettingsOpen(false); // Close drawer after selection
  };

  const config: Config = {
    direction: "ltr",
    colorPreset: primaryColor,
    contrast: "normal",
    responsiveFontSizes: true,
    paletteMode,
  };

  const theme = createTheme(config);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}

      {/* Floating Settings Button */}
      <IconButton
        onClick={() => setSettingsOpen(true)}
        sx={{
          position: "fixed",
          right: 16,
          bottom: 80,
          backgroundColor: "grey",
          color: "#fff",
          boxShadow: 4,
        }}
      >
        <Settings />
      </IconButton>

      {/* Settings Drawer */}
      <Drawer
        anchor="right"
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      >
        <Box sx={{ width: 280, p: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Theme Settings
          </Typography>

          {/* Color Selection Grid */}
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            {availableColors.map((color) => (
              <Box
                key={color.name}
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  backgroundColor: color.code,
                  cursor: "pointer",
                  border:
                    primaryColor === color.code
                      ? "3px solid #000"
                      : "2px solid transparent",
                  transition: "border 0.2s ease-in-out",
                }}
                onClick={() => handleColorChange(color.value)}
              />
            ))}
          </Box>

          {/* Try Admin Dashboard Button (Only if URL does NOT contain "admin") */}
          {!isAdminRoute && (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 4 }}
              onClick={() => router.push("/demo/admin/appointment")}
            >
              Try Admin Dashboard
            </Button>
          )}
        </Box>
      </Drawer>
    </ThemeProvider>
  );
}

export default CustomTheme;
