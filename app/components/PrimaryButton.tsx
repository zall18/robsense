import React from 'react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ children, ...props }) => {
  return (
    <button
      className="bg-[var(--color-brand-primary)] text-white rounded-[8px] px-4 py-2 hover:bg-[var(--color-brand-primary-hover)] transition-colors"
      {...props}
    >
      {children}
    </button>
  );
};
