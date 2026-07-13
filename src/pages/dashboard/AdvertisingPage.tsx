import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import type { AdCampaign } from '../../types';
import PartnerHouseWidget from '../../components/dashboard/PartnerHouseWidget';

const AdvertisingPage: React.FC = () => {
  const { adCampaigns, showToast } = useAppContext();
  const [ficBalance, setFicBalance] = React.useState(0);

  // Required placeholder functions
  const onLike = async (postId: string) => {
    try {
      console.info("Liking post:", postId);
      // Implement like functionality
      showToast("Post liked", "success");
    } catch (error) {
      console.error("Error liking post:", error);
      showToast("Failed to like post", "error");
    }
  };

  const onAddComment = async (postId: string, comment: string) => {
    try {
      console.info("Adding comment to post:", postId, comment);
      // Implement comment functionality
      showToast("Comment added", "success");
    } catch (error) {
      console.error("Error adding comment:", error);
      showToast("Failed to add comment", "error");
    }
  };

  const onOpenGiftModal = (postId: string) => {
    console.info("Opening gift modal for post:", postId);
    // Implement gift modal functionality
    showToast("Opening gift modal", "info");
  };

  const onOpenPaylinkModal = (postId: string) => {
    console.info("Opening paylink modal for post:", postId);
    // Implement paylink modal functionality
    showToast("Opening paylink modal", "info");
  };

  const onVote = async (postId: string, voteType: "up" | "down") => {
    try {
      console.info("Voting on post:", postId, voteType);
      // Implement voting functionality
      showToast(`Voted ${voteType}`, "success");
    } catch (error) {
      console.error("Error voting on post:", error);
      showToast("Failed to vote", "error");
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      console.info("Deleting post:", postId);
      // Implement post deletion
      showToast("Post deleted", "success");
    } catch (error) {
      console.error("Error deleting post:", error);
      showToast("Failed to delete post", "error");
    }
  };

  const handleTokenizePost = async (postId: string) => {
    try {
      console.info("Tokenizing post:", postId);
      // Implement post tokenization
      showToast("Post tokenized", "success");
    } catch (error) {
      console.error("Error tokenizing post:", error);
      showToast("Failed to tokenize post", "error");
    }
  };

  const handleAiAssist = async (postId: string) => {
    try {
      console.info("AI assisting post:", postId);
      // Implement AI assistance
      showToast("AI assistance requested", "info");
    } catch (error) {
      console.error("Error with AI assist:", error);
      showToast("AI assistance failed", "error");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Advertising Management</h1>

      <div className="mb-8">
        <PartnerHouseWidget />
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-semibold text-sm">Campaign ID</th>
              <th className="p-4 font-semibold text-sm">Creator</th>
              <th className="p-4 font-semibold text-sm">Targeting</th>
              <th className="p-4 font-semibold text-sm">Budget (FIC)</th>
              <th className="p-4 font-semibold text-sm">Status</th>
              <th className="p-4 font-semibold text-sm">End Date</th>
              <th className="p-4 font-semibold text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(adCampaigns || []).map((campaign: AdCampaign) => (
              <tr
                key={campaign.id}
                className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
              >
                <td className="p-4 text-sm font-mono">{campaign.id}</td>
                <td className="p-4 text-sm font-semibold">
                  {(campaign as any).creatorId}
                </td>
                <td className="p-4 text-xs">
                  <p>
                    <strong>Geo:</strong> {(campaign as any).targeting.geo}
                  </p>
                  <p>
                    <strong>Age:</strong> {(campaign as any).targeting.age}
                  </p>
                  <p>
                    <strong>Interests:</strong>{" "}
                    {(campaign as any).targeting.interests.join(", ")}
                  </p>
                </td>
                <td className="p-4 text-sm">{campaign.budget} FIC</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      campaign.status === "active"
                        ? "bg-green-100 text-green-800"
                        : campaign.status === "paused"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {campaign.status}
                  </span>
                </td>
                <td className="p-4 text-sm">
                  {new Date(campaign.endDate).toLocaleDateString()}
                </td>
                <td className="p-4 text-right">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-3">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                    Pause
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdvertisingPage;
