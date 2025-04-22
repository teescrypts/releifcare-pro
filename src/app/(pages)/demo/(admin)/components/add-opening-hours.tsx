import { addHour } from "@/actions";
import { SubmitButton } from "@/app/components/submit-buttton";
import notify from "@/app/utils/toast";
import { ActionStateType } from "@/types";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import React, { useActionState, useEffect, useState } from "react";

const daysOfWeek = [
  { name: "monday", label: "Monday" },
  { name: "tuesday", label: "Tuesday" },
  { name: "wednesday", label: "Wednesday" },
  { name: "thursday", label: "Thursday" },
  { name: "friday", label: "Friday" },
  { name: "saturday", label: "Saturday" },
  { name: "sunday", label: "Sunday" },
];

const initialState: ActionStateType = null;

function AddOpeningHours({ onClose }: { onClose: () => void }) {
  const [message, setMessage] = useState("");

  const [state, formAction] = useActionState(addHour, initialState);

  useEffect(() => {
    if (state) {
      if ("ok" in state && state.ok) {
        notify(state.message);
        onClose();
      } else if ("error" in state) {
        setMessage(state.error);
      }
    }
  }, [state, onClose]);

  return (
    <Box>
      <form action={formAction}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="day-select-label">Day of the Week</InputLabel>
          <Select
            required
            name="day"
            labelId="day-select-label"
            defaultValue={""}
            label="Day of the Week"
          >
            {daysOfWeek.map((day) => (
              <MenuItem key={day.name} value={day.name}>
                {day.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <TimePicker sx={{ width: "100%" }} label="From" name="from" />
            <TimePicker sx={{ width: "100%" }} label="To" name="to" />
          </Stack>
        </LocalizationProvider>

        {message && (
          <Typography textAlign={"center"} color="error" variant="subtitle2">
            {message}
          </Typography>
        )}

        <SubmitButton title="Add Opening Hour" isFullWidth={true} />
      </form>
    </Box>
  );
}

export default AddOpeningHours;
