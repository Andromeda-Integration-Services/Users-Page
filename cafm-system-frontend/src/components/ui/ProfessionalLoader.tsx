import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faSpinner } from '@fortawesome/free-solid-svg-icons';

interface ProfessionalLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

const ProfessionalLoader: React.FC<ProfessionalLoaderProps> = ({ 
  message = 'Loading...', 
  size = 'md',
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClasses}>
      <div className="text-center">
        {/* Animated Logo */}
        <div className="relative mb-6">
          <div className={`${sizeClasses[size]} bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg mx-auto`}>
            <FontAwesomeIcon icon={faBuilding} className="h-1/2 w-1/2 text-white" />
          </div>
          
          {/* Spinning Ring */}
          <div className={`absolute inset-0 ${sizeClasses[size]} mx-auto`}>
            <div className="absolute inset-0 border-2 border-primary-200 dark:border-primary-800 rounded-xl"></div>
            <div className="absolute inset-0 border-2 border-transparent border-t-primary-600 rounded-xl animate-spin"></div>
          </div>
        </div>

        {/* Loading Text */}
        <div className={`${textSizeClasses[size]} font-medium text-gray-700 dark:text-gray-300 mb-2`}>
          {message}
        </div>
        
        {/* Progress Dots */}
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>

        {/* Government Branding */}
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          Government Secure Portal
        </div>
      </div>
    </div>
  );
};

export default ProfessionalLoader;
