/**
 * Documents 文檔管理頁面元件
 *
 * 提供文檔的CRUD功能和進階表格顯示
 * 展示 Angular CDK Table 和 Signals 的整合使用
 */
import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { KnowledgeBaseService } from '../../services/knowledge-base.service';
import { Document, TechnologyCategory } from '../../models';

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
    FormsModule,
  ],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.scss',
})
export class DocumentsComponent {
  /** 知識庫服務 */
  knowledgeBase = inject(KnowledgeBaseService);

  /** 表格顯示的欄位 */
  displayedColumns: string[] = [
    'title',
    'category',
    'author',
    'tags',
    'viewCount',
    'updatedAt',
    'actions',
  ];

  /** 技術分類選項 */
  categories = Object.values(TechnologyCategory);

  /** 篩選後的文檔（使用 computed signal） */
  documents = computed(() => this.knowledgeBase.filteredDocuments());

  /**
   * 查看文檔詳情
   */
  viewDocument(doc: Document): void {
    this.knowledgeBase.selectedDocument.set(doc);
    this.knowledgeBase.incrementViewCount(doc.id);
    console.log('Selected document:', doc);
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
}
