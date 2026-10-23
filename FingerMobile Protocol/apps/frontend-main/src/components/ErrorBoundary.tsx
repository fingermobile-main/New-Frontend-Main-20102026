import React, { Component, ErrorInfo, ReactNode } from 'react';
import { useRouteError } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);

    const isChunkError =
      error.name === 'ChunkLoadError' ||
      error.message?.includes('Loading chunk') ||
      error.message?.includes('dynamically imported module') ||
      error.message?.includes('failed to fetch');

    if (isChunkError && typeof window !== 'undefined') {
      const reloadKey = `chunk_reload_${window.location.pathname}`;
      if (!sessionStorage.getItem(reloadKey)) {
        sessionStorage.setItem(reloadKey, 'true');
        window.location.reload();
      }
    }
  }

  handleRefresh = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.clear();
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
          <div className="max-w-md w-full bg-white border border-slate-300 rounded-2xl p-8 shadow-xl text-center">
            <div className="mx-auto h-12 w-12 text-amber-600 mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Platform Update Detected
              </h2>
              <p className="mt-2 text-sm text-slate-700 font-medium">
                A platform component or code bundle was refreshed. Click below to load the latest version.
              </p>
              {this.state.error && (
                <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-md text-left">
                  <p className="text-xs text-slate-700 font-mono break-words">
                    {this.state.error.message || this.state.error.toString()}
                  </p>
                </div>
              )}
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={this.handleRefresh}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm transition-colors focus:outline-none"
              >
                Refresh Platform
              </button>
              <a
                href="/"
                className="w-full py-2 px-4 border border-slate-300 text-slate-800 font-bold rounded-lg hover:bg-slate-50 transition-colors inline-block"
              >
                Return to Dashboard
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export const RouteErrorBoundary: React.FC = () => {
  const error = useRouteError() as Error | null;

  React.useEffect(() => {
    const isChunkError =
      error?.name === 'ChunkLoadError' ||
      error?.message?.includes('Loading chunk') ||
      error?.message?.includes('dynamically imported module') ||
      error?.message?.includes('failed to fetch');

    if (isChunkError && typeof window !== 'undefined') {
      const reloadKey = `chunk_reload_${window.location.pathname}`;
      if (!sessionStorage.getItem(reloadKey)) {
        sessionStorage.setItem(reloadKey, 'true');
        window.location.reload();
      }
    }
  }, [error]);

  const handleRefresh = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      <div className="max-w-md w-full bg-white border border-slate-300 rounded-2xl p-8 shadow-xl text-center">
        <div className="mx-auto h-12 w-12 text-amber-600 mb-4 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Platform Update Detected
        </h2>
        <p className="mt-2 text-sm text-slate-700 font-medium">
          A platform component or code bundle was refreshed. Click below to load the latest version.
        </p>
        {error && (
          <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-md text-left">
            <p className="text-xs text-slate-700 font-mono break-words">
              {error.message || error.toString()}
            </p>
          </div>
        )}
        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm transition-colors focus:outline-none"
          >
            Refresh Platform
          </button>
          <a
            href="/"
            className="w-full py-2 px-4 border border-slate-300 text-slate-800 font-bold rounded-lg hover:bg-slate-50 transition-colors inline-block"
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;
