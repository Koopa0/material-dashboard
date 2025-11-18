import { Component, computed, signal, HostListener, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { MatButtonModule } from '@angular/material/button';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import { AIChatComponent } from './components/ai-chat/ai-chat.component';
import { CommandPaletteComponent } from './components/command-palette/command-palette';

@Component({
  selector: 'app-root',
  imports: [
    MatIcon,
    MatSidenavModule,
    RouterOutlet,
    MatButtonModule,
    SidenavComponent,
    MatToolbar,
    ThemeToggleComponent,
    AIChatComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private dialog = inject(MatDialog);

  title = 'material-dashboard';

  collapseDrawer = signal<boolean>(false);

  sidenavWidth = computed(() => (this.collapseDrawer() ? '64px' : '256px'));

  /**
   * 全局快捷鍵：Ctrl+K / Cmd+K 開啟命令面板
   */
  @HostListener('window:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      this.openCommandPalette();
    }
  }

  /**
   * 開啟命令面板
   */
  openCommandPalette(): void {
    this.dialog.open(CommandPaletteComponent, {
      width: '600px',
      maxWidth: '90vw',
      panelClass: 'command-palette-dialog',
    });
  }
}
