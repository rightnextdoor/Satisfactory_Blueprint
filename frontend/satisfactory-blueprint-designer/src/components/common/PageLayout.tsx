// src/components/common/PageLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const PageLayout: React.FC = () => (
  <div className="p-6">
    <Outlet />
  </div>
);

export default PageLayout;
