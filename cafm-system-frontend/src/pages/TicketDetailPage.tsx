import React from 'react';
import TicketDetail from '../components/tickets/TicketDetail';
import MainLayout from '../components/layout/MainLayout';

const TicketDetailPage: React.FC = () => {
  return (
    <MainLayout>
      <h1 className="mb-4">Ticket Details</h1>
      <TicketDetail />
    </MainLayout>
  );
};

export default TicketDetailPage;
