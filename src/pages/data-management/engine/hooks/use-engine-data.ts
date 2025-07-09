import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getEngines } from '@/services/engine.service';
import { EngineData } from '@/types/engine.types';

/**
 * Custom Hook สำหรับจัดการข้อมูล Engine
 * รวมถึงการดึงข้อมูล, รีเฟรช และจัดการ state
 */
export const useEngineData = () => {
  const [enginesData, setEnginesData] = useState<EngineData[]>([]);
  const [loading, setLoading] = useState(true);

  // ฟังก์ชันดึงข้อมูล Engine
  const fetchEngines = async () => {
    try {
      setLoading(true);
      const response = await getEngines();
      setEnginesData(response.data);
    } catch (error) {
      console.error('Error fetching engines:', error);
      toast.error('Failed to load engine data. Using mock data.');
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันรีเฟรชข้อมูล
  const refreshData = async () => {
    try {
      setLoading(true);
      const response = await getEngines();
      setEnginesData(response.data);
    } catch (error) {
      console.error('Error refreshing engines:', error);
      toast.error('Failed to refresh engine data.');
    } finally {
      setLoading(false);
    }
  };

  // โหลดข้อมูลครั้งแรกเมื่อ component mount
  useEffect(() => {
    fetchEngines();
  }, []);

  return {
    enginesData,
    loading,
    refreshData,
    fetchEngines,
  };
}; 