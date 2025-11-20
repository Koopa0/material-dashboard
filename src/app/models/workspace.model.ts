/**
 * Workspace 相關資料模型
 */

export interface Workspace {
  id: string;
  name: string;
  icon?: string;
  ownerId: string;
  members: WorkspaceMember[];
  settings: WorkspaceSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkspaceMember {
  userId: string;
  role: WorkspaceRole;
  joinedAt: Date;
  user?: User;
}

export enum WorkspaceRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
  GUEST = 'guest',
}

export interface WorkspaceSettings {
  allowGuests: boolean;
  publicAccess: boolean;
  defaultPagePermission: string;
  theme?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  settings?: UserSettings;
  createdAt: Date;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notificationsEnabled: boolean;
  emailNotifications?: boolean;
}

export interface CreateWorkspaceRequest {
  name: string;
  icon?: string;
}

export interface UpdateWorkspaceRequest {
  name?: string;
  icon?: string;
  settings?: Partial<WorkspaceSettings>;
}

export interface WorkspaceListResponse {
  workspaces: WorkspaceListItem[];
}

export interface WorkspaceListItem {
  id: string;
  name: string;
  icon?: string;
  members: number;
  role: WorkspaceRole;
  createdAt: Date;
}
