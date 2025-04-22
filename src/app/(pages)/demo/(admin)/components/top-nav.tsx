import Menu from "@/app/icons/untitled-ui/duocolor/menu";
import {
  alpha,
  Box,
  Button,
  IconButton,
  Stack,
  SvgIcon,
  Theme,
  useMediaQuery,
} from "@mui/material";
import React from "react";
import AccountButton from "./account-button/account-button";
import Link from "next/link";
import { useUserData } from "@/app/guards/admin/auth";

const TOP_NAV_HEIGHT = 64;
const SIDE_NAV_WIDTH = 280;

function Topnav({
  onMobileNavOpen,
  ...other
}: {
  onMobileNavOpen: () => void;
}) {
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));
  const admin = useUserData();

  return (
    <Box
      component="header"
      sx={{
        backdropFilter: "blur(6px)",
        backgroundColor: (theme: Theme) =>
          alpha(theme.palette.background.default, 0.9),
        position: "sticky",
        left: {
          lg: `${SIDE_NAV_WIDTH}px`,
        },
        top: 0,
        width: {
          lg: `calc(100% - ${SIDE_NAV_WIDTH}px)`,
        },
        zIndex: (theme) => theme.zIndex.appBar,
      }}
      {...other}
    >
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{
          minHeight: TOP_NAV_HEIGHT,
          px: 2,
        }}
      >
        <Stack alignItems="center" direction="row" spacing={2}>
          {!lgUp && (
            <IconButton onClick={onMobileNavOpen}>
              <SvgIcon>
                <Menu />
              </SvgIcon>
            </IconButton>
          )}
        </Stack>
        <Stack alignItems="center" direction="row" spacing={2}>
          <Link href={`/demo?admin=${admin.id}`}>
            <Button variant="contained" color="primary" size="small">
              Try Customer
            </Button>
          </Link>
          {/* <NotificationsButton /> */}
          <AccountButton />
        </Stack>
      </Stack>
    </Box>
  );
}

export default Topnav;
