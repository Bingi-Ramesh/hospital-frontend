import { Box, Typography, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
  return (
    <Box
       component="footer"
     
      sx={{
       
        backgroundColor: '#004080',
        margin:0,
        color: '#fff',
         padding: '20px 0',
        textAlign: 'center',
       
        width: '100%', // Full width
         position: 'relative', // No longer absolute, it's relative within the document flow
        
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: '0 10px',
        }}
      >
        {/* Hospital Information */}
        <Box sx={{ margin: '10px' }}>
          <Typography variant="h5" gutterBottom>
            Pushpa Hospital
          </Typography>
          <Typography>
            Providing quality healthcare services for your well-being. <br/>
            24/7 emergency services are available.
          </Typography>
        </Box>

        {/* Contact Information */}
        <Box sx={{ margin: '10px' }}>
          <Typography variant="h6" gutterBottom>
            Contact Us
          </Typography>
          <Typography>📍 Address: 123 Health Street, kurnool City, AP State</Typography>
          <Typography>📞 Phone: +91 9392612161</Typography>
          <Typography>📞 Phone: +91 9963012961</Typography>
          <Typography>📧 Email: rameshyadavbingi776@gmail.com</Typography>
        </Box>

        {/* Social Media Links */}
        <Box sx={{ margin: '10px' }}>
          <Typography variant="h6" gutterBottom>
            Follow Us
          </Typography>
          <Box>
            <IconButton
              component="a"
              href="#"
              sx={{ color: '#fff' }}
              aria-label="Facebook"
            >
              <FacebookIcon />
            </IconButton>
            <IconButton
              component="a"
              href="#"
              sx={{ color: '#fff' }}
              aria-label="Twitter"
            >
              <TwitterIcon />
            </IconButton>
            <IconButton
              component="a"
              href="https://www.instagram.com/bingi_ramesh_yadav/"
              sx={{ color: '#fff' }}
              aria-label="Instagram"
            >
              <InstagramIcon />
            </IconButton>
            <IconButton
              component="a"
              href="https://www.linkedin.com/in/bingi-ramesh-02b754280/"
              sx={{ color: '#fff' }}
              aria-label="LinkedIn"
            >
              <LinkedInIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Footer Bottom */}
      <Box
        sx={{
          marginTop: '10px',
          borderTop: '1px solid #ccc',
          paddingTop: '10px',
        }}
      >
        <Typography>&copy; 2024 Pushpa Hospital. All Rights Reserved.</Typography>
      </Box>
    </Box>
  );
};

export default Footer;




