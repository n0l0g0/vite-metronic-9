import { http, HttpResponse } from 'msw';
import { AircraftData } from '@/services/aircraft.service';
import { API_BASE_URL } from '@/services/api'; // Import baseURL

const mockAircraftData: AircraftData[] = [
  {
    id: '1',
    registration: 'HS-ABC',
    aircraft_type: 'Boeing 737',
    engine_type: 'CFM56',
    engine_qty: 2,
    active: true,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  },
];

/**
 * Handlers สำหรับ Mock API responses
 * ใช้ API_BASE_URL เดียวกันกับการ config จริง
 */
export const handlers = [
  // Mock GET /api/aircraft - ใช้ baseURL จาก api.ts
  http.get(`${API_BASE_URL}/api/aircraft`, () => {
    console.log(`MSW: Intercepted GET ${API_BASE_URL}/api/aircraft`);
    return HttpResponse.json(mockAircraftData);
  }),

  // Mock GET /api/aircraft/:id
  http.get(`${API_BASE_URL}/api/aircraft/:id`, ({ params }) => {
    console.log(`MSW: Intercepted GET ${API_BASE_URL}/api/aircraft/:id`, params);
    const { id } = params;
    const aircraft = mockAircraftData.find(a => a.id === id);
    
    if (!aircraft) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(aircraft);
  }),

  // Mock POST /api/aircraft
  http.post(`${API_BASE_URL}/api/aircraft`, async ({ request }) => {
    console.log(`MSW: Intercepted POST ${API_BASE_URL}/api/aircraft`);
    const newAircraft = await request.json() as Omit<AircraftData, 'id' | 'created_at' | 'updated_at'>;
    
    const aircraftWithId: AircraftData = {
      ...newAircraft,
      id: '999',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    return HttpResponse.json(aircraftWithId, { status: 201 });
  }),

  // Mock PATCH /api/aircraft/:id
  http.patch(`${API_BASE_URL}/api/aircraft/:id`, async ({ params, request }) => {
    console.log(`MSW: Intercepted PATCH ${API_BASE_URL}/api/aircraft/:id`, params);
    const { id } = params;
    const updateData = await request.json() as Partial<AircraftData>;
    
    const aircraft = mockAircraftData.find(a => a.id === id);
    if (!aircraft) {
      return new HttpResponse(null, { status: 404 });
    }
    
    const updatedAircraft = { ...aircraft, ...updateData };
    return HttpResponse.json(updatedAircraft);
  }),

  // Mock DELETE /api/aircraft/:id
  http.delete(`${API_BASE_URL}/api/aircraft/:id`, ({ params }) => {
    console.log(`MSW: Intercepted DELETE ${API_BASE_URL}/api/aircraft/:id`, params);
    return new HttpResponse(null, { status: 204 });
  }),

  // Mock error endpoint สำหรับ testing
  http.get(`${API_BASE_URL}/api/aircraft/error`, () => {
    console.log('MSW: Intercepted error endpoint');
    return new HttpResponse(null, { status: 500 });
  }),
];
