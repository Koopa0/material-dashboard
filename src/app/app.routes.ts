/**
 * 應用程式路由配置
 *
 * RAG 知識庫管理系統的路由定義
 * 使用 Angular v20 standalone components
 */
import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DocumentDetailComponent } from './pages/document-detail/document-detail.component';
import { NotebooksComponent } from './pages/notebooks/notebooks';
import { NotebookDetailComponent } from './pages/notebook-detail/notebook-detail.component';
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
    path: 'documents/:id',
    component: DocumentDetailComponent,
    title: 'Document Detail - RAG 知識庫',
  },
  {
    path: 'notebooks',
    component: NotebooksComponent,
    title: 'Notebooks - RAG 知識庫',
  },
  {
    path: 'notebooks/:id',
    component: NotebookDetailComponent,
    title: 'Notebook - RAG 知識庫',
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
