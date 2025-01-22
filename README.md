# Material Dashboard

## Overview

Material Dashboard 是一個基於 Angular v19 的現代化企業級應用程式，展示了 Angular 生態系統的最佳實踐。本專案採用 Cloudflare Pages 進行部署，並整合了 Angular Material、NgRx 狀態管理以及 Tailwind CSS，提供了一個強大且可擴展的開發框架。

## Technology Stack

### Core Framework
- Angular 19.0.0
- TypeScript 5.4.x
- RxJS 8.x

### Deployment & Infrastructure
- Cloudflare Pages
- Cloudflare C3 CLI
- Wrangler

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

### Development Tools
- Angular CLI
- Angular DevTools
- NgRx DevTools
- ESLint
- Prettier

### Testing Framework
- Jest
- Cypress

## Project Architecture

專案採用模組化架構，遵循 Angular 的最佳實踐原則：

```
src/
├── app/
│   ├── core/                # 核心模組
│   │   ├── auth/           # 認證服務
│   │   ├── store/          # NgRx store
│   │   └── services/       # 核心服務
│   │
│   ├── features/           # 功能模組
│   │   ├── dashboard/      # 儀表板功能
│   │   ├── analytics/      # 數據分析
│   │   └── admin/         # 管理功能
│   │
│   ├── shared/            # 共用模組
│   │   ├── components/    # 共用元件
│   │   └── directives/   # 共用指令
│   │
│   └── shell/            # 應用程式外殼
│
├── assets/               # 靜態資源
├── environments/        # 環境配置
└── styles/             # 全局樣式
```

## Core Features

### Cloudflare Integration
- 使用 Cloudflare Pages 進行自動化部署
- 整合 Cloudflare C3 CLI 實現開發工作流程
- 環境變數管理與安全配置

### State Management
- 集中式狀態管理
- Side Effects 處理
- 實體管理
- 路由整合

### UI Components
- Material Design 風格的響應式設計
- 主題定制
- 動態表單
- 高級元件實現

### Angular Signals
- 狀態同步
- 響應式數據流
- 性能優化

## Development Setup

### Prerequisites
- Node.js 18.x 或更高版本
- npm 9.x 或更高版本
- Angular CLI 19.x
- Cloudflare 帳戶
- Wrangler CLI

### Local Development
```bash
# 安裝依賴
npm install

# 啟動開發服務器
npm start

# 建置生產版本
npm run build:prod
```

### Cloudflare Deployment
```bash
# 初始化 Cloudflare 專案
npm create cloudflare@latest

# 部署到 Cloudflare Pages
npm run deploy
```

## Environment Configuration

### Local Environment
開發時需要配置 .env 文件：
```plaintext
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_api_token
```

注意：確保將 .env 文件添加到 .gitignore。

### Production Environment
在 Cloudflare Pages 的專案設置中配置環境變數。

## Development Guidelines

### Code Organization
- 遵循 Angular 風格指南
- 模組化設計原則
- NgRx 狀態管理最佳實踐
- Cloudflare Pages 部署準則

### Testing Strategy
- 單元測試 (Jest)
- 端對端測試 (Cypress)
- 元件測試
- 狀態管理測試

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

歡迎提交 Issue 和 Pull Request。在貢獻之前，請確保：
- 遵循開發規範
- 提供適當的測試覆蓋
- 更新相關文檔
- 確保 Cloudflare 部署配置正確

## License

本專案採用 MIT 授權證書。
