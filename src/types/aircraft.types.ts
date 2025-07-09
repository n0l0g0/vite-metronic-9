// ส่วนของ Interface สำหรับข้อมูล Aircraft
export interface AircraftData {
  id: string;
  registration: string;
  aircraft_type: string;
  engine_type: string;
  engine_qty: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

// ส่วนของ Interface สำหรับส่งข้อมูล Aircraft
export interface AircraftPayload {
  registration: string;
  aircraft_type: string;
  engine_type: string;
  engine_qty: number;
  active: boolean;
}