import {
  AdsMetric,
  AdsPerformanceData,
  TopPerformingCampaign,
  PerformanceMetric,
  DemographicData,
  InterestData,
  GeographicData
} from '../types/ads';

export const adsMetricsData: AdsMetric[] = [
  {name: 'Ad Spend',
    value: '₦2.4M',
    change: 8.3,
    icon: 'CurrencyDollarIcon',
    color: 'bg-blue-500'
  },
  {name: 'Ad Clicks',
    value: '1.2M',
    change: 12.7,
    icon: 'EyeIcon',
    color: 'bg-green-500'
  },
  {name: 'Click-Through Rate',
    value: '3.2%',
    change: -1.2,
    icon: 'ChartBarIcon',
    color: 'bg-yellow-500'
  },
  {name: 'Cost Per Thousand',
    value: '₦240',
    change: -3.1,
    icon: 'ArrowTrendingUpIcon',
    color: 'bg-purple-500'
  }
];

export const adsPerformanceData: AdsPerformanceData[] = [
  {id: '1',
    campaign: 'Summer Promotion',
    budget: '₦500K',
    spend: '₦320K',
    clicks: '245K',
    impressions: '8.2M',
    ctr: '4.2%',
    cpm: '₦242',
    conversions: '2.4K',
    convRate: '0.98%',
    status: 'Active'
  },
  {id: '2',
    campaign: 'New Year Sale',
    budget: '₦300K',
    spend: '₦280K',
    clicks: '180K',
    impressions: '6.8M',
    ctr: '3.8%',
    cpm: '₦251',
    conversions: '1.8K',
    convRate: '1.0%',
    status: 'Completed'
  },
  {id: '3',
    campaign: 'Valentine Special',
    budget: '₦400K',
    spend: '₦120K',
    clicks: '95K',
    impressions: '3.5M',
    ctr: '3.1%',
    cpm: '₦238',
    conversions: '0.9K',
    convRate: '0.95%',
    status: 'Active'
  },
  {id: '4',
    campaign: 'Back to School',
    budget: '₦350K',
    spend: '₦95K',
    clicks: '78K',
    impressions: '2.9M',
    ctr: '2.7%',
    cpm: '₦248',
    conversions: '0.7K',
    convRate: '0.89%',
    status: 'Paused'
  }
];

export const topPerformingCampaignsData: TopPerformingCampaign[] = [
  {name: 'Summer Promotion',
    value: '4.2%',
    change: 12.5 },
  {name: 'New Year Sale',
    value: '3.8%',
    change: 8.3 },
  {name: 'Valentine Special',
    value: '3.1%',
    change: 5.7 },
  {name: 'Back to School',
    value: '2.7%',
    change: -1.2 }
];

export const performanceMetricsData: PerformanceMetric[] = [
  {id: '1',
    metric: 'Click-Through Rate',
    value: '3.2%',
    change: '+0.4%',
    benchmark: '2.8%',
    industry: '2.1%'
  },
  {id: '2',
    metric: 'Conversion Rate',
    value: '1.8%',
    change: '-0.1%',
    benchmark: '2.2%',
    industry: '1.9%'
  },
  {id: '3',
    metric: 'Cost Per Click',
    value: '₦24.50',
    change: '-₦1.20',
    benchmark: '₦25.70',
    industry: '₦28.30'
  },
  {id: '4',
    metric: 'Return on Ad Spend',
    value: '4.2x',
    change: '+0.3x',
    benchmark: '3.8x',
    industry: '3.1x'
  },
  {id: '5',
    metric: 'Cost Per Acquisition',
    value: '₦152.30',
    change: '-₦8.70',
    benchmark: '₦161.00',
    industry: '₦178.50'
  }
];

export const demographicsData: DemographicData[] = [
  {category: 'Age 18-24',
    percentage: 32,
    value: '39.8K' },
  {category: 'Age 25-34',
    percentage: 28,
    value: '34.9K' },
  {category: 'Age 35-44',
    percentage: 18,
    value: '22.4K' },
  {category: 'Age 45-54',
    percentage: 12,
    value: '14.9K' },
  {category: 'Age 55+',
    percentage: 10,
    value: '12.5K' }
];

export const interestsData: InterestData[] = [
  {interest: 'Technology',
    percentage: 45 },
  {interest: 'Fashion',
    percentage: 38 },
  {interest: 'Travel',
    percentage: 32 },
  {interest: 'Food & Dining',
    percentage: 28 },
  {interest: 'Fitness',
    percentage: 25 }
];

export const geographicData: GeographicData[] = [
  {country: 'Nigeria',
    percentage: 65,
    members: '124K' },
  {country: 'Ghana',
    percentage: 15,
    members: '28K' },
  {country: 'UAE',
    percentage: 10,
    members: '19K' },
  {country: 'UK',
    percentage: 5,
    members: '9.5K' },
  {country: 'Others',
    percentage: 5,
    members: '9.5K' }
];
