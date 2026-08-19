import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import random

def content_based_filtering(member_id=None):
    """
    Simple content-based filtering recommendation system
    """
    # Sample content data (in a real implementation, this would come from the database)
    content_data = [
        {"id": 1, "title": "Introduction to Digital Art", "category": "Art", "tags": "digital, art, tutorial"},
        {"id": 2, "title": "Advanced Python Programming", "category": "Technology", "tags": "python, programming, advanced"},
        {"id": 3, "title": "Jazz Music History", "category": "Music", "tags": "jazz, music, history"},
        {"id": 4, "title": "Healthy Cooking Recipes", "category": "Food", "tags": "cooking, healthy, recipes"},
        {"id": 5, "title": "Travel Photography Tips", "category": "Photography", "tags": "photography, travel, tips"},
        {"id": 6, "title": "Blockchain Basics", "category": "Technology", "tags": "blockchain, crypto, basics"},
        {"id": 7, "title": "Modern Dance Techniques", "category": "Dance", "tags": "dance, modern, techniques"},
        {"id": 8, "title": "Gardening for Beginners", "category": "Nature", "tags": "gardening, beginners, plants"},
        {"id": 9, "title": "Mobile App Development", "category": "Technology", "tags": "mobile, app, development"},
        {"id": 10, "title": "Classical Literature Overview", "category": "Literature", "tags": "literature, classical, books"}
    ]
    
    # Convert to DataFrame
    df = pd.DataFrame(content_data)
    
    # Combine category and tags for content analysis
    df['content'] = df['category'] + ' ' + df['tags']
    
    # Use TF-IDF to vectorize content
    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(df['content'])
    
    # Calculate cosine similarity
    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
    
    # For demo purposes, let's randomly select a content the member "liked"
    liked_content_idx = random.randint(0, len(df)-1) if member_id is None else member_id % len(df)
    
    # Get pairwise similarity scores
    sim_scores = list(enumerate(cosine_sim[liked_content_idx]))
    
    # Sort by similarity score
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    
    # Get top 5 similar content (excluding the content itself)
    sim_scores = sim_scores[1:6]
    content_indices = [i[0] for i in sim_scores]
    
    # Return recommended content
    recommendations = df.iloc[content_indices][['id', 'title', 'category']].to_dict('records')
    
    # Add similarity scores to recommendations
    for i, rec in enumerate(recommendations):
        rec['similarity_score'] = float(sim_scores[i][1])
    
    return {
        member_id": member_id,
        "based_on": df.iloc[liked_content_idx]['title'],
        "recommendations": recommendations
    }

def collaborative_filtering(member_id=None):
    """
    Simple collaborative filtering recommendation system
    """
    # Sample member-item interaction data (in a real implementation, this would come from the database)
    # Rows represent members, columns represent items, values represent ratings/interactions
    np.random.seed(42)
    n_members = 20
    n_items = 10
    
    # Generate random member-item interaction matrix
    interaction_matrix = np.random.randint(0, 6, size=(n_members, n_items))  # Ratings from 0-5
    
    # Add some structure to make it more realistic
    for i in range(n_members):
        # Each member rates 3-7 items
        n_ratings = np.random.randint(3, 8)
        rated_items = np.random.choice(n_items, n_ratings, replace=False)
        interaction_matrix[i, rated_items] = np.random.randint(1, 6, size=n_ratings)
    
    # Calculate member similarity using cosine similarity
    member_similarity = cosine_similarity(interaction_matrix)
    
    # For demo purposes, let's select a member
    target_member = random.randint(0, n_members-1) if member_id is None else member_id % n_members
    
    # Get similar members
    similar_members = list(enumerate(member_similarity[target_member]))
    similar_members = sorted(similar_members, key=lambda x: x[1], reverse=True)
    
    # Exclude the member themselves
    similar_members = similar_members[1:6]  # Top 5 similar members
    
    # Find items the target member hasn't interacted with
    member_items = interaction_matrix[target_member]
    unrated_items = np.where(member_items == 0)[0]
    
    # Score unrated items based on similar members' preferences
    item_scores = {}
    for item in unrated_items:
        score = 0
        similarity_sum = 0
        for member_idx, similarity in similar_members:
            if interaction_matrix[member_idx, item] > 0:  # If similar member rated this item
                score += similarity * interaction_matrix[member_idx, item]
                similarity_sum += similarity
        if similarity_sum > 0:
            item_scores[item] = score / similarity_sum
    
    # Sort items by score
    recommended_items = sorted(item_scores.items(), key=lambda x: x[1], reverse=True)[:5]
    
    # Format recommendations
    recommendations = []
    for item_id, score in recommended_items:
        recommendations.append({
            "item_id": int(item_id),
            "predicted_rating": float(score),
            "title": f"Content Item {item_id + 1}"  # In a real system, we'd get the actual title
        })
    
    return {
        member_id": target_member,
        "similar_members_count": len(similar_members),
        "recommendations": recommendations
    }

def hybrid_recommendations(member_id=None):
    """
    Hybrid recommendation system combining content-based and collaborative filtering
    """
    # Get content-based recommendations
    content_recs = content_based_filtering(member_id)
    
    # Get collaborative filtering recommendations
    collab_recs = collaborative_filtering(member_id)
    
    # Combine recommendations (simple averaging for demo)
    hybrid_recs = []
    
    # Take top recommendations from each and combine
    content_top = content_recs['recommendations'][:3]
    collab_top = collab_recs['recommendations'][:3]
    
    for i, rec in enumerate(content_top):
        hybrid_rec = {
            "id": rec.get('id', rec.get('item_id')),
            "title": rec.get('title', f"Recommended Content {i+1}"),
            "confidence_score": rec.get('similarity_score', 0.5)
        }
        hybrid_recs.append(hybrid_rec)
    
    for i, rec in enumerate(collab_top):
        # Avoid duplicates
        if not any(hr['id'] == rec.get('item_id') for hr in hybrid_recs):
            hybrid_rec = {
                "id": rec.get('item_id'),
                "title": rec.get('title', f"Recommended Content {len(hybrid_recs)+1}"),
                "confidence_score": rec.get('predicted_rating', 0) / 5.0  # Normalize to 0-1
            }
            hybrid_recs.append(hybrid_rec)
    
    return {
        member_id": member_id,
        "recommendations": hybrid_recs[:5]  # Top 5 hybrid recommendations
    }