import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Heart, Building2 } from 'lucide-react';

const RoleSwitch: React.FC = () => {
  const { role, switchRole } = useAuth();

  return (
    <button
      onClick={switchRole}
      className="flex items-center gap-2 px-3 py-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-all duration-200"
    >
      {role === 'donor' ? (
        <>
          <Heart className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Donor</span>
        </>
      ) : (
        <>
          <Building2 className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">NGO</span>
        </>
      )}
      <div className="w-8 h-5 rounded-full bg-primary/20 relative ml-1">
        <div
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-primary transition-all duration-200 ${
            role === 'ngo' ? 'left-3.5' : 'left-0.5'
          }`}
        />
      </div>
    </button>
  );
};

export default RoleSwitch;
