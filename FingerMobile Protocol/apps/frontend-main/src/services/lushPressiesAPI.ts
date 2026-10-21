/**
 * Lush Pressies — Unified Frontend API Client
 * Wires the frontend directly to the 8 standalone LushPressies microservices:
 * Roll/Swipe, Chat, Verification, Analytics, Geo, Subscriptions, Commit, and Gamification.
 * Date: October 6, 2026 - Phase 2 Ecosystem
 */

import axios from 'axios';

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  process.env.REACT_APP_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5001/api';

const api = axios.create({
  baseURL: `${API_BASE_URL}/lushpressies`,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Swipe / Roll APIs ---
export const rollAction = async (targetUserId: number, action: 'like' | 'skip') => {
  const res = await api.post('/swipe/roll', { targetUserId, action });
  return res.data;
};

export const reverseRoll = async () => {
  const res = await api.post('/swipe/reverse-roll');
  return res.data;
};

export const getDiscoverProfiles = async (params?: { membershipCategory?: string; country?: string; limit?: number }) => {
  const res = await api.get('/swipe/discover', { params });
  return res.data;
};

export const getSwipeStats = async (userId: string | number) => {
  const res = await api.get('/swipe/stats', { params: { userId } });
  return res.data;
};

// --- Chat & Messaging APIs ---
export const sendFirstContact = async (recipientId: number, message: string) => {
  const res = await api.post('/chat/first-contact', { recipientId, message });
  return res.data;
};

export const getConversations = async (userId: string | number) => {
  const res = await api.get('/chat/conversations', { params: { userId } });
  return res.data;
};

export const getChatMessages = async (partnerId: number) => {
  const res = await api.get(`/chat/messages/${partnerId}`);
  return res.data;
};

// --- Verification & PIN APIs ---
export const generatePin = async (receiverId: number) => {
  const res = await api.post('/verification/pin/generate', { receiverId });
  return res.data;
};

export const verifyPin = async (senderId: number, pinCode: string) => {
  const res = await api.post('/verification/pin/verify', { senderId, pinCode });
  return res.data;
};

export const getVerificationStatus = async (userId: string | number) => {
  const res = await api.get(`/verification/status/${userId}`);
  return res.data;
};

// --- Analytics APIs ---
export const getProfileAnalytics = async (userId: string | number) => {
  const res = await api.get('/analytics/profile', { params: { userId } });
  return res.data;
};

export const recordProfileView = async (profileId: number, source: string) => {
  const res = await api.post('/analytics/view', { profileId, source });
  return res.data;
};

export const getUgcSplits = async (creatorId: string | number) => {
  const res = await api.get('/analytics/ugc-splits', { params: { creatorId } });
  return res.data;
};

// --- Geo & Location APIs ---
export const checkinGps = async (latitude: number, longitude: number, venueName?: string) => {
  const res = await api.post('/geo/checkin', { latitude, longitude, venueName });
  return res.data;
};

export const getNearbyMembers = async (latitude: number, longitude: number, radiusKm = 10) => {
  const res = await api.get('/geo/nearby', { params: { latitude, longitude, radiusKm } });
  return res.data;
};

export const getRegionalHeatmaps = async () => {
  const res = await api.get('/geo/heatmaps');
  return res.data;
};

// --- Subscriptions APIs ---
export const getSubscriptionPlans = async () => {
  const res = await api.get('/subscriptions/plans');
  return res.data;
};

export const getCurrentSubscription = async (userId: string | number) => {
  const res = await api.get('/subscriptions/current', { params: { userId } });
  return res.data;
};

export const subscribeTier = async (planId: string) => {
  const res = await api.post('/subscriptions/subscribe', { planId });
  return res.data;
};

export const activateRadiateBoost = async (tier = 'radiate') => {
  const res = await api.post('/subscriptions/radiate', { tier });
  return res.data;
};

// --- Commit & Exclusivity APIs ---
export const checkCommitEligibility = async (partnerId: number) => {
  const res = await api.get(`/commit/eligibility/${partnerId}`);
  return res.data;
};

export const requestCommitment = async (partnerId: number) => {
  const res = await api.post('/commit/request', { partnerId });
  return res.data;
};

// --- Gamification & Compatibility APIs ---
export const getLapidaireQuestions = async () => {
  const res = await api.get('/gamification/lapidaires');
  return res.data;
};

export const submitLapidaireAnswer = async (questionId: string, answerText: string, selectedOptionIndex?: number) => {
  const res = await api.post('/gamification/lapidaires/answer', { questionId, answerText, selectedOptionIndex });
  return res.data;
};

export const getCompatibilityScore = async (targetUserId: number) => {
  const res = await api.get(`/gamification/compatibility/${targetUserId}`);
  return res.data;
};

// --- Gifting & Escrow APIs ---
export const sendGift = async (data: {
  recipientId: number | string;
  giftTitle: string;
  cardMessage?: string;
  giftValueGems: number | string;
  senderId?: number | string;
}) => {
  const res = await api.post('/gifts/send', data);
  return res.data;
};

export const getVirtualGiftShop = async (category?: string) => {
  const res = await api.get('/gifts/shop', { params: { category } });
  return res.data;
};

export const sendLuxuryGift = async (data: {
  recipientId: number | string;
  giftId: string;
  store: 'ownit' | 'flamingo';
  deliveryMethod?: string;
  personalNote?: string;
}) => {
  const res = await api.post('/encore/send-luxury-gift', data);
  return res.data;
};

