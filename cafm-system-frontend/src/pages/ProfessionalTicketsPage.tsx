import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faTicketAlt,
  faChartBar,
  faDownload,
  faFilter
} from '@fortawesome/free-solid-svg-icons';
import ProfessionalLayout from '../components/layout/ProfessionalLayout';
import ProfessionalTicketList from '../components/tickets/ProfessionalTicketList';
import { useAuth } from '../context/AuthContext';

const ProfessionalTicketsPage: React.FC = () => {
  const { user, hasRole } = useAuth();

  return (
    <ProfessionalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FontAwesomeIcon icon={faTicketAlt} className="mr-3 h-8 w-8 text-primary-600" />
              Service Requests
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and track all facility maintenance requests
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            {hasRole('Admin') && (
              <button className="btn-gov-secondary">
                <FontAwesomeIcon icon={faDownload} className="mr-2 h-4 w-4" />
                Export Report
              </button>
            )}
            <Link to="/tickets/new" className="btn-gov-primary">
              <FontAwesomeIcon icon={faPlus} className="mr-2 h-4 w-4" />
              Create Request
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="stats-card">
            <div className="flex items-center">
              <div className="stats-card-icon bg-primary-100 text-primary-600">
                <FontAwesomeIcon icon={faTicketAlt} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">My Requests</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="flex items-center">
              <div className="stats-card-icon bg-warning-100 text-warning-600">
                <FontAwesomeIcon icon={faFilter} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Assigned to Me</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="flex items-center">
              <div className="stats-card-icon bg-success-100 text-success-600">
                <FontAwesomeIcon icon={faChartBar} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-gray-900">45</p>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="flex items-center">
              <div className="stats-card-icon bg-danger-100 text-danger-600">
                <FontAwesomeIcon icon={faTicketAlt} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tickets List */}
        <ProfessionalTicketList />
      </div>
    </ProfessionalLayout>
  );
};

export default ProfessionalTicketsPage;
