import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import Card from '../ui/Card';

interface MetricsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;
  changeText?: string;
  className?: string;
}

const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  icon,
  change,
  changeText,
  className = '',
}) => {
  return (
    <Card className={className}>
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
          </div>
          <div className="p-3 rounded-full bg-blue-50 text-blue-600">
            {icon}
          </div>
        </div>
        
        {typeof change !== 'undefined' && (
          <div className="mt-4 flex items-center">
            {change > 0 ? (
              <ArrowUp className="text-emerald-500 h-4 w-4" />
            ) : change < 0 ? (
              <ArrowDown className="text-red-500 h-4 w-4" />
            ) : null}
            
            <span
              className={`text-sm font-medium ${
                change > 0
                  ? 'text-emerald-500'
                  : change < 0
                  ? 'text-red-500'
                  : 'text-gray-500'
              }`}
            >
              {Math.abs(change)}% {changeText || (change > 0 ? 'increase' : 'decrease')}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MetricsCard;