import React from 'react';
import { useFood } from '@/context/FoodContext';
import StatCard from '@/components/StatCard';
import FoodCard from '@/components/FoodCard';
import ImpactCard from '@/components/ImpactCard';
import { CheckCircle2, Clock, Users, Heart, UtensilsCrossed } from 'lucide-react';

const NGODashboard: React.FC = () => {
  const { getNGOStats, getAvailableFoods, acceptFood } = useFood();

  const stats = getNGOStats();
  const availableFoods = getAvailableFoods();

  const handleAccept = (foodId: string) => {
    acceptFood(foodId, 'HopeShelter NGO');
  };

  return (
    <div className="px-4 py-6 safe-bottom">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard
          icon={CheckCircle2}
          label="Total Accepted"
          value={stats.totalAccepted}
          color="primary"
        />
        <StatCard
          icon={Clock}
          label="Pending Pickups"
          value={stats.pendingPickups}
          color="secondary"
        />
        <StatCard
          icon={Users}
          label="People Fed Today"
          value={stats.peopleFedToday}
          color="accent"
        />
        <StatCard
          icon={Heart}
          label="Active Donors"
          value={stats.activeDonors}
          color="primary"
        />
      </div>

      {/* Community Impact */}
      <div className="mb-6">
        <ImpactCard />
      </div>

      {/* Browse Available Food */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground">Available Nearby</h2>
          <span className="text-sm text-muted-foreground">
            {availableFoods.length} items
          </span>
        </div>
        
        {availableFoods.length > 0 ? (
          <div className="space-y-4">
            {availableFoods.map((food) => (
              <FoodCard
                key={food.id}
                food={food}
                showAcceptButton
                onAccept={handleAccept}
              />
            ))}
          </div>
        ) : (
          <div className="card-elevated text-center py-12">
            <UtensilsCrossed className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No food available right now</p>
            <p className="text-sm text-muted-foreground mt-1">
              Check back soon for new donations!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NGODashboard;
