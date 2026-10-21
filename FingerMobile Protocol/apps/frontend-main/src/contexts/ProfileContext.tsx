import React, { useEffect, createContext, useContext, useReducer } from 'react';
import { Member, Preferences } from '../types';

interface ProfileState {
  profile: Member | null;
  isLoading: boolean;
  error: string | null;
  skills: string[];
  aiOptimized: boolean;
  authenticityScore: number;
  profileVideos: string[];
  coverPhotos: string[];
}

interface ProfileAction {
  type: string;
  payload?: any;
}

const initialState: ProfileState = {
  profile: null,
  isLoading: false,
  error: null,
  skills: [],
  aiOptimized: false,
  authenticityScore: 0.85, // Default authenticity score
  profileVideos: [],
  coverPhotos: []
};

// Action types
const SET_PROFILE = 'SET_PROFILE';
const SET_LOADING = 'SET_LOADING';
const SET_ERROR = 'SET_ERROR';
const UPDATE_PROFILE = 'UPDATE_PROFILE';
const ADD_SKILL = 'ADD_SKILL';
const REMOVE_SKILL = 'REMOVE_SKILL';
const SET_AI_OPTIMIZED = 'SET_AI_OPTIMIZED';
const UPDATE_AUTHENTICITY_SCORE = 'UPDATE_AUTHENTICITY_SCORE';
const ADD_PROFILE_VIDEO = 'ADD_PROFILE_VIDEO';
const ADD_COVER_PHOTO = 'ADD_COVER_PHOTO';
const REMOVE_COVER_PHOTO = 'REMOVE_COVER_PHOTO';

const profileReducer = (state: ProfileState, action: ProfileAction): ProfileState => {
  switch (action.type) {
  case SET_PROFILE:
    return {
      ...state,
      profile: action.payload,
      isLoading: false,
      error: null
    };
  case SET_LOADING:
    return {
      ...state,
      isLoading: action.payload
    };
  case SET_ERROR:
    return {
      ...state,
      error: action.payload,
      isLoading: false
    };
  case UPDATE_PROFILE:
    return {
      ...state,
      profile: {
        ...state.profile,
        ...action.payload
      }
    };
  case ADD_SKILL:
    if (state.skills.includes(action.payload)) return state;
    return {
      ...state,
      skills: [...state.skills, action.payload]
    };
  case REMOVE_SKILL:
    return {
      ...state,
      skills: state.skills.filter(skill => skill !== action.payload)
    };
  case SET_AI_OPTIMIZED:
    return {
      ...state,
      aiOptimized: action.payload
    };
  case UPDATE_AUTHENTICITY_SCORE:
    return {
      ...state,
      authenticityScore: action.payload
    };
  case ADD_PROFILE_VIDEO:
    return {
      ...state,
      profileVideos: [...state.profileVideos, action.payload]
    };
  case ADD_COVER_PHOTO:
    return {
      ...state,
      coverPhotos: [...state.coverPhotos, action.payload]
    };
  case REMOVE_COVER_PHOTO:
    return {
      ...state,
      coverPhotos: state.coverPhotos.filter(photo => photo !== action.payload)
    };
  default:
    return state;
  }
};

interface ProfileContextType extends ProfileState {
  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (profileData: Partial<Member>) => Promise<void>;
  updateBio: (bio: string) => Promise<void>;
  updateDisplayName: (displayName: string) => Promise<void>;
  updateUsername: (username: string) => Promise<void>;
  updateAvatar: (avatarUrl: string) => Promise<void>;
  updateCoverPhoto: (coverPhotoUrl: string) => Promise<void>;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
  generateAIProfile: () => Promise<void>;
  addProfileVideo: (videoUrl: string) => void;
  addCoverSlideshow: (photoUrl: string) => void;
  removeCoverPhoto: (photoUrl: string) => void;
  getProfileAnalytics: (userId: string) => Promise<unknown>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

interface Props {
  children: React.ReactNode;
}

export const ProfileProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(profileReducer, initialState);

  useEffect(() => {
    // Load profile data from localStorage if available
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        dispatch({ type: SET_PROFILE, payload: parsedProfile });
      } catch (e) {
        console.error('Error parsing saved profile:', e);
      }
    }
  }, []);

  const fetchProfile = async (userId: string) => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      // Mock API call - in a real app, this would call your backend
      const response = await fetch(`/api/profiles/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const profileData = await response.json();
      dispatch({ type: SET_PROFILE, payload: profileData });
      localStorage.setItem('userProfile', JSON.stringify(profileData));
    } catch (error: any) {
      dispatch({ type: SET_ERROR, payload: error.message });
    } finally {
      dispatch({ type: SET_LOADING, payload: false });
    }
  };

  const updateProfile = async (profileData: Partial<Member>) => {
    if (!state.profile) return;

    dispatch({ type: SET_LOADING, payload: true });
    try {
      const response = await fetch(`/api/profiles/${state.profile.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedProfile = await response.json();
      dispatch({ type: UPDATE_PROFILE, payload: updatedProfile });
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    } catch (error: any) {
      dispatch({ type: SET_ERROR, payload: error.message });
    } finally {
      dispatch({ type: SET_LOADING, payload: false });
    }
  };

  const updateBio = async (bio: string) => {
    await updateProfile({ bio });
  };

  const updateDisplayName = async (displayName: string) => {
    await updateProfile({ displayName });
  };

  const updateUsername = async (username: string) => {
    await updateProfile({ username });
  };

  const updateAvatar = async (avatarUrl: string) => {
    await updateProfile({ avatar: avatarUrl });
  };

  const updateCoverPhoto = async (coverPhotoUrl: string) => {
    await updateProfile({ cover_image: coverPhotoUrl } as Partial<Member>); // Using type assertion to bypass strict typing
  };

  const addSkill = (skill: string) => {
    if (state.skills.length >= 25) {
      // Limit to 25 skills as per requirements
      console.warn('Maximum number of skills reached (25)');
      return;
    }
    dispatch({ type: ADD_SKILL, payload: skill });
  };

  const removeSkill = (skill: string) => {
    dispatch({ type: REMOVE_SKILL, payload: skill });
  };

  const generateAIProfile = async () => {
    if (!state.profile) return;

    dispatch({ type: SET_LOADING, payload: true });
    try {
      // Mock AI profile generation
      const response = await fetch('/api/ai/profile-optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          profile: state.profile,
          skills: state.skills
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate AI-optimized profile');
      }

      const aiResult = await response.json();
      dispatch({ type: UPDATE_PROFILE, payload: aiResult.optimizedProfile });
      dispatch({ type: SET_AI_OPTIMIZED, payload: true });
    } catch (error: any) {
      dispatch({ type: SET_ERROR, payload: error.message });
    } finally {
      dispatch({ type: SET_LOADING, payload: false });
    }
  };

  const addProfileVideo = (videoUrl: string) => {
    if (state.profileVideos.length >= 1) {
      // Only allow one profile video as per requirements (3-5 seconds max)
      console.warn('Only one profile video is allowed');
      return;
    }
    dispatch({ type: ADD_PROFILE_VIDEO, payload: videoUrl });
  };

  const addCoverSlideshow = (photoUrl: string) => {
    if (state.coverPhotos.length >= 3) {
      // Limit to 3 cover photos as per requirements
      console.warn('Maximum number of cover photos reached (3)');
      return;
    }
    dispatch({ type: ADD_COVER_PHOTO, payload: photoUrl });
  };

  const removeCoverPhoto = (photoUrl: string) => {
    dispatch({ type: REMOVE_COVER_PHOTO, payload: photoUrl });
  };

  const getProfileAnalytics = async (userId: string) => {
    try {
      const response = await fetch(`/api/profiles/${userId}/analytics`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile analytics');
      }

      return await response.json();
    } catch (error: any) {
      dispatch({ type: SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const value = {
    ...state,
    fetchProfile,
    updateProfile,
    updateBio,
    updateDisplayName,
    updateUsername,
    updateAvatar,
    updateCoverPhoto,
    addSkill,
    removeSkill,
    generateAIProfile,
    addProfileVideo,
    addCoverSlideshow,
    removeCoverPhoto,
    getProfileAnalytics
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};
