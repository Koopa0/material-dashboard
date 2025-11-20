/**
 * Block 相關資料模型
 * 用於 Notion 風格的 block-based 編輯器
 */

export enum BlockType {
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

export interface RichText {
  type: 'text' | 'mention' | 'equation';
  text?: {
    content: string;
    link?: { url: string };
  };
  mention?: {
    type: 'user' | 'page' | 'date';
    user?: { id: string };
    page?: { id: string };
    date?: { start: string; end?: string };
  };
  equation?: {
    expression: string;
  };
  annotations?: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: TextColor;
  };
  href?: string;
  plainText?: string;
}

export type TextColor =
  | 'default'
  | 'gray'
  | 'brown'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'red'
  | 'gray_background'
  | 'brown_background'
  | 'orange_background'
  | 'yellow_background'
  | 'green_background'
  | 'blue_background'
  | 'purple_background'
  | 'pink_background'
  | 'red_background';

export interface FileObject {
  type: 'file' | 'external';
  file?: {
    url: string;
    expiryTime?: string;
  };
  external?: {
    url: string;
  };
  name?: string;
  caption?: RichText[];
}

export interface CodeContent {
  language: string;
  richText: RichText[];
}

export interface TableContent {
  tableWidth: number;
  hasColumnHeader: boolean;
  hasRowHeader: boolean;
  rows: TableRow[];
}

export interface TableRow {
  cells: RichText[][];
}

export interface DatabaseContent {
  databaseId: string;
  viewId?: string;
}

export interface CalloutContent {
  richText: RichText[];
  icon?: {
    type: 'emoji' | 'external' | 'file';
    emoji?: string;
    external?: { url: string };
    file?: { url: string };
  };
  color?: TextColor;
}

export interface TodoContent {
  richText: RichText[];
  checked: boolean;
}

export interface ToggleContent {
  richText: RichText[];
  children?: Block[];
}

export interface BookmarkContent {
  url: string;
  caption?: RichText[];
}

export interface LinkToPageContent {
  pageId: string;
}

export interface BlockContent {
  // Text content
  richText?: RichText[];

  // Media content
  file?: FileObject;

  // Specialized content
  code?: CodeContent;
  table?: TableContent;
  database?: DatabaseContent;
  callout?: CalloutContent;
  todo?: TodoContent;
  toggle?: ToggleContent;
  bookmark?: BookmarkContent;
  linkToPage?: LinkToPageContent;

  // Simple text for divider, etc.
  text?: string;
}

export interface BlockProperties {
  [key: string]: any;
}

export interface Block {
  id: string;
  type: BlockType;
  content: BlockContent;
  properties?: BlockProperties;
  children?: Block[];
  parentId?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  lastEditedBy?: string;
}

export interface CreateBlockRequest {
  type: BlockType;
  content: BlockContent;
  parentId?: string;
  afterId?: string;
  children?: CreateBlockRequest[];
}

export interface UpdateBlockRequest {
  type?: BlockType;
  content?: BlockContent;
  properties?: BlockProperties;
}

export interface MoveBlockRequest {
  afterId?: string;
  parentId?: string;
}

// Block 類型配置
export interface BlockConfig {
  type: BlockType;
  label: string;
  icon: string;
  description?: string;
  shortcut?: string;
  group: BlockGroup;
  canHaveChildren?: boolean;
}

export enum BlockGroup {
  BASIC = 'basic',
  TEXT = 'text',
  LIST = 'list',
  MEDIA = 'media',
  EMBED = 'embed',
  ADVANCED = 'advanced',
  DATABASE = 'database',
  AI = 'ai',
}

// Block 配置列表（用於 Slash command）
export const BLOCK_CONFIGS: BlockConfig[] = [
  // Basic
  {
    type: BlockType.TEXT,
    label: 'Text',
    icon: 'subject',
    description: 'Just start writing with plain text.',
    shortcut: '',
    group: BlockGroup.BASIC,
  },
  {
    type: BlockType.HEADING_1,
    label: 'Heading 1',
    icon: 'title',
    description: 'Big section heading.',
    shortcut: '# + space',
    group: BlockGroup.TEXT,
  },
  {
    type: BlockType.HEADING_2,
    label: 'Heading 2',
    icon: 'title',
    description: 'Medium section heading.',
    shortcut: '## + space',
    group: BlockGroup.TEXT,
  },
  {
    type: BlockType.HEADING_3,
    label: 'Heading 3',
    icon: 'title',
    description: 'Small section heading.',
    shortcut: '### + space',
    group: BlockGroup.TEXT,
  },

  // Lists
  {
    type: BlockType.BULLETED_LIST,
    label: 'Bulleted list',
    icon: 'format_list_bulleted',
    description: 'Create a simple bulleted list.',
    shortcut: '- + space',
    group: BlockGroup.LIST,
  },
  {
    type: BlockType.NUMBERED_LIST,
    label: 'Numbered list',
    icon: 'format_list_numbered',
    description: 'Create a list with numbering.',
    shortcut: '1. + space',
    group: BlockGroup.LIST,
  },
  {
    type: BlockType.TODO,
    label: 'To-do list',
    icon: 'check_box',
    description: 'Track tasks with a to-do list.',
    shortcut: '[] + space',
    group: BlockGroup.LIST,
  },
  {
    type: BlockType.TOGGLE,
    label: 'Toggle list',
    icon: 'arrow_right',
    description: 'Toggles can hide and show content inside.',
    shortcut: '> + space',
    group: BlockGroup.LIST,
    canHaveChildren: true,
  },

  // Media
  {
    type: BlockType.IMAGE,
    label: 'Image',
    icon: 'image',
    description: 'Upload or embed with a link.',
    group: BlockGroup.MEDIA,
  },
  {
    type: BlockType.VIDEO,
    label: 'Video',
    icon: 'videocam',
    description: 'Upload or embed a video.',
    group: BlockGroup.MEDIA,
  },
  {
    type: BlockType.FILE,
    label: 'File',
    icon: 'attach_file',
    description: 'Upload or link to any file.',
    group: BlockGroup.MEDIA,
  },

  // Embed
  {
    type: BlockType.CODE,
    label: 'Code',
    icon: 'code',
    description: 'Capture a code snippet.',
    shortcut: '``` + space',
    group: BlockGroup.EMBED,
  },
  {
    type: BlockType.QUOTE,
    label: 'Quote',
    icon: 'format_quote',
    description: 'Capture a quote.',
    shortcut: '" + space',
    group: BlockGroup.EMBED,
  },
  {
    type: BlockType.CALLOUT,
    label: 'Callout',
    icon: 'lightbulb',
    description: 'Make writing stand out.',
    group: BlockGroup.EMBED,
  },
  {
    type: BlockType.DIVIDER,
    label: 'Divider',
    icon: 'horizontal_rule',
    description: 'Visually divide blocks.',
    shortcut: '--- + space',
    group: BlockGroup.EMBED,
  },

  // Advanced
  {
    type: BlockType.TABLE,
    label: 'Table',
    icon: 'table_chart',
    description: 'Add a table to your page.',
    group: BlockGroup.ADVANCED,
  },
  {
    type: BlockType.BOOKMARK,
    label: 'Bookmark',
    icon: 'bookmark',
    description: 'Save a link as a visual bookmark.',
    group: BlockGroup.ADVANCED,
  },
  {
    type: BlockType.LINK_TO_PAGE,
    label: 'Link to page',
    icon: 'link',
    description: 'Link to another page.',
    shortcut: '@ + page name',
    group: BlockGroup.ADVANCED,
  },

  // AI
  {
    type: BlockType.AI_SUMMARY,
    label: 'AI Summary',
    icon: 'auto_awesome',
    description: 'Generate AI summary.',
    group: BlockGroup.AI,
  },
];
