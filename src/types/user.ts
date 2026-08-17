import React, {} from 'react';
// User Types
export interface User {id: string;
  name: string;
  email: string;
  subProfiles?: Array<{
  id: string;
  name: string;
    avatarUrl?: string;
    animatedAvatarUrl?: string;
    type?: string;
  }>;
}

export interface UserProfile extends User {
  bio?: string;
  avatar?: string;
}
