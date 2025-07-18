// src/components/items/view/SectionTitle.tsx
import React from 'react';

export interface SectionTitleProps {
  text: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ text }) => (
  <h2 className="text-center font-bold text-xl mb-4">{text}</h2>
);

export default SectionTitle;
