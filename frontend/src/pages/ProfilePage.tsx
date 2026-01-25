import React from 'react';
import BottomNav from '@/components/BottomNav';
import Profile from './Profile';

const ProfilePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <Profile />
      </main>
      <BottomNav />
    </div>
  );
};

export default ProfilePage;
