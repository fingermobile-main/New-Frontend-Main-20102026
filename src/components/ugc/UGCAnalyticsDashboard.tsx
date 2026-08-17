import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from "contexts/AppContext";  // Using absolute path from src
import adsService from '../../services/adsService';
import monetizationService from '../../services/monetizationService';

interface AnalyticsData {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
  revenue: number;
}

interface TimeRange {
  label: string;
  value: "day" | "week" | "month" | "year";
}

interface ChartData {
  label: string;
  value: number;
}

interface TopContent {
  id: string;
  title: string;
  type: string;
  views: number;
  likes: number;
  comments: number;
}

const UGCAnalyticsDashboard = () => {
  const { showToast} = useAppContext(); // Removed unused showToast
  const [timeRange, setTimeRange] = React.useState<"day" | "week" | "month" | "year">(
    "week",
  );
  const [analyticsData, setAnalyticsData] = React.useState<
    Record<string, AnalyticsData>
  >({});
  const [viewChartData, setViewChartData] = React.useState<ChartData[]>([]);
  const [topContent, setTopContent] = React.useState<TopContent[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const timeRanges: TimeRange[] = [
    { label: "Today", value: "day" },
    { label: "This Week", value: "week" },
    { label: "This Month", value: "month" },
    { label: "This Year", value: "year" }
  ];

  React.useEffect(() => {
    // Simulate fetching analytics data
    fetchAnalyticsData();
  
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);

    try {
      // Use AdsService to fetch real metrics if available
      const adsMetrics = await adsService.getMetrics(timeRange);

      // If we have ads metrics, we could potentially update analytics data
      // For now, we'll keep the mock logic but demonstrate service usage
      console.info("Fetched ads metrics:", adsMetrics);

      // Calculate potential earnings using MonetizationService
      const estimatedViews = 100000;
      const estimatedShares = 5000;
      const calculatedEarnings = monetizationService.calculateViewEarnings(
        estimatedViews,
        estimatedShares,
      );
      console.info(
        `Estimated earnings for ${estimatedViews} views: ${calculatedEarnings} FIC`,
      );

      // Simulate API call delay
      await new Promise<void>((resolve) => {
        timerRef.current = setTimeout(() => resolve(), 800);
      });

      // Mock analytics data
      const mockAnalyticsData: Record<string, AnalyticsData> = {
        day: {
          views: 1242,
          likes: 87,
          comments: 23,
          shares: 15,
          engagementRate: 8.2,
          revenue: 24.5
        },
        week: {
          views: 8756,
          likes: 542,
          comments: 128,
          shares: 96,
          engagementRate: 7.8,
          revenue: 126.75
        },
        month: {
          views: 34298,
          likes: 2105,
          comments: 487,
          shares: 324,
          engagementRate: 8.1,
          revenue: 624.3
        },
        year: {
          views: 412560,
          likes: 28742,
          comments: 6215,
          shares: 4872,
          engagementRate: 8.4,
          revenue: 7856.2
        }
      };

      // Mock chart data for views over time
      const mockViewChartData: Record<string, ChartData[]> = {
        day: [
          { label: "12AM", value: 50 },
          { label: "4AM", value: 32 },
          { label: "8AM", value: 87 },
          { label: "12PM", value: 120 },
          { label: "4PM", value: 95 },
          { label: "8PM", value: 142 },
          { label: "11PM", value: 78 }
        ],
        week: [
          { label: "Mon", value: 1200 },
          { label: "Tue", value: 1900 },
          { label: "Wed", value: 1500 },
          { label: "Thu", value: 2100 },
          { label: "Fri", value: 1800 },
          { label: "Sat", value: 2400 },
          { label: "Sun", value: 2200 }
        ],
        month: [
          { label: "Week 1", value: 7800 },
          { label: "Week 2", value: 8200 },
          { label: "Week 3", value: 9100 },
          { label: "Week 4", value: 9200 }
        ],
        year: [
          { label: "Jan", value: 32000 },
          { label: "Feb", value: 28000 },
          { label: "Mar", value: 35000 },
          { label: "Apr", value: 31000 },
          { label: "May", value: 38000 },
          { label: "Jun", value: 42000 },
          { label: "Jul", value: 39000 },
          { label: "Aug", value: 41000 },
          { label: "Sep", value: 37000 },
          { label: "Oct", value: 34000 },
          { label: "Nov", value: 45000 },
          { label: "Dec", value: 52000 }
        ]
      };

      // Mock top content data
      const mockTopContent: TopContent[] = [
        {
          id: "1",
          title: "Summer Vacation Photos",
          type: "Image",
          views: 1200,
          likes: 87,
          comments: 24
        },
        {
          id: "2",
          title: "New Music Release",
          type: "Audio",
          views: 985,
          likes: 142,
          comments: 31
        },
        {
          id: "3",
          title: "Cooking Tutorial",
          type: "Video",
          views: 876,
          likes: 76,
          comments: 18
        },
        {
          id: "4",
          title: "Travel Guide",
          type: "Post",
          views: 624,
          likes: 52,
          comments: 14
        },
        {
          id: "5",
          title: "Artwork Collection",
          type: "Image",
          views: 542,
          likes: 68,
          comments: 9
        }
      ];

      setAnalyticsData(mockAnalyticsData);
      setViewChartData(mockViewChartData[timeRange]);
      setTopContent(mockTopContent);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      setLoading(false);
    }
  };

  const currentData = analyticsData[timeRange] || {
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    engagementRate: 0,
    revenue: 0
  };

  return (
    <div className="ugc-analytics-dashboard">
      <div className="dashboard-header">
        <h2>Content Analytics</h2>
        <div className="time-range-selector">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              className={`time-range-btn ${timeRange === range.value ? "active" : ""}`}
              onClick={() => setTimeRange(range.value)}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <p>Loading analytics data...</p>
        </div>
      ) : (
        <>
          <div className="metrics-grid">
            <div className="metric-card">
              <h3>Views</h3>
              <p className="metric-value">
                {currentData.views.toLocaleString()}
              </p>
              <p className="metric-change positive">+12.4%</p>
            </div>

            <div className="metric-card">
              <h3>Likes</h3>
              <p className="metric-value">
                {currentData.likes.toLocaleString()}
              </p>
              <p className="metric-change positive">+8.2%</p>
            </div>

            <div className="metric-card">
              <h3>Comments</h3>
              <p className="metric-value">
                {currentData.comments.toLocaleString()}
              </p>
              <p className="metric-change negative">-2.1%</p>
            </div>

            <div className="metric-card">
              <h3>Shares</h3>
              <p className="metric-value">
                {currentData.shares.toLocaleString()}
              </p>
              <p className="metric-change positive">+5.7%</p>
            </div>

            <div className="metric-card">
              <h3>Engagement Rate</h3>
              <p className="metric-value">{currentData.engagementRate}%</p>
              <p className="metric-change positive">+0.3%</p>
            </div>

            <div className="metric-card">
              <h3>Revenue</h3>
              <p className="metric-value">${currentData.revenue.toFixed(2)}</p>
              <p className="metric-change positive">+15.6%</p>
            </div>
          </div>

          <div className="chart-section">
            <h3>Views Over Time</h3>
            <div className="chart-container">
              <div className="chart-bars">
                {viewChartData.map((data, index) => (
                  <div key={index} className="chart-bar">
                    <div
                      className="bar-fill"
                      style={{
                        height: `${(data.value / Math.max(...viewChartData.map((d) => d.value))) * 100}%`
                      }}
                    ></div>
                    <span className="bar-label">{data.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="top-content">
            <h3>Top Performing Content</h3>
            <div className="content-list">
              {topContent.map((content) => (
                <div key={content.id} className="content-item">
                  <div className="content-info">
                    <h4>{content.title}</h4>
                    <p>
                      {content.type} • {content.views.toLocaleString()} views
                    </p>
                  </div>
                  <div className="content-metrics">
                    <span>{content.likes} likes</span>
                    <span>{content.comments} comments</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UGCAnalyticsDashboard;
