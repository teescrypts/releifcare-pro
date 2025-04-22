import {
  Box,
  Container,
  Stack,
  Typography,
  Breadcrumbs,
  Link,
} from "@mui/material";
import React from "react";
import { cookies } from "next/headers";
import { RouterLink } from "@/app/components/router-link";
import AddBlog from "../../../components/add-blog";
import apiRequest from "@/app/lib/api-request";
import { DraftImgType } from "@/types";

async function Page() {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const response = await apiRequest<{
    message: string;
    data: { draftImg: DraftImgType | string };
  }>("admin/blog/image/draft", {
    token,
    tag: "fetchBlogDraftImg",
  });

  const draftImg = response.data.draftImg;

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={1}>
          <Typography variant="h3">Publish Blog</Typography>
          <Stack sx={{ mb: 2 }}>
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              <Link
                underline="hover"
                color="inherit"
                sx={{ cursor: "pointer" }}
                component={RouterLink}
                href={"/demo/admin/blog"}
              >
                Blog
              </Link>
              <Typography color="text.primary">Add New Blog</Typography>
            </Breadcrumbs>
          </Stack>
        </Stack>
        <AddBlog draftImg={draftImg} />
      </Container>
    </Box>
  );
}

export default Page;
