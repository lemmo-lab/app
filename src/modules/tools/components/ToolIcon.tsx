import React from 'react';
import {
  ScissorsCut,
  AiMagicWand01,
  LayersThree,
  AiCamera,
  Sparks,
  AiCpu,
} from 'synthline/react';
import { ToolItem } from '../types';

interface ToolIconProps {
  iconName: ToolItem['iconName'];
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function ToolIcon({
  iconName,
  size = 18,
  strokeWidth = 2,
  className,
}: ToolIconProps) {
  switch (iconName) {
    case 'scissors':
      return <ScissorsCut size={size} strokeWidth={strokeWidth} color="currentColor" className={className} />;
    case 'wand':
      return <AiMagicWand01 size={size} strokeWidth={strokeWidth} color="currentColor" className={className} />;
    case 'layers':
      return <LayersThree size={size} strokeWidth={strokeWidth} color="currentColor" className={className} />;
    case 'camera':
      return <AiCamera size={size} strokeWidth={strokeWidth} color="currentColor" className={className} />;
    case 'spark':
      return <Sparks size={size} strokeWidth={strokeWidth} color="currentColor" className={className} />;
    default:
      return <AiCpu size={size} strokeWidth={strokeWidth} color="currentColor" className={className} />;
  }
}
