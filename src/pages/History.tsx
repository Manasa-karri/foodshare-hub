import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useFood } from '@/context/FoodContext';
import { Clock, CheckCircle, Package, Flame, Scale, Calendar } from 'lucide-react';
import { formatDateTime, getStatusColor, capitalizeFirst } from '@/utils/helpers';

const History: React.FC = () => {
  const { user, role } = useAuth();
  const { getHistory, getDonorStats, getNGOStats } = useFood();

  const historyItems = getHistory(user.id, role);
  const stats = role === 'donor' ? getDonorStats(user.id) : getNGOStats();

  const completedPickups = historyItems.filter(item => item.status === 'picked').length;
  const foodSavedKg = historyItems
    .filter(item => item.status === 'picked')
    .reduce((acc, item) => acc + item.quantityKg, 0);
  
  // Calculate streak (consecutive days with activity)
  const calculateStreak = (): number => {
    const today = new Date();
    let streak = 0;
    const dates = historyItems
      .map(item => new Date(item.createdAt).toDateString())
      .filter((date, index, self) => self.indexOf(date) === index);
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      if (dates.includes(checkDate.toDateString())) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  };

  const streak = calculateStreak();

  return (
    <div className="px-4 py-6 safe-bottom">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">History</h1>
        <p className="text-muted-foreground">Your {role === 'donor' ? 'donation' : 'collection'} history</p>
      </div>

      {/* Impact Summary */}
      <div className="impact-card mb-6">
        <h3 className="font-semibold text-foreground mb-4">Your Impact Summary</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-5 h-5 text-primary" />
            </div>
            <p className="text-lg font-bold text-foreground">{completedPickups}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-2">
              <Scale className="w-5 h-5 text-primary" />
            </div>
            <p className="text-lg font-bold text-foreground">{foodSavedKg.toFixed(1)} kg</p>
            <p className="text-xs text-muted-foreground">Food Saved</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-2">
              <Flame className="w-5 h-5 text-primary" />
            </div>
            <p className="text-lg font-bold text-foreground">{streak}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Activity Timeline</h2>
        
        {historyItems.length > 0 ? (
          <div className="relative">
            {historyItems.map((item, index) => (
              <div key={item.id} className="timeline-item animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="timeline-dot" />
                <div className="card-elevated">
                  <div className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-foreground truncate">{item.name}</h3>
                        <span className={`status-badge flex-shrink-0 ${getStatusColor(item.status)}`}>
                          {capitalizeFirst(item.status)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDateTime(item.acceptedAt || item.createdAt)}
                        </span>
                        <span>{item.quantity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card-elevated text-center py-12">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No history yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              {role === 'donor' 
                ? 'Start donating food to see your history here!' 
                : 'Accept food donations to see your history here!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
