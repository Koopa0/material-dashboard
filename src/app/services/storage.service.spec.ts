/**
 * StorageService 單元測試
 *
 * 測試範圍：
 * - SSR 安全性（瀏覽器 vs 伺服器環境）
 * - 物件序列化/反序列化
 * - 字串儲存
 * - 錯誤處理
 * - CRUD 操作
 */

import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;
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
      clear: (): void => {
        mockLocalStorage = {};
      },
    };

    spyOn(localStorage, 'getItem').and.callFake(localStorageMock.getItem);
    spyOn(localStorage, 'setItem').and.callFake(localStorageMock.setItem);
    spyOn(localStorage, 'removeItem').and.callFake(localStorageMock.removeItem);
    spyOn(localStorage, 'clear').and.callFake(localStorageMock.clear);

    TestBed.configureTestingModule({
      providers: [
        StorageService,
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });

    service = TestBed.inject(StorageService);
  });

  it('應該建立服務', () => {
    expect(service).toBeTruthy();
  });

  describe('物件儲存與讀取', () => {
    interface TestUser {
      id: number;
      name: string;
      email: string;
    }

    it('set() 應該成功儲存物件', () => {
      const user: TestUser = { id: 1, name: 'John', email: 'john@example.com' };
      const result = service.set('user', user);

      expect(result).toBe(true);
      expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(user));
    });

    it('get() 應該成功讀取物件並保持類型', () => {
      const user: TestUser = { id: 1, name: 'John', email: 'john@example.com' };
      mockLocalStorage['user'] = JSON.stringify(user);

      const retrieved = service.get<TestUser>('user');

      expect(retrieved).toBeTruthy();
      expect(retrieved?.id).toBe(1);
      expect(retrieved?.name).toBe('John');
      expect(retrieved?.email).toBe('john@example.com');
    });

    it('get() 應該在 key 不存在時返回 null', () => {
      const result = service.get('nonexistent');
      expect(result).toBeNull();
    });

    it('應該正確處理複雜物件', () => {
      const complexData = {
        users: [
          { id: 1, name: 'John' },
          { id: 2, name: 'Jane' },
        ],
        metadata: {
          count: 2,
          timestamp: new Date().toISOString(),
        },
      };

      service.set('complex', complexData);
      const retrieved = service.get<typeof complexData>('complex');

      expect(retrieved).toBeTruthy();
      expect(retrieved?.users.length).toBe(2);
      expect(retrieved?.metadata.count).toBe(2);
    });
  });

  describe('字串儲存與讀取', () => {
    it('setString() 應該成功儲存字串', () => {
      const result = service.setString('token', 'abc123');

      expect(result).toBe(true);
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'abc123');
    });

    it('getString() 應該成功讀取字串', () => {
      mockLocalStorage['token'] = 'abc123';

      const result = service.getString('token');

      expect(result).toBe('abc123');
    });

    it('getString() 應該在 key 不存在時返回 null', () => {
      const result = service.getString('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('刪除與清空', () => {
    it('remove() 應該刪除指定的 key', () => {
      mockLocalStorage['test'] = 'value';

      const result = service.remove('test');

      expect(result).toBe(true);
      expect(localStorage.removeItem).toHaveBeenCalledWith('test');
    });

    it('clear() 應該清空所有資料', () => {
      mockLocalStorage['key1'] = 'value1';
      mockLocalStorage['key2'] = 'value2';

      const result = service.clear();

      expect(result).toBe(true);
      expect(localStorage.clear).toHaveBeenCalled();
    });
  });

  describe('檢查存在性', () => {
    it('has() 應該正確判斷 key 是否存在', () => {
      mockLocalStorage['existing'] = 'value';

      expect(service.has('existing')).toBe(true);
      expect(service.has('nonexistent')).toBe(false);
    });
  });

  describe('錯誤處理', () => {
    it('set() 應該在發生錯誤時返回 false', () => {
      (localStorage.setItem as jasmine.Spy).and.throwError('Storage full');

      const result = service.set('test', { data: 'value' });

      expect(result).toBe(false);
    });

    it('get() 應該在解析失敗時返回 null', () => {
      mockLocalStorage['invalid'] = 'invalid json {';

      const result = service.get('invalid');

      expect(result).toBeNull();
    });
  });
});

/**
 * SSR 環境測試
 */
describe('StorageService (SSR)', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StorageService,
        { provide: PLATFORM_ID, useValue: 'server' }, // 模擬伺服器環境
      ],
    });

    service = TestBed.inject(StorageService);
  });

  it('應該建立服務', () => {
    expect(service).toBeTruthy();
  });

  it('set() 在 SSR 環境下應該返回 false', () => {
    const result = service.set('test', { data: 'value' });
    expect(result).toBe(false);
  });

  it('get() 在 SSR 環境下應該返回 null', () => {
    const result = service.get('test');
    expect(result).toBeNull();
  });

  it('setString() 在 SSR 環境下應該返回 false', () => {
    const result = service.setString('test', 'value');
    expect(result).toBe(false);
  });

  it('getString() 在 SSR 環境下應該返回 null', () => {
    const result = service.getString('test');
    expect(result).toBeNull();
  });

  it('remove() 在 SSR 環境下應該返回 false', () => {
    const result = service.remove('test');
    expect(result).toBe(false);
  });

  it('clear() 在 SSR 環境下應該返回 false', () => {
    const result = service.clear();
    expect(result).toBe(false);
  });

  it('has() 在 SSR 環境下應該返回 false', () => {
    const result = service.has('test');
    expect(result).toBe(false);
  });
});
