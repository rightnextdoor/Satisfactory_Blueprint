// src/components/common/NavBar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import BackButton from './BackButton';
import ExportButton from './ExportButton';

const EXPORT_PATHS = ['/', '/recipes', '/planner', '/transport'];

const NavBar: React.FC = () => {
  const { pathname } = useLocation();
  const cleanPath =
    pathname.endsWith('/') && pathname !== '/'
      ? pathname.slice(0, -1)
      : pathname;
  const showBack = cleanPath !== '/';
  const showExport = EXPORT_PATHS.some(
    (p) => cleanPath === p || cleanPath.startsWith(p + '/')
  );

  return (
    <nav className="bg-blue-300 w-full">
      <div className="flex items-center justify-between px-6 py-4 w-full">
        {/** ← LEFT: Back + Title */}
        <div className="flex items-center space-x-4">
          {showBack && <BackButton />}
          <span className="text-2xl font-bold text-gray-800">
            Satisfactory Blueprint Designer
          </span>
        </div>

        {/** MIDDLE: Nav Links fill the gap */}
        <div className="flex-1 flex space-x-6 mx-8">
          <Link to="/" className="text-2xl text-gray-800 hover:text-gray-600">
            Home
          </Link>
          <Link
            to="/items"
            className="text-2xl text-gray-800 hover:text-gray-600"
          >
            Items
          </Link>
          <Link
            to="/buildings"
            className="text-2xl text-gray-800 hover:text-gray-600"
          >
            Buildings
          </Link>
          <Link
            to="/generators"
            className="text-2xl text-gray-800 hover:text-gray-600"
          >
            Generators
          </Link>
          <Link
            to="/recipes"
            className="text-2xl text-gray-800 hover:text-gray-600"
          >
            Recipes
          </Link>
          <Link
            to="/planner"
            className="text-2xl text-gray-800 hover:text-gray-600"
          >
            Planner
          </Link>
          <Link
            to="/transport"
            className="text-2xl text-gray-800 hover:text-gray-600"
          >
            Transport Planner
          </Link>
        </div>

        {/** → RIGHT: Export */}
        <div>{showExport && <ExportButton />}</div>
      </div>
    </nav>
  );
};

export default NavBar;
