import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';

const ModerationQueuePage: React.FC = () => {
  const [queueItems, setQueueItems] = useState([
    {
      id: '1',
      type: 'post',
      content: 'This is a sample post that needs moderation. It contains some questionable content that needs review.',
      reporter: 'user123',
      timestamp: '2023-05-15 14:30',
      status: 'pending',
      category: 'inappropriate-content'
    },
    {
      id: '2',
      type: 'comment',
      content: 'Offensive comment that violates community guidelines',
      reporter: 'user456',
      timestamp: '2023-05-15 13:45',
      status: 'pending',
      category: 'harassment'
    },
    {
      id: '3',
      type: 'profile',
      content: 'Profile image contains inappropriate content',
      reporter: 'user789',
      timestamp: '2023-05-15 12:20',
      status: 'reviewed',
      category: 'inappropriate-image'
    }
  ]);

  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handleApprove = (itemId: string) => {
    setQueueItems(queueItems.map(item => 
      item.id === itemId ? {...item, status: 'approved'} : item
    ));
    if (selectedItem && selectedItem.id === itemId) {
      setSelectedItem({...selectedItem, status: 'approved'});
    }
  };

  const handleReject = (itemId: string) => {
    setQueueItems(queueItems.map(item => 
      item.id === itemId ? {...item, status: 'rejected'} : item
    ));
    if (selectedItem && selectedItem.id === itemId) {
      setSelectedItem({...selectedItem, status: 'rejected'});
    }
  };

  const filteredItems = queueItems.filter(item => item.status === 'pending');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Moderation Queue</h1>
          <p className="text-gray-600 mt-2">Review and manage reported content</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Pending Items ({filteredItems.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {filteredItems.map((item) => (
                    <div 
                      key={item.id} 
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedItem?.id === item.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedItem(item)} role="button" tabIndex={0}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <Badge variant={
                            item.category === 'harassment' ? 'destructive' : 
                            item.category === 'spam' ? 'secondary' : 
                            'default'
                          }>
                            {item.type}
                          </Badge>
                          <p className="font-medium mt-2">#{item.id}</p>
                        </div>
                        <span className="text-sm text-gray-500">{item.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2 truncate">{item.content}</p>
                      <div className="mt-2">
                        <Badge variant="outline">
                          Reported by: {item.reporter}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {selectedItem ? (
              <Card>
                <CardHeader>
                  <CardTitle>Content Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Item ID</label>
                        <p className="text-gray-900">{selectedItem.id}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Type</label>
                        <p className="text-gray-900 capitalize">{selectedItem.type}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Category</label>
                        <p className="text-gray-900 capitalize">{selectedItem.category.replace('-', ' ')}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Status</label>
                        <Badge variant={
                          selectedItem.status === 'pending' ? 'default' : 
                          selectedItem.status === 'reviewed' ? 'secondary' : 
                          selectedItem.status === 'approved' ? 'success' : 'destructive'
                        }>
                          {selectedItem.status}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Content</label>
                      <Textarea 
                        value={selectedItem.content} 
                        readOnly 
                        className="mt-1 min-h-[120px]"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Reporter</label>
                      <p className="text-gray-900 mt-1">{selectedItem.reporter}</p>
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => handleApprove(selectedItem.id)}
                        disabled={selectedItem.status !== 'pending'}
                        variant="success"
                      >
                        Approve Content
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={() => handleReject(selectedItem.id)}
                        disabled={selectedItem.status !== 'pending'}
                      >
                        Reject & Remove
                      </Button>
                      <Button 
                        variant="outline"
                        disabled={selectedItem.status !== 'pending'}
                      >
                        Flag for Review
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <p className="text-gray-500">Select an item to review</p>
                </CardContent>
              </Card>
            )}

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Moderation Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-700">{queueItems.length}</p>
                    <p className="text-sm text-gray-600">Total Reports</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-700">{filteredItems.length}</p>
                    <p className="text-sm text-gray-600">Pending</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-700">{queueItems.filter(i => i.status === 'approved').length}</p>
                    <p className="text-sm text-gray-600">Approved</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-700">{queueItems.filter(i => i.status === 'rejected').length}</p>
                    <p className="text-sm text-gray-600">Rejected</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
};

export default ModerationQueuePage;