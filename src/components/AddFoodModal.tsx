import React, { useState } from 'react';
import Modal from './Modal';
import { useFood } from '@/context/FoodContext';
import { useAuth } from '@/context/AuthContext';
import { UtensilsCrossed, Clock, Scale, FileText } from 'lucide-react';

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddFoodModal: React.FC<AddFoodModalProps> = ({ isOpen, onClose }) => {
  const { addFood } = useFood();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: '',
    quantityKg: '',
    cookedTime: '',
    expiryTime: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Food name is required';
    }
    if (!formData.quantity.trim()) {
      newErrors.quantity = 'Quantity is required';
    }
    if (!formData.quantityKg || parseFloat(formData.quantityKg) <= 0) {
      newErrors.quantityKg = 'Enter valid weight in kg';
    }
    if (!formData.cookedTime.trim()) {
      newErrors.cookedTime = 'Cooked time is required';
    }
    if (!formData.expiryTime.trim()) {
      newErrors.expiryTime = 'Expiry time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));

    addFood({
      name: formData.name.trim(),
      description: formData.description.trim() || 'Freshly prepared food available for pickup',
      quantity: formData.quantity.trim(),
      quantityKg: parseFloat(formData.quantityKg),
      cookedTime: formData.cookedTime.trim(),
      expiryTime: formData.expiryTime.trim(),
      donorId: user.id,
      donorName: user.username,
    });

    setFormData({
      name: '',
      description: '',
      quantity: '',
      quantityKg: '',
      cookedTime: '',
      expiryTime: '',
    });
    setErrors({});
    setIsLoading(false);
    onClose();
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-xl border ${
      errors[field] ? 'border-destructive bg-destructive/5' : 'border-border bg-muted/50'
    } focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Food Donation">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
            <UtensilsCrossed className="w-4 h-4 text-primary" />
            Food Name
          </label>
          <input
            type="text"
            placeholder="e.g., Vegetable Biryani"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={inputClass('name')}
          />
          {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
            <FileText className="w-4 h-4 text-primary" />
            Description (Optional)
          </label>
          <textarea
            placeholder="Describe the food item..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={2}
            className={inputClass('description')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Servings
            </label>
            <input
              type="text"
              placeholder="e.g., 5 servings"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className={inputClass('quantity')}
            />
            {errors.quantity && <p className="text-xs text-destructive mt-1">{errors.quantity}</p>}
          </div>
          
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <Scale className="w-4 h-4 text-primary" />
              Weight (kg)
            </label>
            <input
              type="number"
              step="0.1"
              placeholder="e.g., 2.5"
              value={formData.quantityKg}
              onChange={(e) => setFormData({ ...formData, quantityKg: e.target.value })}
              className={inputClass('quantityKg')}
            />
            {errors.quantityKg && <p className="text-xs text-destructive mt-1">{errors.quantityKg}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <Clock className="w-4 h-4 text-primary" />
              Cooked
            </label>
            <input
              type="text"
              placeholder="e.g., 1 hour ago"
              value={formData.cookedTime}
              onChange={(e) => setFormData({ ...formData, cookedTime: e.target.value })}
              className={inputClass('cookedTime')}
            />
            {errors.cookedTime && <p className="text-xs text-destructive mt-1">{errors.cookedTime}</p>}
          </div>
          
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Expires In
            </label>
            <input
              type="text"
              placeholder="e.g., 6 hours"
              value={formData.expiryTime}
              onChange={(e) => setFormData({ ...formData, expiryTime: e.target.value })}
              className={inputClass('expiryTime')}
            />
            {errors.expiryTime && <p className="text-xs text-destructive mt-1">{errors.expiryTime}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary-gradient py-4 mt-2 disabled:opacity-50"
        >
          {isLoading ? (
            <span className="loading-pulse">Adding Food...</span>
          ) : (
            'Add Food Donation'
          )}
        </button>
      </form>
    </Modal>
  );
};

export default AddFoodModal;
