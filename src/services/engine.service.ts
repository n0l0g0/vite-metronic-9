import { EngineData, EnginePayload } from '@/types/engine.types';
import { api } from './api';

// Base URL สำหรับ Engine API endpoints
const baseUrl = '/api/engine';

// ดึงข้อมูล Engine ทั้งหมด
export const getEngines = () => api.get<EngineData[]>(baseUrl);

// ดึงข้อมูล Engine ตาม ID
export const getEngineById = (id: string) =>
  api.get<EngineData>(`${baseUrl}/${id}`);

// สร้าง Engine ใหม่
export const postEngine = (engine: EnginePayload) =>
  api.post<EngineData>(baseUrl, engine);

// อัปเดตข้อมูล Engine
export const patchEngine = (id: string, engine: EnginePayload) =>
  api.patch<EngineData>(`${baseUrl}/${id}`, engine);

// ลบ Engine
export const deleteEngine = (id: string) =>
  api.delete<void>(`${baseUrl}/${id}`);
