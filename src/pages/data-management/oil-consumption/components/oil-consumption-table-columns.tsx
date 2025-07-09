import { ColumnDef } from '@tanstack/react-table';
import { OilConsumptionData } from '@/types/oil-consumption.types';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import {
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from '@/components/ui/data-grid-table';
import { OilConsumptionActionsCell } from './oil-consumption-actions-cell';

interface CreateOilConsumptionColumnsParams {
  onRefresh: () => void;
  onEdit: (oilConsumption: OilConsumptionData) => void;
  onView: (oilConsumption: OilConsumptionData) => void;
}

/**
 * ฟังก์ชันสร้าง column definitions สำหรับตาราง Oil Consumption
 * รวมการจัดการ actions ต่างๆ เช่น refresh, edit, view
 */
export const createOilConsumptionColumns = ({
  onRefresh,
  onEdit,
  onView,
}: CreateOilConsumptionColumnsParams): ColumnDef<OilConsumptionData>[] => [
  {
    accessorKey: 'id',
    accessorFn: (row) => row.id,
    header: () => <DataGridTableRowSelectAll />,
    cell: ({ row }) => <DataGridTableRowSelect row={row} />,
    enableSorting: false,
    enableHiding: false,
    enableResizing: false,
    size: 51,
    meta: {
      cellClassName: '',
    },
  },
  {
    id: 'engine',
    accessorFn: (row) => row.engine?.serial_number,
    header: ({ column }) => (
      <DataGridColumnHeader title="Engine" column={column} />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col gap-0.5">
        <button
          onClick={() => onView(row.original)}
          className="text-sm font-medium text-mono hover:text-primary-active mb-px text-left cursor-pointer underline-offset-4 hover:underline"
        >
          {row.original.engine?.serial_number || 'N/A'}
        </button>
        <span className="text-xs text-secondary-foreground font-normal">
          {row.original.engine?.aircraft?.registration || 'N/A'}
        </span>
      </div>
    ),
    enableSorting: true,
    size: 180,
    meta: {
      headerClassName: '',
    },
  },
  {
    id: 'date',
    accessorFn: (row) => row.date,
    header: ({ column }) => (
      <DataGridColumnHeader title="Date" column={column} />
    ),
    cell: ({ row }) => (
      <span className="text-foreground font-normal">
        {new Date(row.original.date).toLocaleDateString('th-TH', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </span>
    ),
    enableSorting: true,
    size: 120,
    meta: {
      headerClassName: '',
    },
  },
  {
    id: 'flight_hours',
    accessorFn: (row) => row.flight_hours,
    header: ({ column }) => (
      <DataGridColumnHeader title="Flight Hours" column={column} />
    ),
    cell: ({ row }) => (
      <span className="text-foreground font-normal">
        {row.original.flight_hours.toFixed(1)} hrs
      </span>
    ),
    enableSorting: true,
    size: 120,
    meta: {
      headerClassName: '',
    },
  },
  {
    id: 'oil_added',
    accessorFn: (row) => row.oil_added,
    header: ({ column }) => (
      <DataGridColumnHeader title="Oil Added" column={column} />
    ),
    cell: ({ row }) => (
      <span className="text-foreground font-normal">
        {row.original.oil_added.toFixed(1)} L
      </span>
    ),
    enableSorting: true,
    size: 120,
    meta: {
      headerClassName: '',
    },
  },
  {
    id: 'oil_rate',
    accessorFn: (row) => row.flight_hours > 0 ? row.oil_added / row.flight_hours : 0,
    header: ({ column }) => (
      <DataGridColumnHeader title="Oil Rate" column={column} />
    ),
    cell: ({ row }) => {
      const rate = row.original.flight_hours > 0 
        ? row.original.oil_added / row.original.flight_hours 
        : 0;
      return (
        <span className="text-foreground font-normal">
          {rate.toFixed(2)} L/hr
        </span>
      );
    },
    enableSorting: true,
    size: 120,
    meta: {
      headerClassName: '',
    },
  },
  {
    id: 'remarks',
    accessorFn: (row) => row.remarks,
    header: ({ column }) => (
      <DataGridColumnHeader title="Remarks" column={column} />
    ),
    cell: ({ row }) => (
      <span className="text-foreground font-normal max-w-[200px] truncate block">
        {row.original.remarks || '-'}
      </span>
    ),
    enableSorting: true,
    size: 200,
    meta: {
      headerClassName: '',
    },
  },
  {
    id: 'created_at',
    accessorFn: (row) => row.created_at,
    header: ({ column }) => (
      <DataGridColumnHeader title="Created At" column={column} />
    ),
    cell: ({ row }) => (
      <span className="text-foreground font-normal">
        {new Date(row.original.created_at).toLocaleDateString('th-TH', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </span>
    ),
    enableSorting: true,
    size: 150,
    meta: {
      headerClassName: '',
    },
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <OilConsumptionActionsCell
        row={row}
        onRefresh={onRefresh}
        onEdit={onEdit}
      />
    ),
    enableSorting: false,
    size: 60,
    meta: {
      headerClassName: '',
    },
  },
]; 