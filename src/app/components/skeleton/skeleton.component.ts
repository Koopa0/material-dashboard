/**
 * 骨架屏載入組件
 *
 * 提供流暢的載入體驗（Gemini 風格）
 * 支援多種類型與尺寸
 *
 * Angular v20 最佳實踐：
 * - Standalone Component
 * - Input signals
 * - 靈活的樣式配置
 *
 * 使用方式：
 * <app-skeleton type="text" [count]="3" />
 * <app-skeleton type="card" height="200px" />
 * <app-skeleton type="circle" size="48px" />
 */
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * 骨架屏類型
 */
export type SkeletonType = 'text' | 'card' | 'circle' | 'rect' | 'avatar';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.scss',
})
export class SkeletonComponent {
  /**
   * 骨架屏類型
   * - text: 文字行
   * - card: 卡片
   * - circle: 圓形（頭像）
   * - rect: 矩形
   * - avatar: 頭像 + 文字
   */
  type = input<SkeletonType>('text');

  /**
   * 數量（用於 text 類型）
   */
  count = input<number>(1);

  /**
   * 寬度
   */
  width = input<string>();

  /**
   * 高度
   */
  height = input<string>();

  /**
   * 大小（用於 circle 類型）
   */
  size = input<string>('48px');

  /**
   * 是否啟用動畫
   */
  animated = input<boolean>(true);

  /**
   * 自訂 class
   */
  customClass = input<string>('');

  /**
   * 取得骨架屏 class
   */
  getSkeletonClass(): string {
    const classes = [
      'skeleton',
      `skeleton-${this.type()}`,
      this.animated() ? 'skeleton-animated' : '',
      this.customClass(),
    ];
    return classes.filter(Boolean).join(' ');
  }

  /**
   * 取得骨架屏樣式（類型安全）
   * Angular v20 最佳實踐：明確定義返回類型
   */
  getSkeletonStyle(): Record<string, string | undefined> {
    const type = this.type();

    if (type === 'circle') {
      return {
        width: this.size(),
        height: this.size(),
      };
    }

    return {
      width: this.width() || undefined,
      height: this.height() || undefined,
    };
  }

  /**
   * 取得重複次數陣列（用於 *ngFor）
   */
  getCountArray(): number[] {
    return Array(this.count()).fill(0);
  }
}
