import React, { useState, useEffect, useCallback } from 'react';
import { ApiService } from '../../services/ApiService';
import './ServiceScreens.css';

/**
 * GameOn Screen - Sports & Events Platform
 */
export const GameOnScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedTab, setSelectedTab] = useState('events');

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const isConnected = await ApiService.checkConnectivity();
      setIsOffline(!isConnected);

      const [eventsResult, bookingsResult] = await Promise.all([
        ApiService.getEvents({ useCache: true }),
        ApiService.getEventBookings({ useCache: true })
      ]);

      if (eventsResult.success) setEvents(eventsResult.data || []);
      if (bookingsResult.success) setBookings(bookingsResult.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleBookTicket = async (eventId) => {
    try {
      const result = await ApiService.bookEventTickets({
        eventId,
        ticketType: 'VIP',
        quantity: 2
      });

      if (result.success) {
        await loadData();
        setSelectedTab('bookings');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return <div className="loading-screen"><div className="loading-spinner"><div className="spinner"></div><p>Loading events...</p></div></div>;
  }

  return (
    <div className="gameon-screen">
      {isOffline && <div className="offline-banner"><span>📴</span> You are offline</div>}
      
      <div className="service-header">
        <h1>🏆 GameOn</h1>
        <button onClick={loadData} className="refresh-button">🔄</button>
      </div>

      <div className="tabs-container">
        <button className={`tab ${selectedTab === 'events' ? 'active' : ''}`} onClick={() => setSelectedTab('events')}>Events</button>
        <button className={`tab ${selectedTab === 'bookings' ? 'active' : ''}`} onClick={() => setSelectedTab('bookings')}>My Tickets</button>
      </div>

      <div className="tab-content">
        {selectedTab === 'events' ? (
          <div className="events-list">
            {events.length === 0 ? (
              <div className="empty-state"><div className="empty-icon">🏆</div><h3>No Events</h3><p>Check back later</p></div>
            ) : (
              events.map((event) => (
                <div key={event.id} className="event-card">
                  <div className="event-header">
                    <h3>{event.name}</h3>
                    <span className="sport-tag">{event.sport}</span>
                  </div>
                  <p className="event-details">📅 {event.event_date} | 📍 {event.venue}</p>
                  <p className="event-description">{event.description}</p>
                  <div className="event-footer">
                    <span className="event-price">From {event.price}</span>
                    <button onClick={() => handleBookTicket(event.id)} className="book-ticket-button">Book Tickets</button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.length === 0 ? (
              <div className="empty-state"><div className="empty-icon">🎫</div><h3>No Bookings</h3><button onClick={() => setSelectedTab('events')} className="action-button">Browse Events</button></div>
            ) : (
              bookings.map((booking) => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-header">
                    <h4>{booking.event_name}</h4>
                    <span className={`status-badge status-${booking.status}`}>{booking.status}</span>
                  </div>
                  <div className="booking-details">
                    <div className="detail-row"><span>Ticket Type:</span><strong>{booking.ticket_type}</strong></div>
                    <div className="detail-row"><span>Quantity:</span><strong>{booking.quantity}</strong></div>
                    <div className="detail-row"><span>Total:</span><strong className="amount">{booking.total_amount}</strong></div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      {error && <div className="error-toast"><span>⚠️</span><span>{error}</span><button onClick={() => setError(null)} className="toast-close">✕</button></div>}
    </div>
  );
};

/**
 * NYSC Screen - National Youth Service Corps
 */
export const NyscScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [activities, setActivities] = useState([]);
  const [allowance, setAllowance] = useState([]);
  const [selectedTab, setSelectedTab] = useState('profile');

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const isConnected = await ApiService.checkConnectivity();
      setIsOffline(!isConnected);

      const [profileResult, activitiesResult, allowanceResult] = await Promise.all([
        ApiService.getNyscProfile({ useCache: true }),
        ApiService.getNyscActivities({ useCache: true }),
        ApiService.getNyscAllowance({ useCache: true })
      ]);

      if (profileResult.success) setProfile(profileResult.data);
      if (activitiesResult.success) setActivities(activitiesResult.data || []);
      if (allowanceResult.success) setAllowance(allowanceResult.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (isLoading) {
    return <div className="loading-screen"><div className="loading-spinner"><div className="spinner"></div><p>Loading NYSC portal...</p></div></div>;
  }

  return (
    <div className="nysc-screen">
      {isOffline && <div className="offline-banner"><span>📴</span> You are offline</div>}
      
      <div className="service-header">
        <h1>🎓 NYSC Portal</h1>
        <button onClick={loadData} className="refresh-button">🔄</button>
      </div>

      <div className="tabs-container">
        <button className={`tab ${selectedTab === 'profile' ? 'active' : ''}`} onClick={() => setSelectedTab('profile')}>Profile</button>
        <button className={`tab ${selectedTab === 'activities' ? 'active' : ''}`} onClick={() => setSelectedTab('activities')}>Activities</button>
        <button className={`tab ${selectedTab === 'allowance' ? 'active' : ''}`} onClick={() => setSelectedTab('allowance')}>Allowance</button>
      </div>

      <div className="tab-content">
        {selectedTab === 'profile' && profile && (
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">🎓</div>
              <h2>{profile.callup_number}</h2>
              <span className="status-badge">{profile.status}</span>
            </div>
            <div className="profile-details">
              <div className="detail-row"><span>State Code:</span><strong>{profile.state_code}</strong></div>
              <div className="detail-row"><span>PPA:</span><strong>{profile.ppa_name}</strong></div>
            </div>
          </div>
        )}

        {selectedTab === 'activities' && (
          <div className="activities-list">
            {activities.length === 0 ? (
              <div className="empty-state"><div className="empty-icon">📝</div><h3>No Activities</h3><p>No weekly activities submitted yet</p></div>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="activity-card">
                  <h4>{activity.activity_type}</h4>
                  <p>{activity.description}</p>
                  <div className="activity-meta">
                    <span>⏱️ {activity.hours} hours</span>
                    <span className={`status-badge status-${activity.status}`}>{activity.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {selectedTab === 'allowance' && (
          <div className="allowance-list">
            {allowance.length === 0 ? (
              <div className="empty-state"><div className="empty-icon">💰</div><h3>No Allowance Records</h3><p>Allowance payments will appear here</p></div>
            ) : (
              allowance.map((payment) => (
                <div key={payment.id} className="allowance-card">
                  <div className="allowance-header">
                    <h4>Monthly Allowance</h4>
                    <span className="amount">{payment.amount}</span>
                  </div>
                  <div className="allowance-date">Paid: {new Date(payment.payment_date).toLocaleDateString()}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      {error && <div className="error-toast"><span>⚠️</span><span>{error}</span><button onClick={() => setError(null)} className="toast-close">✕</button></div>}
    </div>
  );
};

/**
 * Lumina Gallery Screen - Media Processing
 */
export const LuminaScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [error, setError] = useState(null);
  const [assets, setAssets] = useState([]);
  const [selectedTab, setSelectedTab] = useState('gallery');

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const isConnected = await ApiService.checkConnectivity();
      setIsOffline(!isConnected);

      const result = await ApiService.getLuminaAssets({ page: 1, limit: 20, useCache: true });
      if (result.success) setAssets(result.data?.assets || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (isLoading) {
    return <div className="loading-screen"><div className="loading-spinner"><div className="spinner"></div><p>Loading gallery...</p></div></div>;
  }

  return (
    <div className="lumina-screen">
      {isOffline && <div className="offline-banner"><span>📴</span> You are offline</div>}
      
      <div className="service-header">
        <h1>🖼️ Lumina Gallery</h1>
        <button onClick={loadData} className="refresh-button">🔄</button>
      </div>

      <div className="tabs-container">
        <button className={`tab ${selectedTab === 'gallery' ? 'active' : ''}`} onClick={() => setSelectedTab('gallery')}>Gallery</button>
        <button className={`tab ${selectedTab === 'upload' ? 'active' : ''}`} onClick={() => setSelectedTab('upload')}>Upload</button>
      </div>

      <div className="tab-content">
        {selectedTab === 'gallery' ? (
          <div className="gallery-grid">
            {assets.length === 0 ? (
              <div className="empty-state"><div className="empty-icon">🖼️</div><h3>No Media Yet</h3><button onClick={() => setSelectedTab('upload')} className="action-button">Upload Media</button></div>
            ) : (
              assets.map((asset) => (
                <div key={asset.id} className="gallery-item">
                  {asset.mime_type?.startsWith('video/') ? (
                    <div className="video-placeholder">🎬</div>
                  ) : (
                    <div className="image-placeholder">🖼️</div>
                  )}
                  <div className="asset-info">
                    <h4>{asset.title || 'Untitled'}</h4>
                    <span className="asset-date">{new Date(asset.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="upload-container">
            <div className="upload-area">
              <div className="upload-icon">📁</div>
              <h3>Drop media here or click to upload</h3>
              <p>Supports: Images (JPG, PNG, WebP) and Videos (MP4, WebM)</p>
              <button className="upload-button">Select Files</button>
            </div>
          </div>
        )}
      </div>
      {error && <div className="error-toast"><span>⚠️</span><span>{error}</span><button onClick={() => setError(null)} className="toast-close">✕</button></div>}
    </div>
  );
};

export default { GameOnScreen, NyscScreen, LuminaScreen };
