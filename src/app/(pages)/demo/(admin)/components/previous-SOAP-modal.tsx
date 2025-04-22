"use client";

import Close from "@/app/icons/untitled-ui/duocolor/close";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Divider,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { NoteType } from "./appointment-page";
import { SOAPDataType } from "@/types";
import EmptyState from "@/app/components/empty-state";
import { fetchPrevNote } from "@/actions";

interface PreviousSOAPModalProps {
  open: boolean;
  onClose: () => void;
  clientName: string;
  clientId: string;
  noteData: NoteType | undefined;
}

export default function PreviousSOAPModal({
  open,
  onClose,
  clientName,
  clientId,
  noteData,
}: PreviousSOAPModalProps) {
  const [currentNote, setCurrentNote] = useState<SOAPDataType[]>();
  const [currentHasMore, setCurrrentHasMore] = useState<boolean>();
  const [currentNextCursor, setCurrentNextCursor] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (open && noteData) {
      setCurrentNote(noteData.notes);
      setCurrrentHasMore(noteData.hasMore);
      setCurrentNextCursor(noteData.nextCursor);
      setLoading(false);
    }
  }, [open, noteData]);

  const handleLoadMore = () => {
    setLoadingMore(true);
    fetchPrevNote(clientId, currentNextCursor).then((result) => {
      if (result) {
        if (result?.error) {
          setMessage(result.error);
          setLoadingMore(false);
        }

        if (result?.message) {
          const noteData = result.message;
          setCurrentNote(noteData.notes);
          setCurrrentHasMore(noteData.hasMore);
          setCurrentNextCursor(noteData.nextCursor);
          setLoadingMore(false);
        }
      }
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ m: 0, p: 2 }}>
        <Typography variant="h6" component="div">
          Previous SOAP Notes for {clientName}
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <Stack justifyContent={"center"} alignItems={"center"}>
            <CircularProgress />
            <Typography variant="subtitle2">Loadig Notes</Typography>
          </Stack>
        ) : (
          <Stack spacing={4}>
            {currentNote && currentNote.length > 0 ? (
              currentNote.map((note) => (
                <Box
                  key={note._id}
                  sx={{ p: 2, border: "1px solid #ddd", borderRadius: 2 }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    {new Date(note.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" fontWeight="bold">
                    Subjective:
                  </Typography>
                  <Typography variant="body2" mb={1}>
                    {note.subjective}
                  </Typography>

                  <Typography variant="body2" fontWeight="bold">
                    Objective:
                  </Typography>
                  <Typography variant="body2" mb={1}>
                    {note.objective}
                  </Typography>

                  <Typography variant="body2" fontWeight="bold">
                    Assessment:
                  </Typography>
                  <Typography variant="body2" mb={1}>
                    {note.assessment}
                  </Typography>

                  <Typography variant="body2" fontWeight="bold">
                    Plan:
                  </Typography>
                  <Typography variant="body2">{note.plan}</Typography>
                </Box>
              ))
            ) : (
              <EmptyState
                title={`No Note found`}
                description={`No SOAP Note found for ${clientName}`}
              />
            )}

            {message && (
              <Typography
                variant="subtitle2"
                color="error"
                textAlign={"center"}
              >
                {message}
              </Typography>
            )}

            {currentHasMore && (
              <Button
                variant="outlined"
                disabled={loadingMore}
                onClick={handleLoadMore}
              >
                Load More
              </Button>
            )}
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}
