import { paths } from "@/paths";
import { SvgIcon, SvgIconProps } from "@mui/material";
import { ReactElement, ReactNode, useMemo } from "react";
import Time from "../icons/untitled-ui/duocolor/time";
import LayoutAlt02 from "../icons/untitled-ui/duocolor/layout-alt-02";
import Settings from "../icons/untitled-ui/duocolor/settings";
import Services from "../icons/untitled-ui/duocolor/services";
import Loyalty from "../icons/untitled-ui/duocolor/loyalty";

interface MenuItem {
  title: string;
  value: string;
  path: string;
  icon?: ReactElement<SvgIconProps>;
  items?: MenuItem[];
}

interface MenuSection {
  subheader?: string | ReactNode;
  items: MenuItem[];
}

export const useSections = (): MenuSection[] => {
  return useMemo(() => {
    const sections = [
      {
        subheader: "DASHBOARD",
        items: [
          {
            title: "Appointments",
            value: "appointments",
            path: paths.admin.index,
            icon: (
              <SvgIcon fontSize="small">
                <Time />
              </SvgIcon>
            ),
          },
          {
            title: "Services",
            value: "services",
            path: paths.admin.services,
            icon: (
              <SvgIcon fontSize="small">
                <Services />
              </SvgIcon>
            ),
          },
          {
            title: "Marketing",
            value: "marketing",
            path: paths.admin.marketing,
            icon: (
              <SvgIcon fontSize="small">
                <Loyalty />
              </SvgIcon>
            ),
          },
          {
            title: "Blog",
            value: "blog",
            path: paths.admin.blog,
            icon: (
              <SvgIcon fontSize="small">
                <LayoutAlt02 />
              </SvgIcon>
            ),
          },
          {
            title: "Account",
            value: "account",
            path: paths.admin.account,
            icon: (
              <SvgIcon fontSize="small">
                <Settings />
              </SvgIcon>
            ),
          },
        ],
      },
    ];

    return sections;
  }, []);
};
