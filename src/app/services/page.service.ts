import { Injectable, signal, computed } from '@angular/core';
import {
  Page,
  PageTree,
  CreatePageRequest,
  UpdatePageRequest,
  PageListResponse,
  DEFAULT_EMOJIS,
  DEFAULT_GRADIENTS,
} from '../models/page.model';
import { Block, BlockType } from '../models/block.model';

@Injectable({
  providedIn: 'root',
})
export class PageService {
  // State
  private pages = signal<Page[]>([]);
  private currentPageId = signal<string | null>(null);

  // Computed
  currentPage = computed(() => {
    const id = this.currentPageId();
    if (!id) return null;
    return this.pages().find((p) => p.id === id) || null;
  });

  pageTree = computed(() => {
    return this.buildPageTree(this.pages());
  });

  rootPages = computed(() => {
    return this.pages().filter((p) => !p.parentId && !p.archived);
  });

  archivedPages = computed(() => {
    return this.pages().filter((p) => p.archived);
  });

  constructor() {
    this.initializeMockData();
  }

  // Get all pages
  getPages(): Page[] {
    return this.pages();
  }

  // Get page by ID
  getPage(id: string): Page | undefined {
    return this.pages().find((p) => p.id === id);
  }

  // Get page tree
  getPageTree(): PageTree[] {
    return this.pageTree();
  }

  // Set current page
  setCurrentPage(id: string | null): void {
    this.currentPageId.set(id);
  }

  // Create new page
  async createPage(request: CreatePageRequest): Promise<Page> {
    // TODO: Replace with API call
    const newPage: Page = {
      id: this.generateId(),
      workspaceId: 'ws_default',
      title: request.title || 'Untitled',
      icon: request.icon,
      cover: request.cover,
      blocks: request.initialBlocks || this.createDefaultBlocks(),
      properties: request.properties || {},
      parentId: request.parentId,
      hasChildren: false,
      archived: false,
      permissions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'user_1',
      lastEditedBy: 'user_1',
    };

    this.pages.update((pages) => [...pages, newPage]);

    // Update parent's hasChildren flag
    if (request.parentId) {
      this.updateParentHasChildren(request.parentId);
    }

    return newPage;
  }

  // Update page
  async updatePage(id: string, request: UpdatePageRequest): Promise<Page> {
    // TODO: Replace with API call
    this.pages.update((pages) =>
      pages.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            ...request,
            updatedAt: new Date(),
            lastEditedBy: 'user_1',
          };
        }
        return p;
      })
    );

    return this.getPage(id)!;
  }

  // Update page blocks
  updatePageBlocks(pageId: string, blocks: Block[]): void {
    this.pages.update((pages) =>
      pages.map((p) => {
        if (p.id === pageId) {
          return {
            ...p,
            blocks,
            updatedAt: new Date(),
            lastEditedBy: 'user_1',
          };
        }
        return p;
      })
    );
  }

  // Delete page (archive)
  async deletePage(id: string): Promise<void> {
    // TODO: Replace with API call
    this.pages.update((pages) =>
      pages.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            archived: true,
            archivedAt: new Date(),
            updatedAt: new Date(),
          };
        }
        return p;
      })
    );

    // Update parent's hasChildren flag
    const page = this.getPage(id);
    if (page?.parentId) {
      this.updateParentHasChildren(page.parentId);
    }
  }

  // Restore page from archive
  async restorePage(id: string): Promise<void> {
    // TODO: Replace with API call
    this.pages.update((pages) =>
      pages.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            archived: false,
            archivedAt: undefined,
            updatedAt: new Date(),
          };
        }
        return p;
      })
    );

    const page = this.getPage(id);
    if (page?.parentId) {
      this.updateParentHasChildren(page.parentId);
    }
  }

  // Move page
  async movePage(id: string, newParentId: string | null): Promise<void> {
    const page = this.getPage(id);
    if (!page) return;

    const oldParentId = page.parentId;

    this.pages.update((pages) =>
      pages.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            parentId: newParentId || undefined,
            updatedAt: new Date(),
          };
        }
        return p;
      })
    );

    // Update both old and new parent's hasChildren flags
    if (oldParentId) {
      this.updateParentHasChildren(oldParentId);
    }
    if (newParentId) {
      this.updateParentHasChildren(newParentId);
    }
  }

  // Get page children
  getPageChildren(pageId: string): Page[] {
    return this.pages().filter(
      (p) => p.parentId === pageId && !p.archived
    );
  }

  // Search pages
  searchPages(query: string): Page[] {
    const lowerQuery = query.toLowerCase();
    return this.pages().filter((p) => {
      if (p.archived) return false;
      const titleMatch = p.title.toLowerCase().includes(lowerQuery);
      const contentMatch = p.blocks.some((block) => {
        const content = JSON.stringify(block.content).toLowerCase();
        return content.includes(lowerQuery);
      });
      return titleMatch || contentMatch;
    });
  }

  // Private helpers
  private buildPageTree(pages: Page[]): PageTree[] {
    const pageMap = new Map<string, PageTree>();
    const rootPages: PageTree[] = [];

    // First pass: create all page tree nodes
    pages
      .filter((p) => !p.archived)
      .forEach((page) => {
        pageMap.set(page.id, { ...page, children: [], level: 0 });
      });

    // Second pass: build tree structure
    pages
      .filter((p) => !p.archived)
      .forEach((page) => {
        const node = pageMap.get(page.id)!;

        if (page.parentId) {
          const parent = pageMap.get(page.parentId);
          if (parent) {
            parent.children = parent.children || [];
            parent.children.push(node);
            node.level = (parent.level || 0) + 1;
          } else {
            rootPages.push(node);
          }
        } else {
          rootPages.push(node);
        }
      });

    // Sort by created date
    const sortByCreated = (a: PageTree, b: PageTree) =>
      a.createdAt.getTime() - b.createdAt.getTime();

    rootPages.sort(sortByCreated);
    pageMap.forEach((page) => {
      if (page.children && page.children.length > 0) {
        page.children.sort(sortByCreated);
      }
    });

    return rootPages;
  }

  private updateParentHasChildren(parentId: string): void {
    const children = this.getPageChildren(parentId);
    this.pages.update((pages) =>
      pages.map((p) => {
        if (p.id === parentId) {
          return {
            ...p,
            hasChildren: children.length > 0,
            updatedAt: new Date(),
          };
        }
        return p;
      })
    );
  }

  private createDefaultBlocks(): Block[] {
    return [
      {
        id: this.generateId(),
        type: BlockType.TEXT,
        content: {
          richText: [
            {
              type: 'text',
              text: { content: '' },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
            },
          ],
        },
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  private generateId(): string {
    return `page_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeMockData(): void {
    const mockPages: Page[] = [
      {
        id: 'page_1',
        workspaceId: 'ws_default',
        title: 'Getting Started',
        icon: { type: 'emoji', emoji: '🚀' },
        cover: {
          type: 'gradient',
          gradient: DEFAULT_GRADIENTS[0],
        },
        blocks: [
          {
            id: 'block_1',
            type: BlockType.HEADING_1,
            content: {
              richText: [
                {
                  type: 'text',
                  text: { content: 'Welcome to Your Knowledge Base!' },
                  annotations: {
                    bold: true,
                    italic: false,
                    strikethrough: false,
                    underline: false,
                    code: false,
                    color: 'default',
                  },
                },
              ],
            },
            order: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 'block_2',
            type: BlockType.TEXT,
            content: {
              richText: [
                {
                  type: 'text',
                  text: {
                    content:
                      'This is a Notion + NotebookLM inspired knowledge management system.',
                  },
                },
              ],
            },
            order: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 'block_3',
            type: BlockType.CALLOUT,
            content: {
              callout: {
                richText: [
                  {
                    type: 'text',
                    text: {
                      content:
                        'Try pressing "/" to see all available block types!',
                    },
                  },
                ],
                icon: { type: 'emoji', emoji: '💡' },
                color: 'blue_background',
              },
            },
            order: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        properties: {},
        parentId: undefined,
        hasChildren: false,
        archived: false,
        permissions: [],
        createdAt: new Date('2025-01-15'),
        updatedAt: new Date(),
        createdBy: 'user_1',
        lastEditedBy: 'user_1',
      },
      {
        id: 'page_2',
        workspaceId: 'ws_default',
        title: 'AI Features',
        icon: { type: 'emoji', emoji: '🤖' },
        blocks: [
          {
            id: 'block_4',
            type: BlockType.HEADING_2,
            content: {
              richText: [
                {
                  type: 'text',
                  text: { content: 'NotebookLM-Style AI Chat' },
                },
              ],
            },
            order: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 'block_5',
            type: BlockType.TEXT,
            content: {
              richText: [
                {
                  type: 'text',
                  text: {
                    content:
                      'Ask questions about your documents and get answers with citations.',
                  },
                },
              ],
            },
            order: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        properties: {},
        hasChildren: false,
        archived: false,
        permissions: [],
        createdAt: new Date('2025-01-16'),
        updatedAt: new Date(),
        createdBy: 'user_1',
        lastEditedBy: 'user_1',
      },
    ];

    this.pages.set(mockPages);
  }
}
