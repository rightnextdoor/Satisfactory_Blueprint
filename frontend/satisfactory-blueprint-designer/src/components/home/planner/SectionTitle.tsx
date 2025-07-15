// src/components/home/planner/SectionTitle.tsx
import React from 'react';

interface SectionTitleProps {
  title: string;
  className?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  className = '',
}) => <h2 className={`${className}`}>{title}</h2>;

export default SectionTitle;
