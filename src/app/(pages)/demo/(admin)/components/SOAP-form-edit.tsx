import { Box, Paper, Stack, TextField, Typography } from "@mui/material";
import React, { useActionState, useEffect, useState } from "react";
import { FormType } from "./SOAP-note";
import { SubmitButton } from "@/app/components/submit-buttton";
import { editNote } from "@/actions";
import notify from "@/app/utils/toast";
import { ActionStateType } from "@/types";

const initialState: ActionStateType = null;

function SOAPFormEdit({
  appointmentId,
  client,
  form,
  onClose,
  setForm,
}: {
  appointmentId: string;
  client: string;
  form: FormType;
  setForm: React.Dispatch<React.SetStateAction<FormType | undefined>>;
  onClose: () => void;
}) {
  const [message, setMessaage] = useState("");
  const [state, formAction] = useActionState(editNote, initialState);

  useEffect(() => {
    if (state) {
      if (state?.error) setMessaage(state.error);
      if (state?.message) {
        notify(state.message);
        onClose();
        setForm(undefined);
      }
    }
  }, [state, onClose, setForm]);

  return (
    <form action={formAction}>
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
              defaultValue={form.subjective}
              multiline
              fullWidth
              minRows={3}
              variant="outlined"
            />
            <TextField
              required
              label="Objective"
              name="objective"
              defaultValue={form.objective}
              multiline
              fullWidth
              minRows={3}
              variant="outlined"
            />
            <TextField
              required
              label="Assessment"
              name="assessment"
              defaultValue={form.assessment}
              multiline
              fullWidth
              minRows={3}
              variant="outlined"
            />
            <TextField
              required
              label="Plan"
              name="plan"
              defaultValue={form.plan}
              multiline
              fullWidth
              minRows={3}
              variant="outlined"
            />

            <input defaultValue={appointmentId} name="appointment" hidden />
            <input defaultValue={client} name="client" hidden />
            <input defaultValue={form._id} name="note" hidden />

            <SubmitButton title={"Edit Note"} isFullWidth={true} />
          </Stack>
        </Paper>
      </Box>
    </form>
  );
}

export default SOAPFormEdit;
