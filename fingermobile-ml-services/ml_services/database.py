import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def get_db_connection():
    """
    Create and return a database connection
    """
    try:
        conn = psycopg2.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            database=os.getenv('DB_NAME', 'fingermobile_platform_db'),
            member=os.getenv('DB_member', 'postgres'),
            password=os.getenv('DB_PASSWORD', 'postgres'),
            port=os.getenv('DB_PORT', '5432')
        )
        return conn
    except Exception as e:
        print(f"Error connecting to database: {e}")
        return None

def fetch_member_data():
    """
    Fetch member data from the members table
    """
    conn = get_db_connection()
    if not conn:
        return None
    
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("SELECT id, membername, email, first_name, last_name, created_at FROM members LIMIT 100;")
        members = cursor.fetchall()
        cursor.close()
        conn.close()
        return members
    except Exception as e:
        print(f"Error fetching member data: {e}")
        if conn:
            conn.close()
        return None

def fetch_content_data():
    """
    Fetch content data from posts and blogs tables
    """
    conn = get_db_connection()
    if not conn:
        return None
    
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Fetch blog posts
        cursor.execute("SELECT id, member_id, title, content, created_at FROM blogs LIMIT 100;")
        blogs = cursor.fetchall()
        
        # Fetch forum posts
        cursor.execute("SELECT id, forum_id, member_id, title, content, created_at FROM forum_posts LIMIT 100;")
        forum_posts = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return {
            "blogs": blogs,
            "forum_posts": forum_posts
        }
    except Exception as e:
        print(f"Error fetching content data: {e}")
        if conn:
            conn.close()
        return None

def fetch_engagement_data():
    """
    Fetch engagement data from various tables
    """
    conn = get_db_connection()
    if not conn:
        return None
    
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # This would be expanded based on actual engagement tracking tables
        # For now, we'll just return a placeholder
        engagement_data = {
            "total_members": 0,
            "active_members": 0,
            "total_posts": 0
        }
        
        cursor.close()
        conn.close()
        
        return engagement_data
    except Exception as e:
        print(f"Error fetching engagement data: {e}")
        if conn:
            conn.close()
        return None