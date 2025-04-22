import React from "react";
import AddServicePage from "../../../components/add-service-page";
import { Breadcrumbs, Typography, Container } from "@mui/material";
import Link from "next/link";
import { paths } from "@/paths";

function Page() {
  return (
    <Container maxWidth="lg">
      {/* Breadcrumb Navigation */}
      <Typography variant="h4">
          Add Massage Service
        </Typography>

      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link href={paths.admin.services}>Services</Link>
        <Typography color="text.primary">Add Service</Typography>
      </Breadcrumbs>

      {/* Add Service Page */}
      <AddServicePage />
    </Container>
  );
}

export default Page;
