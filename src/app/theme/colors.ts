import { alpha } from "@mui/system/colorManipulator";

type Color = {
  lightest: string;
  light: string;
  main: string;
  dark: string;
  darkest: string;
  contrastText: string;
};

const withAlphas = (color: Color) => {
  return {
    ...color,
    alpha4: alpha(color.main, 0.04),
    alpha8: alpha(color.main, 0.08),
    alpha12: alpha(color.main, 0.12),
    alpha30: alpha(color.main, 0.3),
    alpha50: alpha(color.main, 0.5),
  };
};

// -------------------------------------------------- PRIMARY COLORS --------------------------------------------------

export const sageGreen = withAlphas({
  lightest: "#F2F7F3",
  light: "#E1ECE5",
  main: "#87A88D", // Soft natural green
  dark: "#5B7C64",
  darkest: "#3E5545",
  contrastText: "#FFFFFF",
});

export const tranquilBlue = withAlphas({
  lightest: "#F1F7FA",
  light: "#DCEEF3",
  main: "#6A9FB5", // Calming blue
  dark: "#48728C",
  darkest: "#2F4C5D",
  contrastText: "#FFFFFF",
});

export const lavender = withAlphas({
  lightest: "#FBF7FD",
  light: "#F1E7FA",
  main: "#A78ABD", // Relaxing lavender
  dark: "#6D5A89",
  darkest: "#45385A",
  contrastText: "#FFFFFF",
});

// -------------------------------------------------- SUPPORT COLORS --------------------------------------------------

export const warmBeige = withAlphas({
  lightest: "#FAF7F3",
  light: "#F2E9DF",
  main: "#D5B89A", // Cozy neutral
  dark: "#A9876F",
  darkest: "#715B4A",
  contrastText: "#FFFFFF",
});

export const earthyBrown = withAlphas({
  lightest: "#F9F6F2",
  light: "#EEE1D5",
  main: "#A67C52", // Warm and grounding
  dark: "#73563A",
  darkest: "#4C3825",
  contrastText: "#FFFFFF",
});

// -------------------------------------------------- TOKENS --------------------------------------------------

export const success = withAlphas({
  lightest: "#F2FCF5",
  light: "#D9F5E3",
  main: "#6EBF7A", // Fresh natural green
  dark: "#488D54",
  darkest: "#2F5D37",
  contrastText: "#FFFFFF",
});

export const info = withAlphas({
  lightest: "#EDF7FC",
  light: "#CFE8F6",
  main: "#4A9ECD", // Soft ocean blue
  dark: "#2D6C91",
  darkest: "#1D4960",
  contrastText: "#FFFFFF",
});

export const warning = withAlphas({
  lightest: "#FFF7EB",
  light: "#FDEAC5",
  main: "#E8A86B", // Gentle earthy orange
  dark: "#B27645",
  darkest: "#784E2E",
  contrastText: "#FFFFFF",
});

export const error = withAlphas({
  lightest: "#FDF3F2",
  light: "#FAD4D2",
  main: "#E06C65", // Soft coral
  dark: "#A74842",
  darkest: "#6E302B",
  contrastText: "#FFFFFF",
});

// -------------------------------------------------- NEUTRALS --------------------------------------------------

export const neutral = {
  50: "#F8F9FA",
  100: "#F3F4F6",
  200: "#E5E7EB",
  300: "#D2D6DB",
  400: "#9DA4AE",
  500: "#6C737F",
  600: "#4D5761",
  700: "#2F3746",
  800: "#1C2536",
  900: "#111927",
};
