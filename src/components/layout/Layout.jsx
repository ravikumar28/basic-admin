import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children, showSidebar = true }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        {showSidebar && <Sidebar />}
        <main className={`flex-grow p-6 ${showSidebar ? '' : 'w-full'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;