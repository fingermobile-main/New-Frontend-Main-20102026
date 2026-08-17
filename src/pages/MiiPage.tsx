import React, {} from 'react';
import { useAppContext } from "../contexts/AppContext";
import AnimatedAvatar from '../components/AnimatedAvatar';

const MiiPage: React.FC = () => {
  const { showToast } = useAppContext();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Mii Messaging Platform</h1>
          <p className="mt-1 text-sm text-gray-500">
            Advanced messaging platform with WhatsApp/Telegram/Signal hybrid functionality
          </p>
        </div>

        <div className="p-6">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium text-blue-800">Super-Advanced Communication</h2>
            <p className="mt-2 text-blue-700">
              End-to-end encrypted messaging with advanced security features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <AnimatedAvatar staticUrl="/avatars/default.png" animatedUrl="/avatars/default.gif" altText="Secure chat avatar" />
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">Secure Chats</h3>
                  <p className="text-sm text-gray-500">Encrypted conversations</p>
                </div>
              </div>
              <p className="text-gray-600">
                Your messages are protected with end-to-end encryption ensuring privacy.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <AnimatedAvatar staticUrl="/avatars/default.png" animatedUrl="/avatars/default.gif" altText="Video call avatar" />
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">Video Calls</h3>
                  <p className="text-sm text-gray-500">High-quality video chats</p>
                </div>
              </div>
              <p className="text-gray-600">
                Crystal clear video calls with advanced noise cancellation.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <AnimatedAvatar staticUrl="/avatars/default.png" animatedUrl="/avatars/default.gif" altText="Group chat avatar" />
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">Group Chats</h3>
                  <p className="text-sm text-gray-500">Up to 1000 members</p>
                </div>
              </div>
              <p className="text-gray-600">
                Connect with large groups with powerful admin tools.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={() => showToast('Secure message sent!', 'success')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Start Secure Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiiPage;