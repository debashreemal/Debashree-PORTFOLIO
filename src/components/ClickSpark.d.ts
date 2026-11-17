import React from 'react';

export interface ClickSparkProps {
  sparkColor?: string | string[];
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  sparkWidth?: number;
  duration?: number;
  easing?: 'ease-out' | 'ease-in-out' | 'ease-in' | 'linear' | 'spring';
  extraScale?: number;
  shape?: 'line' | 'streak' | 'dot' | 'star';
  randomness?: number;
  gravity?: number;
  spread?: number;
  direction?: number;
  glow?: number;
  ring?: boolean;
  layer?: 'front' | 'back';
  disabled?: boolean;
  onlyButtons?: boolean;
  targetSelector?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export interface ClickSparkRef {
  spark: (x?: number, y?: number) => void;
}

declare const ClickSpark: React.ForwardRefExoticComponent<
  ClickSparkProps & React.RefAttributes<ClickSparkRef>
>;

export default ClickSpark;
