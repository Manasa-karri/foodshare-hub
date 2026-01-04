export interface User {
  id: string;
  username: string;
  phone: string;
  password: string;
  status: 'Verified' | 'Pending';
  role: 'donor' | 'ngo';
  totalContributions: number;
  createdAt: string;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  quantity: string;
  quantityKg: number;
  cookedTime: string;
  expiryTime: string;
  status: 'available' | 'picked' | 'expired';
  image: string;
  donorId: string;
  donorName: string;
  distance?: string;
  acceptedBy?: string;
  acceptedAt?: string;
  pickedAt?: string;
  createdAt: string;
}

export interface CommunityImpact {
  mealsProvided: number;
  co2Reduced: number;
  waterSaved: number;
}

export const defaultUser: User = {
  id: 'user_001',
  username: 'GreenDonor',
  phone: '9876543210',
  password: 'password123',
  status: 'Verified',
  role: 'donor',
  totalContributions: 47,
  createdAt: '2024-01-15',
};

export const foodImages = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
];

export const initialFoodItems: FoodItem[] = [
  {
    id: 'food_001',
    name: 'Vegetable Biryani',
    description: 'Fresh homemade vegetable biryani with aromatic spices',
    quantity: '5 servings',
    quantityKg: 2.5,
    cookedTime: '2 hours ago',
    expiryTime: '6 hours',
    status: 'available',
    image: foodImages[0],
    donorId: 'user_001',
    donorName: 'GreenDonor',
    distance: '0.8 km',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'food_002',
    name: 'Dal Tadka',
    description: 'Protein-rich lentil curry with fresh tadka',
    quantity: '8 servings',
    quantityKg: 3,
    cookedTime: '1 hour ago',
    expiryTime: '8 hours',
    status: 'available',
    image: foodImages[1],
    donorId: 'user_002',
    donorName: 'FoodHero',
    distance: '1.2 km',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'food_003',
    name: 'Mixed Fruit Salad',
    description: 'Fresh seasonal fruits cut and ready to serve',
    quantity: '10 portions',
    quantityKg: 2,
    cookedTime: '30 minutes ago',
    expiryTime: '4 hours',
    status: 'picked',
    image: foodImages[2],
    donorId: 'user_001',
    donorName: 'GreenDonor',
    distance: '0.5 km',
    acceptedBy: 'HopeShelter',
    acceptedAt: new Date(Date.now() - 3600000).toISOString(),
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'food_004',
    name: 'Chapati & Sabzi',
    description: 'Fresh wheat chapatis with mixed vegetable curry',
    quantity: '15 servings',
    quantityKg: 4,
    cookedTime: '3 hours ago',
    expiryTime: '5 hours',
    status: 'available',
    image: foodImages[3],
    donorId: 'user_003',
    donorName: 'KindnessKitchen',
    distance: '2.1 km',
    createdAt: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: 'food_005',
    name: 'Rice & Sambar',
    description: 'South Indian style rice with traditional sambar',
    quantity: '12 servings',
    quantityKg: 5,
    cookedTime: '4 hours ago',
    expiryTime: '2 hours',
    status: 'expired',
    image: foodImages[4],
    donorId: 'user_001',
    donorName: 'GreenDonor',
    createdAt: new Date(Date.now() - 14400000).toISOString(),
  },
];

export const initialCommunityImpact: CommunityImpact = {
  mealsProvided: 12847,
  co2Reduced: 3421,
  waterSaved: 156780,
};

export const getRandomDistance = (): string => {
  const distances = ['0.3 km', '0.5 km', '0.8 km', '1.2 km', '1.5 km', '2.0 km', '2.5 km'];
  return distances[Math.floor(Math.random() * distances.length)];
};

export const getRandomImage = (): string => {
  return foodImages[Math.floor(Math.random() * foodImages.length)];
};
