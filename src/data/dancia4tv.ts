import { DanciaVideo, DanciaPlaylist } from '../types/dancia4tv';

// Mock data for Dancia4Tv platform
export const mockVideos: DanciaVideo[] = [
  {
    videoID: 'vid-001',
    title: 'Nollywood Blockbuster',
    description: 'A thrilling Nollywood production',
    genre: 'Action',
    IARCClassification: {
      classificationID: 'class-001',
      rating: 'PG-13',
      description: 'Suitable for ages 13 and up'
    },
    monetizationModel: {
      modelID: 'model-001',
      name: 'Starter Pack',
      description: 'Basic monetization model',
      revenueShare: 70,
      currency: 'USD',
      thresholds: {
        likes: 100,
        shares: 50,
        comments: 20,
        watchTimeSeconds: 180
      }
    },
    uploadFee: 0,
    length: 7200, // 2 hours in seconds
    resolution: '1080p',
    contentTags: ['nollywood', 'action', 'thriller'],
    uploadDate: new Date(),
    uploaderID: 'user-001',
    engagementScore: 95,
    thumbnailURL: 'https://example.com/thumb1.jpg',
    size: 2000000000, // 2GB in bytes
    likeCount: 150,
    shareCount: 60,
    downloadCount: 30,
    saveCount: 45,
    mashupCount: 12
  },
  {
    videoID: 'vid-002',
    title: 'Bollywood Romance',
    description: 'A romantic tale from Bollywood',
    genre: 'Romance',
    IARCClassification: {
      classificationID: 'class-002',
      rating: 'PG',
      description: 'Parental guidance suggested'
    },
    monetizationModel: {
      modelID: 'model-002',
      name: 'Gem Pack',
      description: 'Premium monetization model',
      revenueShare: 80,
      currency: 'USD',
      thresholds: {
        likes: 200,
        shares: 100,
        comments: 50,
        watchTimeSeconds: 300
      }
    },
    uploadFee: 5,
    length: 7800, // 2.17 hours in seconds
    resolution: '4K',
    contentTags: ['bollywood', 'romance', 'musical'],
    uploadDate: new Date(),
    uploaderID: 'user-002',
    engagementScore: 98,
    thumbnailURL: 'https://example.com/thumb2.jpg',
    size: 4000000000, // 4GB in bytes
    likeCount: 230,
    shareCount: 110,
    downloadCount: 85,
    saveCount: 90,
    mashupCount: 25
  }
];

export const mockPlaylists: DanciaPlaylist[] = [
  {
    playlistID: 'pl-001',
    name: 'My Favorites',
    ownerID: 'user-001',
    videos: ['vid-001'],
    isPublic: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    metadata: {
      artist: 'Various Artists',
      album: 'Favorites Collection',
      tracks: ['vid-001'],
      genres: ['Action'],
      length: 7200,
      fileSize: 2000000000
    }
  }
];

export const videoGenres: string[] = [
  'Action',
  'Drama',
  'Comedy',
  'Romance',
  'Thriller',
  'Horror',
  'Sci-Fi',
  'Fantasy',
  'Animation',
  'Documentary',
  'Music',
  'Sport'
];

export const movieTypeChoices: string[] = [
  'Blockbuster',
  'Indie Film',
  'Documentary',
  'Short Film',
  'Web Series',
  'Live Event'
];