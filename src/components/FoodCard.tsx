import React, { useState } from 'react';
import { FoodItem } from '@/services/mockData';
import { Clock, MapPin, User, Check } from 'lucide-react';
import { getStatusColor, capitalizeFirst, getRelativeTime } from '@/utils/helpers';

interface FoodCardProps {
  food: FoodItem;
  showAcceptButton?: boolean;
  onAccept?: (foodId: string) => void;
}

const FoodCard: React.FC<FoodCardProps> = ({ food, showAcceptButton, onAccept }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);

  const handleAccept = async () => {
    if (!onAccept) return;
    setIsLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    onAccept(food.id);
    setIsAccepted(true);
    setIsLoading(false);
  };

  return (
    <div className="food-card animate-fade-in">
      <div className="relative">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-40 object-cover"
        />
        <div className="absolute top-3 right-3">
          <span className={`status-badge ${getStatusColor(food.status)}`}>
            {capitalizeFirst(food.status)}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground text-lg mb-1">{food.name}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{food.description}</p>
        
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{food.cookedTime}</span>
          </div>
          {food.distance && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{food.distance}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <User className="w-4 h-4" />
            <span>{food.donorName}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="bg-muted rounded-lg px-3 py-1.5">
            <span className="text-sm font-medium text-foreground">{food.quantity}</span>
          </div>
          
          {showAcceptButton && food.status === 'available' && (
            <button
              onClick={handleAccept}
              disabled={isLoading || isAccepted}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${
                isAccepted
                  ? 'bg-success/20 text-success'
                  : 'btn-primary-gradient disabled:opacity-50'
              }`}
            >
              {isLoading ? (
                <span className="loading-pulse">Processing...</span>
              ) : isAccepted ? (
                <>
                  <Check className="w-4 h-4" />
                  Accepted
                </>
              ) : (
                'Accept'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
