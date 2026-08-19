import React, { useState, useEffect, useCallback } from 'react';
import { ApiService } from '../../services/ApiService';
import { electronAPI } from '../../preload';
import './FingerLuxScreen.css';

/**
 * FingerLux Screen - Luxury Services Booking
 * Features:
 * - Luxury services catalog
 * - Service booking
 * - Booking management
 * - VIP tier display
 * - Offline support
 */
const FingerLuxScreen = () => {
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [error, setError] = useState(null);
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedTab, setSelectedTab] = useState('services');
  const [selectedService, setSelectedService] = useState(null);
  const [isBooking, setIsBooking] = useState(false);

  // Booking form
  const [bookingForm, setBookingForm] = useState({
    date: '',
    time: '',
    guests: '1',
    specialRequests: ''
  });

  // Load data
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const isConnected = await ApiService.checkConnectivity();
      setIsOffline(!isConnected);

      const servicesResult = await ApiService.getLuxuryServices({ useCache: true });
      const bookingsResult = await ApiService.getLuxuryBookings({ useCache: true });

      if (servicesResult.success) {
        setServices(servicesResult.data || []);
      }

      if (bookingsResult.success) {
        setBookings(bookingsResult.data || []);
      }

      if (!servicesResult.success && !bookingsResult.success) {
        setError('Failed to load data');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle booking
  const handleBooking = async (service) => {
    setSelectedService(service);
    setSelectedTab('book');
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setIsBooking(true);

    try {
      const result = await ApiService.createLuxuryBooking({
        serviceId: selectedService.id,
        date: bookingForm.date,
        time: bookingForm.time,
        guests: parseInt(bookingForm.guests),
        specialRequests: bookingForm.specialRequests
      });

      if (result.success) {
        if (electronAPI?.showNotification) {
          electronAPI.showNotification({
            title: 'Booking Confirmed! 💎',
            body: `Your ${selectedService.name} booking is confirmed!`
          });
        }

        setBookingForm({
          date: '',
          time: '',
          guests: '1',
          specialRequests: ''
        });
        setSelectedService(null);
        setSelectedTab('bookings');
        await loadData();
      } else {
        setError(result.error || 'Failed to create booking');
      }
    } catch (err) {
      setError(err.message || 'Failed to create booking');
    } finally {
      setIsBooking(false);
    }
  };

  // Format amount
  const formatAmount = (amount) => {
    if (!amount) return '₦0.00';
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    const icons = {
      'Experiences': '🎭',
      'Transportation': '🚗',
      'Travel': '✈️',
      'Wellness': '💆',
      'Dining': '🍽️',
      'Lifestyle': '🛍️',
      'Accommodation': '🏨'
    };
    return icons[category] || '⭐';
  };

  // Render loading
  if (isLoading) {
    return (
      <div className="fingerlux-screen loading-screen">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading luxury services...</p>
        </div>
      </div>
    );
  }

  // Render error
  if (error && services.length === 0) {
    return (
      <div className="fingerlux-screen error-screen">
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <h2>Failed to Load</h2>
          <p className="error-message">{error}</p>
          <button onClick={loadData} className="retry-button">
            <span>🔄</span> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fingerlux-screen">
      {/* Offline Banner */}
      {isOffline && (
        <div className="offline-banner">
          <span>📴</span>
          <span>You are offline. Showing cached services.</span>
        </div>
      )}

      {/* Header */}
      <div className="fingerlux-header">
        <div className="header-content">
          <h1>FingerLux</h1>
          <p className="tagline">Exclusive Luxury Services</p>
        </div>
        <button onClick={loadData} className="refresh-button" title="Refresh">
          <span>🔄</span>
        </button>
      </div>

      {/* VIP Status Card */}
      <div className="vip-status-card">
        <div className="vip-badge">💎 VIP Member</div>
        <p>Enjoy exclusive access to premium luxury services</p>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button
          className={`tab ${selectedTab === 'services' ? 'active' : ''}`}
          onClick={() => setSelectedTab('services')}
        >
          Services
        </button>
        <button
          className={`tab ${selectedTab === 'book' ? 'active' : ''}`}
          onClick={() => setSelectedTab('book')}
          disabled={!selectedService}
        >
          Book Now
        </button>
        <button
          className={`tab ${selectedTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setSelectedTab('bookings')}
        >
          My Bookings
        </button>
      </div>

      {/* Content */}
      <div className="tab-content">
        {selectedTab === 'services' ? (
          /* Services Catalog */}
          <div className="services-catalog">
            {services.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">💎</div>
                <h3>No Services Available</h3>
                <p>Check back later for exclusive offerings</p>
              </div>
            ) : (
              <div className="services-grid">
                {services.map((service) => (
                  <div key={service.id} className="service-card">
                    <div className="service-image">
                      {service.image_urls?.[0] ? (
                        <img src={service.image_urls[0]} alt={service.name} />
                      ) : (
                        <div className="image-placeholder">
                          {getCategoryIcon(service.category)}
                        </div>
                      )}
                      <div className="service-category">
                        {getCategoryIcon(service.category)} {service.category}
                      </div>
                    </div>
                    <div className="service-details">
                      <h3 className="service-name">{service.name}</h3>
                      <p className="service-description">{service.description}</p>
                      <div className="service-meta">
                        <span className="service-price">
                          {formatAmount(service.price)}
                        </span>
                        <span className="service-duration">
                          ⏱️ {service.duration_minutes} min
                        </span>
                      </div>
                      <div className="service-amenities">
                        {service.amenities?.slice(0, 3).map((amenity, idx) => (
                          <span key={idx} className="amenity-tag">{amenity}</span>
                        ))}
                      </div>
                      <button
                        onClick={() => handleBooking(service)}
                        className="book-now-button"
                      >
                        Book This Service
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : selectedTab === 'book' ? (
          /* Booking Form */}
          <div className="booking-form-container">
            {selectedService ? (
              <form onSubmit={handleSubmitBooking} className="booking-form">
                <div className="selected-service-header">
                  <h2>Book {selectedService.name}</h2>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedService(null);
                      setSelectedTab('services');
                    }}
                    className="change-service-button"
                  >
                    Change Service
                  </button>
                </div>

                <div className="service-summary">
                  <div className="summary-row">
                    <span>Price:</span>
                    <strong>{formatAmount(selectedService.price)}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Duration:</span>
                    <strong>{selectedService.duration_minutes} minutes</strong>
                  </div>
                  <div className="summary-row">
                    <span>Max Guests:</span>
                    <strong>{selectedService.max_guests}</strong>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="date">Date</label>
                  <input
                    type="date"
                    id="date"
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="time">Time</label>
                  <input
                    type="time"
                    id="time"
                    value={bookingForm.time}
                    onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="guests">Number of Guests</label>
                  <input
                    type="number"
                    id="guests"
                    value={bookingForm.guests}
                    onChange={(e) => setBookingForm({ ...bookingForm, guests: e.target.value })}
                    min="1"
                    max={selectedService.max_guests}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="specialRequests">Special Requests</label>
                  <textarea
                    id="specialRequests"
                    value={bookingForm.specialRequests}
                    onChange={(e) => setBookingForm({ ...bookingForm, specialRequests: e.target.value })}
                    placeholder="Any special requirements or preferences..."
                    rows="4"
                  />
                </div>

                <div className="booking-total">
                  <div className="total-row">
                    <span>Total:</span>
                    <strong className="total-amount">{formatAmount(selectedService.price)}</strong>
                  </div>
                </div>

                <button
                  type="submit"
                  className="submit-booking-button"
                  disabled={isBooking}
                >
                  {isBooking ? (
                    <>
                      <div className="button-spinner"></div>
                      Confirming Booking...
                    </>
                  ) : (
                    <>
                      <span>💎</span> Confirm Luxury Booking
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="no-service-selected">
                <div className="empty-icon">💎</div>
                <h3>No Service Selected</h3>
                <p>Please select a service from the catalog first</p>
                <button onClick={() => setSelectedTab('services')} className="browse-services-button">
                  Browse Services
                </button>
              </div>
            )}
          </div>
        ) : (
          /* My Bookings */}
          <div className="my-bookings">
            {bookings.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📅</div>
                <h3>No Bookings Yet</h3>
                <p>Book your first luxury experience</p>
                <button onClick={() => setSelectedTab('services')} className="action-button">
                  Browse Services
                </button>
              </div>
            ) : (
              <div className="bookings-list">
                {bookings.map((booking) => (
                  <div key={booking.id} className="booking-card">
                    <div className="booking-header">
                      <h4>{booking.service_name}</h4>
                      <span className={`status-badge status-${booking.status}`}>
                        {booking.status?.toUpperCase()}
                      </span>
                    </div>
                    <div className="booking-details">
                      <div className="detail-row">
                        <span className="label">📅 Date:</span>
                        <span className="value">{formatDate(booking.booking_date)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">⏰ Time:</span>
                        <span className="value">{booking.booking_time}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">👥 Guests:</span>
                        <span className="value">{booking.guest_count}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">💰 Amount:</span>
                        <span className="value amount">{formatAmount(booking.total_amount)}</span>
                      </div>
                      {booking.special_requests && (
                        <div className="detail-row">
                          <span className="label">📝 Special Requests:</span>
                          <span className="value">{booking.special_requests}</span>
                        </div>
                      )}
                    </div>
                    {booking.status === 'pending' && (
                      <div className="booking-actions">
                        <button className="cancel-booking-button">
                          Cancel Booking
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Toast */}
      {error && (
        <div className="error-toast">
          <span>⚠️</span>
          <span>{error}</span>
          <button onClick={() => setError(null)} className="toast-close">✕</button>
        </div>
      )}
    </div>
  );
};

export default FingerLuxScreen;
