import { Asset } from '@/sdk';
import { AssetItem, DateGroupKey } from '../types';

/**
 * Calculates date group based on timestamp.
 */
function calculateDateGroup(timestamp: number): {
  dateGroup: DateGroupKey;
  dateGroupLabel: string;
  dateGroupLabelFa: string;
  createdAtStr: string;
  createdAtFaStr: string;
} {
  const now = Date.now();
  const diffMs = Math.max(0, now - timestamp);
  const diffMins = Math.floor(diffMs / (60 * 1000));
  const diffHours = Math.floor(diffMs / (3600 * 1000));
  const diffDays = Math.floor(diffMs / (24 * 3600 * 1000));

  let dateGroup: DateGroupKey = 'today';
  let dateGroupLabel = 'Today';
  let dateGroupLabelFa = 'امروز';

  if (diffDays === 1) {
    dateGroup = 'yesterday';
    dateGroupLabel = 'Yesterday';
    dateGroupLabelFa = 'دیروز';
  } else if (diffDays > 1 && diffDays <= 7) {
    dateGroup = 'last_week';
    dateGroupLabel = 'Last Week';
    dateGroupLabelFa = 'هفته گذشته';
  } else if (diffDays > 7) {
    dateGroup = 'older';
    dateGroupLabel = 'Older';
    dateGroupLabelFa = 'گذشته';
  }

  let createdAtStr = 'Just now';
  let createdAtFaStr = 'همین الان';

  if (diffMins < 60) {
    createdAtStr = `${Math.max(1, diffMins)} minutes ago`;
    createdAtFaStr = `${Math.max(1, diffMins)} دقیقه پیش`;
  } else if (diffHours < 24) {
    createdAtStr = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    createdAtFaStr = `${diffHours} ساعت پیش`;
  } else {
    createdAtStr = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    createdAtFaStr = `${diffDays} روز پیش`;
  }

  return {
    dateGroup,
    dateGroupLabel,
    dateGroupLabelFa,
    createdAtStr,
    createdAtFaStr,
  };
}

/**
 * Maps raw backend Asset to UI presentation AssetItem.
 */
export function mapAssetToItem(asset: Asset): AssetItem {
  const dateInfo = calculateDateGroup(asset.createdAt || Date.now());

  return {
    id: asset.id,
    title: asset.title || asset.name || 'Untitled Asset',
    titleFa: asset.titleFa || asset.name || 'اثر بدون نام',
    type: (asset.type === 'text' ? 'material' : asset.type) as AssetItem['type'],
    image: asset.url,
    thumbnail: asset.thumbnailUrl || asset.url,
    prompt: asset.prompt || 'Generated with Lemmo AI Studio',
    model: asset.model || 'FLUX.1 [dev]',
    aspectRatio: asset.aspectRatio || '1:1',
    dimensions:
      asset.dimensions ||
      (asset.width && asset.height ? `${asset.width} × ${asset.height}` : '2048 × 2048'),
    fileSize: asset.fileSize || '2.8 MB',
    createdAt: dateInfo.createdAtStr,
    createdAtFa: dateInfo.createdAtFaStr,
    dateGroup: dateInfo.dateGroup,
    dateGroupLabel: dateInfo.dateGroupLabel,
    dateGroupLabelFa: dateInfo.dateGroupLabelFa,
    isFavorite: Boolean(asset.isFavorite),
    category: asset.category || 'photoreal',
    categoryFa: asset.categoryFa || 'واقع‌گرایانه',
    tags: asset.tags || ['creative', 'ai'],
  };
}
