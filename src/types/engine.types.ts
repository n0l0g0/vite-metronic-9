// ส่วนของ Interface สำหรับข้อมูล Engine
export interface EngineData {
  id: string;
  aircraft_id: string;
  engine_type_id?: string | null;
  position: string | number;
  serial_number: string;
  model: string;
  install_date?: string;
  low_oil_threshold_hours: number | null;
  active: boolean;
  created_at: string;
  updated_at: string;
  aircraft?: {
    id: string;
    registration: string;
    aircraft_type: string;
    engine_type: string;
    engine_qty: number;
  };
}

// ส่วนของ Interface สำหรับส่งข้อมูล Engine
export interface EnginePayload {
  serial_number: string;
  model: string;
  position: string | number;
  aircraft_id: string;
  low_oil_threshold_hours: number | null;
  active: boolean;
} 