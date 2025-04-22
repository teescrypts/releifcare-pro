"use client"

import { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  Divider,
  Avatar,
} from "@mui/material";

const AdminAccountSettings = () => {
  const [name, setName] = useState("Admin Name");
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("");

  const handleSaveChanges = () => {
    console.log("Saving changes...");
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Account Settings
      </Typography>

      {/* Profile Section */}
      <Stack spacing={3} sx={{ mb: 4 }}>
        <Typography variant="h6">Profile Information</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ width: 80, height: 80 }}>A</Avatar>
          <Button variant="outlined">Change Profile Picture</Button>
        </Stack>
        <TextField
          label="Full Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Email Address"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Stack>

      <Divider sx={{ my: 4 }} />

      {/* Security Section */}
      <Stack spacing={3} sx={{ mb: 4 }}>
        <Typography variant="h6">Password & Security</Typography>
        <TextField
          label="New Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained">Change Password</Button>
      </Stack>

      <Divider sx={{ my: 4 }} />

      {/* Notification Preferences */}
      <Stack spacing={3} sx={{ mb: 4 }}>
        <Typography variant="h6">Notifications</Typography>
        <Button variant="outlined">Manage Notification Preferences</Button>
      </Stack>

      <Divider sx={{ my: 4 }} />

      {/* Save Button */}
      <Stack direction="row" justifyContent="flex-end">
        <Button variant="contained" onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </Stack>
    </Container>
  );
};

export default AdminAccountSettings;
