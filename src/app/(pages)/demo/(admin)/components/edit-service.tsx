"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Box,
  Modal,
  IconButton,
  CircularProgress,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
} from "@mui/material";
import Delete from "@/app/icons/untitled-ui/duocolor/delete";
import Add from "@/app/icons/untitled-ui/duocolor/add";
import Close from "@/app/icons/untitled-ui/duocolor/close";
import { editService, fetchExistingServices } from "@/actions";
import { ServiceAddonType, ServiceType } from "@/types";
import notify from "@/app/utils/toast";
import { ManualSubmitButton } from "@/app/components/edit-button";

// Define the add-on type
export interface AddOn {
  id?: string;
  name: string;
  price: number;
  duration: number;
  description: string;
  status: "active" | "on hold";
  isStandalone: boolean;
}

interface CurrentServiceType {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  status: "active" | "on hold";
}

export default function EditService({ service }: { service: ServiceType }) {
  const [currentService, setCurrentService] = useState<CurrentServiceType>();
  const [addOns, setAddOns] = useState<AddOn[]>();
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState<"selectType" | "existing" | "new">(
    "selectType"
  );
  const [newAddOn, setNewAddOn] = useState<AddOn | null>(null);
  const [selectedService, setSelectedService] = useState("");

  const [loadingExtServices, setLoaadingExtServices] = useState(false);
  const [extServices, setExtServices] = useState<ServiceAddonType[]>();
  const [errMsg, setErrMsg] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCurrentService({
      name: service.name,
      _id: service._id!,
      description: service.description,
      price: service.price,
      duration: service.duration,
      status: service.status,
    });

    if (service.addons.length > 0) {
      const existingAddons = service.addons.map((addon) => {
        return {
          name: addon.name,
          id: addon._id,
          description: addon.description,
          price: addon.price,
          duration: addon.duration,
          status: addon.status,
          isStandalone: false,
        };
      });
      setAddOns(existingAddons);
    } else {
      setAddOns([]);
    }
  }, [service]);

  const loadServices = useCallback(() => {
    setLoaadingExtServices(true);
    fetchExistingServices().then((result) => {
      if (result?.error) {
        setErrMsg(result.error);
        setLoaadingExtServices(false);
      }

      if (result?.services) {
        const filteredService = result.services.filter(
          (extService) => extService._id !== service._id
        );
        setExtServices(filteredService);
        setLoaadingExtServices(false);
      }
    });
  }, [service._id]);

  const handleAddOnChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setNewAddOn((prev) => ({
      ...prev!,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveAddOn = () => {
    if (!newAddOn) {
      alert("Please fill in all fields.");
      return;
    }

    if (addOns && addOns.length > 0) {
      const alreadyExt = addOns.find(
        (extAddon) => extAddon.name === newAddOn.name
      );

      if (alreadyExt) return alert("Add on with that name already exist");
    }

    const { name, price, duration, description, status } = newAddOn;

    if (!name || !price || !duration || !description || !status) {
      alert("All fields are required. Please complete the form before saving.");
      return;
    }

    const newAddOnWithId = { ...newAddOn, id: crypto.randomUUID() };

    setAddOns((prev) => {
      if (prev) {
        return [...prev, newAddOnWithId];
      } else {
        return [newAddOnWithId];
      }
    });
    setModalOpen(false);
    setNewAddOn(null);
    setStep("selectType"); // Reset modal step
  };

  const handleDeleteAddOn = (id: string) => {
    if (addOns) {
      setAddOns(addOns.filter((addOn) => addOn.id !== id));
    }
  };

  const handleEditService = () => {
    if (addOns && currentService) {
      setLoading(true);
      editService(addOns, currentService, service._id!).then((result) => {
        if (result?.error) {
          setErrMsg(result.error);
          setLoading(false);
        }

        if (result?.message) {
          notify(result.message);
          setLoading(false);
        }
      });
    }
  };

  if (!currentService) {
    return (
      <Typography variant="subtitle1" textAlign={"center"}>
        Fetching Service...
      </Typography>
    );
  }

  return (
    <>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <TextField
              variant="outlined"
              label="Service Name"
              value={currentService.name}
              onChange={(e) =>
                setCurrentService((prev) => {
                  return { ...prev!, [e.target.name]: e.target.value };
                })
              }
              name="name"
              fullWidth
              required
            />
            <TextField
              variant="outlined"
              label="Price ($)"
              value={currentService.price}
              onChange={(e) =>
                setCurrentService((prev) => {
                  return { ...prev!, [e.target.name]: e.target.value };
                })
              }
              name="price"
              type="number"
              fullWidth
              required
            />
            <TextField
              variant="outlined"
              label="Duration (Minutes)"
              value={currentService.duration}
              onChange={(e) =>
                setCurrentService((prev) => {
                  return { ...prev!, [e.target.name]: e.target.value };
                })
              }
              name="duration"
              type="number"
              fullWidth
              required
            />
            <TextField
              variant="outlined"
              label="Description"
              value={currentService.description}
              onChange={(e) =>
                setCurrentService((prev) => {
                  return { ...prev!, [e.target.name]: e.target.value };
                })
              }
              name="description"
              multiline
              rows={5}
              fullWidth
              required
            />

            <input defaultValue={service._id} name="id" hidden />

            <FormControl fullWidth variant="outlined" required>
              <InputLabel>Status</InputLabel>
              <Select
                variant="outlined"
                label="Status"
                name="status"
                value={currentService.status}
                onChange={(e) =>
                  setCurrentService((prev) => {
                    return { ...prev!, [e.target.name]: e.target.value };
                  })
                }
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="on hold">On Hold</MenuItem>
              </Select>
            </FormControl>

            {/* Add-Ons Section */}
            <Card variant="outlined" sx={{ p: 2, mt: 2 }}>
              <Typography variant="h6">Add-Ons</Typography>
              {addOns && addOns.length > 0 ? (
                <Stack spacing={1} sx={{ mt: 2 }}>
                  {addOns.map((addOn, index) => (
                    <Box
                      key={index}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      p={1}
                      sx={{
                        borderRadius: 1,
                        border: "1px solid #ccc",
                        bgcolor: "#f9f9f9",
                      }}
                    >
                      <Typography>
                        {addOn.name} - ${addOn.price}
                      </Typography>
                      <IconButton
                        onClick={() => handleDeleteAddOn(addOn.id!)}
                        color="error"
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="textSecondary" mt={1}>
                  No add-ons added.
                </Typography>
              )}

              <Button
                variant="outlined"
                startIcon={<Add />}
                sx={{ mt: 2 }}
                onClick={() => setModalOpen(true)}
              >
                Add Add-On
              </Button>
            </Card>
            <ManualSubmitButton
              title="Save Edit"
              isFullWidth={true}
              onClick={handleEditService}
              loading={loading}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Add-Ons Modal */}
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setStep("selectType"); // Reset step on close
          setExtServices(undefined);
        }}
        aria-labelledby="add-on-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", md: "50%" },
            bgcolor: "background.paper",
            p: 3,
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          <Stack spacing={2}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="h6">Add Add-On</Typography>
              <IconButton
                onClick={() => {
                  setModalOpen(false);
                  setStep("selectType"); // Reset step on close
                  setExtServices(undefined);
                }}
              >
                <Close />
              </IconButton>
            </Box>

            {/* Step 1: Ask user whether to use an existing service or create new */}
            {step === "selectType" && (
              <>
                <Typography variant="body1">
                  How would you like to add an add-on?
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => {
                    setStep("existing");
                    loadServices();
                  }}
                >
                  Select from Existing Services
                </Button>
                <Button variant="contained" onClick={() => setStep("new")}>
                  Create New Add-On
                </Button>
              </>
            )}

            {/* Step 2: Select from Existing Services */}
            {step === "existing" && extServices && (
              <>
                {extServices.length > 0 ? (
                  <Box>
                    <TextField
                      variant="outlined"
                      label="Select Add-On"
                      select
                      fullWidth
                      value={selectedService} // Keeps the selected ID
                      sx={{ my: 4 }}
                      onChange={(e) => {
                        const selectedServiceId = e.target.value;
                        const selectedServiceObj = extServices.find(
                          (service) => service._id === selectedServiceId
                        );

                        if (selectedServiceObj) {
                          const newAddOn = {
                            name: selectedServiceObj.name,
                            price: selectedServiceObj.price,
                            status: selectedServiceObj.status,
                            duration: selectedServiceObj.duration,
                            description: selectedServiceObj.description,
                            isStandalone: false,
                          };

                          setNewAddOn(newAddOn);
                          setSelectedService(selectedServiceId); // Store the ID in state
                        }
                      }}
                    >
                      {extServices.map((service) => (
                        <MenuItem key={service._id} value={service._id}>
                          {service.name} {/* Display name but store ID */}
                        </MenuItem>
                      ))}
                    </TextField>

                    {message && (
                      <Typography
                        variant="subtitle2"
                        color="error"
                        textAlign={"center"}
                      >
                        {message}
                      </Typography>
                    )}

                    <Button
                      variant="contained"
                      onClick={() => {
                        if (newAddOn) {
                          handleSaveAddOn();
                          setExtServices(undefined);
                          setSelectedService("");
                        } else {
                          setMessage("Please select a service");
                        }
                      }}
                    >
                      Save Add-On
                    </Button>
                  </Box>
                ) : (
                  <Typography variant="subtitle2" textAlign={"center"}>
                    No existing service
                  </Typography>
                )}
              </>
            )}

            {step === "existing" && loadingExtServices && (
              <Stack justifyContent={"center"} alignItems={"center"}>
                <CircularProgress />
              </Stack>
            )}

            {step === "existing" && errMsg && (
              <Typography
                color="error"
                textAlign={"center"}
                variant="subtitle1"
              >
                {errMsg}
              </Typography>
            )}

            {/* Step 3: Create New Add-On */}
            {step === "new" && (
              <>
                <TextField
                  variant="outlined"
                  label="Add-On Name"
                  name="name"
                  fullWidth
                  required
                  onChange={handleAddOnChange}
                />
                <TextField
                  variant="outlined"
                  label="Price ($)"
                  name="price"
                  type="number"
                  fullWidth
                  required
                  onChange={handleAddOnChange}
                />
                <TextField
                  variant="outlined"
                  label="Duration (Minutes)"
                  name="duration"
                  type="number"
                  fullWidth
                  required
                  onChange={handleAddOnChange}
                />
                <TextField
                  variant="outlined"
                  label="Description"
                  name="description"
                  multiline
                  rows={5}
                  fullWidth
                  required
                  onChange={handleAddOnChange}
                />

                <TextField
                  variant="outlined"
                  required
                  label="Status"
                  name="status"
                  select
                  fullWidth
                  onChange={handleAddOnChange}
                  value={newAddOn?.status || ""}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="on hold">On Hold</MenuItem>
                  <MenuItem value=""></MenuItem>
                </TextField>

                {/* New Checkbox for isStandalone */}
                <FormControl component="fieldset">
                  <FormControlLabel
                    control={
                      <Checkbox
                        required
                        name="isStandalone"
                        onChange={handleAddOnChange}
                        checked={!!newAddOn?.isStandalone} // Ensure proper boolean handling
                      />
                    }
                    label="Set this Add-On as a Standalone Service"
                  />
                </FormControl>

                <Button variant="contained" onClick={() => handleSaveAddOn()}>
                  Save Add-On
                </Button>
              </>
            )}
          </Stack>
        </Box>
      </Modal>
    </>
  );
}
