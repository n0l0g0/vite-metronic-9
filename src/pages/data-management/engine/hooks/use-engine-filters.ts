import { useMemo, useState } from 'react';
import { EngineData } from '@/types/engine.types';

/**
 * Custom Hook สำหรับจัดการตัวกรองข้อมูล Engine
 * รวมถึงการค้นหา, กรองสถานะ และประเภท Engine
 */
export const useEngineFilters = (enginesData: EngineData[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);

  // ฟังก์ชันกรองข้อมูลตามเงื่อนไขต่างๆ
  const filteredData = useMemo(() => {
    let filtered = enginesData;

    // กรองตามสถานะ Active/Inactive
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((item) => {
        const status = item.active ? 'Active' : 'Inactive';
        return selectedStatuses.includes(status);
      });
    }

    // กรองตาม Model
    if (selectedModels.length > 0) {
      filtered = filtered.filter((item) => selectedModels.includes(item.model));
    }

    // กรองตามคำค้นหา (ไม่แยกพิมพ์ใหญ่เล็ก)
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.serial_number.toLowerCase().includes(searchLower) ||
          item.model.toLowerCase().includes(searchLower) ||
          item.aircraft?.registration.toLowerCase().includes(searchLower) ||
          String(item.position).toLowerCase().includes(searchLower),
      );
    }

    return filtered;
  }, [searchQuery, selectedStatuses, selectedModels, enginesData]);

  // นับจำนวนตามสถานะ
  const statusCounts = useMemo(() => {
    return enginesData.reduce(
      (acc, item) => {
        const status = item.active ? 'Active' : 'Inactive';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [enginesData]);

  // นับจำนวนตาม Model
  const modelCounts = useMemo(() => {
    return enginesData.reduce(
      (acc, item) => {
        acc[item.model] = (acc[item.model] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [enginesData]);

  // ฟังก์ชันจัดการการเปลี่ยนแปลงสถานะ
  const handleStatusChange = (checked: boolean, value: string) => {
    setSelectedStatuses((prev) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value),
    );
  };

  // ฟังก์ชันจัดการการเปลี่ยนแปลง Model
  const handleModelChange = (checked: boolean, value: string) => {
    setSelectedModels((prev) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value),
    );
  };

  // ฟังก์ชันเคลียร์ค้นหา
  const clearSearch = () => setSearchQuery('');

  return {
    // States
    searchQuery,
    selectedStatuses,
    selectedModels,

    // Computed data
    filteredData,
    statusCounts,
    modelCounts,

    // Actions
    setSearchQuery,
    handleStatusChange,
    handleModelChange,
    clearSearch,
  };
};
