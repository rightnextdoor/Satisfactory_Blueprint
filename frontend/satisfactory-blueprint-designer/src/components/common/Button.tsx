// src/components/common/Button.tsx
import React from 'react';

type Variant = 'primary' | 'secondary';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Choose the color theme */
  variant?: Variant;
  children: React.ReactNode;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: 'bg-teal-600 hover:bg-teal-700 text-white',
  secondary: 'bg-blue-600 hover:bg-blue-500 text-white',
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  className = '',
  children,
  ...props
}) => (
  <button
    className={[
      'inline-block px-4 py-2 rounded',
      VARIANT_CLASSES[variant],
      className,
    ].join(' ')}
    {...props}
  >
    {children}
  </button>
);

export default Button;
