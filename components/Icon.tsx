import React from 'react';
import * as LucideIcons from 'lucide-react';

interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, size = 20, className }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const LucideIcon = (LucideIcons as any)[name] || LucideIcons.Circle;
  return <LucideIcon size={size} className={className} />;
};