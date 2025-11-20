/**
 * Page 相關資料模型
 * Notion 風格的頁面系統
 */

import { Block } from './block.model';

export interface PageIcon {
  type: 'emoji' | 'file' | 'external';
  emoji?: string;
  file?: { url: string; expiryTime?: string };
  external?: { url: string };
}

export interface PageCover {
  type: 'external' | 'file' | 'gradient';
  external?: { url: string };
  file?: { url: string; expiryTime?: string };
  gradient?: string;
}

export interface PageProperties {
  // Notion-style properties
  tags?: string[];
  status?: string;
  category?: string;
  date?: Date;
  checkbox?: boolean;

  // Custom properties
  [key: string]: any;
}

export interface Permission {
  userId: string;
  role: PermissionRole;
  grantedAt: Date;
}

export enum PermissionRole {
  OWNER = 'owner',
  EDITOR = 'editor',
  COMMENTER = 'commenter',
  VIEWER = 'viewer',
}

export interface Page {
  id: string;
  workspaceId: string;
  title: string;
  icon?: PageIcon;
  cover?: PageCover;
  blocks: Block[];
  properties: PageProperties;

  // Hierarchy
  parentId?: string;
  hasChildren: boolean;

  // Metadata
  archived: boolean;
  archivedAt?: Date;
  permissions: Permission[];

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastEditedBy: string;

  // UI state (local only)
  isExpanded?: boolean;
  isSelected?: boolean;
}

export interface PageTree extends Page {
  children?: PageTree[];
  level?: number;
}

export interface CreatePageRequest {
  title: string;
  icon?: PageIcon;
  cover?: PageCover;
  parentId?: string;
  properties?: PageProperties;
  initialBlocks?: Block[];
}

export interface UpdatePageRequest {
  title?: string;
  icon?: PageIcon;
  cover?: PageCover;
  properties?: PageProperties;
}

export interface PageListResponse {
  pages: Page[];
  nextCursor?: string;
  hasMore: boolean;
}

// Cover 預設漸層選項
export const DEFAULT_GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)',
];

// Icon 預設 emoji 選項
export const DEFAULT_EMOJIS = [
  '📝', '📄', '📋', '📌', '📍',
  '🚀', '💡', '⚡', '🔥', '✨',
  '📚', '📖', '📓', '📔', '📕',
  '💼', '🏢', '🏠', '🌟', '🎯',
  '🎨', '🎭', '🎪', '🎬', '🎮',
  '📱', '💻', '⌚', '📷', '📹',
  '🔬', '🔭', '🔮', '🔧', '🔨',
  '📊', '📈', '📉', '💰', '💳',
];
