// src/components/home/HeroSection.tsx
import React from 'react';
import '../../styles/home/HeroSection.css';

const HeroSection: React.FC = () => (
  <section className="hero-section">
    <div className="hero-container">
      <h1 className="title">Satisfactory</h1>
      <h2 className="subtitle">Blueprint Designer</h2>
    </div>
  </section>
);

export default HeroSection;
