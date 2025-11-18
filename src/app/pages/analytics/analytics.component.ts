/**
 * Analytics 分析頁面組件
 *
 * 使用 Chart.js 視覺化呈現 RAG 知識庫的各項分析數據
 * Angular v20 最佳實踐：
 * - 使用 Signals 進行狀態管理
 * - 使用 afterNextRender 處理 DOM 操作（Chart.js 初始化）
 * - 使用 inject() 進行依賴注入
 */
import { Component, computed, inject, afterNextRender, ElementRef, viewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { KnowledgeBaseService } from '../../services/knowledge-base.service';
import { TechnologyCategory } from '../../models/document.model';
import { ThemeService } from '../../services/theme.service';

// 註冊 Chart.js 所有模組
Chart.register(...registerables);

@Component({
  selector: 'app-analytics',
  imports: [
    CommonModule,
    MatCardModule,
  ],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss',
})
export class AnalyticsComponent {
  /**
   * 知識庫服務
   */
  private knowledgeBase = inject(KnowledgeBaseService);

  /**
   * 主題服務
   */
  private themeService = inject(ThemeService);

  /**
   * Chart.js 實例
   */
  private charts: { [key: string]: Chart } = {};

  /**
   * 取得主題相關顏色（用於圖表）
   */
  private chartColors = computed(() => {
    const colors = this.themeService.getThemeColors();
    return {
      textColor: colors.onSurface,
      gridColor: colors.border,
    };
  });

  /**
   * Canvas 元素引用（使用 viewChild Signal API）
   */
  categoryChartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('categoryChart');
  queryTrendChartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('queryTrendChart');
  topQueriesChartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('topQueriesChart');
  successRateChartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('successRateChart');

  /**
   * 統計數據（使用 computed signals）
   */
  stats = computed(() => this.knowledgeBase.stats());
  categoryStats = computed(() => this.knowledgeBase.categoryStats());
  queryStats = computed(() => this.knowledgeBase.queryStats());

  /**
   * 類別分佈數據
   */
  categoryData = computed(() => {
    const stats = this.categoryStats();
    return {
      labels: stats.map(s => s.category),
      datasets: [{
        label: '文檔數量',
        data: stats.map(s => s.documentCount),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(199, 199, 199, 0.6)',
          'rgba(83, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)',
          'rgba(83, 102, 255, 1)',
        ],
        borderWidth: 2
      }]
    };
  });

  /**
   * 查詢趨勢數據（最近 7 天）
   */
  queryTrendData = computed(() => {
    const queries = this.knowledgeBase.queryRecords();
    const days = 7;
    const today = new Date();
    const labels: string[] = [];
    const data: number[] = [];

    // 生成最近 7 天的標籤和數據
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
      labels.push(dateStr);

      // 計算當天的查詢數量
      const count = queries.filter((q: any) => {
        const qDate = new Date(q.timestamp);
        return qDate.toDateString() === date.toDateString();
      }).length;
      data.push(count);
    }

    return {
      labels,
      datasets: [{
        label: '每日查詢數',
        data,
        fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        tension: 0.4
      }]
    };
  });

  /**
   * 熱門查詢主題（前 5 名）
   */
  topQueriesData = computed(() => {
    const queries = this.knowledgeBase.queryRecords();

    // 統計各主題的查詢次數
    const topicCounts = new Map<string, number>();
    queries.forEach((q: any) => {
      q.relatedTopics.forEach((topic: string) => {
        topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1);
      });
    });

    // 取前 5 名
    const sorted = Array.from(topicCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      labels: sorted.map(([topic]) => topic),
      datasets: [{
        label: '查詢次數',
        data: sorted.map(([, count]) => count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2
      }]
    };
  });

  /**
   * 查詢成功率數據
   */
  successRateData = computed(() => {
    const stats = this.queryStats();

    return {
      labels: ['成功', '失敗'],
      datasets: [{
        data: [stats.successful, stats.failed],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 2
      }]
    };
  });

  constructor() {
    /**
     * afterNextRender: Angular v20 中用於處理 DOM 操作的 API
     * 在下一次渲染完成後初始化圖表
     *
     * 為什麼使用 afterNextRender：
     * - Chart.js 需要 Canvas 元素已經在 DOM 中
     * - viewChild() 返回的 Signal 在渲染後才會有值
     * - 替代傳統的 ngAfterViewInit + setTimeout
     */
    afterNextRender(() => {
      this.initializeCharts();
    });

    /**
     * 監聽主題變化並重新渲染圖表
     */
    effect(() => {
      // 觸發 chartColors computed signal 以偵測主題變化
      this.chartColors();

      // 如果圖表已初始化，則重新渲染
      if (Object.keys(this.charts).length > 0) {
        this.destroyCharts();
        this.initializeCharts();
      }
    });
  }

  /**
   * 初始化所有圖表
   */
  private initializeCharts(): void {
    this.initializeCategoryChart();
    this.initializeQueryTrendChart();
    this.initializeTopQueriesChart();
    this.initializeSuccessRateChart();
  }

  /**
   * 銷毀所有圖表
   */
  private destroyCharts(): void {
    Object.values(this.charts).forEach(chart => chart.destroy());
    this.charts = {};
  }

  /**
   * 初始化類別分佈圓餅圖
   */
  private initializeCategoryChart(): void {
    const canvas = this.categoryChartCanvas();
    if (!canvas) return;

    const ctx = canvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const colors = this.chartColors();

    const config: ChartConfiguration = {
      type: 'pie',
      data: this.categoryData(),
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: { size: 12 },
              padding: 15,
              color: colors.textColor
            }
          },
          title: {
            display: true,
            text: '文檔類別分佈',
            font: { size: 16, weight: 'bold' },
            padding: 20,
            color: colors.textColor
          }
        }
      }
    };

    this.charts['category'] = new Chart(ctx, config);
  }

  /**
   * 初始化查詢趨勢折線圖
   */
  private initializeQueryTrendChart(): void {
    const canvas = this.queryTrendChartCanvas();
    if (!canvas) return;

    const ctx = canvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const colors = this.chartColors();

    const config: ChartConfiguration = {
      type: 'line',
      data: this.queryTrendData(),
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: '查詢趨勢（最近 7 天）',
            font: { size: 16, weight: 'bold' },
            padding: 20,
            color: colors.textColor
          }
        },
        scales: {
          x: {
            ticks: {
              color: colors.textColor
            },
            grid: {
              color: colors.gridColor
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              color: colors.textColor
            },
            grid: {
              color: colors.gridColor
            }
          }
        }
      }
    };

    this.charts['queryTrend'] = new Chart(ctx, config);
  }

  /**
   * 初始化熱門查詢長條圖
   */
  private initializeTopQueriesChart(): void {
    const canvas = this.topQueriesChartCanvas();
    if (!canvas) return;

    const ctx = canvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const colors = this.chartColors();

    const config: ChartConfiguration = {
      type: 'bar',
      data: this.topQueriesData(),
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: '熱門查詢主題 TOP 5',
            font: { size: 16, weight: 'bold' },
            padding: 20,
            color: colors.textColor
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              color: colors.textColor
            },
            grid: {
              color: colors.gridColor
            }
          },
          y: {
            ticks: {
              color: colors.textColor
            },
            grid: {
              color: colors.gridColor
            }
          }
        }
      }
    };

    this.charts['topQueries'] = new Chart(ctx, config);
  }

  /**
   * 初始化查詢成功率圓環圖
   */
  private initializeSuccessRateChart(): void {
    const canvas = this.successRateChartCanvas();
    if (!canvas) return;

    const ctx = canvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const colors = this.chartColors();
    const stats = this.queryStats();
    const successRate = stats.total > 0
      ? ((stats.successful / stats.total) * 100).toFixed(1)
      : '0.0';

    const config: ChartConfiguration = {
      type: 'doughnut',
      data: this.successRateData(),
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: { size: 12 },
              padding: 15,
              color: colors.textColor
            }
          },
          title: {
            display: true,
            text: `查詢成功率: ${successRate}%`,
            font: { size: 16, weight: 'bold' },
            padding: 20,
            color: colors.textColor
          }
        }
      }
    };

    this.charts['successRate'] = new Chart(ctx, config);
  }
}
