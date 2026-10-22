import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, Typography, LinearProgress, Alert, FormControl, InputLabel, Select, MenuItem, Chip, Card, CardContent, Grid } from '@mui/material';
import VideoTranslationService from '../../services/videoTranslationService';

const VideoUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState(['es', 'fr', 'pt']);
  const [availableLanguages, setAvailableLanguages] = useState([
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'cmn-CN', name: 'Chinese (Mandarin)' },
    { code: 'hi-IN', name: 'Hindi' },
    { code: 'ar-XA', name: 'Arabic' },
    { code: 'bn-IN', name: 'Bengali' },
    { code: 'ru-RU', name: 'Russian' },
    { code: 'id-ID', name: 'Indonesian' }
  ]);
  const [quotaInfo, setQuotaInfo] = useState(null);

  const fileInputRef = useRef(null);

  // Load quota info on component mount
  React.useEffect(() => {
    const loadQuotaInfo = async () => {
      try {
        const quota = await VideoTranslationService.getQuotaInfo();
        setQuotaInfo(quota);
      } catch (err) {
        console.error('Error loading quota info:', err);
      }
    };
    loadQuotaInfo();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        setError('Please select a video file');
        return;
      }

      // Validate file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        setError('File size exceeds 100MB limit');
        return;
      }

      setSelectedFile(file);
      setError('');
      setUploadSuccess(false);
    }
  };

  const handleLanguageChange = (event) => {
    setSelectedLanguages(event.target.value);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a video file');
      return;
    }

    if (selectedLanguages.length === 0) {
      setError('Please select at least one target language');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError('');

    try {
      // Listen for upload progress events
      const handleProgress = (event) => {
        setUploadProgress(event.detail);
      };

      document.addEventListener('videoUploadProgress', handleProgress);

      // Upload the video
      const response = await VideoTranslationService.uploadVideo(selectedFile, selectedLanguages);

      document.removeEventListener('videoUploadProgress', handleProgress);

      setUploadSuccess(true);
      setUploadProgress(100);
      setError('');

      // Refresh quota info
      const quota = await VideoTranslationService.getQuotaInfo();
      setQuotaInfo(quota);

      // Reset form
      setTimeout(() => {
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to upload video for translation');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Multilingual Video Translation
        </Typography>

        {/* Quota Info */}
        {quotaInfo && (
          <Box sx={{ mb: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="subtitle2">Storage Quota</Typography>
            <LinearProgress
              variant="determinate"
              value={(quotaInfo.currentUsage / quotaInfo.maxQuota) * 100}
              sx={{ mb: 1 }}
            />
            <Typography variant="caption">
              {Math.round(quotaInfo.currentUsage / 1024 / 1024)} MB used of {Math.round(quotaInfo.maxQuota / 1024 / 1024)} MB
            </Typography>
          </Box>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Button
                variant="contained"
                component="label"
                type="button"
                aria-label="Select Video File"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                fullWidth
              >
                Select Video File
                <input
                  type="file"
                  hidden
                  accept="video/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  disabled={isUploading}
                />
              </Button>

              {selectedFile && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Selected: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                </Typography>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="target-languages-label">Target Languages</InputLabel>
              <Select
                labelId="target-languages-label"
                multiple
                value={selectedLanguages}
                onChange={handleLanguageChange}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const lang = availableLanguages.find(l => l.code === value);
                      return lang ? <Chip key={value} label={lang.name} size="small" /> : null;
                    })}
                  </Box>
                )}
                disabled={isUploading}
              >
                {availableLanguages.map((lang) => (
                  <MenuItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {isUploading && (
          <Box sx={{ mb: 2 }}>
            <LinearProgress variant="determinate" value={uploadProgress} />
            <Typography variant="caption">{Math.round(uploadProgress)}% Complete</Typography>
          </Box>
        )}

        {uploadSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Video uploaded successfully! Translation process started.
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={!selectedFile || isUploading || selectedLanguages.length === 0}
          fullWidth
        >
          {isUploading ? 'Uploading...' : 'Translate Video'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default VideoUpload;
