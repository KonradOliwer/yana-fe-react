import React from 'react';

export function MainArea({ children }: { children: React.ReactNode }) {
  return <div className="p-4 sm:ml-64">
    <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
      {children}
    </div>
  </div>;
}