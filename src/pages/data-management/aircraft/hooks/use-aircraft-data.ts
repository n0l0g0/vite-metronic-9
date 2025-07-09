import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getAircrafts } from '@/services/aircraft.service';
import { AircraftData } from '@/types/aircraft.types';

/**
 * Custom Hook สำหรับจัดการข้อมูล Aircraft
 * รวมถึงการดึงข้อมูล, รีเฟรช และจัดการ state
 */
export const useAircraftData = () => {
  const [aircraftsData, setAircraftsData] = useState<AircraftData[]>([]);
  const [loading, setLoading] = useState(true);

  // ฟังก์ชันดึงข้อมูล Aircraft
  const fetchAircrafts = async () => {
    try {
      setLoading(true);
      const response = await getAircrafts();
      setAircraftsData(response.data);
    } catch (error) {
      console.error('Error fetching aircrafts:', error);
      toast.error('Failed to load aircraft data. Using mock data.');
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันรีเฟรชข้อมูล
  const refreshData = async () => {
    try {
      setLoading(true);
      const response = await getAircrafts();
      setAircraftsData(response.data);
    } catch (error) {
      console.error('Error refreshing aircrafts:', error);
      toast.error('Failed to refresh aircraft data.');
    } finally {
      setLoading(false);
    }
  };

  // โหลดข้อมูลครั้งแรกเมื่อ component mount
  useEffect(() => {
    fetchAircrafts();
  }, []);

  return {
    aircraftsData,
    loading,
    refreshData,
    fetchAircrafts,
  };
};