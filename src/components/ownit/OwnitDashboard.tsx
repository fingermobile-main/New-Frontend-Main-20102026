import React, { useState, useEffect } from 'react';
import { ownitService, OwnitEntry, OwnitOrder, OwnitWarrantyClaim } from '../../services/ownitService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Package, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const OwnitDashboard: React.FC = () => {
  const { member } = useAuth();

  // Ensure userId is properly typed as string
  const userIdString = member?.id ? String(member.id) : '';
  const [entries, setEntries] = useState<OwnitEntry[]>([]);
  const [orders, setOrders] = useState<OwnitOrder[]>([]);
  const [warranties, setWarranties] = useState<any[]>([]); // Change type to any[] temporarily to fix the issue
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [orderItem, setOrderItem] = useState('');
  const [warrantyItem, setWarrantyItem] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [entriesData, ordersData, warrantiesData] = await Promise.all([
          ownitService.getUserEntries(userIdString),
          ownitService.getUserOrders(userIdString),
          ownitService.getExpiringWarranties(30)
        ]);
        setEntries(entriesData);
        setOrders(ordersData);
        setWarranties(warrantiesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (member) {
      fetchData();
    }
  }, [userIdString]);

  const handleAddItem = async () => {
    if (!itemName.trim()) return;

    try {
      setLoading(true);
      const newItem = {
        id: Date.now().toString(),
        title: itemName,
        description: itemDescription,
        images: [],
        tags: ['laptop', 'work'],
        owner_id: userIdString,
        warranty_documents: [],
        created_at: '2024-01-15T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z'
      };
      const addedItem = await ownitService.createEntry(newItem);
      setEntries(prev => [...prev, addedItem]);
      setItemName('');
      setItemDescription('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrder = async () => {
    if (!orderItem.trim()) return;

    try {
      setLoading(true);
      const newOrder = {
        order_number: `ORD-${Date.now()}`,
        seller_name: 'Sample Seller',
        total_amount: 0,
        currency: 'USD',
        payment_status: 'pending' as const, // Use literal type
        status: 'processing' as const, // Use literal type
        owner_id: userIdString,
        created_at: '2024-03-20T00:00:00Z',
        updated_at: '2024-03-20T00:00:00Z'
      };
      const addedOrder = await ownitService.createOrder(newOrder);
      setOrders(prev => [...prev, addedOrder]);
      setOrderItem('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAddWarranty = async () => {
    if (!warrantyItem.trim()) return;

    try {
      setLoading(true);
      const newWarranty = {
        claim_number: `CLAIM-${Date.now()}`,
        entry_id: 'sample-entry-id',
        issue_description: 'Sample issue',
        issue_category: 'other' as const, // Use literal type
        severity: 'medium' as const, // Use literal type
        issue_discovered_date: '2023-06-01',
        claim_submitted_date: '2023-06-01',
        status: 'submitted' as const, // Use literal type
        created_at: '2023-06-01T00:00:00Z',
        updated_at: '2023-06-01T00:00:00Z'
      };
      const addedWarranty = await ownitService.createWarrantyClaim(newWarranty);
      // Cast to OwnitWarrantyClaim to match state type
      setWarranties(prev => [...prev, addedWarranty as OwnitWarrantyClaim]);
      setWarrantyItem('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
    case 'active':
      return 'bg-green-500';
    case 'sold':
      return 'bg-blue-500';
    case 'lost':
    case 'stolen':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Ownit Dashboard</h1>
        <p className="text-slate-700 dark:text-slate-300 font-medium">Track your owned products, orders, and warranties</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{entries.length}</div>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">Owned products</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">Purchase history</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Warranties</CardTitle>
            <Clock className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {entries.filter(e => e.warranty_end_date && new Date(e.warranty_end_date) > new Date()).length}
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">Currently covered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{warranties.length}</div>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">Within 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Expiring Warranties Alert */}
      {warranties.length > 0 && (
        <Card className="border-orange-500 bg-orange-50 dark:bg-orange-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
              <AlertTriangle className="h-5 w-5" />
              Warranties Expiring Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {warranties.map(item => (
                <div key={item.id} className="flex justify-between items-center p-2 bg-white dark:bg-gray-900 rounded">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-slate-700">
                      Expires: {new Date(item.warranty_end_date!).toLocaleDateString()}
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Extend Warranty
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Items */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {entries.slice(0, 5).map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                    <Package className="h-6 w-6 text-slate-700" />
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                      {item.brand} {item.model} • ${item.purchase_price?.toLocaleString()}
                    </p>
                  </div>
                </div>
                <Badge className={getStatusColor(item.status)}>
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.slice(0, 5).map(order => (
              <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors">
                <div>
                  <p className="font-medium">{order.order_number}</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                    {order.seller_name} • {new Date(order.order_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${order.total_amount.toLocaleString()}</p>
                  <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>
                    {order.payment_status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OwnitDashboard;
