import { useEffect, useMemo, useState } from 'react';
import { OilConsumptionData } from '@/types/oil-consumption.types';

/**
 * Custom Hook สำหรับจัดการตัวกรองข้อมูล Oil Consumption
 * รวมถึงการค้นหา, กรองตาม Engine และวันที่
 */
export const useOilConsumptionFilters = (
  oilConsumptionsData: OilConsumptionData[] = [], 
  initialEngineId?: string
) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEngines, setSelectedEngines] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: '',
  });

  // ตั้งค่า initial filter สำหรับ engine ถ้ามี engineId ส่งมา
  useEffect(() => {
    if (initialEngineId && oilConsumptionsData && Array.isArray(oilConsumptionsData) && oilConsumptionsData.length > 0) {
      const targetEngine = oilConsumptionsData.find(
        (item) => String(item.engine?.id) === String(initialEngineId)
      );
      if (targetEngine && targetEngine.engine?.serial_number) {
        setSelectedEngines([targetEngine.engine.serial_number]);
      }
    }
  }, [initialEngineId, oilConsumptionsData]);

  // ฟังก์ชันกรองข้อมูลตามเงื่อนไขต่างๆ
  const filteredData = useMemo(() => {
    if (!oilConsumptionsData || !Array.isArray(oilConsumptionsData)) {
      return [];
    }

    let filtered = oilConsumptionsData;

    // กรองตาม Engine
    if (selectedEngines.length > 0) {
      filtered = filtered.filter((item) =>
        selectedEngines.includes(item.engine?.serial_number || ''),
      );
    }

    // กรองตามช่วงวันที่
    if (dateRange.start && dateRange.end) {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    // กรองตามคำค้นหา (ไม่แยกพิมพ์ใหญ่เล็ก)
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.engine?.serial_number.toLowerCase().includes(searchLower) ||
          item.engine?.aircraft?.registration.toLowerCase().includes(searchLower) ||
          item.remarks.toLowerCase().includes(searchLower) ||
          String(item.oil_added).includes(searchLower) ||
          String(item.flight_hours).includes(searchLower),
      );
    }

    return filtered;
  }, [searchQuery, selectedEngines, dateRange, oilConsumptionsData]);

  // นับจำนวนตาม Engine
  const engineCounts = useMemo(() => {
    if (!oilConsumptionsData || !Array.isArray(oilConsumptionsData)) {
      return {};
    }

    return oilConsumptionsData.reduce(
      (acc, item) => {
        const engineSerial = item.engine?.serial_number || 'Unknown';
        acc[engineSerial] = (acc[engineSerial] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [oilConsumptionsData]);

  // ฟังก์ชันจัดการการเปลี่ยนแปลง Engine
  const handleEngineChange = (checked: boolean, value: string) => {
    setSelectedEngines((prev) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value),
    );
  };

  // ฟังก์ชันจัดการการเปลี่ยนแปลงช่วงวันที่
  const handleDateRangeChange = (start: string, end: string) => {
    setDateRange({ start, end });
  };

  // ฟังก์ชันเคลียร์ค้นหา
  const clearSearch = () => setSearchQuery('');

  // ฟังก์ชันเคลียร์ทุก Filter
  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedEngines([]);
    setDateRange({ start: '', end: '' });
  };

  return {
    // States
    searchQuery,
    selectedEngines,
    dateRange,

    // Computed data
    filteredData,
    engineCounts,

    // Actions
    setSearchQuery,
    handleEngineChange,
    handleDateRangeChange,
    clearSearch,
    clearAllFilters,
  };
}; 