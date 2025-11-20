import { Injectable, signal } from '@angular/core';
import {
  Block,
  BlockType,
  CreateBlockRequest,
  UpdateBlockRequest,
  MoveBlockRequest,
  BlockContent,
} from '../models/block.model';
import { PageService } from './page.service';

@Injectable({
  providedIn: 'root',
})
export class BlockEditorService {
  // Current editing state
  private focusedBlockId = signal<string | null>(null);
  private selectedBlockIds = signal<string[]>([]);

  constructor(private pageService: PageService) {}

  // Get blocks for a page
  getPageBlocks(pageId: string): Block[] {
    const page = this.pageService.getPage(pageId);
    return page?.blocks || [];
  }

  // Get block by ID
  getBlock(pageId: string, blockId: string): Block | undefined {
    const blocks = this.getPageBlocks(pageId);
    return this.findBlockById(blocks, blockId);
  }

  // Create new block
  async createBlock(
    pageId: string,
    request: CreateBlockRequest
  ): Promise<Block> {
    // TODO: Replace with API call
    const page = this.pageService.getPage(pageId);
    if (!page) throw new Error('Page not found');

    const blocks = [...page.blocks];

    // Find insertion position
    let insertIndex = blocks.length;
    if (request.afterId) {
      const afterIndex = blocks.findIndex((b) => b.id === request.afterId);
      if (afterIndex !== -1) {
        insertIndex = afterIndex + 1;
      }
    }

    // Create new block
    const newBlock: Block = {
      id: this.generateBlockId(),
      type: request.type,
      content: request.content,
      parentId: request.parentId,
      children: request.children?.map((c) => this.createBlockFromRequest(c)) || [],
      order: insertIndex,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'user_1',
      lastEditedBy: 'user_1',
    };

    // Insert block
    blocks.splice(insertIndex, 0, newBlock);

    // Reorder blocks
    this.reorderBlocks(blocks);

    // Update page
    this.pageService.updatePageBlocks(pageId, blocks);

    return newBlock;
  }

  // Update block
  async updateBlock(
    pageId: string,
    blockId: string,
    request: UpdateBlockRequest
  ): Promise<Block> {
    // TODO: Replace with API call
    const page = this.pageService.getPage(pageId);
    if (!page) throw new Error('Page not found');

    const blocks = [...page.blocks];
    const updatedBlocks = this.updateBlockInTree(blocks, blockId, request);

    this.pageService.updatePageBlocks(pageId, updatedBlocks);

    return this.getBlock(pageId, blockId)!;
  }

  // Delete block
  async deleteBlock(pageId: string, blockId: string): Promise<void> {
    // TODO: Replace with API call
    const page = this.pageService.getPage(pageId);
    if (!page) throw new Error('Page not found');

    const blocks = [...page.blocks];
    const filteredBlocks = this.removeBlockFromTree(blocks, blockId);

    this.reorderBlocks(filteredBlocks);
    this.pageService.updatePageBlocks(pageId, filteredBlocks);
  }

  // Move block
  async moveBlock(
    pageId: string,
    blockId: string,
    request: MoveBlockRequest
  ): Promise<void> {
    // TODO: Replace with API call
    const page = this.pageService.getPage(pageId);
    if (!page) throw new Error('Page not found');

    let blocks = [...page.blocks];

    // Remove block from current position
    const block = this.findBlockById(blocks, blockId);
    if (!block) return;

    blocks = this.removeBlockFromTree(blocks, blockId);

    // Find new position
    let insertIndex = blocks.length;
    if (request.afterId) {
      const afterIndex = blocks.findIndex((b) => b.id === request.afterId);
      if (afterIndex !== -1) {
        insertIndex = afterIndex + 1;
      }
    }

    // Update block's parentId if specified
    if (request.parentId !== undefined) {
      block.parentId = request.parentId || undefined;
    }

    // Insert at new position
    blocks.splice(insertIndex, 0, block);

    // Reorder blocks
    this.reorderBlocks(blocks);

    this.pageService.updatePageBlocks(pageId, blocks);
  }

  // Duplicate block
  async duplicateBlock(pageId: string, blockId: string): Promise<Block> {
    const block = this.getBlock(pageId, blockId);
    if (!block) throw new Error('Block not found');

    const duplicated = this.duplicateBlockDeep(block);

    return this.createBlock(pageId, {
      type: duplicated.type,
      content: duplicated.content,
      parentId: duplicated.parentId,
      afterId: blockId,
    });
  }

  // Convert block type
  async convertBlockType(
    pageId: string,
    blockId: string,
    newType: BlockType
  ): Promise<Block> {
    const block = this.getBlock(pageId, blockId);
    if (!block) throw new Error('Block not found');

    // Convert content if needed
    const newContent = this.convertBlockContent(block, newType);

    return this.updateBlock(pageId, blockId, {
      type: newType,
      content: newContent,
    });
  }

  // Focus management
  setFocusedBlock(blockId: string | null): void {
    this.focusedBlockId.set(blockId);
  }

  getFocusedBlock(): string | null {
    return this.focusedBlockId();
  }

  // Selection management
  selectBlock(blockId: string, multiSelect: boolean = false): void {
    if (multiSelect) {
      const current = this.selectedBlockIds();
      if (current.includes(blockId)) {
        this.selectedBlockIds.set(current.filter((id) => id !== blockId));
      } else {
        this.selectedBlockIds.set([...current, blockId]);
      }
    } else {
      this.selectedBlockIds.set([blockId]);
    }
  }

  clearSelection(): void {
    this.selectedBlockIds.set([]);
  }

  getSelectedBlocks(): string[] {
    return this.selectedBlockIds();
  }

  // Private helpers
  private findBlockById(blocks: Block[], id: string): Block | undefined {
    for (const block of blocks) {
      if (block.id === id) return block;
      if (block.children) {
        const found = this.findBlockById(block.children, id);
        if (found) return found;
      }
    }
    return undefined;
  }

  private updateBlockInTree(
    blocks: Block[],
    blockId: string,
    update: UpdateBlockRequest
  ): Block[] {
    return blocks.map((block) => {
      if (block.id === blockId) {
        return {
          ...block,
          ...update,
          updatedAt: new Date(),
          lastEditedBy: 'user_1',
        };
      }
      if (block.children) {
        return {
          ...block,
          children: this.updateBlockInTree(block.children, blockId, update),
        };
      }
      return block;
    });
  }

  private removeBlockFromTree(blocks: Block[], blockId: string): Block[] {
    return blocks
      .filter((block) => block.id !== blockId)
      .map((block) => {
        if (block.children) {
          return {
            ...block,
            children: this.removeBlockFromTree(block.children, blockId),
          };
        }
        return block;
      });
  }

  private reorderBlocks(blocks: Block[]): void {
    blocks.forEach((block, index) => {
      block.order = index;
    });
  }

  private duplicateBlockDeep(block: Block): Block {
    return {
      ...block,
      id: this.generateBlockId(),
      children: block.children?.map((c) => this.duplicateBlockDeep(c)),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  private convertBlockContent(
    block: Block,
    newType: BlockType
  ): BlockContent {
    // Simple conversion: preserve rich text if possible
    const richText = block.content.richText;

    switch (newType) {
      case BlockType.TEXT:
      case BlockType.HEADING_1:
      case BlockType.HEADING_2:
      case BlockType.HEADING_3:
      case BlockType.BULLETED_LIST:
      case BlockType.NUMBERED_LIST:
        return { richText };

      case BlockType.TODO:
        return {
          todo: {
            richText: richText || [],
            checked: false,
          },
        };

      case BlockType.QUOTE:
        return { richText };

      case BlockType.CODE:
        return {
          code: {
            language: 'typescript',
            richText: richText || [],
          },
        };

      case BlockType.CALLOUT:
        return {
          callout: {
            richText: richText || [],
            icon: { type: 'emoji', emoji: '💡' },
            color: 'blue_background',
          },
        };

      default:
        return { richText };
    }
  }

  private createBlockFromRequest(request: CreateBlockRequest): Block {
    return {
      id: this.generateBlockId(),
      type: request.type,
      content: request.content,
      parentId: request.parentId,
      children: request.children?.map((c) => this.createBlockFromRequest(c)) || [],
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  private generateBlockId(): string {
    return `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
