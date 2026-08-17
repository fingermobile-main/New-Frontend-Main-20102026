import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';

const ContentPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [activeTab, setActiveTab] = useState<
    "all" | "posts" | "photos" | "videos" | "music"
  >("all");

  // Placeholder functions
  const handleDeletePost = () => {
    showToast("Delete post action triggered", "info");
  };

  // Mock content data
  const contentItems = [
    {
      id: "1",
      type: "post",
      title: "New platform features",
      author: "Jane Cooper",
      status: "Published",
      date: "2023-06-15"
    },
    {
      id: "2",
      type: "photo",
      title: "Summer collection",
      author: "John Doe",
      status: "Published",
      date: "2023-06-14"
    },
    {
      id: "3",
      type: "video",
      title: "Tutorial: Getting started",
      author: "Emily Smith",
      status: "Draft",
      date: "2023-06-12"
    },
    {
      id: "4",
      type: "music",
      title: "New single release",
      author: "Michael Brown",
      status: "Published",
      date: "2023-06-10"
    },
    {
      id: "5",
      type: "post",
      title: "Community guidelines update",
      author: "Sarah Johnson",
      status: "Published",
      date: "2023-06-08"
    },
    {
      id: "6",
      type: "photo",
      title: "Behind the scenes",
      author: "David Wilson",
      status: "Pending",
      date: "2023-06-05"
    }
  ];

  const filteredContent =
    activeTab === "all"
      ? contentItems
      : contentItems.filter((item) => item.type === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Content Management
          </h1>
          <p className="mt-1 text-gray-600">Manage all platform content</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-blue-700">
            Create Content
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Content Overview
            </h3>
            <div className="mt-3 md:mt-0">
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-3 py-1 text-sm rounded-md ${
                    activeTab === "all"
                      ? "bg-brand-blue text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveTab("posts")}
                  className={`px-3 py-1 text-sm rounded-md ${
                    activeTab === "posts"
                      ? "bg-brand-blue text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Posts
                </button>
                <button
                  onClick={() => setActiveTab("photos")}
                  className={`px-3 py-1 text-sm rounded-md ${
                    activeTab === "photos"
                      ? "bg-brand-blue text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Photos
                </button>
                <button
                  onClick={() => setActiveTab("videos")}
                  className={`px-3 py-1 text-sm rounded-md ${
                    activeTab === "videos"
                      ? "bg-brand-blue text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Videos
                </button>
                <button
                  onClick={() => setActiveTab("music")}
                  className={`px-3 py-1 text-sm rounded-md ${
                    activeTab === "music"
                      ? "bg-brand-blue text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Music
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Content
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Author
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
                  Date
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContent.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {item.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.status === "Published"
                          ? "bg-green-100 text-green-800"
                          : item.status === "Draft"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-brand-blue hover:text-blue-700 mr-3"
                      onClick={() => showToast("Edit action triggered", "info")}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={handleDeletePost}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">6</span> of{" "}
                <span className="font-medium">6</span> results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Previous</span>
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    ></path>
                  </svg>
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  1
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Next</span>
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentPage;