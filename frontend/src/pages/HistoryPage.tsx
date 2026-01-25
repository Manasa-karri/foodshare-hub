import React from 'react';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import History from './History';

const HistoryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <History />
      </main>
      <BottomNav />
    </div>
  );
};

export default HistoryPage;
