import React, { ReactNode } from "react";
import DashboardLayout from "../components/client-layout";

function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <DashboardLayout>{children}</DashboardLayout>
    </div>
  );
}

export default Layout;
