import React, { lazy, Suspense } from 'react';
import LoadingSpinner from "../../components/LoadingSpinner";

// Lazy load GemPublicPage
const GemPublicPage = lazy(() => import('./GemPublicPage'));

const LazyGemPublicPage = (props) => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <GemPublicPage {...props} />
    </Suspense>
  );
};

export default LazyGemPublicPage;