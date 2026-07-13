export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">FingerMobile Platform Monetization</h1>
        <p className="text-lg text-gray-700 mb-6">Welcome to the FingerMobile Business Suite</p>
        
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quick Links:</h2>
          <ul className="space-y-3">
            <li>
              <a href="/api/health" target="_blank" rel="noopener noreferrer" 
                 className="text-blue-600 hover:text-blue-800 hover:underline">
                🔗 API Health Check
              </a>
            </li>
            <li>
              <a href="/api/overview" target="_blank" rel="noopener noreferrer"
                 className="text-blue-600 hover:text-blue-800 hover:underline">
                📊 Platform Overview
              </a>
            </li>
            <li>
              <a href="/api/hallmarks" target="_blank" rel="noopener noreferrer"
                 className="text-blue-600 hover:text-blue-800 hover:underline">
                ⭐ Hallmarks
              </a>
            </li>
            <li>
              <a href="/api/programs" target="_blank" rel="noopener noreferrer"
                 className="text-blue-600 hover:text-blue-800 hover:underline">
                💼 Monetization Programs
              </a>
            </li>
            <li>
              <a href="/api/revenue" target="_blank" rel="noopener noreferrer"
                 className="text-blue-600 hover:text-blue-800 hover:underline">
                💰 Revenue Summary
              </a>
            </li>
            <li>
              <a href="/api/affiliate" target="_blank" rel="noopener noreferrer"
                 className="text-blue-600 hover:text-blue-800 hover:underline">
                🤝 Affiliate Info
              </a>
            </li>
          </ul>
        </div>
        
        <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-xl font-semibold text-green-800 mb-2">✅ Server Status: Running</h3>
          <p className="text-green-700">Backend API: http://localhost:3000/api</p>
          <p className="text-green-700">Frontend: http://localhost:5173</p>
        </div>
      </div>
    </div>
  );
}
