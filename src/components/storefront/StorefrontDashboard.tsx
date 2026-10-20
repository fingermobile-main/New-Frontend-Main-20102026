import React, { useState, useEffect } from 'react';
import { storefrontService, Storefront, StorefrontAnalyticsDaily } from '../../services/storefrontService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DollarSign, Users, ShoppingCart, TrendingUp, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const StorefrontDashboard: React.FC = () => {
  const { user } = useAuth();

  // Ensure userId is properly typed as string
  const userIdString = user?.id?.toString() || '';
  const [storefronts, setStorefronts] = useState<Storefront[]>([]);
  const [userStorefront, setUserStorefront] = useState<Storefront | null>(null);
  const [analytics, setAnalytics] = useState<StorefrontAnalyticsDaily | null>(null);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStorefronts = async () => {
      try {
        setLoading(true);
        const storefrontsData = await storefrontService.getUserStorefronts(userIdString);
        setStorefronts(storefrontsData);

        if (storefrontsData.length > 0) {
          setUserStorefront(storefrontsData[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStorefronts();
    }
  }, [userIdString]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        if (userStorefront) {
          const stats = await storefrontService.getDashboardStats(userStorefront.id);
          // Create a mock StorefrontAnalyticsDaily from today's stats
          setAnalytics({
            id: 'today',
            storefront_id: userStorefront.id,
            date: new Date().toISOString().split('T')[0],
            page_views: stats.today.visitors,
            unique_visitors: stats.today.visitors,
            orders_count: stats.today.orders,
            total_revenue: stats.today.revenue,
            average_order_value: stats.today.orders > 0 ? stats.today.revenue / stats.today.orders : 0,
            conversion_rate: 0,
            add_to_cart_count: 0,
            cart_abandonment_rate: 0,
            top_product_id: undefined,
            top_product_revenue: 0,
            new_customers: 0,
            returning_customers: 0,
            net_platform_earnings: 0
          });
          setLowStockCount(stats.low_stock_count);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    };

    if (userStorefront) {
      fetchAnalytics();
    }
  }, [userStorefront]);

  const mockStorefront = {
    id: '1',
    owner_id: userIdString,
    name: 'My Premium Store',
    slug: 'my-premium-store',
    description: 'Luxury fashion and accessories',
    business_type: 'boutique',
    is_active: true,
    is_verified: true,
    verification_badge: 'verified',
    currency: 'USD',
    timezone: 'UTC',
    language: 'en',
    analytics_enabled: true,
    subscription_tier: 'free'
  };

  const mockAnalytics = {
    id: '1',
    storefront_id: '1',
    date: new Date().toISOString().split('T')[0],
    page_views: 1250,
    unique_visitors: 450,
    orders_count: 28,
    total_revenue: 5680,
    average_order_value: 202.86,
    conversion_rate: 0.0622,
    add_to_cart_count: 145,
    cart_abandonment_rate: 0.65,
    new_customers: 12,
    returning_customers: 16,
    net_platform_earnings: 0
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Storefront Dashboard</h1>
        <p className="text-slate-700 font-medium">Monitor your store performance and inventory</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-800">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics?.total_revenue.toLocaleString() || 0}</div>
            <p className="text-xs text-slate-700 font-medium">Today's sales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-800">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.orders_count || 0}</div>
            <p className="text-xs text-slate-700 font-medium">Today's orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-800">Visitors</CardTitle>
            <Users className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.unique_visitors || 0}</div>
            <p className="text-xs text-slate-700 font-medium">Unique visitors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-800">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics ? `${(analytics.conversion_rate * 100).toFixed(2)}%` : '0%'}
            </div>
            <p className="text-xs text-slate-700 font-medium">Visitor to buyer</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockCount > 0 && (
        <Card className="border-orange-500 bg-orange-50 dark:bg-orange-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
              <AlertCircle className="h-5 w-5" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              {lowStockCount} products are running low on inventory and need restocking.
            </p>
            <Button variant="outline">View Low Stock Items</Button>
          </CardContent>
        </Card>
      )}

      {/* Storefront Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Your Storefronts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {storefronts.map(storefront => (
              <div key={storefront.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{storefront.name}</h3>
                    {storefront.is_verified && (
                      <Badge variant="default">Verified</Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-700 font-medium mt-1">
                    {storefront.description}
                  </p>
                  <div className="flex gap-2 mt-2 text-xs text-slate-600 font-medium">
                    <span>{storefront.currency}</span>
                    <span>•</span>
                    <span>{storefront.timezone}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Manage Products</Button>
                  <Button size="sm">View Analytics</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-slate-700 font-medium mb-1">Page Views</p>
              <p className="text-2xl font-bold">{analytics?.page_views || 0}</p>
            </div>
            <div>
              <p className="text-sm text-slate-700 font-medium mb-1">Add to Cart</p>
              <p className="text-2xl font-bold">{analytics?.add_to_cart_count || 0}</p>
            </div>
            <div>
              <p className="text-sm text-slate-700 font-medium mb-1">Avg Order Value</p>
              <p className="text-2xl font-bold">${analytics?.average_order_value.toFixed(2) || '0.00'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-700 font-medium mb-1">Cart Abandonment</p>
              <p className="text-2xl font-bold">
                {analytics ? `${(analytics.cart_abandonment_rate * 100).toFixed(1)}%` : '0%'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StorefrontDashboard;
