import React, {} from 'react';
import apiService from '../services/apiService';
import { CommunityPageType } from '../types/communityPage';

interface IntegrationTestResult {
  endpoint: string;
  status: "success" | "failed" | "pending";
  error?: string;
  data?: unknown;
}

class DatabaseIntegrationVerifier {
  private testResults: IntegrationTestResult[] = [];

  async verifyAllEndpoints(): Promise<IntegrationTestResult[]> {
    // Reset results
    this.testResults = [];

    // Test member endpoints
    await this.testMemberEndpoints();

    // Test content endpoints
    await this.testContentEndpoints();

    // Test marketplace endpoints
    await this.testMarketplaceEndpoints();

    // Test wallet endpoints
    await this.testWalletEndpoints();

    // Test community endpoints
    await this.testCommunityEndpoints();

    // Test notification endpoints
    await this.testNotificationEndpoints();

    // Test settings endpoints
    await this.testSettingsEndpoints();

    // Test analytics endpoints
    await this.testAnalyticsEndpoints();

    return this.testResults;
  }

  private async testMemberEndpoints() {
    try {
      this.updateTestStatus("/members/me", "pending");
      const result = await apiService.request("/members/me");
      this.updateTestStatus("/members/me", "success", result);
    } catch (error) {
      this.updateTestStatus(
        "/members/me",
        "failed",
        undefined,
        (error as Error).message,
      );
    }

    try {
      this.updateTestStatus("/members", "pending");
      const result = await apiService.get("/members");
      this.updateTestStatus("/members", "success", result);
    } catch (error) {
      this.updateTestStatus(
        "/members",
        "failed",
        undefined,
        (error as Error).message,
      );
    }
  }

  private async testContentEndpoints() {
    try {
      this.updateTestStatus("/posts", "pending");
      const result = await apiService.get("/posts");
      this.updateTestStatus("/posts", "success", result);
    } catch (error) {
      this.updateTestStatus(
        "/posts",
        "failed",
        undefined,
        (error as Error).message,
      );
    }

    try {
      this.updateTestStatus("/forum/posts", "pending");
      const result = await apiService.get("/forum/posts");
      this.updateTestStatus("/forum/posts", "success", result);
    } catch (error) {
      this.updateTestStatus(
        "/forum/posts",
        "failed",
        undefined,
        (error as Error).message,
      );
    }
  }

  private async testMarketplaceEndpoints() {
    try {
      this.updateTestStatus("/products", "pending");
      const result = await apiService.get("/products");
      this.updateTestStatus("/products", "success", result);
    } catch (error) {
      this.updateTestStatus(
        "/products",
        "failed",
        undefined,
        (error as Error).message,
      );
    }

    try {
      this.updateTestStatus("/ads", "pending");
      const result = await apiService.get("/ads");
      this.updateTestStatus("/ads", "success", result);
    } catch (error) {
      this.updateTestStatus(
        "/ads",
        "failed",
        undefined,
        (error as Error).message,
      );
    }
  }

  private async testWalletEndpoints() {
    try {
      this.updateTestStatus("/wallet", "pending");
      const result = await apiService.get("/wallet");
      this.updateTestStatus("/wallet", "success", result);
    } catch (error) {
      this.updateTestStatus(
        "/wallet",
        "failed",
        undefined,
        (error as Error).message,
      );
    }

    try {
      this.updateTestStatus("/transactions", "pending");
      const result = await apiService.get("/transactions");
      this.updateTestStatus("/transactions", "success", result);
    } catch (error) {
      this.updateTestStatus(
        "/transactions",
        "failed",
        undefined,
        (error as Error).message,
      );
    }
  }

  private async testCommunityEndpoints() {
    // Test with a generic community page type and ID
    const testPageType: CommunityPageType = "groups";
    const testPageId = "1";

    try {
      this.updateTestStatus(
        `/communities/${testPageType}/${testPageId}`,
        "pending",
      );
      const result = await apiService.get(`/communities/${testPageType}/${testPageId}`);
      this.updateTestStatus(
        `/communities/${testPageType}/${testPageId}`,
        "success",
        result,
      );
    } catch (error) {
      this.updateTestStatus(
        `/communities/${testPageType}/${testPageId}`,
        "failed",
        undefined,
        (error as Error).message,
      );
    }

    try {
      this.updateTestStatus(
        `/communities/${testPageType}/${testPageId}/posts`,
        "pending",
      );
      const result = await apiService.get(`/communities/${testPageType}/${testPageId}/posts`);
      this.updateTestStatus(
        `/communities/${testPageType}/${testPageId}/posts`,
        "success",
        result,
      );
    } catch (error) {
      this.updateTestStatus(
        `/communities/${testPageType}/${testPageId}/posts`,
        "failed",
        undefined,
        (error as Error).message,
      );
    }

    try {
      this.updateTestStatus(
        `/communities/${testPageType}/${testPageId}/members`,
        "pending",
      );
      const result = await apiService.get(`/communities/${testPageType}/${testPageId}/members`);
      this.updateTestStatus(
        `/communities/${testPageType}/${testPageId}/members`,
        "success",
        result,
      );
    } catch (error) {
      this.updateTestStatus(
        `/communities/${testPageType}/${testPageId}/members`,
        "failed",
        undefined,
        (error as Error).message,
      );
    }
  }

  private async testNotificationEndpoints() {
    try {
      this.updateTestStatus("/notifications", "pending");
      const result = await apiService.get("/notifications");
      this.updateTestStatus("/notifications", "success", result);
    } catch (error) {
      this.updateTestStatus(
        "/notifications",
        "failed",
        undefined,
        (error as Error).message,
      );
    }
  }

  private async testSettingsEndpoints() {
    try {
      this.updateTestStatus("/settings", "pending");
      const result = await apiService.get("/settings");
      this.updateTestStatus("/settings", "success", result);
    } catch (error) {
      this.updateTestStatus(
        "/settings",
        "failed",
        undefined,
        (error as Error).message,
      );
    }
  }

  private async testAnalyticsEndpoints() {
    try {
      this.updateTestStatus("/analytics/members", "pending");
      const result = await apiService.get("/analytics/members");
      this.updateTestStatus("/analytics/members", "success", result);
    } catch (error) {
      this.updateTestStatus(
        "/analytics/members",
        "failed",
        undefined,
        (error as Error).message,
      );
    }

    try {
      this.updateTestStatus("/analytics/content", "pending");
      const result = await apiService.get("/analytics/content");
      this.updateTestStatus("/analytics/content", "success", result);
    } catch (error) {
      this.updateTestStatus(
        "/analytics/content",
        "failed",
        undefined,
        (error as Error).message,
      );
    }

    try {
      this.updateTestStatus("/analytics/revenue", "pending");
      const result = await apiService.get("/analytics/revenue");
      this.updateTestStatus("/analytics/revenue", "success", result);
    } catch (error) {
      this.updateTestStatus(
        "/analytics/revenue",
        "failed",
        undefined,
        (error as Error).message,
      );
    }
  }

  private updateTestStatus(
    endpoint: string,
    status: "success" | "failed" | "pending",
    data?: unknown,
    error?: string,
  ) {
    const existingIndex = this.testResults.findIndex(
      (result) => result.endpoint === endpoint,
    );

    if (existingIndex !== -1) {
      // Update existing result
      this.testResults[existingIndex] = { endpoint, status, data, error };
    } else {
      // Add new result
      this.testResults.push({ endpoint, status, data, error });
    }
  }

  getTestResults(): IntegrationTestResult[] {
    return this.testResults;
  }

  getFailedTests(): IntegrationTestResult[] {
    return this.testResults.filter((result) => result.status === "failed");
  }

  getSuccessfulTests(): IntegrationTestResult[] {
    return this.testResults.filter((result) => result.status === "success");
  }

  getPendingTests(): IntegrationTestResult[] {
    return this.testResults.filter((result) => result.status === "pending");
  }
}

// Export singleton instance
const dbIntegrationVerifier = new DatabaseIntegrationVerifier();

export default dbIntegrationVerifier;