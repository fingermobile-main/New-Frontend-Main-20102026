import React, { useState, useEffect } from 'react';
import subscriptionService from "../services/subscriptionService";
import { useAppContext } from "../contexts/AppContext.tsx";

const SubscriptionManager = () => {
  const { showToast } = useAppContext();
  const [subscription, setSubscription] = React.useState(null);
  const [plans, setPlans] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [actionLoading, setActionLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [selectedPlan, setSelectedPlan] = React.useState("");
  const [selectedDuration, setSelectedDuration] = React.useState("monthly");

  React.useEffect(() => {
    fetchSubscriptionData();
    fetchSubscriptionPlans();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      const response = await subscriptionService.getSubscription();
      if (response.success) {
        setSubscription(response.subscription);
      }
    } catch (err) {
      setError("Failed to load subscription data");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptionPlans = async () => {
    try {
      const response = await subscriptionService.getSubscriptionPlans();
      if (response.success) {
        setPlans(response.plans);
      }
    } catch (err) {
      console.error("Failed to load subscription plans");
    }
  };

  const handlePurchase = async () => {
    if (!selectedPlan) {
      showToast("Please select a plan", "error");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to purchase the ${plans[selectedPlan]?.name} (${selectedDuration}) plan?`,
      )
    ) {
      return;
    }

    try {
      setActionLoading(true);
      const response = await subscriptionService.purchaseSubscription(
        selectedPlan,
        selectedDuration,
      );
      if (response.success) {
        showToast("Subscription purchased successfully!", "success");
        setSubscription(response.subscription);
        setSelectedPlan("");
      } else {
        showToast(response.message || "Failed to purchase subscription", "error");
      }
    } catch (err) {
      showToast("Failed to purchase subscription. Please try again.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel your subscription?")) {
      return;
    }

    try {
      setActionLoading(true);
      const response = await subscriptionService.cancelSubscription();
      if (response.success) {
        showToast("Subscription cancelled successfully!", "success");
        setSubscription(response.subscription);
      } else {
        showToast(response.message || "Failed to cancel subscription", "error");
      }
    } catch (err) {
      showToast("Failed to cancel subscription. Please try again.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const getPlanPrice = (planKey, duration) => {
    if (!plans[planKey]) return 0;
    return duration === "monthly"
      ? plans[planKey].monthlyPrice
      : plans[planKey].yearlyPrice;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Subscription Management</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-red-500 mr-2 mt-0.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h3 className="text-red-800 font-medium">Error</h3>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Current Subscription */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white mb-8">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm opacity-80">Current Subscription</p>
              <h3 className="text-2xl font-bold mt-1">
                {subscription?.status === "active"
                  ? "Active"
                  : subscription?.status === "trialing"
                    ? "Trial"
                    : "Inactive"}
              </h3>
              {subscription?.expiryDate && (
                <p className="mt-2 opacity-90">
                  Expires on: {formatDate(subscription.expiryDate)}
                </p>
              )}
            </div>
            <div className="bg-white bg-opacity-20 rounded-full p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Available Plans</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(plans).map(([key, plan]) => (
              <div
                key={key}
                className={`border rounded-xl p-6 transition-all cursor-pointer ${
                  selectedPlan === key
                    ? "border-brand-blue ring-2 ring-brand-blue ring-opacity-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedPlan(key)} role="button" tabIndex={0}
              >
                <h4 className="font-bold text-lg mb-2">{plan.name}</h4>
                <div className="mb-4">
                  <p className="text-3xl font-bold">
                    {selectedDuration === "monthly"
                      ? plan.monthlyPrice
                      : plan.yearlyPrice}{" "}
                    FIC
                    <span className="text-sm font-normal text-gray-500">
                      /{selectedDuration === "monthly" ? "month" : "year"}
                    </span>
                  </p>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Duration Selector */}
          <div className="mt-6 flex items-center">
            <span className="mr-4 font-medium">Billing:</span>
            <div className="flex space-x-4">
              <button
                className={`px-4 py-2 rounded-lg ${
                  selectedDuration === "monthly"
                    ? "bg-brand-blue text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setSelectedDuration("monthly")}
              >
                Monthly
              </button>
              <button
                className={`px-4 py-2 rounded-lg ${
                  selectedDuration === "yearly"
                    ? "bg-brand-blue text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setSelectedDuration("yearly")}
              >
                Yearly
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4">
          {selectedPlan && (
            <button
              onClick={handlePurchase}
              disabled={actionLoading}
              className={`px-6 py-3 bg-brand-blue text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors ${
                actionLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {actionLoading
                ? "Processing..."
                : `Purchase ${plans[selectedPlan]?.name}`}
            </button>
          )}

          {subscription?.status === "active" && (
            <button
              onClick={handleCancel}
              disabled={actionLoading}
              className={`px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors ${
                actionLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {actionLoading ? "Processing..." : "Cancel Subscription"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManager;
