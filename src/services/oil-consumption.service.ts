import { api } from './api';
import { 
  OilConsumptionData, 
  OilConsumptionPayload, 
} from '@/types/oil-consumption.types';

const baseUrl = '/api/oil-consumptions';

/**
 * ดึงข้อมูล Oil Consumption ทั้งหมด
 */
export const getOilConsumptions = () => 
  api.get<OilConsumptionData[]>(`${baseUrl}`);

/**
 * ดึงข้อมูล Oil Consumption ตาม Engine ID
 */
export const getOilConsumptionByEngineId = (engineId: string) =>
  api.get<OilConsumptionData[]>(`${baseUrl}/engine/${engineId}`);

/**
 * ดึงข้อมูล Oil Consumption ตาม ID
 */
export const getOilConsumptionById = (id: string) =>
  api.get<OilConsumptionData>(`${baseUrl}/${id}`);

/**
 * สร้าง Oil Consumption ใหม่
 */
export const postOilConsumption = (consumption: OilConsumptionPayload) =>
  api.post<OilConsumptionData>(`${baseUrl}`, consumption);

/**
 * อัปเดต Oil Consumption
 */
export const patchOilConsumption = (
  id: string, 
  consumption: OilConsumptionPayload
) => api.patch<OilConsumptionData>(`${baseUrl}/${id}`, consumption);

/**
 * ลบ Oil Consumption
 */
export const deleteOilConsumption = (id: string) =>
  api.delete<OilConsumptionData>(`${baseUrl}/${id}`); 