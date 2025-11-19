/**
 * 主題切換器組件
 *
 * 提供深淺主題切換功能
 * Gemini 風格的動畫效果與圖示
 *
 * Angular v20 最佳實踐：
 * - Standalone Component
 * - 使用 inject() 注入服務
 * - Signal-based reactivity
 */
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss',
  // Angular v20 性能優化：使用 OnPush 變更檢測策略
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggleComponent {
  /**
   * 主題服務
   */
  themeService = inject(ThemeService);

  /**
   * 當前主題（Signal）
   */
  theme = this.themeService.theme;

  /**
   * 是否為深色主題（Signal）
   */
  isDark = this.themeService.isDark;

  /**
   * 切換主題
   */
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  /**
   * 取得主題圖示
   */
  getThemeIcon(): string {
    return this.isDark() ? 'light_mode' : 'dark_mode';
  }

  /**
   * 取得提示文字
   */
  getTooltipText(): string {
    return this.isDark() ? '切換至淺色主題' : '切換至深色主題';
  }
}
