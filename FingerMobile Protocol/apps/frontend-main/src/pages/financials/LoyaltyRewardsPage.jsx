import React, { useState, useEffect } from 'react';
import * as React from 'react';
import { Card, Button, Spinner, Alert, Modal, Form } from "react-bootstrap";
import loyaltyService from "../../services/loyaltyService";

const LoyaltyRewardsPage = () => {
  const [rewards, setRewards] = React.useState([]);
  const [tiers, setTiers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [showAddPointsModal, setShowAddPointsModal] = React.useState(false);
  const [addPointsForm, setAddPointsForm] = React.useState({
    points: "",
    reason: ""
  });

  React.useEffect(() => {
    loadLoyaltyData();
  }, []);

  const loadLoyaltyData = async () => {
    setLoading(true);
    setError("");

    try {
      const [rewardsResponse, tiersResponse] = await Promise.all([
        loyaltyService.getLoyaltyRewards(),
        loyaltyService.getLoyaltyTiers()
      ]);

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

  const handleAddPoints = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await loyaltyService.addLoyaltyPoints(
        parseInt(addPointsForm.points),
        addPointsForm.reason,
      );
      setSuccess(response.message);
      setShowAddPointsModal(false);
      setAddPointsForm({ points: "", reason: "" });
      loadLoyaltyData(); // Refresh data
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add loyalty points");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const tierIcons = {
    bronze: "🥉",
    silver: "🥈",
    gold: "🥇",
    platinum: "💍"
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mt-4">
        <h1>Loyalty Rewards</h1>
        <Button variant="primary" onClick={() => setShowAddPointsModal(true)}>
          Add Loyalty Points
        </Button>
      </div>

      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" className="mt-3">
          {success}
        </Alert>
      )}

      {loading && (
        <div className="text-center my-3">
          <Spinner animation="border" />
        </div>
      )}

      <div className="row mt-4">
        <div className="col-12">
          <Card>
            <Card.Header>
              <Card.Title>Available Rewards</Card.Title>
            </Card.Header>
            <Card.Body>
              {rewards.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th>Points</th>
                        <th>Reward Type</th>
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
                          <td>{reward.reward_type}</td>
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

      <div className="row mt-4">
        <div className="col-12">
          <Card>
            <Card.Header>
              <Card.Title>Loyalty Tiers</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="row">
                {tiers.map((tier) => (
                  <div className="col-md-6 col-lg-3 mb-3" key={tier.name}>
                    <div className="card h-100">
                      <div className="card-body text-center">
                        <div className="display-4 mb-3">
                          {tierIcons[tier.name]}
                        </div>
                        <h5 className="card-title">
                          {tier.name.charAt(0).toUpperCase() +
                            tier.name.slice(1)}
                        </h5>
                        <p className="text-muted">
                          {tier.pointsRequired}+ points
                        </p>
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

      {/* Add Points Modal */}
      <Modal
        show={showAddPointsModal}
        onHide={() => setShowAddPointsModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Loyalty Points</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddPoints}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Points</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter points to add"
                value={addPointsForm.points}
                onChange={(e) =>
                  setAddPointsForm({ ...addPointsForm, points: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Reason</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter reason for adding points"
                value={addPointsForm.reason}
                onChange={(e) =>
                  setAddPointsForm({ ...addPointsForm, reason: e.target.value })
                }
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowAddPointsModal(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Points"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default LoyaltyRewardsPage;
