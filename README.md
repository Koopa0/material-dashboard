# Material Dashboard

## Overview

Material Dashboard 是一個現代化的企業級儀表板應用程式，展示了 Angular 生態系統的最佳實踐。本專案整合了 Angular Material、NgRx 狀態管理、Tailwind CSS 以及 Cloudflare C3，提供了一個強大且可擴展的開發框架。

## Technology Stack

### Core Framework
- Angular 19.0.0
- TypeScript 5.4.x
- RxJS 8.x

### State Management
- NgRx Store
- NgRx Effects
- NgRx Entity
- NgRx Component Store
- NgRx Router Store

### UI Framework & Styling
- Angular Material 19.x
- Angular CDK 19.x
- Tailwind CSS 4.x
- SCSS

### Analytics & Visualization
- Cloudflare C3 Charts
- D3.js (C3 dependency)

### Development Tools
- Angular CLI
- Angular DevTools
- NgRx DevTools
- ESLint
- Prettier

### Testing Framework
- Jest
- Cypress

全局樣式
```

## Core Features

### State Management
NgRx 提供了完整的狀態管理解決方案，包括：
- 集中式狀態管理
- Side Effects 處理
- 實體管理
- 路由整合

### UI Components
Angular Material 與 CDK 的進階應用：
- 響應式設計
- 主題定制
- 動態表單
- 進階列表與表格
- 模態對話框

### Data Visualization
整合 Cloudflare C3 實現豐富的數據視覺化：
- 即時數據圖表
- 互動式圖表
- 自定義圖表主題
- 多維數據展示

### Angular Signals
展示 Angular Signals 的最佳實踐：
- 狀態同步
- 響應式數據流
- 性能優化

## Development Setup

### Prerequisites
- Node.js 18.x 或更高版本
- npm 9.x 或更高版本
- Angular CLI 19.x

### Installation
```bash
# 安裝依賴
npm install

# 啟動開發服務器
npm start

# 建置生產版本
npm run build:prod
```

## Development Guidelines

### Code Organization
- 遵循 Angular 風格指南
- 模組化設計原則
- 元件設計模式
- NgRx 最佳實踐

### Performance Optimization
- 路由懶加載
- 狀態管理優化
- 資源優化
- 打包優化

### Testing Strategy
- 單元測試 (Jest)
- 端對端測試 (Cypress)
- 元件測試
- 狀態管理測試

## Deployment

### Environments
支援多環境部署：
- Development
- Staging
- Production

### Build Configuration
針對不同環境的優化配置：
- 生產環境優化
- 源碼映射
- 資源壓縮

## Documentation

完整文檔位於 `/docs` 目錄：
- 開發指南
- API 文檔
- 部署指南
- 貢獻指南

## Versioning

本專案採用語意化版本控制 (Semantic Versioning)：
- Major：重大更新
- Minor：功能更新
- Patch：問題修復

## Contributing

歡迎提交 Issue 和 Pull Request。請確保：
- 遵循開發規範
- 提供適當的測試
- 更新相關文檔

## License

本專案採用 MIT 授權證書。
