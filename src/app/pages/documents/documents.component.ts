/**
 * Documents 文檔管理頁面元件
 *
 * 提供文檔的CRUD功能和進階表格顯示
 * 展示 Angular CDK Table 和 Signals 的整合使用
 */
import { Component, inject, computed, ViewChild, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { KnowledgeBaseService } from '../../services/knowledge-base.service';
import { NotebookService } from '../../services/notebook.service';
import { Document, TechnologyCategory, Notebook } from '../../models';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatMenuModule,
    FormsModule,
  ],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.scss',
  // Angular v20 性能優化：使用 OnPush 變更檢測策略
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentsComponent implements AfterViewInit {
  /** 分頁器引用 */
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  /** 知識庫服務 */
  knowledgeBase = inject(KnowledgeBaseService);

  /** Notebook 服務 */
  notebookService = inject(NotebookService);

  /** 路由器 */
  private router = inject(Router);

  /** 表格顯示的欄位 */
  displayedColumns: string[] = [
    'pin',
    'title',
    'category',
    'source',
    'tags',
    'viewCount',
    'updatedAt',
    'actions',
  ];

  /** 技術分類選項 */
  categories = Object.values(TechnologyCategory);

  /** 分頁後的文檔（使用 computed signal） */
  documents = computed(() => this.knowledgeBase.paginatedDocuments());

  /** 分頁選項 */
  pageSizeOptions = [10, 20, 50, 100];

  ngAfterViewInit(): void {
    // 分頁器初始化完成
  }

  /**
   * 查看文檔詳情
   */
  viewDocument(doc: Document): void {
    this.knowledgeBase.selectedDocument.set(doc);
    this.knowledgeBase.recordView(doc.id);
    this.router.navigate(['/documents', doc.id]);
  }

  /**
   * 刪除文檔
   */
  deleteDocument(doc: Document): void {
    if (confirm(`確定要刪除「${doc.title}」嗎？`)) {
      this.knowledgeBase.deleteDocument(doc.id);
    }
  }

  /**
   * 切換釘選狀態
   */
  togglePin(doc: Document, event: Event): void {
    event.stopPropagation();
    this.knowledgeBase.togglePin(doc.id);
  }

  /**
   * 切換收藏狀態
   */
  toggleFavorite(doc: Document, event: Event): void {
    event.stopPropagation();
    this.knowledgeBase.toggleFavorite(doc.id);
  }

  /**
   * 篩選分類變更
   */
  onCategoryFilterChange(categories: TechnologyCategory[]): void {
    this.knowledgeBase.selectedCategories.set(categories);
  }

  /**
   * 搜尋關鍵字變更
   */
  onSearchChange(query: string): void {
    this.knowledgeBase.searchQuery.set(query);
  }

  /**
   * 分頁變更（類型安全）
   * Angular v20 最佳實踐：使用正確的 Material 類型
   */
  onPageChange(event: PageEvent): void {
    this.knowledgeBase.setPage(event.pageIndex + 1);
    this.knowledgeBase.setPageSize(event.pageSize);
  }

  /**
   * 將文檔加入 Notebook
   */
  addToNotebook(doc: Document, notebook: Notebook): void {
    this.notebookService.addDocumentToNotebook(notebook.id, doc.id);
    // TODO: 使用 MatSnackBar 顯示成功/失敗訊息
  }
}
