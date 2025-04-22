import apiRequest from "@/app/lib/api-request";
import { paths } from "@/paths";
import { ServiceType } from "@/types";
import { Container, Typography, Breadcrumbs } from "@mui/material";
import { cookies } from "next/headers";
import Link from "next/link";
import React from "react";
import EditService from "../../../components/edit-service";

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const response = await apiRequest<{ data: { service: ServiceType } }>(
    `admin/service/${id}`,
    {
      token,
      tag: "fetchAdminSingleService",
    }
  );

  return (
    <Container maxWidth="lg">
      {/* Breadcrumb Navigation */}
      <Typography variant="h4">Edit Service</Typography>

      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link href={paths.admin.services}>Services</Link>
        <Typography color="text.primary">Edit Service</Typography>
      </Breadcrumbs>

      {/* Add Service Page */}
      <EditService service={response.data.service} />
    </Container>
  );
}

export default Page;
