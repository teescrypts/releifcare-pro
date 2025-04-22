"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid2,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { BlogType } from "@/types";
import FileDropzone from "@/app/components/file-dropzone";
import { QuillEditor } from "@/app/components/quil-editor";
import { deleteBlogImage, updateBlog, uploadImage } from "@/actions";
import notify from "@/app/utils/toast";
import { ManualSubmitButton } from "@/app/components/edit-button";

export interface BlogDraftImageType {
  url: string;
  fileName: string;
  imageId: string;
}

interface CurrentBlogType {
  title?: string;
  shortDescription?: string;
  author?: string;
  estReadTime?: number;
  content?: string;
  status: "Draft" | "Published";
}

function EditBlog({
  draftImg,
  blog,
}: {
  draftImg: BlogDraftImageType | string;
  blog: BlogType;
}) {
  const [cover, setCover] = useState<{
    url: string;
    imageId: string;
    fileName: string;
  } | null>(null);
  const [imgMsg, setImgMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<CurrentBlogType>();

  useEffect(() => {
    setCurrentBlog({
      title: blog.title,
      shortDescription: blog.shortDescription,
      author: blog.author,
      estReadTime: blog.estReadTime,
      content: blog.content,
      status: blog.status,
    });
  }, [blog]);

  useEffect(() => {
    if (typeof draftImg === "string") {
      setCover(blog.cover);
    } else {
      setCover({
        url: draftImg.url,
        imageId: draftImg.imageId,
        fileName: draftImg.fileName,
      });
    }
  }, [draftImg, blog]);

  const handleCoverDrop = useCallback(
    async ([file]: File[]) => {
      if (!cover) {
        setLoading(true);
        if (file) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("type", "blog");

          const result = await uploadImage(formData);

          if (result.error) {
            setLoading(false);
            setImgMsg(result.error);
          }
        }
      } else {
        alert(
          "A cover image already exists. Please remove it before uploading a new one."
        );
      }

      setLoading(false);
    },
    [cover]
  );

  const handleCoverRemove = useCallback(
    async (id: string) => {
      const result = await deleteBlogImage(id, blog._id);

      if (result?.error) setImgMsg(result.error);
      if (result?.message) {
        notify(result.message);
      }
    },
    [blog]
  );

  const contentRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (contentRef.current && currentBlog?.content) {
      contentRef.current.value = currentBlog.content;
    }
  }, [currentBlog]);

  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState(false);

  const handleUpdateBlog = () => {
    setEditing(true);

    updateBlog(
      {
        ...currentBlog,
        cover,
        status: "Published",
      },
      blog._id!
    ).then((result) => {
      if (result?.error) {
        setMessage(result.error);
        setEditing(false);
      }

      if (result?.message) {
        notify(result.message);
        setEditing(false);
      }
    });
  };

  if (!currentBlog) {
    return (
      <Typography variant="subtitle1" textAlign={"center"}>
        Fetching Blog...
      </Typography>
    );
  }

  return (
    <>
      <Stack spacing={3}>
        <Card>
          <CardContent>
            <Grid2 container spacing={3}>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <Typography variant="h6">Basic details</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 8 }}>
                <Stack spacing={3}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="Post title"
                    name="title"
                    value={currentBlog.title}
                    onChange={(e) =>
                      setCurrentBlog((prev) => {
                        return { ...prev!, [e.target.name]: e.target.value };
                      })
                    }
                  />
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="Short description"
                    name="shortDescription"
                    multiline
                    minRows={3}
                    value={currentBlog.shortDescription}
                    onChange={(e) =>
                      setCurrentBlog((prev) => {
                        return { ...prev!, [e.target.name]: e.target.value };
                      })
                    }
                  />
                  <TextField
                    name="author"
                    variant="outlined"
                    fullWidth
                    label="Aurthor"
                    value={currentBlog.author}
                    onChange={(e) =>
                      setCurrentBlog((prev) => {
                        return { ...prev!, [e.target.name]: e.target.value };
                      })
                    }
                  />

                  <TextField
                    name="estReadTime"
                    type="number"
                    variant="outlined"
                    fullWidth
                    label="Estimated Read Time"
                    slotProps={{ htmlInput: { min: 1 } }}
                    value={currentBlog.estReadTime}
                    onChange={(e) =>
                      setCurrentBlog((prev) => {
                        return { ...prev!, [e.target.name]: e.target.value };
                      })
                    }
                  />
                </Stack>
              </Grid2>
            </Grid2>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Grid2 container spacing={3}>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <Typography variant="h6">Post cover</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 8 }}>
                <Typography color="error" variant="subtitle2">
                  {imgMsg}
                </Typography>
                {loading && <CircularProgress />}
                <Stack spacing={3}>
                  {cover ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: 500,
                        mt: 3,
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        src={cover.url}
                        alt="Blog Cover"
                        width={500} // Set appropriate width
                        height={300} // Set appropriate height
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                        }}
                        priority // Optional: Ensures image loads quickly
                      />
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        alignItems: "center",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        border: 1,
                        borderRadius: 1,
                        borderStyle: "dashed",
                        borderColor: "divider",
                        height: 230,
                        mt: 3,
                        p: 3,
                      }}
                    >
                      <Typography
                        align="center"
                        color="text.secondary"
                        variant="h6"
                      >
                        Select a cover image
                      </Typography>
                      <Typography
                        align="center"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                        variant="subtitle1"
                      >
                        Image used for the blog post cover and also for Open
                        Graph meta
                      </Typography>
                    </Box>
                  )}
                  {cover && (
                    <div>
                      <Button
                        color="inherit"
                        disabled={!cover}
                        onClick={() => handleCoverRemove(cover.imageId)}
                      >
                        Remove photo
                      </Button>
                    </div>
                  )}
                  <FileDropzone
                    accept={{ "image/*": [] }}
                    onDrop={handleCoverDrop}
                    caption="(SVG, JPG, PNG, or gif maximum 900x400)"
                  />
                </Stack>
              </Grid2>
            </Grid2>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Grid2 container spacing={3}>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <Typography variant="h6">Content</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 8 }}>
                <QuillEditor
                  value={currentBlog.content}
                  onChange={(value: string) =>
                    setCurrentBlog((prev) => {
                      return { ...prev!, content: value };
                    })
                  }
                  placeholder="Write something"
                  sx={{ height: 400 }}
                />
                <input ref={contentRef} name="content" type="hidden" />
              </Grid2>
            </Grid2>
          </CardContent>
        </Card>
      </Stack>

      <Typography color="error" textAlign={"center"} variant="subtitle2">
        {message}
      </Typography>

      <Stack
        sx={{
          mt: 2,
        }}
        justifyContent={"flex-end"}
        direction={"row"}
      >
        <ManualSubmitButton
          title="Save Edit"
          isFullWidth={false}
          onClick={handleUpdateBlog}
          loading={editing}
        />
      </Stack>
    </>
  );
}

export default EditBlog;
