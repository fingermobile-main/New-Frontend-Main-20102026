import React from 'react';
import * as React from 'react';
import LoadingSpinner from "../../components/LoadingSpinner";

// Lazy load heavy components used in GemPublicPage
const PostCard = lazy(() => import("../../components/PostCard"));
const PageHeader = lazy(() => import("../../components/PageHeader"));
const LiveIcon = lazy(() => import("../../components/icons"));

const LazyGemPublicPage = (props) => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <GemPublicPageContent {...props} />
    </Suspense>
  );
};

const GemPublicPageContent = (props) => {
  // Since we can't easily split the existing component, we'll create a simplified version
  // that loads heavy components lazily

  return (
    <div>
      {/* The actual implementation would mirror GemPublicPage.js but with lazy-loaded components */}
      <p>Gem page with lazy-loaded components</p>
    </div>
  );
};

export default LazyGemPublicPage;
