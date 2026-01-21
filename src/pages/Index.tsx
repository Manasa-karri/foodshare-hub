import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import DonorDashboard from './DonorDashboard';
import NGODashboard from './NGODashboard';

const Index: React.FC = () => {
  const { role } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {role === 'donor' ? <DonorDashboard /> : <NGODashboard />}
      </main>
      <BottomNav />
    </div>
  );
};

export default Index;
