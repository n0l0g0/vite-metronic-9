/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// เครื่องมือสำหรับการตั้งค่า Vitest testing framework
export default defineConfig({
  plugins: [react()],
  test: {
    // ใช้ jsdom เป็น environment สำหรับการทดสอบ React components
    environment: 'jsdom',
    // ไฟล์สำหรับการตั้งค่าเบื้องต้นของการทดสอบ
    setupFiles: ['./src/test/setup.ts'],
    // รูปแบบของไฟล์ทดสอบ
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    // เปิดใช้งาน globals เพื่อไม่ต้อง import describe, it, expect
    globals: true,
    // ตั้งค่า coverage reporting
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        'dist/',
        'build/',
      ],
    },
  },
  resolve: {
    // ตั้งค่า alias path เหมือนใน main vite config
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}); 