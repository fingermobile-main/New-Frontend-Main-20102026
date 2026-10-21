import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';

const ARScene = () => {
  const [markerFound, setMarkerFound] = useState(false);

  useEffect(() => {
    // Removed unnecessary dependency causing lint error
  }, []);

  const handleStartAR = () => {
    setMarkerFound(true);
  };

  const handleStopAR = () => {
    setMarkerFound(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">AR Scene</CardTitle>
        <CardDescription>View AR content with marker detection</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-square w-full relative bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
          {markerFound ? (
            <div className="text-center">
              <div className="bg-green-500 text-white p-2 rounded">AR Content Displayed</div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-500">Point camera at AR marker</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        <Button onClick={handleStartAR} className="flex-1">Start AR</Button>
        <Button onClick={handleStopAR} variant="outline" className="flex-1">Stop AR</Button>
      </CardFooter>
    </Card>
  );
};

export default ARScene;
