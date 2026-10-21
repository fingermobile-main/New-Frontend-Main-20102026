import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';

const App = dynamic(() => import('../src/App'), { ssr: false });

export default function CatchAllPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <App />;
}
