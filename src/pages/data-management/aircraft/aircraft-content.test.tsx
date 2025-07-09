import { getByText, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AircraftContent } from './aircraft-content';

/**
 * Unit Tests สำหรับ AircraftContent Component
 * ทดสอบการแสดงผลของ component และ structure ของ DOM
 */
describe('AircraftContent', () => {
  it('Should render AircraftContent component', () => {
    // Arrange - เตรียมข้อมูลและ environment สำหรับการทดสอบ
    // ไม่มีข้อมูลพิเศษที่ต้องเตรียม เนื่องจาก component นี้ไม่รับ props

    // Act - ทำการ render component ที่ต้องการทดสอบ
    const { getByTestId } = render(<AircraftContent />);

    // Assert - ตรวจสอบผลลัพธ์ที่คาดหวัง
    const aircraftContent = getByTestId('aircraft-content');
    expect(aircraftContent).toBeInTheDocument();
  });
});
