import { getByText, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { OilConsumptionContent } from './oil-consumption-content';

/**
 * Unit Tests สำหรับ OilConsumptionContent Component
 * ทดสอบการแสดงผลของ component และ structure ของ DOM
 */
describe('OilConsumptionContent', () => {
  it('Should render OilConsumptionContent component', () => {
    // Arrange - เตรียมข้อมูลและ environment สำหรับการทดสอบ
    // ไม่มีข้อมูลพิเศษที่ต้องเตรียม เนื่องจาก component นี้ไม่รับ props

    // Act - ทำการ render component ที่ต้องการทดสอบ
    const { getByTestId } = render(<OilConsumptionContent />);

    // Assert - ตรวจสอบผลลัพธ์ที่คาดหวัง
    const oilConsumptionContent = getByTestId('oil-consumption-content');
    expect(oilConsumptionContent).toBeInTheDocument();
  });
}); 