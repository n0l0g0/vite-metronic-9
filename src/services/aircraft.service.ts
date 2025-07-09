import { api } from './api';
import { AircraftData, AircraftPayload } from '@/types/aircraft.types';

// Base URL สำหรับ Aircraft API endpoints
const baseUrl = '/api/aircraft';

// ดึงข้อมูล Aircraft ทั้งหมด
export const getAircrafts = () => api.get<AircraftData[]>(baseUrl);

// ดึงข้อมูล Aircraft ตาม ID
export const getAircraftById = (id: string) =>
  api.get<AircraftData>(`${baseUrl}/${id}`);

// อัปเดตข้อมูล Aircraft
export const patchAircraft = (id: string, aircraft: AircraftPayload) =>
  api.patch<AircraftData>(`${baseUrl}/${id}`, aircraft);

// สร้าง Aircraft ใหม่
export const postAircraft = (aircraft: AircraftPayload) =>
  api.post<AircraftData>(`${baseUrl}`, aircraft);

// ลบ Aircraft
export const deleteAircraft = (id: string) =>
  api.delete<void>(`${baseUrl}/${id}`);
