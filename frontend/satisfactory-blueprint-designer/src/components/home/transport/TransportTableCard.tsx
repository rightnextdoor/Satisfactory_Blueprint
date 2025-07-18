// src/components/home/transport/TransportTableCard.tsx
import React from 'react';

interface TransportTableCardProps {
  children: React.ReactNode;
  className?: string;
}

const TransportTableCard: React.FC<TransportTableCardProps> = ({
  children,
  className = '',
}) => (
  <div className={`transport-routes__card ${className}`.trim()}>{children}</div>
);

export default TransportTableCard;
