import Instagram from "@/app/icons/untitled-ui/duocolor/instaagram";
import Twitter from "@/app/icons/untitled-ui/duocolor/twitter";
import {
  Box,
  Container,
  Grid2,
  Typography,
  Link,
  IconButton,
} from "@mui/material";

const Footer = () => {
  return (
    <Box sx={{ bgcolor: "neutral.100", py: 4, mt: 6 }}>
      <Container maxWidth="lg">
        <Grid2 container spacing={4}>
          {/* About Section */}
          <Grid2 size={{xs:12, md:4}}>
            <Typography variant="h6" fontWeight="bold" color="text.primary">
              Serenity Spa & Wellness
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Relax, rejuvenate, and restore your well-being with our
              professional massage therapy services.
            </Typography>
          </Grid2>

          {/* Quick Links */}
          <Grid2 size={{xs:12, md:4}}>
            <Typography variant="h6" fontWeight="bold" color="text.primary">
              Quick Links
            </Typography>
            <Box display="flex" flexDirection="column" gap={1} mt={1}>
              <Link href="/services" color="text.secondary" underline="hover">
                Our Services
              </Link>
              <Link href="/about" color="text.secondary" underline="hover">
                About Us
              </Link>
              <Link href="/contact" color="text.secondary" underline="hover">
                Contact
              </Link>
              <Link href="/blog" color="text.secondary" underline="hover">
                Blog
              </Link>
            </Box>
          </Grid2>

          {/* Contact Info */}
          <Grid2 size={{xs:12, md:4}}>
            <Typography variant="h6" fontWeight="bold" color="text.primary">
              Contact Us
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              123 Serenity Lane, Suite 100
              <br />
              Tranquil City, TX 75000
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Phone: (555) 123-4567
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: contact@serenityspa.com
            </Typography>
          </Grid2>
        </Grid2>

        {/* Social Media Links */}
        <Box textAlign="center" mt={3}>
          <IconButton href="#" color="primary">
            <Instagram />
          </IconButton>
          <IconButton href="#" color="primary">
            <Twitter />
          </IconButton>
        </Box>

        {/* Copyright */}
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          mt={2}
        >
          © {new Date().getFullYear()} Serenity Spa & Wellness. All rights
          reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
