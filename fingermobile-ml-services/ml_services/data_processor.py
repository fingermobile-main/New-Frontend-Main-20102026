import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from database import fetch_member_data, fetch_content_data

def process_member_data():
    """
    Process member data using pandas and numpy
    """
    # Fetch raw data
    raw_members = fetch_member_data()
    if not raw_members:
        return None
    
    # Convert to DataFrame
    df = pd.DataFrame(raw_members)
    
    # Add derived columns
    df['account_age_days'] = (datetime.now() - pd.to_datetime(df['created_at'])).dt.days
    df['account_age_category'] = pd.cut(df['account_age_days'], 
                                       bins=[0, 30, 90, 365, float('inf')], 
                                       labels=['New (<30 days)', 'Established (30-90 days)', 
                                               'Veteran (90-365 days)', 'Long-term (>365 days)'])
    
    # Calculate basic statistics
    stats = {
        'total_members': len(df),
        'avg_account_age': df['account_age_days'].mean(),
        'age_distribution': df['account_age_category'].value_counts().to_dict()
    }
    
    return df, stats

def process_content_data():
    """
    Process content data using pandas and numpy
    """
    # Fetch raw data
    raw_content = fetch_content_data()
    if not raw_content:
        return None
    
    # Process blogs
    blogs_df = pd.DataFrame(raw_content['blogs'])
    if not blogs_df.empty:
        blogs_df['content_length'] = blogs_df['content'].str.len()
        blogs_df['created_at'] = pd.to_datetime(blogs_df['created_at'])
        blogs_df['day_of_week'] = blogs_df['created_at'].dt.day_name()
        
    # Process forum posts
    forums_df = pd.DataFrame(raw_content['forum_posts'])
    if not forums_df.empty:
        forums_df['content_length'] = forums_df['content'].str.len()
        forums_df['created_at'] = pd.to_datetime(forums_df['created_at'])
        forums_df['day_of_week'] = forums_df['created_at'].dt.day_name()
    
    # Calculate content statistics
    stats = {}
    if not blogs_df.empty:
        stats['blogs'] = {
            'total_blogs': len(blogs_df),
            'avg_content_length': blogs_df['content_length'].mean(),
            'posts_by_day': blogs_df['day_of_week'].value_counts().to_dict()
        }
    
    if not forums_df.empty:
        stats['forums'] = {
            'total_forum_posts': len(forums_df),
            'avg_content_length': forums_df['content_length'].mean(),
            'posts_by_day': forums_df['day_of_week'].value_counts().to_dict()
        }
    
    return {
        'blogs_df': blogs_df if not blogs_df.empty else None,
        'forums_df': forums_df if not forums_df.empty else None
    }, stats

def create_member_segments(df):
    """
    Create member segments based on behavior
    """
    if df is None or df.empty:
        return None
    
    # Simple segmentation based on account age for now
    # In a real implementation, we would use engagement data
    segments = df.groupby('account_age_category').agg({
        'id': 'count',
        'account_age_days': 'mean'
    }).rename(columns={'id': 'member_count', 'account_age_days': 'avg_age_days'})
    
    return segments

def generate_descriptive_stats(df):
    """
    Generate descriptive statistics for numerical columns
    """
    if df is None or df.empty:
        return None
    
    # Select numerical columns
    numerical_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    
    if not numerical_cols:
        return None
    
    # Generate descriptive statistics
    desc_stats = df[numerical_cols].describe()
    
    return desc_stats