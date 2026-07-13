import React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '../components/layout/MainLayout';
import { useAppContext } from "../contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { ShieldExclamationIcon, UserCircleIcon, CheckCircleIcon, XCircleIcon, DocumentTextIcon } from '../icons';

const UserReportsPage: React.FC = () => {
  const { ficBalance, showToast } = useAppContext();
  
  const [reports, setReports] = useState([
    {
      id: '1',
      reporter: 'user123',
      reportedUser: 'user456',
      type: 'harassment',
      description: 'This user is sending harassing messages',
      status: 'open',
      timestamp: '2023-05-15 14:30',
      severity: 'high'
    },
    {
      id: '2',
      reporter: 'user789',
      reportedUser: 'user001',
      type: 'spam',
      description: 'This user is posting spam content',
      status: 'resolved',
      timestamp: '2023-05-15 12:15',
      severity: 'medium'
    },
    {
      id: '3',
      reporter: 'user321',
      reportedUser: 'user654',
      type: 'impersonation',
      description: 'This user is impersonating someone else',
      status: 'under_review',
      timestamp: '2023-05-14 18:45',
      severity: 'high'
    }
  ]);

  const [selectedReport, setSelectedReport] = useState<any>(null);

  const handleResolve = (reportId: string) => {
    setReports(reports.map(report => 
      report.id === reportId ? {...report, status: 'resolved'} : report
    ));
    if (selectedReport && selectedReport.id === reportId) {
      setSelectedReport({...selectedReport, status: 'resolved'});
    }
    showToast(`Report #${reportId} marked as resolved`, 'success');
  };

  const handleReject = (reportId: string) => {
    setReports(reports.map(report => 
      report.id === reportId ? {...report, status: 'rejected'} : report
    ));
    if (selectedReport && selectedReport.id === reportId) {
      setSelectedReport({...selectedReport, status: 'rejected'});
    }
    showToast(`Report #${reportId} marked as rejected`, 'info');
  };

  const filteredReports = reports.filter(report => report.status === 'open' || report.status === 'under_review');

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-10">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 p-3 rounded-xl">
              <ShieldExclamationIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-gray-900">User Reports</h1>
              <p className="text-gray-600">Manage and review user-reported accounts and content</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Open Reports ({filteredReports.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                      {filteredReports.map((report) => (
                        <div 
                          key={report.id} 
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedReport?.id === report.id 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedReport(report)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <Badge variant={
                                report.severity === 'high' ? 'destructive' : 
                                report.severity === 'medium' ? 'default' : 
                                'secondary'
                              }>
                                {report.type}
                              </Badge>
                              <p className="font-medium mt-2">Report #{report.id}</p>
                            </div>
                            <span className="text-sm text-gray-500">{report.timestamp}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">From: {report.reporter} to: {report.reportedUser}</p>
                          <div className="mt-2">
                            <Badge variant={
                              report.status === 'open' ? 'default' : 
                              report.status === 'under_review' ? 'secondary' : 
                              'outline'
                            }>
                              {report.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2">
                {selectedReport ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Report Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700">Report ID</label>
                            <p className="text-gray-900">{selectedReport.id}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Severity</label>
                            <Badge variant={
                              selectedReport.severity === 'high' ? 'destructive' : 
                              selectedReport.severity === 'medium' ? 'default' : 
                              'secondary'
                            }>
                              {selectedReport.severity}
                            </Badge>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Reporter</label>
                            <p className="text-gray-900">{selectedReport.reporter}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Reported User</label>
                            <p className="text-gray-900">{selectedReport.reportedUser}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Type</label>
                            <p className="text-gray-900 capitalize">{selectedReport.type.replace('-', ' ')}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Status</label>
                            <Badge variant={
                              selectedReport.status === 'open' ? 'default' : 
                              selectedReport.status === 'under_review' ? 'secondary' : 
                              'outline'
                            }>
                              {selectedReport.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700">Description</label>
                          <Textarea 
                            value={selectedReport.description} 
                            readOnly 
                            className="mt-1 min-h-[120px]"
                          />
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button 
                            onClick={() => handleResolve(selectedReport.id)}
                            disabled={selectedReport.status !== 'open' && selectedReport.status !== 'under_review'}
                            className="flex items-center"
                          >
                            <CheckCircleIcon className="h-4 w-4 mr-2" />
                            Resolve Report
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => handleReject(selectedReport.id)}
                            disabled={selectedReport.status !== 'open' && selectedReport.status !== 'under_review'}
                            className="flex items-center"
                          >
                            <XCircleIcon className="h-4 w-4 mr-2" />
                            Reject Report
                          </Button>
                          <Button 
                            variant="outline"
                            disabled={selectedReport.status !== 'open' && selectedReport.status !== 'under_review'}
                            className="flex items-center"
                          >
                            <DocumentTextIcon className="h-4 w-4 mr-2" />
                            Escalate
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="flex items-center justify-center h-64">
                      <p className="text-gray-500">Select a report to view details</p>
                    </CardContent>
                  </Card>
                )}

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Report Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-700">{reports.length}</p>
                        <p className="text-sm text-gray-600">Total Reports</p>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <p className="text-2xl font-bold text-yellow-700">{reports.filter(r => r.status === 'open').length}</p>
                        <p className="text-sm text-gray-600">Open</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-700">{reports.filter(r => r.status === 'resolved').length}</p>
                        <p className="text-sm text-gray-600">Resolved</p>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <p className="text-2xl font-bold text-red-700">{reports.filter(r => r.status === 'under_review').length}</p>
                        <p className="text-sm text-gray-600">Under Review</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <UserCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
                Admin FIC Balance
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{ficBalance.toFixed(2)} FIC</span>
                <button className="text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg hover:from-blue-700 hover:to-indigo-700">
                  Add Funds
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Actions</h2>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-indigo-50 transition-colors">
                  Bulk Resolve Reports
                </button>
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-indigo-50 transition-colors">
                  Export Reports Data
                </button>
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-indigo-50 transition-colors">
                  View Report History
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-100">
              <h3 className="font-bold text-gray-900 mb-2">Reporting Guidelines</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Review all evidence before taking action</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Follow platform policies consistently</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Document all decisions for accountability</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default UserReportsPage;