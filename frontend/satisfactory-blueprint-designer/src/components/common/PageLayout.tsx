// src/components/common/PageLayout.tsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import BackButton from './BackButton';
import ExportButton from './ExportButton';

const EXPORT_PATHS = ['/', '/recipes', '/planner', '/transport'];

const PageLayout: React.FC = () => {
  const { pathname } = useLocation();

  // Normalize path (strip trailing slash, ignore deeper nested routes)
  const cleanPath =
    pathname.endsWith('/') && pathname !== '/'
      ? pathname.slice(0, -1)
      : pathname;

  const showBack = cleanPath !== '/';
  const showExport = EXPORT_PATHS.some(
    (p) => cleanPath === p || cleanPath.startsWith(p + '/')
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        {showBack ? <BackButton /> : <div />}
        {showExport ? <ExportButton /> : <div />}
      </div>
      <Outlet />
    </div>
  );
};

export default PageLayout;
