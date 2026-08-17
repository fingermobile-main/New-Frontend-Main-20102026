import React, { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { 
  CameraIcon, 
  VideoCameraIcon, 
  CollectionIcon, 
  HeartIcon, 
  ShareIcon, 
  DownloadIcon,
  EyeIcon,
  PlusIcon,
  GridIcon,
  ListIcon
} from '@/icons';
import { useToast } from '@/hooks/use-toast';

const GalleryPage: React.FC = () => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const photos = [
    {
      id: 1,
      title: 'Mountain Landscape',
      category: 'nature',
      likes: 124,
      views: 542,
      date: '2023-08-15',
      url: '/placeholder-image-1.jpg'
    },
    {
      id: 2,
      title: 'City Skyline',
      category: 'urban',
      likes: 89,
      views: 321,
      date: '2023-08-12',
      url: '/placeholder-image-2.jpg'
    },
    {
      id: 3,
      title: 'Beach Sunset',
      category: 'nature',
      likes: 210,
      views: 876,
      date: '2023-08-10',
      url: '/placeholder-image-3.jpg'
    },
    {
      id: 4,
      title: 'Abstract Art',
      category: 'art',
      likes: 56,
      views: 210,
      date: '2023-08-08',
      url: '/placeholder-image-4.jpg'
    },
    {
      id: 5,
      title: 'Street Photography',
      category: 'urban',
      likes: 78,
      views: 432,
      date: '2023-08-05',
      url: '/placeholder-image-5.jpg'
    },
    {
      id: 6,
      title: 'Portrait Session',
      category: 'people',
      likes: 142,
      views: 654,
      date: '2023-08-03',
      url: '/placeholder-image-6.jpg'
    }
  ];

  const videos = [
    {
      id: 1,
      title: 'Travel Vlog: Paris',
      category: 'travel',
      duration: '5:24',
      views: 1240,
      date: '2023-08-14',
      thumbnail: '/placeholder-video-1.jpg'
    },
    {
      id: 2,
      title: 'Cooking Tutorial',
      category: 'food',
      duration: '8:42',
      views: 890,
      date: '2023-08-11',
      thumbnail: '/placeholder-video-2.jpg'
    }
  ];

  const categories = ['all', 'nature', 'urban', 'art', 'people', 'travel', 'food'];

  const filteredPhotos = selectedCategory === 'all' 
    ? photos 
    : photos.filter(photo => photo.category === selectedCategory);

  const handleLike = (id: number) => {
    toast({
      title: "Liked!",
      description: "You liked this media."
    });
  };

  const handleDownload = (id: number) => {
    toast({
      title: "Download Started",
      description: "Your download will begin shortly."
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Gallery</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore photos, videos, and creative content from our community
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <Tabs defaultValue="photos" className="w-full md:w-auto">
            <TabsList>
              <TabsTrigger value="photos">Photos</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="collections">Collections</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <div className="flex border rounded-md overflow-hidden">
              <button 
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                onClick={() => setViewMode('grid')}
              >
                <GridIcon className="w-5 h-5" />
              </button>
              <button 
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                onClick={() => setViewMode('list')}
              >
                <ListIcon className="w-5 h-5" />
              </button>
            </div>

            <select 
              className="border rounded-md p-2 bg-white"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>

            <Button>
              <PlusIcon className="w-4 h-4 mr-2" />
              Upload
            </Button>
          </div>
        </div>

        <Tabs defaultValue="photos" className="w-full">
          <TabsContent value="photos">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredPhotos.map((photo) => (
                  <Card key={photo.id} className="overflow-hidden group">
                    <div className="relative">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48" />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="secondary" 
                            className="rounded-full"
                            onClick={() => handleLike(photo.id)}
                          >
                            <HeartIcon className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="secondary" 
                            className="rounded-full"
                            onClick={() => handleDownload(photo.id)}
                          >
                            <DownloadIcon className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="secondary" 
                            className="rounded-full"
                          >
                            <ShareIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold line-clamp-1">{photo.title}</h3>
                          <p className="text-sm text-gray-500">{photo.date}</p>
                        </div>
                        <Badge variant="secondary">{photo.category}</Badge>
                      </div>
                      <div className="flex justify-between mt-3 text-sm text-gray-600">
                        <div className="flex items-center">
                          <HeartIcon className="w-4 h-4 mr-1" />
                          {photo.likes}
                        </div>
                        <div className="flex items-center">
                          <EyeIcon className="w-4 h-4 mr-1" />
                          {photo.views}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPhotos.map((photo) => (
                  <Card key={photo.id} className="flex overflow-hidden">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 flex-shrink-0" />
                    <div className="p-4 flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-semibold">{photo.title}</h3>
                        <Badge variant="secondary">{photo.category}</Badge>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{photo.date}</p>
                      <p className="text-gray-600 line-clamp-2 mb-3">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                      </p>
                      <div className="flex justify-between text-sm text-gray-600">
                        <div className="flex space-x-4">
                          <div className="flex items-center">
                            <HeartIcon className="w-4 h-4 mr-1 text-red-500" />
                            {photo.likes} likes
                          </div>
                          <div className="flex items-center">
                            <EyeIcon className="w-4 h-4 mr-1" />
                            {photo.views} views
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <HeartIcon className="w-4 h-4 mr-1" />
                            Like
                          </Button>
                          <Button size="sm" variant="outline">
                            <DownloadIcon className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="videos">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <Card key={video.id} className="overflow-hidden group">
                  <div className="relative">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black bg-opacity-50 rounded-full p-3">
                        <VideoCameraIcon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{video.title}</h3>
                        <p className="text-sm text-gray-500">{video.date}</p>
                      </div>
                      <Badge variant="secondary">{video.category}</Badge>
                    </div>
                    <div className="flex justify-between mt-3 text-sm text-gray-600">
                      <div className="flex items-center">
                        <EyeIcon className="w-4 h-4 mr-1" />
                        {video.views} views
                      </div>
                      <Button size="sm" variant="outline">
                        <DownloadIcon className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="collections">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((id) => (
                <Card key={id} className="overflow-hidden">
                  <div className="bg-gray-200 border-2 border-dashed rounded-t-xl w-full h-40" />
                  <CardContent className="p-4">
                    <h3 className="font-semibold">Collection {id}</h3>
                    <p className="text-sm text-gray-500 mb-2">12 items • Created 2 days ago</p>
                    <div className="flex justify-between text-sm text-gray-600">
                      <div className="flex items-center">
                        <HeartIcon className="w-4 h-4 mr-1" />
                        42
                      </div>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Featured Galleries</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 h-32 flex items-center justify-center">
                <CollectionIcon className="w-12 h-12 text-white" />
              </div>
              <CardContent className="p-4 text-center">
                <h3 className="font-semibold">Nature Wonders</h3>
                <p className="text-sm text-gray-500">124 photos</p>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-teal-600 h-32 flex items-center justify-center">
                <CameraIcon className="w-12 h-12 text-white" />
              </div>
              <CardContent className="p-4 text-center">
                <h3 className="font-semibold">Urban Landscapes</h3>
                <p className="text-sm text-gray-500">89 photos</p>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 h-32 flex items-center justify-center">
                <VideoCameraIcon className="w-12 h-12 text-white" />
              </div>
              <CardContent className="p-4 text-center">
                <h3 className="font-semibold">Video Highlights</h3>
                <p className="text-sm text-gray-500">32 videos</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;