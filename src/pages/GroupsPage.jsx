import React, { useState, useEffect } from 'react';
import * as React from 'react';
import { Card, Button, Modal, Form, Spinner, Alert } from "react-bootstrap";
import groupsService from "../services/groupsService.ts";

const GroupsPage = () => {
  const [groups, setGroups] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [createGroupForm, setCreateGroupForm] = React.useState({
    name: "",
    description: "",
    privacy: "public"
  });

  React.useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await groupsService.getGroups();
      setGroups(response.groups);
    } catch (err) {
      setError("Failed to load groups");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await groupsService.createGroup(createGroupForm);
      setSuccess(response.message);
      setShowCreateModal(false);
      setCreateGroupForm({ name: "", description: "", privacy: "public" });
      loadGroups(); // Refresh groups list
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mt-4">
        <h1>Groups</h1>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          Create Group
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

      {loading && !groups.length && (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      )}

      <div className="row mt-4">
        {groups.map((group) => (
          <div className="col-md-6 col-lg-4 mb-4" key={group.id}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>{group.name}</Card.Title>
                <Card.Text>
                  {group.description || "No description provided."}
                </Card.Text>
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    Created by {group.creator_membername} on{" "}
                    {formatDate(group.created_at)}
                  </small>
                  <span className="badge bg-secondary">{group.privacy}</span>
                </div>
                <div className="mt-3">
                  <span className="badge bg-primary">
                    {group.member_count || 0} members
                  </span>
                </div>
              </Card.Body>
              <Card.Footer>
                <Button
                  variant="primary"
                  size="sm"
                  href={`/groups/${group.id}`}
                >
                  View Group
                </Button>
              </Card.Footer>
            </Card>
          </div>
        ))}

        {groups.length === 0 && !loading && (
          <div className="col-12">
            <Card>
              <Card.Body className="text-center">
                <p className="mb-0">No groups found.</p>
                <Button
                  variant="link"
                  onClick={() => setShowCreateModal(true)}
                  className="p-0"
                >
                  Be the first to create a group!
                </Button>
              </Card.Body>
            </Card>
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Group</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateGroup}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Group Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter group name"
                value={createGroupForm.name}
                onChange={(e) =>
                  setCreateGroupForm({
                    ...createGroupForm,
                    name: e.target.value
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter group description"
                value={createGroupForm.description}
                onChange={(e) =>
                  setCreateGroupForm({
                    ...createGroupForm,
                    description: e.target.value
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Privacy</Form.Label>
              <Form.Select
                value={createGroupForm.privacy}
                onChange={(e) =>
                  setCreateGroupForm({
                    ...createGroupForm,
                    privacy: e.target.value
                  })
                }
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="unlisted">Unlisted</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Group"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default GroupsPage;
