import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import { RiCheckboxCircleFill } from '@remixicon/react';
import { Row } from '@tanstack/react-table';
import { EllipsisVertical } from 'lucide-react';
import { toast } from 'sonner';
import { OilConsumptionData } from '@/types/oil-consumption.types';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { deleteOilConsumption } from '@/services/oil-consumption.service';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface OilConsumptionActionsCellProps {
  row: Row<OilConsumptionData>;
  onRefresh: () => void;
  onEdit: (oilConsumption: OilConsumptionData) => void;
}

/**
 * คอมโพเนนต์สำหรับแสดง Actions ในแต่ละแถวของตาราง Oil Consumption
 * รวมถึงการแก้ไข, คัดลอก ID และลบข้อมูล
 */
export const OilConsumptionActionsCell = ({
  row,
  onRefresh,
  onEdit,
}: OilConsumptionActionsCellProps) => {
  const { copyToClipboard } = useCopyToClipboard();

  // ฟังก์ชันคัดลอก ID
  const handleCopyId = () => {
    copyToClipboard(String(row.original.id));
    const message = `Oil Consumption ID successfully copied: ${row.original.id}`;
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

  // ฟังก์ชันแก้ไข Oil Consumption
  const handleEdit = () => {
    onEdit(row.original);
  };

  // ฟังก์ชันลบ Oil Consumption
  const handleDelete = async () => {
    try {
      await deleteOilConsumption(row.original.id);
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
            <AlertTitle>Oil consumption deleted successfully</AlertTitle>
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
            <AlertTitle>Failed to delete oil consumption</AlertTitle>
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
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleDelete}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}; 