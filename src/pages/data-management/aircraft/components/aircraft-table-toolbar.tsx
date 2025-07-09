import { Plus, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardToolbar } from '@/components/ui/card';
import { DataGridColumnVisibility } from '@/components/ui/data-grid-column-visibility';
import { useDataGrid } from '@/components/ui/data-grid';

interface AircraftTableToolbarProps {
  onAddAircraft: () => void;
}

/**
 * คอมโพเนนต์ Toolbar สำหรับตาราง Aircraft
 * รวมถึงปุ่มเพิ่มเครื่องบินใหม่ และการจัดการคอลัมน์
 */
export const AircraftTableToolbar = ({
  onAddAircraft,
}: AircraftTableToolbarProps) => {
  const { table } = useDataGrid();

  return (
    <CardToolbar>
      <Button onClick={onAddAircraft}>
        <Plus size={16} />
        Add Aircraft
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