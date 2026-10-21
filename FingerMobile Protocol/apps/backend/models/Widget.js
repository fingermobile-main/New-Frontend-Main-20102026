const { DataTypes, Model } = require('sequelize');

class Widget extends Model {}

module.exports = (sequelize) => {
  Widget.init(
    {
      id: {
        type: DataTypes.STRING(64),
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(128),
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING(128),
        unique: true,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING(64),
        defaultValue: 'rotational',
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      subtitle: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      category: {
        type: DataTypes.STRING(64),
        defaultValue: 'general',
      },
      isPermanent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_permanent',
      },
      displayLocation: {
        type: DataTypes.STRING(64),
        defaultValue: 'right_column_dynamic',
        field: 'display_location',
      },
      rotationIntervalMinutes: {
        type: DataTypes.INTEGER,
        defaultValue: 120,
        field: 'rotation_interval_minutes',
      },
      rotationPriority: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        field: 'rotation_priority',
      },
      lastRotatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'last_rotated_at',
      },
      nextRotationAt: {
        type: DataTypes.DATE,
        field: 'next_rotation_at',
      },
      scheduleStartDate: {
        type: DataTypes.DATE,
        field: 'schedule_start_date',
      },
      scheduleEndDate: {
        type: DataTypes.DATE,
        field: 'schedule_end_date',
      },
      scheduleTimeWindow: {
        type: DataTypes.JSONB,
        defaultValue: { active_all_day: true, start_time: '00:00', end_time: '23:59' },
        field: 'schedule_time_window',
      },
      images: {
        type: DataTypes.JSONB,
        defaultValue: [],
      },
      videos: {
        type: DataTypes.JSONB,
        defaultValue: [],
      },
      primaryImageUrl: {
        type: DataTypes.STRING(1024),
        field: 'primary_image_url',
      },
      primaryVideoUrl: {
        type: DataTypes.STRING(1024),
        field: 'primary_video_url',
      },
      videoPosterUrl: {
        type: DataTypes.STRING(1024),
        field: 'video_poster_url',
      },
      actionUrl: {
        type: DataTypes.STRING(1024),
        allowNull: false,
        field: 'action_url',
      },
      ctaText: {
        type: DataTypes.STRING(64),
        defaultValue: 'Explore Now',
        field: 'cta_text',
      },
      secondaryActionUrl: {
        type: DataTypes.STRING(1024),
        field: 'secondary_action_url',
      },
      secondaryCtaText: {
        type: DataTypes.STRING(64),
        field: 'secondary_cta_text',
      },
      badgeText: {
        type: DataTypes.STRING(64),
        field: 'badge_text',
      },
      accentColor: {
        type: DataTypes.STRING(32),
        defaultValue: '#059669',
        field: 'accent_color',
      },
      badgeStyle: {
        type: DataTypes.STRING(64),
        defaultValue: 'emerald',
        field: 'badge_style',
      },
      edgeStyle: {
        type: DataTypes.STRING(64),
        defaultValue: 'glassmorphism',
        field: 'edge_style',
      },
      status: {
        type: DataTypes.STRING(32),
        defaultValue: 'active',
      },
      clicks: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
      },
      impressions: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
      },
      conversions: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
      },
      shares: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
      },
      avgEngagementSeconds: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
        field: 'avg_engagement_seconds',
      },
      analytics: {
        type: DataTypes.JSONB,
        defaultValue: {
          hourly_clicks: {},
          geographic_distribution: {},
          device_breakdown: { desktop: 0, mobile: 0, tablet: 0 },
          historical_ctr: 0.0,
          feedback_scores: { positive: 0, neutral: 0, negative: 0 },
          feedback_comments: [],
        },
      },
      metadata: {
        type: DataTypes.JSONB,
        defaultValue: {},
      },
    },
    {
      sequelize,
      modelName: 'Widget',
      tableName: 'widgets',
      timestamps: true,
      underscored: true,
    }
  );

  return Widget;
};
