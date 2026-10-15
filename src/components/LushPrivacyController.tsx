import React, { useState, useEffect } from 'react';
import { LockClosedIcon, EyeSlashIcon, ShieldCheckIcon, KeyIcon, GiftIcon } from '@heroicons/react/24/outline';

interface PrivacySettings {
  allowReviews?: string;
  allowComments?: string;
  allowSharing?: string;
  allowTagging?: string;
  allowSaving?: string;
  allowDownload?: string;
  visibility?: string;
  durationType?: string;
  expiresAt?: string | null;
  pinExchangeRequired?: boolean;
  giftRequiredToView?: boolean;
  membershipCategoryGate?: string[] | null;
  commitButtonUnlockedOnly?: boolean;
  radiatePlusOnly?: boolean;
  genderTarget?: string;
  ageRangeMin?: number;
  ageRangeMax?: number;
  allowedLocations?: Record<string, any>;
  allowedUserIds?: string[] | null;
  autoDelete?: boolean;
}

interface LushPrivacyControllerProps {
  contentType: string;
  contentId: string;
  userId: string;
  children: React.ReactNode;
  initialSettings?: PrivacySettings;
}

const LushPrivacyController: React.FC<LushPrivacyControllerProps> = ({
  contentType,
  contentId,
  userId,
  children,
  initialSettings = {}
}) => {
  const [settings, setSettings] = useState<PrivacySettings>(initialSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [canView, setCanView] = useState(false);

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        setIsLoading(true);

        // Simulate API call to check permissions
        const response = await fetch(`/api/lushpressies/privacy/${contentType}/${contentId}/check-view`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ userId })
        });

        if (response.ok) {
          const data = await response.json();
          setCanView(data.canView);
        } else {
          setCanView(false);
        }
      } catch (error) {
        console.error('Error checking privacy permissions:', error);
        setCanView(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkPermissions();
  }, [contentType, contentId, userId]);

  const updateSettings = async (newSettings: PrivacySettings) => {
    try {
      const response = await fetch(`/api/lushpressies/privacy/${contentType}/${contentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newSettings)
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data.data);
        return { success: true, data: data.data };
      } else {
        return { success: false, error: 'Failed to update settings' };
      }
    } catch (error: any) {
      console.error('Error updating privacy settings:', error);
      return { success: false, error: error.message };
    }
  };

  const handleRequestAccess = async () => {
    if (settings.pinExchangeRequired) {
      // Handle PIN exchange request
      const pin = prompt('Enter the 6-digit PIN to access this content:');
      if (pin && pin.length === 6) {
        try {
          const response = await fetch('/api/lushpressies/privacy/pin/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ pin, contentType, contentId })
          });

          if (response.ok) {
            setCanView(true);
            return { success: true };
          }
        } catch (error) {
          console.error('Error verifying PIN:', error);
        }
      }
    } else if (settings.giftRequiredToView) {
      // Handle gift requirement - redirect to gift sending page
      alert('A gift must be sent before viewing this content.');
      // In a real app, this would redirect to gift sending page
    }

    return { success: false };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  if (!canView) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
        <div className="text-center py-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100">
            <LockClosedIcon className="h-8 w-8 text-indigo-600" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Content Access Restricted</h3>
          <p className="mt-2 text-sm text-gray-500">
            This content has special privacy requirements that must be met before viewing.
          </p>

          <div className="mt-6 bg-white rounded-lg p-4 border border-slate-300">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Requirements:</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              {settings.visibility && (
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Visibility: {settings.visibility}
                </li>
              )}
              {settings.pinExchangeRequired && (
                <li className="flex items-center text-amber-700">
                  <KeyIcon className="h-3 w-3 mr-2" />
                  6-digit PIN exchange required
                </li>
              )}
              {settings.giftRequiredToView && (
                <li className="flex items-center text-rose-600">
                  <GiftIcon className="h-3 w-3 mr-2" />
                  Gift required to view
                </li>
              )}
              {settings.radiatePlusOnly && (
                <li className="flex items-center text-emerald-600">
                  <ShieldCheckIcon className="h-3 w-3 mr-2" />
                  Radiate++ membership required
                </li>
              )}
            </ul>
          </div>

          <div className="mt-6">
            <button
              onClick={handleRequestAccess}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Request Access
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default LushPrivacyController;
