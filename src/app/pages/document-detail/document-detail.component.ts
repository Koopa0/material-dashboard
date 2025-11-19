import { Component, OnInit, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { KnowledgeBaseService } from '../../services/knowledge-base.service';
import { Document } from '../../models/document.model';

@Component({
  selector: 'app-document-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    MatTooltipModule,
  ],
  templateUrl: './document-detail.component.html',
  styleUrl: './document-detail.component.scss',
})
export class DocumentDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private knowledgeBase = inject(KnowledgeBaseService);

  /** 當前文檔 ID */
  documentId = signal<string | null>(null);

  /** 當前文檔 */
  document = computed<Document | undefined>(() => {
    const id = this.documentId();
    if (!id) return undefined;

    const doc = this.knowledgeBase
      .documents()
      .find((d) => d.id === id);

    return doc;
  });

  /** 是否已釘選 */
  isPinned = computed(() => this.document()?.isPinned ?? false);

  /** 是否已收藏 */
  isFavorited = computed(() => this.document()?.isFavorited ?? false);

  /** 相關文檔（基於相同分類和標籤） */
  relatedDocuments = computed<Document[]>(() => {
    const doc = this.document();
    if (!doc) return [];

    const allDocs = this.knowledgeBase.documents();

    // 計算相關性分數
    const scored = allDocs
      .filter((d) => d.id !== doc.id) // 排除當前文檔
      .map((d) => {
        let score = 0;

        // 相同分類 +10 分
        if (d.category === doc.category) {
          score += 10;
        }

        // 相同標籤，每個 +5 分
        const commonTags = d.tags.filter((tag) => doc.tags.includes(tag));
        score += commonTags.length * 5;

        return { document: d, score };
      })
      .filter((item) => item.score > 0) // 只保留有相關性的
      .sort((a, b) => b.score - a.score) // 按分數排序
      .slice(0, 5) // 取前 5 個
      .map((item) => item.document);

    return scored;
  });

  ngOnInit(): void {
    // 從路由參數取得文檔 ID
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.documentId.set(id);
        // 記錄查看
        this.knowledgeBase.recordView(id);
      }
    });
  }

  /** 返回上一頁 */
  goBack(): void {
    this.router.navigate(['/documents']);
  }

  /** 切換釘選狀態 */
  togglePin(): void {
    const doc = this.document();
    if (!doc) return;

    this.knowledgeBase.togglePin(doc.id);
  }

  /** 切換收藏狀態 */
  toggleFavorite(): void {
    const doc = this.document();
    if (!doc) return;

    this.knowledgeBase.toggleFavorite(doc.id);
  }

  /** 分享文檔 */
  shareDocument(): void {
    const doc = this.document();
    if (!doc) return;

    // 複製連結到剪貼簿
    const url = `${window.location.origin}/documents/${doc.id}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        console.log('✅ 已複製連結到剪貼簿:', url);
        // TODO: 顯示 Toast 通知
      });
    } else {
      console.log('📋 分享連結:', url);
    }
  }

  /** 查看相關文檔 */
  viewRelatedDocument(doc: Document): void {
    this.router.navigate(['/documents', doc.id]);
  }

  /** 格式化日期 */
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  /** 將純文本轉換為簡單的 HTML（處理換行和基本格式） */
  formatContent(content: string): string {
    if (!content) return '';

    return content
      // 處理換行
      .split('\n\n')
      .map((para) => `<p>${para.replace(/\n/g, '<br>')}</p>`)
      .join('')
      // 處理粗體 **text**
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // 處理斜體 *text*
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // 處理代碼 `code`
      .replace(/`(.*?)`/g, '<code>$1</code>')
      // 處理標題 # Title
      .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
      .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
      .replace(/^### (.*?)$/gm, '<h3>$1</h3>');
  }
}
