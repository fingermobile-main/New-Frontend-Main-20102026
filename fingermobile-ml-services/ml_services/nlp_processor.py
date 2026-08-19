import nltk
import spacy
from collections import Counter
import re
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np

# Download required NLTK data (in a real implementation, this would be done during setup)
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.sentiment import SentimentIntensityAnalyzer

# Load spaCy model (in a real implementation, this would be downloaded during setup)
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    # If model is not available, we'll use a simpler approach
    nlp = None

def preprocess_text(text):
    """
    Preprocess text for NLP analysis
    """
    if not text:
        return ""
    
    # Convert to lowercase
    text = text.lower()
    
    # Remove special characters and digits
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    
    # Tokenize
    tokens = word_tokenize(text)
    
    # Remove stopwords
    stop_words = set(stopwords.words('english'))
    tokens = [token for token in tokens if token not in stop_words]
    
    # Join tokens back to text
    return ' '.join(tokens)

def extract_keywords(text, top_k=10):
    """
    Extract keywords from text using TF-IDF
    """
    if not text:
        return []
    
    # Preprocess text
    processed_text = preprocess_text(text)
    
    # Simple keyword extraction using word frequency
    words = processed_text.split()
    word_freq = Counter(words)
    
    # Return top keywords
    return [{'keyword': word, 'frequency': freq} for word, freq in word_freq.most_common(top_k)]

def analyze_sentiment(text):
    """
    Analyze sentiment of text using NLTK
    """
    if not text:
        return {'compound': 0, 'pos': 0, 'neu': 0, 'neg': 0}
    
    # Initialize sentiment analyzer
    sia = SentimentIntensityAnalyzer()
    
    # Get sentiment scores
    scores = sia.polarity_scores(text)
    
    return scores

def extract_entities(text):
    """
    Extract named entities from text using spaCy
    """
    if not text or nlp is None:
        return []
    
    # Process text with spaCy
    doc = nlp(text)
    
    # Extract entities
    entities = []
    for ent in doc.ents:
        entities.append({
            'text': ent.text,
            'label': ent.label_,
            'description': spacy.explain(ent.label_)
        })
    
    return entities

def categorize_content(text):
    """
    Categorize content based on keywords and entities
    """
    if not text:
        return "Unknown"
    
    # Predefined categories and keywords
    categories = {
        'technology': ['tech', 'software', 'computer', 'internet', 'digital', 'app', 'mobile', 'web'],
        'finance': ['money', 'investment', 'bank', 'loan', 'credit', 'financial', 'economy', 'stock'],
        'health': ['health', 'medical', 'doctor', 'hospital', 'fitness', 'wellness', 'diet', 'exercise'],
        'entertainment': ['movie', 'music', 'celebrity', 'show', 'tv', 'game', 'fun', 'entertainment'],
        'sports': ['sport', 'football', 'basketball', 'soccer', 'tennis', 'athlete', 'game', 'match'],
        'politics': ['government', 'politician', 'election', 'policy', 'law', 'president', 'minister', 'vote']
    }
    
    # Preprocess text
    processed_text = preprocess_text(text).lower()
    
    # Count category matches
    category_scores = {}
    for category, keywords in categories.items():
        score = sum(1 for keyword in keywords if keyword in processed_text)
        category_scores[category] = score
    
    # Return category with highest score or "General" if no matches
    if max(category_scores.values()) > 0:
        return max(category_scores, key=category_scores.get)
    else:
        return "General"

def generate_content_tags(text, top_k=5):
    """
    Generate tags for content using a combination of keyword extraction and categorization
    """
    if not text:
        return []
    
    # Extract keywords
    keywords = extract_keywords(text, top_k=top_k)
    
    # Categorize content
    category = categorize_content(text)
    
    # Combine tags
    tags = [kw['keyword'] for kw in keywords]
    if category != "General":
        tags.append(category)
    
    return list(set(tags))  # Remove duplicates

# Example usage
if __name__ == "__main__":
    sample_text = """
    Artificial intelligence and machine learning are transforming the technology landscape. 
    Companies are investing heavily in AI research to develop innovative products. 
    The future of software development looks promising with these advancements.
    """
    
    print("Sample Text:", sample_text)
    print("\nKeywords:", extract_keywords(sample_text))
    print("\nSentiment:", analyze_sentiment(sample_text))
    print("\nEntities:", extract_entities(sample_text))
    print("\nCategory:", categorize_content(sample_text))
    print("\nTags:", generate_content_tags(sample_text))