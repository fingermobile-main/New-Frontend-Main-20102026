from flask import Blueprint, request, jsonify
import sqlite3
from backend.db import get_db_connection # Import from the main Flask app

payroll_bp = Blueprint('payroll', __name__)

# Helper function for access control (mock implementation)
def _has_access(member_role, allowed_roles):
    return member_role in allowed_roles

# Mock member roles for demonstration
MEMBER_ROLES = {
    "superAdmin": ["superAdmin"],
    "rbsAdmin": ["superAdmin", "rbsAdmin"],
    "moderator": ["superAdmin", "rbsAdmin", "moderator"],
    "badgeMember": ["superAdmin", "rbsAdmin", "moderator", "badgeMember"],
    "regularMember": ["superAdmin", "rbsAdmin", "moderator", "badgeMember", "regularMember"],
}

# Endpoint: Get member's payroll details
@payroll_bp.route('/member/<string:member_id>', methods=['GET'])
def get_member_payroll(member_id):
    # Mock access control: A member can view their own payroll, admins can view any
    # In a real app, you'd get the current member's role from a token/session
    current_member_role = "regularMember" # This would come from authentication
    if not _has_access(current_member_role, MEMBER_ROLES["regularMember"]) and member_id != "current_member_id": # Replace "current_member_id"
        return jsonify({"message": "Unauthorized"}), 403

    conn = get_db_connection()
    member_payroll = conn.execute('SELECT * FROM members_payroll WHERE member_id = ?', (member_id,)).fetchone()
    conn.close()

    if member_payroll:
        return jsonify(dict(member_payroll)), 200
    return jsonify({"message": Member payroll not found"}), 404

# Endpoint: Get member's transaction history
@payroll_bp.route('/member/<string:member_id>/transactions', methods=['GET'])
def get_member_transactions(member_id):
    # Mock access control
    current_member_role = "regularMember"
    if not _has_access(current_member_role, MEMBER_ROLES["regularMember"]) and member_id != "current_member_id":
        return jsonify({"message": "Unauthorized"}), 403

    conn = get_db_connection()
    transactions = conn.execute('SELECT * FROM payroll_transactions WHERE member_id = ? ORDER BY transaction_date DESC', (member_id,)).fetchall()
    conn.close()

    return jsonify([dict(t) for t in transactions]), 200

# Endpoint: Initiate a payout request
@payroll_bp.route('/member/<string:member_id>/request-payout', methods=['POST'])
def request_payout(member_id):
    # Mock access control
    current_member_role = "regularMember"
    if not _has_access(current_member_role, MEMBER_ROLES["regularMember"]) and member_id != "current_member_id":
        return jsonify({"message": "Unauthorized"}), 403

    data = request.get_json()
    amount = data.get('amount')

    if not amount or not isinstance(amount, (int, float)) or amount <= 0:
        return jsonify({"message": "Invalid amount"}), 400

    # In a real application, you would:
    # 1. Validate the member's balance
    # 2. Create a payout request in the database
    # 3. Potentially trigger an external payout service

    conn = get_db_connection()
    try:
        conn.execute('INSERT INTO payout_requests (member_id, amount, status) VALUES (?, ?, ?)',
                     (member_id, amount, 'Pending'))
        conn.commit()
    except sqlite3.Error as e:
        conn.rollback()
        return jsonify({"message": f"Database error: {e}"}), 500
    finally:
        conn.close()

    return jsonify({"message": "Payout request submitted successfully", "amount": amount}), 202

# Endpoint: Admin view/manage all payout requests
@payroll_bp.route('/admin/payouts', methods=['GET'])
def admin_get_payouts():
    # Mock access control: Only SuperAdmin and RBS Admin can view
    current_member_role = "rbsAdmin" # This would come from authentication
    if not _has_access(current_member_role, MEMBER_ROLES["rbsAdmin"]):
        return jsonify({"message": "Unauthorized"}), 403

    conn = get_db_connection()
    payouts = conn.execute('SELECT * FROM payout_requests ORDER BY request_date DESC').fetchall()
    conn.close()

    return jsonify([dict(p) for p in payouts]), 200

# Endpoint: Admin endpoint to manually adjust a member's balance
@payroll_bp.route('/admin/adjust-balance', methods=['POST'])
def admin_adjust_balance():
    # Mock access control: Only SuperAdmin can adjust balances
    current_member_role = "superAdmin" # This would come from authentication
    if not _has_access(current_member_role, MEMBER_ROLES["superAdmin"]):
        return jsonify({"message": "Unauthorized"}), 403

    data = request.get_json()
    member_id = data.get('member_id')
    adjustment_amount = data.get('amount')
    
    if not member_id or not adjustment_amount or not isinstance(adjustment_amount, (int, float)):
        return jsonify({"message": "Invalid member_id or amount"}), 400

    # In a real application, you would:
    # 1. Update the member's balance in members_payroll
    # 2. Log this adjustment in payroll_transactions for audit trail

    conn = get_db_connection()
    try:
        conn.execute('UPDATE members_payroll SET current_balance = current_balance + ? WHERE member_id = ?',
                     (adjustment_amount, member_id))
        conn.execute('INSERT INTO payroll_transactions (member_id, transaction_type, amount, description) VALUES (?, ?, ?, ?)',
                     (member_id, 'Admin Adjustment', adjustment_amount, 'Manual balance adjustment by admin'))
        conn.commit()
    except sqlite3.Error as e:
        conn.rollback()
        return jsonify({"message": f"Database error: {e}"}), 500
    finally:
        conn.close()

    return jsonify({"message": Member balance adjusted successfully", member_id": member_id, "adjustment": adjustment_amount}), 200
