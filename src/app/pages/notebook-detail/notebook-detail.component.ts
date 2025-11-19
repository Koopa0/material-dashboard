import { Component, computed, signal, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { NotebookService } from '../../services/notebook.service';
import { KnowledgeBaseService } from '../../services/knowledge-base.service';
import { NotebookDialogComponent } from '../../components/notebook-dialog/notebook-dialog.component';
import { Notebook, NotebookColorMap } from '../../models/notebook.model';
import { Document } from '../../models/document.model';

@Component({
  selector: 'app-notebook-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    MatMenuModule,
  ],
  templateUrl: './notebook-detail.component.html',
  styleUrl: './notebook-detail.component.scss',
})
export class NotebookDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private notebookService = inject(NotebookService);
  private knowledgeBase = inject(KnowledgeBaseService);
  private dialog = inject(MatDialog);

  /**
   * 使用 toSignal() 自動管理路由參數訂閱（Angular v20 最佳實踐）
   * 無需手動 unsubscribe，自動清理
   */
  private routeParams = toSignal(this.route.paramMap);

  /** 當前 Notebook ID */
  notebookId = signal<string | null>(null);

  /**
   * 使用 effect() 響應路由變化（Angular v20 推薦）
   * 自動追蹤依賴並清理
   */
  constructor() {
    effect(() => {
      const params = this.routeParams();
      const id = params?.get('id');
      if (id) {
        this.notebookId.set(id);
        this.notebookService.selectNotebook(id);
      }
    });
  }

  /** 當前 Notebook */
  notebook = computed<Notebook | undefined>(() => {
    const id = this.notebookId();
    if (!id) return undefined;

    return this.notebookService
      .notebooks()
      .find((nb) => nb.id === id);
  });

  /** Notebook 內的文檔列表 */
  documents = computed<Document[]>(() => {
    const nb = this.notebook();
    if (!nb) return [];

    const allDocs = this.knowledgeBase.documents();
    return nb.documentIds
      .map((docId) => allDocs.find((doc) => doc.id === docId))
      .filter((doc): doc is Document => doc !== undefined);
  });

  /** 顏色映射 */
  colorMap = NotebookColorMap;

  /** 返回上一頁 */
  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  /** 前往文檔管理頁面 */
  goToDocuments(): void {
    this.router.navigate(['/documents']);
  }

  /** 取得 Notebook 顏色 */
  getNotebookColor(notebook: Notebook): string {
    return this.colorMap[notebook.color];
  }

  /** 編輯 Notebook */
  editNotebook(): void {
    const nb = this.notebook();
    if (!nb) return;

    this.dialog.open(NotebookDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: { mode: 'edit', notebook: nb },
    });
  }

  /** 刪除 Notebook */
  deleteNotebook(): void {
    const nb = this.notebook();
    if (!nb) return;

    if (nb.isDefault) {
      alert('無法刪除預設 Notebook');
      return;
    }

    if (confirm(`確定要刪除「${nb.name}」嗎？`)) {
      this.notebookService.deleteNotebook(nb.id);
      this.goBack();
    }
  }

  /** 從 Notebook 移除文檔 */
  removeDocument(doc: Document): void {
    const nb = this.notebook();
    if (!nb) return;

    if (confirm(`確定要從「${nb.name}」移除「${doc.title}」嗎？`)) {
      this.notebookService.removeDocumentFromNotebook(nb.id, doc.id);
    }
  }

  /** 查看文檔 */
  viewDocument(doc: Document): void {
    this.knowledgeBase.recordView(doc.id);
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
}
