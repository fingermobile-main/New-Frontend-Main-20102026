import React from 'react';
import { useAppContext } from "contexts/AppContext";  // Using absolute path from src
import Wallet from '../../components/financials/Wallet';
import { Transaction } from '../../types';
import apiService from '../../services/apiService';
import PageHeader from '../../components/PageHeader';
import AnimatedAvatar from '../../components/AnimatedAvatar';
import { NIGERIAN_BANKS } from '../../constants';

interface PayoutRequest {
  id: string;
  status: "Pending" | "Completed" | "Failed";
  member?: {
    avatarUrl?: string;
    name?: string;
    id?: string;
  };
  amount?: number;
  bankName?: string;
  accountNumber?: string;
  date?: string;
}

const PaymentPayoutsPage: React.FC = () => {
  const { ficBalance, payoutRequests, handleInitiatePayout, showToast } =
    useAppContext();
  const [showGiftModal, setShowGiftModal] = React.useState(false);
  const [showPaylinkModal, setShowPaylinkModal] = React.useState(false);

  // State for the form
  const [amount, setAmount] = React.useState("");
  const [bankName, setBankName] = React.useState(NIGERIAN_BANKS[0].name);
  const [accountNumber, setAccountNumber] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payoutData = {
      amount: parseInt(amount, 10),
      bankName,
      accountNumber
    };

    if (isNaN(payoutData.amount) || payoutData.amount <= 0) {
      showToast("Please enter a valid positive amount");
      return;
    }

    if (!payoutData.bankName) {
      showToast("Please select a bank");
      return;
    }

    if (
      !payoutData.accountNumber ||
      payoutData.accountNumber.length < 10 ||
      !/^[0-9]+$/.test(payoutData.accountNumber)
    ) {
      showToast("Please enter a valid account number (at least 10 digits)");
      return;
    }

    try {
      handleInitiatePayout(payoutData.amount, payoutData.bankName || 'bank');
      showToast("Payout request initiated successfully");
    } catch (error) {
      console.error("Payout initiation failed:", error);
      showToast("Failed to initiate payout. Please try again.");
    }

    // Reset form
    setAmount("");
    setBankName(NIGERIAN_BANKS[0].name);
    setAccountNumber("");
  };

  const onLike = (payoutId: string) => {
    console.info("Liking payout:", payoutId);
    showToast("Like registered successfully");
  };

  const onAddComment = (payoutId: string) => {
    console.info("Adding comment to payout:", payoutId);
    showToast("Comment added successfully");
  };

  const onOpenGiftModal = (payoutId: string) => {
    console.info("Opening gift modal for payout:", payoutId);
    setShowGiftModal(true);
  };

  const onOpenPaylinkModal = (payoutId: string) => {
    console.info("Opening paylink modal for payout:", payoutId);
    setShowPaylinkModal(true);
  };

  const onVote = (payoutId: string, voteType: "up" | "down") => {
    console.info("Voting on payout:", payoutId, voteType);
    showToast(`Vote ${voteType} registered successfully`);
  };

  const handleTokenizePayout = (payoutId: string) => {
    console.info("Tokenizing payout:", payoutId);
    showToast("Payout tokenization initiated");
  };

  const handleAiAssist = (payoutId: string) => {
    console.info("AI assistance requested for payout:", payoutId);
    showToast("AI assistance initiated");
  };

  const pendingRequests =
    payoutRequests?.filter((p) => p.status === "pending") || [];
  const processedRequests =
    payoutRequests?.filter((p) => p.status !== "pending") || [];

  const PayoutRequestCard: React.FC<{ request: any }> = ({
    request
  }) => {
    const statusStyles: Record<string, string> = {
      Pending: "bg-yellow-100 text-yellow-800",
      Completed: "bg-green-100 text-green-800",
      Failed: "bg-red-100 text-red-800"
    };

    return (
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <AnimatedAvatar
              staticUrl={request.member?.avatarUrl}
              altText={request.member?.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold">{request.member?.name}</p>
              <p className="text-xs text-gray-500">{request.member?.id}</p>
            </div>
          </div>
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[request.status]}`}
          >
            {request.status}
          </span>
        </div>
        <div className="mt-3 border-t pt-3 space-y-1 text-sm">
          <p>
            <strong>Amount:</strong> {request.amount?.toLocaleString()} FIC
          </p>
          <p>
            <strong>Bank:</strong> {request.bankName} - {request.accountNumber}
          </p>
          <p>
            <strong>Date:</strong> {request.date}
          </p>
        </div>
        <div className="flex items-center gap-2 mt-4 pt-3 border-t">
          <button
            onClick={() => onLike(request.id)}
            className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
          >
            Like
          </button>
          <button
            onClick={() => onAddComment(request.id)}
            className="px-3 py-1 text-sm bg-green-50 text-green-600 rounded hover:bg-green-100"
          >
            Comment
          </button>
          <button
            onClick={() => onOpenGiftModal(request.id)}
            className="px-3 py-1 text-sm bg-purple-50 text-purple-600 rounded hover:bg-purple-100"
          >
            Gift
          </button>
          <button
            onClick={() => onOpenPaylinkModal(request.id)}
            className="px-3 py-1 text-sm bg-yellow-50 text-yellow-600 rounded hover:bg-yellow-100"
          >
            Paylink
          </button>
          <button
            onClick={() => onVote(request.id, "up")}
            className="px-3 py-1 text-sm bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100"
          >
            Vote
          </button>
          <button
            onClick={() => handleTokenizePayout(request.id)}
            className="px-3 py-1 text-sm bg-pink-50 text-pink-600 rounded hover:bg-pink-100"
          >
            Tokenize
          </button>
          <button
            onClick={() => handleAiAssist(request.id)}
            className="px-3 py-1 text-sm bg-gray-50 text-gray-600 rounded hover:bg-gray-100"
          >
            AI Assist
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <PageHeader
          title="Payment Payouts"
          description="Manage your payment payouts and withdrawals."
          actionText="+ Request Payout"
          onAction={() => setShowPaylinkModal(true)}
        />
        <div className="bg-blue-50 px-4 py-2 rounded-lg">
          <p className="text-sm text-blue-600 font-medium">FIC Balance</p>
          <p className="text-lg font-bold text-blue-700">{ficBalance}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Request Payout</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Amount (FIC)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Bank
                  </label>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    required
                  >
                    {NIGERIAN_BANKS.map((bank) => (
                      <option key={bank.code} value={bank.name}>
                        {bank.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Payout Request
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Lists */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-xl font-bold mb-4">
              Pending Requests ({pendingRequests.length})
            </h2>
            {pendingRequests.length > 0 ? (
              <div className="space-y-4">
                {pendingRequests.map((req) => (
                  <PayoutRequestCard key={req.id} request={req} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm bg-white p-6 rounded-lg text-center">
                No pending payout requests.
              </p>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">Payout History</h2>
            {processedRequests.length > 0 ? (
              <div className="space-y-4">
                {processedRequests.map((req) => (
                  <PayoutRequestCard key={req.id} request={req} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm bg-white p-6 rounded-lg text-center">
                No processed payouts yet.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Gift Modal */}
      {showGiftModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Send Gift
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Your FIC Balance: {ficBalance}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowGiftModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
                Send Gift
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Paylink Modal */}
      {showPaylinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Create Payment Link
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Your FIC Balance: {ficBalance}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPaylinkModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
                Create Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPayoutsPage;
