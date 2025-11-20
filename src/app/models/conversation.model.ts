/**
 * Conversation 相關資料模型
 * NotebookLM 風格的 AI 對話系統
 */

import { Block } from './block.model';

export interface Conversation {
  id: string;
  workspaceId: string;
  sourcePageIds: string[]; // 用作對話 context 的 pages
  messages: ConversationMessage[];
  summary?: string;
  keyTopics?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationMessage {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: MessageContent;
  citations?: Citation[];
  suggestions?: FollowUpSuggestion[];
  timestamp: Date;
  usage?: TokenUsage;
}

export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}

export interface MessageContent {
  text: string;
  audioUrl?: string; // NotebookLM audio conversation
  blocks?: Block[]; // Rich content blocks
}

export interface Citation {
  index: number;
  pageId: string;
  blockId?: string;
  pageTitle: string;
  snippet: string;
  relevanceScore: number;
  highlightedText?: string;
}

export interface FollowUpSuggestion {
  id: string;
  text: string;
  icon: string;
  relatedTopics?: string[];
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

// Chat API Request/Response
export interface ChatRequest {
  workspaceId: string;
  conversationId?: string;
  message: string;
  sourcePageIds: string[];
  model?: string;
  stream?: boolean;
}

export interface ChatResponse {
  conversationId: string;
  messageId: string;
  role: MessageRole;
  content: string;
  citations: Citation[];
  suggestions: FollowUpSuggestion[];
  usage: TokenUsage;
  createdAt: Date;
}

// Streaming response types
export enum StreamEventType {
  START = 'start',
  TOKEN = 'token',
  CITATION = 'citation',
  SUGGESTION = 'suggestion',
  END = 'end',
  ERROR = 'error',
}

export interface StreamEvent {
  type: StreamEventType;
  conversationId?: string;
  messageId?: string;
  content?: string;
  citation?: Citation;
  suggestions?: FollowUpSuggestion[];
  error?: string;
}

// AI Summary
export interface SummaryRequest {
  pageId: string;
  language?: string;
  length?: SummaryLength;
}

export enum SummaryLength {
  SHORT = 'short',
  MEDIUM = 'medium',
  LONG = 'long',
}

export interface SummaryResponse {
  pageId: string;
  summary: string;
  keyPoints: string[];
  topics: string[];
  createdAt: Date;
}

// Tag Suggestions
export interface TagSuggestionRequest {
  pageId: string;
}

export interface TagSuggestion {
  name: string;
  confidence: number;
}

export interface TagSuggestionResponse {
  pageId: string;
  suggestedTags: TagSuggestion[];
}

// Audio Generation (NotebookLM feature)
export interface AudioGenerationRequest {
  pageIds: string[];
  voices?: AudioVoice[];
  duration?: AudioDuration;
}

export enum AudioVoice {
  MALE = 'male',
  FEMALE = 'female',
}

export enum AudioDuration {
  SHORT = 'short',
  MEDIUM = 'medium',
  LONG = 'long',
}

export interface AudioGenerationResponse {
  audioUrl: string;
  duration: number;
  transcript: string;
  createdAt: Date;
}

// Follow-up suggestion presets
export const DEFAULT_SUGGESTIONS: FollowUpSuggestion[] = [
  {
    id: 'explain',
    text: 'Explain this in simpler terms',
    icon: '💡',
  },
  {
    id: 'examples',
    text: 'Give me some examples',
    icon: '📝',
  },
  {
    id: 'related',
    text: 'What are related topics?',
    icon: '🔗',
  },
  {
    id: 'deeper',
    text: 'Tell me more details',
    icon: '🔍',
  },
];
