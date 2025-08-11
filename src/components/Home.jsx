import { Link } from "react-router-dom";
import Carousel from "../pages/Carousel";
import { Box, Typography, Paper, Grid, Button, Card, CardContent, CardActions } from "@mui/material";

// Importing images
import image1 from "../assets/image1.webp";
import image2 from "../assets/image2.webp";
import image3 from "../assets/image3.jpeg";
import image4 from "../assets/image4.jpg";
import image5 from "../assets/image5.jpg";
import hygieneImage from "../assets/hygieneBg.webp";  // Imported hygiene image
import emergencyImage from "../assets/image4.jpg";  // Imported emergency image
import announcementImage from "../assets/announcement.webp";  // Imported announcement image

export default function Home() {
  const cards = [
    {
      title: "Appointments",
      description:
        "Book, manage, or cancel your appointments with our expert doctors with ease. Ensure you never miss an opportunity for timely care and consultation.",
      buttonLabel: "Book Now",
      buttonColor: "primary",
      link: "/appointments",
      bgColor: "#E3F2FD",
      image: image1,
    },
    {
      title: "Doctors",
      description:
        "Explore our team of highly qualified medical professionals specializing in fields such as Cardiology, Neurology, Orthopedics, and more. Your health is in the best hands.",
      buttonLabel: "View Doctors",
      buttonColor: "secondary",
      link: "/doctors",
      bgColor: "#FFEBEE",
      image: image2,
    },
    {
      title: "Dashboard",
      description:
        "Access your personalized dashboard to manage appointments, view medical history, download reports, and stay updated on your treatment progress.",
      buttonLabel: "Go to Dashboard",
      buttonColor: "success",
      link: "/dashboard",
      bgColor: "#E8F5E9",
      image: image3,
    },
    {
      title: "Emergency Services",
      description:
        "Our 24/7 emergency services are always ready to provide immediate care during critical situations. Your safety is our priority.",
      buttonLabel: "Learn More",
      buttonColor: "error",
      link: "/emergency",
      bgColor: "#FCE4EC",
      image: image4,
    },
    {
      title: "Health Check-Up Camps",
      description:
        "Join our free health check-up camps conducted every Saturday. Take proactive steps toward your well-being with early detection and prevention.",
      buttonLabel: "Know More",
      buttonColor: "info",
      link: "/camps",
      bgColor: "#E1BEE7",
      image: image5,
    },
    {
      title: "No Consultation Charge for 2nd Appointment Onwards",
      description:
        "Get your first consultation at regular charges. From the second appointment onwards, there will be no consultation charges. We value your continued trust in us!",
      buttonLabel: "Book Your Appointment",
      buttonColor: "primary",
      link: "/appointments",
      bgColor: "#C8E6C9",  // Soft violet color
      image: image1,  // Assuming you have an image related to appointments
    }
    
  ];

  return (
    <>
      {/* Hero Section Carousel */}
      <Carousel />

      {/* Main Information Section */}
      <Box sx={{ padding: 4 }}>
        {/* Welcome Message */}
        <Typography variant="h4" gutterBottom align="center">
          Welcome to Our Pushpa Hospital 
        </Typography>
        <Typography variant="h6" color="textSecondary" align="center">
          Your health and safety are our top priorities.
        </Typography>

        {/* Cards Section */}
        <Box sx={{ marginY: 4 }}>
          <Grid container spacing={4}>
            {cards.map((card, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                key={index}
                sx={{
                  display: index === 4 ? "flex" : "flex", // Center last card
                  justifyContent: index === 4 ? "center" : index % 2 === 0 ? "flex-start" : "flex-end", 
                  padding: 2,
                }}
              >
                <Card
                  elevation={6}
                  sx={{
                    backgroundColor: card.bgColor,
                    width: "100%",
                    padding: 3, // Increased padding for thicker background
                    borderRadius: 2, // Slight rounded corners for a more polished look
                    boxShadow: 4, // More prominent shadow for depth
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 2 }}>
                    <img
                      src={card.image} // Using imported image here
                      alt={card.title}
                      style={{
                        width: "120px",
                        height: "120px",
                        borderRadius: "50%", // Circle form for the image
                        objectFit: "cover", // Ensures the image covers the circle area
                      }}
                    />
                  </Box>
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      {card.title}
                    </Typography>
                    <Typography color="textSecondary">{card.description}</Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "center" }}>
                    {index===4 || index===3 || index===5?null: <Button
                      variant="contained"
                      color={card.buttonColor}
                      component={Link}
                      to={card.link}
                    >
                      {card.buttonLabel}
                    </Button>}
                   
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Hygiene Products Section */}
        <Box
  sx={{
    marginY: 4,
    backgroundColor: "#E1F5FE",
    padding: 4,
    borderRadius: 2,
    boxShadow: 4,
    display: "flex",
    flexDirection: { xs: "column", md: "row-reverse" }, // Image first on mobile, text first on desktop
    alignItems: "center",
  }}
>
  {/* Image */}
  <Box
    sx={{
      marginBottom: { xs: 3, md: 0 },
      marginLeft: { md: 3 },
      display: "flex",
      justifyContent: "center",
      width: { xs: "100%", md: "auto" },
    }}
  >
    <img
      src={hygieneImage}
      alt="Hygiene Products"
      style={{
        width: "150px",
        height: "150px",
        borderRadius: "50%",
        objectFit: "cover",
      }}
    />
  </Box>

  {/* Text */}
  <Paper
    elevation={3}
    sx={{
      padding: 3,
      backgroundColor: "rgba(255, 255, 255, 0.7)",
      width: { xs: "100%", md: "70%" },
    }}
  >
    <Typography variant="h5" gutterBottom>
      Free Hygiene Products for Patients and Caretakers
    </Typography>
    <Typography>
      To ensure cleanliness and safety, we provide the following hygiene items{" "}
      <b>free of charge</b>:
    </Typography>
    <Grid container spacing={3} sx={{ marginTop: 2 }}>
      <Grid item xs={12} sm={6} md={4}>
        <Typography>🧴 Hand Sanitizers (e.g., Dettol, Lifebuoy)</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Typography>🧻 Disinfectant Wipes</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Typography>🧼 Antibacterial Soap</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Typography>🚰 Bottled Water for Patients</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Typography>😷 Masks (for patients and caretakers)</Typography>
      </Grid>
    </Grid>
  </Paper>
</Box>



        {/* Emergency Services Section */}
        <Box
  sx={{
    marginY: 4,
    backgroundColor: "#FF7961", // Red background for urgency
    padding: 4,
    borderRadius: 2,
    boxShadow: 4,
    display: "flex",
    flexDirection: { xs: "column", md: "row-reverse" }, // Image first on mobile, right side on desktop
    alignItems: "center",
  }}
>
  {/* Image */}
  <Box
    sx={{
      marginBottom: { xs: 3, md: 0 },
      marginLeft: { md: 3 },
      display: "flex",
      justifyContent: "center",
      width: { xs: "100%", md: "auto" },
    }}
  >
    <img
      src={emergencyImage}
      alt="Emergency Services"
      style={{
        width: "150px",
        height: "150px",
        borderRadius: "50%",
        objectFit: "cover",
      }}
    />
  </Box>

  {/* Text */}
  <Paper
    elevation={3}
    sx={{
      padding: 3,
      backgroundColor: "rgba(255, 255, 255, 0.7)",
      width: { xs: "100%", md: "70%" }, // Full width on mobile
    }}
  >
    <Typography variant="h5" gutterBottom>
      Emergency Services
    </Typography>
    <Typography>
      Our 24/7 emergency services are always ready to provide immediate care during critical situations. Your safety is our priority.
    </Typography>
    <Grid container spacing={3} sx={{ marginTop: 2 }}>
      <Grid item xs={12} sm={6} md={6}>
        <Typography>🚑 Immediate Medical Care Available</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={6}>
        <Typography>📞 24/7 Contact for Emergencies</Typography>
      </Grid>
    </Grid>
  </Paper>
</Box>


        {/* Important Announcements */}
        <Box
  sx={{
    padding: 4,
    backgroundColor: "#FFECB3", // Soft yellow background
    borderRadius: 2,
    boxShadow: 4,
    display: "flex",
    flexDirection: { xs: "column", md: "row-reverse" }, // Image on top for mobile, right for desktop
    alignItems: "center",
  }}
>
  {/* Image */}
  <Box
    sx={{
      marginBottom: { xs: 3, md: 0 },
      marginLeft: { md: 3 },
      display: "flex",
      justifyContent: "center",
      width: { xs: "100%", md: "auto" },
    }}
  >
    <img
      src={announcementImage}
      alt="Important Announcements"
      style={{
        width: "150px",
        height: "150px",
        borderRadius: "50%",
        objectFit: "cover",
      }}
    />
  </Box>

  {/* Text */}
  <Paper
    elevation={3}
    sx={{
      padding: 3,
      backgroundColor: "rgba(255, 255, 255, 0.7)",
      width: { xs: "100%", md: "70%" },
    }}
  >
    <Typography variant="h5" gutterBottom>
      Important Announcements
    </Typography>
    <Typography variant="body1" color="textSecondary">
      Stay updated with the latest information and services available at our hospital:
    </Typography>
    <Paper
      sx={{
        marginTop: 2,
        padding: 2,
        backgroundColor: "#FFF3E0",
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <ul>
        <li>24/7 Emergency Services</li>
        <li>Free Health Check-Up Camps every Saturday</li>
        <li>Online Appointment Booking and Consultation</li>
      </ul>
    </Paper>
  </Paper>
</Box>

      </Box>
    </>
  );
}
