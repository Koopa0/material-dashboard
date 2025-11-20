# 大規模重構計劃：Notion + NotebookLM 混合系統

## 🎯 目標

打造一個結合以下特性的知識管理系統：
- **Notion 風格**：Block-based 編輯器、多視圖資料庫、協作功能
- **NotebookLM 風格**：AI 對話介面、智能引用、知識圖譜
- **Gemini 整合**：實時對話、語音交互、多模態支援

---

## 🏗️ 架構設計

### 1. 數據模型重構

#### Block 系統 (核心)
```typescript
// 新增 Block Model
interface Block {
  id: string;
  type: BlockType;
  content: BlockContent;
  properties: BlockProperties;
  children?: Block[];
  parentId?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
}

enum BlockType {
  // Text Blocks
  TEXT = 'text',
  HEADING_1 = 'heading_1',
  HEADING_2 = 'heading_2',
  HEADING_3 = 'heading_3',

  // List Blocks
  BULLETED_LIST = 'bulleted_list',
  NUMBERED_LIST = 'numbered_list',
  TODO = 'todo',
  TOGGLE = 'toggle',

  // Media Blocks
  IMAGE = 'image',
  VIDEO = 'video',
  FILE = 'file',
  AUDIO = 'audio',

  // Embed Blocks
  CODE = 'code',
  QUOTE = 'quote',
  CALLOUT = 'callout',
  DIVIDER = 'divider',

  // Advanced Blocks
  TABLE = 'table',
  BOOKMARK = 'bookmark',
  LINK_TO_PAGE = 'link_to_page',
  SYNCED_BLOCK = 'synced_block',

  // Database Blocks
  DATABASE = 'database',
  DATABASE_ROW = 'database_row',

  // AI Blocks
  AI_GENERATED = 'ai_generated',
  AI_SUMMARY = 'ai_summary',
}

interface BlockContent {
  text?: string;
  rich_text?: RichText[];
  url?: string;
  file?: FileObject;
  code?: CodeContent;
  table?: TableContent;
  database?: DatabaseContent;
}

interface RichText {
  type: 'text' | 'mention' | 'equation';
  text?: { content: string; link?: { url: string } };
  annotations?: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
  href?: string;
}
```

#### Page 系統 (文檔容器)
```typescript
interface Page {
  id: string;
  title: string;
  icon?: PageIcon;
  cover?: PageCover;
  blocks: Block[];
  properties: PageProperties;
  parentId?: string; // 用於階層結構
  workspaceId: string;
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastEditedBy: string;
}

interface PageIcon {
  type: 'emoji' | 'file' | 'external';
  emoji?: string;
  url?: string;
}

interface PageCover {
  type: 'external' | 'file' | 'gradient';
  url?: string;
  gradient?: string;
}

interface PageProperties {
  // Notion-style properties
  tags?: string[];
  status?: string;
  category?: string;
  date?: Date;
  checkbox?: boolean;
  // Custom properties
  [key: string]: any;
}
```

#### Database 系統 (多視圖)
```typescript
interface Database {
  id: string;
  title: string;
  description?: string;
  icon?: PageIcon;
  cover?: PageCover;

  // Schema definition
  properties: DatabaseProperty[];

  // Data rows (each row is a Page)
  rows: Page[];

  // Views
  views: DatabaseView[];
  defaultViewId: string;

  // Permissions
  permissions: Permission[];

  createdAt: Date;
  updatedAt: Date;
}

interface DatabaseProperty {
  id: string;
  name: string;
  type: PropertyType;
  options?: PropertyOptions;
}

enum PropertyType {
  TITLE = 'title',
  TEXT = 'text',
  NUMBER = 'number',
  SELECT = 'select',
  MULTI_SELECT = 'multi_select',
  DATE = 'date',
  PERSON = 'person',
  FILES = 'files',
  CHECKBOX = 'checkbox',
  URL = 'url',
  EMAIL = 'email',
  PHONE = 'phone',
  FORMULA = 'formula',
  RELATION = 'relation',
  ROLLUP = 'rollup',
  CREATED_TIME = 'created_time',
  CREATED_BY = 'created_by',
  LAST_EDITED_TIME = 'last_edited_time',
  LAST_EDITED_BY = 'last_edited_by',
}

interface DatabaseView {
  id: string;
  name: string;
  type: ViewType;
  filter?: ViewFilter;
  sort?: ViewSort[];
  properties: ViewProperties;
}

enum ViewType {
  TABLE = 'table',
  BOARD = 'board',
  GALLERY = 'gallery',
  LIST = 'list',
  CALENDAR = 'calendar',
  TIMELINE = 'timeline',
}
```

#### AI 對話系統 (NotebookLM 風格)
```typescript
interface Conversation {
  id: string;
  workspaceId: string;
  sourcePages: string[]; // Page IDs used as context
  messages: ConversationMessage[];
  summary?: string;
  keyTopics?: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: MessageContent;
  citations?: Citation[];
  suggestions?: FollowUpSuggestion[];
  timestamp: Date;
}

interface MessageContent {
  text: string;
  audioUrl?: string; // NotebookLM audio conversation
  blocks?: Block[]; // Rich content blocks
}

interface Citation {
  index: number;
  pageId: string;
  blockId: string;
  snippet: string;
  relevanceScore: number;
}

interface FollowUpSuggestion {
  id: string;
  text: string;
  icon: string;
  relatedTopics?: string[];
}
```

#### 知識圖譜系統
```typescript
interface KnowledgeGraph {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
}

interface KnowledgeNode {
  id: string;
  pageId: string;
  title: string;
  type: 'page' | 'block' | 'topic';
  embedding?: number[];
  metadata: {
    viewCount: number;
    lastViewed?: Date;
    importance: number;
  };
}

interface KnowledgeEdge {
  id: string;
  source: string; // Node ID
  target: string; // Node ID
  type: EdgeType;
  weight: number;
  metadata?: Record<string, any>;
}

enum EdgeType {
  REFERENCE = 'reference',        // 明確引用
  SIMILARITY = 'similarity',      // 語意相似
  HIERARCHY = 'hierarchy',        // 父子關係
  TAG = 'tag',                    // 標籤連結
  TEMPORAL = 'temporal',          // 時間序列
  COLLABORATION = 'collaboration' // 協作關係
}
```

---

## 🛠️ 技術選型

### 前端架構
```
Angular 20.x (現有)
├── 富文本編輯器
│   ├── Tiptap (推薦) - 基於 ProseMirror
│   │   ├── 優點：TypeScript 支援、擴展性強、社群活躍
│   │   ├── 套件：@tiptap/core, @tiptap/angular, @tiptap/starter-kit
│   │   └── 支援：Slash commands、Drag & drop、協作編輯
│   │
│   └── ProseMirror (低階選項)
│       └── 完全客製化，但開發成本高
│
├── 資料視覺化
│   ├── AG Grid (表格視圖)
│   ├── @angular/cdk/drag-drop (看板拖放)
│   ├── FullCalendar (日曆視圖)
│   └── D3.js (知識圖譜)
│
├── 協作功能
│   ├── Y.js (CRDT 協作編輯)
│   ├── Socket.io / WebSocket (實時同步)
│   └── Hocuspocus (Tiptap 協作後端)
│
└── UI 組件庫
    ├── Angular Material (現有)
    └── Tailwind CSS (可選)
```

### 後端架構 (新增)
```
Option A: Node.js + Express
├── TypeScript
├── PostgreSQL (主要資料庫)
├── Redis (快取 + WebSocket)
├── Pinecone / Weaviate (向量資料庫)
└── MinIO / Cloudflare R2 (檔案儲存)

Option B: Node.js + NestJS (推薦)
├── TypeScript (與前端共享型別)
├── Prisma ORM (型別安全的資料庫操作)
├── PostgreSQL + pgvector (向量搜尋)
├── Redis (快取 + Queue)
├── Bull (任務佇列)
└── Passport.js (認證)

Option C: Serverless (Cloudflare Workers)
├── Cloudflare Workers
├── Cloudflare D1 (SQLite)
├── Cloudflare Vectorize (向量搜尋)
├── Cloudflare R2 (檔案儲存)
└── Cloudflare Durable Objects (協作狀態)
```

### AI 整合
```
Gemini API
├── gemini-1.5-pro (主要模型)
│   ├── 2M token context window
│   ├── 支援多模態 (文字、圖片、音訊、影片)
│   └── Function calling
│
├── gemini-1.5-flash (快速回應)
│   └── 低延遲對話
│
├── text-embedding-004 (向量嵌入)
│   └── 768 維度
│
└── 進階功能
    ├── Grounding (Google Search 整合)
    ├── Code execution (執行 Python)
    └── Audio output (語音對話)
```

---

## 📅 實施階段

### Phase 1: 基礎架構 (2-3 週)
**目標：建立 Block 系統與編輯器**

- [ ] **Week 1: 數據模型**
  - [ ] 建立 Block、Page、Database 資料模型
  - [ ] 設計 PostgreSQL Schema
  - [ ] Prisma Schema 定義
  - [ ] 資料庫遷移腳本

- [ ] **Week 2: 富文本編輯器**
  - [ ] 整合 Tiptap
  - [ ] 實現基本 Block 類型 (Text, Heading, List)
  - [ ] Slash command 選單 (/)
  - [ ] Block 轉換與刪除

- [ ] **Week 3: Block 進階功能**
  - [ ] Drag & drop 排序
  - [ ] Code block 語法高亮
  - [ ] Image/File upload
  - [ ] Callout、Quote、Divider
  - [ ] Table block

### Phase 2: Database 視圖 (2-3 週)
**目標：實現 Notion 風格的資料庫系統**

- [ ] **Week 4: Database 核心**
  - [ ] Database 建立與管理
  - [ ] Property schema 設計
  - [ ] Row (Page) CRUD 操作
  - [ ] Filter 系統

- [ ] **Week 5: 多視圖實現**
  - [ ] Table view (AG Grid)
  - [ ] Board view (Kanban)
  - [ ] Gallery view
  - [ ] List view

- [ ] **Week 6: 視圖進階功能**
  - [ ] Sort 排序
  - [ ] Group 分組
  - [ ] Calendar view (FullCalendar)
  - [ ] Timeline view (可選)

### Phase 3: AI 對話系統 (2-3 週)
**目標：NotebookLM 風格的 AI 助手**

- [ ] **Week 7: Gemini 整合升級**
  - [ ] 重構 AI Service
  - [ ] Multi-turn 對話管理
  - [ ] Context window 優化 (2M tokens)
  - [ ] Streaming 回應

- [ ] **Week 8: Citations 系統**
  - [ ] 自動引用標記 [1][2][3]
  - [ ] Block-level citation
  - [ ] Citation 高亮與跳轉
  - [ ] Source tracking

- [ ] **Week 9: 對話 UI 重構**
  - [ ] NotebookLM 風格介面
  - [ ] Follow-up suggestions
  - [ ] Conversation history
  - [ ] Audio conversation (語音)
  - [ ] Export conversation

### Phase 4: 知識圖譜 (2 週)
**目標：自動建立知識連結**

- [ ] **Week 10: 向量嵌入**
  - [ ] 整合 text-embedding-004
  - [ ] Batch embedding 處理
  - [ ] 向量資料庫 (Pinecone/pgvector)
  - [ ] Similarity search

- [ ] **Week 11: 知識圖譜**
  - [ ] Graph 建立演算法
  - [ ] Auto-linking (雙向連結)
  - [ ] Related pages 推薦
  - [ ] Topic clustering
  - [ ] D3.js 視覺化

### Phase 5: 協作功能 (2 週)
**目標：多人即時協作**

- [ ] **Week 12: 即時同步**
  - [ ] Y.js CRDT 整合
  - [ ] WebSocket 連線
  - [ ] Cursor sharing
  - [ ] Presence 顯示

- [ ] **Week 13: 協作進階**
  - [ ] Comments 系統
  - [ ] @mention 功能
  - [ ] Page sharing & permissions
  - [ ] Activity log

### Phase 6: 優化與部署 (1-2 週)
**目標：效能優化與生產部署**

- [ ] **Week 14: 效能優化**
  - [ ] Virtual scrolling
  - [ ] Block lazy loading
  - [ ] Image CDN 整合
  - [ ] Database indexing
  - [ ] Query optimization

- [ ] **Week 15: 部署**
  - [ ] Backend 部署 (Railway/Render/Fly.io)
  - [ ] Frontend 部署 (Cloudflare Pages)
  - [ ] Database 備份策略
  - [ ] Monitoring (Sentry, LogRocket)

---

## 🎨 UI/UX 設計重點

### Notion 風格元素
```
1. 側邊欄結構
   ├── Workspace switcher
   ├── Search (Cmd+K)
   ├── Page tree (可拖放)
   ├── Templates
   └── Trash

2. Page 編輯器
   ├── Icon & Cover picker
   ├── Title (always visible)
   ├── Properties bar
   ├── Block editor (/ 觸發選單)
   └── AI button (bottom-right)

3. Database 視圖
   ├── View tabs (Table, Board, Gallery...)
   ├── Filter/Sort/Group 控制列
   ├── Property customization
   └── New row/page button
```

### NotebookLM 風格元素
```
1. AI Chat Panel (右側)
   ├── Source selector (選擇對話 context)
   ├── Chat messages with citations
   ├── Follow-up suggestions
   ├── Audio conversation toggle
   └── Export chat

2. Citation 樣式
   ├── Inline citations [1][2][3]
   ├── Hover preview
   ├── Click to jump to source
   └── Source list at bottom

3. Smart Features
   ├── Auto-generated summaries
   ├── Topic extraction
   ├── Related pages
   └── Study guides
```

---

## 🔐 安全性考量

### 認證 & 授權
```
- [ ] JWT token-based auth
- [ ] Refresh token rotation
- [ ] OAuth 2.0 (Google, GitHub)
- [ ] Role-based access control (RBAC)
- [ ] Page-level permissions
- [ ] Share links with expiration
```

### 資料保護
```
- [ ] HTTPS only
- [ ] API rate limiting
- [ ] SQL injection prevention (Prisma)
- [ ] XSS protection
- [ ] CSRF tokens
- [ ] Content Security Policy (CSP)
- [ ] File upload validation
```

---

## 📊 成功指標

### 技術指標
- [ ] Page load time < 2s
- [ ] Time to interactive < 3s
- [ ] Block render time < 100ms
- [ ] AI response time < 5s
- [ ] Collaborative edit latency < 200ms

### 功能指標
- [ ] 支援 20+ Block 類型
- [ ] 6+ Database 視圖
- [ ] 2M token AI context
- [ ] 即時多人協作
- [ ] 完整的知識圖譜

---

## 🚀 後續擴展

### 進階功能 (可選)
```
- [ ] Mobile app (React Native/Flutter)
- [ ] Desktop app (Electron/Tauri)
- [ ] API & Webhooks
- [ ] Third-party integrations (Slack, GitHub...)
- [ ] Advanced analytics
- [ ] Version history & rollback
- [ ] Page templates marketplace
- [ ] AI-powered automation
```

---

## 📚 參考資源

### 文件
- [Notion API Documentation](https://developers.notion.com/)
- [Tiptap Documentation](https://tiptap.dev/)
- [Y.js Documentation](https://docs.yjs.dev/)
- [Gemini API Documentation](https://ai.google.dev/docs)

### 開源專案參考
- [AppFlowy](https://github.com/AppFlowy-IO/AppFlowy) - Notion alternative
- [AFFiNE](https://github.com/toeverything/AFFiNE) - Knowledge base
- [Outline](https://github.com/outline/outline) - Team wiki

---

## 👥 團隊分工建議

如果是團隊開發：
- **Frontend Developer**: Block editor, Database views
- **Backend Developer**: API, Database, Auth
- **AI Engineer**: Gemini integration, Embeddings
- **DevOps**: Infrastructure, CI/CD
- **Designer**: UI/UX, Prototyping

如果是獨立開發：
建議先完成 Phase 1-3，獲得 MVP (最小可行產品)，再逐步加入協作功能。

---

## 💰 成本估算

### 開發成本 (獨立開發)
- 開發時間：12-15 週 (全職)
- 或：24-30 週 (兼職)

### 運營成本 (月)
```
- Backend hosting (Render/Railway): $7-25
- PostgreSQL (Neon/Supabase): $0-25
- Vector DB (Pinecone): $0-70
- File storage (R2): $0-15
- Gemini API: 依使用量 ($0-100)
- Total: ~$50-250/月
```

### 免費方案選項
```
- Cloudflare Workers (免費額度)
- Cloudflare D1 (免費)
- Cloudflare Vectorize (beta 免費)
- Cloudflare R2 (免費額度)
- Gemini API (免費額度)
Total: $0/月 (小規模使用)
```

---

## ✅ 下一步行動

請確認以下問題：

1. **架構選擇**
   - 您偏好 Option A (Express), B (NestJS), 還是 C (Serverless)?
   - 我推薦 **Option C (Cloudflare Workers)** 如果您想快速啟動且成本最低

2. **優先級**
   - 您想先實現 Notion 風格編輯器，還是 NotebookLM 風格 AI 對話？
   - 我建議：**Phase 1 (Block 編輯器) → Phase 3 (AI 對話) → Phase 2 (Database)**

3. **開發節奏**
   - 全職開發 (3 個月) 還是兼職開發 (6 個月)?
   - 需要保留現有功能嗎？還是可以完全重寫？

請告訴我您的偏好，我立即開始實施！🚀
