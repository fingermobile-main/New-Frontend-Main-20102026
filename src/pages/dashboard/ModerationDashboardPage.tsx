import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';

const ModerationDashboardPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [activeTab, setActiveTab] = useState("pending");
  const [filter, setFilter] = useState("all");

  // Mock data for content requiring moderation
  const pendingContent = [
    {
      id: 1,
      type: "post",
      member: "John Doe",
      content: "This is a potentially inappropriate post that needs review...",
      timestamp: "2023-06-15 14:30",
      category: "Violence",
      priority: "high"
    },
    {
      id: 2,
      type: "comment",
      member: "Jane Smith",
      content: "Offensive comment that violates community guidelines",
      timestamp: "2023-06-15 13:45",
      category: "Hate Speech",
      priority: "medium"
    },
    {
      id: 3,
      type: "image",
      member: "Alex Johnson",
      content: "Image that may violate content policies",
      timestamp: "2023-06-15 12:15",
      category: "Nudity",
      priority: "low"
    }
  ];

  const flaggedMembers = [
    {
      id: 1,
      name: "John Doe",
      membername: "@johndoe",
      reports: 12,
      status: "active",
      lastActivity: "2023-06-15 10:30"
    },
    {
      id: 2,
      name: "Jane Smith",
      membername: "@janesmith",
      reports: 8,
      status: "suspended",
      lastActivity: "2023-06-14 16:45"
    }
  ];

  const moderationStats = [
    { name: "Pending Review", value: "24", change: "+3%" },
    { name: "Reviewed Today", value: "142", change: "+12%" },
    { name: "Content Removed", value: "7", change: "-2%" },
    { name: "Members Warned", value: "3", change: "0%" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Content Moderation Dashboard
          </h1>
          <p className="text-gray-600">
            Review and manage member-generated content reports
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {moderationStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              <div className="mt-2 flex items-baseline">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="ml-2 text-sm font-medium text-green-500">
                  {stat.change}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Dashboard Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("pending")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "pending"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Pending Review
              </button>
              <button
                onClick={() => setActiveTab("flagged")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "flagged"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Flagged Members
              </button>
              <button
                onClick={() => setActiveTab("reports")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "reports"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Reports
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "settings"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Settings
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Pending Review Tab */}
            {activeTab === "pending" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Content Pending Review
                  </h3>
                  <div className="flex gap-3">
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                    >
                      <option value="all">All Categories</option>
                      <option value="violence">Violence</option>
                      <option value="hate">Hate Speech</option>
                      <option value="nudity">Nudity</option>
                      <option value="spam">Spam</option>
                    </select>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                      Refresh
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {pendingContent.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.priority === "high"
                                ? "bg-red-100 text-red-800"
                                : item.priority === "medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                            }`}
                          >
                            {item.priority.charAt(0).toUpperCase() +
                              item.priority.slice(1)}{" "}
                            Priority
                          </span>
                          <span className="ml-2 text-sm text-gray-500">
                            {item.type}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {item.timestamp}
                        </span>
                      </div>

                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-900">
                          {item.member}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {item.content}
                        </p>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {item.category}
                        </span>
                        <div className="flex space-x-2">
                          <button className="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700">
                            Approve
                          </button>
                          <button className="px-3 py-1 bg-yellow-500 text-white text-xs rounded-md hover:bg-yellow-600">
                            Review
                          </button>
                          <button className="px-3 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Flagged Members Tab */}
            {activeTab === "flagged" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Flagged Members
                  </h3>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                    Export List
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Member
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Reports
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Last Activity
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {flaggedMembers.map((member) => (
                        <tr key={member.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {member.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {member.membername}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {member.reports}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                member.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {member.status.charAt(0).toUpperCase() +
                                member.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {member.lastActivity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <a
                              href="#"
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View
                            </a>
                            <a
                              href="#"
                              className="ml-4 text-yellow-600 hover:text-yellow-900"
                            >
                              Warn
                            </a>
                            <a
                              href="#"
                              className="ml-4 text-red-600 hover:text-red-900"
                            >
                              Suspend
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === "reports" && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Moderation Reports
                </h3>
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No reports available
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Reports will appear here when generated.
                  </p>
                  <div className="mt-6">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                    >
                      Generate Report
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Moderation Settings
                </h3>
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4">
                      Auto-Moderation Rules
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            AI Content Filtering
                          </p>
                          <p className="text-sm text-gray-500">
                            Automatically flag potentially inappropriate content
                          </p>
                        </div>
                        <button
                          type="button"
                          className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none bg-blue-600"
                        >
                          <span className="sr-only">Use setting</span>
                          <span
                            aria-hidden="true"
                            className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 translate-x-5"
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Keyword Filtering
                          </p>
                          <p className="text-sm text-gray-500">
                            Block content containing specific keywords
                          </p>
                        </div>
                        <button
                          type="button"
                          className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none bg-gray-200"
                        >
                          <span className="sr-only">Use setting</span>
                          <span
                            aria-hidden="true"
                            className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 translate-x-0"
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4">
                      Notification Settings
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Email Notifications
                          </p>
                          <p className="text-sm text-gray-500">
                            Receive email alerts for urgent moderation requests
                          </p>
                        </div>
                        <button
                          type="button"
                          className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none bg-blue-600"
                        >
                          <span className="sr-only">Use setting</span>
                          <span
                            aria-hidden="true"
                            className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 translate-x-5"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModerationDashboardPage;