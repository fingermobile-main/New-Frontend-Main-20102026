from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv
from analytics_service import perform_member_segmentation, generate_correlation_matrix, create_engagement_heatmap, perform_pca_analysis
from recommendation_service import content_based_filtering, collaborative_filtering, hybrid_recommendations
from deep_learning import train_deep_recommendation_model, generate_deep_recommendations
from nlp_processor import extract_keywords, analyze_sentiment, extract_entities, categorize_content, generate_content_tags
from visualizer import create_member_segmentation_chart, create_engagement_heatmap, create_correlation_matrix_chart, create_pca_visualization, create_recommendation_distribution_chart
from realtime_recommender import realtime_recommender
import base64

# Load environment variables
load_dotenv()

# Create Flask app
app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'fallback-secret-key')
app.config['DATABASE_URL'] = os.getenv('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/fingermobile_platform_db')

# Initialize deep learning model
print("Training deep learning recommendation model...")
dl_model, dl_history = train_deep_recommendation_model()
print("Deep learning model training completed.")

@app.route('/')
def index():
    return jsonify({
        "message": "FingerMobile ML/AI Services",
        "status": "running",
        "version": "1.0.0"
    })

@app.route('/health')
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "ml-analytics-service"
    })

# Analytics endpoints
@app.route('/api/v1/analytics/member-segments', methods=['GET'])
def get_member_segments():
    try:
        segmentation_result = perform_member_segmentation()
        if segmentation_result:
            return jsonify(segmentation_result)
        else:
            return jsonify({"error": "Failed to perform member segmentation"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/v1/analytics/member-segments/chart', methods=['GET'])
def get_member_segments_chart():
    try:
        segmentation_result = perform_member_segmentation()
        if segmentation_result:
            chart_data = create_member_segmentation_chart(segmentation_result['clusters'])
            return jsonify({
                "chart": chart_data,
                "type": member_segmentation"
            })
        else:
            return jsonify({"error": "Failed to generate member segmentation chart"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/v1/analytics/correlations', methods=['GET'])
def get_correlations():
    try:
        correlation_matrix = generate_correlation_matrix()
        if correlation_matrix:
            return jsonify(correlation_matrix)
        else:
            return jsonify({"error": "Failed to generate correlation matrix"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/v1/analytics/correlations/chart', methods=['GET'])
def get_correlations_chart():
    try:
        correlation_matrix = generate_correlation_matrix()
        if correlation_matrix:
            chart_data = create_correlation_matrix_chart(correlation_matrix)
            return jsonify({
                "chart": chart_data,
                "type": "correlation_matrix"
            })
        else:
            return jsonify({"error": "Failed to generate correlation matrix chart"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/v1/analytics/heatmap', methods=['GET'])
def get_engagement_heatmap():
    try:
        heatmap_data = create_engagement_heatmap()
        if heatmap_data:
            return jsonify(heatmap_data)
        else:
            return jsonify({"error": "Failed to generate engagement heatmap"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/v1/analytics/heatmap/chart', methods=['GET'])
def get_engagement_heatmap_chart():
    try:
        heatmap_data = create_engagement_heatmap()
        if heatmap_data:
            chart_data = create_engagement_heatmap(heatmap_data)
            return jsonify({
                "chart": chart_data,
                "type": "engagement_heatmap"
            })
        else:
            return jsonify({"error": "Failed to generate engagement heatmap chart"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/v1/analytics/pca', methods=['GET'])
def get_pca_analysis():
    try:
        pca_result = perform_pca_analysis()
        if pca_result:
            return jsonify(pca_result)
        else:
            return jsonify({"error": "Failed to perform PCA analysis"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/v1/analytics/pca/chart', methods=['GET'])
def get_pca_analysis_chart():
    try:
        pca_result = perform_pca_analysis()
        if pca_result:
            chart_data = create_pca_visualization(pca_result)
            return jsonify({
                "chart": chart_data,
                "type": "pca_visualization"
            })
        else:
            return jsonify({"error": "Failed to generate PCA visualization"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Recommendation endpoints
@app.route('/api/v1/recommendations/content', methods=['POST'])
def get_content_recommendations():
    try:
        data = request.get_json()
        member_id = data.get('member_id', None)
        
        recommendations = content_based_filtering(member_id)
        return jsonify(recommendations)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/v1/recommendations/content/chart', methods=['POST'])
def get_content_recommendations_chart():
    try:
        data = request.get_json()
        member_id = data.get('member_id', None)
        
        recommendations = content_based_filtering(member_id)
        chart_data = create_recommendation_distribution_chart(recommendations['recommendations'])
        return jsonify({
            "chart": chart_data,
            "type": "recommendation_distribution"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/v1/recommendations/collaborative', methods=['POST'])
def get_collaborative_recommendations():
    try:
        data = request.get_json()
        member_id = data.get('member_id', None)
        
        recommendations = collaborative_filtering(member_id)
        return jsonify(recommendations)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/v1/recommendations/deep-learning', methods=['POST'])
def get_deep_learning_recommendations():
    try:
        data = request.get_json()
        member_id = data.get('member_id', 0)  # Default to member 0
        
        # Generate recommendations using deep learning model
        recommendations = generate_deep_recommendations(dl_model, member_id, num_items=500, top_k=10)
        return jsonify({
            member_id": member_id,
            "recommendations": recommendations
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/v1/recommendations/hybrid', methods=['POST'])
def get_hybrid_recommendations():
    try:
        data = request.get_json()
        member_id = data.get('member_id', None)
        
        recommendations = hybrid_recommendations(member_id)
        return jsonify(recommendations)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# NLP endpoints
@app.route('/api/v1/nlp/keywords', methods=['POST'])
def extract_text_keywords():
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        keywords = extract_keywords(text)
        return jsonify({
            "keywords": keywords
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/v1/nlp/sentiment', methods=['POST'])
def analyze_text_sentiment():
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        sentiment = analyze_sentiment(text)
        return jsonify({
            "sentiment": sentiment
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/v1/nlp/entities', methods=['POST'])
def extract_text_entities():
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        entities = extract_entities(text)
        return jsonify({
            "entities": entities
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/v1/nlp/category', methods=['POST'])
def categorize_text_content():
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        category = categorize_content(text)
        return jsonify({
            "category": category
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/v1/nlp/tags', methods=['POST'])
def generate_content_tags():
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        tags = generate_content_tags(text)
        return jsonify({
            "tags": tags
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Real-time recommendation endpoints
@app.route('/api/v1/realtime/activity', methods=['POST'])
def record_member_activity():
    try:
        data = request.get_json()
        member_id = data.get('member_id')
        item_id = data.get('item_id')
        activity_type = data.get('activity_type')
        
        if not all([member_id, item_id, activity_type]):
            return jsonify({"error": "Missing required parameters"}), 400
        
        realtime_recommender.record_member_activity(member_id, item_id, activity_type)
        return jsonify({"status": "success"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/v1/realtime/recommendations/<int:member_id>', methods=['GET'])
def get_realtime_recommendations(member_id):
    try:
        limit = request.args.get('limit', 10, type=int)
        recommendations = realtime_recommender.get_personalized_recommendations(member_id, limit)
        return jsonify({
            member_id": member_id,
            "recommendations": recommendations
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/v1/realtime/analytics', methods=['GET'])
def get_realtime_analytics():
    try:
        analytics = realtime_recommender.get_real_time_analytics()
        return jsonify(analytics)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(
        host=os.getenv('HOST', '0.0.0.0'),
        port=int(os.getenv('PORT', 5001)),
        debug=os.getenv('DEBUG', 'True').lower() == 'true'
    )