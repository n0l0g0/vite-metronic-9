import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import { RiCheckboxCircleFill } from '@remixicon/react';
import { Row } from '@tanstack/react-table';
import { EllipsisVertical, Fuel } from 'lucide-react';
import { toast } from 'sonner';
import { EngineData } from '@/types/engine.types';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { deleteEngine } from '@/services/engine.service';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface EngineActionsCellProps {
  row: Row<EngineData>;
  onRefresh: () => void;
  onEdit: (engine: EngineData) => void;
  onViewOilConsumption?: (engine: EngineData) => void;
}

/**
 * คอมโพเนนต์สำหรับแสดง Actions ในแต่ละแถวของตาราง Engine
 * รวมถึงการแก้ไข, คัดลอก ID, ดู Oil Consumption และลบข้อมูล
 */
export const EngineActionsCell = ({
  row,
  onRefresh,
  onEdit,
  onViewOilConsumption,
}: EngineActionsCellProps) => {
  const { copyToClipboard } = useCopyToClipboard();

  // ฟังก์ชันคัดลอก ID เครื่องยนต์
  const handleCopyId = () => {
    copyToClipboard(String(row.original.id));
    const message = `Engine ID successfully copied: ${row.original.id}`;
    toast.custom(
      (t) => (
        <Alert
          variant="mono"
          icon="success"
          close={false}
          onClose={() => toast.dismiss(t)}
        >
          <AlertIcon>
            <RiCheckboxCircleFill />
          </AlertIcon>
          <AlertTitle>{message}</AlertTitle>
        </Alert>
      ),
      {
        position: 'top-center',
      },
    );
  };

  // ฟังก์ชันแก้ไขเครื่องยนต์
  const handleEdit = () => {
    onEdit(row.original);
  };

  // ฟังก์ชันดู Oil Consumption สำหรับเครื่องยนต์นี้
  const handleViewOilConsumption = () => {
    onViewOilConsumption?.(row.original);
  };

  // ฟังก์ชันลบเครื่องยนต์
  const handleDelete = async () => {
    try {
      await deleteEngine(row.original.id);
      toast.custom(
        (t) => (
          <Alert
            variant="mono"
            icon="success"
            close={false}
            onClose={() => toast.dismiss(t)}
          >
            <AlertIcon>
              <RiCheckboxCircleFill />
            </AlertIcon>
            <AlertTitle>Engine deleted successfully</AlertTitle>
          </Alert>
        ),
        {
          position: 'top-center',
        },
      );
      // รีเฟรชข้อมูลหลังจากลบ
      onRefresh();
    } catch (error) {
      toast.custom(
        (t) => (
          <Alert
            variant="destructive"
            icon="warning"
            close={false}
            onClose={() => toast.dismiss(t)}
          >
            <AlertIcon>
              <RiCheckboxCircleFill />
            </AlertIcon>
            <AlertTitle>Failed to delete engine</AlertTitle>
          </Alert>
        ),
        {
          position: 'top-center',
        },
      );
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-7" mode="icon" variant="ghost">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyId}>Copy ID</DropdownMenuItem>
        {onViewOilConsumption && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleViewOilConsumption}>
              <Fuel className="size-4 mr-2" />
              Oil Consumption
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleDelete}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
