import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getOilConsumptions, getOilConsumptionByEngineId } from '@/services/oil-consumption.service';
import { OilConsumptionData } from '@/types/oil-consumption.types';

/**
 * Custom Hook สำหรับจัดการข้อมูล Oil Consumption
 * รวมถึงการดึงข้อมูล, รีเฟรช และจัดการ state
 */
export const useOilConsumptionData = (engineId?: string) => {
  const [oilConsumptionsData, setOilConsumptionsData] = useState<OilConsumptionData[]>([]);
  const [loading, setLoading] = useState(true);

  // ฟังก์ชันดึงข้อมูล Oil Consumption
  const fetchOilConsumptions = async () => {
    try {
      setLoading(true);
      let response;
      
      if (engineId) {
        // ดึงข้อมูลตาม Engine ID
        response = await getOilConsumptionByEngineId(engineId);
      } else {
              // ดึงข้อมูลทั้งหมด
      response = await getOilConsumptions();
    }
    
    setOilConsumptionsData(response.data);
    } catch (error) {
      console.error('Error fetching oil consumptions:', error);
      toast.error('Failed to load oil consumption data.');
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันรีเฟรชข้อมูล
  const refreshData = async () => {
    try {
      setLoading(true);
      let response;
      
      if (engineId) {
        response = await getOilConsumptionByEngineId(engineId);
      } else {
        response = await getOilConsumptions();
      }
      
      setOilConsumptionsData(response.data);
    } catch (error) {
      console.error('Error refreshing oil consumptions:', error);
      toast.error('Failed to refresh oil consumption data.');
    } finally {
      setLoading(false);
    }
  };

  // โหลดข้อมูลครั้งแรกเมื่อ component mount
  useEffect(() => {
    fetchOilConsumptions();
  }, [engineId]);

  return {
    oilConsumptionsData,
    loading,
    refreshData,
    fetchOilConsumptions,
  };
}; 