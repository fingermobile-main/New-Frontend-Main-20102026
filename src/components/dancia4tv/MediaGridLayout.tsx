import React, {  useEffect  } from 'react';
import { useDancia4Tv } from '../../contexts/Dancia4TvProvider';
import type { DanciaVideo } from '../../types/dancia4tv';

interface MediaGridLayoutProps {
  memberId?: string;
  onSelectVideo?: (video: DanciaVideo) => void;
}

export const MediaGridLayout: React.FC<MediaGridLayoutProps> = ({
  memberId,
  onSelectVideo
}) => {
  const { recommendations, loading, error, loadRecommendations, setCurrentVideo } = useDancia4Tv();

  useEffect(() => {
    if (memberId) {
      loadRecommendations(memberId);
    }
  }, [memberId, loadRecommendations]);

  const handleVideoClick = (video: DanciaVideo) => {
    setCurrentVideo(video);
    if (onSelectVideo) onSelectVideo(video);
  };

  if (loading) return <div className="loading-grid-skeleton">Loading videos...</div>;
  if (error) return <div className="error-alert-banner">{error}</div>;

  return (
    <section className="media-grid-container">
      <h2 className="grid-heading">Recommended For You</h2>
      <div className="media-responsive-grid">
        {recommendations.map((video) => (
          <div
            key={video.videoID}
            className="video-item-card"
            onClick={() => handleVideoClick(video)} role="button" tabIndex={0}
          >
            <div className="video-card-thumbnail-placeholder">
              <span className="resolution-badge">{video.resolution}</span>
            </div>
            <div className="video-card-metadata">
              <h4>{video.title}</h4>
              <p>{video.description}</p>
              <div className="card-footer-metrics">
                <span>Genre: {video.genre}</span>
                <span>★ {video.engagementScore.toFixed(1)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
