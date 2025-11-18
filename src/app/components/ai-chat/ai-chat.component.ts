/**
 * AI 聊天組件
 *
 * Sprint 4: 提供浮動式 AI 問答助手
 * 用戶可以詢問知識庫相關問題，AI 會根據文檔內容回答
 */
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AIService, ChatMessage } from '../../services/ai.service';
import { KnowledgeBaseService } from '../../services/knowledge-base.service';

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './ai-chat.component.html',
  styleUrl: './ai-chat.component.scss',
})
export class AIChatComponent {
  /** AI 服務 */
  aiService = inject(AIService);

  /** 知識庫服務 */
  knowledgeBase = inject(KnowledgeBaseService);

  /** 是否展開聊天窗口 */
  isExpanded = signal<boolean>(false);

  /** 用戶輸入 */
  userInput = signal<string>('');

  /** 聊天記錄 */
  chatHistory = computed(() => this.aiService.chatHistory());

  /** 是否正在處理 */
  isProcessing = computed(() => this.aiService.isProcessing());

  /** 是否啟用 */
  isEnabled = computed(() => this.aiService.isEnabled());

  /**
   * 切換聊天窗口
   */
  toggleChat(): void {
    this.isExpanded.update((expanded) => !expanded);
  }

  /**
   * 發送訊息
   */
  async sendMessage(): Promise<void> {
    const question = this.userInput().trim();
    if (!question || this.isProcessing()) return;

    // 清空輸入
    this.userInput.set('');

    // 取得相關文檔作為上下文
    const context = this.knowledgeBase.documents().slice(0, 10);

    // 調用 AI 服務
    await this.aiService.askQuestion(question, context);

    // 自動滾動到底部
    setTimeout(() => this.scrollToBottom(), 100);
  }

  /**
   * 清除聊天記錄
   */
  clearChat(): void {
    this.aiService.clearChat();
  }

  /**
   * 快速問題範例
   */
  readonly quickQuestions = [
    'Angular Signals 是什麼？',
    '如何使用 Rust 所有權系統？',
    'Gemini API 有哪些功能？',
    '微服務架構的優缺點？',
  ];

  /**
   * 使用快速問題
   */
  useQuickQuestion(question: string): void {
    this.userInput.set(question);
    this.sendMessage();
  }

  /**
   * 滾動到底部
   */
  private scrollToBottom(): void {
    const chatMessages = document.querySelector('.chat-messages');
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  /**
   * 處理 Enter 鍵
   */
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}
