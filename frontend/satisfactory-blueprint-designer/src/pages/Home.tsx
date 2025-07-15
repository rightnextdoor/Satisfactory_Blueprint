// src/pages/Home.tsx
import React from 'react';
import HeroSection from '../components/home/HeroSection';
import RecentPlanners from '../components/home/planner/RecentPlanners';
import TransportRoutes from '../components/home/TransportRoutes';

const Home: React.FC = () => (
  <div className="space-y-10 py-8">
    <HeroSection />
    <RecentPlanners />
    <TransportRoutes />
  </div>
);

export default Home;
