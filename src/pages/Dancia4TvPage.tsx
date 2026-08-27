import React, { useEffect, useState } from 'react';
/*
 * FingerMobile Protocol™ - Dancia4Tv Streaming Platform Page
 * Copyright © 2025 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms,
 * which are the sole and exclusive intellectual property of Mbah Israel Obinna.
 *
 * Unauthorized copying, distribution, or modification of this code is strictly prohibited. All laws do and will apply.
 */

import { useAppContext } from "../contexts/AppContext";
import { useDancia4TvData } from '../hooks/useDancia4Tv';
import { DanciaVideo as Video, DanciaSubscriptionPlan as SubscriptionPlan, DanciaMember as Member } from '../types/dancia4tv';
import "../styles/Dancia4TvPage.css";
import Dancia4TvHeader from '../components/Dancia4TvHeader';
import Dancia4TvFooter from '../components/Dancia4TvFooter';
import Dancia4TvControls from '../components/Dancia4TvControls';
import Dancia4TvPlaylist from '../components/Dancia4TvPlaylist';
import DanciaAppSettings from '../components/DanciaAppSettings';
import DisplaySettings, { DisplayMode, SortCriteria } from '../components/DisplaySettings';
import { SortAsc } from "lucide-react";
import apiService, { ApiService } from '../services/apiService';


const Dancia4TvPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4">
      <h1 className="text-2xl font-bold">Dancia4TV</h1>
      <p>This is the dancia4tv page.</p>
    </div>
  );
};

export default Dancia4TvPage;
