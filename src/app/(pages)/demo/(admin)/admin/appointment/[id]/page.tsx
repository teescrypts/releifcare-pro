import React from "react";
import Link from "next/link";
import { Breadcrumbs, Typography, Box, Container } from "@mui/material";
import AppointmentPage from "../../../components/appointment-page";
import apiRequest from "@/app/lib/api-request";
import { cookies } from "next/headers";
import { AppointmentType } from "@/types";

type Props = {
  params: Promise<{ id: string }>;
};

async function Page({ params }: Props) {
  const id = (await params).id;
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const response = await apiRequest<{ data: { apt: AppointmentType } }>(
    `admin/appointment/${id}`,
    { token, tag: "fetchAdminAptSingle" }
  );

  const appointment = response.data.apt;

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4">Manage Appointment</Typography>

        <Breadcrumbs aria-label="breadcrumb">
          <Link href="/demo/admin/appointment" passHref>
            <Typography color="primary" sx={{ cursor: "pointer" }}>
              Appointments
            </Typography>
          </Link>
          <Typography color="text.primary">Details</Typography>
        </Breadcrumbs>
      </Box>
      <AppointmentPage appointment={appointment} />
    </Container>
  );
}

export default Page;
