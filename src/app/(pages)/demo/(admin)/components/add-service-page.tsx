"use client";

import React, { useActionState, useCallback, useEffect, useState } from "react";
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
import { addService, fetchExistingServices } from "@/actions";
import { ActionStateType, ServiceAddonType } from "@/types";
import { SubmitButton } from "@/app/components/submit-buttton";
import { useRouter } from "nextjs-toploader/app";
import { paths } from "@/paths";

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

const initialState: ActionStateType = null;

export default function AddServicePage() {
  const [addOns, setAddOns] = useState<AddOn[]>([]);
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

  const loadServices = useCallback(() => {
    setLoaadingExtServices(true);
    fetchExistingServices().then((result) => {
      if (result?.error) {
        setErrMsg(result.error);
        setLoaadingExtServices(false);
      }

      if (result?.services) {
        setExtServices(result.services);
        setLoaadingExtServices(false);
      }
    });
  }, []);

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

    const { name, price, duration, description, status } = newAddOn;

    if (!name || !price || !duration || !description || !status) {
      alert("All fields are required. Please complete the form before saving.");
      return;
    }

    const newAddOnWithId = { ...newAddOn, id: crypto.randomUUID() };

    setAddOns((prev) => [...prev, newAddOnWithId]);
    setModalOpen(false);
    setNewAddOn(null);
    setStep("selectType"); // Reset modal step
  };

  const handleDeleteAddOn = (id: string) => {
    setAddOns(addOns.filter((addOn) => addOn.id !== id));
  };

  const addServicePlus = addService.bind(null, addOns);
  const [state, formAction] = useActionState(addServicePlus, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state) {
      if (state?.error) setMessage(state.error);
      if (state.message) router.push(paths.admin.services);
    }
  }, [state, router]);

  return (
    <Card>
      <CardContent>
        <form action={formAction}>
          <Stack spacing={2}>
            <TextField
              variant="outlined"
              label="Service Name"
              name="name"
              fullWidth
              required
            />
            <TextField
              variant="outlined"
              label="Price ($)"
              name="price"
              type="number"
              fullWidth
              required
            />
            <TextField
              variant="outlined"
              label="Duration (Minutes)"
              name="duration"
              type="number"
              fullWidth
              required
            />
            <TextField
              variant="outlined"
              label="Description"
              name="description"
              multiline
              rows={5}
              fullWidth
              required
            />

            <FormControl fullWidth variant="outlined" required>
              <InputLabel>Status</InputLabel>
              <Select
                defaultValue={""}
                variant="outlined"
                label="Status"
                name="status"
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="on hold">On Hold</MenuItem>
              </Select>
            </FormControl>

            {/* Add-Ons Section */}
            <Card variant="outlined" sx={{ p: 2, mt: 2 }}>
              <Typography variant="h6">Add-Ons</Typography>
              {addOns.length > 0 ? (
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
            <SubmitButton title="Add Service" isFullWidth={true} />
          </Stack>
        </form>
      </CardContent>

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
    </Card>
  );
}
