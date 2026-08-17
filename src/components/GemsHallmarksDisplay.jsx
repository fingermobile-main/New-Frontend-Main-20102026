import React, { useState, useEffect } from 'react';
import './GemsHallmarksDisplay.css';

const GemsHallmarksDisplay = ({ userId }) => {
  const [gems, setGems] = useState(null);
  const [hallmarks, setHallmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user's gems
        const gemsResponse = await fetch(`/api/gems/total`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (gemsResponse.ok) {
          const gemsData = await gemsResponse.json();
          setGems(gemsData.data.totalGems);
        }

        // Fetch user's hallmarks
        const hallmarksResponse = await fetch(`/api/hallmarks/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (hallmarksResponse.ok) {
          const hallmarksData = await hallmarksResponse.json();
          setHallmarks(hallmarksData.data);
        }
      } catch (err) {
        setError('Failed to load user data');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  if (loading) {
    return <div className="gems-hallmarks-loading">Loading your achievements...</div>;
  }

  if (error) {
    return <div className="gems-hallmarks-error">{error}</div>;
  }

  // Group hallmarks by rarity for display
  const groupedHallmarks = hallmarks.reduce((acc, uh) => {
    const { hallmark } = uh;
    if (!acc[hallmark.rarity]) {
      acc[hallmark.rarity] = [];
    }
    acc[hallmark.rarity].push(hallmark);
    return acc;
  }, {});

  const rarityOrder = ['legendary', 'epic', 'rare', 'uncommon', 'common'];
  const orderedHallmarks = rarityOrder.flatMap(rarity => 
    groupedHallmarks[rarity] ? groupedHallmarks[rarity].map(h => ({ ...h, rarity })) : []
  );

  return (
    <div className="gems-hallmarks-container">
      <div className="gems-section">
        <h3>Your Gems</h3>
        <div className="gems-count">
          <span className="gem-icon">💎</span>
          <span className="gem-number">{gems || 0}</span>
        </div>
        <p>Total Gems earned through engagement</p>
      </div>

      <div className="hallmarks-section">
        <h3>Your Hallmarks</h3>
        {orderedHallmarks.length > 0 ? (
          <div className="hallmarks-grid">
            {orderedHallmarks.map((hallmark, index) => (
              <div 
                key={index} 
                className={`hallmark-card rarity-${hallmark.rarity}`}
                title={`${hallmark.name}: ${hallmark.description}`}
              >
                <div className="hallmark-icon">🏆</div>
                <div className="hallmark-info">
                  <h4>{hallmark.name}</h4>
                  <p>{hallmark.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No hallmarks yet. Keep engaging to earn your first!</p>
        )}
      </div>
    </div>
  );
};

export default GemsHallmarksDisplay;