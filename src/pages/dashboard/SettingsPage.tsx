import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/Select';
import { Switch } from '../../components/ui/Switch';
import { Label } from '../../components/ui/Label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true
  });

  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    showEmail: false,
    allowMessaging: true
  });

  const handleNotificationChange = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const handlePrivacyChange = (key: string) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

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
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account and platform settings</p>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="John" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Doe" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <input id="email" type="email" defaultValue="john.doe@example.com" />
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" placeholder="Tell us about yourself..." />
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" defaultValue="San Francisco, CA" />
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" placeholder="https://yoursite.com" />
                </div>

                <div className="pt-4">
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications" className="font-normal">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={notifications.email}
                    onCheckedChange={() => handleNotificationChange('email')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications" className="font-normal">Push Notifications</Label>
                    <p className="text-sm text-gray-500">Receive push notifications on your devices</p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={notifications.push}
                    onCheckedChange={() => handleNotificationChange('push')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-notifications" className="font-normal">SMS Notifications</Label>
                    <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                  </div>
                  <Switch
                    id="sms-notifications"
                    checked={notifications.sms}
                    onCheckedChange={() => handleNotificationChange('sms')}
                  />
                </div>

                <div className="pt-4">
                  <Button>Save Notification Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="profile-public" className="font-normal">Public Profile</Label>
                    <p className="text-sm text-gray-500">Allow anyone to view your profile</p>
                  </div>
                  <Switch
                    id="profile-public"
                    checked={privacy.profilePublic}
                    onCheckedChange={() => handlePrivacyChange('profilePublic')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-email" className="font-normal">Show Email</Label>
                    <p className="text-sm text-gray-500">Display your email on your profile</p>
                  </div>
                  <Switch
                    id="show-email"
                    checked={privacy.showEmail}
                    onCheckedChange={() => handlePrivacyChange('showEmail')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allow-messaging" className="font-normal">Allow Messaging</Label>
                    <p className="text-sm text-gray-500">Allow other users to send you messages</p>
                  </div>
                  <Switch
                    id="allow-messaging"
                    checked={privacy.allowMessaging}
                    onCheckedChange={() => handlePrivacyChange('allowMessaging')}
                  />
                </div>

                <div className="pt-4">
                  <Button>Save Privacy Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Change Password</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="current-password">Current Password</Label>
                      <input id="current-password" type="password" />
                    </div>

                    <div>
                      <Label htmlFor="new-password">New Password</Label>
                      <input id="new-password" type="password" />
                    </div>

                    <div>
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <input id="confirm-password" type="password" />
                    </div>

                    <Button>Update Password</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Two-Factor Authentication</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Enable 2FA</p>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                      <Switch
                        id="two-factor"
                        checked={twoFactorEnabled}
                        onCheckedChange={setTwoFactorEnabled}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Active Sessions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Current Session</p>
                          <p className="text-sm text-gray-500">This device</p>
                        </div>
                        <Badge variant="secondary">Active</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Chrome on Mac</p>
                          <p className="text-sm text-gray-500">San Francisco, CA • 2 hours ago</p>
                        </div>
                        <Button variant="outline" size="sm">End Session</Button>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Firefox on Windows</p>
                          <p className="text-sm text-gray-500">New York, NY • Yesterday</p>
                        </div>
                        <Button variant="outline" size="sm">End Session</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      <Footer />
    </div>
  );
};

export default SettingsPage;
