import React from 'react';
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
      </div>
    </Card>
  );
};

export default MetricsCard;