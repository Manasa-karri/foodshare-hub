import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useFood } from '@/context/FoodContext';
import StatCard from '@/components/StatCard';
import FoodCard from '@/components/FoodCard';
import ImpactCard from '@/components/ImpactCard';
import AddFoodModal from '@/components/AddFoodModal';
import { Package, CheckCircle, ListChecks, Scale, Plus, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DonorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getDonorStats, getDonorFoods } = useFood();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const navigate = useNavigate();

  const stats = getDonorStats(user.id);
  const recentDonations = getDonorFoods(user.id).slice(0, 4);

  return (
    <div className="px-4 py-6 safe-bottom">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard
          icon={Package}
          label="Total Donations"
          value={stats.totalDonations}
          color="primary"
        />
        <StatCard
          icon={CheckCircle}
          label="Accepted Items"
          value={stats.acceptedItems}
          color="secondary"
        />
        <StatCard
          icon={ListChecks}
          label="Active Listings"
          value={stats.activeListings}
          color="accent"
        />
        <StatCard
          icon={Scale}
          label="Food Saved"
          value={`${stats.foodSavedKg} kg`}
          color="primary"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-3">Quick Actions</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 btn-primary-gradient py-4"
          >
            <Plus className="w-5 h-5" />
            Add Food
          </button>
          <button
            onClick={() => navigate('/history')}
            className="flex-1 flex items-center justify-center gap-2 bg-secondary text-secondary-foreground font-semibold rounded-xl px-6 py-4 hover:bg-secondary/80 transition-colors"
          >
            <Clock className="w-5 h-5" />
            View History
          </button>
        </div>
      </div>

      {/* Community Impact */}
      <div className="mb-6">
        <ImpactCard />
      </div>

      {/* Recent Donations */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground">Recent Donations</h2>
          {recentDonations.length > 3 && (
            <button
              onClick={() => navigate('/history')}
              className="text-sm text-primary font-medium"
            >
              View All
            </button>
          )}
        </div>
        
        {recentDonations.length > 0 ? (
          <div className="space-y-4">
            {recentDonations.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        ) : (
          <div className="card-elevated text-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No donations yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Start sharing food with your community!
            </p>
          </div>
        )}
      </div>

      <AddFoodModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
};

export default DonorDashboard;
