import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAppContext } from '@/contexts/AppContext';

const Dancia4TvControls: React.FC = () => {
  const { showToast } = useAppContext(); // Updated to use showToast instead of addNotification
  const [streamUrl, setStreamUrl] = useState('');

  const handleStartStream = () => {
    if (!streamUrl) {
      showToast('Please enter a stream URL', 'error');
      return;
    }
    
    // Simulate starting a stream
    console.info(`Starting stream with URL: ${streamUrl}`);
    showToast('Stream started successfully', 'success');
  };

  const handleStopStream = () => {
    // Simulate stopping a stream
    showToast('Stream stopped successfully', 'info');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Dancia4TV Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="stream-url" className="text-sm font-medium">Stream URL</label>
          <input
            id="stream-url"
            type="text"
            placeholder="Enter stream URL..."
            value={streamUrl}
            onChange={(e) => setStreamUrl(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2">
          <Button onClick={handleStartStream}>Start Stream</Button>
          <Button onClick={handleStopStream} variant="secondary">Stop Stream</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Dancia4TvControls;