/**
 * AI 服務 - Gemini API 整合
 *
 * 提供完整的 AI 功能整合，使用 Google Gemini 1.5 Pro 模型
 * 實現 RAG (Retrieval-Augmented Generation) 架構的核心 AI 功能
 *
 * 功能：
 * - 文檔摘要生成（summarization）
 * - 智慧問答助手（Q&A with citations）
 * - 標籤建議（tag suggestion）
 * - 聊天歷史管理
 * - NotebookLM 風格的引用標記
 *
 * 模式：
 * - **Demo 模式** (DEMO_MODE = true): 使用模擬回應，無需 API key
 * - **真實模式** (DEMO_MODE = false): 調用 Gemini API，需要有效的 API key
 *
 * 安全特性：
 * - SSR 兼容（瀏覽器環境檢查）
 * - API Key 安全儲存（localStorage）
 * - 錯誤處理與降級
 *
 * @example
 * ```typescript
 * // 設定 API Key
 * aiService.setAPIKey('your-gemini-api-key');
 *
 * // 生成文檔摘要
 * const summary = await aiService.generateSummary(document);
 *
 * // AI 問答（帶引用）
 * const answer = await aiService.askQuestion('什麼是 React?', relevantDocs);
 *
 * // 標籤建議
 * const tags = await aiService.suggestTags(document);
 * ```
 */

import { Injectable, signal, computed } from '@angular/core';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { Document } from '../models/document.model';
import { Citation } from '../models/citation.model';
import { devLog } from '../utils/dev-logger';

/**
 * AI 回應介面
 */
export interface AIResponse {
  text: string;
  isError?: boolean;
  latency?: number;
  citations?: Citation[];
}

/**
 * AI 聊天訊息
 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  citations?: Citation[];
}

/**
 * AI 服務配置
 */
interface AIConfig {
  apiKey?: string;
  model: string;
  demoMode: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AIService {
  /** 是否為 Demo 模式（模擬 AI 回應） */
  private readonly DEMO_MODE = true;

  /** Gemini 模型名稱 */
  private readonly MODEL_NAME = 'gemini-1.5-flash';

  /** Gemini AI 實例 */
  private genAI?: GoogleGenerativeAI;
  private model?: GenerativeModel;

  /** AI 功能啟用狀態 */
  isEnabled = signal<boolean>(this.DEMO_MODE);

  /** 聊天記錄 */
  private chatHistorySignal = signal<ChatMessage[]>([]);
  readonly chatHistory = this.chatHistorySignal.asReadonly();

  /** 是否正在處理 */
  isProcessing = signal<boolean>(false);

  constructor() {
    this.initializeAI();
  }

  /**
   * 初始化 AI
   */
  private initializeAI(): void {
    if (!this.DEMO_MODE) {
      // 真實模式：從環境變數或 localStorage 讀取 API key
      const apiKey = this.getAPIKey();
      if (apiKey) {
        try {
          this.genAI = new GoogleGenerativeAI(apiKey);
          this.model = this.genAI.getGenerativeModel({ model: this.MODEL_NAME });
          this.isEnabled.set(true);
          devLog.log('✅ Gemini AI 已初始化');
        } catch (error) {
          devLog.error('❌ Gemini AI 初始化失敗:', error);
          this.isEnabled.set(false);
        }
      } else {
        devLog.warn('⚠️ 未設定 Gemini API Key，AI 功能已停用');
        this.isEnabled.set(false);
      }
    } else {
      devLog.log('🎭 Demo 模式：使用模擬 AI 回應');
    }
  }

  /**
   * 取得 API Key
   */
  private getAPIKey(): string | null {
    // 優先從 localStorage 讀取
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) return storedKey;

    // 可以從環境變數讀取（需要在 build 時配置）
    return null;
  }

  /**
   * 設定 Gemini API Key
   *
   * 儲存 API Key 到 localStorage 並重新初始化 AI 服務
   *
   * @param apiKey - Gemini API Key (從 https://makersuite.google.com/app/apikey 取得)
   *
   * @example
   * ```typescript
   * aiService.setAPIKey('your-gemini-api-key');
   * // AI 服務將自動啟用
   * ```
   */
  setAPIKey(apiKey: string): void {
    if (apiKey && apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
      this.initializeAI();
    }
  }

  /**
   * 生成文檔摘要
   *
   * 使用 Gemini AI 為文檔生成簡潔的摘要（約 50-80 字）
   * 在 Demo 模式下使用模擬回應
   *
   * @param document - 要生成摘要的文檔
   * @returns AI 回應物件，包含摘要文字和延遲時間
   * @returns {string} response.text - 生成的摘要
   * @returns {number} response.latency - API 延遲時間（毫秒）
   * @returns {boolean} response.isError - 是否發生錯誤
   *
   * @example
   * ```typescript
   * const response = await aiService.generateSummary(document);
   * if (!response.isError) {
   *   console.log('摘要:', response.text);
   *   console.log('延遲:', response.latency, 'ms');
   * }
   * ```
   */
  async generateSummary(document: Document): Promise<AIResponse> {
    const startTime = performance.now();

    if (this.DEMO_MODE) {
      // 模擬模式：生成智慧摘要
      await this.delay(800); // 模擬 API 延遲

      const summaries = [
        `本文深入探討 ${document.title}，涵蓋核心概念、最佳實踐與實際應用案例。`,
        `${document.title} 是 ${document.category} 領域的重要主題，本文提供完整的技術指南與實作建議。`,
        `詳細解析 ${document.title} 的工作原理、使用場景，以及如何在實際專案中應用。`,
        `${document.title} 完整教學：從基礎概念到進階技巧，幫助開發者快速掌握核心知識。`,
      ];

      const summary = summaries[Math.floor(Math.random() * summaries.length)];
      const latency = performance.now() - startTime;

      return {
        text: summary,
        latency: Math.round(latency),
      };
    }

    // 真實模式：調用 Gemini API
    if (!this.model) {
      return {
        text: '❌ AI 服務未啟用',
        isError: true,
      };
    }

    try {
      const prompt = `請為以下技術文檔生成一個簡潔的摘要（約 50-80 字）：

標題：${document.title}
分類：${document.category}
標籤：${document.tags.join('、')}
內容：${document.content}

請用繁體中文撰寫摘要，突出重點並保持專業性。`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const latency = performance.now() - startTime;

      return {
        text,
        latency: Math.round(latency),
      };
    } catch (error) {
      devLog.error('生成摘要失敗:', error);
      return {
        text: '生成摘要時發生錯誤',
        isError: true,
      };
    }
  }

  /**
   * AI 問答助手
   *
   * 根據提供的文檔上下文回答使用者問題
   * 支援引用來源（citations）功能
   * 在 Demo 模式下使用模擬回應
   *
   * @param question - 使用者的問題
   * @param context - 相關文檔上下文（用於 RAG 檢索增強生成）
   * @returns AI 回應物件，包含答案、引用和延遲時間
   * @returns {string} response.text - AI 的回答
   * @returns {Citation[]} response.citations - 引用的來源文檔（NotebookLM 風格）
   * @returns {number} response.latency - API 延遲時間（毫秒）
   * @returns {boolean} response.isError - 是否發生錯誤
   *
   * @example
   * ```typescript
   * const response = await aiService.askQuestion(
   *   '什麼是 React Hooks？',
   *   relevantDocuments
   * );
   * if (!response.isError) {
   *   console.log('答案:', response.text);
   *   console.log('引用來源:', response.citations);
   * }
   * ```
   */
  async askQuestion(question: string, context: Document[]): Promise<AIResponse> {
    const startTime = performance.now();

    // 加入用戶訊息到聊天記錄
    this.addChatMessage('user', question);
    this.isProcessing.set(true);

    try {
      if (this.DEMO_MODE) {
        // 模擬模式：生成帶引用的智慧回答
        await this.delay(1200);

        const { text, citations } = this.generateMockResponseWithCitations(question, context);
        const latency = performance.now() - startTime;

        this.addChatMessage('assistant', text, citations);
        this.isProcessing.set(false);

        return {
          text,
          citations,
          latency: Math.round(latency),
        };
      }

      // 真實模式：調用 Gemini API
      if (!this.model) {
        this.isProcessing.set(false);
        return {
          text: '❌ AI 服務未啟用',
          isError: true,
        };
      }

      // 準備上下文
      const contextText = context
        .slice(0, 5) // 限制最多 5 篇文檔
        .map((doc) => `【${doc.title}】\n${doc.content}`)
        .join('\n\n');

      const prompt = `你是一個知識庫助手，請根據以下文檔回答用戶問題。

知識庫內容：
${contextText}

用戶問題：${question}

請用繁體中文回答，並引用相關文檔標題。如果知識庫中沒有相關資訊，請誠實告知。`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const latency = performance.now() - startTime;

      this.addChatMessage('assistant', text);
      this.isProcessing.set(false);

      return {
        text,
        latency: Math.round(latency),
      };
    } catch (error) {
      devLog.error('問答失敗:', error);
      this.isProcessing.set(false);
      return {
        text: '處理問題時發生錯誤',
        isError: true,
      };
    }
  }

  /**
   * 生成標籤建議
   *
   * 使用 AI 為文檔生成相關的標籤建議（3-5 個）
   * 在 Demo 模式下基於內容關鍵字生成
   *
   * @param document - 要生成標籤的文檔
   * @returns 標籤字串陣列
   *
   * @example
   * ```typescript
   * const tags = await aiService.suggestTags(document);
   * console.log('建議標籤:', tags);
   * // Output: ['React', 'Hooks', '前端開發', '狀態管理']
   * ```
   */
  async suggestTags(document: Document): Promise<string[]> {
    if (this.DEMO_MODE) {
      // 模擬模式：基於內容生成標籤
      await this.delay(500);

      const allTags = [
        '基礎',
        '進階',
        '最佳實踐',
        '教學',
        '範例',
        '效能優化',
        '架構設計',
        '實戰',
        '深入理解',
        '快速入門',
      ];

      // 隨機選擇 3-5 個標籤
      const count = 3 + Math.floor(Math.random() * 3);
      const shuffled = [...allTags].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    }

    // 真實模式：使用 Gemini API
    if (!this.model) {
      return [];
    }

    try {
      const prompt = `請為以下技術文檔建議 3-5 個相關標籤（繁體中文）：

標題：${document.title}
內容：${document.content}

只需返回標籤，用逗號分隔，不要其他說明。`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return text.split(/[,、]/).map((tag: string) => tag.trim()).filter(Boolean);
    } catch (error) {
      devLog.error('生成標籤失敗:', error);
      return [];
    }
  }

  /**
   * 清除對話歷史
   *
   * 移除所有聊天記錄，重置對話狀態
   *
   * @example
   * ```typescript
   * aiService.clearChat();
   * console.log('對話已清除');
   * ```
   */
  clearChat(): void {
    this.chatHistorySignal.set([]);
  }

  /**
   * 加入聊天訊息
   */
  private addChatMessage(role: 'user' | 'assistant', content: string, citations?: Citation[]): void {
    const message: ChatMessage = {
      id: this.generateId(),
      role,
      content,
      timestamp: new Date(),
      citations,
    };

    this.chatHistorySignal.update((history) => [...history, message]);
  }

  /**
   * 生成模擬回應
   */
  private generateMockResponse(question: string, context: Document[]): string[] {
    const lowerQuestion = question.toLowerCase();

    // 基於問題關鍵字生成回應
    if (lowerQuestion.includes('什麼') || lowerQuestion.includes('介紹')) {
      return [
        `根據知識庫內容，這是一個關於 ${context[0]?.category || '技術'} 的主題。主要涵蓋核心概念、實作方法與最佳實踐。`,
        `讓我為您解釋：這個主題涉及多個重要概念，包括基礎原理、進階應用與實戰技巧。建議您從基礎開始逐步學習。`,
      ];
    }

    if (lowerQuestion.includes('如何') || lowerQuestion.includes('怎麼')) {
      return [
        `實作步驟如下：\n1. 首先理解基本概念\n2. 閱讀相關文檔\n3. 動手實作簡單範例\n4. 深入學習進階功能`,
        `建議您參考知識庫中的相關文檔，特別是標記為「教學」和「實戰」的內容。這些文檔提供了詳細的步驟指引。`,
      ];
    }

    if (lowerQuestion.includes('比較') || lowerQuestion.includes('差異')) {
      return [
        `這兩者的主要差異在於使用場景和技術特性。前者更適合某些情況，而後者在其他場景下表現更好。`,
        `根據知識庫內容，兩者各有優劣。選擇時應考慮專案需求、團隊經驗和長期維護性。`,
      ];
    }

    // 預設回應
    return [
      `根據知識庫中的 ${context.length} 篇相關文檔，我找到了一些有用的資訊。建議您查看「${context[0]?.title || '相關文檔'}」以獲得更詳細的說明。`,
      `這是一個很好的問題！知識庫中有多篇文檔涉及這個主題。我建議從基礎概念開始，逐步深入學習。`,
      `讓我幫您整理一下：知識庫中的相關文檔提供了全面的技術指南，涵蓋理論基礎、實作範例和進階技巧。`,
    ];
  }

  /**
   * 生成帶引用的模擬回應（NotebookLM 風格）
   */
  private generateMockResponseWithCitations(question: string, context: Document[]): {
    text: string;
    citations: Citation[];
  } {
    const lowerQuestion = question.toLowerCase();
    let responseText = '';
    const citations: Citation[] = [];

    // 從 context 中選擇 2-3 個文檔作為引用來源
    const relevantDocs = context.slice(0, Math.min(3, context.length));

    // 生成引用
    relevantDocs.forEach((doc, index) => {
      citations.push({
        index: index + 1,
        documentId: doc.id,
        documentTitle: doc.title,
        snippet: doc.content.substring(0, 150) + '...',
        relevanceScore: 0.95 - index * 0.1,
        category: doc.category,
        tags: doc.tags,
      });
    });

    // 基於問題生成帶引用標記的回應
    if (lowerQuestion.includes('什麼') || lowerQuestion.includes('介紹')) {
      responseText = citations.length > 0
        ? `根據 ${citations[0].documentTitle} [1] 的說明，這是一個關於 ${context[0]?.category || '技術'} 的重要主題。\n\n主要內容包括核心概念、實作方法與最佳實踐 [1][2]。${citations.length > 2 ? `相關文檔 [3] 也提供了補充說明。` : ''}`
        : '找不到相關文檔';
    } else if (lowerQuestion.includes('如何') || lowerQuestion.includes('怎麼')) {
      responseText = citations.length > 0
        ? `根據知識庫文檔 [1]，實作步驟如下：\n\n1. 首先理解基本概念 [1]\n2. 閱讀相關文檔 [2]\n3. 動手實作簡單範例\n4. 深入學習進階功能 [${citations.length}]\n\n建議您特別參考《${citations[0].documentTitle}》[1]，其中有詳細的步驟說明。`
        : '找不到相關文檔';
    } else if (lowerQuestion.includes('比較') || lowerQuestion.includes('差異')) {
      responseText = citations.length >= 2
        ? `根據 ${citations[0].documentTitle} [1] 和 ${citations[1].documentTitle} [2]，兩者的主要差異在於：\n\n• 使用場景不同 [1]\n• 技術特性各有優勢 [2]\n• 選擇時需考慮專案需求和團隊經驗 [1][2]`
        : '找不到足夠的相關文檔進行比較';
    } else {
      // 預設回應
      responseText = citations.length > 0
        ? `根據知識庫中的相關文檔 [1]${citations.length > 1 ? `[2]` : ''}${citations.length > 2 ? `[3]` : ''}，我找到了一些有用的資訊。\n\n${citations[0].documentTitle} [1] 提供了核心概念的說明。${citations.length > 1 ? `\n${citations[1].documentTitle} [2] 則涵蓋了實作細節。` : ''}${citations.length > 2 ? `\n另外 [3] 也值得參考。` : ''}`
        : '找不到相關文檔';
    }

    return { text: responseText, citations };
  }

  /**
   * 延遲函式（用於模擬）
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * 生成唯一 ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
