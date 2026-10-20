import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Switch } from '../../components/ui/Switch';
import { Label } from '../../components/ui/Label';
import { BellIcon, MailIcon, SmartphoneIcon, GlobeIcon } from 'lucide-react';

const NotificationManagement: React.FC = () => {
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    sms: false,
    inApp: true
  });

  const [categories, setCategories] = useState({
    announcements: true,
    updates: true,
    promotions: false,
    reminders: true,
    security: true
  });

  const handleSettingChange = (key: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleCategoryChange = (key: keyof typeof categories) => {
    setCategories(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BellIcon className="w-5 h-5" />
          Notification Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Delivery Methods</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MailIcon className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-slate-700 font-medium">Receive notifications via email</p>
                  </div>
                </div>
                <Switch
                  checked={notificationSettings.email}
                  onCheckedChange={() => handleSettingChange('email')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BellIcon className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-slate-700 font-medium">Receive notifications via push</p>
                  </div>
                </div>
                <Switch
                  checked={notificationSettings.push}
                  onCheckedChange={() => handleSettingChange('push')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SmartphoneIcon className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium">SMS</p>
                    <p className="text-sm text-slate-700 font-medium">Receive notifications via text message</p>
                  </div>
                </div>
                <Switch
                  checked={notificationSettings.sms}
                  onCheckedChange={() => handleSettingChange('sms')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GlobeIcon className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="font-medium">In-App</p>
                    <p className="text-sm text-slate-700 font-medium">Receive notifications within the app</p>
                  </div>
                </div>
                <Switch
                  checked={notificationSettings.inApp}
                  onCheckedChange={() => handleSettingChange('inApp')}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Notification Categories</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Announcements</p>
                  <p className="text-sm text-slate-700 font-medium">Important platform announcements</p>
                </div>
                <Switch
                  checked={categories.announcements}
                  onCheckedChange={() => handleCategoryChange('announcements')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Product Updates</p>
                  <p className="text-sm text-slate-700 font-medium">New features and improvements</p>
                </div>
                <Switch
                  checked={categories.updates}
                  onCheckedChange={() => handleCategoryChange('updates')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Promotions</p>
                  <p className="text-sm text-slate-700 font-medium">Special offers and discounts</p>
                </div>
                <Switch
                  checked={categories.promotions}
                  onCheckedChange={() => handleCategoryChange('promotions')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Reminders</p>
                  <p className="text-sm text-slate-700 font-medium">Personal reminders and notifications</p>
                </div>
                <Switch
                  checked={categories.reminders}
                  onCheckedChange={() => handleCategoryChange('reminders')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Security Alerts</p>
                  <p className="text-sm text-slate-700 font-medium">Security-related notifications</p>
                </div>
                <Switch
                  checked={categories.security}
                  onCheckedChange={() => handleCategoryChange('security')}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button>Save Preferences</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationManagement;
