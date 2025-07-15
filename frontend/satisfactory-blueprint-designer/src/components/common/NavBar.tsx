// src/components/common/NavBar.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const NavBar: React.FC = () => (
  <nav className="bg-blue-300">
    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center">
      {/* Title on the left, now dark gray */}
      <span className="text-2xl font-bold text-gray-800 flex-shrink-0">
        Satisfactory Blueprint Designer
      </span>

      {/* Links spread out, also dark gray with a lighter gray hover */}
      <div className="flex-1 flex flex-wrap justify-evenly">
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
    </div>
  </nav>
);

export default NavBar;
