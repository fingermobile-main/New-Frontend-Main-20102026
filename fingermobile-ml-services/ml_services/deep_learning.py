import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, MinMaxScaler

def create_neural_collaborative_filtering_model(num_members, num_items, embedding_dim=50):
    """
    Create a Neural Collaborative Filtering model
    """
    # Input layers
    member_input = keras.Input(shape=(1,), name='member_id')
    item_input = keras.Input(shape=(1,), name='item_id')
    
    # Embedding layers
    member_embedding = layers.Embedding(num_members, embedding_dim, name='member_embedding')(member_input)
    item_embedding = layers.Embedding(num_items, embedding_dim, name='item_embedding')(item_input)
    
    # Flatten embeddings
    member_vec = layers.Flatten()(member_embedding)
    item_vec = layers.Flatten()(item_embedding)
    
    # Concatenate member and item embeddings
    concat = layers.Concatenate()([member_vec, item_vec])
    
    # Dense layers
    dense1 = layers.Dense(128, activation='relu')(concat)
    dropout1 = layers.Dropout(0.2)(dense1)
    
    dense2 = layers.Dense(64, activation='relu')(dropout1)
    dropout2 = layers.Dropout(0.2)(dense2)
    
    dense3 = layers.Dense(32, activation='relu')(dropout2)
    
    # Output layer
    output = layers.Dense(1, activation='sigmoid', name='prediction')(dense3)
    
    # Create model
    model = keras.Model(inputs=[member_input, item_input], outputs=output)
    
    return model

def train_deep_recommendation_model():
    """
    Train a deep learning recommendation model
    """
    # Generate synthetic member-item interaction data for demonstration
    np.random.seed(42)
    num_members = 1000
    num_items = 500
    
    # Create member-item interactions
    interactions = []
    for _ in range(5000):  # 5000 interactions
        member_id = np.random.randint(0, num_members)
        item_id = np.random.randint(0, num_items)
        # Simulate rating based on some logic (more sophisticated in real implementation)
        rating = np.random.beta(2, 2)  # Ratings between 0 and 1
        interactions.append([member_id, item_id, rating])
    
    # Convert to DataFrame
    df = pd.DataFrame(interactions, columns=['member_id', 'item_id', 'rating'])
    
    # Prepare data for training
    X = df[['member_id', 'item_id']]
    y = df['rating']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Create model
    model = create_neural_collaborative_filtering_model(num_members, num_items)
    
    # Compile model
    model.compile(
        optimizer='adam',
        loss='mse',
        metrics=['mae']
    )
    
    # Train model (in a real scenario, we would train for more epochs)
    history = model.fit(
        [X_train['member_id'], X_train['item_id']], 
        y_train,
        batch_size=32,
        epochs=5,  # Keeping it low for demonstration
        validation_data=([X_test['member_id'], X_test['item_id']], y_test),
        verbose=0
    )
    
    return model, history.history

def generate_deep_recommendations(model, member_id, num_items, top_k=10):
    """
    Generate recommendations using the trained deep learning model
    """
    # Generate item predictions for the member
    member_ids = np.array([member_id] * num_items)
    item_ids = np.arange(num_items)
    
    # Predict ratings
    predictions = model.predict([member_ids, item_ids], verbose=0)
    
    # Get top-K recommendations
    top_indices = np.argsort(predictions.flatten())[-top_k:][::-1]
    
    recommendations = []
    for idx in top_indices:
        recommendations.append({
            'item_id': int(item_ids[idx]),
            'predicted_rating': float(predictions[idx][0]),
            'title': f'Deep Learning Recommended Item {item_ids[idx]}'
        })
    
    return recommendations

# Example usage
if __name__ == "__main__":
    # Train model
    model, history = train_deep_recommendation_model()
    
    # Generate recommendations for member 0
    recommendations = generate_deep_recommendations(model, member_id=0, num_items=500, top_k=5)
    
    print("Deep Learning Model Training History:")
    print(history)
    print("\nSample Recommendations:")
    for rec in recommendations[:3]:
        print(rec)