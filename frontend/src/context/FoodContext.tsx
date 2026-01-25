import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FoodItem, CommunityImpact, initialFoodItems, initialCommunityImpact, getRandomImage, getRandomDistance } from '@/services/mockData';
import { generateId, calculateMealsFromKg, calculateCO2Saved, calculateWaterSaved } from '@/utils/helpers';

interface FoodContextType {
  foodItems: FoodItem[];
  communityImpact: CommunityImpact;
  addFood: (food: Omit<FoodItem, 'id' | 'createdAt' | 'status' | 'image' | 'distance'>) => void;
  acceptFood: (foodId: string, ngoName: string) => void;
  pickupFood: (foodId: string) => void;
  getDonorStats: (donorId: string) => {
    totalDonations: number;
    acceptedItems: number;
    activeListings: number;
    foodSavedKg: number;
  };
  getNGOStats: () => {
    totalAccepted: number;
    pendingPickups: number;
    peopleFedToday: number;
    activeDonors: number;
  };
  getDonorFoods: (donorId: string) => FoodItem[];
  getAvailableFoods: () => FoodItem[];
  getHistory: (userId: string, role: 'donor' | 'ngo') => FoodItem[];
}

const FoodContext = createContext<FoodContextType | undefined>(undefined);

const FOOD_STORAGE_KEY = 'foodshare_foods';
const IMPACT_STORAGE_KEY = 'foodshare_impact';

export const FoodProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>(() => {
    const stored = localStorage.getItem(FOOD_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return initialFoodItems;
      }
    }
    return initialFoodItems;
  });

  const [communityImpact, setCommunityImpact] = useState<CommunityImpact>(() => {
    const stored = localStorage.getItem(IMPACT_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return initialCommunityImpact;
      }
    }
    return initialCommunityImpact;
  });

  useEffect(() => {
    localStorage.setItem(FOOD_STORAGE_KEY, JSON.stringify(foodItems));
  }, [foodItems]);

  useEffect(() => {
    localStorage.setItem(IMPACT_STORAGE_KEY, JSON.stringify(communityImpact));
  }, [communityImpact]);

  const addFood = (food: Omit<FoodItem, 'id' | 'createdAt' | 'status' | 'image' | 'distance'>) => {
    const newFood: FoodItem = {
      ...food,
      id: `food_${generateId()}`,
      status: 'available',
      image: getRandomImage(),
      distance: getRandomDistance(),
      createdAt: new Date().toISOString(),
    };
    setFoodItems(prev => [newFood, ...prev]);
  };

  const acceptFood = (foodId: string, ngoName: string) => {
    setFoodItems(prev =>
      prev.map(food =>
        food.id === foodId
          ? {
              ...food,
              status: 'picked' as const,
              acceptedBy: ngoName,
              acceptedAt: new Date().toISOString(),
            }
          : food
      )
    );

    const food = foodItems.find(f => f.id === foodId);
    if (food) {
      setCommunityImpact(prev => ({
        mealsProvided: prev.mealsProvided + calculateMealsFromKg(food.quantityKg),
        co2Reduced: prev.co2Reduced + calculateCO2Saved(food.quantityKg),
        waterSaved: prev.waterSaved + calculateWaterSaved(food.quantityKg),
      }));
    }
  };

  const pickupFood = (foodId: string) => {
    setFoodItems(prev =>
      prev.map(food =>
        food.id === foodId
          ? { ...food, pickedAt: new Date().toISOString() }
          : food
      )
    );
  };

  const getDonorStats = (donorId: string) => {
    const donorFoods = foodItems.filter(f => f.donorId === donorId);
    return {
      totalDonations: donorFoods.length,
      acceptedItems: donorFoods.filter(f => f.status === 'picked').length,
      activeListings: donorFoods.filter(f => f.status === 'available').length,
      foodSavedKg: donorFoods
        .filter(f => f.status === 'picked')
        .reduce((acc, f) => acc + f.quantityKg, 0),
    };
  };

  const getNGOStats = () => {
    const acceptedFoods = foodItems.filter(f => f.status === 'picked');
    const today = new Date().toDateString();
    const todayAccepted = acceptedFoods.filter(
      f => f.acceptedAt && new Date(f.acceptedAt).toDateString() === today
    );
    const uniqueDonors = new Set(foodItems.filter(f => f.status === 'available').map(f => f.donorId));

    return {
      totalAccepted: acceptedFoods.length,
      pendingPickups: acceptedFoods.filter(f => !f.pickedAt).length,
      peopleFedToday: todayAccepted.reduce((acc, f) => acc + calculateMealsFromKg(f.quantityKg), 0),
      activeDonors: uniqueDonors.size,
    };
  };

  const getDonorFoods = (donorId: string) => {
    return foodItems.filter(f => f.donorId === donorId);
  };

  const getAvailableFoods = () => {
    return foodItems.filter(f => f.status === 'available');
  };

  const getHistory = (userId: string, role: 'donor' | 'ngo') => {
    if (role === 'donor') {
      return foodItems
        .filter(f => f.donorId === userId && f.status !== 'available')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return foodItems
      .filter(f => f.acceptedBy)
      .sort((a, b) => new Date(b.acceptedAt || b.createdAt).getTime() - new Date(a.acceptedAt || a.createdAt).getTime());
  };

  return (
    <FoodContext.Provider
      value={{
        foodItems,
        communityImpact,
        addFood,
        acceptFood,
        pickupFood,
        getDonorStats,
        getNGOStats,
        getDonorFoods,
        getAvailableFoods,
        getHistory,
      }}
    >
      {children}
    </FoodContext.Provider>
  );
};

export const useFood = (): FoodContextType => {
  const context = useContext(FoodContext);
  if (!context) {
    throw new Error('useFood must be used within a FoodProvider');
  }
  return context;
};
