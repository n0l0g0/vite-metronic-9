import { EngineData } from './engine.types';
// ส่วนของ Interface สำหรับข้อมูล Oil Consumption
export interface OilConsumptionData {
  id: string;
  date: string;
  flight_hours: number;
  oil_added: number;
  remarks: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  engine_id: string;
  engine?: EngineData;
}

// ส่วนของ Interface สำหรับส่งข้อมูล Oil Consumption
export interface OilConsumptionPayload {
  engine_id: string;
  date: string;
  flight_hours: number;
  oil_added: number;
  remarks: string;
}

// ส่วนของ Interface สำหรับรับข้อมูล Oil Consumption
export interface OilConsumptionResponse {
  data: OilConsumptionData[];
} 