import React, { useState, useEffect } from 'react';
import { Card, Button, ProgressBar, Spinner, Alert } from "react-bootstrap";
import loyaltyService from "../../services/loyaltyService";

const LoyaltyPage = () => {
  const [loyaltyInfo, setLoyaltyInfo] = React.useState(null);
  const [rewards, setRewards] = React.useState([]);
  const [tiers, setTiers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  React.useEffect(() => {
    loadLoyaltyData();
  }, []);

  const loadLoyaltyData = async () => {
    setLoading(true);
    setError("");

    try {
      const [infoResponse, rewardsResponse, tiersResponse] = await Promise.all([
        loyaltyService.getLoyaltyInfo(),
        loyaltyService.getLoyaltyRewards(),
        loyaltyService.getLoyaltyTiers()
      ]);

      setLoyaltyInfo(infoResponse.loyaltyInfo);
      setRewards(rewardsResponse.rewards);
      setTiers(tiersResponse.tiers);
    } catch (err) {
      setError("Failed to load loyalty data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const claimReward = async (rewardId) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await loyaltyService.claimLoyaltyReward(rewardId);
      setSuccess(response.message);
      loadLoyaltyData(); // Refresh data
    } catch (err) {
      setError(err.response?.data?.message || "Failed to claim reward");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getCurrentTier = () => {
    if (!loyaltyInfo || tiers.length === 0) return null;
    return (
      tiers.find((tier) => tier.name === loyaltyInfo.tier_level) || tiers[0]
    );
  };

  const getNextTier = () => {
    if (!loyaltyInfo || tiers.length === 0) return null;

    const currentTierIndex = tiers.findIndex(
      (tier) => tier.name === loyaltyInfo.tier_level,
    );
    if (currentTierIndex < tiers.length - 1) {
      return tiers[currentTierIndex + 1];
    }
    return null;
  };

  const getProgressPercentage = () => {
    const currentTier = getCurrentTier();
    const nextTier = getNextTier();

    if (!currentTier || !nextTier || !loyaltyInfo) return 0;

    const progress =
      ((loyaltyInfo.points_balance - currentTier.pointsRequired) /
        (nextTier.pointsRequired - currentTier.pointsRequired)) *
      100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const tierIcons = {
    bronze: "🥉",
    silver: "🥈",
    gold: "🥇",
    platinum: "💍"
  };

  if (loading && !loyaltyInfo) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <Spinner animation="border" />
      </div>
    );
  }

  const currentTier = getCurrentTier();
  const nextTier = getNextTier();
  const progressPercentage = getProgressPercentage();

  return (
    <div className="container-fluid">
      <h1 className="mt-4">Loyalty Program</h1>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {loading && (
        <div className="text-center mb-3">
          <Spinner animation="border" size="sm" />
        </div>
      )}

      <div className="row mt-4">
        <div className="col-12">
          <Card>
            <Card.Header>
              <Card.Title>Your Loyalty Status</Card.Title>
            </Card.Header>
            <Card.Body className="text-center">
              <div className="display-1 mb-3">
                {currentTier ? tierIcons[currentTier.name] : "🥉"}
              </div>
              <h2>
                You are a{" "}
                {currentTier?.name.charAt(0).toUpperCase() +
                  currentTier?.name.slice(1) || "Bronze"}{" "}
                Member!
              </h2>
              <p className="text-muted">
                Thank you for being a valued member of our community. Keep
                engaging to unlock more rewards.
              </p>

              <div className="mt-4">
                <div className="d-flex justify-content-between mb-1">
                  <span>
                    {currentTier?.name.charAt(0).toUpperCase() +
                      currentTier?.name.slice(1) || "Bronze"}
                    ({currentTier?.pointsRequired || 0} pts)
                  </span>
                  {nextTier && (
                    <span>
                      {nextTier.name.charAt(0).toUpperCase() +
                        nextTier.name.slice(1)}
                      ({nextTier.pointsRequired} pts)
                    </span>
                  )}
                </div>
                <ProgressBar
                  now={progressPercentage}
                  style={{ height: "20px" }}
                />
                <p className="text-muted mt-2">
                  {nextTier
                    ? `${nextTier.pointsRequired - (loyaltyInfo?.points_balance || 0)} points until ${nextTier.name.charAt(0).toUpperCase() + nextTier.name.slice(1)}!`
                    : "You've reached the highest tier!"}
                </p>
              </div>

              <div className="mt-3">
                <h4>Points Balance: {loyaltyInfo?.points_balance || 0}</h4>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <Card>
            <Card.Header>
              <Card.Title>Tier Benefits</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="row">
                {tiers.map((tier, index) => (
                  <div className="col-md-6 col-lg-3 mb-3" key={tier.name}>
                    <div
                      className={`card h-100 ${loyaltyInfo?.tier_level === tier.name ? "border-primary" : ""}`}
                    >
                      <div className="card-body text-center">
                        <div className="display-4 mb-3">
                          {tierIcons[tier.name]}
                        </div>
                        <h5 className="card-title">
                          {tier.name.charAt(0).toUpperCase() +
                            tier.name.slice(1)}
                        </h5>
                        <ul className="list-unstyled text-start">
                          {tier.benefits.map((benefit, i) => (
                            <li key={i} className="mb-1">
                              <i className="bi bi-check-circle-fill text-success me-2"></i>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <Card>
            <Card.Header>
              <Card.Title>Rewards History</Card.Title>
            </Card.Header>
            <Card.Body>
              {rewards.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th>Points</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rewards.map((reward) => (
                        <tr key={reward.id}>
                          <td>{reward.description}</td>
                          <td>{reward.points}</td>
                          <td>{formatDate(reward.created_at)}</td>
                          <td>
                            {reward.claimed ? (
                              <span className="badge bg-success">Claimed</span>
                            ) : reward.expiration_date &&
                              new Date(reward.expiration_date) < new Date() ? (
                              <span className="badge bg-danger">Expired</span>
                            ) : (
                              <span className="badge bg-warning">
                                Available
                              </span>
                            )}
                          </td>
                          <td>
                            {!reward.claimed &&
                              !(
                                reward.expiration_date &&
                                new Date(reward.expiration_date) < new Date()
                              ) && (
                                <Button
                                  size="sm"
                                  onClick={() => claimReward(reward.id)}
                                  disabled={loading}
                                >
                                  {loading ? "Claiming..." : "Claim"}
                                </Button>
                              )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-muted py-4">
                  You haven't received any loyalty rewards yet.
                </p>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyPage;
