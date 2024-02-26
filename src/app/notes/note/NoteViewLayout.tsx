import React from 'react';

export function NoteViewLayout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="p-4 sm:ml-64 mt-14 fixed top-0 left-0 bottom-0 right-0">
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 w-full h-full">
        {children}
      </div>
    </div>
  );
}
