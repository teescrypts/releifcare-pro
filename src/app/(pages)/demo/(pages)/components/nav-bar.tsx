"use client";

import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
} from "@mui/material";
import MenuIcon from "@/app/icons/untitled-ui/duocolor/menu";
import Close from "@/app/icons/untitled-ui/duocolor/close";
import { useRouter } from "nextjs-toploader/app";
import { paths } from "@/paths";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ToastContainer, Zoom } from "react-toastify";
import { useUserData } from "@/app/guards/dashboard/auth";

const Navbar = () => {
  const [scrolling, setScrolling] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [adminId, setAdminId] = useState<string>();

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const storedAdminId = localStorage.getItem("adminId");
    if (storedAdminId) setAdminId(storedAdminId);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Toggle mobile menu
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const theme = useTheme();
  const userData = useUserData();

  useEffect(() => {
    if (typeof userData === "string") {
      setIsLoggedIn(false);
    } else setIsLoggedIn(true);
  }, [userData]);

  const isHomePage = pathname === "/demo";

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme.palette.mode}
        transition={Zoom}
      />
      <AppBar
        position="fixed"
        elevation={scrolling ? 4 : 0}
        sx={{
          backgroundColor: scrolling
            ? "rgba(255, 255, 255, 0.9)"
            : "transparent",
          backdropFilter: scrolling ? "blur(10px)" : "none",
          transition: "background-color 0.3s ease-in-out",
        }}
      >
        <Container>
          <Toolbar>
            {/* Logo */}
            <Box sx={{ flexGrow: 1 }}>
              <Link href={adminId ? `/demo?admin=${adminId}` : "/demo"}>
                <Typography
                  variant="h6"
                  sx={{ color: scrolling || !isHomePage ? "black" : "white" }}
                >
                  Massage Bliss
                </Typography>
              </Link>
            </Box>

            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
              <Button
                onClick={() =>
                  router.push(
                    adminId
                      ? `${paths.services.index}?admin=${adminId}`
                      : paths.services.index
                  )
                }
                sx={{ color: scrolling || !isHomePage ? "black" : "white" }}
              >
                Services
              </Button>
              <Button
                onClick={() =>
                  router.push(
                    adminId
                      ? `${paths.about.index}?admin=${adminId}`
                      : paths.about.index
                  )
                }
                sx={{ color: scrolling || !isHomePage ? "black" : "white" }}
              >
                About
              </Button>
              <Button
                onClick={() =>
                  router.push(
                    adminId
                      ? `${paths.contact.index}?admin=${adminId}`
                      : paths.about.index
                  )
                }
                sx={{ color: scrolling || !isHomePage ? "black" : "white" }}
              >
                Contact
              </Button>
              <Button
                onClick={() =>
                  router.push(
                    adminId
                      ? `${paths.blog.index}?admin=${adminId}`
                      : paths.about.index
                  )
                }
                sx={{ color: scrolling || !isHomePage ? "black" : "white" }}
              >
                Blog
              </Button>

              {/* Conditional Button for Logged-in Users */}

              {isLoggedIn !== null && isLoggedIn && (
                <Button
                  onClick={() => router.push(paths.dashboard.index)}
                  sx={{ color: scrolling || !isHomePage ? "black" : "white" }}
                >
                  Dashboard
                </Button>
              )}

              {isLoggedIn !== null && !isLoggedIn && (
                <Button
                  onClick={() =>
                    router.push(
                      adminId ? `/demo/login?adminId=${adminId}` : `/demo/login`
                    )
                  }
                  sx={{ color: scrolling || !isHomePage ? "black" : "white" }}
                >
                  Sign In
                </Button>
              )}
            </Box>

            {/* Mobile Menu Button */}
            <IconButton
              onClick={handleDrawerToggle}
              sx={{
                display: { md: "none" },
                color: scrolling || !isHomePage ? "black" : "white",
              }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          "& .MuiDrawer-paper": {
            width: "250px",
            backgroundColor: "#fff",
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
          <IconButton onClick={handleDrawerToggle}>
            <Close />
          </IconButton>
        </Box>

        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                router.push("/demo");
                handleDrawerToggle();
              }}
            >
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                router.push(
                  adminId
                    ? `${paths.services.index}?admin=${adminId}`
                    : paths.services.index
                );
                handleDrawerToggle();
              }}
            >
              <ListItemText primary="Services" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                router.push(
                  adminId
                    ? `${paths.about.index}?admin=${adminId}`
                    : paths.about.index
                );
                handleDrawerToggle();
              }}
            >
              <ListItemText primary="About" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                router.push(
                  adminId
                    ? `${paths.contact.index}?admin=${adminId}`
                    : paths.about.index
                );
                handleDrawerToggle();
              }}
            >
              <ListItemText primary="Contact" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                router.push(
                  adminId
                    ? `${paths.blog.index}?admin=${adminId}`
                    : paths.about.index
                );
                handleDrawerToggle();
              }}
            >
              <ListItemText primary="Blog" />
            </ListItemButton>
          </ListItem>

          {/* Conditional Button for Logged-in Users */}
          {isLoggedIn !== null && (
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  router.push(
                    isLoggedIn
                      ? paths.dashboard.index
                      : adminId
                      ? `/demo/login?adminId=${adminId}`
                      : `/demo/login`
                  );
                  handleDrawerToggle();
                }}
              >
                <ListItemText primary={isLoggedIn ? "Dashboard" : "Sign In"} />
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;
