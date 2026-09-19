/**
 * Asset Domain Types — DOC-FE-001 & DOC-MOD-000
 */

export type AssetType = 'image' | 'video' | 'audio' | 'material';

export type DateGroupKey = 'today' | 'yesterday' | 'last_week' | 'older';

export interface AssetItem {
  id: string;
  title: string;
  titleFa: string;
  type: AssetType;
  image: string;
  thumbnail: string;
  prompt: string;
  model: string;
  aspectRatio: string;
  dimensions: string;
  fileSize: string;
  createdAt: string;
  createdAtFa: string;
  dateGroup: DateGroupKey;
  dateGroupLabel: string;
  dateGroupLabelFa: string;
  isFavorite: boolean;
  category: string;
  categoryFa: string;
  tags: string[];
}

export type AssetFilterCategory = 'all' | 'image' | 'video' | 'material';
export type AssetSubFilter = 'all' | 'favorites' | 'generations' | 'uploads';
