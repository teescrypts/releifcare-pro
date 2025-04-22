import React from "react";
import ServiceList from "../../components/service-list";
import { Container, Stack, Typography, Button, Box } from "@mui/material";
import Link from "next/link";
import { cookies } from "next/headers";
import apiRequest from "@/app/lib/api-request";
import { ServiceType } from "@/types";

async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const page = (await searchParams)?.page as string | undefined;
  const limit = (await searchParams)?.limit as string | undefined;

  // Construct the URL with query parameters if they exist
  let url = "admin/service";
  const queryParams = new URLSearchParams();

  if (page) queryParams.append("page", page);
  if (limit) queryParams.append("limit", limit);

  if (queryParams.toString()) {
    url += `?${queryParams.toString()}`;
  }

  const response = await apiRequest<{
    data: {
      services: ServiceType[];
      pagination: { total: number; page: number; pages: number };
    };
  }>(url, {
    token,
    tag: "fetchAdminServices",
    cache: "force-cache",
  });

  const services = response.data.services;
  const pagination = response.data.pagination;

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth={"lg"}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h4">Services</Typography>
          <Link href="/demo/admin/services/add">
            <Button variant="contained" color="primary">
              Add Service
            </Button>
          </Link>
        </Stack>
        <ServiceList services={services} pagination={pagination} />
      </Container>
    </Box>
  );
}

export default Page;
