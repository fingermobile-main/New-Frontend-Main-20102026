import React from 'react';
import { Container, Grid, Typography, Box } from '@mui/material';
import VideoUpload from '../components/VideoTranslation/VideoUpload';
import MyVideos from '../components/VideoTranslation/MyVideos';

const VideoTranslationDashboard = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Global Reach Video Translation
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Automatically translate your videos into multiple languages with AI-powered dubbing and subtitles
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <VideoUpload />
        </Grid>

        <Grid item xs={12} lg={4}>
          <MyVideos />
        </Grid>
      </Grid>
    </Container>
  );
};

export default VideoTranslationDashboard;
