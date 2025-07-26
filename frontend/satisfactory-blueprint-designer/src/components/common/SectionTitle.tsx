// src/components/common/SectionTitle.tsx
import React from 'react';

export interface SectionTitleProps {
  /** Title text */
  text: string;
  /** Custom class for styling via CSS */
  className?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  text,
  className = '',
}) => <h2 className={className}>{text}</h2>;

export default SectionTitle;
