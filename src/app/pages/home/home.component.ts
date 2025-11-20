import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { PageService } from '../../services/page.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  pages = computed(() => this.pageService.rootPages());

  constructor(
    private pageService: PageService,
    private router: Router
  ) {}

  async createNewPage(): Promise<void> {
    const page = await this.pageService.createPage({
      title: 'Untitled',
      icon: { type: 'emoji', emoji: '📄' },
    });

    this.router.navigate(['/editor', page.id]);
  }

  openPage(pageId: string): void {
    this.router.navigate(['/editor', pageId]);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('zh-TW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  }
}
