import { sageGreen, tranquilBlue, lavender, warmBeige } from "./colors";

export const getPrimary = (preset: string) => {
  switch (preset) {
    case "sageGreen":
      return sageGreen;
    case "tranquilBlue":
      return tranquilBlue;
    case "lavender":
      return lavender;
    case "warmBeige":
      return warmBeige;
    default:
      console.error(
        'Invalid color preset. Accepted values: "sageGreen", "tranquilBlue", "lavender", or "warmBeige".'
      );
      return sageGreen; // Default to the most spa-friendly color
  }
};
