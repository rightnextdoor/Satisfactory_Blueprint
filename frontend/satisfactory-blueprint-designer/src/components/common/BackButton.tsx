// src/components/common/BackButton.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

const BackButton: React.FC = () => {
  const navigate = useNavigate();
  const canGoBack = window.history.state?.idx > 0;
  const handleClick = () => (canGoBack ? navigate(-1) : navigate('/'));

  return (
    <Button variant="secondary" onClick={handleClick}>
      ← Back
    </Button>
  );
};

export default BackButton;
