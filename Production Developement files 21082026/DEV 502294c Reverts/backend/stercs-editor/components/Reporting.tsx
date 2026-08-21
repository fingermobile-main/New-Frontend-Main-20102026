import React, { useState, useEffect } from "react";

interface Report {
  id: number;
  name: string;
  description?: string;
  type: string;
  configuration: any;
  schedule: string | null;
  recipients: string[];
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

interface GeneratedReport {
  id: number;
  reportId: number;
  data: any;
  generatedAt: string;
}

interface ReportingProps {
  theme: "light" | "dark" | "blue";
}

const Reporting: React.FC<ReportingProps> = ({ theme }) => {
  const [activeTab, setActiveTab] = useState<"reports" | "dashboard">(
    "reports",
  );
  const [reports, setReports] = useState<Report[]>([]);
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>(
    [],
  );
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Form states for creating reports
  const [newReportName, setNewReportName] = useState<string>("");
  const [newReportDescription, setNewReportDescription] = useState<string>("");
  const [newReportType, setNewReportType] = useState<string>("analytics");
  const [newReportSchedule, setNewReportSchedule] = useState<string>("");
  const [newReportRecipients, setNewReportRecipients] = useState<string>("");
  const [newReportEnabled, setNewReportEnabled] = useState<boolean>(true);

  // Fetch data on initial load
  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    if (selectedReport) {
      fetchGeneratedReports(selectedReport.id);
    }
  }, [selectedReport]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/editor/reporting", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || "fake-token"}`, // In real app, use proper auth
        }
      });

      const result = await response.json();

      if (result.success) {
        setReports(result.data);
      } else {
        setError(result.message || "Failed to fetch reports");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchGeneratedReports = async (reportId: number) => {
    try {
      const response = await fetch(
        `/api/editor/reporting/${reportId}/generated`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || "fake-token"}`, // In real app, use proper auth
          }
        },
      );

      const result = await response.json();

      if (result.success) {
        setGeneratedReports(result.data);
      } else {
        setError(result.message || "Failed to fetch generated reports");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleCreateReport = async () => {
    if (!newReportName || !newReportType) {
      setError("Report name and type are required");
      return;
    }

    try {
      const response = await fetch("/api/editor/reporting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || "fake-token"}`, // In real app, use proper auth
        },
        body: JSON.stringify({
          name: newReportName,
          description: newReportDescription,
          type: newReportType,
          schedule: newReportSchedule || null,
          recipients: newReportRecipients
            .split(",")
            .map((email) => email.trim())
            .filter((email) => email),
          enabled: newReportEnabled
        })
      });

      const result = await response.json();

      if (result.success) {
        setNewReportName("");
        setNewReportDescription("");
        setNewReportType("analytics");
        setNewReportSchedule("");
        setNewReportRecipients("");
        setNewReportEnabled(true);
        setReports([...reports, result.data]);
        alert("Report created successfully!");
      } else {
        setError(result.message || "Failed to create report");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleGenerateReport = async (reportId: number) => {
    try {
      const response = await fetch(
        `/api/editor/reporting/${reportId}/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || "fake-token"}`, // In real app, use proper auth
          }
        },
      );

      const result = await response.json();

      if (result.success) {
        // Refresh the generated reports list
        fetchGeneratedReports(reportId);
        alert("Report generated successfully!");
      } else {
        setError(result.message || "Failed to generate report");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case "analytics":
        return "#3b82f6";
      case "performance":
        return "#8b5cf6";
      case "security":
        return "#ef4444";
      case "usage":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  // Get the most recent generated report for a report
  const getLatestReportData = (reportId: number) => {
    return generatedReports.find((r) => r.reportId === reportId);
  };

  return (
    <div
      className="reporting-panel"
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor:
          theme === "dark"
            ? "#1f2937"
            : theme === "blue"
              ? "#dbeafe"
              : "#e5e7eb",
        color: theme === "dark" ? "white" : "#1f2937",
        padding: "1rem"
      }}
    >
      <h3 style={{ margin: "0 0 1rem 0" }}>Reporting & Dashboard</h3>

      {error && (
        <div
          style={{
            padding: "0.75rem",
            color: "#ef4444",
            backgroundColor:
              theme === "dark"
                ? "#374151"
                : theme === "blue"
                  ? "#eff6ff"
                  : "#f3f4f6",
            borderRadius: "4px",
            marginBottom: "1rem"
          }}
        >
          Error: {error}
        </div>
      )}

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <button
          onClick={() => setActiveTab("reports")}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor:
              activeTab === "reports"
                ? theme === "dark"
                  ? "#374151"
                  : theme === "blue"
                    ? "#3b82f6"
                    : "#d1d5db"
                : theme === "dark"
                  ? "#4b5563"
                  : theme === "blue"
                    ? "#93c5fd"
                    : "#e5e7eb",
            color: theme === "dark" ? "white" : "#1f2937",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: activeTab === "reports" ? "bold" : "normal"
          }}
        >
          Reports
        </button>
        <button
          onClick={() => setActiveTab("dashboard")}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor:
              activeTab === "dashboard"
                ? theme === "dark"
                  ? "#374151"
                  : theme === "blue"
                    ? "#3b82f6"
                    : "#d1d5db"
                : theme === "dark"
                  ? "#4b5563"
                  : theme === "blue"
                    ? "#93c5fd"
                    : "#e5e7eb",
            color: theme === "dark" ? "white" : "#1f2937",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: activeTab === "dashboard" ? "bold" : "normal"
          }}
        >
          Dashboard
        </button>
      </div>

      {loading && activeTab === "reports" && (
        <div style={{ padding: "1rem", textAlign: "center" }}>Loading...</div>
      )}

      {!loading && activeTab === "reports" && (
        <div style={{ overflowY: "auto", maxHeight: "calc(100vh- 200px)" }}>
          <div
            style={{
              padding: "1rem",
              backgroundColor:
                theme === "dark"
                  ? "#374151"
                  : theme === "blue"
                    ? "#eff6ff"
                    : "white",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              marginBottom: "1rem"
            }}
          >
            <h4>Create New Report</h4>
            <div style={{ marginBottom: "0.75rem" }}>
              <label style={{ display: "block", marginBottom: "0.25rem" }}>
                Report Name
              </label>
              <input
                type="text"
                value={newReportName}
                onChange={(e) => setNewReportName(e.target.value)}
                placeholder="Enter report name"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  backgroundColor: theme === "dark" ? "#4b5563" : "white",
                  color: theme === "dark" ? "white" : "#1f2937"
                }}
              />
            </div>

            <div style={{ marginBottom: "0.75rem" }}>
              <label style={{ display: "block", marginBottom: "0.25rem" }}>
                Description
              </label>
              <textarea
                value={newReportDescription}
                onChange={(e) => setNewReportDescription(e.target.value)}
                placeholder="Enter report description"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  backgroundColor: theme === "dark" ? "#4b5563" : "white",
                  color: theme === "dark" ? "white" : "#1f2937",
                  minHeight: "60px"
                }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.75rem",
                marginBottom: "0.75rem"
              }}
            >
              <div>
                <label style={{ display: "block", marginBottom: "0.25rem" }}>
                  Report Type
                </label>
                <select
                  value={newReportType}
                  onChange={(e) => setNewReportType(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "4px",
                    backgroundColor: theme === "dark" ? "#4b5563" : "white",
                    color: theme === "dark" ? "white" : "#1f2937"
                  }}
                >
                  <option value="analytics">Analytics</option>
                  <option value="performance">Performance</option>
                  <option value="security">Security</option>
                  <option value="usage">Usage</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.25rem" }}>
                  Schedule (Cron)
                </label>
                <input
                  type="text"
                  value={newReportSchedule}
                  onChange={(e) => setNewReportSchedule(e.target.value)}
                  placeholder="e.g., 0 9 * * 1 (weekly at 9am)"
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "4px",
                    backgroundColor: theme === "dark" ? "#4b5563" : "white",
                    color: theme === "dark" ? "white" : "#1f2937"
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "0.75rem" }}>
              <label style={{ display: "block", marginBottom: "0.25rem" }}>
                Recipients (comma separated)
              </label>
              <input
                type="text"
                value={newReportRecipients}
                onChange={(e) => setNewReportRecipients(e.target.value)}
                placeholder="e.g., admin@example.com, member@example.com"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  backgroundColor: theme === "dark" ? "#4b5563" : "white",
                  color: theme === "dark" ? "white" : "#1f2937"
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "0.75rem"
              }}
            >
              <input
                type="checkbox"
                id="enabled"
                checked={newReportEnabled}
                onChange={(e) => setNewReportEnabled(e.target.checked)}
                style={{ marginRight: "0.5rem" }}
              />
              <label htmlFor="enabled">Enabled</label>
            </div>

            <button
              onClick={handleCreateReport}
              style={{
                width: "100%",
                padding: "0.5rem",
                backgroundColor:
                  theme === "dark"
                    ? "#3b82f6"
                    : theme === "blue"
                      ? "#3b82f6"
                      : "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Create Report
            </button>
          </div>

          <h4>Your Reports</h4>
          {reports.length === 0 ? (
            <div
              style={{ textAlign: "center", padding: "1rem", color: "#9ca3af" }}
            >
              No reports created yet. Create your first report!
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem"
              }}
            >
              {reports.map((report) => (
                <div
                  key={report.id}
                  style={{
                    padding: "0.75rem",
                    backgroundColor:
                      theme === "dark"
                        ? "#374151"
                        : theme === "blue"
                          ? "#eff6ff"
                          : "white",
                    border: "1px solid #d1d5db",
                    borderRadius: "4px"
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.25rem"
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: "bold" }}>{report.name}</div>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={() => handleGenerateReport(report.id)}
                        style={{
                          padding: "0.25rem 0.5rem",
                          backgroundColor:
                            theme === "dark"
                              ? "#10b981"
                              : theme === "blue"
                                ? "#10b981"
                                : "#10b981",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.75rem"
                        }}
                      >
                        Generate
                      </button>
                      <button
                        onClick={() => setSelectedReport(report)}
                        style={{
                          padding: "0.25rem 0.5rem",
                          backgroundColor:
                            theme === "dark"
                              ? "#8b5cf6"
                              : theme === "blue"
                                ? "#8b5cf6"
                                : "#8b5cf6",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.75rem"
                        }}
                      >
                        View
                      </button>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.25rem"
                    }}
                  >
                    <div>
                      <span
                        style={{
                          padding: "0.25rem 0.5rem",
                          borderRadius: "4px",
                          backgroundColor:
                            report.type === "analytics"
                              ? "#dbeafe"
                              : report.type === "performance"
                                ? "#e0e7ff"
                                : report.type === "security"
                                  ? "#fee2e2"
                                  : report.type === "usage"
                                    ? "#d1fae5"
                                    : "#e5e7eb",
                          color:
                            report.type === "analytics"
                              ? "#1e40af"
                              : report.type === "performance"
                                ? "#4f46e5"
                                : report.type === "security"
                                  ? "#7f1d1d"
                                  : report.type === "usage"
                                    ? "#065f46"
                                    : "#6b7280",
                          fontWeight: "bold",
                          marginRight: "0.5rem"
                        }}
                      >
                        {report.type}
                      </span>
                      <span
                        style={{
                          padding: "0.25rem 0.5rem",
                          borderRadius: "4px",
                          backgroundColor: report.enabled
                            ? "#d1fae5"
                            : "#fee2e2",
                          color: report.enabled ? "#065f46" : "#7f1d1d"
                        }}
                      >
                        {report.enabled ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                      {report.schedule
                        ? `Scheduled: ${report.schedule}`
                        : "Manual only"}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "#6b7280",
                      marginBottom: "0.25rem"
                    }}
                  >
                    Created: {formatDate(report.createdAt)} • Updated:{" "}
                    {formatDate(report.updatedAt)}
                  </div>
                  {report.description && (
                    <div style={{ fontSize: "0.8rem" }}>
                      {report.description}
                    </div>
                  )}
                  {report.recipients && report.recipients.length > 0 && (
                    <div
                      style={{
                        marginTop: "0.5rem",
                        fontSize: "0.8rem",
                        color: "#6b7280"
                      }}
                    >
                      Recipients: {report.recipients.join(", ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!loading && activeTab === "dashboard" && selectedReport && (
        <div style={{ overflowY: "auto", maxHeight: "calc(100vh- 200px)" }}>
          <div
            style={{
              padding: "1rem",
              backgroundColor:
                theme === "dark"
                  ? "#374151"
                  : theme === "blue"
                    ? "#eff6ff"
                    : "white",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              marginBottom: "1rem"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem"
              }}
            >
              <h4>Dashboard: {selectedReport.name}</h4>
              <button
                onClick={() => handleGenerateReport(selectedReport.id)}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor:
                    theme === "dark"
                      ? "#3b82f6"
                      : theme === "blue"
                        ? "#3b82f6"
                        : "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Generate New Report
              </button>
            </div>

            {getLatestReportData(selectedReport.id) ? (
              <div>
                <div
                  style={{
                    padding: "1rem",
                    backgroundColor:
                      theme === "dark"
                        ? "#4b5563"
                        : theme === "blue"
                          ? "#eff6ff"
                          : "#f9fafb",
                    borderRadius: "4px",
                    marginBottom: "1rem"
                  }}
                >
                  <h5>
                    Latest Report Data (Generated:{" "}
                    {formatDate(
                      getLatestReportData(selectedReport.id)!.generatedAt,
                    )}
                    )
                  </h5>

                  {/* Render summary data */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "1rem",
                      marginTop: "1rem"
                    }}
                  >
                    {getLatestReportData(selectedReport.id)?.data.data
                      .summary &&
                      Object.entries(
                        getLatestReportData(selectedReport.id)!.data.data
                          .summary,
                      ).map(([key, value]) => (
                        <div
                          key={key}
                          style={{
                            padding: "1rem",
                            backgroundColor:
                              theme === "dark"
                                ? "#374151"
                                : theme === "blue"
                                  ? "#dbeafe"
                                  : "white",
                            borderRadius: "4px",
                            textAlign: "center"
                          }}
                        >
                          <div
                            style={{
                              fontSize: "1.5rem",
                              fontWeight: "bold",
                              color: getReportTypeColor(selectedReport.type)
                            }}
                          >
                            {typeof value === "number"
                              ? value.toLocaleString()
                              : value}
                          </div>
                          <div
                            style={{
                              fontSize: "0.9rem",
                              color: "#6b7280",
                              textTransform: "capitalize"
                            }}
                          >
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Render charts if available */}
                  {getLatestReportData(selectedReport.id)?.data.data.charts &&
                    getLatestReportData(
                      selectedReport.id,
                    )!.data.data.charts.map((chart: any, index: number) => (
                      <div
                        key={index}
                        style={{
                          marginTop: "1.5rem",
                          padding: "1rem",
                          backgroundColor:
                            theme === "dark"
                              ? "#374151"
                              : theme === "blue"
                                ? "#dbeafe"
                                : "white",
                          borderRadius: "4px"
                        }}
                      >
                        <h6>{chart.title}</h6>
                        <div
                          style={{
                            height: "200px",
                            display: "flex",
                            alignItems: "flex-end",
                            justifyContent: "space-around",
                            padding: "1rem",
                            marginTop: "1rem"
                          }}
                        >
                          {chart.data &&
                            chart.data.map((item: any, i: number) => (
                              <div key={i} style={{ textAlign: "center" }}>
                                <div
                                  style={{
                                    width: "30px",
                                    backgroundColor: getReportTypeColor(
                                      selectedReport.type,
                                    ),
                                    height: `${Math.min(100, (item.value / Math.max(...chart.data.map((d: any) => d.value))) * 100)}%`,
                                    marginBottom: "0.5rem"
                                  }}
                                />
                                <div style={{ fontSize: "0.7rem" }}>
                                  {item.date || item.time || item.name}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  color: "#9ca3af"
                }}
              >
                No generated reports for this report type yet. Click "Generate
                New Report" to create one.
              </div>
            )}
          </div>
        </div>
      )}

      {!loading && activeTab === "dashboard" && !selectedReport && (
        <div style={{ textAlign: "center", padding: "2rem", color: "#9ca3af" }}>
          <h4>Select a report to view its dashboard</h4>
          <p style={{ marginTop: "1rem" }}>
            Choose a report from the "Reports" tab to view its dashboard here.
          </p>
        </div>
      )}
    </div>
  );
};

export default Reporting;
