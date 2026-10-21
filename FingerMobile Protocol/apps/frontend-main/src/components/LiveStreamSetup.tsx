import React, { useState } from 'react';
import { Video, Users, Settings, Mic, Camera, Monitor } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/Select';

interface LiveStreamSetupProps {
  onStartStream?: (config: any) => void;
}

const LiveStreamSetup: React.FC<LiveStreamSetupProps> = ({ onStartStream }) => {
  const [streamTitle, setStreamTitle] = React.useState('');
  const [category, setCategory] = React.useState('gaming');
  const [privacy, setPrivacy] = React.useState('public');
  const [enableChat, setEnableChat] = React.useState(true);
  const [enableRecording, setEnableRecording] = React.useState(false);

  const handleStartStream = () => {
    onStartStream?.({
      title: streamTitle,
      category,
      privacy,
      enableChat,
      enableRecording
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <Video className="h-6 w-6 text-slate-700" />
            Start Live Stream
          </CardTitle>
          <CardDescription className="text-slate-700">
            Configure your live stream settings before going live
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="stream-title" className="text-slate-900 font-semibold">Stream Title</Label>
            <Input
              id="stream-title"
              value={streamTitle}
              onChange={(e) => setStreamTitle(e.target.value)}
              placeholder="Enter an engaging title for your stream..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-slate-900 font-semibold">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gaming">Gaming</SelectItem>
                  <SelectItem value="music">Music</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="talk-show">Talk Show</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="privacy" className="text-slate-900 font-semibold">Privacy</Label>
              <Select value={privacy} onValueChange={setPrivacy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="unlisted">Unlisted</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="subscribers-only">Subscribers Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-slate-900 font-semibold">Stream Options</Label>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-slate-600" />
                  <div>
                    <p className="font-semibold text-slate-900">Enable Live Chat</p>
                    <p className="text-sm text-slate-700">
                      Allow viewers to chat during your stream
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={enableChat}
                  onChange={(e) => setEnableChat(e.target.checked)}
                  className="h-5 w-5"
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <Monitor className="h-5 w-5 text-slate-500" />
                  <div>
                    <p className="font-semibold text-slate-900">Record Stream</p>
                    <p className="text-sm text-slate-700">
                      Save a recording for later viewing
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={enableRecording}
                  onChange={(e) => setEnableRecording(e.target.checked)}
                  className="h-5 w-5"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg space-y-3">
            <h3 className="font-semibold flex items-center gap-2 text-slate-900">
              <Camera className="h-4 w-4 text-slate-700" />
              Pre-Stream Checklist
            </h3>
            <ul className="space-y-2 text-sm text-slate-800 font-medium">
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full" />
                Check your internet connection
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full" />
                Test your microphone and camera
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 bg-yellow-500 rounded-full" />
                Prepare your streaming content
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 bg-blue-500 rounded-full" />
                Set up lighting for better quality
              </li>
            </ul>
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={handleStartStream}
            disabled={!streamTitle.trim()}
          >
            <Video className="h-5 w-5 mr-2" />
            Go Live
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveStreamSetup;
