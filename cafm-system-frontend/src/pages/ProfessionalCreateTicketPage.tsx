import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faTicketAlt,
  faArrowLeft,
  faLightbulb,
  faSearch
} from '@fortawesome/free-solid-svg-icons';
import ProfessionalLayout from '../components/layout/ProfessionalLayout';
import CreateTicketForm from '../components/tickets/CreateTicketForm';

const ProfessionalCreateTicketPage: React.FC = () => {
  return (
    <ProfessionalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center mb-2">
              <Link 
                to="/tickets" 
                className="inline-flex items-center text-primary-600 hover:text-primary-700 mr-4"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2 h-4 w-4" />
                Back to Tickets
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FontAwesomeIcon icon={faPlus} className="mr-3 h-8 w-8 text-primary-600" />
              Create Service Request
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Create a new facility maintenance request with smart autocomplete suggestions
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link to="/tickets" className="btn-gov-secondary">
              <FontAwesomeIcon icon={faTicketAlt} className="mr-2 h-4 w-4" />
              View All Requests
            </Link>
          </div>
        </div>

        {/* Smart Suggestions Info Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faLightbulb} className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                🚀 Smart Autocomplete Suggestions
              </h3>
              <p className="text-blue-700 dark:text-blue-200 mb-3">
                Our intelligent system provides instant suggestions as you type. Try these keywords:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { text: 'water leak', color: 'bg-blue-100 text-blue-800' },
                  { text: 'electrical', color: 'bg-yellow-100 text-yellow-800' },
                  { text: 'power outage', color: 'bg-red-100 text-red-800' },
                  { text: 'cleaning', color: 'bg-purple-100 text-purple-800' },
                  { text: 'hvac', color: 'bg-green-100 text-green-800' },
                  { text: 'security', color: 'bg-gray-100 text-gray-800' }
                ].map((keyword, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${keyword.color}`}
                  >
                    <FontAwesomeIcon icon={faSearch} className="mr-1 h-3 w-3" />
                    {keyword.text}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Create Ticket Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <CreateTicketForm />
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            💡 How to Use Smart Suggestions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                📝 Title & Description Fields
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• Start typing keywords like "water", "electrical", "cleaning"</li>
                <li>• Suggestions appear automatically as you type</li>
                <li>• Click on any suggestion to use it</li>
                <li>• Suggestions are categorized by department</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                🎯 Common Categories
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• <span className="font-medium text-blue-600">Plumbing:</span> water leak, pipe, drain, faucet</li>
                <li>• <span className="font-medium text-yellow-600">Electrical:</span> power, lights, outlet, circuit</li>
                <li>• <span className="font-medium text-green-600">HVAC:</span> air conditioning, heating, ventilation</li>
                <li>• <span className="font-medium text-purple-600">Cleaning:</span> restroom, carpet, sanitization</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ProfessionalLayout>
  );
};

export default ProfessionalCreateTicketPage;
