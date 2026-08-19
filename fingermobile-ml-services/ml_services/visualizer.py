import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np
import base64
from io import BytesIO
from datetime import datetime, timedelta

# Set style for better-looking plots
plt.style.use('seaborn-v0_8-darkgrid')
sns.set_palette("husl")

def create_member_segmentation_chart(segment_data):
    """
    Create a bar chart showing member segmentation
    """
    # Create figure
    fig, ax = plt.subplots(figsize=(10, 6))
    
    # Extract data
    segments = [segment['name'] for segment in segment_data]
    counts = [segment['count'] for segment in segment_data]
    
    # Create bar chart
    bars = ax.bar(segments, counts, color=sns.color_palette("husl", len(segments)))
    
    # Customize chart
    ax.set_title('member Segmentation Distribution', fontsize=16, pad=20)
    ax.set_xlabel('member Segments', fontsize=12)
    ax.set_ylabel('Number of members', fontsize=12)
    
    # Add value labels on bars
    for bar in bars:
        height = bar.get_height()
        ax.annotate(f'{int(height)}',
                    xy=(bar.get_x() + bar.get_width() / 2, height),
                    xytext=(0, 3),
                    textcoords="offset points",
                    ha='center', va='bottom')
    
    # Rotate x-axis labels
    plt.xticks(rotation=45, ha='right')
    
    # Adjust layout
    plt.tight_layout()
    
    # Save to base64 string
    buffer = BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    plot_data = base64.b64encode(buffer.getvalue()).decode()
    plt.close()
    
    return plot_data

def create_engagement_heatmap(heatmap_data):
    """
    Create an engagement heatmap
    """
    # Convert data to DataFrame
    df = pd.DataFrame(heatmap_data).T
    
    # Create figure
    fig, ax = plt.subplots(figsize=(12, 8))
    
    # Create heatmap
    sns.heatmap(df, annot=False, cmap="YlOrRd", cbar=True, ax=ax)
    
    # Customize chart
    ax.set_title('member Engagement Heatmap', fontsize=16, pad=20)
    ax.set_xlabel('Hour of Day', fontsize=12)
    ax.set_ylabel('Day of Week', fontsize=12)
    
    # Adjust layout
    plt.tight_layout()
    
    # Save to base64 string
    buffer = BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    plot_data = base64.b64encode(buffer.getvalue()).decode()
    plt.close()
    
    return plot_data

def create_correlation_matrix_chart(correlation_data):
    """
    Create a correlation matrix heatmap
    """
    # Convert data to DataFrame
    df = pd.DataFrame(correlation_data)
    
    # Create figure
    fig, ax = plt.subplots(figsize=(10, 8))
    
    # Create heatmap
    sns.heatmap(df, annot=True, cmap="coolwarm", center=0, 
                square=True, linewidths=0.5, cbar_kws={"shrink": .8}, ax=ax)
    
    # Customize chart
    ax.set_title('Feature Correlation Matrix', fontsize=16, pad=20)
    
    # Adjust layout
    plt.tight_layout()
    
    # Save to base64 string
    buffer = BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    plot_data = base64.b64encode(buffer.getvalue()).decode()
    plt.close()
    
    return plot_data

def create_pca_visualization(pca_data):
    """
    Create a scatter plot of PCA results
    """
    # Convert data to DataFrame
    df = pd.DataFrame(pca_data['pca_data'])
    
    # Create figure
    fig, ax = plt.subplots(figsize=(10, 8))
    
    # Create scatter plot
    scatter = ax.scatter(df['pc1'], df['pc2'], alpha=0.7)
    
    # Customize chart
    ax.set_title('PCA Visualization of member Behavior', fontsize=16, pad=20)
    ax.set_xlabel(f'Principal Component 1 ({pca_data["explained_variance"]["pc1"]:.1%} variance)', fontsize=12)
    ax.set_ylabel(f'Principal Component 2 ({pca_data["explained_variance"]["pc2"]:.1%} variance)', fontsize=12)
    
    # Add grid
    ax.grid(True, alpha=0.3)
    
    # Adjust layout
    plt.tight_layout()
    
    # Save to base64 string
    buffer = BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    plot_data = base64.b64encode(buffer.getvalue()).decode()
    plt.close()
    
    return plot_data

def create_time_series_chart(data_points, title="Time Series Data"):
    """
    Create a time series line chart
    """
    # Create figure
    fig, ax = plt.subplots(figsize=(12, 6))
    
    # Create line chart
    ax.plot(range(len(data_points)), data_points, marker='o', linewidth=2, markersize=6)
    
    # Customize chart
    ax.set_title(title, fontsize=16, pad=20)
    ax.set_xlabel('Time Period', fontsize=12)
    ax.set_ylabel('Value', fontsize=12)
    
    # Add grid
    ax.grid(True, alpha=0.3)
    
    # Adjust layout
    plt.tight_layout()
    
    # Save to base64 string
    buffer = BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    plot_data = base64.b64encode(buffer.getvalue()).decode()
    plt.close()
    
    return plot_data

def create_recommendation_distribution_chart(recommendations):
    """
    Create a chart showing recommendation confidence distribution
    """
    # Extract confidence scores
    scores = [rec['confidence_score'] for rec in recommendations if 'confidence_score' in rec]
    
    if not scores:
        scores = [0.5] * len(recommendations)  # Default if no scores
    
    # Create figure
    fig, ax = plt.subplots(figsize=(10, 6))
    
    # Create histogram
    ax.hist(scores, bins=10, color='skyblue', edgecolor='black', alpha=0.7)
    
    # Customize chart
    ax.set_title('Recommendation Confidence Distribution', fontsize=16, pad=20)
    ax.set_xlabel('Confidence Score', fontsize=12)
    ax.set_ylabel('Frequency', fontsize=12)
    
    # Add grid
    ax.grid(True, alpha=0.3)
    
    # Adjust layout
    plt.tight_layout()
    
    # Save to base64 string
    buffer = BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    plot_data = base64.b64encode(buffer.getvalue()).decode()
    plt.close()
    
    return plot_data

# Example usage
if __name__ == "__main__":
    # Sample data for testing
    sample_segments = [
        {"name": "Highly Engaged", "count": 1250},
        {"name": "New members", "count": 3420},
        {"name": "At Risk", "count": 420},
        {"name": "Premium members", "count": 890}
    ]
    
    sample_heatmap = {
        'Monday': {str(i): np.random.rand() for i in range(24)},
        'Tuesday': {str(i): np.random.rand() for i in range(24)},
        'Wednesday': {str(i): np.random.rand() for i in range(24)}
    }
    
    sample_correlation = {
        'feature1': {'feature1': 1.0, 'feature2': 0.5, 'feature3': -0.2},
        'feature2': {'feature1': 0.5, 'feature2': 1.0, 'feature3': 0.8},
        'feature3': {'feature1': -0.2, 'feature2': 0.8, 'feature3': 1.0}
    }
    
    sample_pca = {
        'pca_data': [
            {'pc1': 1.2, 'pc2': 0.5},
            {'pc1': -0.8, 'pc2': 1.1},
            {'pc1': 0.3, 'pc2': -1.2}
        ],
        'explained_variance': {
            'pc1': 0.45,
            'pc2': 0.25,
            'total': 0.70
        }
    }
    
    print("Charts created successfully!")