"use client";

import React, { ReactNode } from "react";
import VerticalLayout from "./vertical-layout";
import { useTheme } from "@mui/material";
import CustomTheme from "@/app/components/custom-theme";
import { ToastContainer, Zoom } from "react-toastify";
import TopLoader from "./top-loader";

function DashboardLayout({ children }: { children: ReactNode }) {
  const theme = useTheme();
  return (
    <CustomTheme>
      <VerticalLayout navColor="blend-in">
        <TopLoader />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={theme.palette.mode}
          transition={Zoom}
        />
        {children}
      </VerticalLayout>
    </CustomTheme>
  );
}

export default DashboardLayout;
