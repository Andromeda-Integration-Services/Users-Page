import React, { Component, ErrorInfo, ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faRefresh, faHome, faBuilding } from '@fortawesome/free-solid-svg-icons';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ProfessionalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Professional Error Boundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleRefresh = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            {/* Error Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-danger-500 to-danger-600 px-6 py-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-white">System Error</h1>
                    <p className="text-danger-100 text-sm">CAFM System</p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="h-16 w-16 bg-danger-100 dark:bg-danger-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FontAwesomeIcon icon={faBuilding} className="h-8 w-8 text-danger-600 dark:text-danger-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Oops! Something went wrong
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    We encountered an unexpected error in the CAFM system. 
                    Our technical team has been notified.
                  </p>
                </div>

                {/* Error Details (Development) */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Error Details (Development):
                    </h3>
                    <pre className="text-xs text-gray-700 dark:text-gray-300 overflow-auto max-h-32">
                      {this.state.error.toString()}
                    </pre>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={this.handleRefresh}
                    className="w-full inline-flex items-center justify-center px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200"
                  >
                    <FontAwesomeIcon icon={faRefresh} className="mr-2 h-4 w-4" />
                    Refresh Page
                  </button>
                  
                  <button
                    onClick={this.handleGoHome}
                    className="w-full inline-flex items-center justify-center px-4 py-3 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm transition-colors duration-200"
                  >
                    <FontAwesomeIcon icon={faHome} className="mr-2 h-4 w-4" />
                    Go to Homepage
                  </button>
                </div>

                {/* Support Info */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      If this problem persists, please contact:
                    </p>
                    <div className="text-xs text-gray-600 dark:text-gray-300">
                      <div>📧 support@cafmsystem.gov</div>
                      <div>📞 1-800-CAFM-HELP</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3">
                <div className="flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                  <FontAwesomeIcon icon={faBuilding} className="mr-1 h-3 w-3" />
                  Government CAFM System - Error ID: {Date.now()}
                </div>
              </div>
            </div>

            {/* Additional Help */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                🔒 Your session and data remain secure
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ProfessionalErrorBoundary;
