import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { OilConsumptionTable } from './components';

/**
 * คอมโพเนนต์เนื้อหาหลักของหน้า Oil Consumption
 * รับ query parameter engineId สำหรับกรองข้อมูลตาม Engine
 */
export function OilConsumptionContent() {
  const [searchParams] = useSearchParams();

  // ดึง engineId จาก query parameter
  const engineId = useMemo(() => {
    const id = searchParams.get('engineId');
    return id || undefined;
  }, [searchParams]);

  return (
    <div className="grid gap-5 lg:gap-7.5" data-testid="oil-consumption-content">
      <OilConsumptionTable engineId={engineId} />
      {/* Other content */}
    </div>
  );
} 