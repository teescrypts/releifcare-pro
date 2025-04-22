import Add from "@/app/icons/untitled-ui/duocolor/add";
import {
  Box,
  Container,
  Stack,
  Typography,
  Button,
  SvgIcon,
} from "@mui/material";
import React from "react";

import { Metadata } from "next/types";
import { cookies } from "next/headers";
import { RouterLink } from "@/app/components/router-link";
import BlogPage from "../../components/blog-page";
import apiRequest from "@/app/lib/api-request";
// import apiRequest from "@/app/lib/api-request";

export const metadata: Metadata = {
  title: "Blog | Innovative Real Estate Solutions",
  description:
    "Explore our live demo website showcasing cutting-edge tools for independent realtors. Our platform offers creative solutions for listing, buying, and renting properties—designed to elevate your real estate business.",
  keywords:
    "realtor demo, real estate solutions, independent realtor, property listing, modern real estate website, innovative real estate, property management",
  icons: {
    icon: "/images/logo.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Realtor Demo | Innovative Real Estate Solutions",
    description:
      "Discover a modern, creative platform designed for independent realtors. Elevate your business with our innovative tools and user-friendly interface.",
    url: "https://realtyillustrations.live", // Replace with your actual domain
    type: "website",
    images: [
      {
        url: "https://realtyillustrations.live/images/logo.png", // Replace with your actual OG image URL
        width: 1200,
        height: 630,
        alt: "Realtor Demo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Realtor Demo | Innovative Real Estate Solutions",
    description:
      "Explore our live demo website showcasing modern tools for independent realtors.",
    images: ["https://realtyillustrations.live/images/logo.png"], // Replace accordingly
  },
};

interface BlogType {
  _id: string;
  title: string;
  shortDescription: string;
  author: string;
  content: string;
  status: "draft" | "published";
  cover: { url: string; fileName: string; imageId: string };
  createdAt: string;
  updatedAt: string;
}

export type DraftImgType = { url: string; imageId: string; fileName: string };

async function Page() {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const response = await apiRequest<{ data: { blogs: BlogType[] } }>(
    "admin/blog",
    {
      token,
      tag: "fetchAdminBlogs",
    }
  );

  const blogs = response.data.blogs;

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={4}>
          <Stack direction="row" justifyContent="space-between" spacing={4}>
            <Stack spacing={1}>
              <Typography variant="h4">Blog</Typography>
            </Stack>
            <Stack alignItems="center" direction="row" spacing={3}>
              <Button
                component={RouterLink}
                href={"/demo/admin/blog/add"}
                startIcon={
                  <SvgIcon>
                    <Add />
                  </SvgIcon>
                }
                variant="contained"
              >
                Add New Blog
              </Button>
            </Stack>
          </Stack>
          <BlogPage blogs={blogs} />
        </Stack>
      </Container>
    </Box>
  );
}

export default Page;
