from flask import Blueprint, request, jsonify
import sqlite3
from backend.db import get_db_connection

creator_unique_url_bp = Blueprint('creator_unique_url', __name__)

# Define Member Roles for backend access control
member_roleS = {
    "superAdmin": ["superAdmin"],
    "rbsAdmin": ["superAdmin", "rbsAdmin"],
    "moderator": ["superAdmin", "rbsAdmin", "moderator"],
    "badgeMember": ["superAdmin", "rbsAdmin", "moderator", "badgeMember"],
    "regularMember": ["superAdmin", "rbsAdmin", "moderator", "badgeMember", "regularMember"],
}

def _has_access(member_role, allowed_roles):
    """Helper function to check if a member has access based on their role."""
    if member_role in allowed_roles:
        return True
    return False

# Placeholder for getting member role from token (replace with actual implementation)
def get_member_role_from_token():
    # In a real application, this would decode a JWT or similar token
    # and extract the member's role. For now, we'll mock it.
    # For testing, you might want to return different roles.
    return "superAdmin" # Default for testing purposes

@creator_unique_url_bp.route('/create', methods=['POST'])
def create_unique_url():
    current_member_role = get_member_role_from_token()
    if not _has_access(current_member_role, member_roleS["superAdmin"]) and \
       not _has_access(current_member_role, member_roleS["rbsAdmin"]) and \
       not _has_access(current_member_role, member_roleS["badgeMember"]):
        return jsonify({"message": "Unauthorized"}), 403

    data = request.get_json()
    creator_id = data.get('creator_id')
    unique_url = data.get('unique_url')
    target_path = data.get('target_path')

    if not all([creator_id, unique_url, target_path]):
        return jsonify({"message": "Missing required fields"}), 400

    conn = get_db_connection()
    try:
        conn.execute(
            "INSERT INTO creator_unique_urls (creator_id, unique_url, target_path) VALUES (?, ?, ?)",
            (creator_id, unique_url, target_path)
        )
        conn.commit()
        return jsonify({"message": "Unique URL created successfully", "creator_id": creator_id}), 201
    except sqlite3.IntegrityError:
        return jsonify({"message": "Creator ID or Unique URL already exists"}), 409
    finally:
        conn.close()

@creator_unique_url_bp.route('/member/<string:creator_id>', methods=['GET'])
def get_creator_unique_url(creator_id):
    current_member_role = get_member_role_from_token()
    # A member can view their own unique URL, or admins can view any
    if not (_has_access(current_member_role, member_roleS["superAdmin"]) or \
            _has_access(current_member_role, member_roleS["rbsAdmin"]) or \
            _has_access(current_member_role, member_roleS["moderator"]) or \
            (current_member_role == "badgeMember" and creator_id == "current_member_id") or \
            (current_member_role == "regularMember" and creator_id == "current_member_id")):
        return jsonify({"message": "Unauthorized"}), 403

    conn = get_db_connection()
    try:
        unique_url_data = conn.execute(
            'SELECT * FROM creator_unique_urls WHERE creator_id = ?', (creator_id,)
        ).fetchone()
        if unique_url_data:
            return jsonify(dict(unique_url_data)), 200
        return jsonify({"message": "Unique URL not found for this creator"}), 404
    finally:
        conn.close()

@creator_unique_url_bp.route('/update/<string:creator_id>', methods=['PUT'])
def update_unique_url(creator_id):
    current_member_role = get_member_role_from_token()
    if not (_has_access(current_member_role, member_roleS["superAdmin"]) or \
            _has_access(current_member_role, member_roleS["rbsAdmin"]) or \
            _has_access(current_member_role, member_roleS["moderator"]) or \
            (current_member_role == "badgeMember" and creator_id == "current_member_id")):
        return jsonify({"message": "Unauthorized"}), 403

    data = request.get_json()
    unique_url = data.get('unique_url')
    target_path = data.get('target_path')
    status = data.get('status')

    if not any([unique_url, target_path, status]):
        return jsonify({"message": "No fields to update"}), 400

    conn = get_db_connection()
    try:
        updates = []
        params = []
        if unique_url: 
            updates.append("unique_url = ?")
            params.append(unique_url)
        if target_path:
            updates.append("target_path = ?")
            params.append(target_path)
        if status:
            updates.append("status = ?")
            params.append(status)
        
        params.append(creator_id)

        conn.execute(
            f"UPDATE creator_unique_urls SET {', '.join(updates)} WHERE creator_id = ?",
            params
        )
        conn.commit()
        if conn.rowcount == 0:
            return jsonify({"message": "Unique URL not found for this creator"}), 404
        return jsonify({"message": "Unique URL updated successfully"}), 200
    except sqlite3.IntegrityError:
        return jsonify({"message": "Unique URL already exists"}), 409
    finally:
        conn.close()

@creator_unique_url_bp.route('/delete/<string:creator_id>', methods=['DELETE'])
def delete_unique_url(creator_id):
    current_member_role = get_member_role_from_token()
    if not (_has_access(current_member_role, member_roleS["superAdmin"]) or \
            _has_access(current_member_role, member_roleS["rbsAdmin"]) or \
            _has_access(current_member_role, member_roleS["moderator"])):
        return jsonify({"message": "Unauthorized"}), 403

    conn = get_db_connection()
    try:
        conn.execute(
            'DELETE FROM creator_unique_urls WHERE creator_id = ?', (creator_id,)
        )
        conn.commit()
        if conn.rowcount == 0:
            return jsonify({"message": "Unique URL not found for this creator"}), 404
        return jsonify({"message": "Unique URL deleted successfully"}), 200
    finally:
        conn.close()

@creator_unique_url_bp.route('/check-availability/<string:unique_url>', methods=['GET'])
def check_unique_url_availability(unique_url):
    conn = get_db_connection()
    try:
        unique_url_data = conn.execute(
            'SELECT 1 FROM creator_unique_urls WHERE unique_url = ?', (unique_url,)
        ).fetchone()
        if unique_url_data:
            return jsonify({"available": False}), 200
        return jsonify({"available": True}), 200
    finally:
        conn.close()
