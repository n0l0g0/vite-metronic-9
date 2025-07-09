import { Plus, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardToolbar } from '@/components/ui/card';
import { DataGridColumnVisibility } from '@/components/ui/data-grid-column-visibility';
import { useDataGrid } from '@/components/ui/data-grid';

interface EngineTableToolbarProps {
  onAddEngine: () => void;
}

/**
 * คอมโพเนนต์ Toolbar สำหรับตาราง Engine
 * รวมถึงปุ่มเพิ่มเครื่องยนต์ใหม่ และการจัดการคอลัมน์
 */
export const EngineTableToolbar = ({
  onAddEngine,
}: EngineTableToolbarProps) => {
  const { table } = useDataGrid();

  return (
    <CardToolbar>
      <Button onClick={onAddEngine}>
        <Plus size={16} />
        Add Engine
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