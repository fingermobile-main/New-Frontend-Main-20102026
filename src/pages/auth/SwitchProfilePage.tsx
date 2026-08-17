import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import { useAuth } from '../../contexts/AuthContext';
import { useAppContext } from '../../contexts/AppContext';
import { SubProfile } from '../../types';

const SwitchProfilePage: React.FC = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const { switchActiveSubProfile, user } = useAuth();
  const { showToast } = useAppContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const switchProfile = async () => {
      try {
        if (profileId && user?.subProfiles) {
          // Find the profile in user's subProfiles - TypeScript infers type from array
          const targetProfile = user.subProfiles.find((profile) => profile.id === profileId);
          
          if (targetProfile) {
            switchActiveSubProfile(targetProfile);
            showToast(`Switched to profile: ${targetProfile.name || profileId}`, 'success');
          } else {
            showToast('Profile not found', 'error');
          }
        } else {
          showToast('Invalid profile ID or user profiles not loaded', 'error');
        }
      } catch (error) {
        // Changed from console.error to use the app context's toast
        showToast('Failed to switch profile', 'error');
      } finally {
        setLoading(false);
      }
    };

    switchProfile();
  }, [profileId, switchActiveSubProfile, showToast, user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Profile Switched</h2>
      <p className="text-center text-gray-600 mb-6">
        Successfully switched to profile: {profileId}
      </p>
      <div className="text-center">
        <button 
          onClick={() => window.history.back()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default SwitchProfilePage;