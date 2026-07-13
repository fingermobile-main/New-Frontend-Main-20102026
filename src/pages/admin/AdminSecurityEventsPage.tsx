import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';

interface SecurityEvent {
  id: string;
  timestamp: string;
  eventType: string;
  source: string;
  description: string;
  severity: string;
}

const AdminSecurityEventsPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [securityEvents, setSecurityEvents] = React.useState<SecurityEvent[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const { getToken } = useAuth();

  React.useEffect(() => {
    const fetchSecurityEvents = async () => {
      try {
        const token = getToken();
        // Simulate API call or replace with actual endpoint
        // const response = await axios.get("/api/admin/security-events", { ... });
        // setSecurityEvents(response.data);
        setSecurityEvents([]); // Placeholder
      } catch (err) {
        setError("Failed to fetch security events.");
        console.error("Error fetching security events:", err);
        showToast("Failed to fetch security events", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchSecurityEvents();
  }, [getToken, showToast]);

  if (loading) {
    return <div className="text-center py-8">Loading security events...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Security Events</h1>
      {securityEvents.length === 0 ? (
        <p className="text-gray-600">No security events to display.</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {securityEvents.map((event) => (
                <tr key={event.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(event.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.eventType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.source}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.description}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-medium 
                    ${
                      event.severity === "high"
                        ? "text-red-600"
                        : event.severity === "medium"
                          ? "text-yellow-600"
                          : "text-green-600"
                    }
                  `}
                  >
                    {event.severity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default AdminSecurityEventsPage;
