import { useMemo, useState } from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  RowSelectionState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { AircraftData } from '@/types/aircraft.types';
import {
  Card,
  CardFooter,
  CardHeader,
  CardHeading,
  CardTable,
} from '@/components/ui/card';
import { DataGrid } from '@/components/ui/data-grid';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { DataGridTable } from '@/components/ui/data-grid-table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useAircraftData, useAircraftFilters } from '../hooks';
import {
  AddAircraftDialog,
  EditAircraftDialog,
} from './aircraft-dialog-manage';
import { ViewAircraftDialog } from './aircraft-dialog-view';
import { AircraftFilters } from './aircraft-filters';
import { createAircraftColumns } from './aircraft-table-columns';
import { AircraftTableToolbar } from './aircraft-table-toolbar';

// ส่วนของ Interface สำหรับข้อมูล Aircraft (ใช้จาก types)
type IAircraftData = AircraftData;

const AircraftTable = () => {
  // ใช้ custom hooks สำหรับจัดการข้อมูลและ filters
  const { aircraftsData, loading, refreshData } = useAircraftData();
  const filters = useAircraftFilters(aircraftsData);

  // State สำหรับการแสดงผลและ pagination
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'registration', desc: false },
  ]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // State สำหรับ Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingAircraft, setEditingAircraft] = useState<IAircraftData | null>(
    null,
  );
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewingAircraft, setViewingAircraft] = useState<IAircraftData | null>(
    null,
  );

  // ฟังก์ชันเปิด Modal เพิ่มเครื่องบินใหม่
  const handleAddAircraft = () => {
    setAddModalOpen(true);
  };

  // ฟังก์ชันเปิด Modal แก้ไขเครื่องบิน
  const handleEditAircraft = (aircraft: IAircraftData) => {
    setEditingAircraft(aircraft);
    setEditModalOpen(true);
  };

  // ฟังก์ชันเปิด Modal ดูข้อมูลเครื่องบิน
  const handleViewAircraft = (aircraft: IAircraftData) => {
    setViewingAircraft(aircraft);
    setViewModalOpen(true);
  };

  // กำหนดคอลัมน์สำหรับตาราง โดยใช้ function ที่แยกออกมา
  const columns = useMemo(
    () =>
      createAircraftColumns({
        onRefresh: refreshData,
        onEdit: handleEditAircraft,
        onView: handleViewAircraft,
      }),
    [refreshData, handleEditAircraft, handleViewAircraft],
  );

  // สร้างตาราง
  const table = useReactTable({
    columns,
    data: filters.filteredData,
    pageCount: Math.ceil(
      (filters.filteredData?.length || 0) / pagination.pageSize,
    ),
    getRowId: (row: IAircraftData) => String(row.id),
    state: {
      pagination,
      sorting,
      rowSelection,
    },
    columnResizeMode: 'onChange',
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // แสดง loading หากกำลังโหลดข้อมูล
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardHeading>
            <div className="flex items-center gap-2.5">
              <div className="text-lg font-medium">Aircraft Management</div>
            </div>
          </CardHeading>
        </CardHeader>
        <CardTable>
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">
                Loading aircraft data...
              </div>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          </div>
        </CardTable>
      </Card>
    );
  }

  return (
    <DataGrid
      table={table}
      recordCount={filters.filteredData?.length || 0}
      tableLayout={{
        columnsPinnable: true,
        columnsMovable: true,
        columnsVisibility: true,
        cellBorder: true,
      }}
    >
      <Card>
        <CardHeader>
          <CardHeading>
            <AircraftFilters
              searchQuery={filters.searchQuery}
              selectedStatuses={filters.selectedStatuses}
              selectedAircraftTypes={filters.selectedAircraftTypes}
              statusCounts={filters.statusCounts}
              aircraftTypeCounts={filters.aircraftTypeCounts}
              onSearchChange={filters.setSearchQuery}
              onStatusChange={filters.handleStatusChange}
              onAircraftTypeChange={filters.handleAircraftTypeChange}
              onClearSearch={filters.clearSearch}
            />
          </CardHeading>
          <AircraftTableToolbar onAddAircraft={handleAddAircraft} />
        </CardHeader>
        <CardTable>
          <ScrollArea>
            <DataGridTable />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardTable>
        <CardFooter>
          <DataGridPagination />
        </CardFooter>
      </Card>

      {/* Add Aircraft Modal */}
      <AddAircraftDialog
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onSuccess={refreshData}
      />

      {/* Edit Aircraft Modal */}
      {editingAircraft && (
        <EditAircraftDialog
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          onSuccess={refreshData}
          editData={editingAircraft}
        />
      )}

      {/* View Aircraft Modal */}
      {viewingAircraft && (
        <ViewAircraftDialog
          open={viewModalOpen}
          onOpenChange={setViewModalOpen}
          aircraftData={viewingAircraft}
        />
      )}
    </DataGrid>
  );
};

export { AircraftTable };
