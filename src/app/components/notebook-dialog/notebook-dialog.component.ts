import { Component, inject, signal, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NotebookService } from '../../services/notebook.service';
import {
  Notebook,
  NotebookColor,
  NotebookIcon,
  NotebookColorMap,
  NotebookIconLabel,
} from '../../models/notebook.model';

export interface NotebookDialogData {
  notebook?: Notebook; // 如果是編輯模式，傳入現有 Notebook
  mode: 'create' | 'edit';
}

@Component({
  selector: 'app-notebook-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './notebook-dialog.component.html',
  styleUrl: './notebook-dialog.component.scss',
})
export class NotebookDialogComponent {
  private dialogRef = inject(MatDialogRef<NotebookDialogComponent>);
  private notebookService = inject(NotebookService);

  /** 對話框數據 */
  data: NotebookDialogData = inject(MAT_DIALOG_DATA);

  /** 表單數據 */
  name = signal<string>(this.data.notebook?.name || '');
  description = signal<string>(this.data.notebook?.description || '');
  selectedColor = signal<NotebookColor>(
    this.data.notebook?.color || NotebookColor.BLUE
  );
  selectedIcon = signal<NotebookIcon>(
    this.data.notebook?.icon || NotebookIcon.FOLDER
  );

  /** 所有可用顏色 */
  colors = Object.values(NotebookColor);

  /** 所有可用圖示 */
  icons = Object.values(NotebookIcon);

  /** 顏色映射 */
  colorMap = NotebookColorMap;

  /** 圖示標籤 */
  iconLabel = NotebookIconLabel;

  /** 是否為編輯模式 */
  get isEditMode(): boolean {
    return this.data.mode === 'edit';
  }

  /** 標題 */
  get title(): string {
    return this.isEditMode ? '編輯 Notebook' : '新增 Notebook';
  }

  /** 選擇顏色 */
  selectColor(color: NotebookColor): void {
    this.selectedColor.set(color);
  }

  /** 選擇圖示 */
  selectIcon(icon: NotebookIcon): void {
    this.selectedIcon.set(icon);
  }

  /** 取得顏色 CSS 值 */
  getColorValue(color: NotebookColor): string {
    return this.colorMap[color];
  }

  /** 取得圖示標籤 */
  getIconLabel(icon: NotebookIcon): string {
    return this.iconLabel[icon];
  }

  /** 儲存 */
  save(): void {
    const name = this.name().trim();
    if (!name) {
      return;
    }

    if (this.isEditMode && this.data.notebook) {
      // 編輯模式
      this.notebookService.updateNotebook(this.data.notebook.id, {
        name,
        description: this.description().trim() || undefined,
        color: this.selectedColor(),
        icon: this.selectedIcon(),
      });
    } else {
      // 新增模式
      this.notebookService.createNotebook({
        name,
        description: this.description().trim() || undefined,
        color: this.selectedColor(),
        icon: this.selectedIcon(),
      });
    }

    this.dialogRef.close(true);
  }

  /** 取消 */
  cancel(): void {
    this.dialogRef.close(false);
  }
}
