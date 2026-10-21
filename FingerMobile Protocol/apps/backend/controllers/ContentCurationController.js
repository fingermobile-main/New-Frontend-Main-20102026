const logger = require('../utils/logger');
const axios = require('axios'); // Need to add this for inter-service communication

// Mocking models for this implementation
// const Product = require('../models/ProductModel');
// const Media = require('../models/MediaModel');
// const Ad = require('../models/Advertisement');

exports.uploadProduct = async (req, res) => {
  try {
    const { platform, productName, _description, price, mediaUrl } = req.body;
    // platform can be 'Marketplace', 'Flamingo', 'OwnIt', 'Storefront'

    // Simulating database save
    logger.info(`Uploading product ${productName} to ${platform}`);

    // Broadcast via WebSockets for "real-time" display could happen here

    res.status(201).json({
      success: true,
      message: `Product '${productName}' successfully curated and uploaded to ${platform} in real-time.`,
      data: { platform, productName, price, mediaUrl, status: 'live' }
    });
  } catch (error) {
    logger.error('Error uploading product:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.uploadMedia = async (req, res) => {
  try {
    const { platform, title, type, mediaUrl, genre, artist, bpm, license_type, duration, album, release_date } = req.body;
    // platform can be 'Dancia-4Tv', 'BeatwaveNG', 'Lumina', 'Camus', 'PhotoCredits'

    logger.info(`Uploading media ${title} to ${platform}`);

    // Route to appropriate service based on platform
    let result;
    switch(platform) {
    case 'Dancia-4Tv':
      result = await uploadToDancia4Tv({
        title,
        mediaUrl,
        genre,
        artist,
        duration,
        thumbnail_url: mediaUrl.replace(/\.[^/.]+$/, '') + '_thumb.jpg' // Simple thumbnail generation
      });
      break;
    case 'BeatwaveNG':
      result = await uploadToBeatwaveNG({
        title,
        mediaUrl,
        genre,
        artist,
        bpm,
        license_type,
        duration,
        album,
        release_date
      });
      break;
    case 'PhotoCredits':
      result = await uploadToPhotoCredits({
        title,
        image_url: mediaUrl,
        photographer: artist || 'Anonymous',
        price_credits: 10, // Default price
        license_type: license_type || 'royalty_free',
        camera_info: {
          camera: req.body.camera || 'Unknown',
          lens: req.body.lens || 'Unknown',
          iso: req.body.iso || 100,
          shutter: req.body.shutter || '1/60s',
          aperture: req.body.aperture || 'f/2.8'
        }
      });
      break;
    default:
      // For other platforms, return generic success
      result = { success: true, message: `Media '${title}' successfully curated and uploaded to ${platform} in real-time.` };
    }

    res.status(201).json({
      success: true,
      message: result.message || `Media '${title}' successfully curated and uploaded to ${platform} in real-time.`,
      data: { platform, title, type, mediaUrl, status: 'live' }
    });
  } catch (error) {
    logger.error('Error uploading media:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Function to upload media to Dancia-4Tv service
async function uploadToDancia4Tv(mediaData) {
  try {
    // In a real implementation, this would call the Dancia-4Tv microservice
    // For now, we'll simulate the call by importing and using the controller function directly
    const { uploadMedia: danciaUploadMedia } = require('../../dancia4tv/src/controllers/dancia4tvController');

    await danciaUploadMedia(mediaData);
    logger.info(`Media uploaded to Dancia-4Tv: ${mediaData.title}`);

    return {
      success: true,
      message: `Media '${mediaData.title}' successfully uploaded to Dancia-4Tv in real-time.`
    };
  } catch (error) {
    logger.error('Error uploading to Dancia-4Tv:', error);

    // Fallback: try calling the service via HTTP if direct import fails
    try {
      const dancia4tvUrl = process.env.DANCIA4TV_SERVICE_URL || 'http://localhost:5032';
      const response = await axios.post(`${dancia4tvUrl}/api/dancia4tv/videos`, mediaData);
      return response.data;
    } catch (httpError) {
      logger.error('Error calling Dancia-4Tv service via HTTP:', httpError);
      throw error;
    }
  }
}

// Function to upload media to BeatwaveNG service
async function uploadToBeatwaveNG(mediaData) {
  try {
    // Call the BeatwaveNG service via HTTP
    const beatwavengUrl = process.env.BEATWAVENG_SERVICE_URL || 'http://localhost:3003'; // Default to BeatwaveNG port
    const response = await axios.post(`${beatwavengUrl}/api/beatwave/tracks`, mediaData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BEATWAVENG_API_KEY || ''}`
      }
    });

    logger.info(`Media uploaded to BeatwaveNG: ${mediaData.title}`);
    return {
      success: true,
      message: `Media '${mediaData.title}' successfully uploaded to BeatwaveNG in real-time.`,
      data: response.data
    };
  } catch (error) {
    logger.error('Error calling BeatwaveNG service via HTTP:', error);
    throw error;
  }
}

// Function to upload media to PhotoCredits service
async function uploadToPhotoCredits(photoData) {
  try {
    // Call the PhotoCredits service via HTTP
    const photocreditsUrl = process.env.PHOTOCREDITS_SERVICE_URL || 'http://localhost:3004'; // Default to PhotoCredits port
    const response = await axios.post(`${photocreditsUrl}/api/photocredits/photos`, photoData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PHOTOCREDITS_API_KEY || ''}`
      }
    });

    logger.info(`Photo uploaded to PhotoCredits: ${photoData.title}`);
    return {
      success: true,
      message: `Photo '${photoData.title}' successfully uploaded to PhotoCredits in real-time.`,
      data: response.data
    };
  } catch (error) {
    logger.error('Error calling PhotoCredits service via HTTP:', error);
    throw error;
  }
}

exports.manageAds = async (req, res) => {
  try {
    const { adCampaignName, _targetAudience, schedule, _mediaUrl, action } = req.body;
    // action: 'create', 'schedule', 'approve_submission'

    logger.info(`Managing Ad: ${adCampaignName} - Action: ${action}`);

    res.status(200).json({
      success: true,
      message: `Ad Campaign '${adCampaignName}' successfully processed with action '${action}'.`,
      data: { adCampaignName, schedule, status: action === 'schedule' ? 'scheduled' : 'active' }
    });
  } catch (error) {
    logger.error('Error managing ads:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
