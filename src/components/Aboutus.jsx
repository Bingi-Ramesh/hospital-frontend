
import { Container, Typography, Grid, Card, CardContent, Avatar } from '@mui/material';
import pushpaImage from '../assets/pushpa1.jpg';
import rameshImage from '../assets/ramesh2.jpg';
import backgroundImage from '../assets/background.jpeg';

const teamMembers = [
  {
    name: 'Bingi Ramesh',
    title: 'Managing Director of Pushpa Hospital',
    image: rameshImage,
    mobile: '9392612161',
    email: 'rameshbingi@gmail.com',
  },
  {
    name: 'Dr. Bingi Pushpa Latha',
    title: 'Head Doctor of Pushpa Hospital,general Surgeon Specialist',
    image: pushpaImage,
    mobile: '9963012961',
    email: 'pushpabingi@gmail.com',
  },
];

const About = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="sm" sx={{ p: 3 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ color: '#ffffff' }}>
          About Us
        </Typography>

        <Grid container direction="column" spacing={4}>
          {teamMembers.map((member, index) => (
            <Grid item key={index}>
              <Card
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 3,
                  borderRadius: 3,
                  boxShadow: 5,
                  background: 'linear-gradient(135deg, #4caf50, #81c784)',
                  color: 'black',
                }}
              >
                <Avatar
                  src={member.image}
                  alt={member.name}
                  sx={{ width: 100, height: 100, mr: 3, borderRadius: '50%' }}
                />
                <CardContent>
                  <Typography variant="h5" align="left">
                    {member.name}
                  </Typography>
                  <Typography variant="body1" align="left">
                    {member.title}
                  </Typography>
                  <Typography variant="body2" align="left">
                    📞 {member.mobile}
                  </Typography>
                  <Typography variant="body2" align="left">
                    ✉️ {member.email}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default About;
