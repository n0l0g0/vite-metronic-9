import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';

// ตั้งค่าเบื้องต้นสำหรับการทดสอบ React components
// รวมถึงการ mock ฟังก์ชันต่างๆ ที่จำเป็น

// Mock ฟังก์ชัน matchMedia สำหรับ responsive testing
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ฟังก์ชัน ResizeObserver สำหรับการทดสอบ layout
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ฟังก์ชัน IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Setup MSW server สำหรับ Node.js environment
const server = setupServer(...handlers);

// เริ่ม server ก่อนเริ่ม tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

// Reset handlers หลังแต่ละ test
afterEach(() => {
  server.resetHandlers();
});

// ปิด server หลังจาก tests เสร็จ
afterAll(() => {
  server.close();
}); 