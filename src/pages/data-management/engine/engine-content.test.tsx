import { getByText, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EngineContent } from './engine-content';

/**
 * Unit Tests สำหรับ EngineContent Component
 * ทดสอบการแสดงผลของ component และ structure ของ DOM
 */
describe('EngineContent', () => {
  it('Should render EngineContent component', () => {
    // Arrange - เตรียมข้อมูลและ environment สำหรับการทดสอบ
    // ไม่มีข้อมูลพิเศษที่ต้องเตรียม เนื่องจาก component นี้ไม่รับ props

    // Act - ทำการ render component ที่ต้องการทดสอบ
    const { getByTestId } = render(<EngineContent />);

    // Assert - ตรวจสอบผลลัพธ์ที่คาดหวัง
    const engineContent = getByTestId('engine-content');
    expect(engineContent).toBeInTheDocument();
  });
}); 