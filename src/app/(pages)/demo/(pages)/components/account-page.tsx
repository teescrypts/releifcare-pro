"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

// Dummy User Data
const initialUser = {
  name: "John Doe",
  email: "johndoe@example.com",
  phone: "+1 234 567 8901",
};

const AccountPage = () => {
  const [user, setUser] = useState(initialUser);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Password updated successfully!");
  };

  const handleDeleteAccount = () => {
    alert("Account deletion process started.");
    setOpenDeleteDialog(false);
  };

  return (
    <Box sx={{ maxWidth: "600px", mx: "auto", p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Account Settings
      </Typography>

      {/* Profile Details */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6">Profile Information</Typography>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={user.name}
            onChange={handleChange}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={user.email}
            onChange={handleChange}
            sx={{ mt: 2 }}
            disabled
          />
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={user.phone}
            onChange={handleChange}
            sx={{ mt: 2 }}
          />
          <Button variant="contained" sx={{ mt: 2 }} fullWidth>
            Save Changes
          </Button>
        </CardContent>
      </Card>

      <Divider sx={{ my: 2 }} />

      {/* Password Update */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6">Change Password</Typography>
          <TextField
            fullWidth
            type="password"
            label="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            type="password"
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handlePasswordChange}
          >
            Update Password
          </Button>
        </CardContent>
      </Card>

      <Divider sx={{ my: 2 }} />

      {/* Delete Account */}
      <Card>
        <CardContent>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Deleting your account is permanent and cannot be undone.
          </Typography>
          <Button
            variant="contained"
            color="error"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => setOpenDeleteDialog(true)}
          >
            Delete Account
          </Button>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Account Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete your account? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button color="error" onClick={handleDeleteAccount}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccountPage;
