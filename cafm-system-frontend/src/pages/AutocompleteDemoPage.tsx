import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faLightbulb,
  faTicketAlt,
  faArrowRight,
  faMagic,
  faKeyboard,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import AutocompleteInput from '../components/ui/AutocompleteInput';
import { ticketSuggestions } from '../data/ticketSuggestions';

const AutocompleteDemoPage: React.FC = () => {
  const [demoValue, setDemoValue] = useState('');
  const [titleValue, setTitleValue] = useState('');
  const [descriptionValue, setDescriptionValue] = useState('');

  const demoKeywords = [
    'water leak',
    'electrical',
    'power outage',
    'cleaning',
    'hvac',
    'security',
    'maintenance',
    'plumbing',
    'air conditioning',
    'heating',
    'lighting',
    'restroom'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="h-16 w-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FontAwesomeIcon icon={faMagic} className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 Smart Autocomplete Demo
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Experience intelligent suggestions for facility management tickets
          </p>
          <Link 
            to="/tickets/new" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg"
          >
            <FontAwesomeIcon icon={faTicketAlt} className="mr-2 h-5 w-5" />
            Try Creating a Real Ticket
            <FontAwesomeIcon icon={faArrowRight} className="ml-2 h-4 w-4" />
          </Link>
        </div>

        {/* Demo Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Live Demo */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <FontAwesomeIcon icon={faSearch} className="mr-3 h-6 w-6 text-blue-600" />
              Live Demo
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Try typing any facility issue:
                </label>
                <AutocompleteInput
                  value={demoValue}
                  onChange={setDemoValue}
                  placeholder="Type 'water', 'electrical', 'cleaning', etc..."
                  suggestions={ticketSuggestions}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Current value: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{demoValue || 'empty'}</span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ticket Title:
                </label>
                <AutocompleteInput
                  value={titleValue}
                  onChange={setTitleValue}
                  placeholder="Enter ticket title..."
                  suggestions={ticketSuggestions}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ticket Description:
                </label>
                <AutocompleteInput
                  value={descriptionValue}
                  onChange={setDescriptionValue}
                  placeholder="Describe the issue in detail..."
                  suggestions={ticketSuggestions}
                />
              </div>
            </div>
          </div>

          {/* Quick Test Keywords */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <FontAwesomeIcon icon={faKeyboard} className="mr-3 h-6 w-6 text-green-600" />
              Quick Test Keywords
            </h2>
            
            <p className="text-gray-600 mb-4">
              Click any keyword below to test the autocomplete:
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              {demoKeywords.map((keyword, index) => (
                <button
                  key={index}
                  onClick={() => setDemoValue(keyword)}
                  className="text-left p-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-all duration-200 text-sm font-medium text-gray-700 hover:text-blue-700"
                >
                  <FontAwesomeIcon icon={faSearch} className="mr-2 h-3 w-3 text-gray-400" />
                  {keyword}
                </button>
              ))}
            </div>

            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faCheckCircle} className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-800">
                  {ticketSuggestions.length} suggestions available
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            ✨ Autocomplete Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faSearch} className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Search</h3>
              <p className="text-gray-600 text-sm">
                Intelligent matching based on keywords and categories
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faLightbulb} className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Category Tags</h3>
              <p className="text-gray-600 text-sm">
                Color-coded categories for easy identification
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faKeyboard} className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Keyboard Navigation</h3>
              <p className="text-gray-600 text-sm">
                Use arrow keys and Enter to navigate suggestions
              </p>
            </div>
          </div>
        </div>

        {/* Categories Overview */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            🏷️ Available Categories
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Electrical', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', count: ticketSuggestions.filter(s => s.category === 'Electrical').length },
              { name: 'Plumbing', color: 'bg-blue-100 text-blue-800 border-blue-200', count: ticketSuggestions.filter(s => s.category === 'Plumbing').length },
              { name: 'HVAC', color: 'bg-green-100 text-green-800 border-green-200', count: ticketSuggestions.filter(s => s.category === 'HVAC').length },
              { name: 'Cleaning', color: 'bg-purple-100 text-purple-800 border-purple-200', count: ticketSuggestions.filter(s => s.category === 'Cleaning').length },
              { name: 'Security', color: 'bg-red-100 text-red-800 border-red-200', count: ticketSuggestions.filter(s => s.category === 'Security').length },
              { name: 'Maintenance', color: 'bg-gray-100 text-gray-800 border-gray-200', count: ticketSuggestions.filter(s => s.category === 'Maintenance').length },
              { name: 'IT', color: 'bg-indigo-100 text-indigo-800 border-indigo-200', count: ticketSuggestions.filter(s => s.category === 'IT').length },
            ].map((category, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border text-center ${category.color}`}
              >
                <div className="font-semibold">{category.name}</div>
                <div className="text-sm opacity-75">{category.count} suggestions</div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Link 
            to="/tickets/new" 
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg transform hover:scale-105"
          >
            <FontAwesomeIcon icon={faTicketAlt} className="mr-3 h-6 w-6" />
            Create Your First Smart Ticket
            <FontAwesomeIcon icon={faArrowRight} className="ml-3 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AutocompleteDemoPage;
