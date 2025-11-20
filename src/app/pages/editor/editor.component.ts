import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';

import { PageService } from '../../services/page.service';
import { BlockEditorService } from '../../services/block-editor.service';
import { Page } from '../../models/page.model';
import { Block, BlockType, BLOCK_CONFIGS } from '../../models/block.model';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule,
  ],
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
  pageId = signal<string | null>(null);
  page = computed(() => {
    const id = this.pageId();
    return id ? this.pageService.getPage(id) : null;
  });

  blocks = computed(() => this.page()?.blocks || []);

  showSlashMenu = signal(false);
  slashMenuPosition = signal({ top: 0, left: 0 });
  slashMenuFilter = signal('');

  filteredBlockConfigs = computed(() => {
    const filter = this.slashMenuFilter().toLowerCase();
    if (!filter) return BLOCK_CONFIGS;
    return BLOCK_CONFIGS.filter(
      (config) =>
        config.label.toLowerCase().includes(filter) ||
        config.description?.toLowerCase().includes(filter)
    );
  });

  BlockType = BlockType;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pageService: PageService,
    private blockEditorService: BlockEditorService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.pageId.set(id);
        this.pageService.setCurrentPage(id);
      }
    });
  }

  // Page title methods
  updateTitle(newTitle: string): void {
    const id = this.pageId();
    if (!id) return;

    this.pageService.updatePage(id, { title: newTitle });
  }

  // Block methods
  async addBlock(type: BlockType, afterBlockId?: string): Promise<void> {
    const id = this.pageId();
    if (!id) return;

    await this.blockEditorService.createBlock(id, {
      type,
      content: this.getDefaultBlockContent(type),
      afterId: afterBlockId,
    });

    this.showSlashMenu.set(false);
  }

  async updateBlock(blockId: string, content: string): Promise<void> {
    const id = this.pageId();
    if (!id) return;

    await this.blockEditorService.updateBlock(id, blockId, {
      content: {
        richText: [
          {
            type: 'text',
            text: { content },
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
    });
  }

  async deleteBlock(blockId: string): Promise<void> {
    const id = this.pageId();
    if (!id) return;

    await this.blockEditorService.deleteBlock(id, blockId);
  }

  async convertBlockType(blockId: string, newType: BlockType): Promise<void> {
    const id = this.pageId();
    if (!id) return;

    await this.blockEditorService.convertBlockType(id, blockId, newType);
  }

  // Slash menu
  handleInput(event: Event, blockId: string): void {
    const target = event.target as HTMLDivElement;
    const text = target.textContent || '';

    // Check for slash command
    if (text === '/') {
      const rect = target.getBoundingClientRect();
      this.slashMenuPosition.set({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
      this.slashMenuFilter.set('');
      this.showSlashMenu.set(true);
    } else if (text.startsWith('/') && this.showSlashMenu()) {
      this.slashMenuFilter.set(text.substring(1));
    } else if (this.showSlashMenu()) {
      this.showSlashMenu.set(false);
    }

    // Auto-save content
    this.updateBlock(blockId, text);
  }

  handleKeyDown(event: KeyboardEvent, blockId: string): void {
    const target = event.target as HTMLDivElement;
    const text = target.textContent || '';

    // Enter key
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();

      if (this.showSlashMenu()) {
        // Select first option from slash menu
        const first = this.filteredBlockConfigs()[0];
        if (first) {
          this.addBlock(first.type, blockId);
          target.textContent = '';
        }
      } else {
        // Create new text block
        this.addBlock(BlockType.TEXT, blockId);
      }
    }

    // Backspace on empty block
    if (event.key === 'Backspace' && !text) {
      event.preventDefault();
      this.deleteBlock(blockId);
    }

    // Escape closes slash menu
    if (event.key === 'Escape') {
      this.showSlashMenu.set(false);
    }

    // Markdown shortcuts
    if (event.key === ' ' && !this.showSlashMenu()) {
      if (text === '#') {
        event.preventDefault();
        this.convertBlockType(blockId, BlockType.HEADING_1);
        target.textContent = '';
      } else if (text === '##') {
        event.preventDefault();
        this.convertBlockType(blockId, BlockType.HEADING_2);
        target.textContent = '';
      } else if (text === '###') {
        event.preventDefault();
        this.convertBlockType(blockId, BlockType.HEADING_3);
        target.textContent = '';
      } else if (text === '-' || text === '*') {
        event.preventDefault();
        this.convertBlockType(blockId, BlockType.BULLETED_LIST);
        target.textContent = '';
      } else if (text === '1.') {
        event.preventDefault();
        this.convertBlockType(blockId, BlockType.NUMBERED_LIST);
        target.textContent = '';
      } else if (text === '[]') {
        event.preventDefault();
        this.convertBlockType(blockId, BlockType.TODO);
        target.textContent = '';
      } else if (text === '>') {
        event.preventDefault();
        this.convertBlockType(blockId, BlockType.QUOTE);
        target.textContent = '';
      } else if (text === '```') {
        event.preventDefault();
        this.convertBlockType(blockId, BlockType.CODE);
        target.textContent = '';
      }
    }
  }

  selectSlashCommand(type: BlockType, blockId: string): void {
    const target = document.querySelector(`[data-block-id="${blockId}"]`) as HTMLDivElement;
    if (target) {
      target.textContent = '';
    }
    this.addBlock(type, blockId);
  }

  // Helper methods
  getBlockContent(block: Block): string {
    if (block.content.richText && block.content.richText.length > 0) {
      return block.content.richText.map((rt) => rt.text?.content || '').join('');
    }
    if (block.content.todo) {
      return block.content.todo.richText.map((rt) => rt.text?.content || '').join('');
    }
    if (block.content.code) {
      return block.content.code.richText.map((rt) => rt.text?.content || '').join('');
    }
    if (block.content.callout) {
      return block.content.callout.richText.map((rt) => rt.text?.content || '').join('');
    }
    return '';
  }

  getDefaultBlockContent(type: BlockType): any {
    switch (type) {
      case BlockType.TODO:
        return { todo: { richText: [], checked: false } };
      case BlockType.CODE:
        return { code: { language: 'typescript', richText: [] } };
      case BlockType.CALLOUT:
        return {
          callout: {
            richText: [],
            icon: { type: 'emoji', emoji: '💡' },
            color: 'blue_background',
          },
        };
      case BlockType.DIVIDER:
        return { text: '---' };
      default:
        return { richText: [] };
    }
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }
}
