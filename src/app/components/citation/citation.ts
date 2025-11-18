/**
 * Citation 引用標記組件
 *
 * 顯示 AI 回答中的引用標記，並提供預覽功能
 * 靈感來自 NotebookLM 的 inline citations
 */
import { Component, input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { Citation as CitationModel } from '../../models/citation.model';

@Component({
  selector: 'app-citation',
  imports: [MatTooltipModule, MatIconModule],
  templateUrl: './citation.html',
  styleUrl: './citation.scss',
})
export class CitationComponent {
  /** 引用資料 */
  citation = input.required<CitationModel>();

  /**
   * 取得 tooltip 內容
   */
  getTooltipText(): string {
    const cit = this.citation();
    return `📄 ${cit.documentTitle}\n\n"${cit.snippet}"\n\n📊 相關性: ${Math.round(cit.relevanceScore * 100)}%`;
  }

  /**
   * 點擊引用標記（未來可跳轉到文檔）
   */
  onClick(): void {
    console.log('Citation clicked:', this.citation());
    // TODO: 跳轉到文檔並高亮對應段落
  }
}
