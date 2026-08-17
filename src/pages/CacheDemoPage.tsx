import React, {} from 'react';
import { useAppContext } from "../contexts/AppContext";
import { useCachedData, usePaginatedCachedData } from '../hooks/useCachedData';
import gemsService from '../services/gemsService';
import { default as CacheDemo } from '../components/CacheDemo';

const CacheDemoPage: React.FC = () => {
  return (
    <div>
      <h1>Cache Demo Page</h1>
      <p>Placeholder for cache demo page</p>
    </div>
  );
};

export default CacheDemoPage;
