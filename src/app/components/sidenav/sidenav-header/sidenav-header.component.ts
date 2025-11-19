import { Component, computed, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-sidenav-header',
  imports: [],
  templateUrl: './sidenav-header.component.html',
  styleUrl: './sidenav-header.component.scss',
  // Angular v20 性能優化：使用 OnPush 變更檢測策略
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavHeaderComponent {
  collapseDrawer = input(false);

  profilePicSize = computed(() => (this.collapseDrawer() ? '32' : '100'));
}
