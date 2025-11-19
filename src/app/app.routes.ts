/**
 * 應用程式路由配置
 *
 * RAG 知識庫管理系統的路由定義
 * 使用 Angular v20 standalone components
 */
import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DocumentsComponent } from './pages/documents/documents.component';
import { DocumentDetailComponent } from './pages/document-detail/document-detail.component';
import { SearchComponent } from './pages/search/search.component';
import { AnalyticsComponent } from './pages/analytics/analytics.component';
import { SettingsComponent } from './pages/settings/settings.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'Dashboard - RAG 知識庫',
  },
  {
    path: 'documents',
    component: DocumentsComponent,
    title: 'Documents - RAG 知識庫',
  },
  {
    path: 'documents/:id',
    component: DocumentDetailComponent,
    title: 'Document Detail - RAG 知識庫',
  },
  {
    path: 'search',
    component: SearchComponent,
    title: 'Search - RAG 知識庫',
  },
  {
    path: 'analytics',
    component: AnalyticsComponent,
    title: 'Analytics - RAG 知識庫',
  },
  {
    path: 'settings',
    component: SettingsComponent,
    title: 'Settings - RAG 知識庫',
  },
];
