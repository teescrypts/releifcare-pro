"use client";

import Instagram from "@/app/icons/untitled-ui/duocolor/instaagram";
import Linkedin from "@/app/icons/untitled-ui/duocolor/linkedin";
import Share07 from "@/app/icons/untitled-ui/duocolor/share-07";
import Twitter from "@/app/icons/untitled-ui/duocolor/twitter";
import Whatsapp from "@/app/icons/untitled-ui/duocolor/whatsapp";
import { formatCreatedAt } from "@/app/utils/format-created-at";
import { blogType } from "@/types";
import {
  Container,
  Box,
  Typography,
  Stack,
  Divider,
  IconButton,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function SingleBlogPage({
  blog,
  adminId,
}: {
  blog: blogType;
  adminId?: string;
}) {
  const blogUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = `Check out this blog: ${blog.title}`;
  const theme = useTheme();

  const sharePost = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: shareTitle,
          url: blogUrl,
        });
        return;
      } catch (error) {
        console.warn(
          "Web Share API failed, falling back to deep links.",
          error
        );
      }
    }
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        blogUrl
      )}`,
      "_blank"
    );
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
      {/* Cover Image */}
      <Box
        sx={{
          position: "relative",
          borderRadius: 4,
          overflow: "hidden",
          height: { xs: 300, md: 500 },
          mb: 4,
        }}
      >
        {blog.cover?.url && (
          <Image
            src={blog.cover.url}
            alt={blog.title!}
            layout="fill"
            objectFit="cover"
            priority
            style={{
              objectPosition: "center",
              filter: "brightness(0.85)",
            }}
          />
        )}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))",
          }}
        />
      </Box>

      {/* Blog Title */}
      <Typography
        variant="h3"
        fontWeight="bold"
        gutterBottom
        sx={{
          fontFamily: "'Playfair Display', serif",
          textAlign: "center",
        }}
      >
        {blog.title}
      </Typography>

      {/* Author & Date */}
      <Stack direction="row" spacing={2} justifyContent="center" mb={4}>
        <Typography variant="body2" color="text.secondary">
          By {blog.author}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {formatCreatedAt(blog.createdAt)}
        </Typography>
      </Stack>

      <Divider sx={{ mb: 4, borderColor: theme.palette.grey[300] }} />

      {/* Blog Content */}
      <Box
        sx={{
          typography: "body1",
          fontSize: "1.1rem",
          lineHeight: 1.8,
          color: "text.primary",
          textAlign: "justify",
          "& p": { mb: 3 },
          "& h2, & h3": {
            fontFamily: "'Playfair Display', serif",
            mt: 4,
            mb: 2,
          },
        }}
        dangerouslySetInnerHTML={{ __html: blog.content! }}
      />

      {/* Navigation + Share */}
      <Box textAlign="center" mt={6}>
        <Link
          href={adminId ? `/demo/blog?admin=${adminId}` : `/demo/blog`}
          passHref
        >
          <Typography
            variant="body2"
            color="primary"
            sx={{ textDecoration: "underline", cursor: "pointer", mb: 2 }}
          >
            ← Back to All Blogs
          </Typography>
        </Link>

        <Stack direction="row" spacing={1.5} justifyContent="center" mt={3}>
          <IconButton onClick={sharePost} color="primary">
            <Share07 />
          </IconButton>
          <IconButton
            component="a"
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              shareTitle
            )}&url=${encodeURIComponent(blogUrl)}`}
            target="_blank"
            color="primary"
          >
            <Twitter />
          </IconButton>
          <IconButton
            component="a"
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
              shareTitle + " " + blogUrl
            )}`}
            target="_blank"
            color="success"
          >
            <Whatsapp />
          </IconButton>
          <IconButton
            component="a"
            href={`https://www.instagram.com/?url=${encodeURIComponent(
              blogUrl
            )}`}
            target="_blank"
            color="secondary"
          >
            <Instagram />
          </IconButton>
          <IconButton
            component="a"
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              blogUrl
            )}`}
            target="_blank"
            color="primary"
          >
            <Linkedin />
          </IconButton>
        </Stack>
      </Box>
    </Container>
  );
}

export default SingleBlogPage;
