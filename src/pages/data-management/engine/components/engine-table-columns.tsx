import { ColumnDef } from '@tanstack/react-table';
import { EngineData } from '@/types/engine.types';
import { Badge, BadgeDot } from '@/components/ui/badge';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import {
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from '@/components/ui/data-grid-table';
import { EngineActionsCell } from './engine-actions-cell';

interface CreateEngineColumnsParams {
  onRefresh: () => void;
  onEdit: (engine: EngineData) => void;
  onView: (engine: EngineData) => void;
  onViewOilConsumption?: (engine: EngineData) => void;
}

/**
 * ฟังก์ชันสร้าง column definitions สำหรับตาราง Engine
 * รวมการจัดการ actions ต่างๆ เช่น refresh, edit, view, oil consumption
 */
export const createEngineColumns = ({
  onRefresh,
  onEdit,
  onView,
  onViewOilConsumption,
}: CreateEngineColumnsParams): ColumnDef<EngineData>[] => [
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
    id: 'serial_number',
    accessorFn: (row) => row.serial_number,
    header: ({ column }) => (
      <DataGridColumnHeader title="Serial Number" column={column} />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col gap-0.5">
        <button
          onClick={() => onView(row.original)}
          className="text-sm font-medium text-mono hover:text-primary-active mb-px text-left cursor-pointer underline-offset-4 hover:underline"
        >
          {row.original.serial_number}
        </button>
        <span className="text-xs text-secondary-foreground font-normal">
          ID: {row.original.id}
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
    id: 'model',
    accessorFn: (row) => row.model,
    header: ({ column }) => (
      <DataGridColumnHeader title="Model" column={column} />
    ),
    cell: ({ row }) => (
      <span className="text-foreground font-normal">
        {row.original.model}
      </span>
    ),
    enableSorting: true,
    size: 180,
    meta: {
      headerClassName: '',
    },
  },
  {
    id: 'aircraft',
    accessorFn: (row) => row.aircraft?.registration,
    header: ({ column }) => (
      <DataGridColumnHeader title="Aircraft" column={column} />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-foreground">
          {row.original.aircraft?.registration || 'N/A'}
        </span>
        <span className="text-xs text-secondary-foreground font-normal">
          {row.original.aircraft?.aircraft_type || 'N/A'}
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
    id: 'position',
    accessorFn: (row) => row.position,
    header: ({ column }) => (
      <DataGridColumnHeader title="Position" column={column} />
    ),
    cell: ({ row }) => (
      <span className="text-foreground font-normal">
        {row.original.position}
      </span>
    ),
    enableSorting: true,
    size: 100,
    meta: {
      headerClassName: '',
    },
  },
  {
    id: 'low_oil_threshold_hours',
    accessorFn: (row) => row.low_oil_threshold_hours,
    header: ({ column }) => (
      <DataGridColumnHeader title="Oil Threshold" column={column} />
    ),
    cell: ({ row }) => (
      <span className="text-foreground font-normal">
        {row.original.low_oil_threshold_hours ? 
          `${row.original.low_oil_threshold_hours} hrs` : 
          'N/A'
        }
      </span>
    ),
    enableSorting: true,
    size: 140,
    meta: {
      headerClassName: '',
    },
  },
  {
    id: 'status',
    accessorFn: (row) => row.active,
    header: ({ column }) => (
      <DataGridColumnHeader title="Status" column={column} />
    ),
    cell: ({ row }) => (
      <Badge
        size="lg"
        variant={row.original.active ? 'success' : 'destructive'}
        appearance="outline"
        shape="circle"
      >
        <BadgeDot
          className={row.original.active ? 'success' : 'destructive'}
        />
        {row.original.active ? 'Active' : 'Inactive'}
      </Badge>
    ),
    enableSorting: true,
    size: 120,
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
      <EngineActionsCell
        row={row}
        onRefresh={onRefresh}
        onEdit={onEdit}
        onViewOilConsumption={onViewOilConsumption}
      />
    ),
    enableSorting: false,
    size: 60,
    meta: {
      headerClassName: '',
    },
  },
]; 