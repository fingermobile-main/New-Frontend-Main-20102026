import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from data_processor import process_member_data
import matplotlib.pyplot as plt
import seaborn as sns
import io
import base64

def perform_member_segmentation():
    """
    Perform member segmentation using K-Means clustering
    """
    # Process member data
    result = process_member_data()
    if not result:
        return None
    
    df, _ = result
    
    # Prepare data for clustering
    # Create some synthetic engagement metrics for demonstration
    np.random.seed(42)
    df['login_frequency'] = np.random.poisson(3, len(df))  # Average 3 logins per period
    df['posts_created'] = np.random.poisson(2, len(df))   # Average 2 posts per period
    df['content_views'] = np.random.poisson(20, len(df))  # Average 20 views per period
    df['social_interactions'] = np.random.poisson(5, len(df))  # Average 5 interactions per period
    
    # Select features for clustering
    features = ['account_age_days', 'login_frequency', 'posts_created', 'content_views', 'social_interactions']
    X = df[features]
    
    # Standardize features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Apply K-Means clustering
    kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
    cluster_labels = kmeans.fit_predict(X_scaled)
    
    # Add cluster labels to dataframe
    df['cluster'] = cluster_labels
    
    # Calculate cluster statistics
    cluster_stats = df.groupby('cluster')[features].mean()
    cluster_counts = df['cluster'].value_counts().sort_index()
    
    # Create cluster names based on characteristics
    cluster_names = []
    for i in range(len(cluster_stats)):
        # Simple naming based on most distinguishing feature
        cluster_data = cluster_stats.iloc[i]
        if cluster_data['account_age_days'] > cluster_data.mean():
            cluster_names.append("Long-term members")
        elif cluster_data['login_frequency'] > cluster_data.mean():
            cluster_names.append("Highly Active")
        elif cluster_data['social_interactions'] > cluster_data.mean():
            cluster_names.append("Social Engagers")
        else:
            cluster_names.append("Regular members")
    
    # Combine stats with names
    cluster_info = []
    for i, (cluster_id, count) in enumerate(cluster_counts.items()):
        cluster_info.append({
            'cluster_id': int(cluster_id),
            'name': cluster_names[cluster_id],
            'count': int(count),
            'characteristics': cluster_stats.iloc[cluster_id].to_dict()
        })
    
    return {
        'clusters': cluster_info,
        'total_members': len(df),
        'features_used': features
    }

def generate_correlation_matrix():
    """
    Generate correlation matrix for member features
    """
    # Process member data
    result = process_member_data()
    if not result:
        return None
    
    df, _ = result
    
    # Create synthetic engagement metrics
    np.random.seed(42)
    df['login_frequency'] = np.random.poisson(3, len(df))
    df['posts_created'] = np.random.poisson(2, len(df))
    df['content_views'] = np.random.poisson(20, len(df))
    df['social_interactions'] = np.random.poisson(5, len(df))
    
    # Select numerical features
    features = ['account_age_days', 'login_frequency', 'posts_created', 'content_views', 'social_interactions']
    corr_data = df[features]
    
    # Calculate correlation matrix
    correlation_matrix = corr_data.corr()
    
    return correlation_matrix.to_dict()

def create_engagement_heatmap():
    """
    Create member engagement heatmap
    """
    # Process member data
    result = process_member_data()
    if not result:
        return None
    
    df, _ = result
    
    # Create synthetic hourly engagement data for demonstration
    hours = list(range(24))
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    
    # Generate synthetic heatmap data
    np.random.seed(42)
    heatmap_data = np.random.rand(len(days), len(hours))
    
    # Boost some time slots to make it realistic
    # Peak times: morning (7-9) and evening (18-22)
    heatmap_data[:, 7:10] *= 2
    heatmap_data[:, 18:23] *= 1.5
    
    # Create heatmap as dictionary for JSON serialization
    heatmap_dict = {}
    for i, day in enumerate(days):
        heatmap_dict[day] = {}
        for j, hour in enumerate(hours):
            heatmap_dict[day][f"{hour}:00"] = float(heatmap_data[i, j])
    
    return heatmap_dict

def perform_pca_analysis():
    """
    Perform Principal Component Analysis to reduce dimensionality
    """
    # Process member data
    result = process_member_data()
    if not result:
        return None
    
    df, _ = result
    
    # Create synthetic engagement metrics
    np.random.seed(42)
    df['login_frequency'] = np.random.poisson(3, len(df))
    df['posts_created'] = np.random.poisson(2, len(df))
    df['content_views'] = np.random.poisson(20, len(df))
    df['social_interactions'] = np.random.poisson(5, len(df))
    
    # Select features
    features = ['account_age_days', 'login_frequency', 'posts_created', 'content_views', 'social_interactions']
    X = df[features]
    
    # Standardize features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Apply PCA
    pca = PCA(n_components=2)
    X_pca = pca.fit_transform(X_scaled)
    
    # Calculate explained variance
    explained_variance = pca.explained_variance_ratio_
    
    # Create result dataframe
    pca_df = pd.DataFrame({
        'pc1': X_pca[:, 0],
        'pc2': X_pca[:, 1],
        'cluster': df.get('cluster', 0)  # Use existing clusters or default to 0
    })
    
    return {
        'pca_data': pca_df.to_dict('records'),
        'explained_variance': {
            'pc1': float(explained_variance[0]),
            'pc2': float(explained_variance[1]),
            'total': float(sum(explained_variance))
        },
        'features': features
    }