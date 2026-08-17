import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export interface Gem {id: number;
  title: string;
  description?: string;
  author: string;
  price: string;
  image: string;
  tags: string[];
  likes: number;
  views: number;
  category: string;
  isLiked: boolean;
  createdAt: string;
}

export const useGems = () => {
  const [gems, setGems] = React.useState<Gem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchGems = async () => {
    try {
      setLoading(true);
      const response = await api.get("/marketplace/gems");

      if (response.data) {
        const transformedGems = response.data.map((
  gem: any) => ({id: gem.id,
  title: gem.title,
  description: gem.description,
  author: gem.seller_membername,
  price: `$${parseFloat(gem.price).toFixed(2)}`,
image:
            gem.image_url ||
            "https://via.placeholder.com/300x200?text=Gem+Image",
tags: gem.tags || [],
likes: gem.like_count || 0,
views: gem.view_count || 0,
category: gem.category,
isLiked: gem.is_liked || false,
createdAt: gem.created_at
        }));

        setGems(transformedGems);
        setError(null);
      }
    } catch (err) {
      setError("An error occurred while fetching gems");
      console.error("Error fetching gems:", err);
    } finally {
      setLoading(false);
    }
  };

  const likeGem = async (
  gemId: number) => {
    try {
      const response = await api.post(`/marketplace/gems/${gemId}/like`);

      if (response.data) {
        setGems((prevGems) =>
          prevGems.map((gem) =>
            gem.id === gemId
              ? {
                  ...gem,
likes: response.data.like_count,
isLiked: !gem.isLiked
                }
              : gem,
          ),
        );
        return {success: true,
  message: response.data.message || "Successfully liked gem" };
      }
      return {success: false,
  message: "Failed to like gem" };
    } catch (err) {
      console.error("Error liking gem:", err);
      return {success: false,
  message: "Failed to like gem" };
    }
  };

  const sendGift = async (
  gemId: number,
amount: string) => {
    try {
      const response = await api.post(`/marketplace/gems/${gemId}/gift`, {amount: parseFloat(amount)
      });

      if (response.data) {
        return {success: true,
  message: response.data.message || "Successfully sent gift" };
      }
      return {success: false,
  message: "Failed to send gift" };
    } catch (err) {
      console.error("Error sending gift:", err);
      return {success: false,
  message: "Failed to send gift" };
    }
  };

  const createPaylink = async (
  gemId: number,
amount: string) => {
    try {
      const response = await api.post(`/marketplace/gems/${gemId}/paylink`, {amount: parseFloat(amount)
      });

      if (response.data) {
        return {success: true,
  message: response.data.message || "Successfully created paylink",
  paylink: response.data.paylink
        };
      }
      return {success: false,
  message: "Failed to create paylink" };
    } catch (err) {
      console.error("Error creating paylink:", err);
      return {success: false,
  message: "Failed to create paylink" };
    }
  };

  React.useEffect(() => {
    fetchGems();
  }, []);

  const refreshGems = () => {
    fetchGems();
  };

  return {
    gems,
    loading,
    error,
    refreshGems,
    likeGem,
    sendGift,
    createPaylink
  };
};