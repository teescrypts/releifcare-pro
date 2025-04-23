"use client";

// REFACTORED CLIENT INTAKE FORM TO BE NON-HIPAA — PHI QUESTIONS REMOVED

import {
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Stack,
} from "@mui/material";
import ExpandMore from "@/app/icons/untitled-ui/duocolor/expand-more";
import { FormEvent, useEffect, useState } from "react";
import { signup } from "@/actions";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import validator from "validator";
import { ManualSubmitButton } from "@/app/components/edit-button";

export type ClientIntakeFormData = {
  fname: string;
  lname: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  emergencyContact: string;
  password: string;
  cPassword: string;
  massagePressure: string;
  focusAreas: string;
  allergies: string;
  consent: boolean | string;
};

const ClientIntakeForm = () => {
  const [adminId, setAdminId] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState<ClientIntakeFormData>({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    emergencyContact: "",
    password: "",
    cPassword: "",
    massagePressure: "",
    focusAreas: "",
    allergies: "",
    consent: false,
  });

  const [errors, setErrors] = useState<Partial<ClientIntakeFormData>>({});

  useEffect(() => {
    const storedAdminId = localStorage.getItem("adminId");
    if (storedAdminId) setAdminId(storedAdminId);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors: Partial<ClientIntakeFormData> = {};

    if (!formData.fname.trim()) newErrors.fname = "First name is required";
    if (!formData.lname.trim()) newErrors.lname = "Last name is required";
    if (!formData.email.trim() || !validator.isEmail(formData.email))
      newErrors.email = "Valid email is required";
    if (!formData.phone.trim() || !validator.isMobilePhone(formData.phone))
      newErrors.phone = "Valid phone number is required";
    if (!formData.dob.trim()) newErrors.dob = "Date of birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.emergencyContact.trim())
      newErrors.emergencyContact = "Emergency contact is required";
    if (!formData.password.trim() || formData.password.length < 7)
      newErrors.password = "Password must be at least 7 characters";
    if (formData.password !== formData.cPassword)
      newErrors.cPassword = "Passwords do not match";
    if (!formData.consent)
      newErrors.consent = "You must accept the consent agreement";
    if (!formData.massagePressure)
      newErrors.massagePressure = "Please select a preferred pressure level";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: FormEvent) => {
    e!.preventDefault();
    setMessage("");

    if (!validateForm()) return;

    setLoading(true);
    const result = await signup(
      formData,
      adminId,
      searchParams.get("reflink") as string | undefined
    );

    if (result?.error) {
      setMessage(result.error);
      setLoading(false);
    } else {
      router.push("/demo/dashboard/bookings");
    }
  };

  return (
    <Container maxWidth={"md"}>
      <Box sx={{ mx: "auto", mt: 10 }}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          Client Intake Form
        </Typography>

        {/* PRIVACY DISCLAIMER */}
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          <strong>Privacy Notice:</strong> This form is not used to collect
          protected health information (PHI). Please do not enter medical
          details, diagnoses, or treatment information.
        </Typography>

        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">Client Information</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              label="First Name"
              name="fname"
              fullWidth
              margin="normal"
              value={formData.fname}
              onChange={handleChange}
              error={!!errors.fname}
              helperText={errors.fname}
            />
            <TextField
              label="Last Name"
              name="lname"
              fullWidth
              margin="normal"
              value={formData.lname}
              onChange={handleChange}
              error={!!errors.lname}
              helperText={errors.lname}
            />
            <TextField
              label="Email"
              name="email"
              fullWidth
              margin="normal"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              label="Phone Number"
              name="phone"
              fullWidth
              margin="normal"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone}
            />
            <TextField
              label="Emergency Contact"
              name="emergencyContact"
              fullWidth
              margin="normal"
              type="tel"
              value={formData.emergencyContact}
              onChange={handleChange}
              error={!!errors.emergencyContact}
              helperText={errors.emergencyContact}
            />
            <TextField
              label="Date of Birth"
              name="dob"
              fullWidth
              margin="normal"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              error={!!errors.dob}
              helperText={errors.dob}
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth margin="normal" error={!!errors.gender}>
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                labelId="gender-label"
                name="gender"
                label="Gender"
                value={formData.gender}
                onChange={handleSelectChange}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
              <Typography variant="caption" color="error">
                {errors.gender}
              </Typography>
            </FormControl>
            <TextField
              label="Password"
              name="password"
              fullWidth
              margin="normal"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
            />
            <TextField
              label="Confirm Password"
              name="cPassword"
              fullWidth
              margin="normal"
              type="password"
              value={formData.cPassword}
              onChange={handleChange}
              error={!!errors.cPassword}
              helperText={errors.cPassword}
            />
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">Massage Preferences</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl fullWidth margin="normal">
              <InputLabel id="massage-pressure-label">
                Preferred Pressure Level
              </InputLabel>
              <Select
                labelId="massage-pressure-label"
                label="Preferred Pressure Level"
                name="massagePressure"
                value={formData.massagePressure}
                onChange={handleSelectChange}
              >
                <MenuItem value="Light">Light</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Deep Tissue">Deep Tissue</MenuItem>
              </Select>
              <Typography variant="caption" color="error">
                {errors.massagePressure}
              </Typography>
            </FormControl>
            <TextField
              label="Focus Areas (e.g., Neck, Back)"
              name="focusAreas"
              fullWidth
              margin="normal"
              value={formData.focusAreas}
              onChange={handleChange}
            />
            <TextField
              label="Allergies or Sensitivities (e.g., oils, scents)"
              name="allergies"
              fullWidth
              margin="normal"
              value={formData.allergies}
              onChange={handleChange}
            />
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">Consent & Agreement</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControlLabel
              control={
                <Checkbox
                  name="consent"
                  checked={
                    typeof formData.consent === "boolean"
                      ? formData.consent
                      : false
                  }
                  onChange={handleChange}
                />
              }
              label="I confirm that I have read and understood the terms of this service, and agree not to submit health or medical data through this form."
            />
          </AccordionDetails>
        </Accordion>

        <Stack>
          <Typography variant="caption" color="error" textAlign={"center"}>
            {errors.consent}
          </Typography>

          {message && (
            <Typography variant="caption" textAlign={"center"} color="error">
              {message}
            </Typography>
          )}
        </Stack>

        <ManualSubmitButton
          title={"Submit Form"}
          loading={loading}
          isFullWidth={false}
          onClick={handleSubmit}
        />
      </Box>
    </Container>
  );
};

export default ClientIntakeForm;
