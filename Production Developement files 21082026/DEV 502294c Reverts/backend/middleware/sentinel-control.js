// Sentinel Control Middleware for FingerMobile P2P Matching System

const db = require('../db')
const logger = require('../utils/logger')

// Sentinel control types
const SentinelControlTypes = {
MATCHING_RULE: 'matching_rule',
FRAUD_DETECTION: 'fraud_detection',
PRIVACY_CONTROL: 'privacy_control',
ACCESS_CONTROL: 'access_control',
COMPLIANCE_CHECK: 'compliance_check'
}

// Sentinel severity levels
const SeverityLevels = {
LOW: 'low',
MEDIUM: 'medium',
HIGH: 'high',
CRITICAL: 'critical'
}

// Sentinel control middleware
const sentinelControl = async (req, res, next) => {
    try {
        // Get all active sentinel controls
        const activeControls = await db.query(
            'SELECT * FROM fm_sentinel_controls WHERE is_active = true ORDER BY priority_level DESC'
        )

        if (activeControls.rows.length === 0) {
            // No sentinel controls active, proceed normally
            return next()
        }

        // Process each active control
        for (const control of activeControls.rows) {
            const result = await processSentinelControl(control, req, res)

            if (!result.allowed) {
                // Log the violation
                await db.query(
                    `INSERT INTO fm_sentinel_logs (
                        log_type, severity, entity_id, entity_type, 
                        action_taken, details
                    ) VALUES ($1, $2, $3, $4, $5, $6)`,
                    [
                        'policy_violation',
                        control.config_params?.default_severity || 'medium',
                        req.member?.id || null,
                        req.member ? 'member' : 'request',
                        'blocked',
                        {
control_id: control.id,
control_name: control.control_name,
violation_details: result.reason,
request_path: req.path,
request_method: req.method
                        }
                    ]
                )

                return res.status(403).json({
error: 'Access denied by Sentinel control',
reason: result.reason
                })
            }
        }

        // Log successful access
        await db.query(
            `INSERT INTO fm_sentinel_logs (
                log_type, severity, entity_id, entity_type, 
                action_taken, details
            ) VALUES ($1, $2, $3, $4, $5, $6)`,
            [
                'access_granted',
                'info',
                req.member?.id || null,
                req.member ? 'member' : 'request',
                'allowed',
                {
request_path: req.path,
request_method: req.method,
timestamp: new Date().toISOString()
                }
            ]
        )

        next()
    } catch (error) {
        logger.error('Sentinel control error:', error.message)
        return res.status(500).json({
error: 'Sentinel control system error' })
    }
};

// Process individual sentinel control
const processSentinelControl = async (control, req, res) => {
    switch (control.control_type) {
        case SentinelControlTypes.MATCHING_RULE:
            return processMatchingRule(control, req, res)
        case SentinelControlTypes.FRAUD_DETECTION:
            return processFraudDetection(control, req, res)
        case SentinelControlTypes.PRIVACY_CONTROL:
            return processPrivacyControl(control, req, res)
        case SentinelControlTypes.ACCESS_CONTROL:
            return processAccessControl(control, req, res)
        case SentinelControlTypes.COMPLIANCE_CHECK:
            return processComplianceCheck(control, req, res);
        default:
            return {
allowed: true };
    }
};

// Process matching rule control
const processMatchingRule = async (control, req, res) => {
    const config = control.config_params || {}
    
    // Example: Limit number of matches per member per day
    if (config.limit_matches_per_day) {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        const matchesToday = await db.query(
            `SELECT COUNT(*) as count FROM fm_p2p_matches 
            WHERE sent_by_member_id = $1 AND created_at >= $2`,
            [req.member?.id || null, today]
        )
        
        if (parseInt(matchesToday.rows[0].count) >= config.max_matches_per_day) {
            return {
allowed: false,
reason: `Maximum daily matches limit (${config.max_matches_per_day}) reached`
            }
        }
    }
    
    return {
allowed: true };
};

// Process fraud detection control
const processFraudDetection = async (control, req, res) => {
    const config = control.config_params || {}
    
    // Check for AI insights with high fraud risk
    if (req.member?.id) {
        const fraudInsights = await db.query(
            `SELECT * FROM fm_ai_insights 
            WHERE entity_id = $1 AND insight_type = 'fraud_risk' 
            AND severity_level IN ('high', 'critical') AND is_flagged = true`,
            [req.member.id]
        )
        
        if (fraudInsights.rows.length > 0) {
            return {
allowed: false,
reason: 'Member flagged for high fraud risk'
            }
        }
    }
    
    return {
allowed: true }
}

// Process privacy control
const processPrivacyControl = async (control, req, res) => {
    const config = control.config_params || {}
    
    // Example: Check if member has access to profile analysis
    if (req.path.includes('/profile-analysis') && req.query.analyzermemberId) {
        if (!req.member || req.query.analyzermemberId !== req.member.id) {
            return {
allowed: false,
reason: 'Unauthorized access to profile analysis'
            }
        }
        
        // Check FIC subscription
        const subscription = await db.query(
            `SELECT * FROM fm_fic_subscriptions 
            WHERE member_id = $1 AND is_active = true`,
            [req.member.id]
        )
        
        if (subscription.rows.length === 0) {
            return {
allowed: false,
reason: 'FIC subscription required for profile analysis'
            }
        }
    }
    
    return {
allowed: true }
}

// Process access control
const processAccessControl = async (control, req, res) => {
    const config = control.config_params || {}
    
    // Example: Restrict access based on IP or other factors
    if (config.restricted_ips && req.ip) {
        if (config.restricted_ips.includes(req.ip)) {
            return {
allowed: false,
reason: 'IP address restricted'
            }
        }
    }
    
    return {
allowed: true }
}

// Process compliance check
const processComplianceCheck = async (control, req, res) => {
    const config = control.config_params || {}
    
    // Example: Check if required fields are provided for procurement
    if (req.path.includes('/procurement-documents') && req.method === 'POST') {
        const requiredFields = config.required_fields || []
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return {
allowed: false,
reason: `Missing required,
field: ${field}`
                }
            }
        }
    }
    
    return {
allowed: true }
}

// Specialized middleware for specific P2P match creation
const sentinelP2PMatchControl = async (req, res, next) => {
    try {
        // Get active matching rules
        const matchingRules = await db.query(
            `SELECT * FROM fm_sentinel_controls 
            WHERE control_type = 'matching_rule' AND is_active = true 
            ORDER BY priority_level DESC`
        )

        for (const rule of matchingRules.rows) {
            const result = await evaluateMatchRule(rule, req.body)
            
            if (!result.allowed) {
                await db.query(
                    `INSERT INTO fm_sentinel_logs (
                        log_type, severity, entity_id, entity_type, 
                        action_taken, details
                    ) VALUES ($1, $2, $3, $4, $5, $6)`,
                    [
                        'match_violation',
                        rule.config_params?.default_severity || 'medium',
                        req.member?.id || null,
                        'member',
                        'blocked',
                        {
rule_id: rule.id,
rule_name: rule.control_name,
violation_details: result.reason,
match_attempt: req.body
                        }
                    ]
                )

                return res.status(403).json({
error: 'Match creation blocked by Sentinel control',
reason: result.reason
                })
            }
        }

        next();
    } catch (error) {
        logger.error('Sentinel P2P match control error:', error.message);
        return res.status(500).json({
error: 'Sentinel control system error' });
    }
};

// Evaluate a specific match rule
const evaluateMatchRule = async (rule, matchData) => {
    const config = rule.config_params || {}
    
    // Example: Prevent matches between members with significant age difference
    if (config.age_difference_limit) {
        const member1Profile = await db.query(
            'SELECT age FROM fm_member_profiles WHERE member_id = $1',
            [matchData.member1_id]
        )
        
        const member2Profile = await db.query(
            'SELECT age FROM fm_member_profiles WHERE member_id = $1',
            [matchData.member2_id]
        )
        
        if (member1Profile.rows[0] && member2Profile.rows[0]) {
            const ageDiff = Math.abs(member1Profile.rows[0].age - member2Profile.rows[0].age)
            if (ageDiff > config.age_difference_limit) {
                return {
allowed: false,
reason: `Age difference exceeds limit of ${config.age_difference_limit} years`
                }
            }
        }
    }
    
    // Example: Check for fraud flags on either member
    const fraudCheck1 = await db.query(
        `SELECT COUNT(*) as count FROM fm_ai_insights 
        WHERE entity_id = $1 AND insight_type = 'fraud_risk' 
        AND severity_level IN ('high', 'critical') AND is_flagged = true`,
        [matchData.member1_id]
    )
    
    const fraudCheck2 = await db.query(
        `SELECT COUNT(*) as count FROM fm_ai_insights 
        WHERE entity_id = $1 AND insight_type = 'fraud_risk' 
        AND severity_level IN ('high', 'critical') AND is_flagged = true`,
        [matchData.member2_id]
    )
    
    if (parseInt(fraudCheck1.rows[0].count) > 0 || parseInt(fraudCheck2.rows[0].count) > 0) {
        return {
allowed: false,
reason: 'One or both members flagged for fraud risk'
        }
    }
    
    return {
allowed: true }
};

module.exports = {
    sentinelControl,
    sentinelP2PMatchControl,
    SentinelControlTypes,
    SeverityLevels
};