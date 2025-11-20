# 後端 API 規格文檔

## 📋 總覽

本文檔定義了 Notion + NotebookLM 混合系統所需的所有後端 API endpoints。前端會使用這些 API 進行數據操作。

**Base URL**: `https://api.yourdomain.com/v1`

**認證方式**: JWT Bearer Token
```
Authorization: Bearer <token>
```

---

## 🔐 認證 API

### POST `/auth/register`
註冊新用戶

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "User Name"
}
```

**Response** (201 Created):
```json
{
  "user": {
    "id": "usr_123",
    "email": "user@example.com",
    "name": "User Name",
    "avatar": "https://...",
    "createdAt": "2025-01-20T10:00:00Z"
  },
  "tokens": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 3600
  }
}
```

### POST `/auth/login`
用戶登入

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response** (200 OK):
```json
{
  "user": {
    "id": "usr_123",
    "email": "user@example.com",
    "name": "User Name",
    "avatar": "https://...",
    "workspaces": ["ws_1", "ws_2"]
  },
  "tokens": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 3600
  }
}
```

### POST `/auth/refresh`
刷新 access token

**Request Body**:
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response** (200 OK):
```json
{
  "accessToken": "eyJhbGc...",
  "expiresIn": 3600
}
```

### POST `/auth/logout`
登出

**Request Headers**:
```
Authorization: Bearer <token>
```

**Response** (204 No Content)

---

## 👤 用戶 API

### GET `/users/me`
獲取當前用戶資訊

**Response** (200 OK):
```json
{
  "id": "usr_123",
  "email": "user@example.com",
  "name": "User Name",
  "avatar": "https://...",
  "settings": {
    "theme": "dark",
    "language": "zh-TW",
    "notificationsEnabled": true
  },
  "workspaces": [
    {
      "id": "ws_1",
      "name": "Personal",
      "role": "owner"
    }
  ],
  "createdAt": "2025-01-20T10:00:00Z"
}
```

### PATCH `/users/me`
更新當前用戶資訊

**Request Body**:
```json
{
  "name": "New Name",
  "avatar": "https://...",
  "settings": {
    "theme": "light"
  }
}
```

**Response** (200 OK): 更新後的用戶物件

---

## 🏢 Workspace API

### GET `/workspaces`
獲取所有 workspace 列表

**Response** (200 OK):
```json
{
  "workspaces": [
    {
      "id": "ws_1",
      "name": "Personal",
      "icon": "🏠",
      "members": 1,
      "role": "owner",
      "createdAt": "2025-01-20T10:00:00Z"
    }
  ]
}
```

### POST `/workspaces`
創建新 workspace

**Request Body**:
```json
{
  "name": "My Workspace",
  "icon": "🚀"
}
```

**Response** (201 Created):
```json
{
  "id": "ws_2",
  "name": "My Workspace",
  "icon": "🚀",
  "ownerId": "usr_123",
  "members": [],
  "createdAt": "2025-01-20T11:00:00Z"
}
```

### GET `/workspaces/:workspaceId`
獲取 workspace 詳情

**Response** (200 OK):
```json
{
  "id": "ws_1",
  "name": "Personal",
  "icon": "🏠",
  "ownerId": "usr_123",
  "members": [
    {
      "userId": "usr_123",
      "role": "owner",
      "joinedAt": "2025-01-20T10:00:00Z"
    }
  ],
  "settings": {
    "allowGuests": false,
    "publicAccess": false
  },
  "createdAt": "2025-01-20T10:00:00Z"
}
```

---

## 📄 Pages API

### GET `/workspaces/:workspaceId/pages`
獲取 workspace 中的所有 pages (含階層結構)

**Query Parameters**:
- `parent_id` (optional): 父頁面 ID，空值表示根頁面
- `limit` (optional): 每頁數量，預設 50
- `cursor` (optional): 分頁游標

**Response** (200 OK):
```json
{
  "pages": [
    {
      "id": "page_1",
      "title": "Getting Started",
      "icon": {
        "type": "emoji",
        "emoji": "🚀"
      },
      "cover": {
        "type": "external",
        "url": "https://..."
      },
      "parentId": null,
      "hasChildren": true,
      "archived": false,
      "createdAt": "2025-01-20T10:00:00Z",
      "updatedAt": "2025-01-20T12:00:00Z",
      "createdBy": "usr_123",
      "lastEditedBy": "usr_123"
    }
  ],
  "nextCursor": "cursor_abc",
  "hasMore": false
}
```

### POST `/workspaces/:workspaceId/pages`
創建新 page

**Request Body**:
```json
{
  "title": "New Page",
  "icon": {
    "type": "emoji",
    "emoji": "📝"
  },
  "cover": {
    "type": "gradient",
    "gradient": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  "parentId": "page_1",
  "properties": {
    "tags": ["important"],
    "status": "in-progress"
  }
}
```

**Response** (201 Created):
```json
{
  "id": "page_2",
  "title": "New Page",
  "icon": { "type": "emoji", "emoji": "📝" },
  "cover": { "type": "gradient", "gradient": "..." },
  "parentId": "page_1",
  "properties": { "tags": ["important"], "status": "in-progress" },
  "blocks": [],
  "createdAt": "2025-01-20T13:00:00Z",
  "createdBy": "usr_123"
}
```

### GET `/pages/:pageId`
獲取 page 詳情（含所有 blocks）

**Response** (200 OK):
```json
{
  "id": "page_1",
  "workspaceId": "ws_1",
  "title": "Getting Started",
  "icon": { "type": "emoji", "emoji": "🚀" },
  "cover": { "type": "external", "url": "https://..." },
  "parentId": null,
  "properties": {
    "tags": ["tutorial"],
    "status": "published"
  },
  "blocks": [
    {
      "id": "block_1",
      "type": "heading_1",
      "content": {
        "rich_text": [
          {
            "type": "text",
            "text": { "content": "Welcome!" },
            "annotations": { "bold": true, "color": "default" }
          }
        ]
      },
      "children": [],
      "order": 0,
      "createdAt": "2025-01-20T10:00:00Z"
    },
    {
      "id": "block_2",
      "type": "text",
      "content": {
        "rich_text": [
          {
            "type": "text",
            "text": { "content": "This is a paragraph." }
          }
        ]
      },
      "order": 1
    }
  ],
  "createdAt": "2025-01-20T10:00:00Z",
  "updatedAt": "2025-01-20T12:00:00Z"
}
```

### PATCH `/pages/:pageId`
更新 page 屬性（不含 blocks）

**Request Body**:
```json
{
  "title": "Updated Title",
  "icon": { "type": "emoji", "emoji": "✨" },
  "properties": {
    "status": "completed"
  }
}
```

**Response** (200 OK): 更新後的 page 物件

### DELETE `/pages/:pageId`
刪除 page（會移動到垃圾桶）

**Response** (200 OK):
```json
{
  "id": "page_1",
  "archived": true,
  "archivedAt": "2025-01-20T14:00:00Z"
}
```

### POST `/pages/:pageId/restore`
從垃圾桶恢復 page

**Response** (200 OK):
```json
{
  "id": "page_1",
  "archived": false
}
```

---

## 🧱 Blocks API

### POST `/pages/:pageId/blocks`
在 page 中新增 block

**Request Body**:
```json
{
  "type": "text",
  "content": {
    "rich_text": [
      {
        "type": "text",
        "text": { "content": "Hello World" }
      }
    ]
  },
  "parentId": null,
  "afterId": "block_1"
}
```

**Response** (201 Created):
```json
{
  "id": "block_3",
  "type": "text",
  "content": { "rich_text": [...] },
  "parentId": null,
  "order": 2,
  "createdAt": "2025-01-20T13:00:00Z"
}
```

### PATCH `/blocks/:blockId`
更新 block 內容

**Request Body**:
```json
{
  "type": "text",
  "content": {
    "rich_text": [
      {
        "type": "text",
        "text": { "content": "Updated content" },
        "annotations": { "bold": true }
      }
    ]
  }
}
```

**Response** (200 OK): 更新後的 block 物件

### DELETE `/blocks/:blockId`
刪除 block

**Response** (204 No Content)

### POST `/blocks/:blockId/children`
在 block 下新增子 block（用於 nested blocks）

**Request Body**: 同 `POST /pages/:pageId/blocks`

**Response** (201 Created): 新增的 block 物件

### PATCH `/blocks/:blockId/move`
移動 block 位置

**Request Body**:
```json
{
  "afterId": "block_2",
  "parentId": null
}
```

**Response** (200 OK):
```json
{
  "id": "block_1",
  "order": 3,
  "parentId": null
}
```

---

## 🗂️ Database API

### POST `/workspaces/:workspaceId/databases`
創建新 database

**Request Body**:
```json
{
  "title": "Tasks",
  "icon": { "type": "emoji", "emoji": "✅" },
  "parentId": "page_1",
  "properties": [
    {
      "name": "Name",
      "type": "title"
    },
    {
      "name": "Status",
      "type": "select",
      "options": {
        "options": [
          { "name": "Not Started", "color": "gray" },
          { "name": "In Progress", "color": "blue" },
          { "name": "Done", "color": "green" }
        ]
      }
    },
    {
      "name": "Due Date",
      "type": "date"
    }
  ]
}
```

**Response** (201 Created):
```json
{
  "id": "db_1",
  "title": "Tasks",
  "icon": { "type": "emoji", "emoji": "✅" },
  "properties": [...],
  "views": [
    {
      "id": "view_1",
      "name": "All Tasks",
      "type": "table",
      "isDefault": true
    }
  ],
  "createdAt": "2025-01-20T13:00:00Z"
}
```

### GET `/databases/:databaseId`
獲取 database 詳情（含 schema）

**Response** (200 OK):
```json
{
  "id": "db_1",
  "title": "Tasks",
  "icon": { "type": "emoji", "emoji": "✅" },
  "properties": [
    {
      "id": "prop_1",
      "name": "Name",
      "type": "title"
    },
    {
      "id": "prop_2",
      "name": "Status",
      "type": "select",
      "options": {
        "options": [
          { "id": "opt_1", "name": "Not Started", "color": "gray" }
        ]
      }
    }
  ],
  "views": [...],
  "defaultViewId": "view_1",
  "createdAt": "2025-01-20T13:00:00Z"
}
```

### POST `/databases/:databaseId/query`
查詢 database（支援 filter, sort, pagination）

**Request Body**:
```json
{
  "filter": {
    "and": [
      {
        "property": "Status",
        "select": {
          "equals": "In Progress"
        }
      }
    ]
  },
  "sorts": [
    {
      "property": "Due Date",
      "direction": "ascending"
    }
  ],
  "pageSize": 20,
  "cursor": null
}
```

**Response** (200 OK):
```json
{
  "results": [
    {
      "id": "page_10",
      "properties": {
        "Name": {
          "title": [{ "text": { "content": "Task 1" } }]
        },
        "Status": {
          "select": { "name": "In Progress", "color": "blue" }
        },
        "Due Date": {
          "date": { "start": "2025-01-25" }
        }
      },
      "createdAt": "2025-01-20T10:00:00Z",
      "updatedAt": "2025-01-20T12:00:00Z"
    }
  ],
  "nextCursor": "cursor_xyz",
  "hasMore": false
}
```

### POST `/databases/:databaseId/rows`
在 database 中新增一筆資料（實際上是創建一個 page）

**Request Body**:
```json
{
  "properties": {
    "Name": {
      "title": [{ "text": { "content": "New Task" } }]
    },
    "Status": {
      "select": { "name": "Not Started" }
    }
  }
}
```

**Response** (201 Created): page 物件

### PATCH `/databases/:databaseId/properties/:propertyId`
更新 database property schema

**Request Body**:
```json
{
  "name": "Priority",
  "type": "select",
  "options": {
    "options": [
      { "name": "High", "color": "red" },
      { "name": "Medium", "color": "yellow" },
      { "name": "Low", "color": "green" }
    ]
  }
}
```

**Response** (200 OK): 更新後的 property 物件

### POST `/databases/:databaseId/views`
創建新的 database view

**Request Body**:
```json
{
  "name": "Board View",
  "type": "board",
  "groupBy": "Status",
  "filter": {
    "property": "Status",
    "select": { "is_not_empty": true }
  }
}
```

**Response** (201 Created):
```json
{
  "id": "view_2",
  "name": "Board View",
  "type": "board",
  "groupBy": "Status",
  "filter": {...},
  "sort": [],
  "createdAt": "2025-01-20T14:00:00Z"
}
```

---

## 🤖 AI API

### POST `/ai/chat`
發送訊息到 AI 助手（支援 streaming）

**Request Body**:
```json
{
  "workspaceId": "ws_1",
  "conversationId": "conv_1",
  "message": "What is this document about?",
  "sourcePageIds": ["page_1", "page_2"],
  "model": "gemini-1.5-pro",
  "stream": true
}
```

**Response (stream: false)** (200 OK):
```json
{
  "conversationId": "conv_1",
  "messageId": "msg_1",
  "role": "assistant",
  "content": "Based on the provided documents...",
  "citations": [
    {
      "index": 1,
      "pageId": "page_1",
      "blockId": "block_5",
      "snippet": "This document explains...",
      "relevanceScore": 0.95
    }
  ],
  "suggestions": [
    {
      "text": "Tell me more about X",
      "icon": "💡"
    }
  ],
  "usage": {
    "promptTokens": 1500,
    "completionTokens": 300,
    "totalTokens": 1800
  },
  "createdAt": "2025-01-20T14:00:00Z"
}
```

**Response (stream: true)**: Server-Sent Events (SSE)
```
data: {"type":"start","conversationId":"conv_1","messageId":"msg_1"}

data: {"type":"token","content":"Based"}

data: {"type":"token","content":" on"}

data: {"type":"citation","citation":{"index":1,"pageId":"page_1",...}}

data: {"type":"end","suggestions":[...]}
```

### POST `/ai/summarize`
生成 page 摘要

**Request Body**:
```json
{
  "pageId": "page_1",
  "language": "zh-TW",
  "length": "medium"
}
```

**Response** (200 OK):
```json
{
  "pageId": "page_1",
  "summary": "這份文檔介紹了...",
  "keyPoints": [
    "重點一",
    "重點二",
    "重點三"
  ],
  "topics": ["AI", "機器學習", "深度學習"],
  "createdAt": "2025-01-20T14:00:00Z"
}
```

### POST `/ai/suggest-tags`
為 page 建議標籤

**Request Body**:
```json
{
  "pageId": "page_1"
}
```

**Response** (200 OK):
```json
{
  "pageId": "page_1",
  "suggestedTags": [
    { "name": "AI", "confidence": 0.95 },
    { "name": "Tutorial", "confidence": 0.88 },
    { "name": "Beginner", "confidence": 0.72 }
  ]
}
```

### POST `/ai/generate-audio`
生成 NotebookLM 風格的音訊對話（可選功能）

**Request Body**:
```json
{
  "pageIds": ["page_1", "page_2"],
  "voices": ["male", "female"],
  "duration": "short"
}
```

**Response** (200 OK):
```json
{
  "audioUrl": "https://cdn.example.com/audio/abc123.mp3",
  "duration": 180,
  "transcript": "...",
  "createdAt": "2025-01-20T14:00:00Z"
}
```

### GET `/ai/conversations/:conversationId`
獲取對話歷史

**Response** (200 OK):
```json
{
  "id": "conv_1",
  "workspaceId": "ws_1",
  "sourcePages": ["page_1", "page_2"],
  "messages": [
    {
      "id": "msg_1",
      "role": "user",
      "content": "What is this about?",
      "timestamp": "2025-01-20T13:00:00Z"
    },
    {
      "id": "msg_2",
      "role": "assistant",
      "content": "This document...",
      "citations": [...],
      "timestamp": "2025-01-20T13:00:05Z"
    }
  ],
  "summary": "討論關於...",
  "keyTopics": ["AI", "機器學習"],
  "createdAt": "2025-01-20T13:00:00Z"
}
```

---

## 🔍 Search API

### POST `/workspaces/:workspaceId/search`
搜尋 workspace 中的內容

**Request Body**:
```json
{
  "query": "machine learning",
  "type": "hybrid",
  "filters": {
    "pageIds": ["page_1", "page_2"],
    "tags": ["AI"],
    "dateRange": {
      "start": "2025-01-01",
      "end": "2025-01-31"
    }
  },
  "limit": 20
}
```

**Response** (200 OK):
```json
{
  "results": [
    {
      "type": "page",
      "id": "page_1",
      "title": "Introduction to ML",
      "snippet": "...machine learning is...",
      "relevanceScore": 0.95,
      "highlights": ["machine learning"],
      "matchedBlocks": [
        {
          "blockId": "block_3",
          "content": "...",
          "relevanceScore": 0.92
        }
      ]
    },
    {
      "type": "block",
      "id": "block_5",
      "pageId": "page_2",
      "pageTitle": "Advanced Topics",
      "content": "...deep learning...",
      "relevanceScore": 0.88
    }
  ],
  "totalResults": 15,
  "queryType": "hybrid"
}
```

### POST `/search/semantic`
語意搜尋（向量搜尋）

**Request Body**:
```json
{
  "workspaceId": "ws_1",
  "query": "How to implement neural networks?",
  "topK": 10,
  "threshold": 0.7
}
```

**Response** (200 OK):
```json
{
  "results": [
    {
      "pageId": "page_5",
      "blockId": "block_12",
      "content": "...",
      "similarityScore": 0.92,
      "embedding": null
    }
  ]
}
```

---

## 🔗 Knowledge Graph API

### GET `/workspaces/:workspaceId/graph`
獲取知識圖譜

**Query Parameters**:
- `depth` (optional): 圖譜深度，預設 2
- `centerPageId` (optional): 中心節點 page ID

**Response** (200 OK):
```json
{
  "nodes": [
    {
      "id": "page_1",
      "title": "Machine Learning",
      "type": "page",
      "importance": 0.95,
      "viewCount": 150,
      "tags": ["AI"]
    }
  ],
  "edges": [
    {
      "id": "edge_1",
      "source": "page_1",
      "target": "page_2",
      "type": "reference",
      "weight": 0.8
    }
  ]
}
```

### POST `/workspaces/:workspaceId/graph/suggestions`
獲取相關頁面建議

**Request Body**:
```json
{
  "pageId": "page_1",
  "limit": 5
}
```

**Response** (200 OK):
```json
{
  "suggestions": [
    {
      "pageId": "page_10",
      "title": "Deep Learning Basics",
      "reason": "similar_topics",
      "similarityScore": 0.88,
      "sharedTags": ["AI", "Tutorial"]
    }
  ]
}
```

---

## 📁 File Upload API

### POST `/files/upload`
上傳檔案（圖片、PDF、影片等）

**Request**: `multipart/form-data`
```
file: <binary>
workspaceId: ws_1
```

**Response** (200 OK):
```json
{
  "id": "file_1",
  "name": "image.png",
  "url": "https://cdn.example.com/files/abc123.png",
  "thumbnailUrl": "https://cdn.example.com/files/abc123_thumb.png",
  "mimeType": "image/png",
  "size": 102400,
  "uploadedBy": "usr_123",
  "uploadedAt": "2025-01-20T14:00:00Z"
}
```

### DELETE `/files/:fileId`
刪除檔案

**Response** (204 No Content)

---

## 📊 Analytics API

### GET `/workspaces/:workspaceId/analytics/overview`
獲取 workspace 總覽統計

**Response** (200 OK):
```json
{
  "totalPages": 150,
  "totalBlocks": 2500,
  "totalDatabases": 10,
  "totalMembers": 5,
  "storageUsed": 524288000,
  "storageLimit": 10737418240,
  "activity": {
    "pagesCreated7d": 15,
    "pagesEdited7d": 45,
    "activeUsers7d": 3
  }
}
```

### GET `/workspaces/:workspaceId/analytics/activity`
獲取活動記錄

**Query Parameters**:
- `startDate`: 開始日期
- `endDate`: 結束日期
- `userId` (optional): 特定用戶

**Response** (200 OK):
```json
{
  "activities": [
    {
      "id": "act_1",
      "type": "page_created",
      "userId": "usr_123",
      "pageId": "page_1",
      "timestamp": "2025-01-20T10:00:00Z",
      "metadata": {
        "pageTitle": "New Page"
      }
    }
  ],
  "total": 150
}
```

---

## 🔔 Real-time API (WebSocket)

### WebSocket Connection
```
wss://api.yourdomain.com/v1/realtime
```

**Connection Headers**:
```
Authorization: Bearer <token>
```

### Subscribe to Page Updates
**Send**:
```json
{
  "type": "subscribe",
  "channel": "page:page_1"
}
```

**Receive** (when page is updated):
```json
{
  "type": "page_updated",
  "pageId": "page_1",
  "userId": "usr_456",
  "changes": {
    "title": "Updated Title"
  },
  "timestamp": "2025-01-20T14:00:00Z"
}
```

### Presence (誰在線上)
**Send**:
```json
{
  "type": "presence",
  "pageId": "page_1",
  "cursor": {
    "blockId": "block_5",
    "position": 10
  }
}
```

**Receive**:
```json
{
  "type": "user_presence",
  "userId": "usr_456",
  "userName": "John Doe",
  "pageId": "page_1",
  "cursor": {
    "blockId": "block_5",
    "position": 10
  }
}
```

### Block Updates (CRDT)
**Send**:
```json
{
  "type": "block_update",
  "blockId": "block_5",
  "operations": [
    { "op": "insert", "pos": 5, "text": "Hello" }
  ]
}
```

---

## ❌ 錯誤處理

所有 API 錯誤會返回以下格式：

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Missing required field: title",
    "details": {
      "field": "title",
      "reason": "required"
    },
    "timestamp": "2025-01-20T14:00:00Z",
    "requestId": "req_abc123"
  }
}
```

### 錯誤碼列表

| HTTP Status | Error Code | 說明 |
|------------|------------|------|
| 400 | INVALID_REQUEST | 請求參數錯誤 |
| 401 | UNAUTHORIZED | 未認證 |
| 403 | FORBIDDEN | 無權限 |
| 404 | NOT_FOUND | 資源不存在 |
| 409 | CONFLICT | 資源衝突（例如重複建立） |
| 429 | RATE_LIMIT_EXCEEDED | 超過速率限制 |
| 500 | INTERNAL_ERROR | 伺服器內部錯誤 |
| 503 | SERVICE_UNAVAILABLE | 服務暫時不可用 |

---

## 🔄 Rate Limiting

所有 API endpoints 都有速率限制：

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642684800
```

**限制**:
- 一般 API: 100 requests/minute
- 搜尋 API: 30 requests/minute
- AI API: 10 requests/minute
- File Upload: 20 requests/minute

---

## 📝 Webhooks (可選)

### POST `/webhooks`
註冊 webhook

**Request Body**:
```json
{
  "url": "https://your-app.com/webhook",
  "events": ["page.created", "page.updated", "database.row.created"],
  "secret": "your_secret"
}
```

**Webhook Payload**:
```json
{
  "event": "page.created",
  "data": {
    "pageId": "page_1",
    "workspaceId": "ws_1",
    "title": "New Page"
  },
  "timestamp": "2025-01-20T14:00:00Z"
}
```

---

## 🎯 優先級建議

### Phase 1 (MVP - 必須)
- ✅ 認證 API (登入/註冊)
- ✅ Pages API (CRUD)
- ✅ Blocks API (CRUD)
- ✅ AI Chat API (基本對話)
- ✅ Search API (基本搜尋)
- ✅ File Upload API

### Phase 2 (核心功能)
- ✅ Database API (含 query)
- ✅ AI Summarize & Tags
- ✅ Semantic Search
- ✅ Knowledge Graph (基本)

### Phase 3 (進階功能)
- ⏳ Real-time WebSocket
- ⏳ AI Audio Generation
- ⏳ Analytics API
- ⏳ Webhooks

---

## 📚 補充說明

### 1. Block 類型完整列表

前端需要支援的所有 block types：

```typescript
enum BlockType {
  // Text
  TEXT = 'text',
  HEADING_1 = 'heading_1',
  HEADING_2 = 'heading_2',
  HEADING_3 = 'heading_3',

  // Lists
  BULLETED_LIST = 'bulleted_list',
  NUMBERED_LIST = 'numbered_list',
  TODO = 'todo',
  TOGGLE = 'toggle',

  // Media
  IMAGE = 'image',
  VIDEO = 'video',
  FILE = 'file',
  AUDIO = 'audio',

  // Embeds
  CODE = 'code',
  QUOTE = 'quote',
  CALLOUT = 'callout',
  DIVIDER = 'divider',

  // Advanced
  TABLE = 'table',
  BOOKMARK = 'bookmark',
  LINK_TO_PAGE = 'link_to_page',

  // Database
  DATABASE = 'database',
}
```

### 2. Database Property 類型

```typescript
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
  CREATED_TIME = 'created_time',
  LAST_EDITED_TIME = 'last_edited_time',
}
```

### 3. 建議的 API 回應時間

- Pages/Blocks CRUD: < 200ms
- Search: < 500ms
- AI Chat (non-streaming): < 3s
- AI Summarize: < 5s
- File Upload: 取決於檔案大小

---

## 🚀 快速開始範例

### 完整流程示例：創建一個包含內容的 Page

```bash
# 1. 登入
curl -X POST https://api.yourdomain.com/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'

# Response: {"tokens":{"accessToken":"eyJ..."}}

# 2. 創建 Page
curl -X POST https://api.yourdomain.com/v1/workspaces/ws_1/pages \
  -H "Authorization: Bearer eyJ..." \
  -H "Content-Type: application/json" \
  -d '{"title":"My First Page","icon":{"type":"emoji","emoji":"🚀"}}'

# Response: {"id":"page_123",...}

# 3. 新增 Block
curl -X POST https://api.yourdomain.com/v1/pages/page_123/blocks \
  -H "Authorization: Bearer eyJ..." \
  -H "Content-Type: application/json" \
  -d '{
    "type":"heading_1",
    "content":{
      "rich_text":[{"type":"text","text":{"content":"Welcome!"}}]
    }
  }'

# 4. 與 AI 對話
curl -X POST https://api.yourdomain.com/v1/ai/chat \
  -H "Authorization: Bearer eyJ..." \
  -H "Content-Type: application/json" \
  -d '{
    "message":"Summarize this page",
    "sourcePageIds":["page_123"]
  }'
```

---

## 📞 支援

如有 API 相關問題，請聯繫：
- Email: api-support@yourdomain.com
- 文檔: https://docs.yourdomain.com/api
- Changelog: https://docs.yourdomain.com/api/changelog
