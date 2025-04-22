"use client";

import EmptyState from "@/app/components/empty-state";
import {
  Grid2,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import { useRouter } from "nextjs-toploader/app";
import React from "react";

export interface ServiceListType {
  _id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
}

function ServiceList({
  services,
  admin,
}: {
  services: ServiceListType[];
  admin: string | undefined;
}) {
  const router = useRouter();

  return (
    <div>
      <Grid2 container spacing={4}>
        {services.length > 0 &&
          services.map((service, index) => (
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={service._id}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    boxShadow: 3,
                    textAlign: "center",
                    transition: "transform 0.3s ease",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                >
                  <CardContent>
                    <Typography variant="h5" fontWeight="bold" mb={1}>
                      {service.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" mb={2}>
                      {service.description}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      Duration: {service.duration} min
                    </Typography>

                    <Typography variant="body2" fontWeight="bold">
                      Price: {service.price} USD
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        bgcolor: "primary.main",
                        "&:hover": { bgcolor: "primary.dark" },
                      }}
                      onClick={() =>
                        router.push(
                          admin
                            ? `/demo/services/booking/${service._id}?admin=${admin}`
                            : `/demo/services/booking/${service._id}`
                        )
                      }
                    >
                      Book Now
                    </Button>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid2>
          ))}
      </Grid2>

      {services.length === 0 && (
        <EmptyState
          title={"No service found"}
          description="We’re still getting things ready. Feel free to check back soon!"
        />
      )}
    </div>
  );
}

export default ServiceList;
