/**
 * Dashboard 總覽頁面元件
 *
 * 顯示知識庫的統計資訊和快速概覽
 * 展示 Angular v20 Signals 與 computed 的響應式數據流
 */
import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { KnowledgeBaseService } from '../../services/knowledge-base.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  /** 知識庫服務 */
  knowledgeBase = inject(KnowledgeBaseService);

  /** 統計資料 */
  stats = computed(() => this.knowledgeBase.stats());

  /** 分類統計 */
  categoryStats = computed(() => this.knowledgeBase.categoryStats());

  /** 查詢統計 */
  queryStats = computed(() => this.knowledgeBase.queryStats());
}
