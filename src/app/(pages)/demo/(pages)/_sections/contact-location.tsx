"use client";

import ContactMail from "@/app/icons/untitled-ui/duocolor/contact-mail";
import Instagram from "@/app/icons/untitled-ui/duocolor/instaagram";
import Locations from "@/app/icons/untitled-ui/duocolor/location";
import Whatsapp from "@/app/icons/untitled-ui/duocolor/whatsapp";
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  IconButton,
} from "@mui/material";

const ContactLocation = () => {
  return (
    <Box
      sx={{
        py: { xs: 6, md: 12 },
        textAlign: "center",
      }}
    >
      <Container>
        {/* Section Title */}
        <Typography variant="h3" fontWeight="bold">
          Get in Touch
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, opacity: 0.9 }}>
          Have questions or need to book an appointment? Reach out to us!
        </Typography>

        <Grid container spacing={4} sx={{ mt: 6 }}>
          {/* Contact Information */}
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: "left" }}>
              <Typography variant="h5" fontWeight="bold">
                Contact Information
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                <IconButton sx={{ mr: 1 }}>
                  {" "}
                  <ContactMail />
                </IconButton>
                <Typography variant="body1">+1 (123) 456-7890</Typography>
              </Box>
              {/* <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                <Email sx={{ mr: 1 }} />
                <Typography variant="body1">info@massagebliss.com</Typography>
              </Box> */}
              <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                <IconButton sx={{ mr: 1 }}>
                  <Locations />
                </IconButton>
                <Typography variant="body1">
                  123 Serenity St, Wellness City
                </Typography>
              </Box>

              {/* Social Media Icons */}
              <Box sx={{ mt: 3 }}>
                <IconButton sx={{ color: "white" }}>
                  <Whatsapp />
                </IconButton>
                <IconButton sx={{ color: "white" }}>
                  <Instagram />
                </IconButton>
              </Box>
            </Box>
          </Grid>

          {/* Contact Form */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                p: 3,
                borderRadius: "10px",
              }}
            >
              <Typography variant="h5" fontWeight="bold">
                Send a Message
              </Typography>
              <TextField
                fullWidth
                label="Your Name"
                variant="outlined"
                sx={{ mt: 2, backgroundColor: "white", borderRadius: "5px" }}
              />
              <TextField
                fullWidth
                label="Your Email"
                variant="outlined"
                sx={{ mt: 2, backgroundColor: "white", borderRadius: "5px" }}
              />
              <TextField
                fullWidth
                label="Your Message"
                multiline
                rows={4}
                variant="outlined"
                sx={{ mt: 2, backgroundColor: "white", borderRadius: "5px" }}
              />
              <Button
                variant="contained"
                size="large"
                fullWidth
                sx={{
                  mt: 3,
                  bgcolor: "primary.main",
                  "&:hover": { bgcolor: "primary.dark" },
                }}
              >
                Send Message
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Google Map */}
        <Box sx={{ mt: 6, borderRadius: "10px", overflow: "hidden" }}>
          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509789!2d144.95592631531557!3d-37.8172099797516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d5df6c44e7f%3A0xf048fcd2cadd5e2!2sMassage%20Therapy%20Wellness%20Center!5e0!3m2!1sen!2sus!4v1630989481412!5m2!1sen!2sus"
            width="100%"
            height="350"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </Box>
      </Container>
    </Box>
  );
};

export default ContactLocation;
