import React from 'react';

export default function NotesListSidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <aside
      id="logo-sidebar"
      className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
      aria-label="Sidebar"
    >
      <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800  p-2 text-gray-900 rounded-lg dark:text-white">
        {children}
      </div>
    </aside>
  );
}
