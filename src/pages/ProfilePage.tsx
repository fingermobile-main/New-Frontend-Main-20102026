import React, { useEffect, useState } from 'react';

import { useAppContext } from "../contexts/AppContext";
import { usePostContext } from '../contexts/PostContext';
import PostCard from '../components/PostCard';
import { Post } from '../types';
import { 
  UserIcon, 
  CameraIcon, 
  PencilIcon, 
  CurrencyDollarIcon, 
  LinkIcon, 
  MailIcon, 
  LocationMarkerIcon,
  CalendarIcon,
  HeartIcon,
  ShareIcon,
  ChatIcon,
  GiftIcon,
  CogIcon
} from '../icons';

const ProfilePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4">
      <h1 className="text-2xl font-bold">Profile</h1>
      <p>This is the profile page.</p>
    </div>
  );
};

export default ProfilePage;
