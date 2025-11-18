# RAG 知識庫管理平台

> 基於 Angular v20 與 Material Design 的現代化 RAG（Retrieval-Augmented Generation）知識庫管理系統

[![Angular](https://img.shields.io/badge/Angular-v20.3.12-red)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![Material](https://img.shields.io/badge/Material-v20-purple)](https://material.angular.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📖 專案簡介

本專案是一個完整的 **RAG 知識庫管理平台**，專注於 **Gemini AI 生態系統**的技術文檔管理與檢索。作為教學專案，展示了 **Angular v20 的最佳實踐**，包含完整的中文註解，適合學習與參考。

### 主要特色

- ✅ 使用 Angular v20.3.12 最新穩定版
- ✅ 完整的 Signals 狀態管理
- ✅ Material Design 3 設計系統
- ✅ Chart.js 資料視覺化
- ✅ SSR（伺服器端渲染）支援
- ✅ Cloudflare Pages 部署優化
- ✅ 300+ 技術文檔模擬資料
- ✅ 響應式設計（支援手機、平板、桌面）
- ✅ 完整中文註解與文檔

## 🚀 技術棧

### 核心框架

- **Angular** v20.3.12 - 最新穩定版
- **TypeScript** 5.8.3 - 嚴格模式
- **RxJS** 7.8 - 響應式程式設計

### UI 與樣式

- **Angular Material** v20.0.3 - Material Design 組件庫
- **Angular CDK** v20.0.3 - 組件開發工具包
- **Chart.js** v4.4.7 - 圖表視覺化
- **SCSS** - CSS 預處理器

### 部署平台

- **Cloudflare Pages** - 靜態網站託管（CSR 模式）
- **Node.js Server** - SSR 伺服器（可選）
- **Wrangler** v3 - Cloudflare 開發工具

### 開發工具

- **Angular CLI** v20.3.10 - 專案腳手架
- **Karma** v6.4 - 測試框架
- **PostCSS** + **Autoprefixer** - CSS 處理

## 📂 專案結構

```
src/
├── app/
│   ├── components/          # 共用元件
│   │   ├── sidenav/        # 側邊欄導航
│   │   └── topbar/         # 頂部導航列
│   │
│   ├── pages/              # 頁面組件
│   │   ├── dashboard/      # 儀表板（總覽統計）
│   │   ├── documents/      # 文檔管理
│   │   ├── search/         # 智能檢索
│   │   ├── analytics/      # 數據分析
│   │   └── settings/       # 系統設定
│   │
│   ├── models/             # 資料模型
│   │   ├── document.model.ts       # 文檔模型
│   │   ├── query.model.ts          # 查詢模型
│   │   ├── statistics.model.ts     # 統計模型
│   │   └── menu-item.model.ts      # 選單模型
│   │
│   ├── services/           # 業務服務
│   │   └── knowledge-base.service.ts  # 知識庫服務（Signals）
│   │
│   ├── data/               # 模擬資料
│   │   ├── mock-data.generator.ts     # 文檔生成器
│   │   └── mock-categories.data.ts    # 分類資料
│   │
│   ├── app.component.ts    # 根組件
│   ├── app.config.ts       # 應用配置
│   ├── app.config.server.ts # SSR 配置
│   └── app.routes.ts       # 路由配置
│
├── tools/                  # 建置工具
│   ├── copy-files.mjs             # SSR 檔案複製
│   └── copy-cloudflare-csr.mjs    # Cloudflare CSR 複製
│
├── angular.json            # Angular CLI 配置
├── package.json            # NPM 依賴
├── tsconfig.json           # TypeScript 配置
└── wrangler.toml           # Cloudflare 配置
```

## 🎯 核心功能

### 1. Dashboard 儀表板

- 📊 知識庫總覽統計
- 📈 文檔數量、查詢數、成功率即時監控
- 🏷️ 技術分類統計卡片
- 🔍 熱門查詢主題展示
- 📅 最近查詢記錄

**技術亮點**：
- 使用 `computed()` Signals 自動計算統計數據
- Material Card 響應式布局
- 即時數據更新

### 2. Documents 文檔管理

- 📑 CDK Table 高效能表格
- 🔎 即時搜尋與篩選
- 🏷️ 多維度分類篩選（類別、狀態、語言）
- 📊 排序功能（標題、日期、檢視次數）
- 📄 分頁控制

**技術亮點**：
- CDK Table 虛擬滾動支援
- Signals 驅動的篩選邏輯
- 多選篩選器

### 3. Search 智能檢索

- 🔍 全文檢索模擬
- 🎯 相關性評分顯示
- 💡 智能摘要預覽
- 🏷️ 相關主題標籤
- ⚙️ 高級檢索選項（Top-K, Temperature, Max Tokens）

**技術亮點**：
- 向量相似度模擬
- Embedding 視覺化
- RAG 參數可調整

### 4. Analytics 數據分析

- 📊 **文檔類別分佈**（圓餅圖）
- 📈 **查詢趨勢**（折線圖，最近 7 天）
- 🏆 **熱門查詢主題 TOP 5**（橫向長條圖）
- ✅ **查詢成功率**（圓環圖）
- 📋 **類別詳細統計表格**

**技術亮點**：
- Chart.js 完整整合
- `viewChild()` Signal API
- `afterNextRender()` 生命週期
- 響應式圖表布局

### 5. Settings 系統設定

- ⚙️ RAG 參數配置（Top-K, Temperature, Max Tokens）
- 🎨 主題切換（即將推出）
- 🌐 語言設定（即將推出）
- 🔔 通知設定（即將推出）

**技術亮點**：
- Reactive Forms
- Material Form Controls
- localStorage 持久化

## 💻 開發指南

### 環境需求

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Git**

### 安裝步驟

```bash
# 1. 克隆專案
git clone https://github.com/Koopa0/material-dashboard.git
cd material-dashboard

# 2. 安裝依賴
npm install

# 3. 啟動開發伺服器
npm start

# 4. 開啟瀏覽器訪問
http://localhost:4200
```

### 可用指令

```bash
# 開發
npm start                    # 啟動開發伺服器 (ng serve)
npm run watch                # 監聽模式建置

# 建置
npm run build                # 標準建置（含 SSR）
npm run build:cloudflare     # Cloudflare CSR 建置

# 測試
npm test                     # 執行單元測試

# 部署
npm run preview:cloudflare   # 本地預覽 Cloudflare 建置
npm run deploy               # 部署到 Cloudflare Pages

# SSR（Node.js 伺服器）
npm run serve:ssr            # 啟動 SSR 伺服器
```

## 🚀 部署指南

### 方式 1：Cloudflare Pages（CSR）

```bash
# 1. 建置
npm run build:cloudflare

# 2. 部署
npm run deploy

# 或使用 Wrangler 手動部署
wrangler pages deploy dist/cloudflare
```

**優點**：
- ✅ 免費託管
- ✅ 全球 CDN
- ✅ 自動 HTTPS
- ✅ 簡單易用

### 方式 2：SSR 伺服器（Vercel, Netlify）

```bash
# 1. 建置（含 SSR）
npm run build

# 2. 啟動伺服器
npm run serve:ssr

# 或部署到 Vercel/Netlify
# (參考各平台文檔)
```

**優點**：
- ✅ 完整 SSR 支援
- ✅ SEO 優化
- ✅ 初次載入更快
- ✅ 適合大型應用

## 📚 Angular v20 最佳實踐

本專案完整展示了 Angular v20 的現代化開發模式：

### 1. Signals 狀態管理

```typescript
// 使用 signal() 建立響應式狀態
private documentsSignal = signal<Document[]>([]);
readonly documents = this.documentsSignal.asReadonly();

// 使用 computed() 建立衍生狀態
filteredDocuments = computed(() => {
  const docs = this.documents();
  const query = this.searchQuery();
  return docs.filter(doc => doc.title.includes(query));
});

// 使用 effect() 處理副作用
constructor() {
  effect(() => {
    const docs = this.documents();
    this.saveToLocalStorage(docs);
  });
}
```

### 2. viewChild Signal API

```typescript
// 取代傳統的 @ViewChild
categoryChartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('categoryChart');

// 在 afterNextRender 中使用
afterNextRender(() => {
  const canvas = this.categoryChartCanvas();
  if (canvas) {
    this.initializeChart(canvas.nativeElement);
  }
});
```

### 3. inject() 依賴注入

```typescript
// 取代建構函數注入
export class DashboardComponent {
  private knowledgeBase = inject(KnowledgeBaseService);
  private router = inject(Router);
}
```

### 4. Standalone Components

```typescript
// 所有元件都是 Standalone
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent { }
```

### 5. afterNextRender 生命週期

```typescript
// 取代 ngAfterViewInit + setTimeout
constructor() {
  afterNextRender(() => {
    // DOM 已渲染完成，安全操作 DOM
    this.initializeCharts();
  });
}
```

## 📊 模擬資料說明

專案包含 **300+ 筆技術文檔模擬資料**，涵蓋 8 大技術分類：

1. **Golang** - Go 語言相關文檔（40+ 篇）
2. **Rust** - Rust 程式設計（40+ 篇）
3. **Flutter** - 跨平台開發（40+ 篇）
4. **Angular** - Angular 框架（40+ 篇）
5. **AI** - 人工智慧（40+ 篇）
6. **Gemini** - Google Gemini（40+ 篇）
7. **System Design** - 系統設計（40+ 篇）
8. **PostgreSQL** - 資料庫（40+ 篇）

每份文檔包含：
- 標題、內容、摘要
- 技術分類與標籤
- 狀態（Active/Archived）
- 建立/更新時間
- 作者資訊
- 檢視次數
- 檔案大小
- 語言（zh-TW/en/ja）

## 🤝 貢獻指南

歡迎提交 Issue 和 Pull Request！

### 開發流程

1. Fork 本專案
2. 建立你的 feature 分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

### 程式碼規範

- 遵循 Angular 風格指南
- 使用 TypeScript 嚴格模式
- 添加完整的中文註解
- 確保所有測試通過
- 保持響應式設計

## 📖 學習資源

### 官方文檔

- [Angular v20 文檔](https://angular.dev)
- [Angular Material 文檔](https://material.angular.io)
- [TypeScript 文檔](https://www.typescriptlang.org/docs)
- [Chart.js 文檔](https://www.chartjs.org/docs)

### Angular v20 新特性

- [Signals 完整指南](https://angular.dev/guide/signals)
- [SSR 與混合渲染](https://angular.dev/guide/ssr)
- [Standalone Components](https://angular.dev/guide/components/importing)
- [新版 viewChild API](https://angular.dev/api/core/viewChild)

### RAG 相關

- [什麼是 RAG？](https://www.promptingguide.ai/techniques/rag)
- [Vector Embeddings 介紹](https://www.pinecone.io/learn/vector-embeddings/)
- [Google Gemini API](https://ai.google.dev/docs)

## 📝 更新日誌

### v2.0.0 (2025-01-21)

- ✨ 升級到 Angular v20.3.12
- ✨ 重構為 RAG 知識庫管理平台
- ✨ 完整 Signals 狀態管理
- ✨ 新增 Analytics 分析頁面（Chart.js）
- ✨ 優化 Cloudflare Pages 部署（CSR 模式）
- ✨ 300+ 模擬技術文檔
- ✨ 完整中文註解與文檔

### v1.0.0 (2024-12-01)

- 🎉 初始版本

## 📄 授權

本專案採用 [MIT License](LICENSE) 授權。

## 🙏 致謝

- [Angular Team](https://angular.dev) - 優秀的框架
- [Material Design](https://m3.material.io) - 設計系統
- [Chart.js](https://www.chartjs.org) - 圖表庫
- [Cloudflare](https://www.cloudflare.com) - 部署平台

---

**專案目標**：這是一個教學專案，旨在展示 Angular v20 的最佳實踐與現代化開發模式。歡迎學習、參考與分享！

如有任何問題，歡迎提交 [Issue](https://github.com/Koopa0/material-dashboard/issues)。
