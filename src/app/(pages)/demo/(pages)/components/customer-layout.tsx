import CustomTheme from "@/app/components/custom-theme";
import { Box } from "@mui/material";
import React, { ReactNode } from "react";
import TopLoader from "../../(admin)/components/top-loader";
import Footer from "./footer";
import Navbar from "./nav-bar";

function CustomerLayout({ children }: { children: ReactNode }) {
  return (
    <CustomTheme>
      <TopLoader />
      <Navbar />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ flexGrow: 1 }}>{children}</Box>
      </Box>
      <Footer />
    </CustomTheme>
  );
}

export default CustomerLayout;
