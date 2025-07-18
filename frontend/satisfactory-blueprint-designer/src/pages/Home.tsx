// src/pages/Home.tsx
import React from 'react';
import HeroSection from '../components/home/HeroSection';
import RecentPlanners from '../components/home/planner/RecentPlanners';
import TransportRoutes from '../components/home/transport/TransportRoutes';
import '../styles/home/Home.css';

const Home: React.FC = () => (
  <main className="p-6">
    <HeroSection />

    <section className="home-cards-container mt-8 space-y-12">
      <div className="home-card">
        <RecentPlanners />
      </div>
      <div className="home-card">
        <TransportRoutes />
      </div>
    </section>
  </main>
);

export default Home;
