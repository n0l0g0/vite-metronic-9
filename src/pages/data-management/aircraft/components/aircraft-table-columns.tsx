import { ColumnDef } from '@tanstack/react-table';
import { AircraftData } from '@/types/aircraft.types';
import { Badge, BadgeDot } from '@/components/ui/badge';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import {
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from '@/components/ui/data-grid-table';
import { AircraftActionsCell } from './aircraft-actions-cell';

interface CreateAircraftColumnsParams {
  onRefresh: () => void;
  onEdit: (aircraft: AircraftData) => void;
  onView: (aircraft: AircraftData) => void;
}

/**
 * ฟังก์ชันสร้าง column definitions สำหรับตาราง Aircraft
 * รวมการจัดการ actions ต่างๆ เช่น refresh, edit, view
 */
export const createAircraftColumns = ({
  onRefresh,
  onEdit,
  onView,
}: CreateAircraftColumnsParams): ColumnDef<AircraftData>[] => [
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
    id: 'registration',
    accessorFn: (row) => row.registration,
    header: ({ column }) => (
      <DataGridColumnHeader title="Registration" column={column} />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col gap-0.5">
        <button
          onClick={() => onView(row.original)}
          className="text-sm font-medium text-mono hover:text-primary-active mb-px text-left cursor-pointer underline-offset-4 hover:underline"
        >
          {row.original.registration}
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
    id: 'aircraft_type',
    accessorFn: (row) => row.aircraft_type,
    header: ({ column }) => (
      <DataGridColumnHeader title="Aircraft Type" column={column} />
    ),
    cell: ({ row }) => (
      <span className="text-foreground font-normal">
        {row.original.aircraft_type}
      </span>
    ),
    enableSorting: true,
    size: 200,
    meta: {
      headerClassName: '',
    },
  },
  {
    id: 'engine_type',
    accessorFn: (row) => row.engine_type,
    header: ({ column }) => (
      <DataGridColumnHeader title="Engine Type" column={column} />
    ),
    cell: ({ row }) => (
      <span className="text-foreground font-normal">
        {row.original.engine_type}
      </span>
    ),
    enableSorting: true,
    size: 180,
    meta: {
      headerClassName: '',
    },
  },
  {
    id: 'engine_qty',
    accessorFn: (row) => row.engine_qty,
    header: ({ column }) => (
      <DataGridColumnHeader title="Engine Qty" column={column} />
    ),
    cell: ({ row }) => (
      <span className="text-foreground font-normal">
        {row.original.engine_qty}
      </span>
    ),
    enableSorting: true,
    size: 120,
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
      <AircraftActionsCell
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