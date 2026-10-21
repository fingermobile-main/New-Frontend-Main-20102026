import { Link} from 'react-router-dom';
import React, {} from 'react';
/*
 * FingerMobile Protocol™ - Community Pages Component
 * Copyright © 2025 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms,
 * which are the sole and exclusive intellectual property of Mbah Israel Obinna.
 *
 * Unauthorized copying, distribution, or modification of this code is strictly prohibited. All laws do and will apply.
 */



const CommunityPages: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Community Pages</h1>
      <p className="mb-4">This is a directory of Hallmark-related pages for testing and navigation.</p>
      <ul className="space-y-2">
        <li>
          <Link to="/hallmark" className="text-blue-600 hover:underline">Hallmark Achievements (Static)</Link>
        </li>
        <li>
          <Link to="/hallmarks" className="text-blue-600 hover:underline">Hallmarks Feed (Dynamic)</Link>
        </li>
        <li>
          <Link to="/hallmark/create" className="text-blue-600 hover:underline">Create Hallmark</Link>
        </li>
        <li>
          <Link to="/hallmark/1" className="text-blue-600 hover:underline">Public Hallmark View (Example)</Link>
        </li>
        <li>
          <Link to="/hallmark/manage/1" className="text-blue-600 hover:underline">Manage My Hallmark (Example)</Link>
        </li>
        <li>
          <Link to="/dashboard/moderation/hallmarks" className="text-blue-600 hover:underline">Hallmark Approval Queue (Admin)</Link>
        </li>
        <li>
          <Link to="/unified-dashboard" className="text-blue-600 hover:underline">Community Management Dashboard</Link>
        </li>
      </ul>
    </div>
  );
};

export default CommunityPages;
