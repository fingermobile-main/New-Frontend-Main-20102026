import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

const ContentModerationDashboard = () => {
  const [moderationQueue, setModerationQueue] = useState([
    { id: 1, type: 'image', content: 'User uploaded image', status: 'pending', timestamp: '2023-06-15 10:30' },
    { id: 2, type: 'video', content: 'User submitted video', status: 'approved', timestamp: '2023-06-15 11:45' },
    { id: 3, type: 'text', content: 'User comment', status: 'rejected', timestamp: '2023-06-15 12:20' }
  ]);

  const handleApprove = (id: number) => {
    setModerationQueue(queue => 
      queue.map(item => 
        item.id === id ? { ...item, status: 'approved' } : item
      )
    );
  };

  const handleReject = (id: number) => {
    setModerationQueue(queue => 
      queue.map(item => 
        item.id === id ? { ...item, status: 'rejected' } : item
      )
    );
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Content Moderation Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {moderationQueue.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{item.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.content}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge 
                        variant={
                          item.status === 'pending' ? 'secondary' : 
                          item.status === 'approved' ? 'success' : 
                          item.status === 'rejected' ? 'destructive' : 
                          'destructive'
                        }
                      >
                        {item.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.timestamp}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleApprove(item.id)}
                          disabled={item.status !== 'pending'}
                        >
                          Approve
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleReject(item.id)}
                          disabled={item.status !== 'pending'}
                        >
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentModerationDashboard;