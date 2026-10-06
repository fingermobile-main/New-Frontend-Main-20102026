/*
 * FingerMobile Protocol™ - Mii Avatar Customization Page Component
 * Copyright © 2025 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms,
 * which are the sole and exclusive intellectual property of Mbah Israel Obinna.
 *
 * Unauthorized copying, distribution, or modification of this code is strictly prohibited. All laws do and will apply.
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { Slider } from '../components/ui/Slider';
import { Separator } from '../components/ui/Separator';
import { ScrollArea } from '../components/ui/ScrollArea';
import {
  UserIcon,
  PaletteIcon,
  SparklesIcon,
  StarIcon,
  EyeIcon,
  HomeModernIcon,
  PhotoIcon,
  ArrowPathIcon
} from '@/components/icons';
import { miiService, MiiAvatar, MiiTemplate, MiiItem } from '../services/MiiService';
import { useAppContext } from '../contexts/AppContext';
import logger from '../utils/logger';

const MiiAvatarPage: React.FC = () => {
  const { user, showToast } = useAppContext();
  const [activeTab, setActiveTab] = useState<'avatars' | 'templates' | 'customization'>('avatars');
  const [avatars, setAvatars] = useState<MiiAvatar[]>([]);
  const [templates, setTemplates] = useState<MiiTemplate[]>([]);
  const [items, setItems] = useState<MiiItem[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState<MiiAvatar | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<MiiTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Current customization state
  const [currentCustomization, setCurrentCustomization] = useState<any>({});

  // Fetch avatars, templates, and items
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch user avatars
        const avatarResponse = await miiService.getAvatars();
        setAvatars(avatarResponse.data);

        // Fetch templates
        const templateResponse = await miiService.getTemplates();
        setTemplates(templateResponse.data);

        // Fetch items
        const itemResponse = await miiService.getItems();
        setItems(itemResponse.data);

        // If user has avatars, set the first one as selected
        if (avatarResponse.data.length > 0) {
          setSelectedAvatar(avatarResponse.data[0]);
          setCurrentCustomization(avatarResponse.data[0].customization || {});
        }
      } catch (err) {
        logger.error('Error fetching Mii data:', err);
        setError('Failed to load Mii data');
        showToast('Failed to load Mii data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, showToast]);

  const handleCreateAvatar = async () => {
    if (!selectedTemplate) {
      showToast('Please select a template first', 'error');
      return;
    }

    try {
      const newAvatar = await miiService.createAvatar({
        name: `My Mii ${avatars.length + 1}`,
        baseTemplate: selectedTemplate.name,
        customization: currentCustomization
      });

      if (newAvatar.data) {
        setAvatars([...avatars, newAvatar.data]);
        setSelectedAvatar(newAvatar.data);
        setCurrentCustomization(newAvatar.data.customization || {});
        showToast('Avatar created successfully!', 'success');
      }
    } catch (err) {
      logger.error('Error creating avatar:', err);
      showToast('Failed to create avatar', 'error');
    }
  };

  const handleSaveCustomization = async () => {
    if (!selectedAvatar) {
      showToast('No avatar selected', 'error');
      return;
    }

    try {
      const updatedAvatar = await miiService.customizeAvatar(selectedAvatar.id, {
        customization: currentCustomization
      });

      if (updatedAvatar.data) {
        const updatedData = updatedAvatar.data;
        const updatedAvatars = avatars.map(av =>
          av.id === selectedAvatar.id ? updatedData : av
        );
        setAvatars(updatedAvatars);
        setSelectedAvatar(updatedData);
      }

      showToast('Avatar customization saved!', 'success');
    } catch (err) {
      logger.error('Error saving customization:', err);
      showToast('Failed to save customization', 'error');
    }
  };

  const handleCustomizationChange = (property: string, value: any) => {
    setCurrentCustomization({
      ...currentCustomization,
      [property]: value
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Mii Avatar Studio</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create and customize your unique digital avatar
          </p>
        </div>

        <Tabs value={activeTab} className="w-full" onValueChange={(val: string) => setActiveTab(val as 'avatars' | 'templates' | 'customization')}>
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-md rounded-lg p-1 mb-8">
            <TabsTrigger value="avatars" className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700 rounded-md py-2">
              My Avatars
            </TabsTrigger>
            <TabsTrigger value="templates" className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700 rounded-md py-2">
              Templates
            </TabsTrigger>
            <TabsTrigger value="customization" className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700 rounded-md py-2">
              Customization
            </TabsTrigger>
          </TabsList>

          <TabsContent value="avatars" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Your Avatars</h2>
              <Button onClick={handleCreateAvatar} className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center">
                <SparklesIcon className="w-4 h-4 mr-2" />
                Create New Avatar
              </Button>
            </div>

            {avatars.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-indigo-100">
                  <UserIcon className="h-12 w-12 text-indigo-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No avatars yet</h3>
                <p className="mt-1 text-gray-500">Get started by creating your first Mii avatar.</p>
                <div className="mt-6">
                  <Button onClick={handleCreateAvatar} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    Create Avatar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {avatars.map((avatar) => (
                  <Card
                    key={avatar.id}
                    className={`overflow-hidden bg-white shadow-md rounded-xl border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer ${
                      selectedAvatar?.id === avatar.id ? 'ring-2 ring-indigo-500' : ''
                    }`}
                    onClick={() => {
                      setSelectedAvatar(avatar);
                      setCurrentCustomization(avatar.customization || {});
                    }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl text-gray-800">{avatar.name}</CardTitle>
                        {avatar.isActive && (
                          <Badge className="bg-gradient-to-r from-green-400 to-blue-500 text-white text-xs px-2 py-1">
                            Active
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-gray-600">Created {new Date(avatar.createdAt).toLocaleDateString()}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <PaletteIcon className="w-4 h-4 mr-1" />
                        <span>Base: {avatar.baseTemplate || 'Default'}</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        className="w-full border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAvatar(avatar);
                          setCurrentCustomization(avatar.customization || {});
                          setActiveTab('customization');
                        }}
                      >
                        <EyeIcon className="w-4 h-4 mr-2" />
                        Customize
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Avatar Templates</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className={`overflow-hidden bg-white shadow-md rounded-xl border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer ${
                    selectedTemplate?.id === template.id ? 'ring-2 ring-indigo-500' : ''
                  }`}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl text-gray-800">{template.name}</CardTitle>
                      {template.isAvailable && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1">
                          Available
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-gray-600">{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <HomeModernIcon className="w-4 h-4 mr-1" />
                      <span>Category: {template.category}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <StarIcon className="w-4 h-4 mr-1" />
                      <span>Popularity: {template.popularity}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTemplate(template);
                        setActiveTab('customization');
                      }}
                    >
                      <PhotoIcon className="w-4 h-4 mr-2" />
                      Use Template
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="customization" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Customize Avatar</h2>
              {items.length > 0 && (
                <Badge className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2.5 py-1">
                  {items.length} Wardrobe Items In Studio
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Avatar Preview */}
              <div className="lg:col-span-1">
                <Card className="bg-white shadow-md rounded-xl border border-gray-200">
                  <CardHeader>
                    <CardTitle>Preview</CardTitle>
                    <CardDescription>Your avatar will appear as you customize it</CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <div className="w-48 h-48 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full flex items-center justify-center">
                      <div className="text-6xl">👤</div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={handleSaveCustomization}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      <ArrowPathIcon className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              {/* Customization Controls */}
              <div className="lg:col-span-2">
                <Card className="bg-white shadow-md rounded-xl border border-gray-200">
                  <CardHeader>
                    <CardTitle>Customization Panel</CardTitle>
                    <CardDescription>Adjust your avatar's appearance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[500px] pr-4">
                      <div className="space-y-6">
                        {/* Basic Info */}
                        <div>
                          <h3 className="text-lg font-medium text-gray-800 mb-3">Basic Information</h3>
                          <div className="space-y-3">
                            <div>
                              <Label htmlFor="avatar-name">Avatar Name</Label>
                              <Input
                                id="avatar-name"
                                value={selectedAvatar?.name || ''}
                                onChange={(e) => selectedAvatar && setSelectedAvatar({...selectedAvatar, name: e.target.value})}
                                placeholder="Enter avatar name"
                              />
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Face Features */}
                        <div>
                          <h3 className="text-lg font-medium text-gray-800 mb-3">Face Features</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Face Shape</Label>
                              <Select
                                value={currentCustomization.faceShape || 'round'}
                                onValueChange={(value) => handleCustomizationChange('faceShape', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select shape" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="round">Round</SelectItem>
                                  <SelectItem value="square">Square</SelectItem>
                                  <SelectItem value="oval">Oval</SelectItem>
                                  <SelectItem value="heart">Heart</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label>Eyebrow Style</Label>
                              <Select
                                value={currentCustomization.eyebrowStyle || 'normal'}
                                onValueChange={(value) => handleCustomizationChange('eyebrowStyle', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select style" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="normal">Normal</SelectItem>
                                  <SelectItem value="thick">Thick</SelectItem>
                                  <SelectItem value="thin">Thin</SelectItem>
                                  <SelectItem value="angled">Angled</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label>Eye Shape</Label>
                              <Select
                                value={currentCustomization.eyeShape || 'round'}
                                onValueChange={(value) => handleCustomizationChange('eyeShape', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select shape" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="round">Round</SelectItem>
                                  <SelectItem value="oval">Oval</SelectItem>
                                  <SelectItem value="almond">Almond</SelectItem>
                                  <SelectItem value="wide">Wide</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label>Nose Style</Label>
                              <Select
                                value={currentCustomization.noseStyle || 'standard'}
                                onValueChange={(value) => handleCustomizationChange('noseStyle', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select style" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="standard">Standard</SelectItem>
                                  <SelectItem value="pointed">Pointed</SelectItem>
                                  <SelectItem value="rounded">Rounded</SelectItem>
                                  <SelectItem value="small">Small</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label>Mouth Style</Label>
                              <Select
                                value={currentCustomization.mouthStyle || 'smile'}
                                onValueChange={(value) => handleCustomizationChange('mouthStyle', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select style" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="smile">Smile</SelectItem>
                                  <SelectItem value="neutral">Neutral</SelectItem>
                                  <SelectItem value="surprised">Surprised</SelectItem>
                                  <SelectItem value="frown">Frown</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label>Facial Hair</Label>
                              <Select
                                value={currentCustomization.facialHair || 'none'}
                                onValueChange={(value) => handleCustomizationChange('facialHair', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select style" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">None</SelectItem>
                                  <SelectItem value="mustache">Mustache</SelectItem>
                                  <SelectItem value="beard">Beard</SelectItem>
                                  <SelectItem value="goatee">Goatee</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Colors */}
                        <div>
                          <h3 className="text-lg font-medium text-gray-800 mb-3">Colors</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Skin Tone</Label>
                              <Slider
                                min={1}
                                max={5}
                                step={1}
                                value={[currentCustomization.skinTone || 3]}
                                onValueChange={(value) => handleCustomizationChange('skinTone', value[0])}
                              />
                              <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>Light</span>
                                <span>Medium</span>
                                <span>Dark</span>
                              </div>
                            </div>

                            <div>
                              <Label>Hair Color</Label>
                              <Select
                                value={currentCustomization.hairColor || 'black'}
                                onValueChange={(value) => handleCustomizationChange('hairColor', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select color" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="black">Black</SelectItem>
                                  <SelectItem value="brown">Brown</SelectItem>
                                  <SelectItem value="blonde">Blonde</SelectItem>
                                  <SelectItem value="red">Red</SelectItem>
                                  <SelectItem value="gray">Gray</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label>Eye Color</Label>
                              <Select
                                value={currentCustomization.eyeColor || 'brown'}
                                onValueChange={(value) => handleCustomizationChange('eyeColor', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select color" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="brown">Brown</SelectItem>
                                  <SelectItem value="blue">Blue</SelectItem>
                                  <SelectItem value="green">Green</SelectItem>
                                  <SelectItem value="hazel">Hazel</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label>Clothing Color</Label>
                              <Select
                                value={currentCustomization.clothingColor || 'blue'}
                                onValueChange={(value) => handleCustomizationChange('clothingColor', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select color" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="blue">Blue</SelectItem>
                                  <SelectItem value="red">Red</SelectItem>
                                  <SelectItem value="green">Green</SelectItem>
                                  <SelectItem value="yellow">Yellow</SelectItem>
                                  <SelectItem value="purple">Purple</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Accessories */}
                        <div>
                          <h3 className="text-lg font-medium text-gray-800 mb-3">Accessories</h3>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="glasses-toggle">Wear Glasses</Label>
                              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                <input
                                  type="checkbox"
                                  id="glasses-toggle"
                                  className="sr-only"
                                  checked={currentCustomization.wearsGlasses || false}
                                  onChange={(e) => handleCustomizationChange('wearsGlasses', e.target.checked)}
                                />
                                <div className={`block w-10 h-6 rounded-full ${currentCustomization.wearsGlasses ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${currentCustomization.wearsGlasses ? 'transform translate-x-4' : ''}`}></div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <Label htmlFor="hat-toggle">Wear Hat</Label>
                              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                <input
                                  type="checkbox"
                                  id="hat-toggle"
                                  className="sr-only"
                                  checked={currentCustomization.wearsHat || false}
                                  onChange={(e) => handleCustomizationChange('wearsHat', e.target.checked)}
                                />
                                <div className={`block w-10 h-6 rounded-full ${currentCustomization.wearsHat ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${currentCustomization.wearsHat ? 'transform translate-x-4' : ''}`}></div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <Label htmlFor="jewelry-toggle">Wear Jewelry</Label>
                              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                <input
                                  type="checkbox"
                                  id="jewelry-toggle"
                                  className="sr-only"
                                  checked={currentCustomization.wearsJewelry || false}
                                  onChange={(e) => handleCustomizationChange('wearsJewelry', e.target.checked)}
                                />
                                <div className={`block w-10 h-6 rounded-full ${currentCustomization.wearsJewelry ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${currentCustomization.wearsJewelry ? 'transform translate-x-4' : ''}`}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MiiAvatarPage;
