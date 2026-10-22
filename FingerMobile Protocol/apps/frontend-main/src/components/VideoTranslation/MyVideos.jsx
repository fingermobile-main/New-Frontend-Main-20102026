import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  VideoCameraBack as VideoCameraIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Schedule as ClockIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import videoTranslationService from '../../services/videoTranslationService';

const MyVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Load user videos on component mount
  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const response = await videoTranslationService.getUserVideos();
      setVideos(response.videos || []);
      setError('');
    } catch (err) {
      setError('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
    case 'completed':
      return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
    case 'processing':
      return <ClockIcon className="w-5 h-5 text-yellow-500" />;
    case 'failed':
      return <CancelIcon className="w-5 h-5 text-red-500" />;
    default:
      return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
    case 'completed':
      return 'success';
    case 'processing':
      return 'warning';
    case 'failed':
      return 'error';
    default:
      return 'default';
    }
  };

  const handleDeleteVideo = async (videoId) => {
    try {
      await videoTranslationService.deleteVideo(videoId);
      setVideos(videos.filter(video => video.id !== videoId));
      setOpenDialog(false);
    } catch (err) {
      setError('Failed to delete video');
    }
  };

  const openDeleteDialog = (video) => {
    setSelectedVideo(video);
    setOpenDialog(true);
  };

  const closeDialog = () => {
    setSelectedVideo(null);
    setOpenDialog(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Card>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <VideoCameraIcon />
              <Typography variant="h6">My Translated Videos</Typography>
            </Box>
          }
          subheader={`${videos.length} videos`}
        />
        <CardContent>
          {videos.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No translated videos yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Upload a video to start the translation process
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {videos.map((video) => (
                <Grid item xs={12} sm={6} md={4} key={video.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        {video.originalFileName}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        {getStatusIcon(video.status)}
                        <Chip
                          label={video.status.charAt(0).toUpperCase() + video.status.slice(1)}
                          size="small"
                          color={getStatusColor(video.status)}
                          variant="outlined"
                        />
                      </Box>

                      <Typography variant="body2" color="text.secondary" paragraph>
                        Languages: {video.targetLanguages?.join(', ') || 'N/A'}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        Uploaded: {new Date(video.createdAt).toLocaleDateString()}
                      </Typography>
                    </CardContent>

                    <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                      {video.status === 'completed' && video.outputFiles && video.outputFiles.length > 0 && (
                        video.outputFiles.map((file, index) => (
                          <Button
                            key={index}
                            type="button"
                            aria-label={`Download video in ${file.language}`}
                            onClick={() => window.open(file.url, '_blank')}
                            variant="contained"
                            size="small"
                            startIcon={<DownloadIcon />}
                            href={file.url}
                            download
                            sx={{ mr: 1, mb: 1 }}
                          >
                            {file.language}
                          </Button>
                        ))
                      )}

                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => openDeleteDialog(video)}
                        color="error"
                        sx={{ mb: 1 }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={closeDialog}>
        <DialogTitle>Delete Video</DialogTitle>
        <DialogContent>
          <Typography>
            {'Are you sure you want to delete "' + (selectedVideo?.originalFileName || '') + '"? '}
            {'This action cannot be undone.'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button
            onClick={() => handleDeleteVideo(selectedVideo?.id)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyVideos;
