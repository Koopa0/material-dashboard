import { Component, input } from '@angular/core';
import { MenuItem } from '../../models/menu-item';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-menu-item',
  imports: [MatIcon, MatListModule, RouterLinkActive, RouterLink],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.scss',
})
export class MenuItemComponent {
  item = input.required<MenuItem>();

  collapseDrawer = input(false);
}
