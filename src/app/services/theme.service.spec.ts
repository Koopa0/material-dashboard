/**
 * ThemeService 單元測試
 *
 * 測試範圍：
 * - 主題初始化
 * - 主題切換功能
 * - localStorage 持久化
 * - SSR 環境兼容性
 */

import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { ThemeService, Theme } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let localStorageSpy: jasmine.SpyObj<Storage>;

  beforeEach(() => {
    // 模擬 localStorage
    localStorageSpy = jasmine.createSpyObj('localStorage', ['getItem', 'setItem', 'removeItem']);

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: PLATFORM_ID, useValue: 'browser' }, // 模擬瀏覽器環境
      ],
    });

    // 注入 localStorage spy
    spyOn(window, 'localStorage' as never).and.returnValue(localStorageSpy as never);

    service = TestBed.inject(ThemeService);
  });

  it('應該建立服務', () => {
    expect(service).toBeTruthy();
  });

  describe('初始化', () => {
    it('應該使用淺色主題作為預設值', () => {
      const theme = service.theme();
      expect(theme).toBe('light');
    });

    it('isDark() 應該正確判斷深色主題', () => {
      expect(service.isDark()).toBe(false);
      service.setTheme('dark');
      expect(service.isDark()).toBe(true);
    });
  });

  describe('主題切換', () => {
    it('toggleTheme() 應該在淺色和深色之間切換', () => {
      // 預設是淺色
      expect(service.theme()).toBe('light');

      // 切換到深色
      service.toggleTheme();
      expect(service.theme()).toBe('dark');

      // 再切換回淺色
      service.toggleTheme();
      expect(service.theme()).toBe('light');
    });

    it('setTheme() 應該設定特定主題', () => {
      service.setTheme('dark');
      expect(service.theme()).toBe('dark');

      service.setTheme('light');
      expect(service.theme()).toBe('light');
    });
  });

  describe('主題顏色', () => {
    it('getThemeColors() 應該返回淺色主題的顏色', () => {
      service.setTheme('light');
      const colors = service.getThemeColors();

      expect(colors.primary).toBe('#8b5cf6'); // Gemini 紫色
      expect(colors.background).toBe('#ffffff');
      expect(colors.onBackground).toBe('#1e293b');
    });

    it('getThemeColors() 應該返回深色主題的顏色', () => {
      service.setTheme('dark');
      const colors = service.getThemeColors();

      expect(colors.primary).toBe('#a78bfa'); // Gemini 紫色（深色版）
      expect(colors.background).toBe('#000000'); // True-black
      expect(colors.onBackground).toBe('#ffffff');
    });

    it('getThemeColors() 應該包含漸層色彩', () => {
      const lightColors = service.getThemeColors();
      expect(lightColors.gradient).toContain('linear-gradient');
      expect(lightColors.gradient).toContain('#8b5cf6'); // 紫色
      expect(lightColors.gradient).toContain('#ec4899'); // 粉色
      expect(lightColors.gradient).toContain('#3b82f6'); // 藍色
    });
  });

  describe('響應式行為', () => {
    it('主題變更應該觸發 signal 更新', () => {
      const initialTheme = service.theme();
      expect(initialTheme).toBe('light');

      service.toggleTheme();
      const updatedTheme = service.theme();
      expect(updatedTheme).toBe('dark');
      expect(updatedTheme).not.toBe(initialTheme);
    });
  });
});

/**
 * SSR 環境測試
 */
describe('ThemeService (SSR)', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: PLATFORM_ID, useValue: 'server' }, // 模擬伺服器環境
      ],
    });

    service = TestBed.inject(ThemeService);
  });

  it('在 SSR 環境下應該使用預設淺色主題', () => {
    expect(service.theme()).toBe('light');
  });

  it('在 SSR 環境下應該能夠設定主題（但不會持久化）', () => {
    service.setTheme('dark');
    expect(service.theme()).toBe('dark');
  });
});
