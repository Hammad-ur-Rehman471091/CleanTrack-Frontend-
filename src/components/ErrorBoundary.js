import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  handleReset = () => this.setState({ hasError: false, error: null });

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
          <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h2 className="text-base font-semibold text-gray-800 mb-1">Something went wrong</h2>
          <p className="text-sm text-gray-500 mb-6 max-w-sm">
            An unexpected error occurred. You can try again or go back to the dashboard.
          </p>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre className="text-left text-xs bg-gray-100 text-gray-600 rounded-md p-4 mb-4 max-w-lg overflow-auto w-full">
              {this.state.error.toString()}
            </pre>
          )}
          <div className="flex gap-3">
            <button onClick={this.handleReset}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
              Try again
            </button>
            <button onClick={() => window.location.href = '/dashboard'}
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors">
              Go to Dashboard
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
