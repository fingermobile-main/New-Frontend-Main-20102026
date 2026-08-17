import React, {} from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { useAppContext } from "../contexts/AppContext";

const Home: React.FC = () => {
  const { member, theme, setTheme } = useAppContext();

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to FingerMobile Protocol</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>Hello {member?.name || 'Guest'}! Welcome to our platform.</p>
            
            <div className="flex items-center space-x-4">
              <span>Current theme: {theme}</span>
              <Button 
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              >
                Toggle Theme
              </Button>
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Secure messaging</li>
                    <li>Content sharing</li>
                    <li>Community engagement</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>User guides</li>
                    <li>API documentation</li>
                    <li>Support center</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Updates</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Latest features</li>
                    <li>Security patches</li>
                    <li>Performance improvements</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;