import { useState, useEffect } from 'react';
import { Container, Typography, Button, TextField, Box, Grid, Rating, Snackbar, Alert, CircularProgress } from '@mui/material';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
const API_BASE = import.meta.env.VITE_BACKEND_URL;

const RatingsAndReviews = () => {
   
   // const loggedIn = !!userProfile?.userType;
   const isAdmin = localStorage.getItem('role') === 'admin';

  const [openForm, setOpenForm] = useState(false);
  const [reviewData, setReviewData] = useState({
    cleanliness: 0,
    management: 0,
    payment: 0,
    accomodation: 0,
    ambulanceFacilities: 0,
    parking: 0,
    patientCare: 0,
    treatment:0,
    reviewmsg: '',
    name: '', // Added name to review data
  });
  const [reviews, setReviews] = useState([]);
  const [averageRatings, setAverageRatings] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });
  const [showAllReviews, setShowAllReviews] = useState(false); // Track if full reviews are displayed

  // Fetch reviews and calculate average ratings
  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/get-all-reviews`);
      setReviews(response.data.reviews);

      // Calculate average ratings for each category
      const avgRatings = {
        cleanliness: 0,
        management: 0,
        payment: 0,
        accomodation: 0,
        ambulanceFacilities: 0,
        parking: 0,
        treatment:0,
        patientCare: 0,
      };

      response.data.reviews.forEach((review) => {
        for (const key in avgRatings) {
          avgRatings[key] += review[key];
        }
      });

      for (const key in avgRatings) {
        avgRatings[key] = (avgRatings[key] / response.data.reviews.length).toFixed(1); // Average rating
      }

      setAverageRatings(avgRatings);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  useEffect(() => {
    fetchReviews(); // Fetch reviews when the component mounts
  }, []);

  const handleFormToggle = () => {
    setOpenForm(!openForm);
  };

  const handleRatingChange = (field, newValue) => {
    setReviewData({ ...reviewData, [field]: newValue });
  };

  const handleReviewTextChange = (e) => {
    setReviewData({ ...reviewData, reviewmsg: e.target.value });
  };

  const handleNameChange = (e) => {
    setReviewData({ ...reviewData, name: e.target.value });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const deleteReview = async (reviewId) => {
    try {
      await axios.post(`${API_BASE}/api/delete-review`, { reviewId });
      setSnackbar({ open: true, message: 'Review deleted successfully.', severity: 'success' });
      fetchReviews(); // Refresh reviews after deletion
    } catch (error) {
      console.error('Error deleting review:', error);
      setSnackbar({ open: true, message: 'Failed to delete review.', severity: 'error' });
    }
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE}/api/add-review`, reviewData);
      setSnackbar({ open: true, message: response.data.msg, severity: 'success' });

      // Fetch the updated reviews and average ratings after submission
      fetchReviews();

      // Reset the form data
      setReviewData({
        cleanliness: 0,
        management: 0,
        payment: 0,
        accomodation: 0,
        ambulanceFacilities: 0,
        parking: 0,
        patientCare: 0,
        treatment:0,
        reviewText: '',
        name: '', // Reset name after submission
      });

      setOpenForm(false); // Close form after submission
    } catch (error) {
        console.log(error)
      setSnackbar({ open: true, message: 'Failed to submit review. Please try again.', severity: 'error' });
    }
  };

  // Prepare data for bar chart
  const chartData = Object.keys(averageRatings).map((key) => ({
    name: key,
    rating: averageRatings[key],
  }));

  // Calculate overall rating
  const overallRating = Object.values(averageRatings).reduce((sum, rating) => sum + parseFloat(rating), 0);
  const overallRatingAvg = (overallRating / Object.keys(averageRatings).length).toFixed(1); // Corrected overall rating
  const overallPercentage = (overallRatingAvg / 5) * 100; // Convert average to percentage

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Ratings and Reviews
      </Typography>

      <Button variant="contained" color="primary" onClick={handleFormToggle} sx={{ display: 'block', margin: '0 auto' }}>
        {openForm ? 'Close Form' : 'Add Review'}
      </Button>

      {openForm && (
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            mt: 3,
            p: 3,
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: '#f5f5f5',
          }}
        >
          <Grid container spacing={2}>
            {/* Name input */}
            <Grid item xs={12}>
              <TextField
                label="Your Name"
                fullWidth
                value={reviewData.name}
                onChange={handleNameChange}
                required
              />
            </Grid>

            {/* Ratings fields */}
            <Grid item xs={12}>
              <Typography variant="h6">Cleanliness</Typography>
              <Rating
                name="cleanliness"
                value={reviewData.cleanliness}
                onChange={(e, newValue) => handleRatingChange('cleanliness', newValue)}
                precision={0.5}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6">Management</Typography>
              <Rating
                name="management"
                value={reviewData.management}
                onChange={(e, newValue) => handleRatingChange('management', newValue)}
                precision={0.5}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6">Payment</Typography>
              <Rating
                name="payment"
                value={reviewData.payment}
                onChange={(e, newValue) => handleRatingChange('payment', newValue)}
                precision={0.5}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6">Room Facilities</Typography>
              <Rating
                name="accomodation"
                value={reviewData.accomodation}
                onChange={(e, newValue) => handleRatingChange('accomodation', newValue)}
                precision={0.5}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6">Ambulance Facility</Typography>
              <Rating
                name="ambulanceFacilities"
                value={reviewData.ambulanceFacilities}
                onChange={(e, newValue) => handleRatingChange('ambulanceFacilities', newValue)}
                precision={0.5}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6">Parking Facility</Typography>
              <Rating
                name="parking"
                value={reviewData.parkingFacility}
                onChange={(e, newValue) => handleRatingChange('parking', newValue)}
                precision={0.5}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6">Caring of Patients</Typography>
              <Rating
                name="patientCare"
                value={reviewData.patientCare}
                onChange={(e, newValue) => handleRatingChange('patientCare', newValue)}
                precision={0.5}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Treatment</Typography>
              <Rating
                name="treatment"
                value={reviewData.treatment}
                onChange={(e, newValue) => handleRatingChange('treatment', newValue)}
                precision={0.5}
              />
            </Grid>
            {/* Review Text */}
            <Grid item xs={12}>
              <TextField
                label="Write Your Review"
                fullWidth
                multiline
                rows={4}
                value={reviewData.reviewmsg}
                onChange={handleReviewTextChange}
                required
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button type="submit" fullWidth variant="contained" color="primary">
                Add Review
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Display Bar Chart with reduced gap between the circle progress */}
      <Box sx={{ display: 'flex',justifyContent:"space-around", alignItems: 'center', mt: 3 }}>
        <BarChart width={700} height={400} data={chartData} margin={{ top: 20, right: 10, left: 20, bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            angle={-45} // Rotate the labels by -45 degrees
            textAnchor="end" // Align the text to the end after rotation
            tickMargin={5} // Add some margin to avoid overlap with the chart's edge
          />
          <YAxis domain={[1, 5]} />
          <Tooltip />
          <Legend />
          <br/><br/> 
          <Bar dataKey="rating" fill="#D86C9F" />
        </BarChart>

        {/* Circular Progress for Overall Rating */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>Overall Rating</Typography>
          <CircularProgress
            variant="determinate"
            value={overallPercentage}
            size={150}
            thickness={6}
            sx={{ color: '#4caf50' }}
          />
          <Typography variant="h6">{overallRatingAvg} / 5</Typography>
        </Box>
      </Box>

      {/* Display Reviews */}
      <Typography variant="h6" align="center" gutterBottom mt={5}>
        Customer Reviews
      </Typography>
      {reviews.slice(0, showAllReviews ? reviews.length : 5).map((review, index) => (
  <Box key={index} sx={{ borderBottom: '1px solid #ddd', paddingBottom: 2, marginBottom: 2, position: 'relative' }}>
    <Typography variant="body1"><strong>{review.name || 'User'}</strong></Typography>
    <Typography variant="body2">{review.reviewmsg}</Typography>
    {isAdmin && (
      <Button
        variant="contained"
        color="error"
        size="small"
        sx={{ position: 'absolute', right: 0, top: 0 }}
        onClick={() => deleteReview(review._id)}
      >
        Delete Review
      </Button>
    )}
  </Box>
))}


      {/* Show More / View Less Button */}
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setShowAllReviews(!showAllReviews)}
        sx={{ display: 'block', margin: '0 auto', mt: 2 ,mb:5}}
      >
        {showAllReviews ? 'View Less' : 'Show More'}
      </Button>

      {/* Snackbar for success/error message */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RatingsAndReviews;
