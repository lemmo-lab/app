export type ToolCategory =
  | 'all'
  | 'vision'
  | 'editing'
  | 'depth'
  | 'generative';

export interface ToolItem {
  id: string;
  name: string;
  nameFa: string;
  tagline: string;
  taglineFa: string;
  description: string;
  descriptionFa: string;
  category: ToolCategory;
  categoryLabel: string;
  categoryLabelFa: string;
  rating: string;
  version: string;
  coverImage: string;
  author: string;
  authorFa: string;
  iconName: 'wand' | 'scissors' | 'layers' | 'cpu' | 'camera' | 'spark';
  inputs: string;
  inputsFa: string;
  speed: string;
  speedFa: string;
  credits: number;
  isRecent?: boolean;
}
