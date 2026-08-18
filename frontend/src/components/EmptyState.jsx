import React from 'react';
import { FolderOpen } from 'lucide-react';

const EmptyState = ({ 
  icon: Icon = FolderOpen, 
  title = 'No Data Found', 
  message = 'There is currently no data to display here.',
  action 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="bg-gray-50 p-4 rounded-full mb-4">
        <Icon className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md">{message}</p>
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
