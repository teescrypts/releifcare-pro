import { addNote } from "@/actions";
import { SubmitButton } from "@/app/components/submit-buttton";
import notify from "@/app/utils/toast";
import { ActionStateType } from "@/types";
import { Box, Paper, Stack, TextField, Typography } from "@mui/material";
import React, { useActionState, useEffect, useState } from "react";

const initialState: ActionStateType = null;

function SOAPFormAdd({
  appointmentId,
  client,
  onClose,
}: {
  appointmentId: string;
  client: string;
  onClose: () => void;
}) {
  const [message, setMessaage] = useState("");
  const [state, formAction] = useActionState(addNote, initialState);

  useEffect(() => {
    if (state) {
      if (state?.error) setMessaage(state.error);
      if (state?.message) {
        notify(state.message);
        onClose();
      }
    }
  }, [state, onClose]);

  return (
    <form action={formAction}>
      {/* Content */}
      <Box p={2}>
        {message && (
          <Typography variant="subtitle2" color="error" textAlign={"center"}>
            {message}
          </Typography>
        )}
        <Paper elevation={0}>
          <Stack spacing={3}>
            <TextField
              required
              label="Subjective"
              name="subjective"
              multiline
              fullWidth
              minRows={3}
              variant="outlined"
            />
            <TextField
              required
              label="Objective"
              name="objective"
              multiline
              fullWidth
              minRows={3}
              variant="outlined"
            />
            <TextField
              required
              label="Assessment"
              name="assessment"
              multiline
              fullWidth
              minRows={3}
              variant="outlined"
            />
            <TextField
              required
              label="Plan"
              name="plan"
              multiline
              fullWidth
              minRows={3}
              variant="outlined"
            />

            <input defaultValue={appointmentId} name="appointment" hidden />
            <input defaultValue={client} name="client" hidden />

            <SubmitButton title={"Add Note"} isFullWidth={true} />
          </Stack>
        </Paper>
      </Box>
    </form>
  );
}

export default SOAPFormAdd;
