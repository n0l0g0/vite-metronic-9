/**
 * Cookie Utilities
 * ฟังก์ชันสำหรับจัดการ cookies ใน browser
 */

/**
 * ฟังก์ชันสำหรับดึงค่า cookie จากชื่อ
 * @param name - ชื่อของ cookie ที่ต้องการดึง
 * @returns ค่าของ cookie หรือ null หากไม่พบ
 */
export const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
};

/**
 * ฟังก์ชันสำหรับตั้งค่า cookie (สำหรับ client-side ที่ไม่ใช่ HttpOnly)
 * @param name - ชื่อของ cookie
 * @param value - ค่าของ cookie
 * @param days - จำนวนวันที่ cookie จะหมดอายุ
 */
export const setCookie = (name: string, value: string, days?: number): void => {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/';
};

/**
 * ฟังก์ชันสำหรับลบ cookie
 * @param name - ชื่อของ cookie ที่ต้องการลบ
 */
export const deleteCookie = (name: string): void => {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

/**
 * ฟังก์ชันสำหรับตรวจสอบว่า cookie มีอยู่หรือไม่
 * @param name - ชื่อของ cookie ที่ต้องการตรวจสอบ
 * @returns true หาก cookie มีอยู่, false หากไม่มี
 */
export const hasCookie = (name: string): boolean => {
  return getCookie(name) !== null;
};

/**
 * ฟังก์ชันสำหรับตรวจสอบว่ามี auth token หรือไม่
 * หมายเหตุ: HttpOnly cookies ไม่สามารถเข้าถึงได้จาก JavaScript
 * ฟังก์ชันนี้จะใช้สำหรับการตรวจสอบ cookies อื่นๆ ที่ไม่ใช่ HttpOnly
 * @returns true หาก cookie มีอยู่ (แต่ไม่สามารถตรวจสอบ HttpOnly cookie ได้)
 */
export const hasAuthToken = (): boolean => {
  // หมายเหตุ: auth_token เป็น HttpOnly cookie จึงไม่สามารถเข้าถึงได้จาก JavaScript
  // ฟังก์ชันนี้จะ return true เสมอ เพราะการตรวจสอบจริงจะทำที่ server
  return true;
};

/**
 * ฟังก์ชันสำหรับส่ง request ที่มี cookies แนบไปด้วย
 * ใช้กับ fetch API เพื่อให้ cookies ถูกส่งไปยัง server อัตโนมัติ
 */
export const getRequestConfigWithCredentials = () => ({
  credentials: 'include' as RequestCredentials
}); 