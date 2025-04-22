"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Chip,
  Tooltip,
  Box,
} from "@mui/material";
import Edit from "@/app/icons/untitled-ui/duocolor/edit";
import Pause from "@/app/icons/untitled-ui/duocolor/pause";
import Delete from "@/app/icons/untitled-ui/duocolor/delete";
import { ServiceType } from "@/types";
import { useRouter } from "nextjs-toploader/app";
import PlayArrow from "@/app/icons/untitled-ui/duocolor/play-arrow";
import { deleteService, updateSeerviceStatus } from "@/actions";
import notify from "@/app/utils/toast";
import ConfirmationModal from "./confirmation-modal";
import Link from "next/link";
import EmptyState from "@/app/components/empty-state";

export default function ServiceList({
  services,
  pagination,
}: {
  services: ServiceType[];
  pagination: { total: number; page: number; pages: number };
}) {
  const [errMsg, setErrMsg] = useState("");
  const [updating, setUpdating] = useState(false);
  const router = useRouter();
  const [serviceToDelete, setServiceToDelete] = useState<string>();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChangePage = (_: unknown, newPage: number) => {
    router.push(`/demo/admin/services?page=${newPage + 1}`);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    router.push(
      `/demo/admin/services?page=${1}&limit=${parseInt(event.target.value, 10)}`
    );
  };

  return (
    <>
      <Card>
        <CardContent>
          {services.length > 0 && (
            <Typography variant="h6" sx={{ mb: 2 }}>
              Service List
            </Typography>
          )}
          {errMsg && (
            <Typography textAlign={"center"} variant="subtitle2" color="error">
              {errMsg}
            </Typography>
          )}

          {services.length > 0 ? (
            <Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableCell>
                        <strong>Name</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Price ($)</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Duration</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Number of Add-Ons</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Status</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>Actions</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {services.map((service) => (
                      <TableRow key={service._id}>
                        <TableCell>{service.name}</TableCell>
                        <TableCell>${service.price.toFixed(2)}</TableCell>
                        <TableCell>{service.duration} mins</TableCell>
                        <TableCell>
                          <Chip
                            label={service.addons?.length || 0}
                            color="primary"
                            sx={{ fontWeight: "bold" }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={service.status}
                            color={
                              service.status === "active"
                                ? "success"
                                : "default"
                            }
                            sx={{
                              textTransform: "capitalize",
                              fontWeight: "bold",
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Edit Service">
                            <Link href={`/demo/admin/services/${service._id}`}>
                              <IconButton color="primary">
                                <Edit />
                              </IconButton>
                            </Link>
                          </Tooltip>

                          {service.status === "active" ? (
                            <Tooltip title={"Put srvice on hold"}>
                              <IconButton
                                disabled={updating}
                                onClick={() => {
                                  setUpdating(true);
                                  updateSeerviceStatus(
                                    "on hold",
                                    service._id!
                                  ).then((result) => {
                                    if (result?.error) setErrMsg(result.error);
                                    if (result?.messaage)
                                      notify(result.messaage);
                                  });

                                  setUpdating(false);
                                }}
                                color="warning"
                              >
                                <Pause />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip title={"Reactivate Service"}>
                              <IconButton
                                disabled={updating}
                                onClick={() => {
                                  setUpdating(true);
                                  updateSeerviceStatus(
                                    "active",
                                    service._id!
                                  ).then((result) => {
                                    if (result?.error) {
                                      setErrMsg(result.error);
                                      setUpdating(false);
                                    }
                                    if (result?.messaage) {
                                      notify(result.messaage);
                                      setUpdating(false);
                                    }
                                  });
                                }}
                                color="success"
                              >
                                <PlayArrow />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Delete this seervice">
                            <IconButton
                              onClick={() => {
                                handleOpen();
                                setServiceToDelete(service._id!);
                              }}
                              color="error"
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={pagination.total}
                page={pagination.page - 1}
                rowsPerPage={services.length >= 5 ? services.length : 5}
                rowsPerPageOptions={[5, 10, 20]}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Box>
          ) : (
            <EmptyState
              title="No Service found"
              description="Try adding new service"
            />
          )}
        </CardContent>
      </Card>
      <ConfirmationModal
        open={open}
        message="Are you sure you want to delete this service?"
        onClose={handleClose}
        loading={updating}
        onConfirm={() => {
          if (serviceToDelete) {
            setUpdating(true);
            deleteService(serviceToDelete).then((result) => {
              if (result?.error) {
                setErrMsg(result.error);
                setUpdating(false);
                handleClose();
              }
              if (result?.message) {
                notify(result.message);
                setUpdating(false);
                handleClose();
              }
            });
          }
        }}
      />
    </>
  );
}
