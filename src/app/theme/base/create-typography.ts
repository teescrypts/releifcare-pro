import { TypographyOptions } from "@mui/material/styles/createTypography";

export const createTypography = (): TypographyOptions => {
  return {
    fontFamily:
      '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',

    body1: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.75, // Increased for better readability
      letterSpacing: "0.3px",
    },
    body2: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: 1.7,
      letterSpacing: "0.3px",
    },
    button: {
      fontFamily: '"Satoshi", sans-serif',
      fontWeight: 600,
      textTransform: "none",
      letterSpacing: "0.6px",
    },
    caption: {
      fontSize: "0.8rem",
      fontWeight: 500,
      lineHeight: 1.8,
      letterSpacing: "0.4px",
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 500,
      lineHeight: 1.7,
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 500,
      lineHeight: 1.7,
    },
    overline: {
      fontSize: "0.75rem",
      fontWeight: 600,
      letterSpacing: "1.2px",
      lineHeight: 2.8,
      textTransform: "uppercase",
    },
    h1: {
      fontFamily: "'Playfair Display', serif",
      fontWeight: 600,
      fontSize: "3.2rem",
      lineHeight: 1.3,
      letterSpacing: "0.5px",
    },
    h2: {
      fontFamily: "'Playfair Display', serif",
      fontWeight: 600,
      fontSize: "2.8rem",
      lineHeight: 1.3,
      letterSpacing: "0.4px",
    },
    h3: {
      fontFamily: "'Playfair Display', serif",
      fontWeight: 600,
      fontSize: "2rem",
      lineHeight: 1.4,
    },
    h4: {
      fontFamily: "'Playfair Display', serif",
      fontWeight: 600,
      fontSize: "1.75rem",
      lineHeight: 1.4,
    },
    h5: {
      fontFamily: "'Playfair Display', serif",
      fontWeight: 500,
      fontSize: "1.5rem",
      lineHeight: 1.5,
    },
    h6: {
      fontFamily: "'Playfair Display', serif",
      fontWeight: 500,
      fontSize: "1.25rem",
      lineHeight: 1.6,
    },
  };
};
