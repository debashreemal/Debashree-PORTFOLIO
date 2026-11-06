import React from 'react';

export interface FlyingButtonProps {
  children?: React.ReactNode;
  theme?: 'dark' | 'light';
  size?: 'small' | 'medium' | 'large' | 'extra-large';
  radius?: number;
  altitude?: number;
  hoverTime?: number;
  jets?: number;
  thrusters?: boolean;
  trigger?: 'hover' | 'click';
  carryCursor?: boolean;
  ramp?: boolean;
  rampColor?: string;
  smoke?: number;
  turbulence?: number;
  wobble?: number;
  thrustColor?: string;
  smokeColor?: string;
  buttonColor?: string;
  textColor?: string;
  buttonAlign?: 'left' | 'center' | 'right' | number;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e?: React.MouseEvent) => void;
}

declare const FlyingButton: React.FC<FlyingButtonProps>;
export default FlyingButton;

