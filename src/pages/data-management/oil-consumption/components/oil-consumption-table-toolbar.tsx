import { Plus, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardToolbar } from '@/components/ui/card';
import { DataGridColumnVisibility } from '@/components/ui/data-grid-column-visibility';
import { useDataGrid } from '@/components/ui/data-grid';

interface OilConsumptionTableToolbarProps {
  onAddOilConsumption: () => void;
}

/**
 * คอมโพเนนต์ Toolbar สำหรับตาราง Oil Consumption
 * รวมถึงปุ่มเพิ่ม Oil Consumption ใหม่ และการจัดการคอลัมน์
 */
export const OilConsumptionTableToolbar = ({
  onAddOilConsumption,
}: OilConsumptionTableToolbarProps) => {
  const { table } = useDataGrid();

  return (
    <CardToolbar>
      <Button onClick={onAddOilConsumption}>
        <Plus size={16} />
        Add Oil Consumption
      </Button>
      <DataGridColumnVisibility
        table={table}
        trigger={
          <Button variant="outline">
            <Settings2 />
            Columns
          </Button>
        }
      />
    </CardToolbar>
  );
}; 