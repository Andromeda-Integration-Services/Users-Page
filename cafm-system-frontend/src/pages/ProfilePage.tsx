import React from 'react';
import UserProfile from '../components/auth/UserProfile';
import MainLayout from '../components/layout/MainLayout';

const ProfilePage: React.FC = () => {
  return (
    <MainLayout>
      <h1 className="mb-4">My Profile</h1>
      <UserProfile />
    </MainLayout>
  );
};

export default ProfilePage;
