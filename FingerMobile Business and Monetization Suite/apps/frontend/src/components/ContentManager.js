/*
 * FingerMobile Protocol™ - Content Manager Component
 * Copyright © 2025 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms,
 * which are the sole and exclusive intellectual property of Mbah Israel Obinna.
 *
 * Unauthorized copying, distribution, or modification of this code is strictly prohibited. All laws do and will apply.
 */

import React, { useState, useEffect } from 'react';
import contentManagerService from '../services/contentManagerService';

const ContentManager = ({ userId }) => {
  const [comments, setComments] = useState([]);
  const [mentions, setMentions] = useState([]);
  const [follows, setFollows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [commentsRes, mentionsRes, followsRes] = await Promise.all([
          contentManagerService.getComments(userId),
          contentManagerService.getMentions(userId),
          contentManagerService.getFollows(userId)
        ]);

        if (commentsRes.success) setComments(commentsRes.data);
        if (mentionsRes.success) setMentions(mentionsRes.data);
        if (followsRes.success) setFollows(followsRes.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  if (loading) return <div>Loading content manager...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="content-manager">
      <h2>Content Manager</h2>
      
      <section className="comments-section">
        <h3>Comments ({comments.length})</h3>
        <div className="comments-list">
          {comments.map(comment => (
            <div key={comment.id} className="comment-item">
              <p><strong>{comment.username}:</strong> {comment.comment_text}</p>
              <p><em>On content:</em> {comment.content_title}</p>
              {comment.response_status === 'pending' ? (
                <span className="status pending">Not responded</span>
              ) : (
                <span className="status responded">Responded</span>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mentions-section">
        <h3>Mentions ({mentions.length})</h3>
        <div className="mentions-list">
          {mentions.map(mention => (
            <div key={mention.id} className="mention-item">
              <p><strong>{mention.username} mentioned you</strong> in "{mention.content_title}"</p>
              <p>{mention.mention_text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="follows-section">
        <h3>Follows ({follows.length})</h3>
        <div className="follows-list">
          {follows.map(follow => (
            <div key={follow.id} className="follow-item">
              <p><strong>{follow.username}</strong> followed you</p>
              <p>Since: {new Date(follow.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ContentManager;