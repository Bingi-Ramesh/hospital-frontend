import { useState, useEffect } from 'react';
import { Box,Button } from '@mui/material';
import carousel1 from '../assets/carousel1.jpeg';
import carousel2 from '../assets/carousel2.jpg';


import carousel5 from '../assets/carousel5.jpg';

import carousel8 from '../assets/carousel8.jpg'
const carouselItems = [
  {
    id: 1,
    title: 'Welcome to Pushpa Hospital',
    description: 'Providing the best healthcare services for your family.',
    image: carousel1,
  },
  {
    id: 2,
    title: 'Experienced Doctors',
    description: 'Our team of experts is ready to serve you.',
    image: carousel2,
  },

 
  {
    id: 3,
    title: 'State-of-the-Art Facilities',
    description: 'We offer advanced medical treatments and diagnostics.',
    image: carousel5,
  },
 
  {
    id: 5,
    title: 'State-of-the-Art Facilities',
    description: 'We offer advanced medical treatments and diagnostics.',
    image: carousel8,
  },
 
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
  };

  return (
    <Box
      sx={{
        width: '100%', // Full width
        height: '400px', // Increased height
        position: 'relative',
        overflow: 'hidden', // Ensures no scrollbars appear
        padding: 0,
        margin: 0,
      }}
    >
      {/* Image Display */}
      <Box
        component="img"
        src={carouselItems[currentIndex].image}
        alt={carouselItems[currentIndex].title}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover', // Ensures image covers the container without overflow
          objectPosition: 'center', // Ensures the image is centered
        }}
      />

      {/* Text Overlay */}
      {/* <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#fff',
          textAlign: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: '10px 20px',
          borderRadius: '10px',
        }}
      >
        <Typography variant="h4" gutterBottom>
          {carouselItems[currentIndex].title}
        </Typography>
        <Typography variant="subtitle1">
          {carouselItems[currentIndex].description}
        </Typography>
      </Box> */}

      {/* Navigation Buttons */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '10px',
        }}
      >
        <Button
          variant="contained"
          color="secondary"
          onClick={handlePrev}
          sx={{ backgroundColor: '#fff', color: '#004080' }}
        >
          Previous
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleNext}
          sx={{ backgroundColor: '#fff', color: '#004080' }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default Carousel;
