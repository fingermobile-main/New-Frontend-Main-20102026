import React, { useState } from 'react';
import { useAppContext } from "contexts/AppContext";

interface ScheduledContent {
  id: string;
  title: string;
  type: string;
  scheduledTime: string;
  status: "scheduled" | "published";
}

const UGCScheduler: React.FC = () => {
  const { showToast } = useAppContext();
  const [scheduledContent, setScheduledContent] = React.useState<ScheduledContent[]>([
    {
      id: "1",
      title: "Morning Inspiration",
      type: "Post",
      scheduledTime: "2023-06-20T08:00:00Z",
      status: "scheduled"
    },
    {
      id: "2",
      title: "Weekly Music Mix",
      type: "Audio",
      scheduledTime: "2023-06-22T19:00:00Z",
      status: "scheduled"
    },
    {
      id: "3",
      title: "Cooking Tutorial",
      type: "Video",
      scheduledTime: "2023-06-25T15:00:00Z",
      status: "scheduled"
    }
  ]);

  const [showScheduleModal, setShowScheduleModal] = React.useState(false);
  const [selectedContent, setSelectedContent] = React.useState("");
  const [scheduleDate, setScheduleDate] = React.useState("");
  const [scheduleTime, setScheduleTime] = React.useState("");

  const handleScheduleContent = () => {
    if (!selectedContent || !scheduleDate || !scheduleTime) {
      showToast("Please fill all fields", "error");
      return;
    }

    const newSchedule: ScheduledContent = {
      id: Date.now().toString(),
      title: selectedContent,
      type: "Post",
      scheduledTime: new Date(`${scheduleDate}T${scheduleTime}`).toISOString(),
      status: "scheduled"
    };

    setScheduledContent([...scheduledContent, newSchedule]);
    setShowScheduleModal(false);
    setSelectedContent("");
    setScheduleDate("");
    setScheduleTime("");
    showToast("Content scheduled successfully!", "success");
  };

  const handleCancelSchedule = (id: string) => {
    setScheduledContent(scheduledContent.filter((item) => item.id !== id));
    showToast("Schedule cancelled", "info");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="ugc-scheduler">
      <div className="scheduler-header">
        <h2>Content Scheduler</h2>
        <p>Schedule your content to be published automatically</p>
      </div>

      <div className="scheduler-actions">
        <button
          className="btn-primary"
          onClick={() => setShowScheduleModal(true)}
        >
          + Schedule New Content
        </button>
      </div>

      <div className="scheduled-content">
        <h3>Scheduled Content</h3>
        {scheduledContent.length === 0 ? (
          <div className="empty-state">
            <p>No content scheduled. Schedule your first piece of content!</p>
          </div>
        ) : (
          <div className="schedule-list">
            {scheduledContent.map((content) => (
              <div key={content.id} className="schedule-item">
                <div className="schedule-info">
                  <h4>{content.title}</h4>
                  <p>
                    {content.type} • Scheduled for{" "}
                    {formatDate(content.scheduledTime)}
                  </p>
                </div>
                <div className="schedule-actions">
                  <span className="status-badge scheduled">Scheduled</span>
                  <button
                    className="btn-danger"
                    onClick={() => handleCancelSchedule(content.id)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showScheduleModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Schedule Content</h3>
              <button
                className="close-button"
                onClick={() => setShowScheduleModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="contentTitle">Content Title</label>
                <input
                  id="contentTitle"
                  type="text"
                  value={selectedContent}
                  onChange={(e) => setSelectedContent(e.target.value)}
                  placeholder="Enter content title"
                />
              </div>

              <div className="form-group">
                <label htmlFor="scheduleDate">Schedule Date</label>
                <input
                  id="scheduleDate"
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="scheduleTime">Schedule Time</label>
                <input
                  id="scheduleTime"
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setShowScheduleModal(false)}
              >
                Cancel
              </button>
              <button className="btn-primary" onClick={handleScheduleContent}>
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UGCScheduler;
