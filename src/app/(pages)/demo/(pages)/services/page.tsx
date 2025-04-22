import apiRequest from "@/app/lib/api-request";
import { Container, Typography } from "@mui/material";
import ServiceList, { ServiceListType } from "../components/service-list";

const ServicesPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const adminId = (await searchParams).admin as string | undefined;

  const url = adminId
    ? `public/services?adminId=${adminId}`
    : "public/services";

  const response = await apiRequest<{ data: { services: ServiceListType[] } }>(
    url,
    {
      cache: "force-cache",
      tag: "FetchCustomerServices",
    }
  );

  const services = response.data.services;

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h3" fontWeight="bold" textAlign="center" mb={4}>
        Our Services
      </Typography>

      <ServiceList admin={adminId} services={services} />
    </Container>
  );
};

export default ServicesPage;
