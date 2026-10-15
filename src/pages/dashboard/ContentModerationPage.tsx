import React, { useState, useEffect } from 'react';
/*
 * FingerMobile Protocol™ - Content Moderation Page Component
 * Copyright © 2025 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms,
 * which are the sole and exclusive intellectual property of Mbah Israel Obinna.
 *
 * Unauthorized copying, distribution, or modification of this code is strictly prohibited. All laws do and will apply.
 */

import { Shield, AlertTriangle, CheckCircle, XCircle, Clock, Eye, RefreshCw, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/Select';
import { moderationAdminService, ModerationQueueItem } from '../../services/moderationAdminService';
import { useAppContext } from '../../contexts/AppContext';

interface ModerationItem {
  id: string;
  type: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  reportedBy: string;
  reason: string;
  timestamp: string;
}

const ContentModerationPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [moderationQueue, setModerationQueue] = useState<ModerationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ModerationItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const items = await moderationAdminService.getQueue();
      const mapped: ModerationItem[] = items.map((i: ModerationQueueItem) => ({
        id: String(i.id),
        type: i.content_type || 'post',
        content: i.contentPreview || i.description || `Reported ${i.content_type} item #${i.content_id}`,
        status: (i.status === 'approved' ? 'approved' : i.status === 'rejected' ? 'rejected' : 'pending') as 'pending' | 'approved' | 'rejected',
        reportedBy: i.reporter_username || i.reported_by || 'system',
        reason: i.reason || 'Flagged for moderation',
        timestamp: i.created_at || new Date().toISOString()
      }));
      setModerationQueue(mapped);
      if (mapped.length > 0 && !selectedItem) {
        setSelectedItem(mapped[0]);
      }
    } catch (err: any) {
      showToast?.(err.message || 'Failed to load moderation queue', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      setProcessingId(id);
      await moderationAdminService.approveItem(id, 'Approved via Content Moderation Console');
      showToast?.('Item approved successfully', 'success');
      setModerationQueue(prev =>
        prev.map(item => item.id === id ? { ...item, status: 'approved' } : item)
      );
      if (selectedItem?.id === id) {
        setSelectedItem(prev => prev ? { ...prev, status: 'approved' } : null);
      }
    } catch (err: any) {
      showToast?.(err.message || 'Failed to approve item', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setProcessingId(id);
      await moderationAdminService.rejectItem(id, 'remove_content', 'Rejected via Content Moderation Console');
      showToast?.('Item rejected and content removed', 'info');
      setModerationQueue(prev =>
        prev.map(item => item.id === id ? { ...item, status: 'rejected' } : item)
      );
      if (selectedItem?.id === id) {
        setSelectedItem(prev => prev ? { ...prev, status: 'rejected' } : null);
      }
    } catch (err: any) {
      showToast?.(err.message || 'Failed to reject item', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const pendingItems = moderationQueue.filter(item => item.status === 'pending');
  const approvedCount = moderationQueue.filter(i => i.status === 'approved').length;
  const rejectedCount = moderationQueue.filter(i => i.status === 'rejected').length;

  const filteredItems = moderationQueue.filter(item =>
    item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.includes(searchTerm)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6"
    >
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Content Moderation</h1>
            <p className="text-gray-600 mt-2">Review and moderate reported content</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
              Refresh
            </button>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by content or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-yellow-100">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{pendingItems.length}</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">Pending Review</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-green-100">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{approvedCount}</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">Approved</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-red-100">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{rejectedCount}</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">Rejected</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-blue-100">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{moderationQueue.length}</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">Total Reports</p>
        </div>
      </div>

      {/* Moderation Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Moderation Queue</h2>
            </div>

            <div className="p-4 border-b border-gray-200">
              <Select
                value={selectedItem?.id || 'all'}
                onValueChange={(value) => {
                  if (value === 'all') {
                    setSelectedItem(null);
                  } else {
                    setSelectedItem(moderationQueue.find(item => item.id === value) || null);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an item" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  {filteredItems.map(item => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.type} - {item.reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
              {filteredItems.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Shield className="w-12 h-12 mx-auto mb-3 text-slate-500" />
                  <p className="text-sm">No items match your search</p>
                </div>
              ) : (
                filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 cursor-pointer transition-colors ${
                      selectedItem?.id === item.id
                        ? 'bg-blue-50 border-l-4 border-blue-500'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedItem(item)} role="button" tabIndex={0}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          item.type === 'post'
                            ? 'bg-purple-100 text-purple-950 border border-purple-400 font-bold'
                            : item.type === 'comment'
                              ? 'bg-blue-100 text-blue-950 border border-blue-400 font-bold'
                              : 'bg-orange-100 text-orange-800'
                        }`}>
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.status === 'pending'
                            ? 'bg-amber-100 text-amber-950 border border-amber-400 font-bold'
                            : item.status === 'approved'
                              ? 'bg-green-100 text-green-950 border border-green-400 font-bold'
                              : 'bg-red-100 text-red-950 border border-red-400 font-bold'
                        }`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-900 my-2 truncate">{item.content}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">Reporter: {item.reportedBy}</p>
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View details
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedItem ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Report Details</h2>
                  <span className={`text-sm px-3 py-1 rounded-full ${
                    selectedItem.status === 'pending'
                      ? 'bg-amber-100 text-amber-950 border border-amber-400 font-bold'
                      : selectedItem.status === 'approved'
                        ? 'bg-green-100 text-green-950 border border-green-400 font-bold'
                        : 'bg-red-100 text-red-950 border border-red-400 font-bold'
                  }`}>
                    {selectedItem.status.charAt(0).toUpperCase() + selectedItem.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Report ID</p>
                    <p className="text-gray-900 font-medium">{selectedItem.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="text-gray-900 font-medium capitalize">{selectedItem.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="text-gray-900 font-medium capitalize">{selectedItem.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Reported By</p>
                    <p className="text-gray-900 font-medium">{selectedItem.reportedBy}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date Reported</p>
                    <p className="text-gray-900 font-medium">
                      {new Date(selectedItem.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Reported Content</p>
                  <div className="bg-gray-50 p-4 rounded-lg border border-slate-300">
                    <p className="text-gray-900">{selectedItem.content}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Reason for Report</p>
                  <div className="bg-gray-50 p-4 rounded-lg border border-slate-300">
                    <p className="text-gray-900">{selectedItem.reason}</p>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => handleApprove(selectedItem.id)}
                    disabled={selectedItem.status !== 'pending' || processingId === selectedItem.id}
                    className={`flex-1 py-2 px-4 rounded-md text-white font-medium flex items-center justify-center gap-2
                      ${selectedItem.status === 'pending'
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-green-300 cursor-not-allowed'
            }`}
                  >
                    {processingId === selectedItem.id ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    Mark as Approved
                  </button>
                  <button
                    onClick={() => handleReject(selectedItem.id)}
                    disabled={selectedItem.status !== 'pending' || processingId === selectedItem.id}
                    className={`flex-1 py-2 px-4 rounded-md text-white font-medium flex items-center justify-center gap-2
                      ${selectedItem.status === 'pending'
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-red-300 cursor-not-allowed'
            }`}
                  >
                    {processingId === selectedItem.id ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    Mark as Rejected
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-white rounded-lg shadow h-full flex items-center justify-center p-12">
              <div className="text-center">
                <Shield className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-700 mb-1">No content selected</h3>
                <p className="text-gray-500">Select an item from the queue to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ContentModerationPage;
