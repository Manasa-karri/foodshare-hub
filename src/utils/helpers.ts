export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateTime = (dateString: string): string => {
  return `${formatDate(dateString)} at ${formatTime(dateString)}`;
};

export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return formatDate(dateString);
};

export const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const validatePhone = (phone: string): boolean => {
  return /^\d{10}$/.test(phone);
};

export const calculateMealsFromKg = (kg: number): number => {
  // Assuming 0.5 kg per meal on average
  return Math.floor(kg * 2);
};

export const calculateCO2Saved = (kg: number): number => {
  // Approximately 2.5 kg CO2 saved per kg of food rescued
  return Math.round(kg * 2.5);
};

export const calculateWaterSaved = (kg: number): number => {
  // Approximately 1000 liters of water saved per kg of food rescued
  return Math.round(kg * 1000);
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'available':
      return 'status-available';
    case 'picked':
      return 'status-picked';
    case 'expired':
      return 'status-expired';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
