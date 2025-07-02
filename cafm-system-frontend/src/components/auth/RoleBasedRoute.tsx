import React from 'react';
import { useAuth } from '../../context/AuthContext';

interface RoleBasedRouteProps {
  adminComponent: React.ComponentType;
  managerComponent: React.ComponentType;
  serviceProviderComponent: React.ComponentType;
  endUserComponent: React.ComponentType;
}

/**
 * RoleBasedRoute - Routes users to different components based on their roles
 * Service providers (Plumber, Electrician, Cleaner) get the professional interface
 * Admins and Managers get their respective interfaces
 * End users get the standard interface
 */
const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  adminComponent: AdminComponent,
  managerComponent: ManagerComponent,
  serviceProviderComponent: ServiceProviderComponent,
  endUserComponent: EndUserComponent
}) => {
  const { user, hasRole, isLoading } = useAuth();

  // Show loading state while authentication is being checked
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // If no user is authenticated, return null (this shouldn't happen in protected routes)
  if (!user) {
    console.error('RoleBasedRoute: No user found, this should not happen in protected routes');
    return null;
  }

  try {
    // Admin gets admin interface
    if (hasRole('Admin')) {
      return <AdminComponent />;
    }

    // Manager gets manager interface
    if (hasRole('Manager')) {
      return <ManagerComponent />;
    }

    // Service providers get professional interface
    if (hasRole('Plumber') || hasRole('Electrician') || hasRole('Cleaner') ||
        hasRole('HVACTechnician') || hasRole('SecurityPersonnel') || hasRole('ITSupport') || hasRole('Engineer')) {
      return <ServiceProviderComponent />;
    }

    // Default to end user interface
    return <EndUserComponent />;
  } catch (error) {
    console.error('RoleBasedRoute: Error rendering component:', error);
    return (
      <div className="alert alert-danger">
        <h4>Error Loading Page</h4>
        <p>There was an error loading the page. Please try refreshing.</p>
        <pre>{error instanceof Error ? error.message : 'Unknown error'}</pre>
      </div>
    );
  }
};

export default RoleBasedRoute;
