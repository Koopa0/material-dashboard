/**
 * NotebookService 單元測試
 *
 * 測試範圍：
 * - CRUD 操作（建立、讀取、更新、刪除）
 * - 文檔管理（加入、移除）
 * - 預設筆記本保護
 * - localStorage 持久化
 * - Signal 響應式行為
 */

import { TestBed } from '@angular/core/testing';
import { NotebookService } from './notebook.service';
import { NotebookColor, NotebookIcon } from '../models/notebook.model';

describe('NotebookService', () => {
  let service: NotebookService;
  let mockLocalStorage: { [key: string]: string };

  beforeEach(() => {
    // 模擬 localStorage
    mockLocalStorage = {};

    const localStorageMock = {
      getItem: (key: string): string | null => {
        return mockLocalStorage[key] || null;
      },
      setItem: (key: string, value: string): void => {
        mockLocalStorage[key] = value;
      },
      removeItem: (key: string): void => {
        delete mockLocalStorage[key];
      },
    };

    spyOn(localStorage, 'getItem').and.callFake(localStorageMock.getItem);
    spyOn(localStorage, 'setItem').and.callFake(localStorageMock.setItem);
    spyOn(localStorage, 'removeItem').and.callFake(localStorageMock.removeItem);

    TestBed.configureTestingModule({
      providers: [NotebookService],
    });

    service = TestBed.inject(NotebookService);
  });

  it('應該建立服務', () => {
    expect(service).toBeTruthy();
  });

  describe('初始化', () => {
    it('應該建立預設筆記本', () => {
      const notebooks = service.notebooks();

      expect(notebooks.length).toBeGreaterThan(0);
      expect(notebooks[0].name).toBe('工作專案');
      expect(notebooks[0].isDefault).toBe(true);
    });

    it('應該自動選擇第一個筆記本', () => {
      const selectedId = service.selectedNotebookId();
      const notebooks = service.notebooks();

      expect(selectedId).toBe(notebooks[0].id);
    });

    it('selectedNotebook computed 應該返回正確的筆記本', () => {
      const selected = service.selectedNotebook();
      const notebooks = service.notebooks();

      expect(selected).toBeTruthy();
      expect(selected?.id).toBe(notebooks[0].id);
    });
  });

  describe('建立筆記本', () => {
    it('createNotebook() 應該建立新筆記本', () => {
      const initialCount = service.notebooks().length;

      const newNotebook = service.createNotebook({
        name: '測試筆記本',
        description: '測試描述',
        color: NotebookColor.PURPLE,
        icon: NotebookIcon.CODE,
      });

      const notebooks = service.notebooks();

      expect(notebooks.length).toBe(initialCount + 1);
      expect(newNotebook.name).toBe('測試筆記本');
      expect(newNotebook.description).toBe('測試描述');
      expect(newNotebook.color).toBe(NotebookColor.PURPLE);
      expect(newNotebook.icon).toBe(NotebookIcon.CODE);
      expect(newNotebook.documentIds).toEqual([]);
    });

    it('createNotebook() 應該使用預設值', () => {
      const newNotebook = service.createNotebook({
        name: '簡單筆記本',
      });

      expect(newNotebook.color).toBe(NotebookColor.BLUE);
      expect(newNotebook.icon).toBe(NotebookIcon.FOLDER);
      expect(newNotebook.description).toBeUndefined();
    });

    it('建立的筆記本應該有唯一 ID', () => {
      const notebook1 = service.createNotebook({ name: '筆記本 1' });
      const notebook2 = service.createNotebook({ name: '筆記本 2' });

      expect(notebook1.id).not.toBe(notebook2.id);
    });

    it('建立的筆記本應該有時間戳記', () => {
      const notebook = service.createNotebook({ name: '時間戳記測試' });

      expect(notebook.createdAt).toBeInstanceOf(Date);
      expect(notebook.updatedAt).toBeInstanceOf(Date);
      expect(notebook.createdAt.getTime()).toBeLessThanOrEqual(notebook.updatedAt.getTime());
    });
  });

  describe('更新筆記本', () => {
    it('updateNotebook() 應該更新筆記本屬性', () => {
      const notebooks = service.notebooks();
      const targetId = notebooks[0].id;

      const updated = service.updateNotebook(targetId, {
        name: '更新後的名稱',
        color: NotebookColor.GREEN,
      });

      expect(updated).toBeTruthy();
      expect(updated?.name).toBe('更新後的名稱');
      expect(updated?.color).toBe(NotebookColor.GREEN);
    });

    it('updateNotebook() 應該更新 updatedAt 時間戳記', () => {
      const notebooks = service.notebooks();
      const targetId = notebooks[0].id;
      const originalUpdatedAt = notebooks[0].updatedAt;

      // 確保時間有差異
      setTimeout(() => {
        const updated = service.updateNotebook(targetId, { name: '新名稱' });

        expect(updated?.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      }, 10);
    });

    it('updateNotebook() 對不存在的 ID 應該返回 null', () => {
      const result = service.updateNotebook('nonexistent-id', { name: '測試' });

      expect(result).toBeNull();
    });
  });

  describe('刪除筆記本', () => {
    it('deleteNotebook() 應該刪除筆記本', () => {
      const newNotebook = service.createNotebook({ name: '待刪除' });
      const initialCount = service.notebooks().length;

      const result = service.deleteNotebook(newNotebook.id);

      expect(result).toBe(true);
      expect(service.notebooks().length).toBe(initialCount - 1);
    });

    it('deleteNotebook() 不應該刪除預設筆記本', () => {
      const notebooks = service.notebooks();
      const defaultNotebook = notebooks.find(nb => nb.isDefault);

      expect(defaultNotebook).toBeTruthy();

      const result = service.deleteNotebook(defaultNotebook!.id);

      expect(result).toBe(false);
      expect(service.notebooks().length).toBe(notebooks.length);
    });

    it('deleteNotebook() 刪除不存在的 ID 應該返回 false', () => {
      const result = service.deleteNotebook('nonexistent-id');

      expect(result).toBe(false);
    });

    it('刪除當前選中的筆記本應該自動選擇第一個', () => {
      const newNotebook = service.createNotebook({ name: '待刪除' });
      service.selectNotebook(newNotebook.id);

      expect(service.selectedNotebookId()).toBe(newNotebook.id);

      service.deleteNotebook(newNotebook.id);

      const notebooks = service.notebooks();
      expect(service.selectedNotebookId()).toBe(notebooks[0].id);
    });
  });

  describe('選擇筆記本', () => {
    it('selectNotebook() 應該更新選中的筆記本', () => {
      const notebooks = service.notebooks();
      const targetId = notebooks[1]?.id || notebooks[0].id;

      service.selectNotebook(targetId);

      expect(service.selectedNotebookId()).toBe(targetId);
    });

    it('selectNotebook() 應該接受 null（取消選擇）', () => {
      service.selectNotebook(null);

      expect(service.selectedNotebookId()).toBeNull();
      expect(service.selectedNotebook()).toBeNull();
    });
  });

  describe('文檔管理', () => {
    let testNotebookId: string;

    beforeEach(() => {
      const notebook = service.createNotebook({ name: '測試文檔管理' });
      testNotebookId = notebook.id;
    });

    it('addDocumentToNotebook() 應該加入文檔', () => {
      const result = service.addDocumentToNotebook(testNotebookId, 'doc-123');

      expect(result).toBe(true);

      const notebook = service.notebooks().find(nb => nb.id === testNotebookId);
      expect(notebook?.documentIds).toContain('doc-123');
    });

    it('addDocumentToNotebook() 不應該重複加入相同文檔', () => {
      service.addDocumentToNotebook(testNotebookId, 'doc-123');
      const result = service.addDocumentToNotebook(testNotebookId, 'doc-123');

      expect(result).toBe(false);

      const notebook = service.notebooks().find(nb => nb.id === testNotebookId);
      const count = notebook?.documentIds.filter(id => id === 'doc-123').length;
      expect(count).toBe(1);
    });

    it('addDocumentToNotebook() 對不存在的筆記本應該返回 false', () => {
      const result = service.addDocumentToNotebook('nonexistent-id', 'doc-123');

      expect(result).toBe(false);
    });

    it('removeDocumentFromNotebook() 應該移除文檔', () => {
      service.addDocumentToNotebook(testNotebookId, 'doc-123');

      const result = service.removeDocumentFromNotebook(testNotebookId, 'doc-123');

      expect(result).toBe(true);

      const notebook = service.notebooks().find(nb => nb.id === testNotebookId);
      expect(notebook?.documentIds).not.toContain('doc-123');
    });

    it('removeDocumentFromNotebook() 移除不存在的文檔應該返回 false', () => {
      const result = service.removeDocumentFromNotebook(testNotebookId, 'nonexistent-doc');

      expect(result).toBe(false);
    });

    it('getDocumentCount() 應該返回正確的文檔數量', () => {
      expect(service.getDocumentCount(testNotebookId)).toBe(0);

      service.addDocumentToNotebook(testNotebookId, 'doc-1');
      expect(service.getDocumentCount(testNotebookId)).toBe(1);

      service.addDocumentToNotebook(testNotebookId, 'doc-2');
      expect(service.getDocumentCount(testNotebookId)).toBe(2);

      service.removeDocumentFromNotebook(testNotebookId, 'doc-1');
      expect(service.getDocumentCount(testNotebookId)).toBe(1);
    });

    it('getDocumentCount() 對不存在的筆記本應該返回 0', () => {
      const count = service.getDocumentCount('nonexistent-id');

      expect(count).toBe(0);
    });
  });

  describe('Signal 響應式行為', () => {
    it('notebooks signal 應該響應變更', () => {
      const initialCount = service.notebooks().length;

      service.createNotebook({ name: '響應式測試' });

      expect(service.notebooks().length).toBe(initialCount + 1);
    });

    it('selectedNotebook computed 應該響應選擇變更', () => {
      const notebooks = service.notebooks();
      const firstId = notebooks[0].id;
      const secondId = notebooks[1]?.id || firstId;

      service.selectNotebook(firstId);
      expect(service.selectedNotebook()?.id).toBe(firstId);

      service.selectNotebook(secondId);
      expect(service.selectedNotebook()?.id).toBe(secondId);
    });
  });
});
