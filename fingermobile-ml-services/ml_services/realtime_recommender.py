import asyncio
import json
import time
import random
from collections import defaultdict, deque
from datetime import datetime, timedelta
import threading
from typing import Dict, List, Tuple

class RealTimeRecommender:
    def __init__(self, window_size_minutes=30):
        """
        Initialize real-time recommender with a time window for recent activity tracking
        
        Args:
            window_size_minutes (int): Size of the time window to consider for recent activity
        """
        self.window_size = timedelta(minutes=window_size_minutes)
        self.member_activities = defaultdict(deque)  # Store recent member activities
        self.item_popularity = defaultdict(int)    # Track item popularity
        self.member_profiles = defaultdict(dict)     # Store member preferences
        self.recommendation_cache = {}             # Cache for recommendations
        self.cache_expiry = timedelta(minutes=5)   # Cache expiry time
        
    def record_member_activity(self, member_id: int, item_id: int, activity_type: str, timestamp: datetime = None):
        """
        Record member activity for real-time recommendation updates
        
        Args:
            member_id (int): member identifier
            item_id (int): Item identifier
            activity_type (str): Type of activity (view, like, share, purchase, etc.)
            timestamp (datetime): Time of activity (defaults to current time)
        """
        if timestamp is None:
            timestamp = datetime.now()
            
        # Add activity to member's history
        activity = {
            'item_id': item_id,
            'activity_type': activity_type,
            'timestamp': timestamp
        }
        
        self.member_activities[member_id].append(activity)
        
        # Update item popularity
        self.item_popularity[item_id] += 1
        
        # Clean old activities outside the window
        self._clean_old_activities(member_id, timestamp)
        
        # Update member profile
        self._update_member_profile(member_id, item_id, activity_type)
        
        # Invalidate cache for this member
        if member_id in self.recommendation_cache:
            del self.recommendation_cache[member_id]
    
    def _clean_old_activities(self, member_id: int, current_time: datetime):
        """
        Remove activities older than the window size
        
        Args:
            member_id (int): member identifier
            current_time (datetime): Current timestamp
        """
        cutoff_time = current_time - self.window_size
        while (self.member_activities[member_id] and 
               self.member_activities[member_id][0]['timestamp'] < cutoff_time):
            removed_activity = self.member_activities[member_id].popleft()
            # Decrease popularity count for removed activity
            self.item_popularity[removed_activity['item_id']] = max(
                0, self.item_popularity[removed_activity['item_id']] - 1
            )
    
    def _update_member_profile(self, member_id: int, item_id: int, activity_type: str):
        """
        Update member profile based on activity
        
        Args:
            member_id (int): member identifier
            item_id (int): Item identifier
            activity_type (str): Type of activity
        """
        # Weight different activities differently
        activity_weights = {
            'view': 1,
            'like': 3,
            'share': 4,
            'purchase': 5,
            'comment': 2
        }
        
        weight = activity_weights.get(activity_type, 1)
        
        if item_id not in self.member_profiles[member_id]:
            self.member_profiles[member_id][item_id] = 0
            
        self.member_profiles[member_id][item_id] += weight
    
    def get_trending_items(self, limit: int = 10) -> List[Tuple[int, int]]:
        """
        Get currently trending items based on recent activity
        
        Args:
            limit (int): Maximum number of items to return
            
        Returns:
            List[Tuple[int, int]]: List of (item_id, popularity_count) tuples
        """
        # Sort items by popularity
        sorted_items = sorted(self.item_popularity.items(), 
                            key=lambda x: x[1], reverse=True)
        return sorted_items[:limit]
    
    def get_personalized_recommendations(self, member_id: int, limit: int = 10) -> List[Dict]:
        """
        Get personalized recommendations for a member in real-time
        
        Args:
            member_id (int): member identifier
            limit (int): Maximum number of recommendations to return
            
        Returns:
            List[Dict]: List of recommendation dictionaries
        """
        # Check cache first
        if member_id in self.recommendation_cache:
            cached_time, recommendations = self.recommendation_cache[member_id]
            if datetime.now() - cached_time < self.cache_expiry:
                return recommendations[:limit]
        
        # Get member's recent activities
        recent_activities = list(self.member_activities[member_id])
        
        # Get member's preferences
        member_preferences = self.member_profiles[member_id]
        
        # Generate recommendations based on:
        # 1. Similar members' recent activities
        # 2. Trending items
        # 3. member's historical preferences
        
        recommendations = []
        
        # Add items from similar members (simplified implementation)
        if recent_activities:
            # Get items interacted with recently by this member
            recent_items = set(act['item_id'] for act in recent_activities[-5:])  # Last 5 activities
            
            # Find items popular with members who liked similar items
            related_items = defaultdict(int)
            for item_id in recent_items:
                # In a real implementation, we would find similar members
                # For now, we'll just boost popularity of related items
                related_items[item_id] += 2
        
        # Add trending items
        trending_items = self.get_trending_items(limit * 2)  # Get more to filter
        
        # Combine and rank recommendations
        scored_items = defaultdict(float)
        
        # Score based on member preferences
        for item_id, weight in member_preferences.items():
            scored_items[item_id] += weight * 2
            
        # Score based on trending items
        for item_id, popularity in trending_items:
            scored_items[item_id] += popularity
            
        # Convert to list and sort
        ranked_items = sorted(scored_items.items(), key=lambda x: x[1], reverse=True)
        
        # Format recommendations
        for item_id, score in ranked_items[:limit]:
            # Avoid recommending items the member recently interacted with
            if not any(act['item_id'] == item_id for act in recent_activities[-3:]):
                recommendations.append({
                    'item_id': item_id,
                    'score': float(score),
                    'reason': 'personalized',
                    'title': f'Real-time Recommended Item {item_id}'
                })
        
        # Fill with trending items if needed
        if len(recommendations) < limit:
            for item_id, popularity in trending_items:
                if not any(rec['item_id'] == item_id for rec in recommendations):
                    recommendations.append({
                        'item_id': item_id,
                        'score': float(popularity),
                        'reason': 'trending',
                        'title': f'Trending Item {item_id}'
                    })
                    
                if len(recommendations) >= limit:
                    break
        
        # Cache recommendations
        self.recommendation_cache[member_id] = (datetime.now(), recommendations)
        
        return recommendations[:limit]
    
    def get_real_time_analytics(self) -> Dict:
        """
        Get real-time analytics data
        
        Returns:
            Dict: Analytics data including active members, trending items, etc.
        """
        # Count active members (members with recent activities)
        active_members = len(self.member_activities)
        
        # Get trending items
        trending_items = self.get_trending_items(5)
        
        # Calculate activity rate (activities per minute)
        total_activities = sum(len(activities) for activities in self.member_activities.values())
        
        return {
            'active_members': active_members,
            'total_activities': total_activities,
            'trending_items': [
                {'item_id': item_id, 'popularity': popularity}
                for item_id, popularity in trending_items
            ],
            'timestamp': datetime.now().isoformat()
        }

# Global instance of the real-time recommender
realtime_recommender = RealTimeRecommender()

# Example usage and simulation
def simulate_member_activities():
    """
    Simulate member activities for demonstration
    """
    member_ids = list(range(1, 101))  # 100 members
    item_ids = list(range(1, 1001))  # 1000 items
    activity_types = ['view', 'like', 'share', 'purchase', 'comment']
    
    for _ in range(100):  # Simulate 100 activities
        member_id = random.choice(member_ids)
        item_id = random.choice(item_ids)
        activity_type = random.choice(activity_types)
        
        realtime_recommender.record_member_activity(member_id, item_id, activity_type)
        time.sleep(0.01)  # Small delay to simulate real-time

if __name__ == "__main__":
    # Run simulation
    print("Simulating member activities...")
    simulate_member_activities()
    
    # Get recommendations for a member
    member_id = 1
    recommendations = realtime_recommender.get_personalized_recommendations(member_id, 5)
    
    print(f"\nReal-time recommendations for member {member_id}:")
    for rec in recommendations:
        print(f"- {rec['title']} (Score: {rec['score']:.2f}, Reason: {rec['reason']})")
    
    # Get trending items
    trending = realtime_recommender.get_trending_items(5)
    print(f"\nTrending items:")
    for item_id, popularity in trending:
        print(f"- Item {item_id} (Popularity: {popularity})")
    
    # Get analytics
    analytics = realtime_recommender.get_real_time_analytics()
    print(f"\nReal-time analytics:")
    print(f"- Active members: {analytics['active_members']}")
    print(f"- Total activities: {analytics['total_activities']}")
    print(f"- Trending items count: {len(analytics['trending_items'])}")