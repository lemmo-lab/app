export type SettingsTabId =
  | 'profile'
  | 'account'
  | 'appearance'
  | 'promo'
  | 'overview'
  | 'members'
  | 'settings'
  | 'billing'
  | 'compute-packs'
  | 'api-tokens';

export interface SelectOption {
  value: string;
  label: string;
}

export interface WorkspaceMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Editor' | 'Viewer';
  initials: string;
}

export interface ApiTokenItem {
  id: string;
  name: string;
  tokenPrefix: string;
  scope: string;
  created: string;
  lastUsed: string;
}

export interface PromoCodeItem {
  code: string;
  title: string;
  discount: string;
  status: 'active' | 'used' | 'expired';
  expiresAt: string;
}
