import { useMemo, useState } from 'react';
import { AircraftData } from '@/types/aircraft.types';

/**
 * Custom Hook สำหรับจัดการตัวกรองข้อมูล Aircraft
 * รวมถึงการค้นหา, กรองสถานะ และประเภทเครื่องบิน
 */
export const useAircraftFilters = (aircraftsData: AircraftData[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedAircraftTypes, setSelectedAircraftTypes] = useState<string[]>(
    [],
  );

  // ฟังก์ชันกรองข้อมูลตามเงื่อนไขต่างๆ
  const filteredData = useMemo(() => {
    let filtered = aircraftsData;

    // กรองตามสถานะ Active/Inactive
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((item) => {
        const status = item.active ? 'Active' : 'Inactive';
        return selectedStatuses.includes(status);
      });
    }

    // กรองตามประเภทเครื่องบิน
    if (selectedAircraftTypes.length > 0) {
      filtered = filtered.filter((item) =>
        selectedAircraftTypes.includes(item.aircraft_type),
      );
    }

    // กรองตามคำค้นหา (ไม่แยกพิมพ์ใหญ่เล็ก)
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.registration.toLowerCase().includes(searchLower) ||
          item.aircraft_type.toLowerCase().includes(searchLower) ||
          item.engine_type.toLowerCase().includes(searchLower),
      );
    }

    return filtered;
  }, [searchQuery, selectedStatuses, selectedAircraftTypes, aircraftsData]);

  // นับจำนวนตามสถานะ
  const statusCounts = useMemo(() => {
    return aircraftsData.reduce(
      (acc, item) => {
        const status = item.active ? 'Active' : 'Inactive';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [aircraftsData]);

  // นับจำนวนตามประเภทเครื่องบิน
  const aircraftTypeCounts = useMemo(() => {
    return aircraftsData.reduce(
      (acc, item) => {
        acc[item.aircraft_type] = (acc[item.aircraft_type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [aircraftsData]);

  // ฟังก์ชันจัดการการเปลี่ยนแปลงสถานะ
  const handleStatusChange = (checked: boolean, value: string) => {
    setSelectedStatuses((prev) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value),
    );
  };

  // ฟังก์ชันจัดการการเปลี่ยนแปลงประเภทเครื่องบิน
  const handleAircraftTypeChange = (checked: boolean, value: string) => {
    setSelectedAircraftTypes((prev) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value),
    );
  };

  // ฟังก์ชันเคลียร์ค้นหา
  const clearSearch = () => setSearchQuery('');

  return {
    // States
    searchQuery,
    selectedStatuses,
    selectedAircraftTypes,

    // Computed data
    filteredData,
    statusCounts,
    aircraftTypeCounts,

    // Actions
    setSearchQuery,
    handleStatusChange,
    handleAircraftTypeChange,
    clearSearch,
  };
};
