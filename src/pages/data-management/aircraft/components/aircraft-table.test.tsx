import { getByText, render, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useAircraftData } from '../hooks';
import { AircraftTable } from './aircraft-table';

/**
 * Unit Tests สำหรับ AircraftTable Component
 * ทดสอบการแสดงผลของ component และ structure ของ DOM
 */
describe('AircraftTable', () => {
  it('Should render AircraftTable component', async () => {
    // Act
    const { result } = renderHook(() => useAircraftData());

    // Assert 
    expect(result.current.loading).toBe(true);
    expect(result.current.aircraftsData).toEqual([]);

    // รอให้ API call เสร็จสิ้น
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 1000 });

    expect(result.current.aircraftsData).toHaveLength(1);
    expect(result.current.aircraftsData[0].registration).toBe('HS-ABC');

    // Table ควรแสดงข้อมูลที่ดึงมาจาก API
    const { getByText } = render(<AircraftTable />);
    await waitFor(() => {
      const aircraftTable = getByText('HS-ABC');
      expect(aircraftTable).toBeDefined();
    }, { timeout: 1000 });
  });
});
