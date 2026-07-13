import React from 'react';
import { useState } from 'react';

const ProfilePage = () => {
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Software developer interested in modern web technologies',
    avatar: '/path/to/avatar.jpg'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    console.info('Profile updated:', profileData);
    alert('Profile updated successfully!');
  };

  return (
    <div className="profile-page">
      <h1>User Profile</h1>
      <div className="profile-info">
        <div className="avatar-section">
          <img src={profileData.avatar} alt="Avatar"  />
          <button>Change Avatar</button>
        </div>
        
        <form onSubmit={handleSubmit} className="profile-form">
          <div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={profileData.name}
              onChange={handleInputChange}
              required />
          </div>
          
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profileData.email}
              onChange={handleInputChange}
              required />
          </div>
          
          <div>
            <label htmlFor="bio">Bio:</label>
            <textarea
              id="bio"
              name="bio"
              value={profileData.bio}
              onChange={handleInputChange}
              rows={4}
            ></textarea>
          </div>
          
          <button type="submit">Update Profile</button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;