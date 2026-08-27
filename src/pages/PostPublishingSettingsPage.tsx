import React from 'react';

const PostPublishingSettingsPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-[22px] font-bold mb-2">Post Publishing Settings</h1>
      <p className="text-[12px] text-gray-400 mb-6">Configure how your posts appear and behave</p>
      
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
        <h2 className="text-[16px] font-bold mb-4">Visibility</h2>
        <div className="space-y-4">
          <label className="flex items-center justify-between p-3 rounded-xl border border-gray-700">
            <div>
              <p className="text-[14px] font-semibold">Public</p>
              <p className="text-[12px] text-gray-400">Anyone can see this post</p>
            </div>
            <input type="radio" name="visibility" className="accent-orange-500" defaultChecked />
          </label>
          <label className="flex items-center justify-between p-3 rounded-xl border border-gray-700">
            <div>
              <p className="text-[14px] font-semibold">Followers Only</p>
              <p className="text-[12px] text-gray-400">Only your followers can see this post</p>
            </div>
            <input type="radio" name="visibility" className="accent-orange-500" />
          </label>
          <label className="flex items-center justify-between p-3 rounded-xl border border-gray-700">
            <div>
              <p className="text-[14px] font-semibold">Private</p>
              <p className="text-[12px] text-gray-400">Only you can see this post</p>
            </div>
            <input type="radio" name="visibility" className="accent-orange-500" />
          </label>
        </div>
      </div>
      
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 mt-4">
        <h2 className="text-[16px] font-bold mb-4">Engagement Settings</h2>
        <div className="space-y-4">
          <label className="flex items-center justify-between p-3 rounded-xl border border-gray-700">
            <div>
              <p className="text-[14px] font-semibold">Allow Comments</p>
              <p className="text-[12px] text-gray-400">Let others comment on this post</p>
            </div>
            <input type="checkbox" className="accent-orange-500" defaultChecked />
          </label>
          <label className="flex items-center justify-between p-3 rounded-xl border border-gray-700">
            <div>
              <p className="text-[14px] font-semibold">Enable Reposts</p>
              <p className="text-[12px] text-gray-400">Allow others to share this post</p>
            </div>
            <input type="checkbox" className="accent-orange-500" defaultChecked />
          </label>
          <label className="flex items-center justify-between p-3 rounded-xl border border-gray-700">
            <div>
              <p className="text-[14px] font-semibold">Boost Reach</p>
              <p className="text-[12px] text-gray-400">Increase visibility of this post</p>
            </div>
            <input type="checkbox" className="accent-orange-500" />
          </label>
          <label className="flex items-center justify-between p-3 rounded-xl border border-gray-700">
            <div>
              <p className="text-[14px] font-semibold">Enable Earnings</p>
              <p className="text-[12px] text-gray-400">Earn from interactions on this post</p>
            </div>
            <input type="checkbox" className="accent-orange-500" defaultChecked />
          </label>
        </div>
      </div>
      
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 mt-4">
        <h2 className="text-[16px] font-bold mb-4">Cross-Posting</h2>
        <div className="space-y-4">
          <label className="flex items-center justify-between p-3 rounded-xl border border-gray-700">
            <div>
              <p className="text-[14px] font-semibold">Post to Shorts</p>
              <p className="text-[12px] text-gray-400">Also publish as a short video</p>
            </div>
            <input type="checkbox" className="accent-orange-500" />
          </label>
          <label className="flex items-center justify-between p-3 rounded-xl border border-gray-700">
            <div>
              <p className="text-[14px] font-semibold">Post to Groups</p>
              <p className="text-[12px] text-gray-400">Share to your selected groups</p>
            </div>
            <input type="checkbox" className="accent-orange-500" />
          </label>
        </div>
      </div>
      
      <div className="mt-6 flex gap-3">
        <button className="flex-1 py-3 rounded-xl bg-gray-700 text-gray-100 text-[14px] font-bold">
          Cancel
        </button>
        <button className="flex-1 py-3 rounded-xl bg-orange-500 text-gray-900 text-[14px] font-bold">
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default PostPublishingSettingsPage;