import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description }) => {
  return (
    <div className="bg-white shadow">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <h1 className="text-2xl font-bold text-gray-900">
          {title}
        </h1>
        {description && description.length > 0 && (
          <p className="mt-2 text-sm text-gray-600">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default PageHeader;