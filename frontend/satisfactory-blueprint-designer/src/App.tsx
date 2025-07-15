// src/App.tsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import NavBar from './components/common/NavBar';
import AppRoutes from './router';

const App: React.FC = () => (
  <div className="bg-gray-50 text-gray-800 min-h-screen">
    <Router>
      <NavBar />
      <AppRoutes />
    </Router>
  </div>
);

export default App;
