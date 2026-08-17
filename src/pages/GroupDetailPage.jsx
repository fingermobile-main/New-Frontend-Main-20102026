import { useParams} from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import * as React from 'react';

import { Card, Button, Spinner, Alert } from "react-bootstrap";
import groupsService from "../services/groupsService";

const GroupDetailPage = () => {
  const { id } = useParams();
  const [group, setGroup] = React.useState(null);
  const [members, setMembers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  React.useEffect(() => {
    loadGroupData();
  }, [id]);

  const loadGroupData = async () => {
    setLoading(true);
    setError("");

    try {
      const [groupResponse, membersResponse] = await Promise.all([
        groupsService.getGroupById(id),
        groupsService.getGroupMembers(id)
      ]);

      setGroup(groupResponse.group);
      setMembers(membersResponse.members);
    } catch (err) {
      setError("Failed to load group data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await groupsService.joinGroup(id);
      setSuccess(response.message);
      loadGroupData(); // Refresh data
    } catch (err) {
      setError(err.response?.data?.message || "Failed to join group");
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveGroup = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await groupsService.leaveGroup(id);
      setSuccess(response.message);
      loadGroupData(); // Refresh data
    } catch (err) {
      setError(err.response?.data?.message || "Failed to leave group");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading && !group) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <Spinner animation="border" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="container-fluid">
        <div className="row mt-4">
          <div className="col-12">
            <Alert variant="danger">Group not found.</Alert>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row mt-4">
        <div className="col-12">
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <Card.Title>{group.name}</Card.Title>
                  <Card.Text>
                    {group.description || "No description provided."}
                  </Card.Text>
                  <div className="d-flex gap-3">
                    <small className="text-muted">
                      Created by {group.creator_membername} on{" "}
                      {formatDate(group.created_at)}
                    </small>
                    <span className="badge bg-secondary">{group.privacy}</span>
                    <span className="badge bg-primary">
                      {group.member_count || 0} members
                    </span>
                  </div>
                </div>
                <div>
                  {members.some((member) => member.role === "owner") ? (
                    <Button variant="success" disabled>
                      Owner
                    </Button>
                  ) : members.some((member) => member.id) ? (
                    <Button
                      variant="warning"
                      onClick={handleLeaveGroup}
                      disabled={loading}
                    >
                      {loading ? "Leaving..." : "Leave Group"}
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={handleJoinGroup}
                      disabled={loading}
                    >
                      {loading ? "Joining..." : "Join Group"}
                    </Button>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
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

      <div className="row mt-4">
        <div className="col-12">
          <Card>
            <Card.Header>
              <Card.Title>Members</Card.Title>
            </Card.Header>
            <Card.Body>
              {members.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>membername</th>
                        <th>Role</th>
                        <th>Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((member) => (
                        <tr key={member.id}>
                          <td>{member.membername}</td>
                          <td>
                            <span
                              className={`badge ${
                                member.role === "owner"
                                  ? "bg-success"
                                  : member.role === "admin"
                                    ? "bg-primary"
                                    : member.role === "moderator"
                                      ? "bg-warning"
                                      : "bg-secondary"
                              }`}
                            >
                              {member.role}
                            </span>
                          </td>
                          <td>{formatDate(member.joined_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-muted py-3">
                  No members in this group yet.
                </p>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GroupDetailPage;