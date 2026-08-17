import React, {} from 'react';
import { useAppContext } from '../../contexts/AppContext';  // Fixed import path
export * from './Modal';

export default function Home() {
  const { showToast } = useAppContext(); // Fixed hook name

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => showToast("Hello, world!")}
      >
        Show Toast
      </button>
    </div>
  );
}
