import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import { RiCheckboxCircleFill } from '@remixicon/react';
import { Row } from '@tanstack/react-table';
import { EllipsisVertical } from 'lucide-react';
import { toast } from 'sonner';
import { AircraftData } from '@/types/aircraft.types';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { deleteAircraft } from '@/services/aircraft.service';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AircraftActionsCellProps {
  row: Row<AircraftData>;
  onRefresh: () => void;
  onEdit: (aircraft: AircraftData) => void;
}

/**
 * คอมโพเนนต์สำหรับแสดง Actions ในแต่ละแถวของตาราง Aircraft
 * รวมถึงการแก้ไข, คัดลอก ID และลบข้อมูล
 */
export const AircraftActionsCell = ({
  row,
  onRefresh,
  onEdit,
}: AircraftActionsCellProps) => {
  const { copyToClipboard } = useCopyToClipboard();

  // ฟังก์ชันคัดลอก ID เครื่องบิน
  const handleCopyId = () => {
    copyToClipboard(String(row.original.id));
    const message = `Aircraft ID successfully copied: ${row.original.id}`;
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

  // ฟังก์ชันแก้ไขเครื่องบิน
  const handleEdit = () => {
    onEdit(row.original);
  };

  // ฟังก์ชันลบเครื่องบิน
  const handleDelete = async () => {
    try {
      await deleteAircraft(row.original.id);
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
            <AlertTitle>Aircraft deleted successfully</AlertTitle>
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
            <AlertTitle>Failed to delete aircraft</AlertTitle>
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
