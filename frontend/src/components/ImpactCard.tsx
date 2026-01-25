import React from 'react';
import { useFood } from '@/context/FoodContext';
import { Utensils, Leaf, Droplets, TrendingUp } from 'lucide-react';

const ImpactCard: React.FC = () => {
  const { communityImpact } = useFood();

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  return (
    <div className="impact-card animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-primary" />
        </div>
        <h3 className="font-semibold text-foreground">Community Impact</h3>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-2">
            <Utensils className="w-5 h-5 text-primary" />
          </div>
          <p className="text-lg font-bold text-foreground">{formatNumber(communityImpact.mealsProvided)}</p>
          <p className="text-xs text-muted-foreground">Meals Provided</p>
        </div>
        
        <div className="text-center">
          <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-2">
            <Leaf className="w-5 h-5 text-primary" />
          </div>
          <p className="text-lg font-bold text-foreground">{formatNumber(communityImpact.co2Reduced)}</p>
          <p className="text-xs text-muted-foreground">CO₂ Reduced (kg)</p>
        </div>
        
        <div className="text-center">
          <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-2">
            <Droplets className="w-5 h-5 text-primary" />
          </div>
          <p className="text-lg font-bold text-foreground">{formatNumber(communityImpact.waterSaved)}</p>
          <p className="text-xs text-muted-foreground">Water Saved (L)</p>
        </div>
      </div>
    </div>
  );
};

export default ImpactCard;
