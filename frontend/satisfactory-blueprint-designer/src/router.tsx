// src/router.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import PageLayout from './components/common/PageLayout';
import Home from './pages/Home';
import Items from './pages/Items';
import Buildings from './pages/Buildings';
import Generators from './pages/Generators';
import Recipes from './pages/Recipes';
import Planner from './pages/Planner';
import TransportPlanner from './pages/TransportPlanner';
import NotFound from './pages/NotFound';

const AppRoutes: React.FC = () => (
  <Routes>
    {/* ** Wrap ALL routes in PageLayout ** */}
    <Route element={<PageLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/items" element={<Items />} />
      <Route path="/buildings" element={<Buildings />} />
      <Route path="/generators" element={<Generators />} />
      <Route path="/recipes" element={<Recipes />} />
      <Route path="/planner" element={<Planner />} />
      <Route path="/transport" element={<TransportPlanner />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

export default AppRoutes;
