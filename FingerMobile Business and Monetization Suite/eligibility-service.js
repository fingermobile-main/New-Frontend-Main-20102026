"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUniversalAlerts = getUniversalAlerts;
exports.evaluateEligibility = evaluateEligibility;
const constants_js_1 = require("./constants.js");
const statusPriority = {
    blocked: 3,
    warning: 2,
    pending: 1,
    eligible: 0,
};
function getStatus(failedRules, warningRules = []) {
    if (failedRules.length > 0) {
        return 'blocked';
    }
    if (warningRules.length > 0) {
        return 'warning';
    }
    return 'eligible';
}
function getUniversalAlerts(metrics, config) {
    const alerts = [];
    if (!metrics.isEligibleCountry)
        alerts.push(constants_js_1.ALERT_COPY.unsupportedCountry);
    if (metrics.age < config.minimumAge)
        alerts.push(constants_js_1.ALERT_COPY.underAge);
    if (metrics.accountAgeDays < 30)
        alerts.push(constants_js_1.ALERT_COPY.accountTooNew);
    if (metrics.originalContentScore < 70)
        alerts.push(constants_js_1.ALERT_COPY.originalityRisk);
    if (metrics.policyViolations > 0)
        alerts.push(constants_js_1.ALERT_COPY.policyRisk);
    if (!metrics.verifiedPayout)
        alerts.push(constants_js_1.ALERT_COPY.payoutMissing);
    return alerts;
}
function evaluateProduct(product, metrics, config) {
    const failedRules = [];
    const passedRules = [];
    const nextActions = [];
    const check = (condition, passText, failText, nextAction) => {
        if (condition) {
            passedRules.push(passText);
            return;
        }
        failedRules.push(failText);
        nextActions.push(nextAction);
    };
    check(metrics.accountAgeDays >= 30, 'Account age meets minimum.', 'Account must be at least 30 days old.', 'Keep the account in good standing until it reaches 30 days.');
    check(metrics.age >= config.minimumAge, 'Age requirement met.', `Member must be at least ${config.minimumAge}.`, 'Update identity data and complete age verification.');
    check(metrics.isEligibleCountry, 'Country is supported.', 'Member must be in a supported country.', 'Switch to a supported market or update country records.');
    check(metrics.originalContentScore >= 70, 'Originality score is acceptable.', 'Originality score is too low.', 'Publish more original content with commentary or direct participation.');
    check(metrics.policyViolations === 0, 'No blocking policy violations.', 'Open policy violations are blocking monetization.', 'Resolve violations and submit an appeal if needed.');
    check(metrics.verifiedBusiness, 'Business verification is complete.', 'Business verification is incomplete.', 'Complete business verification.');
    check(metrics.verifiedPayout, 'Payout account is verified.', 'Payout account must be verified.', 'Link and verify a bank account.');
    if (product === 'in_stream_ads') {
        check(metrics.followers >= 10000, 'Follower requirement met.', 'Requires at least 10,000 followers.', 'Grow the HallMarks audience to at least 10,000 followers.');
        check(metrics.watchMinutes60d >= 100000, 'Watch minutes requirement met.', 'Requires 100,000 watch minutes in the last 60 days.', 'Publish more long-form or live content to raise watch minutes.');
        check(metrics.activeVideos >= 35, 'Active videos requirement met.', 'Requires at least 35 active videos.', 'Publish more original videos on the HallMarks Page.');
    }
    if (product === 'gifts') {
        check(metrics.followers >= 500, 'Follower requirement met.', 'Requires at least 500 followers.', 'Reach 500 followers.');
        check(metrics.consecutiveFollowerDays >= 60, 'Follower consistency requirement met.', 'Requires 60 consecutive days of qualifying followers.', 'Maintain the follower baseline for 60 days.');
        check(metrics.giftPurchaseEligible, 'Gift purchase requirement met.', 'Member must first be eligible to purchase gifts.', 'Purchase or enable marketplace gifts first.');
    }
    if (product === 'subscriptions') {
        check(metrics.followers >= 50000 || metrics.returningViewers30d >= 500, 'Audience base requirement met.', 'Requires 50,000 followers or 500 returning viewers.', 'Increase followers or returning viewers.');
        check(metrics.postEngagement30d >= 100000 || metrics.watchMinutes30d >= 180000, 'Engagement requirement met.', 'Requires 100,000 engagements or 180,000 watch minutes in the last 30 days.', 'Drive more engaged content in the last 30 days.');
    }
    if (product === 'reels_ads') {
        check(metrics.followers >= 20000, 'Follower baseline met.', 'Requires at least 20,000 followers.', 'Grow the page to 20,000 followers.');
        check(metrics.uniqueViews30d >= 350000, 'Unique views requirement met.', 'Requires at least 350,000 unique views in the last 30 days.', 'Increase short-form content reach and view velocity.');
    }
    if (product === 'affiliate') {
        check(metrics.verifiedBusiness, 'Business verification requirement met.', 'Business verification is required.', 'Complete business verification.');
        check(metrics.verifiedPayout, 'Payout account requirement met.', 'Payout account verification is required.', 'Verify the bank account.');
    }
    return {
        product,
        status: getStatus(failedRules),
        passedRules,
        failedRules,
        nextActions,
    };
}
function evaluateEligibility(metrics, config) {
    const products = constants_js_1.PROGRAM_DEFINITIONS.map((program) => evaluateProduct(program.key, metrics, config));
    const universalAlerts = getUniversalAlerts(metrics, config);
    const universalStatus = products.reduce((current, product) => {
        return statusPriority[product.status] > statusPriority[current]
            ? product.status
            : current;
    }, universalAlerts.length > 0 ? 'warning' : 'eligible');
    return {
        universalStatus,
        products,
        universalAlerts,
    };
}
