"use client";

import { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Container,
} from "@mui/material";
import Link from "next/link";
import Menu from "@/app/icons/untitled-ui/duocolor/menu";
import { paths } from "@/paths";
import { useUserData } from "@/app/guards/dashboard/auth";

const menuItems = [
  { label: "Appointments", path: paths.dashboard.index },
  { label: "Loyalty Points", path: paths.dashboard.loyaltyPoint },
  { label: "Account", path: paths.dashboard.account },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = useUserData();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", mt: 8 }}>
      {/* Sidebar for large screens */}
      <Box
        sx={{
          width: { xs: 0, md: 250 },
          flexShrink: 0,
          display: { xs: "none", md: "block" },
          bgcolor: "background.paper",
          borderRight: 1,
          borderColor: "divider",
          p: 2,
        }}
      >
        {typeof user !== "string" && (
          <Typography variant="h6" sx={{ mb: 2 }}>
            Welcome {`${user.fname} ${user.lname}`}
          </Typography>
        )}
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton component={Link} href={item.path}>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Mobile App Bar */}
      <AppBar
        position="fixed"
        sx={{ display: { md: "none" }, bgcolor: "primary.main", mt: 8 }}
      >
        <Container>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleDrawerToggle}
            >
              <Menu />
            </IconButton>
            {typeof user !== "string" && (
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Welcome {`${user.fname} ${user.lname}`}
              </Typography>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          "& .MuiDrawer-paper": { width: 250, bgcolor: "background.paper" },
        }}
      >
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                component={Link}
                href={item.path}
                onClick={handleDrawerToggle}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content Area */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: { xs: 8, md: 0 } }}>
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
